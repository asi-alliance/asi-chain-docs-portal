# Validator node image

The image contains the maintained **Rust** implementation of CBC Casper, Rholang and RSpace++. Its source is [asi-alliance/asi-chain-rust-node](https://github.com/asi-alliance/asi-chain-rust-node/tree/e18defd44d43fe460379efefb88223797709a0cf).

## Select the image

The new ASI dev artifact is:

```text
public.ecr.aws/l2u2v4a8/asi-chain/node-rust:0.4.46-dev.20261104-e18defd44d43
public.ecr.aws/l2u2v4a8/asi-chain/node-rust@sha256:e06a0a4ca43d9e60309c514a19f4c664d27eb216796b9b52d1bc67c10947694e
```

See [container images](/general/container-images/) for the historical `e6ecf238` baseline, separately published `5dafbc37` client-compatibility target and application versions. Choose the node revision together with its client/API contract; a newer tag does not select an upgrade for a running shard.

```bash
NODE_IMAGE=public.ecr.aws/l2u2v4a8/asi-chain/node-rust@sha256:e06a0a4ca43d9e60309c514a19f4c664d27eb216796b9b52d1bc67c10947694e
docker pull --platform linux/amd64 "$NODE_IMAGE"
docker image inspect "$NODE_IMAGE" --format '{{json .Config.Labels}}'
docker run --rm --platform linux/amd64 --network none "$NODE_IMAGE" --version
docker run --rm --platform linux/amd64 --network none "$NODE_IMAGE" run --help
```

These commands inspect the image without starting a network. This new artifact has passed packaging/publication checks; it has not inherited the older image's client tests. The [catalog](/general/container-images/#select-compatible-artifacts) records exact-source CI separately from packaging checks. This source does not contain the known-peers change in PR #927.

## Runtime and configuration

The pinned [Dockerfile](https://github.com/asi-alliance/asi-chain-rust-node/blob/e18defd44d43fe460379efefb88223797709a0cf/node/Dockerfile) and [entrypoint](https://github.com/asi-alliance/asi-chain-rust-node/blob/e18defd44d43fe460379efefb88223797709a0cf/node/docker-entrypoint-rust.sh) define:

| Item | Value |
|---|---|
| Binary | `/opt/docker/bin/node` |
| Entrypoint | `/opt/docker/bin/docker-entrypoint.sh`; adds `--profile=docker` |
| Default command | `run` |
| Runtime user | `daemon` |
| Docker data directory | `/var/lib/rnode/` |
| Configuration | Built-in HOCON defaults, plus the selected override file |

Use [defaults.conf at the same revision](https://github.com/asi-alliance/asi-chain-rust-node/blob/e18defd44d43fe460379efefb88223797709a0cf/node/src/main/resources/defaults.conf). Pass `run --config-file /path/to/node.conf` to make the mounted override explicit. Upstream [shard overrides](https://github.com/asi-alliance/asi-chain-rust-node/blob/e18defd44d43fe460379efefb88223797709a0cf/docker/conf/default.conf) illustrate the structure; development keys and genesis files are not inputs for joining another network.

## Default container ports

| TCP port | Service | Exposure |
|---|---|---|
| 40400 | P2P protocol | Reachable by intended peers |
| 40401 | External gRPC | Approved client network or gateway |
| 40402 | Internal gRPC, including propose | Private operator access |
| 40403 | HTTP API; also `/metrics` | Route approved API paths; keep metrics private |
| 40404 | Peer discovery | Reachable by intended peers |
| 40405 | Admin HTTP | Private operator access |

Host mappings are independent of container defaults. Binding `40403` publicly exposes all enabled routes on that listener unless a gateway filters them. Do not open the entire `40400:40405` range or copy all development mappings to a public host.

## Before starting a validator

Obtain the target shard's bootstrap peer, shard/genesis settings, native-token metadata, approved digest and admission/bonding process. Prepare persistent storage writable by the image user and private TLS/signing inputs. A running container or configured validator key does not establish active bonded stake, synchronization or finalization.

Follow [join as validator](/quick-start/join-validator/) for checks. Legacy configurator/connector recipes and JVM options do not configure this Rust image.
