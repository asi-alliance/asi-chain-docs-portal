# Join as a Validator

This page prepares a Rust node that is meant to become a validator. Preparation comes first. Key generation, funding and the bond transaction follow on [Prepare and Enroll a Rust Validator](/quick-start/validator-enrollment/). The former `asi-chain/chain/validator` configurator and connector workflow is retired from this guide.

::: warning DevNet runs the Scala node
As of 5 November 2026 the public DevNet runs a Scala node (Validator 1 reports `RChain Node 1.0.0-SNAPSHOT`), and the Rust image described here does not connect to it. A Rust node started with the DevNet bootstrap and `--network-id devnet1` listed eight nodes in `/api/status` but opened no connection to them. Use this guide for a Rust shard that you or your operator run.
:::

## 1. Obtain Network Inputs

Ask the operator for the bootstrap URI, the shard and genesis configuration, the native-token metadata, the admission and bonding process and the node image that the shard accepts. A matching version number or a downloaded image does not show that your node is compatible with a running network.

- The bootstrap URI looks like `rnode://<node-id>@<host>?protocol=40400&discovery=40404`. The node ID is the `address` field of `GET /api/status` on the bootstrap node.
- The `--network-id` value must equal the `networkId` that the bootstrap node reports. The default is `testnet`, and a node ignores messages from any other network.
- The `--host` value is the address other nodes use to reach yours. If you leave it out, the node tries to guess its public address, which fails behind NAT and on container networks.

Check storage, CPU, memory and retention requirements with the operator. No sizing has been measured for these images.

## 2. Inspect the Published Image

Follow [Validator Node Image](/shard-nodes/validator-image/) to pull the image, read its labels and run `run --help`. The [catalog](/general/container-images/) lists the builds, all for `linux/amd64`. Confirm which exact revision the target shard accepts.

## 3. Prepare Storage, Configuration and Keys

A new Docker volume is owned by `root`, but the image runs as `daemon` (uid 1). Change the owner before the first start, otherwise the node exits with `The data dir must be a directory and have read and write permissions`.

```bash
NODE_IMAGE=<image from the catalog>
docker volume create validator-data
docker run --rm -u root --platform linux/amd64 --entrypoint chown \
  -v validator-data:/var/lib/rnode "$NODE_IMAGE" daemon:daemon /var/lib/rnode
```

The node keeps its state, its TLS certificate and its identity in `/var/lib/rnode/`. Options are applied in this order: command line, configuration file, built-in defaults ([defaults.conf at the pinned revision](https://github.com/asi-alliance/asi-chain-rust-node/blob/e18defd44d43fe460379efefb88223797709a0cf/node/src/main/resources/defaults.conf)).

- The node reads `/var/lib/rnode/f1r3fly.conf` without any flag. It also accepts the older name `rnode.conf` and logs a warning. `run --config-file <path>` points to another file.
- Do not pass `--profile`. The image entrypoint adds `--profile=docker`, and the node rejects the option twice.
- Match the shard and native-token settings to the target genesis. The defaults are `shard-name = root`, token `F1R3CAP` with symbol `F1R3` and 8 decimals, and they cannot change after genesis.
- Joining an existing shard does not use `--genesis-validator`, and a development `bonds.txt` is not an enrollment procedure. Genesis participation, joining and bonding are separate steps.

The validator key reaches the node in one of two ways, and both go with `--validator-public-key`.

- `--validator-private-key-path` takes an encrypted PEM file made by the node's own `keygen` command. The node asks for the password at start, or reads it from the `F1R3NODE_VALIDATOR_PASSWORD` environment variable. Without a terminal and without that variable the node exits with `No such device or address`. The plain hex file saved by the ASI client is not accepted and fails with `malformedframing`.
- `--validator-private-key` takes the hex key itself. The option is hidden from `run --help`, and the key then shows in `docker inspect` and in the process list, so use it only on a host that nobody else can read.

Never publish a key or a TLS file in logs, examples or Git.

## 4. Review Networking

Peers must reach TCP `40400` and `40404`. Configure client access separately, and keep internal gRPC `40402`, admin HTTP `40405` and `/metrics` private. See the [port table](/shard-nodes/validator-image/#default-container-ports). The `api-server.host` setting applies to every API listener, so enforce boundaries with host port bindings, firewall rules and gateway routes.

## 5. Validate the Node

After you start the node, check these in order.

```bash
curl -s -w ' HTTP %{http_code}\n' http://127.0.0.1:40403/api/ready
curl -s http://127.0.0.1:40403/api/status
```

The node is synchronized when `/api/status` shows `isReady: true`, a positive `peers` count and a growing `lastFinalizedBlockNumber`. The `isValidator` field only says that a validator key is configured. It does not say that the node is bonded. The following endpoints on the HTTP port show the bond itself.

- `GET /api/bond-status/{public key}` returns `{"publicKey": "...", "isBonded": true}` once the bond is active.
- `GET /api/validators` lists the bonded validators and their stakes.
- `GET /api/epoch` shows the epoch length and `blocksUntilNextEpoch`.

A bond and a withdrawal take effect only at an epoch boundary. Between boundaries a new bond is recorded but not active. Confirm the actual validator set before you count the node as a consensus participant.

Do not run live transfers as an installation test. See [Troubleshooting](/quick-start/troubleshooting/) if the node does not start or does not find peers.
