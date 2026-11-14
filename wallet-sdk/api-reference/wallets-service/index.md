# Wallets

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/dev/src/services/Wallets/index.ts)

`Wallets` creates wallet metadata and derives addresses. Inside the SDK the class is declared as `WalletsService`, and all four methods are `static`.

::: tip Low-Level API
These helpers return plain key material and keep nothing in storage. Applications normally create and store wallets through [`Client`](/wallet-sdk/api-reference/client/) and use this class only to derive an address or a key pair on its own.
:::

## Import

```ts
import { Wallets } from '@asichain/asi-wallet-sdk';
```

## Methods

### createWallet()

```ts
createWallet(privateKey?: Uint8Array, options?: CreateWalletOptions): WalletMeta
```

Creates wallet metadata from an existing or randomly generated secp256k1 private key. If `privateKey` is omitted, the method generates a new key pair.

| Name | Type | Description |
|------|------|-------------|
| `privateKey` | `Uint8Array` | Optional. Private key (32 bytes). Generates a new key pair if omitted. |
| `options` | `CreateWalletOptions` | Optional. Accepts `name?: string`, but `createWallet` does not read it, so it has no effect. |

Returns `WalletMeta` with the `address`, `publicKey`, and `privateKey` fields. `publicKey` is the 65-byte uncompressed key.

### createFirstWalletWithMnemonic()

```ts
createFirstWalletWithMnemonic(mnemonic?: string, index?: number): Promise<WalletMeta>
```

Builds a wallet from a BIP-39 mnemonic phrase using BIP-44 hierarchical derivation. If `mnemonic` is omitted, a new mnemonic is generated. The returned `WalletMeta` always includes the mnemonic, which is only trimmed and split and joined again on single spaces. For input from a user, call `Mnemonic.normalizeMnemonic` first.

| Name | Type | Description |
|------|------|-------------|
| `mnemonic` | `string` | Optional. BIP-39 mnemonic. Generates a new one if omitted. |
| `index` | `number` | Optional. BIP-44 address index. Defaults to `0`. |

Returns `Promise<WalletMeta>` with `address`, `publicKey`, `privateKey`, and the normalized `mnemonic`.

Throws `Error("WalletsService.createFirstWalletWithMnemonic: Recovery mnemonic is missing or invalid")` if the provided mnemonic fails BIP-39 validation.

### deriveAddressFromPrivateKey()

```ts
deriveAddressFromPrivateKey(privateKey: Uint8Array): Address
```

Derives a blockchain address from a private key by first computing the public key.

| Name | Type | Description |
|------|------|-------------|
| `privateKey` | `Uint8Array` | secp256k1 private key (32 bytes). |

Returns `Address`, a Base58-encoded address with the chain prefix and checksum.

### deriveAddressFromPublicKey()

```ts
deriveAddressFromPublicKey(publicKey: Uint8Array): Address
```

Derives an address from a public key: applies keccak256 hashing, prepends the chain prefix, computes a blake2b checksum, and encodes the result with Base58.

| Name | Type | Description |
|------|------|-------------|
| `publicKey` | `Uint8Array` | Uncompressed secp256k1 public key, 65 bytes starting with `0x04`. A compressed key gives a wrong address without an error. |

Returns `Address`, a Base58-encoded address prefixed with `"1111"`.

## Types

### WalletMeta

```ts
interface WalletMeta {
  address: string
  privateKey: Uint8Array
  publicKey?: Uint8Array
  mnemonic?: string
}
```

`mnemonic` is set only by `createFirstWalletWithMnemonic`.
