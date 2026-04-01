# BlockchainGateway

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/domains/BlockchainGateway/index.ts)

Singleton gateway for validator and indexer node communication. Must be initialized with `BlockchainGateway.init()` before use.

## Types

**Interface `BlockchainGatewayConfig`:**

| Field | Type | Description |
|-------|------|-------------|
| `validator` | `GatewayClientConfig` | Validator node config (`baseUrl`, optional `axiosConfig`). |
| `indexer` | `GatewayClientConfig` | Indexer (observer) node config. |

**Enum `DeployStatus`:**

| Value | Constant | Description |
|-------|----------|-------------|
| `"Deploying"` | `DEPLOYING` | Deploy submitted, not yet included. |
| `"IncludedInBlock"` | `INCLUDED_IN_BLOCK` | Deploy included in a block. |
| `"Finalized"` | `FINALIZED` | Block finalized (faultTolerance ≥ 0.8). |
| `"CheckingError"` | `CHECK_ERROR` | Error occurred while checking status. |

## Initialization

### `BlockchainGateway.init` (static)

```ts
BlockchainGateway.init(config: BlockchainGatewayConfig): BlockchainGateway
```

Initializes the singleton instance. Safe to call multiple times — reinitializes with new config.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `config` | `BlockchainGatewayConfig` | Yes | Validator and indexer node URLs. |

**Returns:** `BlockchainGateway` — singleton instance.

### `BlockchainGateway.isInitialized` (static)

```ts
BlockchainGateway.isInitialized(): boolean
```

Returns `true` if `init()` has been called.

### `BlockchainGateway.getInstance` (static)

```ts
BlockchainGateway.getInstance(): BlockchainGateway
```

Returns the singleton instance.

**Throws:** `Error("BlockchainGateway is not initialized. Call BlockchainGateway.init() first.")` — if `init()` was not called.

## Configuration

### `changeValidator`

```ts
changeValidator(config: GatewayClientConfig): BlockchainGateway
```

Replaces the active validator client. Returns `this` for method chaining.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `config` | `GatewayClientConfig` | Yes | New validator config with `baseUrl`. |

### `changeIndexer`

```ts
changeIndexer(config: GatewayClientConfig): BlockchainGateway
```

Replaces the active indexer client. Returns `this` for method chaining.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `config` | `GatewayClientConfig` | Yes | New indexer config with `baseUrl`. |

### `getValidatorClientUrl`

```ts
getValidatorClientUrl(): string
```

Returns the configured validator base URL.

**Returns:** `string`.

## Deploy operations

### `submitDeploy`

```ts
submitDeploy(deployData: SignedResult): Promise<string | undefined>
```

Submits a signed deploy to the validator node.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `deployData` | `SignedResult` | Yes | Signed deploy from `SignerService.sign()`. |

**Returns:** `Promise<string | undefined>` — deploy ID on success.

**Throws:** `Error("BlockchainGateway.submitDeploy: ${axiosError}")` — on network or API error.

### `submitExploratoryDeploy`

```ts
submitExploratoryDeploy(rholangCode: string): Promise<any>
```

Submits a read-only exploratory deploy to the indexer node.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `rholangCode` | `string` | Yes | Rholang code for the exploratory query. |

**Returns:** `Promise<any>` — raw API response.

**Throws:** `Error("BlockchainGateway.submitExploratoryDeploy: ${message}")`.

### `exploreDeployData`

```ts
exploreDeployData(rholangCode: string): Promise<any>
```

Submits an exploratory deploy and extracts the `expr` field from the response.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `rholangCode` | `string` | Yes | Rholang query code. |

**Returns:** `Promise<any>` — expressions array.

**Throws:** `Error("BlockchainGateway.exploreDeployData: ${message}")`.

### `getDeploy`

```ts
getDeploy(deployHash: string): Promise<any>
```

Retrieves deploy details by hash from the indexer.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `deployHash` | `string` | Yes | Deploy ID returned by `submitDeploy`. |

**Returns:** `Promise<any>` — deploy details object.

### `getDeployStatus`

```ts
getDeployStatus(deployHash: string): Promise<DeployStatusResult>
```

Returns the current status of a deploy. Does not throw — errors are captured in the result.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `deployHash` | `string` | Yes | Deploy ID. |

**Returns:** `Promise<DeployStatusResult>` — status or `{ status: CHECK_ERROR, errorMessage }`.

## Blockchain queries

### `getLatestBlockNumber`

```ts
getLatestBlockNumber(): Promise<number>
```

Returns the latest block number from the validator.

**Returns:** `Promise<number>` — block number, or `-1` (`INVALID_BLOCK_NUMBER`) on error.

### `isValidatorActive`

```ts
isValidatorActive(): Promise<boolean>
```

Health-checks the validator by calling its `/status` endpoint.

**Returns:** `Promise<boolean>` — `true` if the validator responds successfully.
