# Constants

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/v2.1.0/src/utils/constants/index.ts) · [Config](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/v2.1.0/src/config/index.ts)

The SDK exports these constants from the package root. They live in two files: `utils/constants` holds the chain and encoding constants, and `config` holds the defaults for gas, timeouts and storage.

## Import

```ts
import { ASI_DECIMALS, GasFee, SCALA_FAULT_TOLERANCE_THRESHOLD } from "@asichain/asi-wallet-sdk";
```

## Constants

### Chain and Token

| Constant | Type | Value | Description |
|----------|------|-------|-------------|
| `ASI_CHAIN_PREFIX` | `{ coinId: string; version: string }` | `{ coinId: "000000", version: "00" }` | Chain prefix prepended to the address payload before the checksum is calculated. |
| `ASI_DECIMALS` | `number` | `8` | Decimal places of ASI amounts in this SDK version. |
| `NATIVE_TOKEN_DECIMALS_AMOUNT` | `number` | `8` | Default `decimals` of an [`Asset`](/wallet-sdk/api-reference/asset/). |
| `POWER_BASE` | `number` | `10` | Base used to compute `ASI_BASE_UNIT`. |
| `ASI_BASE_UNIT` | `bigint` | `100_000_000n` | Atomic units in one ASI with 8 decimals (`10n ** 8n`). |
| `PRIVATE_KEY_LENGTH` | `number` | `32` | Length of a secp256k1 private key in bytes. |

In Wallet SDK 2.1.0 the decimal constants are fixed at 8, and no SDK API reads the decimals of the network. See [Token Amounts](/reference/token-amounts/).

### Node Responses

| Constant | Type | Value | Description |
|----------|------|-------|-------------|
| `SCALA_FAULT_TOLERANCE_THRESHOLD` | `number` | `0.99` | A deploy counts as finalized on a Scala node when its fault tolerance is at least this value. |
| `RUST_FAULT_TOLERANCE_THRESHOLD` | `number` | `0.33` | The same check for a Rust node. |
| `INVALID_BLOCK_NUMBER` | `number` | `-1` | Returned by `BlockService.getLatestBlockNumber()` when the block number cannot be read. |

The SDK picks the threshold from the node API profile of the active network (`SCALA` or `RUST`).

### Gas

`GasFee` is the object `{ MIN: 170000n, MAX: 250000n }`. It holds the lower and upper bounds of the gas cost, as `bigint` in atomic units. When the SDK reserves funds for a transfer, it adds `GasFee.MAX` to the transfer amount.

| Constant | Type | Value | Description |
|----------|------|-------|-------------|
| `DEFAULT_PHLO_LIMIT` | `number` | `500000` | Phlo limit of a deploy when none is given. |
| `DEFAULT_PHLO_PRICE` | `number` | `1` | Phlo price of a deploy when none is given. |

### Timeouts

| Constant | Type | Value | Description |
|----------|------|-------|-------------|
| `DEFAULT_REQUEST_TIMEOUT` | `number` | `30000` | Timeout of a node request, in milliseconds. |
| `DEPLOY_STATUS_POLLING_TIMEOUT` | `number` | `180000` | How long a deploy is polled for its status, in milliseconds. |
| `RESERVATION_EXPIRATION_TIME` | `number` | `300000` | Lifetime of a transaction reservation, in milliseconds. |
| `DEFAULT_AUTO_LOCK_MS` | `number` | `900000` | Time after which a signing session locks itself, in milliseconds. |
| `DEFAULT_DRAIN_TIMEOUT_MS` | `number` | `10000` | Default time a closing domain waits for its running operations to finish, in milliseconds. |
| `SUBMISSION_SETTLE_TIMEOUT_MS` | `number` | `40000` | How long the SDK waits for the deploy submissions of a wallet to settle, in milliseconds. Equals `DEFAULT_REQUEST_TIMEOUT` plus `DEFAULT_DRAIN_TIMEOUT_MS`. |

### Enums and Limits

| Constant | Value | Description |
|----------|-------|-------------|
| `RequirePassword` | `{ ONCE_PER_SESSION: "once-per-session", EVERY_SIGNATURE: "every-signature" }` | Whether signing asks for the password once per session or on every signature. |
| `ExportFormat` | `{ JSON: "json", CSV: "csv" }` | Output format of `ExportKeyfileService` exports. |
| `KeyfileTypes` | `{ WALLET: "asi-wallet-keyfile", ACCOUNT: "asi-account-keyfile" }` | Type field of an exported keyfile. |
| `ASI_WALLET_KEYFILE_VERSION` | `1` | Version of the keyfile format. |
| `MAX_KEYFILE_ACCOUNTS` | `1000` | Maximum number of accounts in one keyfile. |
| `MAX_KEYFILE_ACCOUNT_NAME_LENGTH` | `128` | Maximum length of an account name in a keyfile, in characters. |
| `DEFAULT_NODE_STORAGE_DIR` | `"./storage"` | Directory of the Node.js storage when none is given. |

The package also exports regular expressions, storage version numbers and other constants that the SDK uses internally. Their types are in the package typings.
