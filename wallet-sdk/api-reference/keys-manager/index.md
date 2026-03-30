# KeysManager

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/services/KeysManager/index.ts)

secp256k1 key generation and management utilities.

**Interface `KeyPair`:**

| Field | Type | Description |
|-------|------|-------------|
| `privateKey` | `Uint8Array` | Private key (32 bytes). |
| `publicKey` | `Uint8Array` | Derived public key. |

## `generateRandomKey`

```ts
generateRandomKey(length?: number): Uint8Array
```

Generates cryptographically secure random bytes.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `length` | `number` | No | Number of bytes. Defaults to `32`. Must be a positive integer. |

**Returns:** `Uint8Array` — random bytes.

**Throws:** `Error("PrivateKeyLength must be a positive integer")` — if `length` is not a positive integer.

## `generateKeyPair`

```ts
generateKeyPair(keyLength?: number): KeyPair
```

Generates a random secp256k1 key pair.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `keyLength` | `number` | No | Private key length in bytes. Defaults to `32`. |

**Returns:** `KeyPair` — `{ privateKey, publicKey }`.

**Throws:** `Error("PrivateKeyLength must be a positive integer")` — if `keyLength` is invalid.

## `getKeyPairFromPrivateKey`

```ts
getKeyPairFromPrivateKey(privateKey: Uint8Array): KeyPair
```

Derives a `KeyPair` from an existing private key.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `privateKey` | `Uint8Array` | Yes | secp256k1 private key (32 bytes). |

**Returns:** `KeyPair` — `{ privateKey, publicKey }`.

## `getPublicKeyFromPrivateKey`

```ts
getPublicKeyFromPrivateKey(privateKey: Uint8Array): Uint8Array
```

Derives the public key from a private key.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `privateKey` | `Uint8Array` | Yes | secp256k1 private key (32 bytes). |

**Returns:** `Uint8Array` — compressed public key.

## `convertKeyToHex`

```ts
convertKeyToHex(key: Uint8Array): string
```

Converts a binary key to a lowercase hex string.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `key` | `Uint8Array` | Yes | Key bytes to encode. |

**Returns:** `string` — hex-encoded key.

## `deriveKeyFromMnemonic`

```ts
deriveKeyFromMnemonic(mnemonicWords: string[], options?: Bip44PathOptions): Promise<Uint8Array>
```

Convenience wrapper over `KeyDerivationService.deriveKeyFromMnemonic`.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `mnemonicWords` | `string[]` | Yes | Mnemonic word array. |
| `options` | `Bip44PathOptions` | No | BIP-44 path options. |

**Returns:** `Promise<Uint8Array>` — derived private key (32 bytes).
