# Shard and node roles

A shard combines peer connectivity, consensus, execution and persistent state. The exact genesis, native token, active bonded validator set and admission policy belong to the selected network.

| Role | Meaning |
|---|---|
| Bootstrap | Peer entry point; ceremony behavior depends on its configuration |
| Validator | Participates in consensus according to active bonded stake |
| Observer | Follows chain state without proposing validator blocks |
| External joining node | Needs accepted configuration and a network-specific admission/bonding process |

The same [Rust node image](/shard-nodes/validator-image/) serves different roles. A role label, configured signing key or running container alone does not establish synchronization, active stake or canonical finalization. A bootstrap is not automatically a bonded validator.

## Applications and indexing

The Python indexer calls node gRPC and HTTP directly, then writes PostgreSQL. Hasura exposes GraphQL for the explorer and other consumers. Wallets also use node HTTP. See [architecture](/architecture/) and [data flow](/architecture/data-flow/).

## Connection details

Request the current bootstrap URI, approved image digest, shard/genesis settings, API URLs and resource requirements from the operator. This page does not publish a live host inventory. Earlier node counts, IPs, block-time estimates and observer status are historical examples.

Follow [validator preparation](/quick-start/join-validator/), [observer preparation](/quick-start/join-observer/) or [private shard planning](/shard-nodes/own-shard/) for the applicable workflow.
