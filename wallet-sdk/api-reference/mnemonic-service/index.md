# MnemonicService

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/services/Mnemonic/index.ts)

BIP-39 mnemonic generation and validation.

**Enum `MnemonicStrength`:**

| Value | Constant | Entropy |
|-------|----------|---------|
| `128` | `TWELVE_WORDS` | 128 bits → 12 words |
| `256` | `TWENTY_FOUR_WORDS` | 256 bits → 24 words |

## `generateMnemonic`

```ts
generateMnemonic(strength?: MnemonicStrength): string
```

Generates a new BIP-39 mnemonic phrase.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `strength` | `MnemonicStrength` | No | Entropy bits. Defaults to `MnemonicStrength.TWELVE_WORDS` (128 bits, 12 words). |

**Returns:** `string` — space-separated mnemonic phrase.

## `generateMnemonicArray`

```ts
generateMnemonicArray(strength?: MnemonicStrength): string[]
```

Generates a mnemonic and returns it split into individual words.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `strength` | `MnemonicStrength` | No | Entropy bits. Defaults to `MnemonicStrength.TWELVE_WORDS`. |

**Returns:** `string[]` — array of mnemonic words.

## `isMnemonicValid`

```ts
isMnemonicValid(mnemonic: string): boolean
```

Validates a BIP-39 mnemonic phrase (checks wordlist membership and checksum).

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `mnemonic` | `string` | Yes | Mnemonic phrase to validate. |

**Returns:** `boolean` — `true` if the mnemonic is valid.

## `mnemonicToWordArray`

```ts
mnemonicToWordArray(mnemonic: string): string[]
```

Splits a mnemonic string into an array of words by whitespace.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `mnemonic` | `string` | Yes | Mnemonic string. |

**Returns:** `string[]` — individual words.

## `wordArrayToMnemonic`

```ts
wordArrayToMnemonic(words: string[]): string
```

Joins an array of mnemonic words into a space-separated string.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `words` | `string[]` | Yes | Array of BIP-39 words. |

**Returns:** `string` — mnemonic phrase.
