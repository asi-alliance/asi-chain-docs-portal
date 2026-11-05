# Error Types

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/v2.1.0/src/domains/CustomError/index.ts)

Typed errors thrown by the SDK. Every error extends `CustomError`, so a caller can branch on a machine-readable `code` and an HTTP-style `status` instead of matching message strings. All classes and enums on this page are exported from `@asichain/asi-wallet-sdk`.

## Import

```ts
import { CustomError, CustomErrorCode } from "@asichain/asi-wallet-sdk";
```

## Types

### CustomError

```ts
class CustomError extends Error {
  readonly code: CustomErrorCode
  readonly status: number
}
```

Check errors with `instanceof` or `code`. `name` is set from the class name, but the published bundle is minified and the name comes out as a short string such as `Je`. `status` is a hint for the UI and not a response from a server. For example, `403` on `WalletLockedError` means "ask for the password again".

### CustomErrorCode

```ts
enum CustomErrorCode {
  WALLET_LOCKED = 'WALLET_LOCKED',
  NETWORK_BUSY = 'NETWORK_BUSY',
  STORAGE_VERSION_DOWNGRADE = 'STORAGE_VERSION_DOWNGRADE',
  STORAGE_MIGRATION_FAILED = 'STORAGE_MIGRATION_FAILED',
  STORAGE_MIGRATION_INTERRUPTED = 'STORAGE_MIGRATION_INTERRUPTED',
  STORAGE_MIGRATION_ROLLBACK_FAILED = 'STORAGE_MIGRATION_ROLLBACK_FAILED',
  STORAGE_MIGRATION_CHAIN_INVALID = 'STORAGE_MIGRATION_CHAIN_INVALID',
  BALANCE_UNAVAILABLE = 'BALANCE_UNAVAILABLE',
  DUPLICATE_WALLET = 'DUPLICATE_WALLET',
  DUPLICATE_ACCOUNT = 'DUPLICATE_ACCOUNT',
  WALLET_ACTION_IN_PROGRESS = 'WALLET_ACTION_IN_PROGRESS',
  RESERVATION_ACTION_IN_PROGRESS = 'RESERVATION_ACTION_IN_PROGRESS',
  INVALID_KEYFILE = 'INVALID_KEYFILE',
  INVALID_KEYFILE_PASSWORD = 'INVALID_KEYFILE_PASSWORD',
  KEYFILE_WALLET_NOT_FOUND = 'KEYFILE_WALLET_NOT_FOUND',
  WALLET_OPERATION_CANCELLED = 'WALLET_OPERATION_CANCELLED',
  DOMAIN_CLOSED = 'DOMAIN_CLOSED',
  OPERATIONS_SUSPENDED = 'OPERATIONS_SUSPENDED',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  CORRUPTED_DATA = 'CORRUPTED_DATA',
  UNSUPPORTED_ENCRYPTION_VERSION = 'UNSUPPORTED_ENCRYPTION_VERSION',
  KEY_DERIVATION_FAILED = 'KEY_DERIVATION_FAILED',
  STORAGE_OPERATION_FAILED = 'STORAGE_OPERATION_FAILED',
  API_REQUEST_FAILED = 'API_REQUEST_FAILED',
  DEPLOY_SUBMISSION_REJECTED = 'DEPLOY_SUBMISSION_REJECTED',
  DEPLOY_TIMEOUT = 'DEPLOY_TIMEOUT',
  HD_WALLET_ONLY_OPERATION = 'HD_WALLET_ONLY_OPERATION',
  LAST_ACCOUNT_REMOVAL = 'LAST_ACCOUNT_REMOVAL',
  UNKNOWN_ACCOUNT = 'UNKNOWN_ACCOUNT',
  ACCOUNT_BUSY = 'ACCOUNT_BUSY',
}
```

### Supporting Enums

`WalletAction`, `ReservationAction`, `CorruptedDataSource`, `StorageOperation`, `ApiSource`, `UnknownErrorReason`, `StorageMigrationChainViolation` and `StorageMigrationInterruptionReason` are exported as well. They supply the values of the `action`, `source`, `operation` and `reason` fields above.

```ts
enum ApiSource {
  NODE = 'node api',
  GRAPHQL = 'graphql api',
}

enum WalletAction {
  OPEN = 'OPEN',
  DERIVE_ACCOUNT = 'DERIVE_ACCOUNT',
  SAVE_ACCOUNTS = 'SAVE_ACCOUNTS',
  SUBMIT_DEPLOY = 'SUBMIT_DEPLOY',
}
```

## Error Classes

### Wallet and Account Errors

| Class | Code | Status | Extra fields |
|-------|------|--------|--------------|
| `WalletLockedError` | `WALLET_LOCKED` | 403 | none |
| `HDWalletOnlyOperationError` | `HD_WALLET_ONLY_OPERATION` | 403 | `operation` |
| `DuplicateWalletError` | `DUPLICATE_WALLET` | 409 | `existingSignerId` |
| `DuplicateAccountError` | `DUPLICATE_ACCOUNT` | 409 | `existingSignerId`, `existingAccountId` |
| `WalletActionInProgressError` | `WALLET_ACTION_IN_PROGRESS` | 409 | `action`, `signerId` |
| `WalletOperationCancelledError` | `WALLET_OPERATION_CANCELLED` | 409 | `signerId` |
| `LastAccountRemovalError` | `LAST_ACCOUNT_REMOVAL` | 409 | `walletId`, `accountId` |
| `UnknownAccountError` | `UNKNOWN_ACCOUNT` | 404 | `walletId`, `accountId` |
| `AccountBusyError` | `ACCOUNT_BUSY` | 409 | `walletId`, `accountId` |
| `ReservationActionInProgressError` | `RESERVATION_ACTION_IN_PROGRESS` | 409 | `action`, `networkId`, `accountId?` |

- `WalletLockedError` is thrown when a signing call has no active session and no password. Treat it like an expired login and ask for the password again.
- `WalletOperationCancelledError` means the wallet was locked or closed while the operation ran, so the result was discarded. Do not retry it blindly, because the user's intent changed.
- `HDWalletOnlyOperationError` is thrown by `Wallet.deriveAccount` and `Wallet.removeAccount` on a private-key wallet.
- `LastAccountRemovalError` stops `Wallet.removeAccount` from removing the only account of an HD wallet.
- `UnknownAccountError` means the account id does not belong to that wallet, and `AccountBusyError` means the account is signing or has a pending reservation. Only the second one is worth retrying.

### Crypto Errors

| Class | Code | Status | Extra fields |
|-------|------|--------|--------------|
| `InvalidPasswordError` | `INVALID_PASSWORD` | 403 | `details` |
| `CorruptedDataError` | `CORRUPTED_DATA` | 422 | `source` |
| `UnsupportedEncryptionVersionError` | `UNSUPPORTED_ENCRYPTION_VERSION` | 400 | `version`, `supportedVersion` |
| `KeyDerivationError` | `KEY_DERIVATION_FAILED` | 500 | `reason` |

`InvalidPasswordError` means decryption failed authentication, so the password is wrong. `CorruptedDataError` means the stored data is damaged, and another password will not help. Its `source` is a `CorruptedDataSource`.

### Keyfile Errors

| Class | Code | Status |
|-------|------|--------|
| `InvalidKeyfileError` | `INVALID_KEYFILE` | 400 |
| `InvalidKeyfilePasswordError` | `INVALID_KEYFILE_PASSWORD` | 401 |
| `KeyfileWalletNotFoundError` | `KEYFILE_WALLET_NOT_FOUND` | 404 |

A well-formed keyfile with a wrong password gives `InvalidKeyfilePasswordError`, so a UI can ask for the password again instead of reporting a broken file.

### Network and Runtime Errors

| Class | Code | Status | Extra fields |
|-------|------|--------|--------------|
| `DomainClosedError` | `DOMAIN_CLOSED` | 410 | `domainName` |
| `OperationsSuspendedError` | `OPERATIONS_SUSPENDED` | 409 | none |
| `NetworkBusyError` | `NETWORK_BUSY` | 409 | `networkId` |
| `StorageOperationError` | `STORAGE_OPERATION_FAILED` | 500 | `operation`, `target`, `reason` |
| `DeployTimeoutError` | `DEPLOY_TIMEOUT` | 408 | `deployId`, `timeoutMs` |
| `ApiRequestError` | `API_REQUEST_FAILED` | 502 | `source`, `operation`, `reason` |
| `DeploySubmissionRejectedError` | `DEPLOY_SUBMISSION_REJECTED` | 400 | `source`, `operation`, `reason` |
| `BalanceUnavailableError` | `BALANCE_UNAVAILABLE` | 502 | `address`, `reason` |

- `DomainClosedError` means the `Client` was closed for good. Create a new one instead of retrying.
- `OperationsSuspendedError` is thrown while `clearPersistence` or `removeWallet` runs. The operation can be retried after that call finishes.
- `NetworkBusyError` is thrown when a network is switched, updated or removed while it still has an operation in flight.
- `DeploySubmissionRejectedError` extends `ApiRequestError` and means the node refused the deploy with a 4xx status. The deploy will not land and its reservation is released. Any other submission failure is a plain `ApiRequestError`, and the deploy may still have been accepted. `isRejectedByServer(error)` applies the same rule.
- `DeployTimeoutError` means the deploy was not finalized within the watch timeout. It may still be processed by the network.
- `BalanceUnavailableError` means the balance could not be read, which is not the same as a zero balance.

### Storage Schema Errors

Thrown while a `Client` is created, before any wallet exists. All of them except `StorageMigrationChainError` extend `StorageSchemaError`, which adds `isStorageIntact: boolean`. When it is `true`, the stored data is untouched, so update the SDK and do not wipe anything. When it is `false`, storage may be partly migrated and has to be restored from an export.

| Class | Code | Status | `isStorageIntact` | Extra fields |
|-------|------|--------|-------------------|--------------|
| `StorageVersionDowngradeError` | `STORAGE_VERSION_DOWNGRADE` | 409 | `true` | `storedVersion`, `supportedVersion` |
| `StorageMigrationInterruptedError` | `STORAGE_MIGRATION_INTERRUPTED` | 409 | `false` | `pendingVersion`, `reason` |
| `StorageMigrationFailedError` | `STORAGE_MIGRATION_FAILED` | 500 | `true` | `failedVersion`, `description`, `storedVersion`, `migrationError` |
| `StorageMigrationRollbackError` | `STORAGE_MIGRATION_ROLLBACK_FAILED` | 500 | `false` | `failedVersion`, `failures`, `migrationError` |
| `StorageMigrationChainError` | `STORAGE_MIGRATION_CHAIN_INVALID` | 500 | not present | `violation`, `versions` |

`StorageMigrationChainError` points to a defect in the SDK's own migration list and is not caused by user data.

## Example

```ts
import { CustomError, CustomErrorCode } from '@asichain/asi-wallet-sdk';

function describe(error: unknown): string {
  if (error instanceof CustomError) {
    if (error.code === CustomErrorCode.WALLET_LOCKED) return 'Enter the wallet password again';
    return `${error.code} (${error.status}): ${error.message}`;
  }
  return String(error);
}

console.log(describe(new Error('boom')));
```
