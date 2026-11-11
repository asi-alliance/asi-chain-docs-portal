# Crypto

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/v2.1.0/src/services/Crypto/index.ts)

`Crypto` encrypts and decrypts data with a password through WebCrypto. All its methods are static. They need the global `crypto.subtle` and `crypto.getRandomValues`, which browsers provide and Node.js provides globally from version 19.

## Import

```ts
import { Crypto } from "@asichain/asi-wallet-sdk";
```

## Methods

### encryptWithPassword()

```ts
static encryptWithPassword(data: string, password: string): Promise<EncryptedData>
```

Encrypts text with AES-GCM using a key derived from the password. Salt and IV are new for every call.

| Name | Type | Description |
|------|------|-------------|
| `data` | `string` | Plaintext. |
| `password` | `string` | Password for key derivation. |

Returns `Promise<EncryptedData>`.

Throws `KeyDerivationError` if the key cannot be derived.

### decryptWithPassword()

```ts
static decryptWithPassword(payload: EncryptedData, passphrase: string): Promise<string>
```

Decrypts an `EncryptedData` object.

| Name | Type | Description |
|------|------|-------------|
| `payload` | `EncryptedData` | Object produced by `encryptWithPassword`. |
| `passphrase` | `string` | Password used for encryption. |

Returns `Promise<string>` with the plaintext.

It throws one of these errors.

| Error | When |
|-------|------|
| `UnsupportedEncryptionVersionError` | `payload.version` is not `2`. |
| `CorruptedDataError` | `salt` is not 16 bytes, `iv` is not 12 bytes, `data` is shorter than the 16-byte tag, or a field is not valid Base64. |
| `InvalidPasswordError` | AES-GCM rejects the data. This happens with a wrong password and with a modified ciphertext. |
| `KeyDerivationError` | The key cannot be derived. |

The message of `UnsupportedEncryptionVersionError` is `Unsupported version <v> of the encrypted payload, this SDK build supports version 2`.

### deriveKey()

```ts
static deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey>
```

Derives a non-extractable AES-GCM-256 `CryptoKey` from a password with PBKDF2 (SHA-256, 100,000 iterations). The key is usable for `encrypt` and `decrypt`.

| Name | Type | Description |
|------|------|-------------|
| `password` | `string` | Source password. |
| `salt` | `Uint8Array` | Salt bytes. `decryptWithPassword` expects 16. |

Returns `Promise<CryptoKey>`.

Throws `KeyDerivationError` wrapping the underlying WebCrypto error.

### generateDataKeySecret()

```ts
static generateDataKeySecret(): string
```

Generates 32 random bytes with `crypto.getRandomValues` and returns them as Base64. The SDK uses it as the data key that protects stored wallet data.

Returns `string` with the Base64 secret.

### decryptSignerData()

```ts
static decryptSignerData(
  signerData: EncryptedData,
  passwordProvider: SecretsProvider
): Promise<IHDSecret | IPrivateKeyCredentials>
```

Decrypts the secret stored for a signer and parses it. The password comes from `passwordProvider.getSecret().password`. This is an internal step of the signing flow, and application code normally goes through [`Client`](/wallet-sdk/api-reference/client/).

The result depends on the wallet type:

- `{ privateKey }` for a private-key wallet.
- `{ seed, rootHDPath }` for an HD wallet, where `rootHDPath` is a [`Bip44Path`](/wallet-sdk/api-reference/key-derivation/#bip44path).

| Name | Type | Description |
|------|------|-------------|
| `signerData` | `EncryptedData` | Encrypted signer secret. |
| `passwordProvider` | `SecretsProvider` | Supplies the password. |

Returns `Promise<IHDSecret | IPrivateKeyCredentials>`.

Throws the errors of `decryptWithPassword`, and `CorruptedDataError` if the decrypted text is not a valid wallet secret.

## Types

### EncryptedData

| Field | Type | Description |
|-------|------|-------------|
| `data` | `string` | Base64 ciphertext with the GCM tag. |
| `salt` | `string` | Base64 salt. |
| `iv` | `string` | Base64 IV. |
| `version` | `number` | Profile version, `2`. |

### Crypto Profile

| Parameter | Value |
|-----------|-------|
| Version | 2 |
| KDF | PBKDF2, 100,000 iterations, SHA-256 |
| Cipher | AES-GCM, 256-bit key |
| Salt | 16 bytes, random |
| IV | 12 bytes, random |
| Data key | 32 random bytes |

The package also exports the `CryptoConfig` type, which describes these constants.

## Example

```ts
import { Crypto } from '@asichain/asi-wallet-sdk';

const encrypted = await Crypto.encryptWithPassword('secret text', 'a password');
const plain = await Crypto.decryptWithPassword(encrypted, 'a password');
console.log(plain); // secret text
```
