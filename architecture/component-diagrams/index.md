# Component Diagrams

The table lists the five main components of ASI:Chain with the technology and the job of each. The pages below break the wallet, the explorer and the node into their parts, and the [architecture overview](/architecture/) shows how the components connect.

| Component | Technology | Responsibility |
|---|---|---|
| Wallet | React, Redux and Wallet SDK | Signs and submits deploys to the node HTTP API and reads history through GraphQL |
| Explorer | React frontend | Reads chain data from Hasura over GraphQL |
| Indexer | Python | Reads the node over gRPC and HTTP and writes PostgreSQL |
| Hasura | GraphQL service | Exposes approved database data |
| Node | Rust | CBC Casper, Rholang execution, RSpace++ and node APIs |

## Next Steps

<CardGrid columns="2">
<DocCard title="Wallet Components" href="/architecture/component-diagrams/wallet/">React app, Redux state and the Wallet SDK</DocCard>
<DocCard title="Explorer Components" href="/architecture/component-diagrams/explorer/">React frontend and the indexer tables behind Hasura</DocCard>
<DocCard title="Node Components" href="/architecture/component-diagrams/node/">Rust crates for services, consensus, execution and storage</DocCard>
</CardGrid>
