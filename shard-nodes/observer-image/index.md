# Observer node image

An observer uses the same [Rust node image](/shard-nodes/validator-image/) as a validator, with a different role/configuration. There is no separate observer image in the current [ECR catalog](/general/container-images/).

## Role and API access

An observer follows the chain without proposing validator blocks. Its role is not an API authorization rule: configure allowed routes and clients separately. Do not assume an observer rejects every write request simply because it is not bonded.

The [pinned upstream observer service](https://github.com/F1R3FLY-io/f1r3node-rust/blob/e6ecf23814a306e4ad9850ea44fc753f40966db8/docker/shard.yml) runs without validator signing arguments, with bootstrap and configuration inputs. Check the selected image's `run --help`. This upstream Compose file is a development topology, not a public-network enrollment manifest.

## Image and configuration

Select the exact node digest approved for the target shard from [container images](/general/container-images/). Use the [validator image's runtime paths and ports](/shard-nodes/validator-image/#runtime-and-configuration).

Supply the actual bootstrap URI, shard settings, persistent storage and TLS inputs. Keep internal gRPC `40402`, admin HTTP `40405` and `/metrics` private. An application gateway may expose only a subset of node HTTP routes.

## Queries and readiness

Use the deployment's approved HTTP URL. The Rust image includes a readiness route:

```bash
curl --fail --show-error http://127.0.0.1:40403/api/ready
```

This assumes the listener is mapped to local port `40403`. Readiness alone does not prove catch-up, canonical finalization or application compatibility. Compare progress and finalization with a trusted peer and verify the API contract used by consumers.

The explorer reads Hasura GraphQL. The Python indexer connects directly to node gRPC and HTTP, stores data in PostgreSQL, and Hasura exposes that database. The standalone client image is not a runtime dependency of the indexer.

See [join as observer](/quick-start/join-observer/) and [troubleshooting](/quick-start/troubleshooting/). Earlier public observer IP/status claims are not a current availability check.
