# Functions

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/dev/src/utils/functions/index.ts)

These functions convert amounts between human-readable values and atomic integers. A few small helpers come with them. All of them are plain functions exported from the package root.

An atomic amount is a `bigint` count of the smallest token unit. ASI uses 18 decimal places, so one ASI is `1_000_000_000_000_000_000` atomic units.

Every conversion takes `decimals` as a required argument. Pass the precision of the network or asset. For ASI it is `18`.

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
    toExactAtomicAmount,
} from "@asichain/asi-wallet-sdk";
```

## Functions

### toAtomicAmount()

```ts
toAtomicAmount(amount: number | string, decimals: number): bigint
```

Converts a human-readable amount to atomic units. It strips thousands separators (commas and spaces), accepts negative values, and truncates excess fractional digits with a `console.warn`.

Deprecated. Use `toExactAtomicAmount`, which rejects an amount with more fractional digits than `decimals` instead of truncating it.

| Name | Type | Description |
|------|------|-------------|
| `amount` | `number \| string` | Decimal amount, for example `"1,234.56"` or `1234.56`. |
| `decimals` | `number` | Number of decimal places of the token. |

Returns `bigint`.

It throws:

- `Error("Cannot process empty amount")` for an empty string.
- `Error("Invalid amount format")` when the string is not a decimal number.
- `Error("Invalid number")` when a numeric input is not finite.

### toExactAtomicAmount()

```ts
toExactAtomicAmount(amount: string, decimals: number): bigint
```

Converts a decimal string to atomic units without rounding. It trims surrounding whitespace and accepts a leading `-`. It accepts neither thousands separators nor numbers. Trailing zeros beyond `decimals` are allowed, so `toExactAtomicAmount("1.50", 1)` is `15n`.

| Name | Type | Description |
|------|------|-------------|
| `amount` | `string` | Decimal amount, for example `"1234.56"`. |
| `decimals` | `number` | Number of decimal places of the token. |

Returns `bigint`.

It throws:

- `RangeError("Decimals must be a non-negative safe integer")` when `decimals` is not a non-negative safe integer.
- `Error("Invalid amount format")` when the string is not a decimal number.
- `RangeError("Amount has more than <decimals> decimal places")` when a non-zero digit follows the first `decimals` fractional digits.

### fromAtomicAmount()

```ts
fromAtomicAmount(atomicAmount: bigint, decimals: number): string
```

Converts atomic units to a decimal string with trailing zeros trimmed, for example `1500000000000000000n` with 18 decimals gives `"1.5"`. Negative amounts keep their sign.

| Name | Type | Description |
|------|------|-------------|
| `atomicAmount` | `bigint` | Atomic amount. |
| `decimals` | `number` | Number of decimal places of the token. |

Returns `string`.

### fromAtomicAmountToNumber()

```ts
fromAtomicAmountToNumber(atomicAmount: bigint, decimals: number): number
```

Converts atomic units to a JavaScript `number`. When the integer part is larger than `Number.MAX_SAFE_INTEGER`, it logs a warning and returns an imprecise value. Fraction digits can also be lost below that value. Use `fromAtomicAmount` when exact digits matter. Do not use this function for signing, balance comparisons or fee calculations.

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
    fromAtomicAmount,
    parseAtomicAmount,
    toExactAtomicAmount,
} from "@asichain/asi-wallet-sdk";

const atomic = toExactAtomicAmount("1234.56789012", 18);

console.log(atomic); // 1234567890120000000000n
console.log(fromAtomicAmount(atomic, 18)); // "1234.56789012"
// Keep the string from fromAtomicAmount when you need the exact amount.
console.log(parseAtomicAmount("42")); // 42n
console.log(parseAtomicAmount("1.5")); // null
```

The package also exports other helpers that the SDK uses internally, for example `getErrorMessage`, `runProtected`, `selectByField` and `withSchemaVersion`. Their signatures are in the package typings.
