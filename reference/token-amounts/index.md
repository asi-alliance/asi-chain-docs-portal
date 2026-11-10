# Token Amounts

ASI amounts on DevNet have 8 decimal places. The planned TestNet is proposed with 18 decimal places. This page shows how to convert ASI to atomic units, how to keep amounts exact in code and which releases work with the new node amount format.

::: warning Rollout Status
On 10 November 2026 DevNet and the current wallet, explorer, faucet, Wallet CLI and Wallet SDK 2.1.0 use 8 decimals. The 18 decimals for TestNet are proposed in the open [asi-chain-rust-node#1](https://github.com/asi-alliance/asi-chain-rust-node/pull/1) and are not accepted yet. The node `dev` branch and the node image `0ccc315d84b3` use uint256 amounts, and no released SDK, client, CLI or app works with them yet.
:::

## Find the Decimals of a Network

A Rust node reports its token in `GET /api/status`, in the fields `nativeTokenName`, `nativeTokenSymbol` and `nativeTokenDecimals`. The public DevNet runs the Scala node, and its status has no token fields.

The node accepts 0 to 18 decimals. It refuses to start when the value is above 18 or when the name or the symbol is empty. Without settings of its own the node reports the defaults `F1R3CAP`, `F1R3` and 8 decimals.

The token values are fixed at genesis. A node whose settings differ from the chain stops. Records from a network with 8 decimals keep 8 decimals, so do not rescale them with the decimals of another network.

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

The raw amount `100000000` is 1 ASI with 8 decimals and `0.0000000001` ASI with 18 decimals. Raw amounts from DevNet examples, such as the Wallet CLI commands, are not valid TestNet amounts.

In Wallet SDK 2.1.0 `toAtomicAmount` multiplies the integer part by 10^8 for any `decimals`. `toAtomicAmount("1", 18)` returns `100000000n` instead of `1000000000000000000n`, so use it only with 8 decimals.

## Keep Amounts Exact

A JavaScript `number` holds integers exactly only up to `9007199254740991` (`2^53 - 1`). One ASI with 18 decimals is already larger. A signed int64 ends at `9223372036854775807`, which is `9.223372036854775807` ASI with 18 decimals.

Keep amounts as decimal strings and do the arithmetic with `bigint`. Build the `bigint` from the original string, because `BigInt(number)` cannot bring back digits that the `number` has already lost. Do not use `Number` or `parseFloat` for signing, balances or fees.

The example only formats an amount and does not send anything:

```ts
const decimals = 18; // use the decimals of the network
const raw = "1000000000000000001";
const atomic = BigInt(raw);
const unit = BigInt("1".padEnd(decimals + 1, "0"));
const whole = atomic / unit;
const fraction = (atomic % unit).toString().padStart(decimals, "0");

console.log(`${whole}.${fraction}`); // 1.000000000000000001
console.log(JSON.stringify({ amount: atomic.toString() })); // {"amount":"1000000000000000001"}
console.log(BigInt(Number(raw))); // 1000000000000000000n
```

`JSON.stringify` throws a `TypeError` on a `bigint`, so convert it to a string first. Format each history record with the decimals it was recorded with. A balance that cannot be loaded is unknown, not zero.

## Amounts in the uint256 Node

The node `dev` branch got uint256 amounts with the merge commit `43d69b76046a` on 7 November 2026. The first published image with it is `0.4.46-dev.20261109-0ccc315d84b3`, and the `dev` tag points to it. The earlier images `8e6517d630e2` and `2cce114a52ac` use int64 amounts.

In the uint256 node every amount lies between 0 and `2^256 - 1`. A balance can be 0, but a transfer must be at least 1 atomic unit. A report of a failed transfer can hold a negative value or a value above that range.

The HTTP API returns amounts as decimal strings. These are `balance`, stakes, `totalStake`, the transfer `amount`, `phloPrice` and `minPhloPrice`. `POST /api/deploy` rejects a JSON number in `phloPrice`. In gRPC the transfer amount is the string `TransferInfo.amountRaw`.

In protobuf the deploy price is `bytes phloPrice = 15`, exactly 32 bytes big-endian, and field 7 is reserved. Bond stakes use the same 32 bytes. The deploy signature covers these bytes, so a client that writes the price into the old int64 field 7 does not work with this node. Block heights, timestamps, `phloLimit` and `cost` stay plain numbers.

## Compatible Releases

The decimals and the uint256 format are separate. A client that shows 18 digits correctly can still sign the price in the old int64 field.

| Release | Amounts |
| --- | --- |
| Node images `8e6517d630e2` and `2cce114a52ac` | int64, 8 decimals by default |
| Node image `0ccc315d84b3` (`dev` tag) | uint256, 8 decimals by default |
| Client 0.2.9 and the Wallet CLI image | int64 price in field 7 |
| Wallet SDK 2.1.0 | 8 decimals, int64 price in field 7 |
| Indexer `0bb60e89db36` | `classic` profile for int64 nodes |
| Wallet, explorer and faucet images | 8 decimals |

The indexer got a `uint256` build profile in [asi-chain-indexer#38](https://github.com/asi-alliance/asi-chain-indexer/pull/38) on 9 November 2026. The published image `0bb60e89db36` was built before it. Support in the other tools is open work in [asi-chain-wallet-sdk#221](https://github.com/asi-alliance/asi-chain-wallet-sdk/pull/221), [asi-chain-wallet-sdk#220](https://github.com/asi-alliance/asi-chain-wallet-sdk/issues/220), [rust-client#87](https://github.com/F1R3FLY-io/rust-client/issues/87) and [rust-client#88](https://github.com/F1R3FLY-io/rust-client/pull/88).

Before you move an app to 18 decimals or uint256, send 1 atomic unit, `9007199254740993` and `10000000000000000001` atomic units through the node, the indexer and the app, and compare the balances and the history.

## Sources

The node facts come from asi-chain-rust-node at [43d69b76046a](https://github.com/asi-alliance/asi-chain-rust-node/tree/43d69b76046a3750527ad4495074f71a6dd15afb). The amount format is the same in the image commit `0ccc315d84b3` and on `dev` on 10 November 2026.

- [u256-token-amounts.md](https://github.com/asi-alliance/asi-chain-rust-node/blob/43d69b76046a3750527ad4495074f71a6dd15afb/docs/designs/u256-token-amounts.md) describes the uint256 format.
- [api-reference.md](https://github.com/asi-alliance/asi-chain-rust-node/blob/43d69b76046a3750527ad4495074f71a6dd15afb/docs/node/api-reference.md) lists the string fields of the HTTP API.
- [web_api.rs](https://github.com/asi-alliance/asi-chain-rust-node/blob/43d69b76046a3750527ad4495074f71a6dd15afb/node/src/rust/api/web_api.rs#L1472-L1485) defines the token fields of `/api/status`.
- [defaults.conf](https://github.com/asi-alliance/asi-chain-rust-node/blob/43d69b76046a3750527ad4495074f71a6dd15afb/node/src/main/resources/defaults.conf#L543-L545) holds the default token values.
- [functions/index.ts](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/3c97c50046aec330da19ee9531be5a3c4ffe2dfa/src/utils/functions/index.ts#L23-L74) is `toAtomicAmount` in Wallet SDK 2.1.0.

## Next Steps

<CardGrid columns="2">
<DocCard title="Functions" href="/wallet-sdk/api-reference/functions/">Amount conversion in Wallet SDK 2.1.0</DocCard>
<DocCard title="Wallet CLI" href="/cli/usage/">Raw amounts for the send command</DocCard>
<DocCard title="Node Image" href="/nodes/image/">Run the Rust node from its image</DocCard>
<DocCard title="Container Images" href="/reference/container-images/">Image versions, digests and source revisions</DocCard>
</CardGrid>
