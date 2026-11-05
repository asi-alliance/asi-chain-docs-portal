# Troubleshooting

Start by checking the image tag or digest, the source revision, the configuration and the host port mappings. The node runtime is Rust, so JVM tuning and the older configurator and connector commands do not apply. Node commands on this page use the container name from the `docker run --name` option of [Run an Observer](/nodes/observer/) or [Run a Validator](/nodes/validator/):

```bash
NODE=observer
```

::: warning DevNet runs the Scala node
As of 5 November 2026 the public DevNet runs a Scala node, and the Rust image does not connect to it. A Rust node started with the DevNet bootstrap lists other nodes in `/api/status` but keeps `peers` at 0. This was observed on two separate hosts with the settings from these guides. See [Run an Observer](/nodes/observer/).
:::

## Image Pull or Startup Fails

Use a tag or digest from [Container Images](/reference/container-images/) and pass `--platform linux/amd64`, because the images exist for that platform only. Check Docker connectivity and disk capacity. Do not silently substitute another build for a missing ARM image.

Inspect your own container:

```bash
docker inspect "$NODE" --format '{{.Config.Image}}'
docker port "$NODE"
docker logs --tail 100 "$NODE"
```

The first lines of the log usually name the cause.

- `The data dir must be a directory and have read and write permissions` means the volume belongs to `root`. Change its owner to `daemon` (uid 1) with the `chown` command from [Run an Observer](/nodes/observer/#start-the-observer).
- `unexpected argument '--profile' found` means a `--profile` option was passed after `run`, and `the argument '--profile <PROFILE>' cannot be used multiple times` means one was passed before `run`. The image entrypoint already adds `--profile=docker`, so remove yours.
- `Failed to parse bootstrap peer address: Parse error: missing node ID` means the bootstrap URI lacks the node ID. The form is `rnode://<node-id>@<host>?protocol=40400&discovery=40404`.
- `No such device or address` with `--validator-private-key-path` means the node asked for the key password and found no terminal. Set the `F1R3NODE_VALIDATOR_PASSWORD` environment variable.
- `Could not decrypt PEM file` means that the password does not match the key file.
- `malformedframing` with the same option means the file is not an encrypted PEM key. The hex file written by the ASI client is not accepted there.

Keep keys and TLS private material out of shared diagnostics.

## No Peer Connection

Read the peer count and the node's own view of the network:

```bash
curl -s http://127.0.0.1:40403/api/status
```

A node that has not connected yet reports `"peers": 0` and `"isReady": false`, and the log repeats `Waiting for first connection...`. Check these in order.

1. The bootstrap URI is complete and the node ID in it belongs to the bootstrap node. The ID is the `address` field of `/api/status` on that node.
2. `--network-id` equals the `networkId` that the bootstrap node reports. The default is `testnet`, and a node ignores messages from other networks.
3. `--shard-name` equals the `shardId` that the bootstrap node reports. The default is `root`. With another name the node reports `"peers": 1` but stays at `Waiting for first connection...`.
4. `--host` is an address that the other nodes can reach. A joining node must be reachable as well as able to connect out, because the bootstrap node answers the handshake on the advertised address. Add `--allow-private-addresses` if the shard uses private or container addresses, and `--no-upnp` if you forward the ports by hand.
5. TCP `40400` and TCP `40404` are open for peers. Discovery on `40404` uses TCP. Do not open the API and admin ports to fix P2P connectivity.

A restarted node reconnects only through its configured bootstrap node, because the image does not include the known-peers change from upstream PR #927. If the bootstrap node is down, the log stays on `Waiting for first connection...`.

TCP connectivity alone does not establish the correct shard, synchronization or finalization.

## API Unavailable

Compare the endpoint with the host port mapping and the gateway base path. HTTP may use a different host port from the container default `40403`.

```bash
curl -s -w ' HTTP %{http_code}\n' http://127.0.0.1:40403/api/ready
docker inspect "$NODE" --format '{{.State.Health.Status}}'
```

The route returns `{"ready":true}` with HTTP 200 when the node is up, and `{"ready":false}` with HTTP 503 while it starts or has no peers. A `503` is not a transport failure, and a refused or timed-out connection is. Public gateways may omit this route.

The image healthcheck calls `/api/ready` on container port `40403` every 30 seconds, with a 120-second start period. A joining node reports `unhealthy` until it has a peer and reaches the Running state. It also reports `unhealthy` after you move the HTTP port with `--api-port-http`, even if the node works. Keep internal gRPC `40402`, admin HTTP `40405` and `/metrics` private. Do not disable TLS or expose privileged listeners as a diagnostic shortcut.

## CLI or Indexer Response Mismatch

Check which source revision the CLI or indexer was built from, and for the CLI also which client commit its `rust-client` submodule points to. An image does not include changes merged after it was built. The [catalog](/reference/container-images/) identifies client and CLI artifacts, and [CLI configuration](/cli/usage/#configuration) uses explicit URLs.

Check the selected node's HTTP and Protobuf contract before you change a consumer. Cost-accounting APIs and newer integer and transfer representations need compatible clients and separate acceptance checks. The Rust client commands `wallet-balance`, `validator-status`, `bonds` and `active-validators` fail against the Scala DevNet node.

## Slow Sync or Restart

A joining node takes the last finalized state and the recent blocks from its peers and does not download the whole history. It is ready when the log shows `Making a transition to Running state` and `/api/status` reports `isReady: true` with a growing `lastFinalizedBlockNumber`.

Compare peer progress, readiness and canonical finalization separately.

Do not delete the data directory of a node that peers already know. The node identity is the TLS certificate in that directory, so a new directory produces a new identity and a full re-join, while peers keep the old identity in their routing tables. Back up state and private inputs before any recovery, and do not run Docker-wide prune commands as a troubleshooting step.

## Wallet Does Not Show the Balance

The wallet is at [wallet.dev.asichain.io](https://wallet.dev.asichain.io). It asks for the wallet password to unlock and again to sign a transaction.

- Open the Accounts page and use the refresh button. The wallet also polls account data every 30 seconds.
- If you expect tokens from a faucet or a transfer, look up the transaction in [explorer.dev.asichain.io](https://explorer.dev.asichain.io) before you assume that it failed.
- If the wallet cannot reach the network, open Network Settings. The built-in DevNet entry cannot be edited, and your own network is added with the Custom Network form described on [Custom Network](/wallet/custom-network/).

See [Wallet Usage](/wallet/usage/) for the screens.

## Faucet and Transactions

The faucet refuses an address only when its balance is above the limit, which is 20,000 ASI in the production web build. The page then shows `Your address is not eligible` and disables the FAUCET button. There is no waiting period between requests. An address starts with `1111`, and the faucet form accepts 50 to 54 characters.

After a request the faucet page checks the deploy every 30 seconds and stops after 15 minutes with `Polling stopped after 15 minutes.` It also stops on an error status with `Polling stopped due to error status returned by node.` The status is one of `Deploying`, `Finalized`, `DeployError` or `Unknown`, and some builds also report `Finalizing` and `FinalizationError`. Paste the deploy ID into the TX status check field on the faucet page to see the current status. Do not send a second request until you have checked the first.

A transfer can fail for several reasons.

- The sender's balance does not cover the amount and the fee. The wallet warns with `Insufficient balance to cover the estimated fee.` A deploy that runs out of funds after it was accepted fails inside its block with `Deploy payment failed: Insufficient funds`.
- The recipient address is not a valid ASI address. Addresses start with `1111`.
- The result is still pending. Keep the original deploy ID and check it in the explorer before you send again. A timeout is not proof that the payment failed.

## Reporting a Problem

Open an issue in the affected [public component repository](/reference/links/). Include the digest, the public source revision, a sanitized error and reproduction steps. Do not include keys, real environment files, credentials or internal endpoints.
