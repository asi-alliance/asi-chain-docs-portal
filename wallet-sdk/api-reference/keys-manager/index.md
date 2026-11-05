# KeysManager

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/v2.1.0/src/services/KeysManager/index.ts)

secp256k1 key generation and HD key derivation helpers. All methods are `static`.

## Import

```ts
import { KeysManager } from "@asichain/asi-wallet-sdk";
```

## Methods

### generateRandomKey()

```ts
generateRandomKey(length?: number): Uint8Array
```

Generates cryptographically secure random bytes.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `length` | `number` | No | Number of bytes. Defaults to `32`. Must be a positive integer. |

Returns `Uint8Array` with the random bytes.

Throws `Error("PrivateKeyLength must be a positive integer")` if `length` is not a positive integer.

### generateKeyPair()

```ts
generateKeyPair(keyLength?: number): KeyPair
```

Generates a random secp256k1 key pair.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `keyLength` | `number` | No | Private key length in bytes. Defaults to `32`. |

Returns `KeyPair` as `{ privateKey, publicKey }`.

Throws `Error("PrivateKeyLength must be a positive integer")` if `keyLength` is invalid.

### getKeyPairFromPrivateKey()

```ts
getKeyPairFromPrivateKey(privateKey: Uint8Array): KeyPair
```

Derives a `KeyPair` from an existing private key.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `privateKey` | `Uint8Array` | Yes | secp256k1 private key (32 bytes). |

Returns `KeyPair` as `{ privateKey, publicKey }`.

### getPublicKeyFromPrivateKey()

```ts
getPublicKeyFromPrivateKey(privateKey: Uint8Array): Uint8Array
```

Derives the public key from a private key.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `privateKey` | `Uint8Array` | Yes | secp256k1 private key (32 bytes). |

Returns `Uint8Array` with the uncompressed public key (65 bytes, starting with `0x04`).

### convertKeyToHex()

```ts
convertKeyToHex(key: Uint8Array): string
```

Converts a binary key to a lowercase hex string.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `key` | `Uint8Array` | Yes | Key bytes to encode. |

Returns `string` with the hex-encoded key.

### getInitialHDPathFromOptions()

```ts
getInitialHDPathFromOptions(hdWalletOptions: TCreateHDPathWalletOptions): Promise<Bip44Path>
```

Returns the BIP-44 path for a new HD wallet. With `{ index }` it builds a path from `ASI_COIN_TYPE`, account 0, change 0 and that index, and with `{ customHDPath }` it returns that path unchanged.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `hdWalletOptions` | `TCreateHDPathWalletOptions` | Yes | `{ index: number }` or `{ customHDPath: Bip44Path }`. |

Returns `Promise<Bip44Path>`.

### getPrivateDataFromSeed()

```ts
getPrivateDataFromSeed(seed: Uint8Array, path: Bip44Path): Promise<IHDWalletPrivateKeyDataFromSeed>
```

Derives the private key at `path` from a BIP-39 seed.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `seed` | `Uint8Array` | Yes | Seed bytes, for example from `KeyDerivation.mnemonicToSeed`. |
| `path` | `Bip44Path` | Yes | Derivation path. |

Returns `Promise<IHDWalletPrivateKeyDataFromSeed>` with `{ privateKey, path, index }`.

## Types

### KeyPair

| Field | Type | Description |
|-------|------|-------------|
| `privateKey` | `Uint8Array` | Private key (32 bytes). |
| `publicKey` | `Uint8Array` | Derived public key. |

### HD Wallet Key Data

```ts
interface IBaseHDWalletPrivateKeyData {
  path: Bip44Path
  privateKey: Uint8Array
}

interface IHDWalletPrivateKeyDataFromSeed extends IBaseHDWalletPrivateKeyData {
  index: number
}
```

::: info Mnemonic Derivation
`KeysManager` has no `deriveKeyFromMnemonic`. Use `KeyDerivation.deriveKeyFromMnemonic(mnemonic, bip44path)` from the [KeyDerivation](/wallet-sdk/api-reference/key-derivation/) page.
:::
