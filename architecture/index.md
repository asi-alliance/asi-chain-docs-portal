# Technical Architecture

The wallet, the Wallet SDK, the CLI and the faucet send requests to the node, and the explorer and the wallet read indexed chain data through GraphQL. The maintained node is implemented in Rust and combines CBC Casper consensus, Rholang execution and RSpace++ storage with P2P, gRPC and HTTP services.

<Diagram name="architecture-overview" caption="Clients call the node, the indexer copies chain data into PostgreSQL, and Hasura serves it to the explorer and the wallet." />

The indexer calls node APIs directly through its Python gRPC/HTTP client and writes the results to PostgreSQL. Hasura exposes PostgreSQL as a GraphQL API. The explorer is only a frontend and does not index or store data.

## Next Steps

<CardGrid columns="2">
<DocCard title="Network Topology" href="/architecture/network-topology/">Node roles, ports, access and firewall rules</DocCard>
<DocCard title="Data Flow" href="/architecture/data-flow/">Deploy lifecycle and which data comes from the node or from GraphQL</DocCard>
<DocCard title="Component Diagrams" href="/architecture/component-diagrams/">Node, explorer and wallet components</DocCard>
<DocCard title="Sequence Diagrams" href="/architecture/sequence-diagrams/">Interaction flows between the wallet and the nodes</DocCard>
</CardGrid>

See also the [state diagrams](/architecture/state-diagrams/) and the [container images](/reference/container-images/) with the exact image and source pairs.
