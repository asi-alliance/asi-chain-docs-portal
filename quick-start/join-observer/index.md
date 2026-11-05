# Join as an Observer

An observer is a Rust node that follows the chain and answers read requests. It runs the same image as a validator and is started without a validator key. The [image catalog](/general/container-images/) has no separate observer image.

::: warning DevNet runs the Scala node
As of 5 November 2026 the public DevNet runs a Scala node (Validator 1 reports `RChain Node 1.0.0-SNAPSHOT`), and the Rust image described here does not connect to it. A Rust observer started with the DevNet bootstrap and `--network-id devnet1` listed eight nodes in `/api/status` but opened no connection to them, and `/api/ready` kept returning 503 for more than five minutes. Use this guide for a Rust shard that you or your operator run. DevNet reads go through the addresses on [Network Endpoints](/general/endpoints/).
:::

## What an Observer Does

A node without a validator key is read-only, so `/api/status` shows `"isReadOnly": true`. It rejects writes and accepts read-only queries:

- A deploy sent to it fails with `Deploy was rejected because node is running in read-only mode`.
- A propose request fails with `Propose error: read-only node`.
- An exploratory deploy, which runs Rholang without committing it, succeeds. Only a read-only node accepts one by default.

Which routes external clients can reach depends on the gateway in front of the node.

## Inputs

Ask the operator of the shard for these values.

- The image tag or digest that the shard accepts. See [Validator Node Image](/shard-nodes/validator-image/).
- The bootstrap URI, which looks like `rnode://<node-id>@<host>?protocol=40400&discovery=40404`. The node ID is the `address` field of `GET /api/status` on the bootstrap node.
- The `--network-id` value, which must equal the `networkId` that the bootstrap node reports. The default is `testnet`, and a node ignores messages from other networks.
- The `--shard-name` value, which must equal the `shardId` that the bootstrap node reports. The default is `root`. With another value the node gets a peer but stays at `Waiting for first connection...`.
- The `--host` value, which is the address other nodes use to reach this node. If you leave it out, the node tries to guess its public address, which fails behind NAT and on container networks.
- The native-token flags and other genesis settings, but only when they differ from the built-in defaults. Each node reports its own token settings, so a node started without the flags reports `F1R3` even on a shard with another symbol.

## Start the Observer

A new Docker volume is owned by `root`, but the image runs as `daemon` (uid 1). Without the `chown` below, the node exits with `The data dir must be a directory and have read and write permissions`.

```bash
NODE_IMAGE=<image from the catalog>
NETWORK_ID=<networkId of the shard>
SHARD_NAME=<shardId of the shard>
PUBLIC_HOST=<public IP or DNS name of this machine>
BOOTSTRAP_URI='<bootstrap URI from the shard operator>'
docker volume create observer-data
docker run --rm -u root --platform linux/amd64 --entrypoint chown \
  -v observer-data:/var/lib/rnode "$NODE_IMAGE" daemon:daemon /var/lib/rnode

docker run -d --name observer --platform linux/amd64 \
  -v observer-data:/var/lib/rnode \
  -p 40400:40400 -p 40404:40404 -p 127.0.0.1:40403:40403 \
  "$NODE_IMAGE" run --network-id "$NETWORK_ID" --shard-name "$SHARD_NAME" \
  --host "$PUBLIC_HOST" --bootstrap "$BOOTSTRAP_URI"
```

The container publishes `40400` and `40404` for peers and keeps the HTTP port `40403` on the local machine. The image entrypoint already passes `--profile=docker`, and the node exits with an error if you pass `--profile` as well, so do not add one. On a private network add `--allow-private-addresses`, and add `--no-upnp` when the ports are forwarded by hand. Keep `40402` and `40405` closed. The `EXPOSE` line of the image lists `40400` to `40404` and leaves out the admin port `40405`. See the [port table](/shard-nodes/validator-image/#default-container-ports).

## Check the Node

```bash
curl -s -w ' HTTP %{http_code}\n' http://127.0.0.1:40403/api/ready
curl -s http://127.0.0.1:40403/api/status
docker inspect observer --format '{{.State.Health.Status}}'
```

The node is ready when `/api/ready` returns `{"ready":true}` and `/api/status` shows `isReady: true`, a positive `peers` count and a growing `lastFinalizedBlockNumber`. The image healthcheck calls `/api/ready` on container port `40403`, so a joining node reports `unhealthy` until it has a peer and reaches the Running state. The same happens if you move the HTTP port, even when the node works. A joining node takes the last finalized state and recent blocks from its peers and does not download the whole history. Compare `lastFinalizedBlockNumber` with a trusted peer before you serve reads from it.

If `peers` stays at 0, follow [Troubleshooting](/quick-start/troubleshooting/#no-peer-connection).

## Data

Do not delete the data directory of an observer that peers already know. The node identity is the TLS certificate stored there, so a new directory means a new identity and a full re-join.

## Who Reads the Observer

Applications can call the node HTTP API directly or use the indexer's Hasura GraphQL. The [explorer](/explorer/usage/) reads Hasura only. The indexer reads the node over gRPC and HTTP, stores blocks in PostgreSQL, and Hasura serves that database.
