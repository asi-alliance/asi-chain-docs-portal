# Explorer Components

The explorer at [github.com/asi-alliance/asi-chain-explorer](https://github.com/asi-alliance/asi-chain-explorer/tree/dev) is a React frontend served by nginx in its published image. It reads chain data from Hasura over GraphQL, so most of this page describes the indexer tables behind Hasura.

The frontend uses three connections.

- Queries go to `REACT_APP_GRAPHQL_URL` as GraphQL over HTTP.
- Live updates (new blocks, transfers and deployments) arrive as GraphQL subscriptions over WebSocket at `REACT_APP_GRAPHQL_WS_URL`.
- The status page polls the indexer status endpoint through the web server of the explorer (`REACT_APP_INDEXER_API_URL`, `/api/indexer` by default).

The source also contains a wallet balance lookup (`WalletSearch` and `walletService`) that would send a Rholang query to `REACT_APP_RCHAIN_NODE_URL` with `POST /api/explore-deploy`. No page of the explorer uses it, so the explorer does not call a node.

The Python indexer extracts chain data and writes it to the database. Hasura adds relationships and permissions and serves GraphQL. Both run separately from the frontend container.

## Indexer Database

The indexer writes the tables below to PostgreSQL, as defined by migrations 000 to 007 in [github.com/asi-alliance/asi-chain-indexer](https://github.com/asi-alliance/asi-chain-indexer/tree/dev/migrations). The figure shows how the tables relate, and the two tables below list their keys, relations and main columns.

Hasura serves every table except these four. The init script also publishes six views, including `native_transfer_lifecycle`, and three functions.

- `native_transfer_calls`
- `native_transfer_results`
- `native_transfer_result_aliases`
- `network_metrics_buckets`

The figure and the tables leave out the link table `native_transfer_result_aliases`, whose rows pair a `native_transfer_results` id with a `native_transfer_calls` id.

<Diagram name="explorer-tables" caption="The indexer tables as a star around blocks. Lines are foreign key relations, and six tables have none." />

### Keys and Relations

| Table and Key | Related Tables |
|---|---|
| `blocks`<br>Key `block_hash` varchar | Each by `block_hash`:<br>`block_parents`<br>`deployments`<br>`transfers`<br>`validator_bonds`<br>`block_validators`<br>`balance_states`<br>`native_transfer_calls`<br>`native_transfer_results` |
| `block_parents`<br>Key `block_hash` varchar, `parent_hash` varchar | `blocks` by `block_hash` |
| `deployments`<br>Key `deploy_id` varchar | `blocks` by `block_hash`<br>`transfers` by `deploy_id`<br>`native_transfer_calls` by `deploy_id`<br>`native_transfer_results` by `deploy_id` |
| `transfers`<br>Key `id` bigint | `blocks` by `block_hash`<br>`deployments` by `deploy_id`<br>at most one `native_transfer_results` row by `native_result_id` |
| `native_transfer_calls`<br>Key `id` varchar | `blocks` by `block_hash`<br>`deployments` by `deploy_id`<br>`native_transfer_results` by `call_id` |
| `native_transfer_results`<br>Key `id` varchar | `blocks` by `block_hash`<br>`deployments` by `deploy_id`<br>`native_transfer_calls` by `call_id`<br>at most one `transfers` row by `native_result_id` |
| `validator_bonds`<br>Key `id` bigint | `blocks` by `block_hash` |
| `block_validators`<br>Key `block_hash` varchar, `validator_public_key` varchar | `blocks` by `block_hash` |
| `balance_states`<br>Key `id` bigint | `blocks` by `block_hash` |
| `validators`<br>Key `public_key` varchar | none |
| `pending_deploys`<br>Key `sig` varchar | none |
| `epoch_transitions`<br>Key `id` bigint | none |
| `network_stats`<br>Key `id` bigint | none |
| `indexer_state`<br>Key `key` varchar | none |
| `network_metrics_buckets`<br>Key `bucket_start` timestamptz | none |

### Main Columns

| Table | Main Columns |
|---|---|
| `blocks` | `block_number` bigint<br>`proposer` varchar<br>`finalization_status` varchar<br>`deployment_count` int<br>`token_decimals` int |
| `block_parents` | `parent_index` int |
| `deployments` | `block_hash` varchar<br>`deployer_address` varchar<br>`phlo_cost` bigint<br>`errored` boolean<br>`status` varchar |
| `transfers` | `deploy_id` varchar<br>`block_hash` varchar<br>`from_address` varchar<br>`to_address` varchar<br>`amount_dust` numeric<br>`event_index` int<br>`native_result_id` varchar |
| `native_transfer_calls` | `block_hash` varchar<br>`deploy_id` varchar<br>`event_index` int<br>`requested_amount` text |
| `native_transfer_results` | `call_id` varchar<br>`block_hash` varchar<br>`deploy_id` varchar<br>`phase` varchar<br>`success` boolean |
| `validator_bonds` | `block_hash` varchar<br>`validator_public_key` varchar<br>`stake` numeric |
| `block_validators` | none besides the key |
| `balance_states` | `address` varchar<br>`block_hash` varchar<br>`unbonded_balance_dust` numeric<br>`bonded_balance_dust` numeric |
| `validators` | `status` varchar<br>`total_stake` numeric |
| `pending_deploys` | `deployer_address` varchar<br>`is_rejected` boolean |
| `epoch_transitions` | `epoch_number` bigint<br>`start_block` bigint<br>`end_block` bigint |
| `network_stats` | `block_number` bigint<br>`active_validators` int<br>`consensus_status` varchar |
| `indexer_state` | `value` text |
| `network_metrics_buckets` | `deployments_count` bigint<br>`transfers_count` bigint |

The schema also follows these rules.

Amounts in the smallest token unit are `NUMERIC(78,0)` and limited to the unsigned 256-bit range. These columns are:

- `amount_dust`
- `stake`
- `total_stake`
- `bonded_balance_dust`
- `unbonded_balance_dust`
- `phlo_price` in `deployments` and `pending_deploys`

The matching `*_asi` columns are `NUMERIC(155,77)`, and the generated totals in `balance_states` are one digit wider.

These tables carry a `token_decimals` column:

- `blocks`
- `transfers`
- `validators`
- `validator_bonds`
- `balance_states`
- `native_transfer_calls`

These tables have no foreign keys:

- `validators`
- `pending_deploys`
- `epoch_transitions`
- `network_stats`
- `indexer_state`
- `network_metrics_buckets`

A `validators` row is linked to `validator_bonds` only by the public key value.

## Next Steps

<CardGrid columns="2">
<DocCard title="Container Images" href="/reference/container-images/">Published frontend and indexer images</DocCard>
<DocCard title="Data Flow" href="/architecture/data-flow/">How chain data reaches the explorer through the indexer</DocCard>
</CardGrid>
