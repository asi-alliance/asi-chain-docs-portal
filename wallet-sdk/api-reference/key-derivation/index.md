# KeyDerivation

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/v2.1.0/src/services/KeyDerivation/index.ts)

`KeyDerivation` derives BIP-32 and BIP-44 private keys from a mnemonic. All of its methods are static. The BIP-44 path is a [`Bip44Path`](#bip44path) object, and the package exports that class as well.

## Import

```ts
import { Bip44Path, DEFAULT_BIP_44_PATH_OPTIONS, KeyDerivation } from "@asichain/asi-wallet-sdk";
```

## Methods

### deriveKeyFromMnemonic()

```ts
static deriveKeyFromMnemonic(mnemonic: string | string[], bip44path: string | Bip44Path): Promise<Uint8Array>
```

Derives the private key at the given path from a mnemonic, going through the seed and the master node. The seed is zeroed after use.

| Name | Type | Description |
|------|------|-------------|
| `mnemonic` | `string \| string[]` | Mnemonic as a space-separated string or an array of words. |
| `bip44path` | `string \| Bip44Path` | Derivation path. A string is passed to BIP-32 as is. |

Returns `Promise<Uint8Array>` with the private key (32 bytes).

Throws `Error("No private key at derived node")` if the derived node has no private key.

### derivePrivateKey()

```ts
static derivePrivateKey(masterNode: BIP32Interface, path: Bip44Path): Uint8Array
```

Derives a private key from a BIP-32 master node along `path.toString()`.

| Name | Type | Description |
|------|------|-------------|
| `masterNode` | `BIP32Interface` | Master node, for example from `seedToMasterNode`. |
| `path` | `Bip44Path` | Derivation path. Unlike `deriveKeyFromMnemonic`, a string is not accepted. |

Returns `Uint8Array` with the private key (32 bytes).

Throws `Error("No private key at derived node")` if the derived node has no private key.

### mnemonicToSeed()

```ts
static mnemonicToSeed(mnemonicWords: string[] | string, passphrase?: string): Promise<Uint8Array>
```

Converts a mnemonic to a 64-byte BIP-39 seed (PBKDF2-HMAC-SHA512, as defined by BIP-39). An array of words is joined with spaces first. [`Mnemonic.mnemonicToSeed`](/wallet-sdk/api-reference/mnemonic-service/#mnemonictoseed) does the same.

| Name | Type | Description |
|------|------|-------------|
| `mnemonicWords` | `string[] \| string` | Mnemonic as an array or a space-separated string. |
| `passphrase` | `string` | Optional. BIP-39 passphrase. Defaults to `""`. |

Returns `Promise<Uint8Array>` with the seed (64 bytes).

### seedToMasterNode()

```ts
static seedToMasterNode(seed: any): BIP32Interface
```

Creates a BIP-32 master node from a seed with the `bip32` factory. The secp256k1 adapter is `eccAdapter.ts` in the SDK, built on `@noble/secp256k1`. The seed is copied through `Buffer.from(seed)`, so a `Uint8Array` or an array of bytes works.

| Name | Type | Description |
|------|------|-------------|
| `seed` | `any` | Seed bytes, typically the 64 bytes from `mnemonicToSeed`. |

Returns `BIP32Interface` with the master node.

### deriveNextKeyFromMnemonic()

```ts
static deriveNextKeyFromMnemonic(
  mnemonicWords: string[],
  currentIndex: number,
  options?: Omit<IBip44PathOptions, 'index'>
): Promise<Uint8Array>
```

Derives the key at `currentIndex + 1`.

| Name | Type | Description |
|------|------|-------------|
| `mnemonicWords` | `string[]` | Mnemonic word array. A string is not accepted here. |
| `currentIndex` | `number` | Current address index. The key is derived at `currentIndex + 1`. |
| `options` | `Omit<IBip44PathOptions, 'index'>` | Optional. Coin type, account and change. Defaults to `DEFAULT_BIP_44_PATH_OPTIONS`. |

Returns `Promise<Uint8Array>` with the private key at the next index.

### compareIndexes()

```ts
static compareIndexes(firstIndex: number | null, secondIndex: number | null): number
```

Comparator for address indexes, usable with `Array.prototype.sort`. A `null` index sorts after any number, and two `null` values are equal.

| Name | Type | Description |
|------|------|-------------|
| `firstIndex` | `number \| null` | First index. |
| `secondIndex` | `number \| null` | Second index. |

Returns `number`. It is `0` if both are `null`, `1` if only the first is `null`, `-1` if only the second is `null`, otherwise `firstIndex - secondIndex`.

## Types

### Bip44Path

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/v2.1.0/src/domains/Bip44Path/index.ts)

A validated BIP-44 path of the form `m/44'/coinType'/account'/change/index`.

#### IBip44PathOptions

| Field | Type | Description |
|-------|------|-------------|
| `coinType` | `number` | Coin type, an integer from `0` to `2^31 - 1`. |
| `account` | `number` | Optional. Account index, `0` to `2^31 - 1`. Defaults to `0`. |
| `change` | `number` | Optional. `0` for the external chain, `1` for the internal one. Defaults to `0`. |
| `index` | `number` | Optional. Address index, `0` to `2^31 - 1`. Defaults to `0`. |

The constructor is `new Bip44Path(options: IBip44PathOptions)` and throws an `Error` when a field is out of range. `DEFAULT_BIP_44_PATH_OPTIONS` holds the SDK defaults for all four fields and is the value to spread into the constructor.

```ts
declare class Bip44Path {
  static parse(pathString: string): Bip44Path;
  static isValid(pathString: string): boolean;
  static fromOptions(options: IBip44PathOptions): Bip44Path;
  toString(): string;
  toRootPathString(): string;
  toOptions(): IBip44PathOptions;
  clone(): Bip44Path;
  nextIndex(): Bip44Path;
  getCoinType(): number;
  getAccount(): number;
  getChange(): number;
  getIndex(): number;
  setCoinType(value: number): void;
  setAccount(value: number): void;
  setChange(value: number): void;
  setIndex(value: number): void;
}
```

The static property `Bip44Path.MAX_COMPONENT_VALUE` equals `2^31 - 1`. The setters validate their argument like the constructor.

- `parse` accepts only a path of six components that starts with `m`. The purpose must be `44'`, the coin type and the account must be hardened, and every number must be canonical, without leading zeros. Anything else throws.
- `isValid` returns `false` instead of throwing.
- `toString` gives the full path.
- `toRootPathString` gives the path without the last `index` component.
- `nextIndex` returns a new path with `index + 1`.

## Example

```ts
import { KeyDerivation, Mnemonic, Bip44Path, DEFAULT_BIP_44_PATH_OPTIONS } from '@asichain/asi-wallet-sdk';

const words = Mnemonic.generateMnemonicArray();
const path = new Bip44Path({ ...DEFAULT_BIP_44_PATH_OPTIONS, index: 1 });

const privateKey = await KeyDerivation.deriveKeyFromMnemonic(words, path);
console.log(privateKey.length); // 32
```
