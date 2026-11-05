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
| `blocks` | `block_hash` | `block_parents`, `deployments`, `transfers`, `validator_bonds`, `block_validators`, `balance_states`, `native_transfer_calls` and `native_transfer_results`, each by `block_hash` | `block_number`, `proposer`, `finalization_status`, `deployment_count`, `token_decimals` |
| `block_parents` | `block_hash`, `parent_hash` | `blocks` by `block_hash` | `parent_index` |
| `deployments` | `deploy_id` | `blocks` by `block_hash`. `transfers`, `native_transfer_calls` and `native_transfer_results` by `deploy_id` | `block_hash`, `deployer_address`, `phlo_cost`, `errored`, `status` |
| `transfers` | `id` | `blocks` by `block_hash`, `deployments` by `deploy_id`, and at most one `native_transfer_results` row by `native_result_id` | `deploy_id`, `block_hash`, `from_address`, `to_address`, `amount_dust`, `event_index`, `native_result_id` |
| `native_transfer_calls` | `id` | `blocks` by `block_hash`, `deployments` by `deploy_id`, and `native_transfer_results` by `call_id` | `block_hash`, `deploy_id`, `event_index`, `requested_amount` |
| `native_transfer_results` | `id` | `blocks` by `block_hash`, `deployments` by `deploy_id`, `native_transfer_calls` by `call_id`, and at most one `transfers` row by `native_result_id` | `call_id`, `block_hash`, `deploy_id`, `phase`, `success` |
| `validator_bonds` | `id` | `blocks` by `block_hash` | `block_hash`, `validator_public_key`, `stake` |
| `block_validators` | `block_hash`, `validator_public_key` | `blocks` by `block_hash` | none besides the key |
| `balance_states` | `id` | `blocks` by `block_hash` | `address`, `block_hash`, `unbonded_balance_dust`, `bonded_balance_dust` |
| `validators` | `public_key` | none | `status`, `total_stake` |
| `pending_deploys` | `sig` | none | `deployer_address`, `is_rejected` |
| `epoch_transitions` | `id` | none | `epoch_number`, `start_block`, `end_block` |
| `network_stats` | `id` | none | `block_number`, `active_validators`, `consensus_status` |
| `indexer_state` | `key` | none | `value` |
| `network_metrics_buckets` | `bucket_start` | none | `deployments_count`, `transfers_count` |

After migration 001, amounts in the smallest token unit (`amount_dust`, `stake`, `total_stake`, `bonded_balance_dust` and `unbonded_balance_dust`) are `NUMERIC(78,0)` and limited to the unsigned 256-bit range. The matching `*_asi` columns are `NUMERIC(155,77)`, and the generated totals in `balance_states` are one digit wider. Each of the tables `blocks`, `transfers`, `validators`, `validator_bonds` and `balance_states` carries a `token_decimals` column. The tables `validators`, `pending_deploys`, `epoch_transitions`, `network_stats`, `indexer_state` and `network_metrics_buckets` have no foreign keys. A `validators` row is linked to `validator_bonds` only by the public key value.

## Next Steps

<CardGrid columns="2">
<DocCard title="Container Images" href="/reference/container-images/" icon="image">The published frontend and indexer revisions.</DocCard>
<DocCard title="Data Flow" href="/architecture/data-flow/" icon="diagram">Revision boundaries.</DocCard>
</CardGrid>
