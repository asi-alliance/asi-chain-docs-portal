# Run an Observer

An observer is a Rust node that follows the chain and answers read requests. It runs the same image as a validator and is started without a validator key.

::: info Terminal
The commands are written for bash. On Linux and macOS run them in a terminal. On Windows run them in a WSL terminal such as Ubuntu with the WSL integration of Docker Desktop turned on, and keep key files in the Linux home directory, not under `/mnt/c`, because the client refuses a key file that other users can read.
:::

## What an Observer Does

A node without a validator key is read-only, so `/api/status` shows `"isReadOnly": true`. It rejects writes and accepts read-only queries:

- A deploy sent to it fails with `Deploy was rejected because node is running in read-only mode`.
- A propose request fails with `Propose error: read-only node`.
- An exploratory deploy, which runs Rholang without committing it, succeeds. Only a read-only node accepts one by default.

Which routes external clients can reach depends on the gateway in front of the node.

## Before You Start

Ask the shard operator for these values.

- The image digest that the shard accepts. The [image catalog](/reference/container-images/) has no separate observer image, and [Node Image](/nodes/image/) explains how to choose the image.
- The bootstrap URI, which looks like `rnode://<node-id>@<host>?protocol=40400&discovery=40404`. The node ID is the `address` field of `GET /api/status` on the bootstrap node.
- The `--network-id` value, which must equal the `networkId` that the bootstrap node reports. The default is `testnet`, and a node that joins with another network ID exits with a `Wrong network id` error.
- The `--shard-name` value, which must equal the `shardId` that the bootstrap node reports. The default is `root`. With another value the node gets a peer but does not become ready, and `lastFinalizedBlockNumber` stays at `-1`.
- The `--host` value, which is the address other nodes use to reach this node. If you leave it out, the node tries to guess its public address, which fails behind NAT and on container networks. On a home network, write the public IP address of your router or a DNS name that points to it. Forward TCP `40400` and `40404` on the router to this machine, and allow both ports in the firewall of the host. You do not need to open `40403`.
- The CPU, memory and disk space that a node of this network needs.
- The native-token settings of the shard. They are fixed at genesis, and the observer takes the same values: `--native-token-name ASI --native-token-symbol ASI --native-token-decimals 18` for ASI. A node restarted with other values stops.

## Run the Observer

<Steps>

### Start the Observer

A new Docker volume is owned by `root`, but the image runs as `daemon` (uid 1). Without the `chown` below, the node exits with `The data dir must be a directory and have read and write permissions`.

Replace each value in angle brackets with the value from the operator.

```bash
NODE_IMAGE='public.ecr.aws/l2u2v4a8/asi-chain/node-rust@sha256:f46bc3542ae9cab873f3a6e4f40651546bfeba47fb3d1d65966564b18d3123b6'
NETWORK_ID='<networkId of the shard>'
SHARD_NAME='<shardId of the shard>'
PUBLIC_HOST='<public IP or DNS name of this machine>'
BOOTSTRAP_URI='<bootstrap URI from the shard operator>'
docker volume create observer-data
docker run --rm -u root --platform linux/amd64 --entrypoint chown \
  -v observer-data:/var/lib/rnode "$NODE_IMAGE" daemon:daemon /var/lib/rnode

docker run -d --name observer --platform linux/amd64 \
  -v observer-data:/var/lib/rnode \
  -p 40400:40400 -p 40404:40404 -p 127.0.0.1:40403:40403 \
  "$NODE_IMAGE" run --network-id "$NETWORK_ID" --shard-name "$SHARD_NAME" \
  --host "$PUBLIC_HOST" --bootstrap "$BOOTSTRAP_URI" \
  --native-token-name ASI --native-token-symbol ASI --native-token-decimals 18
```

Run the block from any folder. The `chown` command prints nothing when it succeeds. The data of the node lives in the Docker volume `observer-data`, not in a folder of the host. If the name `observer` is already taken, remove the old container with `docker rm -f observer` and run the `docker run -d` command again.

The container publishes `40400` and `40404` for peers and keeps the HTTP port `40403` on the local machine. Keep `40402` and `40405` closed. The `EXPOSE` line of the image lists `40400` to `40404` and leaves out the admin port `40405`. See the [port table](/nodes/image/#default-container-ports).

Add these flags only when you need them:

- On a private network, add `--allow-private-addresses`.
- When the ports are forwarded by hand, add `--no-upnp`.

If the shard runs in a Docker network on the same machine, as in [Set Up a Private Shard](/nodes/private-shard/), the observer there is the read-only node of that page. To run a second one, add `--network <network name>`, `--allow-private-addresses` and `--no-upnp`, use the container name as `PUBLIC_HOST`, and publish host ports that the shard does not use.

Do not add `--profile`. The image entrypoint already passes `--profile=docker`, and the node exits with an error if you pass it as well.

### Check the Node

```bash
curl -s -w ' HTTP %{http_code}\n' http://127.0.0.1:40403/api/ready
curl -s http://127.0.0.1:40403/api/status
docker inspect observer --format '{{.State.Health.Status}}'
```

The node is ready when `/api/ready` returns `{"ready":true}`. Before that it answers HTTP 503 with `{"ready":false}`. Also check that `/api/status` shows `isReady: true`, a positive `peers` count and a growing `lastFinalizedBlockNumber`.

The image healthcheck calls `/api/ready` on container port `40403`, so a joining node reports `unhealthy` until it has a peer and reaches the Running state. The same happens if you move the HTTP port, even when the node works. A joining node takes the last finalized state and recent blocks from its peers and does not download the whole history. Compare `lastFinalizedBlockNumber` with a trusted peer before you serve reads from it.

If `peers` stays at 0, follow [Troubleshooting](/help/troubleshooting/#no-peer-connection).

### Manage the Node

These commands show the log and stop and start the node:

```bash
docker logs --tail 100 observer
docker stop observer
docker start observer
```

To move to a new image, get the new digest from the operator, then stop and remove the container:

```bash
docker stop observer
docker rm observer
```

After that, run the `docker run -d` command of [Start the Observer](#start-the-observer) again with the new digest in `NODE_IMAGE`. Keep the volume, because the identity of the node is in it.

::: warning Restart Needs the Bootstrap
After a restart the node reconnects only through `--bootstrap`. If the bootstrap is unreachable, the node waits at `Waiting for first connection...`.
:::

</Steps>

::: danger Keep the Data Volume
Do not delete the volume `observer-data` of an observer that peers already know. The node identity is the TLS certificate stored there, so a new volume means a new identity and a full re-join.
:::

## Who Reads the Observer

The HTTP port `40403` is bound to `127.0.0.1`, so only programs on the same machine reach it. External clients need a gateway that passes only the paths they need. Applications can call the node HTTP API directly or use the indexer's Hasura GraphQL. The [explorer](/explorer/usage/) reads Hasura only. The indexer reads the node over gRPC and HTTP, stores blocks in PostgreSQL, and Hasura serves that database.

## Next Steps

<CardGrid columns="2">
<DocCard title="Node Image" href="/nodes/image/">Image selection, ports and configuration flags</DocCard>
<DocCard title="Run a Validator" href="/nodes/validator/">Prepare a Rust node that you later bond as a validator</DocCard>
<DocCard title="Troubleshooting" href="/help/troubleshooting/">What to check when peers stay at 0</DocCard>
</CardGrid>
