# Component diagrams

The [architecture overview](/architecture/) describes the source-verified component boundaries.

| Component | Technology | Responsibility |
|---|---|---|
| Wallet | React and Wallet SDK | Node HTTP and indexed-data interactions |
| Explorer | React frontend | Queries Hasura GraphQL |
| Indexer | Python | Reads node gRPC/HTTP and writes PostgreSQL |
| Hasura | GraphQL service | Exposes approved database data |
| Node | Rust | CBC Casper, Rholang execution, RSpace++ and node APIs |

See [explorer components](./explorer/) and [node components](./node/). The detailed [wallet diagram](./wallet/) retains earlier material and requires revision-specific review; check [documentation status](/general/documentation-status/).
