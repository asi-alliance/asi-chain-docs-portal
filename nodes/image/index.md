# Node Image

The image contains the maintained Rust implementation of CBC Casper, Rholang and RSpace++. The public DevNet runs a Scala node, which this image does not connect to, so run it in your own [private shard](/nodes/private-shard/) or in a network whose operator runs the Rust node.

## Select the Image

The instructions on this site use the build from [github.com/asi-alliance/asi-chain-rust-node](https://github.com/asi-alliance/asi-chain-rust-node/tree/8e6517d630e22c24004b7feb2d9685a44d7384d5) at commit `8e6517d`. Two newer builds exist, described in [Newer Builds](#newer-builds). Build `0ccc315` uses uint256 amounts and does not work with the published client 0.2.9, the Wallet CLI or Wallet SDK 2.1.0, so the guides stay on `8e6517d`.

The `8e6517d` and `e18defd` builds were checked on 5 November 2026 with `docker buildx imagetools inspect`. Pin the digest, not the tag. Tags in the registry can be removed, and the floating `dev` tag moves with every build, so do not use it.

The `8e6517d` build has the tag `0.4.46-dev.20261105-8e6517d630e2` and this manifest digest:

```text
sha256:983fa20895078bc74ad6c447dc505b5f539b54e9e2f092708f08290e09d6ea55
```

The previous build has the tag `0.4.46-dev.20261104-e18defd44d43` and this manifest digest:

```text
sha256:e06a0a4ca43d9e60309c514a19f4c664d27eb216796b9b52d1bc67c10947694e
```

Both are published under `public.ecr.aws/l2u2v4a8/asi-chain/node-rust`. The `8e6517d` build is 12 commits after the previous one. The Dockerfile, the entrypoint, `defaults.conf` and the example shard configuration are identical in both, so everything below applies to either. The [catalog](/reference/container-images/) lists the other published node builds and the application images. Choose the node revision together with its client and API contract. A newer tag does not upgrade a running shard.

```bash
NODE_IMAGE=public.ecr.aws/l2u2v4a8/asi-chain/node-rust@sha256:983fa20895078bc74ad6c447dc505b5f539b54e9e2f092708f08290e09d6ea55
docker pull --platform linux/amd64 "$NODE_IMAGE"
docker image inspect "$NODE_IMAGE" --format '{{json .Config.Labels}}'
docker run --rm --platform linux/amd64 --network none "$NODE_IMAGE" --version
docker run --rm --platform linux/amd64 --network none "$NODE_IMAGE" run --help
```

These commands inspect the image without starting a network. The `org.opencontainers.image.revision` label holds the source commit. The image is published for `linux/amd64` only, so keep `--platform` on Apple silicon and other ARM hosts.

## Newer Builds

Two builds were published after `8e6517d`. Their manifests and labels were read from the registry on 10 November 2026, and the source differences come from the repository history. The images were not started.

### Build 2cce114

The tag is `0.4.46-dev.20261106-2cce114a52ac`, built from commit `2cce114` of 6 November in [github.com/asi-alliance/asi-chain-rust-node](https://github.com/asi-alliance/asi-chain-rust-node/tree/2cce114a52ac1e1a85bbd03e0120de848df80d6d). The manifest digest is:

```text
sha256:185d1db5853a5fa454fb6575238cd2bdcb948cdd772241345d4fb22414adc235
```

Compared with `8e6517d`, the Dockerfile, the entrypoint, `defaults.conf` and the example shard configuration are unchanged, so the sections below apply to it. The API reports values of lambda, application and Pi expressions as `ExprUnknown` (upstream PR #942), and other responses keep their format. Blocks now hash their justifications and the node checks that hash on receipt (upstream PR #790). It is not known whether this build can share a shard with `8e6517d`, so run one build per shard. The other merges are internal changes with no trace in the API, the ports or the configuration. This build has no uint256 changes.

### Build 0ccc315 With uint256

The tag is `0.4.46-dev.20261109-0ccc315d84b3`, built from commit `0ccc315` of 8 November in [github.com/asi-alliance/asi-chain-rust-node](https://github.com/asi-alliance/asi-chain-rust-node/tree/0ccc315d84b32d668e8db49cd56ba3c576693e15). On 10 November 2026 the floating `dev` tag points to this image. The manifest digest is:

```text
sha256:d91e1325ca7b3aa539b6d6009b5351ce9033bce4d10c7ac58f68dbc0172b6c1b
```

This is the first published build with uint256 amounts, merged in `43d69b7` as upstream PR #881. Amounts range from 0 to `2^256 - 1`. See [Token Amounts](/reference/token-amounts/) for the amount format. This build changes the following for an operator:

- The API returns amounts as decimal strings: `balance`, `stake`, `totalStake`, `minPhloPrice`, `phloPrice`, `transfers[].amount`, and `ExprInt.data` and `ExprUint64.data` at any depth. In `2cce114` and `8e6517d` only `balance` is a string. The other amounts are int64 JSON numbers, and `ExprUint64.data` is a uint64 number. A client that parses these fields as numbers fails.
- In `defaults.conf`, `bond-minimum`, `bond-maximum` and `min-phlo-price` are decimal strings. The defaults are `"1"` for `bond-minimum`, `2^256 - 1` for `bond-maximum` and `"1"` for `min-phlo-price`. The command-line options accept only canonical decimal digits and reject negative values, leading zeros and values above `2^256 - 1`. `native-token-name`, `native-token-symbol` and `native-token-decimals` stay `F1R3CAP`, `F1R3` and 8, and `network-id` stays `testnet`.
- The block hash scheme is version 3, and the protobuf fields changed. The node moves deploy records of earlier formats aside (quarantines them) instead of migrating them, and the upstream change describes no migration. Do not mix this build with nodes of a build that predates uint256 in one shard.
- Propose refusals have typed errors (upstream PR #924). HTTP 409 now includes `validator_not_bonded`, `not_enough_new_blocks` and `too_far_ahead_of_finalized`. HTTP 503 now also includes `history_incomplete` and `missing_block`, next to `observer_busy` and `block_not_held`.
- The build includes the known-peers change from upstream PR #927 ([github.com/F1R3FLY-io/f1r3node-rust/pull/927](https://github.com/F1R3FLY-io/f1r3node-rust/pull/927)). See the warning below.
- The Dockerfile, the entrypoint, the example shard configuration and the ports are the same as in `8e6517d`.

The published ASI client 0.2.9 and the Wallet CLI sign `phloPrice` as `int64` in field 7, and Wallet SDK 2.1.0 does the same. This build reserves field 7 and expects 32 bytes in field 15, so deploys from these tools do not work against it. No published client, Wallet CLI or Wallet SDK version signs the new format yet.

## Runtime and Configuration

The pinned [Dockerfile](https://github.com/asi-alliance/asi-chain-rust-node/blob/8e6517d630e22c24004b7feb2d9685a44d7384d5/node/Dockerfile) and [entrypoint](https://github.com/asi-alliance/asi-chain-rust-node/blob/8e6517d630e22c24004b7feb2d9685a44d7384d5/node/docker-entrypoint-rust.sh) define:

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

Read the [defaults.conf at the same revision](https://github.com/asi-alliance/asi-chain-rust-node/blob/8e6517d630e22c24004b7feb2d9685a44d7384d5/node/src/main/resources/defaults.conf). The node reads `/var/lib/rnode/f1r3fly.conf` when it exists, and falls back to the older name `rnode.conf` with a warning. `run --config-file /path/to/node.conf` selects a file explicitly and takes priority over both. The upstream [shard overrides](https://github.com/asi-alliance/asi-chain-rust-node/blob/8e6517d630e22c24004b7feb2d9685a44d7384d5/docker/conf/default.conf) show the structure. Development keys and genesis files from that directory are not inputs for joining another network.

## Network Settings

- `--network-id` sets the network ID, `testnet` by default. Both ends must match, because a node drops messages from peers with another ID.
- `--host` sets the public address that other nodes use to reach this one. By default the node guesses it from the public IP. If the address is wrong, the node connects out but receives nothing, and `peers` stays at 0.
- `--bootstrap` names the bootstrap peer as `rnode://<node-id>@<host>?protocol=40400&discovery=40404` and has no default. The node ID is the `address` field of the peer's `GET /api/status`.
- `--shard-name` sets the shard name, `root` by default.
- `--native-token-name`, `--native-token-symbol` and `--native-token-decimals` set the native token, `F1R3CAP`, `F1R3` and 8 by default. They are fixed at genesis, and the upstream defaults are not the ASI token values.

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

The image declares `EXPOSE` only for `40400` to `40404`. The node still listens on `40405` inside the container, so `docker run -P` does not publish it, while an explicit `-p 40405:40405` does.

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
After a restart the node reconnects only through `--bootstrap`. The source revision of the `8e6517d` build does not contain the [known-peers change in PR #927](https://github.com/F1R3FLY-io/f1r3node-rust/pull/927). The `0ccc315` build does, and it keeps connected peers in `known-peers` in the data directory and adds them to the routing table when it starts without connections. If the bootstrap is unreachable, the `8e6517d` build waits at `Waiting for first connection...`.
:::

## Becoming a Validator

Obtain the target shard's bootstrap peer, shard and genesis settings, native-token metadata, approved digest and admission process. Prepare persistent storage owned by `daemon` and private TLS and signing inputs. A running container or a configured validator key does not by itself give the node active bonded stake, synchronization or finalization.

Follow [Run a Validator](/nodes/validator/) for the checks. Legacy configurator and connector recipes and JVM options do not configure this Rust image.

## Next Steps

<CardGrid columns="2">
<DocCard title="Run a Validator" href="/nodes/validator/">Checks before a node joins as a validator</DocCard>
<DocCard title="Set Up a Private Shard" href="/nodes/private-shard/">Run a node with your own genesis</DocCard>
<DocCard title="Container Images" href="/reference/container-images/">Other published node builds and the application images</DocCard>
</CardGrid>
