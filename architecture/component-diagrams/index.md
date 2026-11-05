# Component Diagrams

The [architecture overview](/architecture/) describes the component boundaries.

| Component | Technology | Responsibility |
|---|---|---|
| Wallet | React, Redux and Wallet SDK | Signs and submits deploys to the node HTTP API and reads history through GraphQL |
| Explorer | React frontend | Queries Hasura GraphQL, and a node for wallet balances |
| Indexer | Python | Reads node gRPC/HTTP and writes PostgreSQL |
| Hasura | GraphQL service | Exposes approved database data |
| Node | Rust | CBC Casper, Rholang execution, RSpace++ and node APIs |

See the component diagrams for the [node](/architecture/component-diagrams/node/), the [explorer](/architecture/component-diagrams/explorer/) and the [wallet](/architecture/component-diagrams/wallet/).
