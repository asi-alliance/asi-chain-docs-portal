# Join as an observer

Use an observer to follow chain state without participating as a bonded validator. Select the node revision and shard configuration accepted by the target network.

1. Obtain the current bootstrap URI, shard/genesis settings, approved digest and query endpoints from the operator.
2. Pull the existing Rust image by digest using the [catalog](/general/container-images/). Confirm source labels and `run --help`.
3. Configure the observer without validator signing arguments, using reviewed HOCON overrides, persistent data and TLS inputs. See [observer image](/shard-nodes/observer-image/).
4. Permit intended peer traffic on TCP `40400` and `40404`. Review host mappings; keep privileged APIs and metrics private.
5. Confirm readiness, catch-up and canonical finalization against a trusted peer before serving application reads.

The former claim that a particular public observer is unstable is historical. This page does not select a public validator as a substitute or publish a current network inventory. Use the operator's approved API URLs.

Applications can query node HTTP or the indexer's Hasura GraphQL according to their API contract. The [explorer](/explorer/usage/) uses Hasura; it does not index the chain itself.
