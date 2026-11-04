# Set up a private shard

A private shard needs its own genesis, validator identities, bonds, token metadata, storage and network configuration. It does not join an existing network by reusing that network's bootstrap identity.

Use the maintained [Rust source at the selected revision](https://github.com/F1R3FLY-io/f1r3node-rust/tree/e6ecf23814a306e4ad9850ea44fc753f40966db8) and a [published digest](/general/container-images/). The upstream [Docker guide](https://github.com/F1R3FLY-io/f1r3node-rust/blob/e6ecf23814a306e4ad9850ea44fc753f40966db8/docker/README.md) and [shard topology](https://github.com/F1R3FLY-io/f1r3node-rust/blob/e6ecf23814a306e4ad9850ea44fc753f40966db8/docker/shard.yml) are development references. Review image/build settings; sample keys and public host mappings must not become production settings.

## Required decisions

| Input | Define before initialization |
|---|---|
| Node/client pair | Exact revisions, digests and API compatibility |
| Genesis | Shard ID, allocations, bonds and ceremony participants |
| Native token | Name, symbol and decimals; ASI integrations use eight decimals |
| Consensus | Bonded stake, validator admission and safety assumptions |
| Networking | Bootstrap identity, private management access and approved API routes |
| Persistence | Ownership, backups, recovery and retention |
| Consumers | Indexer migrations, PostgreSQL, Hasura metadata/permissions and application endpoints |

A sample topology's count is not a universal minimum or a fault-tolerance guarantee. Validate the actual bonded set and stake assumptions. Fixed block times and safety thresholds cannot be copied from former examples without review.

Use fresh private credentials. Do not reuse published development keys or retired deployment helpers. See [validator image](/shard-nodes/validator-image/) for paths and ports, and [architecture](/architecture/) for consumer data paths.
