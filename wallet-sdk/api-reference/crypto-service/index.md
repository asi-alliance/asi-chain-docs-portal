# CryptoService

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/services/Crypto/index.ts)

Password-based encryption and decryption using the WebCrypto API.

**Crypto profile:**

| Parameter | Value |
|-----------|-------|
| Version | 2 |
| KDF | PBKDF2, 100,000 iterations, SHA-256 |
| Cipher | AES-GCM, 256-bit key |
| Salt | 16 bytes (random) |
| IV | 12 bytes (random) |

## `encryptWithPassword`

```ts
encryptWithPassword(data: string, password: string): Promise<EncryptedData>
```

Encrypts plaintext using AES-GCM with a key derived from the provided password via PBKDF2(SHA-256).

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `data` | `string` | Yes | Plaintext to encrypt. |
| `password` | `string` | Yes | Password used for key derivation. |

**Returns:** `Promise<EncryptedData>` — object with `data` (Base64 ciphertext), `salt` (Base64, 16 bytes), `iv` (Base64, 12 bytes), and `version` (number: `2`).

## `decryptWithPassword`

```ts
decryptWithPassword(payload: EncryptedData, passphrase: string): Promise<string>
```

Decrypts an `EncryptedData` payload using the provided passphrase.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `payload` | `EncryptedData` | Yes | Encrypted data object produced by `encryptWithPassword`. |
| `passphrase` | `string` | Yes | Password used during encryption. |

**Returns:** `Promise<string>` — decrypted plaintext.

**Throws:** `Error("Unsupported version ${version}")` — if `payload.version` is not `2`.

## `deriveKey`

```ts
deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey>
```

Derives an AES-GCM-256 `CryptoKey` from a password and salt using PBKDF2(SHA-256, 100,000 iterations).

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `password` | `string` | Yes | Source password. |
| `salt` | `Uint8Array` | Yes | Salt bytes (recommended: 16 bytes). |

**Returns:** `Promise<CryptoKey>` — derived key usable for AES-GCM operations.
