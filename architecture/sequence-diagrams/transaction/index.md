# Transaction Flow

Complete sequence from the moment the user sends tokens to the moment the transfer is finalized.

← [Back to Sequence Diagrams](../)

## Overview

A token transfer goes through four phases:

1. **Check and reserve** - Validate the input and set the amount aside
2. **Signing** - Build the Rholang term and sign the deploy
3. **Submission** - Send the signed deploy to the validator
4. **Confirmation** - Poll the node until the deploy is finalized

A transfer is a deploy of a Rholang term that moves tokens between two vaults. Deploying a contract from the Deploy page uses the same phases with a different term.

The wallet calls the SDK `Client`, and the SDK talks to the nodes behind `ValidatorURL` and `ReadOnlyURL`, see [Wallet Architecture](../../component-diagrams/wallet/#network-connections).

## Phase 1: Check and Reserve

```mermaid
sequenceDiagram
    participant U as User
    participant W as Wallet
    participant SDK as SDK Client
    participant RN as Read-only node

    U->>W: Enter recipient and amount
    W->>SDK: transfer(account, recipient, amount)
    opt Session is locked or the policy asks for a password on every signature
        SDK-->>W: Password required
        W->>U: Request password
        U->>W: Provide password
    end
    SDK->>SDK: pending = amount + maximum fee
    SDK->>RN: Query balance (explore-deploy)
    RN-->>SDK: Balance
    SDK->>SDK: Balance minus reserved funds covers pending?
```

| Step | Description |
|------|-------------|
| User input | Recipient address and amount. The wallet does not send to `0x...` addresses |
| Password | Needed only while the signing session is closed. By default a session stays open for 15 minutes after unlocking |
| Reserve | The amount held for the transfer is `amount + GasFee.MAX`, where `GasFee.MAX` is 250000 atomic units (0.0025 ASI) |
| Balance check | The SDK reads the balance as described in [Balance Query](../balance/). If it does not cover the reserve, the transfer stops with an error before anything is signed |

The private key is not kept in the Redux store. The SDK decrypts it only while the signing session is open.

## Phase 2: Signing

```mermaid
sequenceDiagram
    participant SDK as SDK Client
    participant RN as Read-only node

    SDK->>SDK: Validate the recipient address and the amount
    SDK->>SDK: Build the transfer term for the node profile
    SDK->>RN: GET /api/blocks
    RN-->>SDK: Latest block number
    SDK->>SDK: validAfterBlockNumber = latest - 1
    SDK->>SDK: Serialize the deploy fields
    SDK->>SDK: Hash with blake2b and sign with secp256k1
```

| Field | Value |
|-------|-------|
| `term` | Rholang term that transfers `amount` from the account to the recipient. Scala nodes use `rho:rchain:asiVault`, Rust nodes use `rho:vault:system` |
| `timestamp` | Current time in milliseconds |
| `phloPrice` | 1 |
| `phloLimit` | 500000 |
| `validAfterBlockNumber` | Number of the latest block minus 1 |
| `shardId` | `root` |

The result is a signed deploy: the serialized data, the public key of the deployer, the signature in hex and the algorithm `secp256k1`. If the node cannot return the latest block number, signing fails with `Invalid block number`.

## Phase 3: Submission

```mermaid
sequenceDiagram
    participant SDK as SDK Client
    participant ST as Local storage (IndexedDB)
    participant VN as Validator node

    SDK->>ST: Save the reservation
    SDK->>VN: POST /api/deploy
    VN->>VN: Check the signature, the price and the term
    VN-->>SDK: Deploy ID
    Note over SDK: The wallet uses the signature as the deploy ID
```

| Step | Description |
|------|-------------|
| Save reservation | The reservation is written to the browser storage before the request, so the amount stays held even if the page closes |
| Submit | `POST /api/deploy` with the signed deploy |
| Validate | The node checks the signature algorithm, the phlo price against its minimum price and the term |
| Deploy ID | The node returns the signature of the deploy in hex. The wallet tracks the transfer by it |

If the node refuses the deploy with a 4xx answer, the reservation is released. If the outcome is unknown, for example because of a network error, the reservation stays, because the deploy may still reach the network.

The validator answers `400` for a malformed request or a bad term and `409` for a duplicate deploy. Other failures come back as `422`, `500` or `502`.

## Phase 4: Confirmation

```mermaid
sequenceDiagram
    participant W as Wallet
    participant SDK as SDK Client
    participant RN as Read-only node

    loop Every 5 seconds, up to 180 seconds
        SDK->>RN: GET /api/deploy/{id}
        RN-->>SDK: Deploy info or error
    end
    SDK-->>W: Finalized, error or timeout
    W->>W: Refresh balance and history
```

The SDK maps every answer to a status.

| Status | Meaning |
|--------|---------|
| `Deploying` | The node does not report a block for the deploy yet |
| `IncludedInBlock` | The deploy is in a block that is not finalized |
| `Finalized` | The block is finalized. The transfer is confirmed |
| `CheckingError` | The request failed. Polling goes on |

If the deploy is not finalized within 180 seconds, the watch ends with `DeployTimeoutError`. When it ends, the wallet invalidates the cached balance and history.

For a Scala node the SDK reads the `faultTolerance` field of the answer and treats the deploy as finalized at 0.99 or above. For a Rust node the SDK expects the same field with a threshold of 0.33.

::: warning Finalization on Rust nodes
The answer of a Rust node to `GET /api/deploy/{id}` has no `faultTolerance` field. It reports `isFinalized` and `finalizationState` instead. Wallet SDK 2.1.0 with the `rust` profile therefore keeps the status at `IncludedInBlock` for a deploy that the node already reports as `Finalized`, and the watch ends with `DeployTimeoutError`. Before the deploy is in any finalized block, a Rust node answers `404 deploy_not_found`, which the SDK reports as `CheckingError`.
:::

## Errors

| Error | When |
|-------|------|
| `BalanceUnavailableError` | The balance could not be read in phase 1 |
| `DeploySubmissionRejectedError` | The validator refused the deploy with a 4xx answer. The reservation is released |
| `ApiRequestError` | A request to a node failed |
| `DeployTimeoutError` | The deploy was not finalized within the watch time |

## Deploying a Contract

The Deploy page follows the same four phases. It differs in two places. The term is the user's Rholang code, and the reserved amount is `phloLimit * phloPrice`. The page sets the phlo limit to 100000000 by default.

The fee that is actually charged for a deploy is not described on this page.

---

## Related Documentation

- [Wallet Architecture](../../component-diagrams/wallet/) - Wallet internals
- [Balance Query](../balance/) - How balance checks work
- [Send Tokens Guide](/wallet/usage/) - Step-by-step guide
