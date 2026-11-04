# Network topology

This page describes roles and default container listeners, not the current machine inventory of a hosted network.

| Role | Responsibility |
|---|---|
| Bootstrap peer | Initial peer discovery; genesis-ceremony participation depends on configuration |
| Validator | Consensus according to active bonded stake and shard admission |
| Observer | Follows chain state without proposing validator blocks |
| Indexer | Reads node APIs and stores derived chain data in PostgreSQL |
| Hasura | Exposes approved database data through GraphQL |
| Applications | Use approved node/gateway and GraphQL endpoints |

A bootstrap service is not automatically a bonded validator. Configured node counts do not prove initialization, synchronization or canonical finalization, and do not establish a fault budget without stake assumptions.

## Ports and access

The Rust node defaults are TCP `40400` P2P, `40401` external gRPC, `40402` internal gRPC, `40403` HTTP, `40404` peer discovery and `40405` admin HTTP. See the authoritative [port/exposure table](/shard-nodes/validator-image/#default-container-ports) and its pinned configuration source.

Discovery uses TCP for the documented Rust revision. Container ports and host mappings differ. Keep privileged listeners and HTTP `/metrics` private; a public HTTP gateway must select approved routes explicitly.

## Deployment inputs

Obtain current endpoints, bootstrap identity, approved image digest, shard settings, validator admission process and resource requirements from the operator. Former raw IPs, fixed validator counts and observer availability claims are historical examples. No current hosted inventory or deployment acceptance is inferred from the [published image catalog](/general/container-images/).
