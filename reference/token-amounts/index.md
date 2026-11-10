# Token Amounts and 18 Decimals

The planned ASI testnet uses **18 decimal places**: one ASI equals `1000000000000000000` atomic units. Store and transfer atomic integers; apply decimal precision when converting user input or displaying amounts.

::: warning Rollout status — 8 November 2026
The ASI Rust node source includes the uint256 protocol. [ASI node PR #1](https://github.com/asi-alliance/asi-chain-rust-node/pull/1) proposes ASI name/symbol and 18-decimal defaults and is still open. SDK, client and application integration is also in progress. This page describes the planned testnet denomination and the source contract; it does not establish that public endpoints or published packages already support it. Confirm the selected network and compatible application release before sending funds.
:::

## Determine the network's precision

Read `GET /api/status` from the selected Rust node and inspect `nativeTokenName`, `nativeTokenSymbol` and `nativeTokenDecimals`. The node's supported native precision is 0 through 18. Verify the network identity as well as its token symbol; the symbol alone does not identify a chain.

For the planned testnet, expect ASI metadata with `nativeTokenDecimals: 18`. Treat missing metadata as an unknown network profile until its denomination is confirmed. An explicitly invalid value must fail validation rather than silently falling back to eight decimals.

Metadata is established at genesis. Editing a display setting or updating a binary does not migrate existing balances. Historical eight-decimal records and pending operations must keep the precision recorded for their original network. Do not relabel or rescale them using the current network's precision.

## Convert between ASI and atomic units

For precision `d`, atomic amount = token amount × 10^d, calculated exactly. Reject input with nonzero digits beyond the network's precision rather than silently rounding or truncating it. Ordinary outgoing transfers must be positive and within the selected protocol's range.

| ASI on an 18-decimal network | Atomic units |
| --- | --- |
| `0.000000000000000001` | `1` |
| `0.5` | `500000000000000000` |
| `1` | `1000000000000000000` |
| `1.000000000000000001` | `1000000000000000001` |
| `10` | `10000000000000000000` |

The same `100000000` atomic units represent `1` ASI at eight decimals but only `0.0000000001` ASI at eighteen decimals. CLI examples that use eight decimals cannot be copied as token amounts for the planned testnet. Check whether the selected CLI accepts atomic units or human-readable tokens.

## Preserve exact values in applications

JavaScript `number` represents integers exactly only through `9007199254740991` (2^53 − 1). Even one ASI at eighteen decimals exceeds this boundary. Signed int64 stops at `9223372036854775807`, equivalent to `9.223372036854775807` ASI at this precision.

Keep user-entered amounts and JSON monetary fields as decimal strings. Use `bigint` or an exact integer library for atomic arithmetic. Construct a BigInt from the original string; `BigInt(number)` cannot restore digits already rounded by JavaScript. Avoid `Number`, `parseFloat`, floating-point multiplication by 10^18 and number-returning formatters for signing, balances, fees, Max, reservations or history.

This example demonstrates representation only; it does not submit a transfer or establish SDK compatibility:

```ts
const raw = "1000000000000000001";
const atomic = BigInt(raw);
const unit = 10n ** 18n; // Use the validated network precision in an application.
const fraction = (atomic % unit).toString().padStart(18, "0");
const display = atomic / unit + "." + fraction;
// display === "1.000000000000000001"
const json = JSON.stringify({ amount: atomic.toString() });
// {"amount":"1000000000000000001"}
```

Native `bigint` values need explicit string conversion for JSON. Preserve strings through database drivers, GraphQL responses, browser state and CSV/JSON exports. For history, format each record with its recorded precision. An unavailable balance is an error or unknown value, not a zero balance.

## BigInt, uint256 and denomination are separate

BigInt provides exact integer arithmetic. The node's uint256 monetary protocol bounds individual successful monetary values to `0..2^256-1`; zero is valid for balances but not an ordinary outgoing transfer. Failed-transfer reports can retain signed or out-of-range attempted values and must remain distinguishable from successful transfers.

The selected uint256 source contract uses canonical decimal strings for public monetary fields, including stakes, transfers, `phloPrice` and `minPhloPrice`. Public gRPC transfer reports use `TransferInfo.amountRaw`. Peer protobuf stakes and deploy prices use exactly 32 unsigned big-endian bytes, and deploy signatures cover that encoding. Block heights, timestamps, counts and phlo units remain bounded integers.

Changing an SDK's decimal multiplier does not update its protobuf encoder or signing rules. A client that signs the old int64 price field is incompatible with the uint256 node even when it displays eighteen digits correctly. Select compatible node, SDK/client, wallet/CLI/faucet and indexer/explorer releases together. Calculate fee charges from exact prices and phlo units before converting the resulting atomic amount for display; denomination does not change the amount of computation a phlo unit represents.

Before rollout, validate exact transfers, sender fees and recipient balance changes through node → indexer → database/GraphQL → wallet/explorer/history/export. Include one atomic unit, `9007199254740993` and `10000000000000000001` atomic units, network switching and persisted pending operations. A green build or a metadata response alone does not prove this path.

## Source and integration references

The node contract above was checked against ASI Rust node `dev` at [43d69b76046a](https://github.com/asi-alliance/asi-chain-rust-node/tree/43d69b76046a3750527ad4495074f71a6dd15afb), equal to upstream `dev` on 8 November 2026. See its [uint256 specification](https://github.com/asi-alliance/asi-chain-rust-node/blob/43d69b76046a3750527ad4495074f71a6dd15afb/docs/designs/u256-token-amounts.md) and [status metadata fields](https://github.com/asi-alliance/asi-chain-rust-node/blob/43d69b76046a3750527ad4495074f71a6dd15afb/node/src/rust/api/web_api.rs).

Relevant integration work includes [SDK precision PR #221](https://github.com/asi-alliance/asi-chain-wallet-sdk/pull/221), [SDK uint256 issue #220](https://github.com/asi-alliance/asi-chain-wallet-sdk/issues/220), [Rust client uint256 issue #87](https://github.com/F1R3FLY-io/rust-client/issues/87) and [indexer uint256 PR #38](https://github.com/asi-alliance/asi-chain-indexer/pull/38). These references track implementation; they are not a list of released, mutually compatible versions.
