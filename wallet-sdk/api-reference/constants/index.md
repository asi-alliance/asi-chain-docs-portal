# Constants

::: warning Network precision and compatibility
The planned testnet uses 18 decimals. These SDK examples describe the legacy eight-decimal API; changing a constant does not provide uint256 signing support. Select a compatible SDK release and verified network metadata before using it on the new testnet. See [Token Amounts and 18 Decimals](/general/token-amounts/).
:::

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/utils/constants/index.ts)

Library-wide constants used across the SDK.

## Chain and Token

| Constant | Type | Value | Description |
|----------|------|-------|-------------|
| `ASI_CHAIN_PREFIX` | `{ coinId: string; version: string }` | `{ coinId: "000000", version: "00" }` | Chain payload prefix prepended to the address payload before checksum calculation. |
| `ASI_DECIMALS` | `number` | `8` | Legacy SDK default; not the planned testnet denomination. |
| `POWER_BASE` | `number` | `10` | Base used for exponentiation when computing `ASI_BASE_UNIT`. |
| `ASI_BASE_UNIT` | `bigint` | `BigInt(10) ** BigInt(8)` = `100_000_000n` | Legacy eight-decimal multiplier. Use validated network precision for new integrations. |

## Keys and Addresses

| Constant | Type | Value | Description |
|----------|------|-------|-------------|
| `PRIVATE_KEY_LENGTH` | `number` | `32` | Expected secp256k1 private key length in bytes. |
| `INVALID_BLOCK_NUMBER` | `number` | `-1` | Sentinel value returned by `BlockchainGateway.getLatestBlockNumber()` on error. |
| `FAULT_TOLERANCE_THRESHOLD` | `number` | `0.99` | Fault-tolerance threshold used when determining block finalization status. |

## Gas Fees

| Constant | Type | Value | Description |
|----------|------|-------|-------------|
| `GasFee.BASE_FEE` | `number` | `0.0025` | Base gas fee value in ASI. |
| `GasFee.VARIATION_RANGE` | `number` | `0.1` | Random variation range added to the base fee. |
| `GasFee.LABEL` | `string` | `"ASI"` | Display label for gas fee amounts. |
| `GasFee.TRANSFER` | `string` | `"0.0025"` | Default fee for transfer deploys. |
| `GasFee.DEPLOY` | `string` | `"0.0025"` | Default fee for generic deploys. |
