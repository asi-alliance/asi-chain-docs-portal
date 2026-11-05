# Crypto

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/v2.1.0/src/services/Crypto/index.ts)

Password-based encryption and decryption on top of WebCrypto. The package exports the class as `Crypto`, and all methods are static. They use the global `crypto.subtle` and `crypto.getRandomValues`, which browsers provide and Node.js provides globally from version 19.

```ts
import { Crypto } from '@asichain/asi-wallet-sdk';

const encrypted = await Crypto.encryptWithPassword('secret text', 'a password');
const plain = await Crypto.decryptWithPassword(encrypted, 'a password');
console.log(plain); // secret text
```

**Crypto profile:**

| Parameter | Value |
|-----------|-------|
| Version | 2 |
| KDF | PBKDF2, 100,000 iterations, SHA-256 |
| Cipher | AES-GCM, 256-bit key |
| Salt | 16 bytes, random |
| IV | 12 bytes, random |
| Data key | 32 random bytes |

**Type `EncryptedData`:**

| Field | Type | Description |
|-------|------|-------------|
| `data` | `string` | Base64 ciphertext with the GCM tag. |
| `salt` | `string` | Base64 salt. |
| `iv` | `string` | Base64 IV. |
| `version` | `number` | Profile version, currently `2`. |

The package also exports the `CryptoConfig` type, which describes the constants above.

## `encryptWithPassword`

```ts
static encryptWithPassword(data: string, password: string): Promise<EncryptedData>
```

Encrypts text with AES-GCM using a key derived from the password. Salt and IV are new for every call.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `data` | `string` | Yes | Plaintext. |
| `password` | `string` | Yes | Password for key derivation. |

**Returns:** `Promise<EncryptedData>`.

**Throws:** `KeyDerivationError` if the key cannot be derived.

## `decryptWithPassword`

```ts
static decryptWithPassword(payload: EncryptedData, passphrase: string): Promise<string>
```

Decrypts an `EncryptedData` object.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `payload` | `EncryptedData` | Yes | Object produced by `encryptWithPassword`. |
| `passphrase` | `string` | Yes | Password used for encryption. |

**Returns:** `Promise<string>` — plaintext.

**Throws:**

| Error | When |
|-------|------|
| `UnsupportedEncryptionVersionError` | `payload.version` is not `2`. The message is `Unsupported version <v> of the encrypted payload, this SDK build supports version 2`. |
| `CorruptedDataError` | `salt` is not 16 bytes, `iv` is not 12 bytes, `data` is shorter than the 16-byte tag, or a field is not valid Base64. |
| `InvalidPasswordError` | AES-GCM rejects the data, which happens with a wrong password and also with a modified ciphertext. |
| `KeyDerivationError` | The key cannot be derived. |

## `deriveKey`

```ts
static deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey>
```

Derives a non-extractable AES-GCM-256 `CryptoKey` from a password with PBKDF2 (SHA-256, 100,000 iterations). The key is usable for `encrypt` and `decrypt`.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `password` | `string` | Yes | Source password. |
| `salt` | `Uint8Array` | Yes | Salt bytes. `decryptWithPassword` expects 16. |

**Returns:** `Promise<CryptoKey>`.

**Throws:** `KeyDerivationError` wrapping the underlying WebCrypto error.

## `generateDataKeySecret`

```ts
static generateDataKeySecret(): string
```

Generates 32 random bytes with `crypto.getRandomValues` and returns them as Base64. The SDK uses it as the data key that protects stored wallet data.

**Returns:** `string` — Base64 secret.

## `decryptSignerData`

```ts
static decryptSignerData(
  signerData: EncryptedData,
  passwordProvider: SecretsProvider
): Promise<IHDSecret | IPrivateKeyCredentials>
```

Decrypts the secret stored for a signer with the password from `passwordProvider.getSecret().password` and parses it. The result is `{ privateKey }` for a private-key wallet and `{ seed, rootHDPath }` for an HD wallet, where `rootHDPath` is a [`Bip44Path`](/wallet-sdk/api-reference/key-derivation/#bip44path). This is an internal step of the signing flow, and application code normally goes through [`Client`](/wallet-sdk/api-reference/client/).

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `signerData` | `EncryptedData` | Yes | Encrypted signer secret. |
| `passwordProvider` | `SecretsProvider` | Yes | Supplies the password. |

**Returns:** `Promise<IHDSecret | IPrivateKeyCredentials>`.

**Throws:** the errors of `decryptWithPassword`, and `CorruptedDataError` if the decrypted text is not a valid wallet secret.
