# Constants

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/utils/constants/index.ts)

Library-wide constants used across the SDK.

## Chain and Token

| Constant | Type | Value | Description |
|----------|------|-------|-------------|
| `ASI_CHAIN_PREFIX` | `{ coinId: string; version: string }` | `{ coinId: "000000", version: "00" }` | Chain payload prefix prepended to the address payload before checksum calculation. |
| `ASI_COIN_TYPE` | `number` | `60` | BIP-44 coin type used in derivation paths (`m/44'/60'/...`). |
| `ASI_DECIMALS` | `number` | `8` | Number of decimal places for ASI token amounts. |
| `POWER_BASE` | `number` | `10` | Base used for exponentiation when computing `ASI_BASE_UNIT`. |
| `ASI_BASE_UNIT` | `bigint` | `BigInt(10) ** BigInt(8)` = `100_000_000n` | Atomic unit multiplier. 1 ASI = 100,000,000 atomic units. |

## Keys and Addresses

| Constant | Type | Value | Description |
|----------|------|-------|-------------|
| `PRIVATE_KEY_LENGTH` | `number` | `32` | Expected secp256k1 private key length in bytes. |
| `INVALID_BLOCK_NUMBER` | `number` | `-1` | Sentinel value returned by `BlockchainGateway.getLatestBlockNumber()` on error. |
| `FAULT_TOLERANCE_THRESHOLD` | `number` | `0.99` | Fault-tolerance threshold used when determining block finalization status. |

## BIP-44 Defaults

```ts
const DEFAULT_BIP_44_PATH_OPTIONS = {
  coinType: 60,  // ASI_COIN_TYPE
  account: 0,
  change: 0,
  index: 0,
}
```

Produces the derivation path `m/44'/60'/0'/0/0`. Used by `KeyDerivationService` when no custom options are provided.

## Gas Fees

| Constant | Type | Value | Description |
|----------|------|-------|-------------|
| `GasFee.BASE_FEE` | `number` | `0.0025` | Base gas fee value in ASI. |
| `GasFee.VARIATION_RANGE` | `number` | `0.1` | Random variation range added to the base fee. |
| `GasFee.LABEL` | `string` | `"ASI"` | Display label for gas fee amounts. |
| `GasFee.TRANSFER` | `string` | `"0.0025"` | Default fee for transfer deploys. |
| `GasFee.DEPLOY` | `string` | `"0.0025"` | Default fee for generic deploys. |
