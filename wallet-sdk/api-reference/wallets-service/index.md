# WalletsService

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/services/Wallets/index.ts)

Wallet creation and address derivation.

## `createWallet`

```ts
createWallet(privateKey?: Uint8Array, options?: CreateWalletOptions): WalletMeta
```

Creates wallet metadata from an existing or randomly generated secp256k1 private key. If `privateKey` is omitted, a new key pair is generated automatically.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `privateKey` | `Uint8Array` | No | Private key (32 bytes). Generates a new key pair if omitted. |
| `options` | `CreateWalletOptions` | No | Optional config. Supports `name?: string`. |

**Returns:** `WalletMeta` — object with `address`, `publicKey`, and `privateKey` fields.

## `createWalletFromMnemonic`

```ts
createWalletFromMnemonic(mnemonic?: string, index?: number): Promise<WalletMeta>
```

Builds a wallet from a BIP-39 mnemonic phrase using BIP-44 hierarchical derivation. If `mnemonic` is omitted, a new mnemonic is generated. The returned `WalletMeta` always includes the normalized mnemonic.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `mnemonic` | `string` | No | BIP-39 mnemonic (12 or 24 words). Generates a new one if omitted. |
| `index` | `number` | No | BIP-44 address index. Defaults to `0`. |

**Returns:** `Promise<WalletMeta>` — includes `address`, `publicKey`, `privateKey`, and `mnemonic` (normalized).

**Throws:** `Error("WalletsService.createWalletFromMnemonic: Recovery mnemonic is missing or invalid")` — if the provided mnemonic fails BIP-39 validation.

## `deriveAddressFromPrivateKey`

```ts
deriveAddressFromPrivateKey(privateKey: Uint8Array): Address
```

Derives a blockchain address from a private key by first computing the public key.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `privateKey` | `Uint8Array` | Yes | secp256k1 private key (32 bytes). |

**Returns:** `Address` — Base58-encoded address with chain prefix and checksum.

## `deriveAddressFromPublicKey`

```ts
deriveAddressFromPublicKey(publicKey: Uint8Array): Address
```

Derives an address from a public key: applies keccak256 hashing, prepends chain prefix, computes blake2b checksum, and encodes with Base58.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `publicKey` | `Uint8Array` | Yes | secp256k1 public key bytes. |

**Returns:** `Address` — Base58-encoded address prefixed with `"1111"`.
