# Wallet

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/domains/Wallet/index.ts)

Encrypted wallet container with a scoped signing capability boundary.

**Type `Address`** — `1111${string}` branded type. All address parameters in the SDK expect this type.

**Interface `SigningCapability`:**

| Method | Description |
|--------|-------------|
| `signDigest(digest: Uint8Array): Promise<Uint8Array>` | Signs a raw digest. |
| `getPublicKey(): Uint8Array` | Returns the public key. |

The capability is only valid within the `withSigningCapability` callback scope.

## `Wallet.fromPrivateKey` (static)

```ts
Wallet.fromPrivateKey(
  name: string,
  privateKey: Uint8Array,
  password: string,
  masterNodeId?: string | null,
  index?: number | null
): Promise<Wallet>
```

Creates a new `Wallet` by encrypting the private key with the provided password.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `name` | `string` | Yes | Human-readable wallet name. |
| `privateKey` | `Uint8Array` | Yes | secp256k1 private key (32 bytes). |
| `password` | `string` | Yes | Password used to encrypt the private key. |
| `masterNodeId` | `string \| null` | No | ID of the master key node (used for HD wallet tracking). |
| `index` | `number \| null` | No | BIP-44 derivation index. |

**Returns:** `Promise<Wallet>` — new wallet instance with encrypted private key.

## `Wallet.fromEncryptedData` (static)

```ts
Wallet.fromEncryptedData(
  name: string,
  address: Address,
  encryptedPrivateKey: EncryptedData,
  masterNodeId: string | null,
  index: number | null
): Wallet
```

Creates a `Wallet` from pre-encrypted data. Used when restoring a wallet from storage.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `name` | `string` | Yes | Wallet name. |
| `address` | `Address` | Yes | Wallet address. Must pass full `validateAddress()`. |
| `encryptedPrivateKey` | `EncryptedData` | Yes | Encrypted private key object. |
| `masterNodeId` | `string \| null` | Yes | Master key ID or `null`. |
| `index` | `number \| null` | Yes | Derivation index or `null`. |

**Returns:** `Wallet` — restored wallet instance.

**Throws:** `Error("Invalid address format: ${errorCode}")` — if address validation fails.

## `withSigningCapability`

```ts
wallet.withSigningCapability<T>(
  password: string,
  callback: (capability: SigningCapability) => Promise<T> | T
): Promise<T>
```

Grants a scoped signing capability to `callback`. Decrypts the private key, invokes `callback` with a `SigningCapability` object, then zeros the key from memory. The capability cannot be used after the callback returns.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `password` | `string` | Yes | Password to decrypt the private key. |
| `callback` | `(capability: SigningCapability) => Promise<T> \| T` | Yes | Function that uses the capability for signing. |

**Returns:** `Promise<T>` — return value of the callback.

**Throws:**
- `Error("Unlock Failed: ${errorMessage}")` — if decryption fails (wrong password or corrupted data).
- `Error("Signing capability has expired")` — if `capability` is used outside the callback scope.

## `getEncryptedPrivateKey`

```ts
getEncryptedPrivateKey(): EncryptedData
```

Returns the encrypted private key object.

**Returns:** `EncryptedData` — `{ data, salt, iv, version }`.

## `registerAsset`

```ts
registerAsset(asset: Asset): void
```

Registers an asset with the wallet.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `asset` | `Asset` | Yes | Asset to register. |

## Other methods

```ts
getAddress(): Address           // Returns the wallet's blockchain address
getName(): string               // Returns the wallet's name
getIndex(): number | null       // Returns BIP-44 derivation index, or null
getAssets(): Assets             // Returns Map<AssetId, Asset> of registered assets
isWalletLocked(): boolean       // True if the private key is not in memory
toString(): string              // JSON-encoded StoredWalletMeta (no private key)
```
