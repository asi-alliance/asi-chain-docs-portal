# EncryptedRecord

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/domains/EncryptedRecord/index.ts)

Encrypted data wrapper used by vault seed flows.

## `EncryptedRecord.createAndEncrypt` (static)

```ts
EncryptedRecord.createAndEncrypt(data: string, password: string): Promise<EncryptedRecord>
```

Creates an `EncryptedRecord` by encrypting `data` with the given password.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `data` | `string` | Yes | Plaintext to encrypt. |
| `password` | `string` | Yes | Encryption password. |

**Returns:** `Promise<EncryptedRecord>`.

## `EncryptedRecord.createFromEncryptedData` (static)

```ts
EncryptedRecord.createFromEncryptedData(encryptedData: EncryptedData): EncryptedRecord
```

Creates a record from a pre-existing `EncryptedData` object.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `encryptedData` | `EncryptedData` | Yes | Pre-encrypted data object. |

**Returns:** `EncryptedRecord`.

## `EncryptedRecord.createFromStringifiedEncryptedData` (static)

```ts
EncryptedRecord.createFromStringifiedEncryptedData(data: string): EncryptedRecord
```

Creates a record from a JSON string of `EncryptedData`. Used when restoring from storage.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `data` | `string` | Yes | JSON string of `EncryptedData`. |

**Returns:** `EncryptedRecord`.

**Throws:** JSON parse errors if `data` is malformed.

## `decrypt`

```ts
decrypt(password: string): Promise<string>
```

Decrypts the record with the provided password.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `password` | `string` | Yes | Decryption password. |

**Returns:** `Promise<string>` — plaintext.

**Throws:** `CryptoService` errors on wrong password or unsupported version.

## `toString`

```ts
toString(): string
```

Serializes the encrypted record to a JSON string.

**Returns:** `string` — JSON of `EncryptedData`.
