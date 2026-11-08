# AssetsService

::: warning Network precision and compatibility
The planned testnet uses 18 decimals. These SDK examples describe the legacy eight-decimal API; changing a constant does not provide uint256 signing support. Select a compatible SDK release and verified network metadata before using it on the new testnet. See [Token Amounts and 18 Decimals](/general/token-amounts/).
:::

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/services/AssetsService/index.ts)

Balance queries and token transfers via `BlockchainGateway`.

## `transfer`

```ts
transfer(
  fromAddress: Address,
  toAddress: Address,
  amount: bigint,
  wallet: Wallet,
  passwordProvider: PasswordProvider,
  phloLimit?: number
): Promise<string | undefined>
```

Transfers ASI tokens from one address to another by constructing, signing, and submitting a deploy. Both addresses are validated before submission.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `fromAddress` | `Address` | Yes | Sender address. Must pass `validateAddress()`. |
| `toAddress` | `Address` | Yes | Recipient address. Must pass `validateAddress()`. |
| `amount` | `bigint` | Yes | Amount in atomic units. Must be greater than zero. |
| `wallet` | `Wallet` | Yes | Wallet used to sign the transfer deploy. |
| `passwordProvider` | `PasswordProvider` | Yes | Async callback returning the wallet password. |
| `phloLimit` | `number` | No | Gas limit. Defaults to `DEFAULT_PHLO_LIMIT` from config. |

**Returns:** `Promise<string | undefined>` — deploy ID on success.

**Throws:**
- `Error("AssetsService.transfer: Invalid 'fromAddress': ${errorCode}")` — sender address validation failed.
- `Error("AssetsService.transfer: Invalid 'toAddress': ${errorCode}")` — recipient address validation failed.
- `Error("AssetsService.transfer: Transfer amount must be greater than zero")` — if `amount ≤ 0`.
- `Error("AssetsService.transfer: Invalid block number")` — if the blockchain returns an invalid block number.
- `Error("AssetsService.transfer: ${message}")` — wraps signer or gateway errors.

## `getASIBalance`

```ts
getASIBalance(address: Address): Promise<bigint>
```

Retrieves the ASI balance for an address using an exploratory deploy.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `address` | `Address` | Yes | Address to query. Must pass `validateAddress()`. |

**Returns:** `Promise<bigint>` — balance in atomic units. Returns `BigInt(0)` on any error or if the address has no balance.
