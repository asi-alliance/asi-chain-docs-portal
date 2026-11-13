# Data Flow

How chain data reaches the explorer and the wallet, and how a deploy (signed Rholang code sent to a node) moves from signature to finalization.

## Indexing Path

<Diagram name="data-pipeline" caption="The indexer copies node data into PostgreSQL, Hasura serves it as GraphQL, and the wallet and SDK also read the node directly." />

The [indexer node client](https://github.com/asi-alliance/asi-chain-indexer/blob/dev/src/grpc_node_client.py) calls the node over gRPC and HTTP. PostgreSQL and Hasura run as separate services. The explorer reads indexed data from Hasura. It does not extract chain blocks and does not own the database.

The indexer polls the node every `SYNC_INTERVAL`. Besides blocks it reads bonds and the node's pending deploys. A separate `metrics-cron` service refreshes the aggregated network metrics every three minutes.

## Deploy Lifecycle

A deploy passes through separate states. Each one is visible through a different node endpoint, and a successful response at one step does not guarantee the next state.

<Diagram name="deploy-lifecycle" caption="The states of a deploy from signature to finalization, and what moves it to the next one." />

| State | What it means | Where to look |
|---|---|---|
| Pending | The node accepted the deploy and holds it in its local queue. Observers always answer with an empty list | `GET /api/pending-deploys` |
| In a block | A validator included the deploy, executed its Rholang and signed the block | `GET /api/deploy/{deploy_id}` |
| Finalized | The block that holds the deploy is finalized. Whether the deploy's effects were kept is reported per deploy | `GET /api/is-finalized/{hash}`, `GET /api/deploy-finalization-status/{sig}` |

A validator creates a block when its proposer triggers and both the synchrony and the height constraints hold. By default the heartbeat proposer checks every 3 seconds. Peers that receive the block validate it before adding it to their DAG.

A block can finalize while some of its deploys have their effects dropped during state merge. Poll `deploy-finalization-status` with the deploy signature rather than the block hash alone. `GET /api/deploy/{deploy_id}` returns 404 while no block known to the node contains the deploy, so a 404 right after submission does not mean the deploy was lost.

A successful API response or an indexed row alone does not prove a successful, finalized token transfer. Handle amounts as exact raw integers (atomic units).

## Node and GraphQL

Read these from the node:

- The balance of an address through `GET /api/balance/{address}`, or with a Rholang query through `POST /api/explore-deploy`
- Deploy status and finalization through `/api/deploy/{deploy_id}`, `/api/pending-deploys`, `/api/is-finalized/{hash}` and `/api/deploy-finalization-status/{sig}`
- Blocks, the validators and the epoch through `/api/last-finalized-block`, `/api/blocks`, `/api/validators` and `/api/epoch`

Read these from the indexer through Hasura GraphQL:

- The transaction history of an address
- Block and transfer lists and network statistics

The wallet reads balances through the SDK from the node, and its history from GraphQL.

Migrations, Hasura relationships, permissions and endpoint selection must match the indexer you run.
