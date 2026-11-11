# Token Amounts

ASI amounts on DevNet have 8 decimal places. This page shows how to convert ASI to atomic units and how to keep amounts exact in code.

## Find the Decimals of a Network

A Rust node reports its token in `GET /api/status`, in the fields `nativeTokenName`, `nativeTokenSymbol` and `nativeTokenDecimals`.

The symbol alone does not identify a network. Check `networkId` and `shardId` in the same response as well.

The node accepts 0 to 18 decimals. It refuses to start when the value is above 18 or when the name or the symbol is empty. Without settings of its own the node reports the defaults `F1R3CAP`, `F1R3` and 8 decimals.

The token values are fixed at genesis. A node whose token settings differ from those of the chain stops. Records keep the decimals of the network they come from, so do not rescale them.

## Convert ASI and Atomic Units

One ASI is 10^d atomic units, where d is the number of decimals. Convert with integer arithmetic. Reject input with more fraction digits than the network allows instead of rounding it.

| ASI | 8 Decimals | 18 Decimals |
| --- | --- | --- |
| `0.000000000000000001` | Too many digits | `1` |
| `0.00000001` | `1` | `10000000000` |
| `0.5` | `50000000` | `500000000000000000` |
| `1` | `100000000` | `1000000000000000000` |
| `1.000000000000000001` | Too many digits | `1000000000000000001` |
| `10` | `1000000000` | `10000000000000000000` |

The raw amount `100000000` is 1 ASI with 8 decimals and `0.0000000001` ASI with 18 decimals.

In Wallet SDK 2.1.0, `toAtomicAmount` multiplies the integer part by 10^8 for any `decimals`. `toAtomicAmount("1", 18)` returns `100000000n` instead of `1000000000000000000n`, so use it only with 8 decimals.

## Keep Amounts Exact

A JavaScript `number` holds integers exactly only up to `9007199254740991` (`2^53 - 1`). One ASI with 18 decimals is already larger. The largest signed int64 is `9223372036854775807`, which is `9.223372036854775807` ASI with 18 decimals.

Keep amounts as decimal strings and do the arithmetic with `bigint`. Build the `bigint` from the original string, because `BigInt(number)` cannot bring back digits that the `number` has already lost. Do not use `Number` or `parseFloat` for signing, balances or fees.

The example formats an amount and sends nothing:

```ts
const decimals = 18; // use the decimals of the network
const raw = "1000000000000000001";
const atomic = BigInt(raw);
const unit = 10n ** BigInt(decimals);
const whole = atomic / unit;
const fraction = (atomic % unit).toString().padStart(decimals, "0");

console.log(`${whole}.${fraction}`); // 1.000000000000000001
console.log(JSON.stringify({ amount: atomic.toString() })); // {"amount":"1000000000000000001"}
console.log(BigInt(Number(raw))); // 1000000000000000000n, the last digit is lost
```

`JSON.stringify` throws a `TypeError` on a `bigint`, so convert it to a string first. Format each history record with the decimals it was recorded with. Show a balance that cannot be loaded as unknown, never as zero.

## Next Steps

<CardGrid columns="2">
<DocCard title="Functions" href="/wallet-sdk/api-reference/functions/">Amount conversion in Wallet SDK 2.1.0</DocCard>
<DocCard title="Wallet CLI" href="/cli/usage/">Raw amounts for the send command</DocCard>
<DocCard title="Node Image" href="/nodes/image/">Run the Rust node from its image</DocCard>
<DocCard title="Container Images" href="/reference/container-images/">Image versions, digests and source revisions</DocCard>
</CardGrid>
