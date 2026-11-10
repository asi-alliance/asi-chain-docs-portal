# Functions

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/v2.1.0/src/utils/functions/index.ts)

These functions convert amounts between human-readable values and atomic integers. A few small helpers come with them. All of them are plain functions exported from the package root.

An atomic amount is a `bigint` count of the smallest token unit. A token with `decimals` decimal places has `10^decimals` atomic units in one whole token, so for ASI (`ASI_DECIMALS` = `8`) one ASI is `100_000_000` atomic units.

Every conversion takes `decimals` as a required argument. Pass `ASI_DECIMALS` for ASI, or `asset.getDecimals()` when you work with an [`Asset`](/wallet-sdk/api-reference/asset/).

## Import

```ts
import {
    buildUrl,
    fromAtomicAmount,
    fromAtomicAmountToNumber,
    genRandomHex,
    generateRandomId,
    isSameAddress,
    normalizeAddress,
    parseAtomicAmount,
    toAtomicAmount,
} from "@asichain/asi-wallet-sdk";
```

## Functions

### toAtomicAmount()

```ts
toAtomicAmount(amount: number | string, decimals: number): bigint
```

Converts a human-readable amount to atomic units. It strips thousands separators (commas and spaces), accepts negative values, and truncates excess fractional digits with a `console.warn`.

::: warning Wrong Result for Decimals Other Than 8
In version 2.1.0 the integer part is always multiplied by `ASI_BASE_UNIT` (10^8), and only the fraction follows `decimals`. The result is right for 8 decimals, but `toAtomicAmount("1.5", 6)` returns `100500000n` instead of `1500000n`. With 18 decimals `toAtomicAmount("1", 18)` returns `100000000n`, so the function cannot convert amounts for the 18 decimals planned for TestNet. See [Token Amounts](/reference/token-amounts/).
:::

| Name | Type | Description |
|------|------|-------------|
| `amount` | `number \| string` | Decimal amount, for example `"1,234.56"` or `1234.56`. |
| `decimals` | `number` | Number of decimal places of the token. |

Returns `bigint`.

It throws:

- `Error("Cannot process empty amount")` for an empty string.
- `Error("Invalid amount format")` when the string is not a decimal number.
- `Error("Invalid number")` when a numeric input is not finite.

### fromAtomicAmount()

```ts
fromAtomicAmount(atomicAmount: bigint, decimals: number): string
```

Converts atomic units to a decimal string with trailing zeros trimmed, for example `150000000n` with 8 decimals gives `"1.5"`. Negative amounts keep their sign.

| Name | Type | Description |
|------|------|-------------|
| `atomicAmount` | `bigint` | Atomic amount. |
| `decimals` | `number` | Number of decimal places of the token. |

Returns `string`.

### fromAtomicAmountToNumber()

```ts
fromAtomicAmountToNumber(atomicAmount: bigint, decimals: number): number
```

Converts atomic units to a JavaScript `number`. When the integer part is larger than `Number.MAX_SAFE_INTEGER`, it logs a warning and returns an imprecise value. Fractional precision can be lost even below that boundary. Use `fromAtomicAmount` when exact digits matter. Do not use this helper for signing, balance comparisons or fee calculations.

| Name | Type | Description |
|------|------|-------------|
| `atomicAmount` | `bigint` | Atomic amount. |
| `decimals` | `number` | Number of decimal places of the token. |

Returns `number`.

### parseAtomicAmount()

```ts
parseAtomicAmount(value: unknown): bigint | null
```

Reads an atomic amount from a value that came from outside, such as a node response. It returns a `bigint` for a non-negative safe integer or a string of digits only. Everything else gives `null`, including negative numbers, fractions and strings like `"1.5"`.

### genRandomHex()

```ts
genRandomHex(size: number): string
```

Returns a random hex string of `size` characters. It uses `Math.random()`, so it is not cryptographically secure. Use it for identifiers only.

### generateRandomId()

```ts
generateRandomId(): string
```

Returns an identifier of the form `res_<timestamp>_<8 hex characters>`. It is built on `genRandomHex` and has the same limits.

### normalizeAddress()

```ts
normalizeAddress(address: string | undefined): string
```

`normalizeAddress` trims the string and lowercases it, and returns `""` for `undefined`.

### isSameAddress()

```ts
isSameAddress(address: string | undefined, other: string | undefined): boolean
```

`isSameAddress` normalizes both addresses with `normalizeAddress` and compares them. It returns `false` when the first one is empty.

### buildUrl()

```ts
buildUrl(pathPrefix: string, params?: IUrlParams): string
```

`buildUrl` replaces `:name` segments of `pathPrefix` with the values from `params.path` (URL-encoded) and appends `params.query` as a query string. Query values that are `undefined` or `null` are skipped.

## Example

```ts
import {
    ASI_DECIMALS,
    fromAtomicAmount,
    parseAtomicAmount,
    toAtomicAmount,
} from "@asichain/asi-wallet-sdk";

const atomic = toAtomicAmount("1,234.56789012", ASI_DECIMALS);

console.log(atomic); // 123456789012n
console.log(fromAtomicAmount(atomic, ASI_DECIMALS)); // "1234.56789012"
// Keep the string from fromAtomicAmount for exact monetary use.
console.log(parseAtomicAmount("42")); // 42n
console.log(parseAtomicAmount("1.5")); // null
```

The package also exports other helpers that the SDK uses internally, for example `getErrorMessage`, `runProtected`, `selectByField` and `withSchemaVersion`. Their signatures are in the package typings.
