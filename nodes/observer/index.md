# Run an Observer

Run an [observer](/reference/glossary/#observer) on a [shard](/reference/glossary/#shard) that an operator already runs. The observer follows the chain and answers read requests, but never creates blocks. You need Docker and a few values from the shard operator.

::: info Terminal
The commands are written for bash. On Linux run them in a terminal. On macOS run `bash` in a terminal first, because commands with `read -rsp` do not work in zsh. On Windows run them in a WSL terminal such as Ubuntu with the WSL integration of Docker Desktop turned on, and keep key files in the Linux home directory, not under `/mnt/c`, because the client refuses a key file that other users can read.
:::

## Before You Start

You need Docker. Ask the shard operator for:

- The node image the shard accepts.
- The [bootstrap URI](/reference/glossary/#bootstrap-uri).
- The [network ID](/reference/glossary/#network-id) and the [shard name](/reference/glossary/#shard-name).
- The CPU, memory and disk that a node of this shard needs.

## Run the Observer

Run all steps in one bash terminal. In a new terminal, run the block of Set the Variables again.

<Steps>

### Set the Variables

Replace each value in single quotes with the operator's value. The image comes from the [image catalog](/reference/container-images/). Replace it if the operator names another. `PUBLIC_HOST` is the public IP or DNS name at which the shard nodes reach this machine, with TCP ports `40400` and `40404` open to them. On a home network, forward both ports on the router to this machine.

```bash
NODE_IMAGE='public.ecr.aws/l2u2v4a8/asi-chain/node-rust@sha256:f46bc3542ae9cab873f3a6e4f40651546bfeba47fb3d1d65966564b18d3123b6'
NETWORK_ID='<networkId of the shard>'
SHARD_NAME='<shardId of the shard>'
PUBLIC_HOST='<public IP or DNS name of this machine>'
BOOTSTRAP_URI='<bootstrap URI from the shard operator>'
```

### Start the Observer

This block creates the data volume, gives the node access to it and starts the node. The token flags repeat the token settings of the shard. If the shard nodes reach this machine at a private address, add `--allow-private-addresses` to the `run` command. If the shard runs in Docker on this machine, use the read-only node of [Set Up a Private Shard](/nodes/private-shard/) instead.

```bash
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

### Check the Node

Ask the node for its state and repeat until it is ready.

```bash
curl -s -w ' HTTP %{http_code}\n' http://127.0.0.1:40403/api/ready
curl -s http://127.0.0.1:40403/api/status
```

`/api/ready` returns `{"ready":true} HTTP 200`. The observer works when `/api/status` shows `"isReadOnly":true`, `"isReady":true`, a `"peers"` value above 0 and a `"lastFinalizedBlockNumber"` that grows from one run to the next. If `peers` stays at 0, see [Troubleshooting](/help/troubleshooting/#no-peer-connection).

### Manage the Node

The first command shows the log, and the second restarts the node.

```bash
docker logs --tail 100 observer
docker restart observer
```

To move to a new image, set `NODE_IMAGE` to the new digest from the operator, remove the container with `docker rm -f observer` and run the `docker run -d` command of [Start the Observer](#start-the-observer) again. Keep the volume `observer-data`. It holds the node identity.

</Steps>

## Who Reads the Observer

The HTTP port `40403` listens only on this machine. Programs on other machines need a [gateway](/reference/glossary/#gateway) in front of it that passes only the paths they need. Applications read the node HTTP API or the Hasura GraphQL of the [indexer](/reference/glossary/#indexer), and the [explorer](/explorer/usage/) reads Hasura only. The observer rejects [deploys](/reference/glossary/#deploy) with `Deploy was rejected because node is running in read-only mode` and runs [exploratory deploys](/reference/glossary/#exploratory-deploy).

## Next Steps

<CardGrid columns="2">
<DocCard title="Node Image" href="/nodes/image/">Image selection, ports and configuration flags</DocCard>
<DocCard title="Run a Validator" href="/nodes/validator/">Create the key, start the node, fund it and submit the bond</DocCard>
<DocCard title="Troubleshooting" href="/help/troubleshooting/">What to check when peers stay at 0</DocCard>
</CardGrid>
