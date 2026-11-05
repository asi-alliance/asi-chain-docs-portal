# Mnemonic

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/v2.1.0/src/services/Mnemonic/index.ts)

BIP-39 mnemonic generation, validation and conversion. The package exports the class as `Mnemonic` and the enum as `MnemonicStrength`, and all methods are static. Importing the module also calls [`setupBufferPolyfill`](/wallet-sdk/api-reference/polyfills/).

```ts
import { Mnemonic, MnemonicStrength } from '@asichain/asi-wallet-sdk';

const phrase = Mnemonic.generateMnemonic(MnemonicStrength.TWENTY_FOUR_WORDS);
console.log(Mnemonic.isMnemonicValid(phrase)); // true
console.log(Mnemonic.mnemonicToWordArray(phrase).length); // 24
```

**Enum `MnemonicStrength`:**

| Value | Constant | Entropy |
|-------|----------|---------|
| `128` | `TWELVE_WORDS` | 128 bits, 12 words |
| `256` | `TWENTY_FOUR_WORDS` | 256 bits, 24 words |

## `generateMnemonic`

```ts
static generateMnemonic(strength?: MnemonicStrength): string
```

Generates a BIP-39 mnemonic.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `strength` | `MnemonicStrength` | No | Entropy in bits. Defaults to `MnemonicStrength.TWELVE_WORDS`. |

**Returns:** `string` with the space-separated mnemonic.

## `generateMnemonicArray`

```ts
static generateMnemonicArray(strength?: MnemonicStrength): string[]
```

Generates a mnemonic and returns it as an array of words.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `strength` | `MnemonicStrength` | No | Entropy in bits. Defaults to `MnemonicStrength.TWELVE_WORDS`. |

**Returns:** `string[]` with the mnemonic words.

## `isMnemonicValid`

```ts
static isMnemonicValid(mnemonic: string): boolean
```

Checks the words against the BIP-39 English wordlist and verifies the checksum. The check is strict about spacing and case, so run user input through `normalizeMnemonic` first.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `mnemonic` | `string` | Yes | Mnemonic to validate. |

**Returns:** `boolean`, `true` if the mnemonic is valid.

## `normalizeMnemonic`

```ts
static normalizeMnemonic(mnemonic: string): string
```

Trims the string, lowercases it and collapses any run of whitespace into a single space.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `mnemonic` | `string` | Yes | Raw mnemonic text, for example pasted by a user. |

**Returns:** `string` with the normalized mnemonic.

## `mnemonicToWordArray`

```ts
static mnemonicToWordArray(mnemonic: string): string[]
```

Trims the string and splits it on a single space. Several spaces in a row produce empty strings in the result, so normalize the text first if it comes from user input.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `mnemonic` | `string` | Yes | Mnemonic string. |

**Returns:** `string[]` with the words.

## `wordArrayToMnemonic`

```ts
static wordArrayToMnemonic(words: string[]): string
```

Joins the words with single spaces.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `words` | `string[]` | Yes | Mnemonic words. |

**Returns:** `string` with the mnemonic.

## `mnemonicToSeed`

```ts
static mnemonicToSeed(mnemonic: string | string[], passphrase?: string): Promise<Uint8Array>
```

Converts a mnemonic to a 64-byte BIP-39 seed. [`KeyDerivation.mnemonicToSeed`](/wallet-sdk/api-reference/key-derivation/#mnemonictoseed) gives the same result.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `mnemonic` | `string \| string[]` | Yes | Mnemonic as a string or an array of words. |
| `passphrase` | `string` | No | BIP-39 passphrase. Defaults to `""`. |

**Returns:** `Promise<Uint8Array>` with the seed (64 bytes).
