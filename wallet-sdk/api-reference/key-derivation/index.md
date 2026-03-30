# KeyDerivationService

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/services/KeyDerivation/index.ts)

BIP-32/BIP-44 hierarchical deterministic key derivation.

**Interface `Bip44PathOptions`:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `coinType` | `number` | Yes | BIP-44 coin type (ASI uses `60`). |
| `account` | `number` | No | Account index. Defaults to `0`. |
| `change` | `number` | No | `0` = external chain, `1` = internal. Defaults to `0`. |
| `index` | `number` | No | Address index. Defaults to `0`. |

## `buildBip44Path`

```ts
buildBip44Path(options: Bip44PathOptions): string
```

Constructs a BIP-44 derivation path string from the provided options.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `options` | `Bip44PathOptions` | Yes | Path components (coinType, account, change, index). |

**Returns:** `string` — derivation path in the format `m/44'/coinType'/account'/change/index`.

## `derivePrivateKey`

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

## `mnemonicToSeed`

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

## `seedToMasterNode`

```ts
seedToMasterNode(seed: Uint8Array): BIP32Interface
```

Creates a BIP-32 master node from a seed using tiny-secp256k1 and the bip32 factory.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `seed` | `Uint8Array` | Yes | Seed bytes (typically 64 bytes from `mnemonicToSeed`). |

**Returns:** `BIP32Interface` — master node for key derivation.

## `deriveKeyFromMnemonic`

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

## `deriveNextKeyFromMnemonic`

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
