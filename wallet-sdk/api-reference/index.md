# Wallet SDK — API Reference

Complete API reference for ASI Chain Wallet SDK services, domains, and utilities.

---

## Services

### WalletsService

Wallet creation and address derivation.

```ts
createWallet(privateKey?: Uint8Array, options?: CreateWalletOptions): WalletMeta
```
Creates wallet metadata from an existing or generated secp256k1 private key.

```ts
createWalletFromMnemonic(mnemonic?: string, index?: number): Promise<WalletMeta>
```
Builds wallet from BIP-39 mnemonic + BIP-44 path. Always returns normalized mnemonic in output.

- Throws `WalletsService.createWalletFromMnemonic: Recovery mnemonic is missing or invalid` when mnemonic is blank/invalid.

```ts
deriveAddressFromPrivateKey(privateKey: Uint8Array): Address
```
Derives address from private key.

```ts
deriveAddressFromPublicKey(publicKey: Uint8Array): Address
```
Derives address from public key (keccak256 + chain prefix + blake2b checksum + base58).

---

### CryptoService

Password-based encryption/decryption using WebCrypto.

```ts
encryptWithPassword(data: string, password: string): Promise<EncryptedData>
```
Encrypts plaintext with PBKDF2(SHA-256) derived key + AES-GCM.

```ts
decryptWithPassword(payload: EncryptedData, passphrase: string): Promise<string>
```
Decrypts ciphertext payload. Throws on unsupported version or invalid credentials.

```ts
deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey>
```
Derives the AES-GCM key from password + salt.

**Crypto profile:**

| Parameter | Value |
|-----------|-------|
| Version | 2 |
| KDF | PBKDF2, 100,000 iterations, SHA-256 |
| Cipher | AES-GCM |
| Salt | 16 bytes |
| IV | 12 bytes |

---

### MnemonicService

BIP-39 helpers.

```ts
generateMnemonic(strength?: MnemonicStrength): string
```
Generates mnemonic phrase (12 or 24 words).

```ts
generateMnemonicArray(strength?: MnemonicStrength): string[]
```
Generates and splits mnemonic into words.

```ts
isMnemonicValid(mnemonic: string): boolean
```
Validates mnemonic.

```ts
mnemonicToWordArray(mnemonic: string): string[]
wordArrayToMnemonic(words: string[]): string
```
Conversion helpers.

---

### KeyDerivationService

BIP-32/BIP-44 derivation helpers.

```ts
buildBip44Path(options: Bip44PathOptions): string
```
Builds path `m/44'/coinType'/account'/change/index`.

```ts
derivePrivateKey(masterNode: BIP32Interface, path: string): Uint8Array
```
Derives private key bytes from master node and path.

```ts
mnemonicToSeed(mnemonicWords: string[] | string, passphrase?: string): Promise<Uint8Array>
```
Converts mnemonic to seed.

```ts
seedToMasterNode(seed: Uint8Array): BIP32Interface
```
Builds BIP32 master node using tiny-secp256k1 + bip32 factory.

```ts
deriveKeyFromMnemonic(...)
deriveNextKeyFromMnemonic(...)
```
Convenience derivation helpers.

---

### KeysManager

secp256k1 key utilities.

```ts
generateRandomKey(length?: number): Uint8Array
generateKeyPair(keyLength?: number): KeyPair
getKeyPairFromPrivateKey(privateKey: Uint8Array): KeyPair
getPublicKeyFromPrivateKey(privateKey: Uint8Array): Uint8Array
convertKeyToHex(key: Uint8Array): string
deriveKeyFromMnemonic(mnemonicWords: string[], options?: Bip44PathOptions): Promise<Uint8Array>
```

---

### SignerService

Builds deploy signatures without exposing raw key bytes to callers.

```ts
sign(request: SigningRequest, passwordProvider: PasswordProvider): Promise<SignedResult>
```

Signing flow:

1. Gets password from `passwordProvider`
2. Uses `wallet.withSigningCapability(...)` to obtain scoped signing capability
3. Serializes deploy data (BinaryWriter)
4. Hashes with blake2b-256
5. Signs digest with secp256k1 and returns `{ deployer, signature, sigAlgorithm }`

**Security boundary:** Normal signing path does not return decrypted private key bytes. Capability expires after callback scope.

---

### AssetsService

Balance and transfer operations through BlockchainGateway.

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

- Uses checksum-aware `validateAddress()` and returns deterministic address error codes.
- Rejects non-positive amounts.

```ts
getASIBalance(address: Address): Promise<bigint>
```
Validates address before exploration deploy.

---

### FeeService

Gas-fee helper utilities.

```ts
generateRandomGasFee(): string
getGasFeeAsNumber(): number
formatGasFee(fee?: string): string
```

---

### DeployResubmitter

Retry + resubmission flow for non-read-only deploys.

```ts
resubmit(
  rholangCode: string,
  wallet: Wallet,
  passwordProvider: PasswordProvider,
  phloLimit?: number
): Promise<ResubmitResult>
```

Related exports: `ResubmitNodeManager`, `ResubmitConfig`, `ResubmitResult`.

---

## Domains

### Wallet

Encrypted wallet metadata + signing capability boundary.

**Factory methods:**

```ts
Wallet.fromPrivateKey(
  name: string,
  privateKey: Uint8Array,
  password: string,
  masterNodeId?: string | null,
  index?: number | null
): Promise<Wallet>

Wallet.fromEncryptedData(
  name: string,
  address: Address,
  encryptedPrivateKey: EncryptedData,
  masterNodeId: string | null,
  index: number | null
): Wallet
```

**Signing boundary:**

```ts
wallet.withSigningCapability<T>(
  password: string,
  callback: (capability: SigningCapability) => Promise<T> | T
): Promise<T>
```

SigningCapability methods:

```ts
signDigest(digest: Uint8Array): Promise<Uint8Array>
getPublicKey(): Uint8Array
```

- Capability expires when callback returns.
- Decrypted key bytes are zeroized after callback scope.

**Other methods:**

```ts
getEncryptedPrivateKey(): EncryptedData
registerAsset(asset: Asset): void
getAddress(): Address
getName(): string
getIndex(): number | null
getAssets(): Assets
isWalletLocked(): boolean
toString(): string
```

---

### Vault

Encrypted browser vault for wallets + encrypted records.

**Constructor:**

```ts
new Vault(vaultData?: string)
```

**Static helpers:**

```ts
Vault.getSavedVaultKeys(): string[]
Vault.getVaultDataFromStorage(vaultKey: string): string | null
```

**State and persistence:**

```ts
isVaultLocked(): boolean
save(vaultKey?: string): void
lock(password: string): Promise<void>
unlock(password: string): Promise<void>
isEmpty(): boolean
toString(): string
```

**Wallet operations:**

```ts
getWallets(): Wallet[]
getWalletsCount(): number
getWalletAddresses(): Address[]
addWallet(wallet: Wallet): void
removeWallet(address: Address): void
getWallet(address: Address): Wallet | undefined
hasWallet(address: Address): boolean
```

**Seed/encrypted-record operations:**

```ts
getSeeds(): EncryptedRecord[]
getSeed(id: string): EncryptedRecord | undefined
addSeed(id: string, seed: EncryptedRecord): void
removeSeed(id: string): void
getSeedsIds(): string[]
hasSeed(seedId: string): boolean
```

---

### Asset

Simple token model.

```ts
new Asset(id: string, name: string, decimals?: number)
getId(): string
getName(): string
getDecimals(): number
```

Associated types: `AssetId = string`, `Assets = Map<AssetId, Asset>`.

---

### EncryptedRecord

Encrypted data wrapper used by vault seed flows.

```ts
EncryptedRecord.createAndEncrypt(data: string, password: string): Promise<EncryptedRecord>
EncryptedRecord.createFromEncryptedData(encryptedData: EncryptedData): EncryptedRecord
EncryptedRecord.createFromStringifiedEncryptedData(data: string): EncryptedRecord
decrypt(password: string): Promise<string>
toString(): string
```

---

### BlockchainGateway

Singleton gateway for validator/indexer node communication.

**Initialization:**

```ts
BlockchainGateway.init(config: BlockchainGatewayConfig): BlockchainGateway
BlockchainGateway.isInitialized(): boolean
BlockchainGateway.getInstance(): BlockchainGateway
```

**Core methods:**

```ts
changeValidator(config: GatewayClientConfig): BlockchainGateway
changeIndexer(config: GatewayClientConfig): BlockchainGateway
submitDeploy(deployData: SignedResult): Promise<string | undefined>
submitExploratoryDeploy(rholangCode: string): Promise<any>
exploreDeployData(rholangCode: string): Promise<any>
getDeploy(deployHash: string): Promise<any>
getDeployStatus(deployHash: string): Promise<DeployStatusResult>
getLatestBlockNumber(): Promise<number>
isValidatorActive(): Promise<boolean>
getValidatorClientUrl(): string
```

Types and enums: `BlockchainGatewayConfig`, `DeployStatus`, `DeployStatusResult`.

---

### BrowserStorage

LocalStorage adapter with prefix-based key isolation.

```ts
new BrowserStorage(prefix?: string)
write(id: string, data: string): void
read(id: string): string | null
delete(id: string): void
has(id: string): boolean
isEmpty(): boolean
clear(): void
```

---

### Signing Types

```ts
interface SigningRequest {
  wallet: Wallet;
  data: any;
}

interface SignedResult {
  data: any;
  deployer: string;
  signature: string;
  sigAlgorithm: string;
}

type PasswordProvider = () => Promise<string>
```

---

## Utilities

### Codec

Encoders and decoders for base16/base58 conversions.

```ts
encodeBase58(hex: string): string
```
Converts a hex string to a Base58-encoded string.

```ts
decodeBase16(hex: string): Uint8Array
```
Parses a hex string into a Uint8Array of bytes.

---

### Constants

Library-wide constants.

| Constant | Description |
|----------|-------------|
| `ASI_CHAIN_PREFIX` | Chain payload prefix used for address construction (`{ coinId, version }`) |
| `ASI_COIN_TYPE` | Coin type for BIP44 derivation (60) |
| `ASI_DECIMALS` | Number of decimal places for ASI (8) |
| `GasFee` | Gas fee constants and defaults (`BASE_FEE`, `VARIATION_RANGE`, `LABEL`, `TRANSFER`, `DEPLOY`) |
| `POWER_BASE` | Base used for power calculations (10) |
| `ASI_BASE_UNIT` | Atomic unit multiplier (`BigInt(POWER_BASE) ** BigInt(ASI_DECIMALS)`) |

---

### Functions

Amount conversion helpers between human-readable ASI values and atomic integer representation.

```ts
toAtomicAmount(amount: number | string): bigint
```
Converts a human-readable amount into the atomic bigint value. Handles negative values and thousands separators, validates format, truncates excessive fractional digits.

```ts
fromAtomicAmountToString(atomicAmount: bigint): string
```
Converts an atomic bigint amount to a normalized decimal string. Trims trailing zeros.

```ts
fromAtomicAmountToNumber(atomicAmount: bigint): number
```
Converts atomic bigint to JavaScript number. Logs a warning if integer part exceeds `Number.MAX_SAFE_INTEGER`.

```ts
fromAtomicAmount = fromAtomicAmountToString
```
Alias for `fromAtomicAmountToString`.

Example:

```ts
const humanAmount = "1,234.56789012";
const atomic = toAtomicAmount(humanAmount);
const backToString = fromAtomicAmountToString(atomic); // "1234.56789012"
const asNumber = fromAtomicAmountToNumber(atomic);
```

---

### Validators

Validation helpers for account names and addresses.

```ts
validateAccountName(name: string, maxLength?: number): { isValid: boolean; error?: string }
```
Validates an account name. Checks for non-empty string, maximum length (default: 30), and forbidden filesystem characters.

```ts
isAddress(address: string): address is Address
```
Type-guard that checks whether address is valid after full decode + checksum validation.

```ts
validateAddress(address: string): { isValid: boolean; errorCode?: AddressValidationErrorCode }
```
Performs detailed validation and returns a deterministic errorCode when invalid.

**AddressValidationErrorCode values:**

| Code | Description |
|------|-------------|
| `INVALID_PREFIX` | Invalid address prefix |
| `INVALID_LENGTH` | Invalid address length |
| `INVALID_ALPHABET` | Invalid characters in address |
| `INVALID_BASE58` | Invalid Base58 encoding |
| `INVALID_HEX_LENGTH` | Invalid hex length after decoding |
| `INVALID_CHAIN_PREFIX` | Invalid chain prefix |
| `INVALID_CHECKSUM` | Checksum mismatch |
| `NON_CANONICAL` | Address is not in canonical form |

---

### Polyfills

```ts
setupBufferPolyfill(): void
```
Ensures `window.Buffer` exists in browser environments by assigning Node's Buffer from the `buffer` package when missing. No-op in non-browser environments.
