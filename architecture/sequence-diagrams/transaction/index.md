# Transaction Flow

This page follows a token transfer in the ASI Wallet through four phases, from the amount check to the finalized deploy. Each phase has a sequence diagram and a table of its messages.

← [Back to Sequence Diagrams](/architecture/sequence-diagrams/)

## How a Transfer Works

A token transfer goes through four phases:

1. Check and reserve: validate the input and set the amount aside
2. Signing: build the Rholang term and sign the deploy
3. Submission: send the signed deploy to the validator
4. Confirmation: poll the node until the deploy is finalized

A transfer is a deploy of a Rholang term that moves tokens between two vaults. Deploying a contract from the Deploy page uses the same phases with a different term.

The wallet calls the SDK `Client`, and the SDK talks to the nodes behind `ValidatorURL` and `ReadOnlyURL` (see [Wallet Components](/architecture/component-diagrams/wallet/#network-connections)).

## Phase 1: Check and Reserve

<Diagram name="transfer-checks" caption="Messages between the user, the wallet, the SDK and the read-only node while a transfer is checked and funds are reserved." />

| Messages | Step | Description |
|----------|------|-------------|
| 1-2 | User input | Recipient address and amount. The wallet does not send to `0x...` addresses |
| 3-5 | Password | Needed only while the signing session is closed. By default a session stays open for 15 minutes after unlocking |
| 6 | Reserve | The amount held for the transfer is `amount + GasFee.MAX`, where `GasFee.MAX` is 250000 atomic units (0.0025 ASI) |
| 7-9 | Balance check | The SDK reads the balance as described in [Balance Query Flow](/architecture/sequence-diagrams/balance/). If the balance minus funds already reserved does not cover the new reserve, the transfer stops with an error before anything is signed |

The private key is not kept in the Redux store. The SDK decrypts it only while the signing session is open.

## Phase 2: Signing

<Diagram name="deploy-signing" caption="Messages between the SDK and the read-only node while the SDK builds, serializes and signs the transfer deploy." />

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

<Diagram name="deploy-submission" caption="Messages between the SDK, the local storage and the validator node when the signed deploy is submitted, with the three possible outcomes." />

| Messages | Step | Description |
|----------|------|-------------|
| 1 | Save reservation | The reservation is written to the browser storage before the request, so the amount stays held even if the page closes |
| 2 | Submit | `POST /api/deploy` with the signed deploy |
| 3 | Validate | The node checks the signature algorithm, the phlo price against its minimum price and the term |
| 4 | Deploy ID | The node returns the signature of the deploy in hex. The wallet tracks the transfer by that signature |

If the node refuses the deploy with a 4xx answer, the reservation is released (messages 5 and 6). If the outcome is unknown, for example after a network error, the reservation stays: the deploy may still reach the network.

The validator answers `400` for a malformed request or a bad term and `409` for a duplicate deploy. Other failures come back as `422`, `500` or `502`.

## Phase 4: Confirmation

<Diagram name="deploy-status-polling" caption="Messages between the wallet, the SDK and the read-only node while the SDK polls the deploy status until the watch ends." />

The SDK maps every answer to a status.

| Status | Meaning |
|--------|---------|
| `Deploying` | The node does not report a block for the deploy yet |
| `IncludedInBlock` | The deploy is in a block that is not finalized |
| `Finalized` | The block is finalized. The transfer is confirmed |
| `CheckingError` | The request failed. Polling goes on |

If the deploy is not finalized within 180 seconds, the watch ends with `DeployTimeoutError`. When it ends, the wallet invalidates the cached balance and history.

For a Scala node the SDK reads the `faultTolerance` field of the answer and treats the deploy as finalized at 0.99 or above. For a Rust node the SDK looks for the same field with a threshold of 0.33, but a Rust node does not send it.

::: warning Finalization on Rust Nodes
A Rust node answers `GET /api/deploy/{id}` with `isFinalized` and `finalizationState` instead of `faultTolerance`. Wallet SDK 2.1.0 with the `rust` profile therefore keeps the status at `IncludedInBlock` for a deploy that the node already reports as `Finalized`, and the watch ends with `DeployTimeoutError`.

The node returns the deploy as soon as a block it knows contains it, with `isFinalized: false` until that block is finalized. If no known block contains the deploy, the node answers `404 deploy_not_found`, and the SDK reports `CheckingError`.
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

## Next Steps

<CardGrid columns="2">
<DocCard title="Wallet Components" href="/architecture/component-diagrams/wallet/">Layers, state and storage of the wallet app</DocCard>
<DocCard title="Balance Query Flow" href="/architecture/sequence-diagrams/balance/">How balance checks work</DocCard>
<DocCard title="ASI Wallet" href="/wallet/usage/#send">Send ASI from the wallet step by step</DocCard>
</CardGrid>
