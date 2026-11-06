# Shard and Node Roles

A shard combines peer connectivity, consensus, execution and persistent state. The exact genesis, native token, active bonded validator set and admission policy belong to the selected network.

::: warning DevNet Runs the Scala Node
As of 5 November 2026 the public DevNet runs a Scala node: `GET /api/status` on Validator 1 reports `RChain Node 1.0.0-SNAPSHOT`. Use the Rust node image described in this section for your own shard or for a network whose operator runs Rust. A Rust node started from it against the DevNet bootstrap did not get past `peers: 0`.
:::

| Role | Meaning |
|---|---|
| Bootstrap | Peer entry point; ceremony behavior depends on its configuration |
| Validator | Participates in consensus according to active bonded stake |
| Observer | Follows chain state without proposing validator blocks |
| External joining node | Needs accepted configuration and a network-specific admission and bonding process |

The same [Rust node image](/nodes/image/) serves the different roles. A role label, configured signing key or running container alone does not establish synchronization, active stake or canonical finalization. A bootstrap is not automatically a bonded validator.

## Applications and Indexing

The Python indexer calls node gRPC and HTTP directly, then writes to PostgreSQL. Hasura exposes GraphQL for the explorer and other consumers. Wallets also use node HTTP. See [architecture](/architecture/) and [data flow](/architecture/data-flow/).

## Connection Details

DevNet addresses for wallets, tools and the explorer are on [network endpoints](/reference/endpoints/). DevNet does not publish a separate observer address, and reads go through the same validator as writes. For any other network, request the bootstrap URI, approved image digest, shard and genesis settings, API URLs and resource requirements from its operator. This page does not publish a host inventory or node counts.

## Next Steps

<CardGrid columns="2">
<DocCard title="Run a Validator" href="/nodes/validator/">Prepare a Rust node that is meant to become a validator</DocCard>
<DocCard title="Run an Observer" href="/nodes/observer/">Start a read-only Rust node that follows the chain</DocCard>
<DocCard title="Set Up a Private Shard" href="/nodes/private-shard/">Plan genesis, identities, bonds and token metadata for your own shard</DocCard>
</CardGrid>
