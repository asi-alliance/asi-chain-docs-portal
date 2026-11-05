# Wallets

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/v2.1.0/src/services/Wallets/index.ts)

Low-level helpers that create wallet metadata and derive addresses. The package exports the class as `Wallets` (it is declared as `WalletsService` inside the SDK), and all four methods are `static`.

```ts
import { Wallets } from '@asichain/asi-wallet-sdk';
```

::: tip Low-level API
These helpers return plain key material and keep nothing in storage. Applications normally create and store wallets through [`Client`](/wallet-sdk/api-reference/client/) and use this class only to derive an address or a key pair on its own.
:::

## `createWallet`

```ts
createWallet(privateKey?: Uint8Array, options?: CreateWalletOptions): WalletMeta
```

Creates wallet metadata from an existing or randomly generated secp256k1 private key. If `privateKey` is omitted, a new key pair is generated automatically.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `privateKey` | `Uint8Array` | No | Private key (32 bytes). Generates a new key pair if omitted. |
| `options` | `CreateWalletOptions` | No | Accepts `name?: string`, but `createWallet` does not read it, so it has no effect. |

**Returns:** `WalletMeta` — object with `address`, `publicKey`, and `privateKey` fields. `publicKey` is the 65-byte uncompressed key.

## `createFirstWalletWithMnemonic`

```ts
createFirstWalletWithMnemonic(mnemonic?: string, index?: number): Promise<WalletMeta>
```

Builds a wallet from a BIP-39 mnemonic phrase using BIP-44 hierarchical derivation. If `mnemonic` is omitted, a new mnemonic is generated. The returned `WalletMeta` always includes the normalized mnemonic.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `mnemonic` | `string` | No | BIP-39 mnemonic (12 or 24 words). Generates a new one if omitted. |
| `index` | `number` | No | BIP-44 address index. Defaults to `0`. |

**Returns:** `Promise<WalletMeta>` — includes `address`, `publicKey`, `privateKey`, and `mnemonic` (normalized).

**Throws:** `Error("WalletsService.createFirstWalletWithMnemonic: Recovery mnemonic is missing or invalid")` — if the provided mnemonic fails BIP-39 validation.

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

## `WalletMeta`

```ts
interface WalletMeta {
  address: string
  privateKey: Uint8Array
  publicKey?: Uint8Array
  mnemonic?: string
}
```

`mnemonic` is set only by `createFirstWalletWithMnemonic`.
