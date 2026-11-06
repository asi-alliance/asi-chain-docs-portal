# Shard and Node Roles

A shard is one network of nodes that handles peer connectivity, consensus, execution and persistent state. Its genesis, native token, active bonded validator set and admission policy are specific to each network. Each node in a shard plays one of the roles below.

| Role | Meaning |
|---|---|
| Bootstrap | Entry point for joining peers; its part in the [genesis ceremony](/architecture/state-diagrams/startup/#launch-modes) depends on its configuration |
| Validator | Participates in consensus according to active bonded stake |
| Observer | Follows chain state without proposing validator blocks |
| External joining node | Joins an existing shard once the network accepts its configuration and it passes the network's admission and bonding process |

The same [Rust node image](/nodes/image/) serves the different roles. A role label, a signing key or a running container does not by itself mean that the node is synchronized, has active stake or takes part in canonical finalization. A bootstrap is not automatically a bonded validator either.

## Applications and Indexing

The Python indexer calls node gRPC and HTTP directly, then writes to PostgreSQL. Hasura exposes GraphQL for the explorer and other consumers. Wallets also use node HTTP. See [architecture](/architecture/) and [data flow](/architecture/data-flow/).

## Connection Details

DevNet addresses for wallets, tools and the explorer are on [network endpoints](/reference/endpoints/). DevNet does not publish a separate observer address, and reads go through the same validator as writes. For any other network, request the bootstrap URI, approved image digest, shard and genesis settings, API URLs and resource requirements from its operator. This page does not publish a host inventory or node counts.

## Next Steps

<CardGrid columns="2">
<DocCard title="Run a Validator" href="/nodes/validator/">Prepare a Rust node that you later bond as a validator</DocCard>
<DocCard title="Run an Observer" href="/nodes/observer/">Start a read-only Rust node that follows the chain</DocCard>
<DocCard title="Set Up a Private Shard" href="/nodes/private-shard/">Plan genesis, identities, bonds and token metadata for your own shard</DocCard>
</CardGrid>
