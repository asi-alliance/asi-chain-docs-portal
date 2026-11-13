# Token Amounts

ASI has 18 decimal places, so 1 ASI is 1,000,000,000,000,000,000 atomic units. This page shows how to convert ASI to atomic units and how to keep amounts exact in code.

## Check the Network Configuration

A Rust node reports its token in `GET /api/status`, in the fields `nativeTokenName`, `nativeTokenSymbol` and `nativeTokenDecimals`.

The symbol alone does not identify a network. Check `networkId` and `shardId` in the same response as well.

For ASI, start every node with `--native-token-name ASI --native-token-symbol ASI --native-token-decimals 18`. `GET /api/status` then reports `ASI` and `18`. See [Set Up a Private Shard](/nodes/private-shard/).

The token values are fixed at genesis. A node that joins a network uses the values of that network, and a node whose token settings differ from those of the chain stops. Records keep the decimals of the network they come from, so do not rescale them.

## Convert ASI and Atomic Units

One ASI is 10^18 atomic units. Convert with integer arithmetic. Reject input with more than 18 fraction digits instead of rounding it.

| ASI | Atomic Units |
| --- | --- |
| `0.000000000000000001` | `1` |
| `0.00000001` | `10000000000` |
| `0.5` | `500000000000000000` |
| `1` | `1000000000000000000` |
| `1.000000000000000001` | `1000000000000000001` |
| `10` | `10000000000000000000` |

One atomic unit is `0.000000000000000001` ASI. For example, the raw amount `1500000000000000000` represents `1.5` ASI.

## Keep Amounts Exact

A JavaScript `number` holds integers exactly only up to `9007199254740991` (`2^53 - 1`). One ASI with 18 decimals is already larger. The largest signed int64 is `9223372036854775807`, which is `9.223372036854775807` ASI with 18 decimals.

Keep amounts as decimal strings and do the arithmetic with `bigint`. Build the `bigint` from the original string, because `BigInt(number)` cannot bring back digits that the `number` has already lost. Do not use `Number` or `parseFloat` for signing, balances or fees.

The example formats an amount and sends nothing:

```ts
const decimals = 18;
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
<DocCard title="Functions" href="/wallet-sdk/api-reference/functions/">Convert amounts between ASI and atomic units</DocCard>
<DocCard title="Wallet CLI" href="/cli/usage/">Raw amounts for the send command</DocCard>
<DocCard title="Node Image" href="/nodes/image/">Run the Rust node from its image</DocCard>
<DocCard title="Container Images" href="/reference/container-images/">Image versions, digests and source revisions</DocCard>
</CardGrid>
