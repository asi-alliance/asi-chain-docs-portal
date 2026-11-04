# Join as a validator

Use the maintained Rust node and a revision selected for your target shard. The former `asi-chain/chain/validator` configurator and connector workflow is retired from this guide.

## 1. Obtain network inputs

Request the operator's current bootstrap URI, shard/genesis configuration, native-token metadata, admission/bonding process and approved node digest. Historical IPs, a matching version number or a downloaded image do not establish compatibility with a running network.

Confirm storage, CPU, memory and retention requirements for the deployment. Earlier fixed resource estimates are not verified sizing guidance for these Rust images.

## 2. Inspect the published image

Follow [validator node image](/shard-nodes/validator-image/) to pull by digest, inspect source labels and read `run --help`. The current [catalog](/general/container-images/) lists `linux/amd64` images.

The catalog distinguishes the new ASI dev `72c9126` artifact, the historical `e6ecf238` baseline and the `5dafbc37` node used in client compatibility tests. Confirm which exact revision the target network accepts.

## 3. Prepare configuration and private inputs

Use [HOCON defaults pinned to the ASI dev build](https://github.com/asi-alliance/asi-chain-rust-node/blob/72c9126ca17b26c4b5c33b093422020cabe91f45/node/src/main/resources/defaults.conf), or the corresponding file at your selected revision. Mount the reviewed override and pass its path explicitly with `run --config-file`.

- Persist state under the Docker data directory, `/var/lib/rnode/`.
- Make mounted storage writable by the `daemon` runtime user.
- Supply signing and TLS inputs privately; never publish them in logs, examples or Git.
- Match shard/native-token settings to the target genesis. Upstream defaults do not establish ASI metadata for an existing shard.
- Separate initial genesis participation from joining and bonding on an existing chain. Copying development `bonds.txt` or adding `--genesis-validator` is not a general enrollment procedure.

## 4. Review networking

Permit intended peers to reach TCP `40400` and `40404`. Configure client access separately. Keep internal gRPC `40402`, admin HTTP `40405` and `/metrics` private. See the [port table](/shard-nodes/validator-image/#default-container-ports).

Confirm host mappings instead of assuming every endpoint uses container defaults. The `api-server.host` setting applies to multiple listeners; use host bindings, firewall rules and gateway route controls to enforce boundaries.

## 5. Validate the deployed role

After starting the operator-reviewed manifest, inspect logs and readiness through the management endpoint. Confirm peer connectivity, synchronization and canonical finalization. Confirm active bonded stake and the actual validator set separately before counting this node as a consensus participant.

Do not run live transfers as an installation smoke test. Use [wallet CLI](/cli/usage/) with endpoints and token metadata appropriate to the selected node/client pair.

See [troubleshooting](/quick-start/troubleshooting/) for diagnosis. A complete enrollment manifest depends on the target network's current operator-provided inputs.
