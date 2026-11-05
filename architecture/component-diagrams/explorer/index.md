# Explorer Components

The explorer at [github.com/asi-alliance/asi-chain-explorer](https://github.com/asi-alliance/asi-chain-explorer/tree/0ae1eea64234c86937b3adf39fc6a5551b228f1a) is a React frontend served by nginx in its published image. It reads chain data from Hasura over GraphQL.

The frontend uses two connections.

- Queries and mutations go over HTTP (GraphQL over HTTP) to `REACT_APP_GRAPHQL_URL`.
- Live updates (new blocks, transfers, deployments, network statistics) arrive as GraphQL subscriptions over WebSocket at `REACT_APP_GRAPHQL_WS_URL`.

The source also contains a wallet balance lookup (`WalletSearch` and `walletService`) that would send a Rholang query to `REACT_APP_RCHAIN_NODE_URL` with `POST /api/explore-deploy`. No page of the explorer uses it at this revision, so the explorer does not call a node.

The Python indexer performs extraction and database writes. Hasura provides relationships, permissions and GraphQL. These services are separate from the frontend container.

## Indexer Database

The indexer writes these tables to PostgreSQL. Hasura serves all of them except `native_transfer_calls`, `native_transfer_results` and `network_metrics_buckets`, and adds the `native_transfer_lifecycle` view. The figure shows the relations between the tables, and the table below it lists the keys and the main columns from migrations 000 to 003 in [github.com/asi-alliance/asi-chain-indexer](https://github.com/asi-alliance/asi-chain-indexer/tree/71e80edb0bbae7dfbbab0e0393901edb70df471d/migrations). Both leave out the link table `native_transfer_result_aliases`, whose rows pair a `native_transfer_results` id with a `native_transfer_calls` id.

<Diagram name="explorer-tables" caption="The indexer tables as a star around blocks. Lines are foreign key relations, and six tables have none." />

| Table | Key | Related Tables | Main Columns |
|---|---|---|---|
| `blocks` | `block_hash` varchar | `block_parents`, `deployments`, `transfers`, `validator_bonds`, `block_validators`, `balance_states`, `native_transfer_calls` and `native_transfer_results`, each by `block_hash` | `block_number` bigint, `proposer` varchar, `finalization_status` varchar, `deployment_count` int, `token_decimals` int |
| `block_parents` | `block_hash` varchar, `parent_hash` varchar | `blocks` by `block_hash` | `parent_index` int |
| `deployments` | `deploy_id` varchar | `blocks` by `block_hash`. `transfers`, `native_transfer_calls` and `native_transfer_results` by `deploy_id` | `block_hash` varchar, `deployer_address` varchar, `phlo_cost` bigint, `errored` boolean, `status` varchar |
| `transfers` | `id` bigint | `blocks` by `block_hash`, `deployments` by `deploy_id`, and at most one `native_transfer_results` row by `native_result_id` | `deploy_id` varchar, `block_hash` varchar, `from_address` varchar, `to_address` varchar, `amount_dust` numeric, `event_index` int, `native_result_id` varchar |
| `native_transfer_calls` | `id` varchar | `blocks` by `block_hash`, `deployments` by `deploy_id`, and `native_transfer_results` by `call_id` | `block_hash` varchar, `deploy_id` varchar, `event_index` int, `requested_amount` text |
| `native_transfer_results` | `id` varchar | `blocks` by `block_hash`, `deployments` by `deploy_id`, `native_transfer_calls` by `call_id`, and at most one `transfers` row by `native_result_id` | `call_id` varchar, `block_hash` varchar, `deploy_id` varchar, `phase` varchar, `success` boolean |
| `validator_bonds` | `id` bigint | `blocks` by `block_hash` | `block_hash` varchar, `validator_public_key` varchar, `stake` numeric |
| `block_validators` | `block_hash` varchar, `validator_public_key` varchar | `blocks` by `block_hash` | none besides the key |
| `balance_states` | `id` bigint | `blocks` by `block_hash` | `address` varchar, `block_hash` varchar, `unbonded_balance_dust` numeric, `bonded_balance_dust` numeric |
| `validators` | `public_key` varchar | none | `status` varchar, `total_stake` numeric |
| `pending_deploys` | `sig` varchar | none | `deployer_address` varchar, `is_rejected` boolean |
| `epoch_transitions` | `id` bigint | none | `epoch_number` bigint, `start_block` bigint, `end_block` bigint |
| `network_stats` | `id` bigint | none | `block_number` bigint, `active_validators` int, `consensus_status` varchar |
| `indexer_state` | `key` varchar | none | `value` text |
| `network_metrics_buckets` | `bucket_start` timestamptz | none | `deployments_count` bigint, `transfers_count` bigint |

After migration 001, amounts in the smallest token unit (`amount_dust`, `stake`, `total_stake`, `bonded_balance_dust` and `unbonded_balance_dust`) are `NUMERIC(78,0)` and limited to the unsigned 256-bit range. The matching `*_asi` columns are `NUMERIC(155,77)`, and the generated totals in `balance_states` are one digit wider. Each of the tables `blocks`, `transfers`, `validators`, `validator_bonds` and `balance_states` carries a `token_decimals` column. The tables `validators`, `pending_deploys`, `epoch_transitions`, `network_stats`, `indexer_state` and `network_metrics_buckets` have no foreign keys. A `validators` row is linked to `validator_bonds` only by the public key value.

## Next Steps

<CardGrid columns="2">
<DocCard title="Container Images" href="/reference/container-images/" icon="image">The published frontend and indexer revisions.</DocCard>
<DocCard title="Data Flow" href="/architecture/data-flow/" icon="diagram">Revision boundaries.</DocCard>
</CardGrid>
