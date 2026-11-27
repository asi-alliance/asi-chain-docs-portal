# Run an Observer

Run an [observer](/reference/glossary/#observer) on ASI:Chain DevNet. The observer follows the chain and answers read requests, but never creates blocks.

::: info Terminal
The commands are written for bash.

- On Linux run them in a terminal.
- On macOS run `bash` in a terminal first, because commands with `read -rsp` do not work in zsh.
- On Windows run them in a WSL terminal such as Ubuntu with the WSL integration of Docker Desktop turned on.

In WSL keep key files in the Linux home directory, not under `/mnt/c`, because the client refuses a key file that other users can read.
:::

## Before You Start

You need:

- Docker and jq.
- A public IP address or DNS name of this machine.
- TCP ports `40400` and `40404` open to the internet.
- The values of [Set the Variables](#set-the-variables) from the network operator.
- A machine that meets the [system requirements](#system-requirements).

## System Requirements

One node needs this hardware.

| Resource | Minimum | Recommended |
|---|---|---|
| CPU | 4 cores | 8 cores |
| Memory | 16 GB | 32 GB |
| Disk | 500 GB SSD | 1 TB SSD |

The chain data grows with the traffic of the network, so keep it on a volume that you can extend and leave at least 30% of the volume free.

## Run the Observer

Run all steps in one bash terminal. In a new terminal, run the block of Set the Variables again. The terminal screenshot comes from a read-only node of a [private shard](/nodes/private-shard/), so the network names and block numbers in it differ from DevNet.

<Steps>

### Set the Variables

The image comes from the [image catalog](/reference/container-images/). Replace the values in angle brackets. The network operator gives all of them except `PUBLIC_HOST`.

- `PUBLIC_HOST` is the public IP address or DNS name at which other nodes reach this machine. On a home network, forward TCP `40400` and `40404` on the router to this machine.
- `NETWORK_ID`, `SHARD_NAME` and `BOOTSTRAP_URI` identify the network and its entry node.

```bash
NODE_IMAGE='public.ecr.aws/l2u2v4a8/asi-chain/node-rust@sha256:a0e619e48a88418d0d5caf12123a97d9c6a096dbfc45db60616f0276f700fb5f'
NETWORK_ID='<network ID>'
SHARD_NAME='<shard name>'
PUBLIC_HOST='<public IP or DNS name of this machine>'
BOOTSTRAP_URI='rnode://<node ID>@<bootstrap host>?protocol=40400&discovery=40404'
```

### Start the Observer

This block creates the data volume, gives the node access to it and starts the node. The token flags repeat the token settings of the shard. If the other nodes of the shard reach this machine at a private address, add `--allow-private-addresses` to the `run` command. If the shard runs in Docker on this machine, use the read-only node of [Set Up a Private Shard](/nodes/private-shard/) instead.

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

Ask the node for its state and repeat until it is synchronized. `/api/ready` answers `{"ready":true} HTTP 200`, and `/api/status` of a synchronized observer shows:

- `"isReadOnly": true` and `"isReady": true`
- a `"peers"` value above 0 (if it stays at 0, see [No Peer Connection](/help/troubleshooting/#no-peer-connection))
- a `"lastFinalizedBlockNumber"` that grows from one run to the next

```bash
curl -s -w ' HTTP %{http_code}\n' http://127.0.0.1:40403/api/ready
curl -s http://127.0.0.1:40403/api/status \
  | jq '{isReadOnly, isReady, peers, lastFinalizedBlockNumber}'
```

![Terminal output of the two checks. The ready route answers HTTP 200, and jq prints isReadOnly true, isReady true, the number of peers and the last finalized block.](/images/nodes/observer-check.webp){.console width=680 height=255}

### Manage the Node

The first command shows the log, and the second restarts the node.

```bash
docker logs --tail 100 observer
docker restart observer
```

1. To move to a new image, set `NODE_IMAGE` to the new digest from the network operator.
2. Remove the container with `docker rm -f observer`.
3. Run the `docker run -d` command of [Start the Observer](#start-the-observer) again. Keep the volume `observer-data`. It holds the node identity.

</Steps>

## Who Reads the Observer

The HTTP port `40403` listens only on this machine. Programs on other machines need a [gateway](/reference/glossary/#gateway) in front of it that passes only the paths they need. Applications read the node HTTP API or the Hasura GraphQL of the [indexer](/reference/glossary/#indexer), and the [explorer](/explorer/usage/) reads Hasura only. The observer rejects [deploys](/reference/glossary/#deploy) with `Deploy was rejected because node is running in read-only mode` and runs [exploratory deploys](/reference/glossary/#exploratory-deploy).

## Next Steps

<CardGrid columns="2">
<DocCard title="Node Image" href="/nodes/image/">Image selection, ports and configuration flags</DocCard>
<DocCard title="Run a Validator" href="/nodes/validator/">Create the key, start the node, fund it and submit the bond</DocCard>
<DocCard title="Troubleshooting" href="/help/troubleshooting/">What to check when peers stay at 0</DocCard>
</CardGrid>
