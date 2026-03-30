# Vault

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/domains/Vault/index.ts)

Encrypted browser vault for managing multiple wallets and encrypted seed records.

> **Browser only.** Vault uses `localStorage` via `BrowserStorage`. All methods that access vault contents throw `Error("Attempted to access locked vault")` if the vault is locked.

## Constructor

```ts
new Vault(vaultData?: string)
```

Creates a new Vault instance. If `vaultData` is provided, it is treated as previously saved encrypted vault data.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `vaultData` | `string` | No | Encrypted vault JSON string from `localStorage`. |

**Throws:** `Error("getVault can only be called in a browser environment")` — if `localStorage` is unavailable.

## Static methods

### `Vault.getSavedVaultKeys`

```ts
Vault.getSavedVaultKeys(): string[]
```

Returns all vault storage keys found in `localStorage`.

**Returns:** `string[]` — array of storage key strings.

### `Vault.getVaultDataFromStorage`

```ts
Vault.getVaultDataFromStorage(vaultKey: string): string | null
```

Reads encrypted vault data from `localStorage`.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `vaultKey` | `string` | Yes | Storage key (e.g., `"0"`). |

**Returns:** `string | null` — encrypted vault JSON or `null` if not found.

## Lock / Unlock

### `isVaultLocked`

```ts
isVaultLocked(): boolean
```

Returns `true` if the vault is locked.

### `lock`

```ts
lock(password: string): Promise<void>
```

Encrypts all vault data with the provided password and marks the vault as locked.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `password` | `string` | Yes | Password for encryption. |

### `unlock`

```ts
unlock(password: string): Promise<void>
```

Decrypts the vault and loads wallet and seed data into memory.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `password` | `string` | Yes | Password for decryption. |

**Throws:** `Error("Vault was unlocked on undefined encryptedVaultData")` — if no encrypted data exists.

### `save`

```ts
save(vaultKey?: string): void
```

Persists the locked vault to `localStorage`.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `vaultKey` | `string` | No | Storage key. Defaults to `"0"`. |

**Throws:** `Error("Cannot save an unlocked vault")` — vault must be locked before saving.

## Wallet operations

All methods throw `Error("Attempted to access locked vault")` if the vault is locked.

```ts
isEmpty(): boolean
getWallets(): Wallet[]
getWalletsCount(): number
getWalletAddresses(): Address[]
addWallet(wallet: Wallet): void
removeWallet(address: Address): void
getWallet(address: Address): Wallet | undefined
hasWallet(address: Address): boolean
```

## Seed / encrypted-record operations

All methods throw `Error("Attempted to access locked vault")` if the vault is locked.

```ts
getSeeds(): EncryptedRecord[]
getSeedsIds(): string[]
getSeed(id: string): EncryptedRecord | undefined
addSeed(id: string, seed: EncryptedRecord): void
removeSeed(id: string): void
hasSeed(seedId: string): boolean
```

## `toString`

```ts
toString(): string
```

Serializes vault contents (wallets and seeds) to a JSON string. Used internally before locking.

**Throws:** `Error("Attempted to access locked vault")` — if called while locked.
