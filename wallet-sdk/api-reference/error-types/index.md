# Error Types

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/domains/Error/)

Error classification and handling for deploy operations. These types are used by `DeployResubmitter` and `BlockchainGateway` to categorize blockchain errors into recoverable and fatal groups.

## `DeploymentErrorHandler`

```ts
class DeploymentErrorHandler
```

Classifies raw blockchain error messages into typed error categories. All string matching is case-insensitive.

### `parseDeploymentError`

```ts
parseDeploymentError(errorMessage: string): DeploymentErrorType
```

Parses an error message from the blockchain and returns a classified error type. Returns `FatalDeployErrors.UNKNOWN_ERROR` if no known pattern matches.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `errorMessage` | `string` | Yes | Raw error message from the blockchain node. |

**Returns:** `DeploymentErrorType` — classified error (see enums below).

### `isDeploymentErrorRecoverable`

```ts
isDeploymentErrorRecoverable(errorType: DeploymentErrorType): boolean
```

Returns `true` if the error type belongs to `RecoverableDeployErrors`.

### `isDeploymentErrorFatal`

```ts
isDeploymentErrorFatal(errorType: DeploymentErrorType): boolean
```

Returns `true` if the error type belongs to `FatalDeployErrors`.

### `isPollingErrorRecoverable`

```ts
isPollingErrorRecoverable(errorMessage: string): boolean
```

Checks whether a status-polling error is transient. Returns `true` if the message contains `"casper instance"`, `"storage"`, or `"parsing"` (case-insensitive).

### `getErrorMessageByErrorType`

```ts
getErrorMessageByErrorType(errorType: DeploymentErrorType): string
```

Returns a human-readable message for the given error type. Falls back to the `UNKNOWN_ERROR` message if the type is not recognized.

## `RecoverableDeployErrors`

Errors that may resolve on retry (e.g., by switching to a different node).

```ts
enum RecoverableDeployErrors {
  READ_ONLY_NODE = "READ_ONLY_NODE",
  CASPER_INSTANCE_UNAVAILABLE = "CASPER_INSTANCE_UNAVAILABLE",
  INVALID_DEPLOY_ID = "INVALID_DEPLOY_ID",
  INVALID_BLOCK_NUMBER = "INVALID_BLOCK_NUMBER",
}
```

| Value | Default Message |
|-------|-----------------|
| `READ_ONLY_NODE` | Node is read-only. Trying another node... |
| `CASPER_INSTANCE_UNAVAILABLE` | Casper instance not available. Trying another node... |
| `INVALID_DEPLOY_ID` | Invalid deploy ID. Please try again. |
| `INVALID_BLOCK_NUMBER` | Invalid block number. Please try again. |

## `FatalDeployErrors`

Errors that cannot be resolved by retrying. Typically require user action or indicate a permanent failure.

```ts
enum FatalDeployErrors {
  INSUFFICIENT_BALANCE = "INSUFFICIENT_BALANCE",
  WRONG_NETWORK = "WRONG_NETWORK",
  PARSING_ERROR = "PARSING_ERROR",
  LOW_PHLO_PRICE = "LOW_PHLO_PRICE",
  SIGNATURE_ERROR = "SIGNATURE_ERROR",
  STORAGE_RETRIEVAL_ERROR = "STORAGE_RETRIEVAL_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  DEPLOY_SUBMIT_TIMEOUT = "DEPLOY_SUBMIT_TIMEOUT",
  BLOCK_INCLUSION_TIMEOUT = "BLOCK_INCLUSION_TIMEOUT",
  FINALIZATION_TIMEOUT = "FINALIZATION_TIMEOUT",
}
```

| Value | Default Message |
|-------|-----------------|
| `INSUFFICIENT_BALANCE` | Insufficient balance. Please top up your account. |
| `WRONG_NETWORK` | Wrong network. Please contact technical support. |
| `PARSING_ERROR` | Parsing error. Please contact technical support. |
| `LOW_PHLO_PRICE` | Phlo price too low. Please rebuild the transaction with a higher phlo price. |
| `SIGNATURE_ERROR` | Signature verification failed. Please try again. |
| `STORAGE_RETRIEVAL_ERROR` | Storage retrieval error. Please try again later. |
| `UNKNOWN_ERROR` | An unknown error occurred. Please try again. |
| `DEPLOY_SUBMIT_TIMEOUT` | Deploy submission timed out. Please try again. |
| `BLOCK_INCLUSION_TIMEOUT` | Deploy was not included in a block within the expected time. |
| `FINALIZATION_TIMEOUT` | Block finalization polling timed out. |

## `DeploymentErrorType`

```ts
type DeploymentErrorType = RecoverableDeployErrors | FatalDeployErrors
```

Union type used as the return type of `parseDeploymentError` and as the key type for error message lookups.
