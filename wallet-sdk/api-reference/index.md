# Wallet SDK — API Reference

Complete API reference for ASI Chain Wallet SDK services, domains, and utilities.

**Source code**: [github.com/asi-alliance/asi-chain-wallet-sdk](https://github.com/asi-alliance/asi-chain-wallet-sdk)


## Services

### [WalletsService](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/services/Wallets/index.ts)

Wallet creation and address derivation.

---

#### `createWallet`

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

---

#### `createWalletFromMnemonic`

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

---

#### `deriveAddressFromPrivateKey`

```ts
deriveAddressFromPrivateKey(privateKey: Uint8Array): Address
```

Derives a blockchain address from a private key by first computing the public key.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `privateKey` | `Uint8Array` | Yes | secp256k1 private key (32 bytes). |

**Returns:** `Address` — Base58-encoded address with chain prefix and checksum.

---

#### `deriveAddressFromPublicKey`

```ts
deriveAddressFromPublicKey(publicKey: Uint8Array): Address
```

Derives an address from a public key: applies keccak256 hashing, prepends chain prefix, computes blake2b checksum, and encodes with Base58.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `publicKey` | `Uint8Array` | Yes | secp256k1 public key bytes. |

**Returns:** `Address` — Base58-encoded address prefixed with `"1111"`.

---

### [CryptoService](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/services/Crypto/index.ts)

Password-based encryption and decryption using WebCrypto API.

**Crypto profile:**

| Parameter | Value |
|-----------|-------|
| Version | 2 |
| KDF | PBKDF2, 100,000 iterations, SHA-256 |
| Cipher | AES-GCM, 256-bit key |
| Salt | 16 bytes (random) |
| IV | 12 bytes (random) |

---

#### `encryptWithPassword`

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

---

#### `decryptWithPassword`

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

---

#### `deriveKey`

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

---

### [MnemonicService](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/services/Mnemonic/index.ts)

BIP-39 mnemonic generation and validation.

**Enum `MnemonicStrength`:**

| Value | Constant | Entropy |
|-------|----------|---------|
| `128` | `TWELVE_WORDS` | 128 bits → 12 words |
| `256` | `TWENTY_FOUR_WORDS` | 256 bits → 24 words |

---

#### `generateMnemonic`

```ts
generateMnemonic(strength?: MnemonicStrength): string
```

Generates a new BIP-39 mnemonic phrase.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `strength` | `MnemonicStrength` | No | Entropy bits. Defaults to `MnemonicStrength.TWELVE_WORDS` (128 bits, 12 words). |

**Returns:** `string` — space-separated mnemonic phrase.

---

#### `generateMnemonicArray`

```ts
generateMnemonicArray(strength?: MnemonicStrength): string[]
```

Generates a mnemonic and returns it split into individual words.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `strength` | `MnemonicStrength` | No | Entropy bits. Defaults to `MnemonicStrength.TWELVE_WORDS`. |

**Returns:** `string[]` — array of mnemonic words.

---

#### `isMnemonicValid`

```ts
isMnemonicValid(mnemonic: string): boolean
```

Validates a BIP-39 mnemonic phrase using the bip39 library (checks wordlist membership and checksum).

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `mnemonic` | `string` | Yes | Mnemonic phrase to validate. |

**Returns:** `boolean` — `true` if the mnemonic is valid.

---

#### `mnemonicToWordArray`

```ts
mnemonicToWordArray(mnemonic: string): string[]
```

Splits a mnemonic string into an array of words by whitespace.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `mnemonic` | `string` | Yes | Mnemonic string. |

**Returns:** `string[]` — individual words.

---

#### `wordArrayToMnemonic`

```ts
wordArrayToMnemonic(words: string[]): string
```

Joins an array of mnemonic words into a space-separated string.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `words` | `string[]` | Yes | Array of BIP-39 words. |

**Returns:** `string` — mnemonic phrase.

---

### [KeyDerivationService](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/services/KeyDerivation/index.ts)

BIP-32/BIP-44 hierarchical deterministic key derivation.

**Interface `Bip44PathOptions`:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `coinType` | `number` | Yes | BIP-44 coin type (ASI uses `60`). |
| `account` | `number` | No | Account index. Defaults to `0`. |
| `change` | `number` | No | `0` = external chain, `1` = internal. Defaults to `0`. |
| `index` | `number` | No | Address index. Defaults to `0`. |

---

#### `buildBip44Path`

```ts
buildBip44Path(options: Bip44PathOptions): string
```

Constructs a BIP-44 derivation path string from the provided options.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `options` | `Bip44PathOptions` | Yes | Path components (coinType, account, change, index). |

**Returns:** `string` — derivation path in the format `m/44'/coinType'/account'/change/index`.

---

#### `derivePrivateKey`

```ts
derivePrivateKey(masterNode: BIP32Interface, path: string): Uint8Array
```

Derives a private key from a BIP-32 master node along the specified path.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `masterNode` | `BIP32Interface` | Yes | Master BIP-32 node. |
| `path` | `string` | Yes | BIP-32 derivation path (e.g., `"m/44'/60'/0'/0/0"`). |

**Returns:** `Uint8Array` — private key (32 bytes).

**Throws:** `Error("No private key at derived node")` — if the derived node does not contain a private key.

---

#### `mnemonicToSeed`

```ts
mnemonicToSeed(mnemonicWords: string[] | string, passphrase?: string): Promise<Uint8Array>
```

Converts a mnemonic to a 64-byte BIP-39 seed using PBKDF2-HMAC-SHA512.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `mnemonicWords` | `string[] \| string` | Yes | Mnemonic as array or space-separated string. |
| `passphrase` | `string` | No | Optional BIP-39 passphrase. Defaults to `""`. |

**Returns:** `Promise<Uint8Array>` — seed bytes (64 bytes).

---

#### `seedToMasterNode`

```ts
seedToMasterNode(seed: Uint8Array): BIP32Interface
```

Creates a BIP-32 master node from a seed using tiny-secp256k1 and the bip32 factory.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `seed` | `Uint8Array` | Yes | Seed bytes (typically 64 bytes from `mnemonicToSeed`). |

**Returns:** `BIP32Interface` — master node for key derivation.

---

#### `deriveKeyFromMnemonic`

```ts
deriveKeyFromMnemonic(mnemonicWords: string[], options?: Bip44PathOptions): Promise<Uint8Array>
```

Full derivation pipeline: mnemonic → seed → master node → private key.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `mnemonicWords` | `string[]` | Yes | Mnemonic word array. |
| `options` | `Bip44PathOptions` | No | BIP-44 path options. Uses defaults if omitted. |

**Returns:** `Promise<Uint8Array>` — derived private key (32 bytes).

---

#### `deriveNextKeyFromMnemonic`

```ts
deriveNextKeyFromMnemonic(
  mnemonicWords: string[],
  currentIndex: number,
  options?: Omit<Bip44PathOptions, 'index'>
): Promise<Uint8Array>
```

Derives the key at `currentIndex + 1` from the mnemonic.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `mnemonicWords` | `string[]` | Yes | Mnemonic word array. |
| `currentIndex` | `number` | Yes | Current derivation index. The next key is derived at `currentIndex + 1`. |
| `options` | `Omit<Bip44PathOptions, 'index'>` | No | BIP-44 path options (without index). |

**Returns:** `Promise<Uint8Array>` — private key at the next index.

---

### [KeysManager](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/services/KeysManager/index.ts)

secp256k1 key generation and management utilities.

**Interface `KeyPair`:**

| Field | Type | Description |
|-------|------|-------------|
| `privateKey` | `Uint8Array` | Private key (32 bytes). |
| `publicKey` | `Uint8Array` | Derived public key. |

---

#### `generateRandomKey`

```ts
generateRandomKey(length?: number): Uint8Array
```

Generates cryptographically secure random bytes.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `length` | `number` | No | Number of bytes. Defaults to `32` (private key length). Must be a positive integer. |

**Returns:** `Uint8Array` — random bytes.

**Throws:** `Error("PrivateKeyLength must be a positive integer")` — if `length` is not a positive integer.

---

#### `generateKeyPair`

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

---

#### `getKeyPairFromPrivateKey`

```ts
getKeyPairFromPrivateKey(privateKey: Uint8Array): KeyPair
```

Derives a `KeyPair` from an existing private key.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `privateKey` | `Uint8Array` | Yes | secp256k1 private key (32 bytes). |

**Returns:** `KeyPair` — `{ privateKey, publicKey }`.

---

#### `getPublicKeyFromPrivateKey`

```ts
getPublicKeyFromPrivateKey(privateKey: Uint8Array): Uint8Array
```

Derives the public key from a private key.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `privateKey` | `Uint8Array` | Yes | secp256k1 private key (32 bytes). |

**Returns:** `Uint8Array` — compressed public key.

---

#### `convertKeyToHex`

```ts
convertKeyToHex(key: Uint8Array): string
```

Converts a binary key to a lowercase hex string.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `key` | `Uint8Array` | Yes | Key bytes to encode. |

**Returns:** `string` — hex-encoded key.

---

#### `deriveKeyFromMnemonic`

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

---

### [SignerService](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/services/Signer/index.ts)

Builds and signs deploy payloads without exposing raw key bytes to callers.

---

#### `sign`

```ts
sign(request: SigningRequest, passwordProvider: PasswordProvider): Promise<SignedResult>
```

Signs a deploy using the wallet's password-protected private key. The signing flow: obtains password from `passwordProvider`, unlocks the wallet via `withSigningCapability`, serializes the deploy using `BinaryWriter`, hashes with blake2b-256, signs with secp256k1, and returns the result. The decrypted key is zeroed immediately after signing.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `request` | `SigningRequest` | Yes | Object with `wallet: Wallet` and `data: DeployData` to sign. |
| `passwordProvider` | `PasswordProvider` | Yes | Async callback returning the wallet password: `() => Promise<string>`. |

**Returns:** `Promise<SignedResult>` — object with:
- `data` — deploy fields (term, timestamp, phloPrice, phloLimit, validAfterBlockNumber, shardId)
- `deployer: string` — hex-encoded public key
- `signature: string` — hex-encoded secp256k1 signature
- `sigAlgorithm: string` — `"secp256k1"`

**Throws:** `Error("SignerService.sign: ${errorMessage}")` — wraps any internal error.

> **Security note:** The normal signing path never returns decrypted private key bytes. The signing capability expires as soon as the callback returns.

---

### [AssetsService](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/services/AssetsService/index.ts)

Balance queries and token transfers via `BlockchainGateway`.

---

#### `transfer`

```ts
transfer(
  fromAddress: Address,
  toAddress: Address,
  amount: bigint,
  wallet: Wallet,
  passwordProvider: PasswordProvider,
  phloLimit?: number
): Promise<string | undefined>
```

Transfers ASI tokens from one address to another by constructing, signing, and submitting a deploy. Both addresses are validated before submission.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `fromAddress` | `Address` | Yes | Sender address. Must pass `validateAddress()`. |
| `toAddress` | `Address` | Yes | Recipient address. Must pass `validateAddress()`. |
| `amount` | `bigint` | Yes | Amount in atomic units. Must be greater than zero. |
| `wallet` | `Wallet` | Yes | Wallet used to sign the transfer deploy. |
| `passwordProvider` | `PasswordProvider` | Yes | Async callback returning the wallet password. |
| `phloLimit` | `number` | No | Gas limit. Defaults to `DEFAULT_PHLO_LIMIT` from config. |

**Returns:** `Promise<string | undefined>` — deploy ID on success.

**Throws:**
- `Error("AssetsService.transfer: Invalid 'fromAddress': ${errorCode}")` — sender address validation failed.
- `Error("AssetsService.transfer: Invalid 'toAddress': ${errorCode}")` — recipient address validation failed.
- `Error("AssetsService.transfer: Transfer amount must be greater than zero")` — if `amount ≤ 0`.
- `Error("AssetsService.transfer: Invalid block number")` — if the blockchain returns an invalid block number.
- `Error("AssetsService.transfer: ${message}")` — wraps signer or gateway errors.

---

#### `getASIBalance`

```ts
getASIBalance(address: Address): Promise<bigint>
```

Retrieves the ASI balance for an address using an exploratory deploy.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `address` | `Address` | Yes | Address to query. Must pass `validateAddress()`. |

**Returns:** `Promise<bigint>` — balance in atomic units. Returns `BigInt(0)` on any error or if the address has no balance.

---

### [DeployResubmitter](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/services/Resubmit/DeployResubmitter.ts)

Retry and resubmission logic for non-read-only deploys.

**Interface `ResubmitConfig`:**

| Field | Type | Description |
|-------|------|-------------|
| `deployValiditySeconds` | `number` | Deploy expiry time in seconds. |
| `deployRetries` | `number` | Maximum retry attempts per node. |
| `deployIntervalSeconds` | `number` | Delay between retry attempts. |
| `pollingIntervalSeconds` | `number` | Interval between status polls. |
| `nodeSelectionAttempts` | `number` | Number of node selection attempts. |
| `useRandomNode` | `boolean` | Whether to pick a random node from the pool. |

**`ResubmitResult`** fields: `success: boolean`, `deployId?: string`, `deployStatus?: DeployStatus`, `error?: DeployError`.

**Constructor:**

```ts
new DeployResubmitter(config: ResubmitConfig, availableNodesUrls: string[])
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `config` | `ResubmitConfig` | Yes | Retry and polling configuration. |
| `availableNodesUrls` | `string[]` | Yes | Pool of validator node URLs for resubmission. |

**Throws:** `Error("BlockchainGateway is not initialized")` — if `BlockchainGateway.init()` was not called.

---

#### `resubmit`

```ts
resubmit(
  rholangCode: string,
  wallet: Wallet,
  passwordProvider: PasswordProvider,
  phloLimit?: number
): Promise<ResubmitResult>
```

Submits a Rholang deploy with automatic retry and status polling. Does not throw — all errors are captured in the returned `ResubmitResult`.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `rholangCode` | `string` | Yes | Rholang smart contract code to deploy. |
| `wallet` | `Wallet` | Yes | Wallet used to sign the deploy. |
| `passwordProvider` | `PasswordProvider` | Yes | Async callback returning the wallet password. |
| `phloLimit` | `number` | No | Gas limit. Defaults to `DEFAULT_PHLO_LIMIT`. |

**Returns:** `Promise<ResubmitResult>` — `{ success, deployId?, deployStatus?, error? }`.

**Flow:**
1. Connects to a node (default or random from pool).
2. Signs and submits the deploy; retries up to `deployRetries` times with `deployIntervalSeconds` delay.
3. Polls for block inclusion every `pollingIntervalSeconds` until `deployValiditySeconds` expires.
4. Returns result with final status.

Related exports: [`ResubmitNodeManager`](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/services/Resubmit/NodeManager.ts), `ResubmitConfig`, `ResubmitResult`.


## Domains

### [Wallet](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/domains/Wallet/index.ts)

Encrypted wallet container with a scoped signing capability boundary.

**Type `Address`** — `1111${string}` branded type. All address parameters in the SDK expect this type.

**Interface `SigningCapability`:**

| Method | Description |
|--------|-------------|
| `signDigest(digest: Uint8Array): Promise<Uint8Array>` | Signs a raw digest. |
| `getPublicKey(): Uint8Array` | Returns the public key. |

The capability is only valid within the `withSigningCapability` callback scope. Attempting to use it after the callback returns throws an error.

---

#### `Wallet.fromPrivateKey` (static)

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

---

#### `Wallet.fromEncryptedData` (static)

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

---

#### `withSigningCapability`

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

---

#### `getEncryptedPrivateKey`

```ts
getEncryptedPrivateKey(): EncryptedData
```

Returns the encrypted private key object.

**Returns:** `EncryptedData` — `{ data, salt, iv, version }`.

---

#### `registerAsset`

```ts
registerAsset(asset: Asset): void
```

Registers an asset with the wallet.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `asset` | `Asset` | Yes | Asset to register. |

---

#### `getAddress`

```ts
getAddress(): Address
```

Returns the wallet's blockchain address.

**Returns:** `Address`.

---

#### `getName`

```ts
getName(): string
```

Returns the wallet's human-readable name.

**Returns:** `string`.

---

#### `getIndex`

```ts
getIndex(): number | null
```

Returns the BIP-44 derivation index, or `null` if the wallet was not derived from a mnemonic.

**Returns:** `number | null`.

---

#### `getAssets`

```ts
getAssets(): Assets
```

Returns the map of registered assets.

**Returns:** `Assets` — `Map<AssetId, Asset>`.

---

#### `isWalletLocked`

```ts
isWalletLocked(): boolean
```

Returns `true` if the wallet is currently locked (private key is not in memory).

**Returns:** `boolean`.

---

#### `toString`

```ts
toString(): string
```

Serializes wallet metadata to a JSON string. The private key is never included — only the encrypted payload, address, name, and index.

**Returns:** `string` — JSON-encoded `StoredWalletMeta`.

---

### [Vault](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/domains/Vault/index.ts)

Encrypted browser vault for managing multiple wallets and encrypted seed records.

> **Browser only.** Vault uses `localStorage` via `BrowserStorage`. All methods that access vault contents throw if the vault is locked.

---

#### Constructor

```ts
new Vault(vaultData?: string)
```

Creates a new Vault instance. If `vaultData` is provided, it is treated as previously saved encrypted vault data.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `vaultData` | `string` | No | Encrypted vault JSON string from `localStorage`. |

**Throws:** `Error("getVault can only be called in a browser environment")` — if `localStorage` is unavailable.

---

#### `Vault.getSavedVaultKeys` (static)

```ts
Vault.getSavedVaultKeys(): string[]
```

Returns all vault storage keys found in `localStorage`.

**Returns:** `string[]` — array of storage key strings.

---

#### `Vault.getVaultDataFromStorage` (static)

```ts
Vault.getVaultDataFromStorage(vaultKey: string): string | null
```

Reads encrypted vault data from `localStorage`.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `vaultKey` | `string` | Yes | Storage key (e.g., `"0"`). |

**Returns:** `string | null` — encrypted vault JSON or `null` if not found.

---

#### `isVaultLocked`

```ts
isVaultLocked(): boolean
```

Returns `true` if the vault is locked.

**Returns:** `boolean`.

---

#### `lock`

```ts
lock(password: string): Promise<void>
```

Encrypts all vault data (wallets and seeds) with the provided password and marks the vault as locked.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `password` | `string` | Yes | Password for encryption. |

---

#### `unlock`

```ts
unlock(password: string): Promise<void>
```

Decrypts the vault with the provided password and loads wallet and seed data into memory.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `password` | `string` | Yes | Password for decryption. |

**Throws:** `Error("Vault was unlocked on undefined encryptedVaultData")` — if the vault has no encrypted data to decrypt.

---

#### `save`

```ts
save(vaultKey?: string): void
```

Persists the locked vault to `localStorage`.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `vaultKey` | `string` | No | Storage key. Defaults to `"0"`. |

**Throws:** `Error("Cannot save an unlocked vault")` — vault must be locked before saving.

---

#### `isEmpty`

```ts
isEmpty(): boolean
```

Returns `true` if the vault contains no wallets.

**Returns:** `boolean`.

**Throws:** `Error("Attempted to access locked vault")` — if called while locked.

---

#### Wallet operations

All wallet methods throw `Error("Attempted to access locked vault")` if the vault is locked.

```ts
getWallets(): Wallet[]
getWalletsCount(): number
getWalletAddresses(): Address[]
addWallet(wallet: Wallet): void
removeWallet(address: Address): void
getWallet(address: Address): Wallet | undefined
hasWallet(address: Address): boolean
```

---

#### Seed / encrypted-record operations

All seed methods throw `Error("Attempted to access locked vault")` if the vault is locked.

```ts
getSeeds(): EncryptedRecord[]
getSeedsIds(): string[]
getSeed(id: string): EncryptedRecord | undefined
addSeed(id: string, seed: EncryptedRecord): void
removeSeed(id: string): void
hasSeed(seedId: string): boolean
```

---

#### `toString`

```ts
toString(): string
```

Serializes vault contents (wallets and seeds) to a JSON string. Used internally before locking.

**Returns:** `string` — JSON representation.

**Throws:** `Error("Attempted to access locked vault")` — if called while locked.

---

### [Asset](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/domains/Asset/index.ts)

Simple token model.

**Types:** `AssetId = string`, `Assets = Map<AssetId, Asset>`.

---

#### Constructor

```ts
new Asset(id: string, name: string, decimals?: number)
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | Yes | Unique asset identifier. |
| `name` | `string` | Yes | Human-readable asset name. |
| `decimals` | `number` | No | Decimal precision. Defaults to `ASI_DECIMALS` (`8`). |

---

```ts
getId(): string
getName(): string
getDecimals(): number
```

---

### [EncryptedRecord](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/domains/EncryptedRecord/index.ts)

Encrypted data wrapper used by vault seed flows.

---

#### `EncryptedRecord.createAndEncrypt` (static)

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

---

#### `EncryptedRecord.createFromEncryptedData` (static)

```ts
EncryptedRecord.createFromEncryptedData(encryptedData: EncryptedData): EncryptedRecord
```

Creates a record from a pre-existing `EncryptedData` object.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `encryptedData` | `EncryptedData` | Yes | Pre-encrypted data object. |

**Returns:** `EncryptedRecord`.

---

#### `EncryptedRecord.createFromStringifiedEncryptedData` (static)

```ts
EncryptedRecord.createFromStringifiedEncryptedData(data: string): EncryptedRecord
```

Creates a record from a JSON string representation of `EncryptedData`. Used when restoring from storage.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `data` | `string` | Yes | JSON string of `EncryptedData`. |

**Returns:** `EncryptedRecord`.

**Throws:** JSON parse errors if `data` is malformed.

---

#### `decrypt`

```ts
decrypt(password: string): Promise<string>
```

Decrypts the record with the provided password.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `password` | `string` | Yes | Decryption password. |

**Returns:** `Promise<string>` — plaintext.

**Throws:** `CryptoService.decryptWithPassword` errors on wrong password or unsupported version.

---

#### `toString`

```ts
toString(): string
```

Serializes the encrypted record to a JSON string.

**Returns:** `string` — JSON of `EncryptedData`.

---

### [BlockchainGateway](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/domains/BlockchainGateway/index.ts)

Singleton gateway for validator and indexer node communication. Must be initialized with `BlockchainGateway.init()` before use.

**Interface `BlockchainGatewayConfig`:**

| Field | Type | Description |
|-------|------|-------------|
| `validator` | `GatewayClientConfig` | Validator node config (`baseUrl`, optional `axiosConfig`). |
| `indexer` | `GatewayClientConfig` | Indexer (observer) node config. |

**Enum `DeployStatus`:**

| Value | Constant | Description |
|-------|----------|-------------|
| `"Deploying"` | `DEPLOYING` | Deploy submitted, not yet included. |
| `"IncludedInBlock"` | `INCLUDED_IN_BLOCK` | Deploy included in a block. |
| `"Finalized"` | `FINALIZED` | Block finalized (faultTolerance ≥ 0.8). |
| `"CheckingError"` | `CHECK_ERROR` | Error occurred while checking status. |

---

#### `BlockchainGateway.init` (static)

```ts
BlockchainGateway.init(config: BlockchainGatewayConfig): BlockchainGateway
```

Initializes the singleton instance. Safe to call multiple times — reinitializes with new config.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `config` | `BlockchainGatewayConfig` | Yes | Validator and indexer node URLs. |

**Returns:** `BlockchainGateway` — singleton instance.

---

#### `BlockchainGateway.isInitialized` (static)

```ts
BlockchainGateway.isInitialized(): boolean
```

Returns `true` if `init()` has been called.

**Returns:** `boolean`.

---

#### `BlockchainGateway.getInstance` (static)

```ts
BlockchainGateway.getInstance(): BlockchainGateway
```

Returns the singleton instance.

**Returns:** `BlockchainGateway`.

**Throws:** `Error("BlockchainGateway is not initialized. Call BlockchainGateway.init() first.")` — if `init()` was not called.

---

#### `changeValidator`

```ts
changeValidator(config: GatewayClientConfig): BlockchainGateway
```

Replaces the active validator client. Returns `this` for method chaining.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `config` | `GatewayClientConfig` | Yes | New validator config with `baseUrl`. |

**Returns:** `this`.

---

#### `changeIndexer`

```ts
changeIndexer(config: GatewayClientConfig): BlockchainGateway
```

Replaces the active indexer client. Returns `this` for method chaining.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `config` | `GatewayClientConfig` | Yes | New indexer config with `baseUrl`. |

**Returns:** `this`.

---

#### `submitDeploy`

```ts
submitDeploy(deployData: SignedResult): Promise<string | undefined>
```

Submits a signed deploy to the validator node.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `deployData` | `SignedResult` | Yes | Signed deploy from `SignerService.sign()`. |

**Returns:** `Promise<string | undefined>` — deploy ID on success.

**Throws:** `Error("BlockchainGateway.submitDeploy: ${axiosError}")` — on network or API error.

---

#### `submitExploratoryDeploy`

```ts
submitExploratoryDeploy(rholangCode: string): Promise<any>
```

Submits a read-only exploratory deploy to the indexer node.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `rholangCode` | `string` | Yes | Rholang code for the exploratory query. |

**Returns:** `Promise<any>` — raw API response.

**Throws:** `Error("BlockchainGateway.submitExploratoryDeploy: ${message}")`.

---

#### `exploreDeployData`

```ts
exploreDeployData(rholangCode: string): Promise<any>
```

Submits an exploratory deploy and extracts the `expr` field from the response.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `rholangCode` | `string` | Yes | Rholang query code. |

**Returns:** `Promise<any>` — expressions array from the response.

**Throws:** `Error("BlockchainGateway.exploreDeployData: ${message}")`.

---

#### `getDeploy`

```ts
getDeploy(deployHash: string): Promise<any>
```

Retrieves deploy details by hash from the indexer.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `deployHash` | `string` | Yes | Deploy ID returned by `submitDeploy`. |

**Returns:** `Promise<any>` — deploy details object.

---

#### `getDeployStatus`

```ts
getDeployStatus(deployHash: string): Promise<DeployStatusResult>
```

Returns the current status of a deploy. Does not throw — errors are captured in the result.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `deployHash` | `string` | Yes | Deploy ID. |

**Returns:** `Promise<DeployStatusResult>` — status or `{ status: CHECK_ERROR, errorMessage }`.

---

#### `getLatestBlockNumber`

```ts
getLatestBlockNumber(): Promise<number>
```

Returns the latest block number from the validator.

**Returns:** `Promise<number>` — block number, or `-1` (`INVALID_BLOCK_NUMBER`) on error.

---

#### `isValidatorActive`

```ts
isValidatorActive(): Promise<boolean>
```

Health-checks the validator by calling its `/status` endpoint.

**Returns:** `Promise<boolean>` — `true` if the validator responds successfully.

---

#### `getValidatorClientUrl`

```ts
getValidatorClientUrl(): string
```

Returns the configured validator base URL.

**Returns:** `string`.

---

### [BrowserStorage](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/domains/BrowserStorage/index.ts)

`localStorage` adapter with prefix-based key isolation. All keys are stored as `${prefix}_${id}`.

---

#### Constructor

```ts
new BrowserStorage(prefix?: string)
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `prefix` | `string` | No | Key prefix for namespace isolation. Defaults to `"storage_prefix"`. |

**Throws:** `Error("localStorage is not supported in this environment.")` — if `localStorage` is not available.

---

```ts
write(id: string, data: string): void   // Writes data under prefixed key
read(id: string): string | null         // Reads data by id; null if missing
delete(id: string): void                // Deletes a prefixed key
has(id: string): boolean                // Checks if key exists
isEmpty(): boolean                      // True if no prefixed keys exist
clear(): void                           // Removes all prefixed keys
```

---

### [Signing Types](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/domains/Signer/index.ts)

```ts
interface SigningRequest {
  wallet: Wallet;
  data: any;        // Deploy data to sign
}

interface SignedResult {
  data: any;            // Signed deploy fields
  deployer: string;     // Hex-encoded public key
  signature: string;    // Hex-encoded secp256k1 signature
  sigAlgorithm: string; // "secp256k1"
}

type PasswordProvider = () => Promise<string>
```


## Utilities

### [Codec](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/utils/codec/index.ts)

Encoding and decoding helpers for Base16, Base58, and Base64.

---

#### `encodeBase58`

```ts
encodeBase58(hex: string): string
```

Converts a hex string to a Base58-encoded string.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `hex` | `string` | Yes | Hex string to encode. |

**Returns:** `string` — Base58-encoded result.

---

#### `decodeBase16`

```ts
decodeBase16(hex: string): Uint8Array
```

Parses a hex string into a `Uint8Array`.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `hex` | `string` | Yes | Hex string (even length, lowercase or uppercase). |

**Returns:** `Uint8Array` — decoded bytes.

---

#### `encodeBase16`

```ts
encodeBase16(bytes: Uint8Array): string
```

Encodes bytes to a lowercase hex string (zero-padded).

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `bytes` | `Uint8Array` | Yes | Bytes to encode. |

**Returns:** `string` — hex string.

---

#### `arrayBufferToBase64`

```ts
arrayBufferToBase64(buffer: ArrayBuffer): string
```

Converts an `ArrayBuffer` to a Base64 string.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `buffer` | `ArrayBuffer` | Yes | Buffer to encode. |

**Returns:** `string` — Base64 string.

---

#### `base64ToArrayBuffer`

```ts
base64ToArrayBuffer(base64: string): ArrayBuffer
```

Converts a Base64 string to an `ArrayBuffer`.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `base64` | `string` | Yes | Base64 string to decode. |

**Returns:** `ArrayBuffer`.

---

### [Constants](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/utils/constants/index.ts)

Library-wide constants.

| Constant | Description |
|----------|-------------|
| `ASI_CHAIN_PREFIX` | Chain payload prefix used for address construction (`{ coinId, version }`) |
| `ASI_COIN_TYPE` | Coin type for BIP-44 derivation (`60`) |
| `ASI_DECIMALS` | Number of decimal places for ASI (`8`) |
| `GasFee` | Gas fee constants: `BASE_FEE`, `VARIATION_RANGE`, `LABEL`, `TRANSFER`, `DEPLOY` |
| `POWER_BASE` | Base used for power calculations (`10`) |
| `ASI_BASE_UNIT` | Atomic unit multiplier: `BigInt(10) ** BigInt(8)` = `100_000_000` |

---

### [Functions](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/utils/functions/index.ts)

Amount conversion helpers between human-readable ASI values and atomic integer representation.

1 ASI = `100_000_000` atomic units (`ASI_BASE_UNIT`).

---

#### `toAtomicAmount`

```ts
toAtomicAmount(amount: number | string): bigint
```

Converts a human-readable ASI amount to atomic units. Handles thousands separators (commas, spaces), truncates excess fractional digits (with a console warning), and supports negative values.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `amount` | `number \| string` | Yes | Decimal amount (e.g., `"1,234.56"` or `1234.56`). |

**Returns:** `bigint` — atomic amount.

**Throws:**
- `Error("Cannot process empty amount")` — if string is empty.
- `Error("Invalid amount format")` — if the format cannot be parsed.
- `Error("Invalid number")` — if a numeric input is not finite.

---

#### `fromAtomicAmountToString`

```ts
fromAtomicAmountToString(atomicAmount: bigint): string
```

Converts atomic units to a normalized decimal string. Trailing zeros are trimmed.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `atomicAmount` | `bigint` | Yes | Atomic amount. |

**Returns:** `string` — decimal string (e.g., `"1234.56789012"`).

---

#### `fromAtomicAmountToNumber`

```ts
fromAtomicAmountToNumber(atomicAmount: bigint): number
```

Converts atomic units to a JavaScript `number`. Logs a warning if the integer part exceeds `Number.MAX_SAFE_INTEGER`.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `atomicAmount` | `bigint` | Yes | Atomic amount. |

**Returns:** `number`.

---

#### `fromAtomicAmount`

```ts
fromAtomicAmount(atomicAmount: bigint): string
```

Alias for `fromAtomicAmountToString`.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `atomicAmount` | `bigint` | Yes | Atomic amount. |

**Returns:** `string` — decimal string.

---

**Example:**

```ts
const atomic = toAtomicAmount("1,234.56789012"); // BigInt(123456789012)
const str = fromAtomicAmountToString(atomic);    // "1234.56789012"
const num = fromAtomicAmountToNumber(atomic);    // 1234.56789012
```

---

### [Validators](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/utils/validators/index.ts)

Validation helpers for account names and blockchain addresses.

---

#### `validateAccountName`

```ts
validateAccountName(name: string, maxLength?: number): { isValid: boolean; error?: string }
```

Validates a wallet or account name.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `name` | `string` | Yes | Account name to validate. |
| `maxLength` | `number` | No | Maximum allowed length. Defaults to `30`. |

**Returns:** `{ isValid: boolean; error?: string }` — `error` is set if `isValid` is `false`.

**Constraints:**
- Must be non-empty after trimming.
- Must not exceed `maxLength` characters.
- Must not contain forbidden filesystem characters: `< > : " / \ | ? *`.

---

#### `isAddress`

```ts
isAddress(address: string): address is Address
```

Type guard that checks if a string is a valid `Address`. Runs the full decode + checksum validation.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `address` | `string` | Yes | String to check. |

**Returns:** `boolean` — `true` if the string is a valid `Address`.

---

#### `validateAddress`

```ts
validateAddress(address: string): { isValid: boolean; errorCode?: AddressValidationErrorCode }
```

Performs detailed multi-step validation of an ASI address. Returns a specific error code if validation fails.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `address` | `string` | Yes | Address string to validate. |

**Returns:** `{ isValid: boolean; errorCode?: AddressValidationErrorCode }`.

**Validation steps (in order):**

| Step | ErrorCode | Check |
|------|-----------|-------|
| 1 | `INVALID_PREFIX` | Must start with `"1111"` |
| 2 | `INVALID_LENGTH` | Length must be between 50 and 54 characters |
| 3 | `INVALID_ALPHABET` | Must contain only alphanumeric characters |
| 4 | `INVALID_BASE58` | Must use valid Base58 alphabet (no `0`, `O`, `I`, `l`) |
| 5 | `INVALID_HEX_LENGTH` | Decoded hex must be 80 characters (72 payload + 8 checksum) |
| 6 | `NON_CANONICAL` | Re-encoding the decoded bytes must produce the same address |
| 7 | `INVALID_CHAIN_PREFIX` | Payload must start with ASI chain prefix |
| 8 | `INVALID_CHECKSUM` | Blake2b-256 of payload — first 8 hex chars must match checksum |

---

### [Polyfills](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/utils/polyfills/index.ts)

```ts
setupBufferPolyfill(): void
```

Ensures `window.Buffer` is available in browser environments by assigning Node's `Buffer` from the `buffer` package when missing. No-op in non-browser environments. Call this once at application startup if using the SDK in a browser context without a bundler that provides `Buffer` globally.
