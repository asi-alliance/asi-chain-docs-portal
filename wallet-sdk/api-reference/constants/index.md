# Constants

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/utils/constants/index.ts)

Library-wide constants used across the SDK.

| Constant | Value | Description |
|----------|-------|-------------|
| `ASI_CHAIN_PREFIX` | `{ coinId, version }` | Chain payload prefix used for address construction |
| `ASI_COIN_TYPE` | `60` | Coin type for BIP-44 derivation |
| `ASI_DECIMALS` | `8` | Number of decimal places for ASI |
| `POWER_BASE` | `10` | Base used for power calculations |
| `ASI_BASE_UNIT` | `BigInt(10) ** BigInt(8)` = `100_000_000` | Atomic unit multiplier (1 ASI = 100,000,000 atomic units) |

**`GasFee` constants:**

| Constant | Description |
|----------|-------------|
| `GasFee.BASE_FEE` | Base gas fee value |
| `GasFee.VARIATION_RANGE` | Random variation range added to base fee |
| `GasFee.LABEL` | Fee label string |
| `GasFee.TRANSFER` | Fee for transfer deploys |
| `GasFee.DEPLOY` | Fee for generic deploys |
