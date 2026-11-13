# Node Image

The image contains the maintained Rust implementation of CBC Casper, Rholang and RSpace++. Run it in your own [private shard](/nodes/private-shard/) or in a network whose operator runs the Rust node.

## Select the Image

The instructions on this site use the build of the `dev` branch of [github.com/asi-alliance/asi-chain-rust-node](https://github.com/asi-alliance/asi-chain-rust-node/tree/dev).

Pin the digest, not the tag. Tags in the registry can be removed, and the floating `dev` tag moves with every build, so do not use it.

The build has the tag `0.4.46-dev.20261113-d57a3f450151` and this manifest digest:

```text
sha256:f46bc3542ae9cab873f3a6e4f40651546bfeba47fb3d1d65966564b18d3123b6
```

It is published under `public.ecr.aws/l2u2v4a8/asi-chain/node-rust`. The [catalog](/reference/container-images/) lists the images of the other components. A tag does not upgrade a running shard.

```bash
NODE_IMAGE=public.ecr.aws/l2u2v4a8/asi-chain/node-rust@sha256:f46bc3542ae9cab873f3a6e4f40651546bfeba47fb3d1d65966564b18d3123b6
docker pull --platform linux/amd64 "$NODE_IMAGE"
docker image inspect "$NODE_IMAGE" --format '{{json .Config.Labels}}'
docker run --rm --platform linux/amd64 --network none "$NODE_IMAGE" --version
docker run --rm --platform linux/amd64 --network none "$NODE_IMAGE" run --help
```

These commands inspect the image without starting a network. The `org.opencontainers.image.revision` label holds the source commit. The image is published for `linux/amd64` only, so keep `--platform` on Apple silicon and other ARM hosts.

## Runtime and Configuration

The [Dockerfile](https://github.com/asi-alliance/asi-chain-rust-node/blob/dev/node/Dockerfile) and [entrypoint](https://github.com/asi-alliance/asi-chain-rust-node/blob/dev/node/docker-entrypoint-rust.sh) define:

| Item | Value |
|---|---|
| Binary | `/opt/docker/bin/node` |
| Entrypoint | `/opt/docker/bin/docker-entrypoint.sh`, which adds `--profile=docker` |
| Default command | `run` |
| Runtime user | `daemon` (uid 1) |
| Docker data directory | `/var/lib/rnode/` |
| Healthcheck | `curl -fsS 127.0.0.1:40403/api/ready`, every 30 s, the first 120 s are a grace period |
| Configuration | Built-in HOCON defaults, then the override file, then command-line flags |

The entrypoint always adds `--profile=docker`, so do not pass `--profile` yourself. This matters when you copy flags from a command written for another node. A second `--profile` after `run` fails with the first error below, and before `run` with the second:

```text
unexpected argument '--profile' found
the argument '--profile <PROFILE>' cannot be used multiple times
```

Read the [defaults.conf](https://github.com/asi-alliance/asi-chain-rust-node/blob/dev/node/src/main/resources/defaults.conf). The node reads `/var/lib/rnode/f1r3fly.conf` when it exists. `run --config-file /path/to/node.conf` selects a file explicitly and takes priority. The upstream [shard overrides](https://github.com/asi-alliance/asi-chain-rust-node/blob/dev/docker/conf/default.conf) show the structure. Development keys and genesis files from that directory are not inputs for joining another network.

## Network Settings

- `--network-id` sets the network ID, `testnet` by default. Both ends must match, because a node that joins with another ID exits with a `Wrong network id` error.
- `--host` sets the public address that other nodes use to reach this one. By default the node guesses it from the public IP. If the address is wrong, the node connects out but receives nothing, and `peers` stays at 0.
- `--bootstrap` names the bootstrap peer as `rnode://<node-id>@<host>?protocol=40400&discovery=40404` and has no default. The node ID is the `address` field of the peer's `GET /api/status`.
- `--shard-name` sets the shard name, `root` by default.
- `--native-token-name`, `--native-token-symbol` and `--native-token-decimals` set the native token. They are fixed at genesis. For ASI pass `--native-token-name ASI --native-token-symbol ASI --native-token-decimals 18` on every node of the shard, and a node with other values stops.

Add `--allow-private-addresses` when peers use container or private addresses, and `--no-upnp` when you forward ports by hand.

## Default Container Ports

| TCP port | Service | Exposure |
|---|---|---|
| 40400 | P2P protocol | Reachable by intended peers |
| 40401 | External gRPC | Approved client network or gateway |
| 40402 | Internal gRPC, including propose | Private operator access |
| 40403 | HTTP API; also `/metrics` | Route approved API paths; keep metrics private |
| 40404 | Peer discovery | Reachable by intended peers |
| 40405 | Admin HTTP | Private operator access |

The image declares `EXPOSE` only for `40400` to `40404`. The node also listens on `40405` inside the container. `docker run -P` does not publish that port, while an explicit `-p 40405:40405` does.

Host mappings are independent of container defaults. Binding `40403` publicly exposes all enabled routes on that listener unless a gateway filters them. Do not open the entire `40400:40405` range or copy all development mappings to a public host.

## Run a Node

<Steps>

### Start the Node

A new Docker volume is owned by `root`, but the node runs as `daemon`. Without the `chown` below the container exits with code 1 and `The data dir must be a directory and have read and write permissions: /var/lib/rnode`.

```bash
docker volume create node-data
docker run --rm --platform linux/amd64 -u root --entrypoint sh \
  -v node-data:/var/lib/rnode "$NODE_IMAGE" -c 'chown daemon:daemon /var/lib/rnode'

docker run -d --name my-node --platform linux/amd64 \
  -v node-data:/var/lib/rnode \
  -p 40400:40400 -p 40403:40403 -p 40404:40404 \
  "$NODE_IMAGE" run \
  --network-id <network-id> \
  --shard-name <shard-name> \
  --host <public-address> \
  --bootstrap '<bootstrap-uri>'
```

Replace `my-node` with your own container name in every later command.

### Check the Node

```bash
docker inspect my-node --format '{{.State.Health.Status}}'
curl -s http://localhost:40403/api/ready
curl -s http://localhost:40403/api/status
```

`/api/ready` answers `{"ready":true}` with HTTP 200 once the node is ready and HTTP 503 with `{"ready":false}` before that. In `/api/status`, check `networkId`, `peers`, `isReady` and `lastFinalizedBlockNumber`. If `peers` stays at 0, check `--host` in [Network Settings](#network-settings) and see [Troubleshooting](/help/troubleshooting/#no-peer-connection). The image healthcheck always probes port `40403` inside the container. If you change the HTTP port with `--api-port-http`, the container reports `unhealthy` while the node works.

</Steps>

For a network of your own, add `--standalone` and a genesis directory as described in [private shard](/nodes/private-shard/).

::: warning Restart Needs the Bootstrap
After a restart the node reconnects only through `--bootstrap`. If the bootstrap is unreachable, the node waits at `Waiting for first connection...`.
:::

## Becoming a Validator

[Run a Validator](/nodes/validator/) describes how to run this image as a validator.

## Next Steps

<CardGrid columns="2">
<DocCard title="Run a Validator" href="/nodes/validator/">Checks before a node joins as a validator</DocCard>
<DocCard title="Set Up a Private Shard" href="/nodes/private-shard/">Run a node with your own genesis</DocCard>
<DocCard title="Container Images" href="/reference/container-images/">Tags and digests of the published images</DocCard>
</CardGrid>
