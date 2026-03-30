# DeployResubmitter

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/services/Resubmit/DeployResubmitter.ts)

Retry and resubmission logic for non-read-only deploys.

Related exports: [`ResubmitNodeManager`](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/services/Resubmit/NodeManager.ts), `ResubmitConfig`, `ResubmitResult`.

## Types

**Interface `ResubmitConfig`:**

| Field | Type | Description |
|-------|------|-------------|
| `deployValiditySeconds` | `number` | Deploy expiry time in seconds. |
| `deployRetries` | `number` | Maximum retry attempts per node. |
| `deployIntervalSeconds` | `number` | Delay between retry attempts. |
| `pollingIntervalSeconds` | `number` | Interval between status polls. |
| `nodeSelectionAttempts` | `number` | Number of node selection attempts. |
| `useRandomNode` | `boolean` | Whether to pick a random node from the pool. |

**`ResubmitResult`:**

| Field | Type | Description |
|-------|------|-------------|
| `success` | `boolean` | Whether the deploy was confirmed. |
| `deployId` | `string \| undefined` | Deploy ID if successful. |
| `deployStatus` | `DeployStatus \| undefined` | Final deploy status. |
| `error` | `DeployError \| undefined` | Error details if failed. |

## Constructor

```ts
new DeployResubmitter(config: ResubmitConfig, availableNodesUrls: string[])
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `config` | `ResubmitConfig` | Yes | Retry and polling configuration. |
| `availableNodesUrls` | `string[]` | Yes | Pool of validator node URLs for resubmission. |

**Throws:** `Error("BlockchainGateway is not initialized")` — if `BlockchainGateway.init()` was not called.

## `resubmit`

```ts
resubmit(
  rholangCode: string,
  wallet: Wallet,
  passwordProvider: PasswordProvider,
  phloLimit?: number
): Promise<ResubmitResult>
```

Submits a Rholang deploy with automatic retry and status polling. Does not throw — all errors are captured in the returned `ResubmitResult`.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `rholangCode` | `string` | Yes | Rholang smart contract code to deploy. |
| `wallet` | `Wallet` | Yes | Wallet used to sign the deploy. |
| `passwordProvider` | `PasswordProvider` | Yes | Async callback returning the wallet password. |
| `phloLimit` | `number` | No | Gas limit. Defaults to `DEFAULT_PHLO_LIMIT`. |

**Returns:** `Promise<ResubmitResult>` — `{ success, deployId?, deployStatus?, error? }`.

**Flow:**
1. Connects to a node (default or random from pool).
2. Signs and submits the deploy; retries up to `deployRetries` times with `deployIntervalSeconds` delay.
3. Polls for block inclusion every `pollingIntervalSeconds` until `deployValiditySeconds` expires.
4. Returns result with final status.
