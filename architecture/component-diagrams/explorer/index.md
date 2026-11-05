# Explorer Components

The explorer at [github.com/asi-alliance/asi-chain-explorer](https://github.com/asi-alliance/asi-chain-explorer/tree/0ae1eea64234c86937b3adf39fc6a5551b228f1a) is a React frontend served by nginx in its published image. It reads chain data from Hasura over GraphQL and talks to a node directly for wallet balance lookups.

```mermaid
flowchart LR
  Browser[Explorer frontend]
  Browser -->|GraphQL over HTTP| Hasura[Hasura]
  Browser <-->|GraphQL subscriptions over WebSocket| Hasura
  Browser -->|POST /api/explore-deploy, GET /status| Node[Node HTTP API]
  Hasura --> PG[(PostgreSQL)]
  Indexer[Python indexer] --> PG
  Indexer -->|gRPC / HTTP| Node
```

The frontend uses three connections.

- Queries and mutations go to `REACT_APP_GRAPHQL_URL`.
- Live updates (new blocks, transfers, deployments, network statistics) arrive as GraphQL subscriptions over `REACT_APP_GRAPHQL_WS_URL`.
- The wallet balance lookup sends a Rholang balance query to `REACT_APP_RCHAIN_NODE_URL` with `POST /api/explore-deploy` and checks the node with `GET /status`. When `NODE_ENV` is `development`, the node URL is empty, so requests go to the same origin as the page.

The Python indexer performs extraction and database writes. Hasura provides relationships, permissions and GraphQL. These services are separate from the frontend container.

## Indexer Database

The indexer writes these tables to PostgreSQL. Hasura serves all of them except `native_transfer_calls`, `native_transfer_results` and `network_metrics_buckets`, and adds the `native_transfer_lifecycle` view. The diagram shows keys and the main columns from migrations 000 to 003 in [github.com/asi-alliance/asi-chain-indexer](https://github.com/asi-alliance/asi-chain-indexer/tree/71e80edb0bbae7dfbbab0e0393901edb70df471d/migrations). It leaves out the link table `native_transfer_result_aliases`, whose rows pair a `native_transfer_results` id with a `native_transfer_calls` id.

```mermaid
erDiagram
  blocks ||--o{ block_parents : "block_hash"
  blocks ||--o{ deployments : "block_hash"
  blocks ||--o{ transfers : "block_hash"
  blocks ||--o{ validator_bonds : "block_hash"
  blocks ||--o{ block_validators : "block_hash"
  blocks ||--o{ balance_states : "block_hash"
  blocks ||--o{ native_transfer_calls : "block_hash"
  deployments ||--o{ transfers : "deploy_id"
  deployments ||--o{ native_transfer_calls : "deploy_id"
  native_transfer_calls ||--o{ native_transfer_results : "call_id"
  blocks ||--o{ native_transfer_results : "block_hash"
  deployments ||--o{ native_transfer_results : "deploy_id"
  native_transfer_results ||--o| transfers : "native_result_id"

  blocks {
    varchar block_hash PK
    bigint block_number
    varchar proposer
    varchar finalization_status
    int deployment_count
    int token_decimals
  }
  block_parents {
    varchar block_hash PK
    varchar parent_hash PK
    int parent_index
  }
  deployments {
    varchar deploy_id PK
    varchar block_hash FK
    varchar deployer_address
    bigint phlo_cost
    boolean errored
    varchar status
  }
  transfers {
    bigint id PK
    varchar deploy_id FK
    varchar block_hash FK
    varchar from_address
    varchar to_address
    numeric amount_dust
    int event_index
    varchar native_result_id FK
  }
  native_transfer_calls {
    varchar id PK
    varchar block_hash FK
    varchar deploy_id FK
    int event_index
    text requested_amount
  }
  native_transfer_results {
    varchar id PK
    varchar call_id FK
    varchar block_hash FK
    varchar deploy_id FK
    varchar phase
    boolean success
  }
  validator_bonds {
    bigint id PK
    varchar block_hash FK
    varchar validator_public_key
    numeric stake
  }
  block_validators {
    varchar block_hash PK
    varchar validator_public_key PK
  }
  balance_states {
    bigint id PK
    varchar address
    varchar block_hash FK
    numeric unbonded_balance_dust
    numeric bonded_balance_dust
  }
  validators {
    varchar public_key PK
    varchar status
    numeric total_stake
  }
  pending_deploys {
    varchar sig PK
    varchar deployer_address
    boolean is_rejected
  }
  epoch_transitions {
    bigint id PK
    bigint epoch_number
    bigint start_block
    bigint end_block
  }
  network_stats {
    bigint id PK
    bigint block_number
    int active_validators
    varchar consensus_status
  }
  indexer_state {
    varchar key PK
    text value
  }
  network_metrics_buckets {
    timestamptz bucket_start PK
    bigint deployments_count
    bigint transfers_count
  }
```

After migration 001, amounts in the smallest token unit (`amount_dust`, `stake`, `total_stake`, `bonded_balance_dust` and `unbonded_balance_dust`) are `NUMERIC(78,0)` and limited to the unsigned 256-bit range. The matching `*_asi` columns are `NUMERIC(155,77)`, and the generated totals in `balance_states` are one digit wider. Each of the tables `blocks`, `transfers`, `validators`, `validator_bonds` and `balance_states` carries a `token_decimals` column. The tables `validators`, `pending_deploys`, `epoch_transitions`, `network_stats`, `indexer_state` and `network_metrics_buckets` have no foreign keys. A `validators` row is linked to `validator_bonds` only by the public key value.

See [container images](/general/container-images/) for the published frontend and indexer revisions and [data flow](/architecture/data-flow/) for revision boundaries.
