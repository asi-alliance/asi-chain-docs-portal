# Functions

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/utils/functions/index.ts)

Amount conversion helpers between human-readable ASI values and atomic integer representation.

1 ASI = `100_000_000` atomic units (`ASI_BASE_UNIT` = `10^8`).

## `toAtomicAmount`

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

## `fromAtomicAmountToString`

```ts
fromAtomicAmountToString(atomicAmount: bigint): string
```

Converts atomic units to a normalized decimal string. Trailing zeros are trimmed.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `atomicAmount` | `bigint` | Yes | Atomic amount. |

**Returns:** `string` — decimal string (e.g., `"1234.56789012"`).

## `fromAtomicAmountToNumber`

```ts
fromAtomicAmountToNumber(atomicAmount: bigint): number
```

Converts atomic units to a JavaScript `number`. Logs a warning if the integer part exceeds `Number.MAX_SAFE_INTEGER`.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `atomicAmount` | `bigint` | Yes | Atomic amount. |

**Returns:** `number`.

## `fromAtomicAmount`

```ts
fromAtomicAmount(atomicAmount: bigint): string
```

Alias for `fromAtomicAmountToString`.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `atomicAmount` | `bigint` | Yes | Atomic amount. |

**Returns:** `string` — decimal string.

## `genRandomHex`

```ts
genRandomHex(size: number): string
```

Generates a random hex string of the specified length. Uses `Math.random()` — not cryptographically secure; intended for non-security purposes such as generating identifiers.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `size` | `number` | Yes | Number of hex characters to generate. |

**Returns:** `string` — random hex string of the given length.

## Example

```ts
const atomic = toAtomicAmount("1,234.56789012"); // BigInt(123456789012)
const str = fromAtomicAmountToString(atomic);    // "1234.56789012"
const num = fromAtomicAmountToNumber(atomic);    // 1234.56789012
```
