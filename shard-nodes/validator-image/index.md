# Validator node image

The image contains the maintained **Rust** implementation of CBC Casper, Rholang and RSpace++. Its source is [F1R3FLY-io/f1r3node-rust](https://github.com/F1R3FLY-io/f1r3node-rust/tree/e6ecf23814a306e4ad9850ea44fc753f40966db8).

## Select the image

The published baseline is:

```text
public.ecr.aws/l2u2v4a8/asi-chain/node-rust:0.4.46-dev.20261102-e6ecf23814a3
public.ecr.aws/l2u2v4a8/asi-chain/node-rust@sha256:3c93b745dc3edbb1aa1ca8e2a3fec030cc96e016a29044b575ab549da44abab0
```

See [container images](/general/container-images/) for the separately published `5dafbc37` compatibility image and application versions. Choose the node revision together with its client/API contract; a newer tag does not select an upgrade for a running shard.

```bash
NODE_IMAGE=public.ecr.aws/l2u2v4a8/asi-chain/node-rust@sha256:3c93b745dc3edbb1aa1ca8e2a3fec030cc96e016a29044b575ab549da44abab0
docker pull --platform linux/amd64 "$NODE_IMAGE"
docker image inspect "$NODE_IMAGE" --format '{{json .Config.Labels}}'
docker run --rm --platform linux/amd64 --network none "$NODE_IMAGE" --version
docker run --rm --platform linux/amd64 --network none "$NODE_IMAGE" run --help
```

These commands inspect the existing image without starting a network.

## Runtime and configuration

The pinned [Dockerfile](https://github.com/F1R3FLY-io/f1r3node-rust/blob/e6ecf23814a306e4ad9850ea44fc753f40966db8/node/Dockerfile) and [entrypoint](https://github.com/F1R3FLY-io/f1r3node-rust/blob/e6ecf23814a306e4ad9850ea44fc753f40966db8/node/docker-entrypoint-rust.sh) define:

| Item | Value |
|---|---|
| Binary | `/opt/docker/bin/node` |
| Entrypoint | `/opt/docker/bin/docker-entrypoint.sh`; adds `--profile=docker` |
| Default command | `run` |
| Runtime user | `daemon` |
| Docker data directory | `/var/lib/rnode/` |
| Configuration | Built-in HOCON defaults, plus the selected override file |

Use [defaults.conf at the same revision](https://github.com/F1R3FLY-io/f1r3node-rust/blob/e6ecf23814a306e4ad9850ea44fc753f40966db8/node/src/main/resources/defaults.conf). Pass `run --config-file /path/to/node.conf` to make the mounted override explicit. Upstream [shard overrides](https://github.com/F1R3FLY-io/f1r3node-rust/blob/e6ecf23814a306e4ad9850ea44fc753f40966db8/docker/conf/default.conf) illustrate the structure; development keys and genesis files are not inputs for joining another network.

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
