# General overview

ASI:Chain provides a blockchain environment for Rholang contracts and ASI ecosystem applications. The maintained node is the pure Rust implementation in [asi-alliance/asi-chain-rust-node](https://github.com/asi-alliance/asi-chain-rust-node).

## Components

| Component | Responsibility |
|---|---|
| Node | CBC Casper consensus, Rholang execution, RSpace++ state and node APIs |
| Wallet / SDK | Account and contract interactions through node HTTP and indexed data APIs |
| Wallet CLI / ASI client | Command-line interaction with an exact client/node contract |
| Indexer | Direct node gRPC/HTTP ingestion into PostgreSQL |
| Hasura | GraphQL access to approved indexed data |
| Explorer | Frontend querying Hasura |
| Faucet frontend / API | Test-token requests and separately configured funding service |

See [architecture](/architecture/) for data paths, [container images](/general/container-images/) for published versions and [useful links](/general/useful-links/) for public sources/applications.

## Network selection

DevNet is a development environment; its test tokens have no real value. Current availability, validator admission, bootstrap identity, API endpoints and active stake are deployment-specific. Obtain current operator-provided inputs instead of copying historical IPs or fixed node counts.

Read [documentation status](/general/documentation-status/) before using older UI walkthroughs or detailed API diagrams. A successful portal build validates rendering, not technical freshness or live service readiness.
