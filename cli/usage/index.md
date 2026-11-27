# Wallet CLI

The ASI wallet CLI creates wallets, queries balances, sends tokens and reads and exports deploy history from a terminal. Run it from the published image or build it from source.

## Published Image

```text
public.ecr.aws/l2u2v4a8/asi-chain/wallet-cli:0.1.0-dev.20261125-95d4b635c2b3
public.ecr.aws/l2u2v4a8/asi-chain/wallet-cli@sha256:cd7a5ed29d1f2d0c55884340e6213f02ed87d6af82032f134cd4c5309672c834
```

The CLI compiles the ASI client library into its own binary. The standalone `client` container is a different tool, so do not swap one for the other.

To show the help text without connecting to a network, pull the image and run it with `--network none`:

```bash
WALLET_IMAGE=public.ecr.aws/l2u2v4a8/asi-chain/wallet-cli@sha256:cd7a5ed29d1f2d0c55884340e6213f02ed87d6af82032f134cd4c5309672c834
docker pull --platform linux/amd64 "$WALLET_IMAGE"
docker run --rm --platform linux/amd64 --network none "$WALLET_IMAGE" --help
docker run --rm --platform linux/amd64 --network none "$WALLET_IMAGE" send --help
```

## Configuration

The CLI works with the HTTP and gRPC API of a Rust node, such as one started from the [node image](/nodes/image/) or a [private shard](/nodes/private-shard/).

Copy the [`.env.example`](https://github.com/asi-alliance/asi-chain-wallet-cli/blob/dev/.env.example) to a private `.env`. The CLI has no default node addresses, and every command, including `create`, stops at startup if these four values are missing:

- `VALIDATOR_GRPC_URL`, the gRPC endpoint of a validator, which `send` uses to submit the deploy.
- `VALIDATOR_HTTP_URL`, the HTTP endpoint of the same validator.
- `OBSERVER_HTTP_URL`, the HTTP endpoint of a read-only node. `balance` queries it, and `send` uses it to confirm finalization. A Rust validator answers balance queries with `HTTP 400 (readonly_node_required)`.
- `OUTPUT_DIR`, the directory with `wallet_info.json`.

Without them the CLI prints `Error loading configuration: VALIDATOR_HOST is not set`.

Instead of a URL you can set a host and a port:

- `VALIDATOR_HOST` with `VALIDATOR_GRPC_PORT` and `VALIDATOR_HTTP_PORT`
- `OBSERVER_HOST` with `OBSERVER_HTTP_PORT`

```env [.env]
VALIDATOR_GRPC_URL=http://<validator-host>:<grpc-port>
VALIDATOR_HTTP_URL=http://<validator-host>:<http-port>
OBSERVER_HTTP_URL=http://<read-only-node-host>:<http-port>
OUTPUT_DIR=./credentials
EXPECTED_TOKEN_SYMBOL=ASI
SHARD_ID=root
DEPLOY_MAX_WAIT_SECONDS=480
DEPLOY_CHECK_INTERVAL_SECONDS=5
NODE_CONNECT_TIMEOUT_SECONDS=10
NODE_TIMEOUT_SECONDS=30
GRAPHQL_URL=
GRAPHQL_TIMEOUT_SECONDS=30
```

The values after `OUTPUT_DIR` are the defaults.

`.env.example` ships local mappings (`127.0.0.1:40412`, `40413`, `40453`) that fit only a node started with exactly those host ports.

- `DEPLOY_MAX_WAIT_SECONDS` is how long `send` waits for finalization.
- `DEPLOY_CHECK_INTERVAL_SECONDS` is the pause between checks. It must not exceed the wait.
- The timeouts and both deploy values must be positive integers.

With a value that breaks these rules, the CLI stops at startup before it sends anything.

`send` submits through the external gRPC port of a validator (`40401` by default). Open it only to the clients that need it.

The HTTP ports are mapped separately from the gRPC port. HTTPS URLs use TLS, and `NODE_CA_CERT` points to a private CA certificate.

`GRAPHQL_URL` is needed only by `history` and `export`. The CLI opens it as a GraphQL WebSocket, so it must start with `ws://` or `wss://`, and the endpoint has to accept the `graphql-ws` protocol.

With an `https://` URL both commands end with `Failed to connect to WebSocket`. Ask the network operator for the endpoint, and do not use a URL that carries an admin secret.

`GRAPHQL_TIMEOUT_SECONDS` must be a positive number of seconds. It limits the WebSocket connection and its acknowledgement for both commands, and for `export` also the whole query until it completes.

It does not limit a `history` session after the connection is up, because `history` keeps running to show new deploys.

If the endpoint reports an error, sends an invalid response or closes early, `export` exits with an error and writes no file. Without `GRAPHQL_URL` both commands stop with `GRAPHQL_URL is required for history/export`.

### Private Shard

To try `balance` and `send` on the shard from [Set Up a Private Shard](/nodes/private-shard/), start its validator and its read-only node. Then add `--network shard-net` to the `docker run` command from [Run the Image](#run-the-image) and use the container names in `.env`:

```env [.env]
VALIDATOR_GRPC_URL=http://my-shard:40401
VALIDATOR_HTTP_URL=http://my-shard:40403
OBSERVER_HTTP_URL=http://my-shard-obs:40403
OUTPUT_DIR=./credentials
EXPECTED_TOKEN_SYMBOL=ASI
SHARD_ID=my-shard
```

`SHARD_ID` must match `--shard-name`. `balance` stops with `Wrong native token: expected <EXPECTED_TOKEN_SYMBOL>, node reports <symbol>` when the symbol that the node reports differs from `EXPECTED_TOKEN_SYMBOL`.

## Run the Image

The image reads its settings from the environment and keeps wallet files and exports in directories under `/app`. Pass the `.env` file from [Configuration](#configuration) with `--env-file` and mount the directories as volumes:

```bash
mkdir -p credentials exports
sudo chown 10001:10001 credentials exports
docker run --rm --platform linux/amd64 \
  --env-file .env \
  -v "$PWD/credentials:/app/credentials" \
  -v "$PWD/exports:/app/exports" \
  "$WALLET_IMAGE" create --save
```

The working directory of the image is `/app`, so the default `OUTPUT_DIR=./credentials` puts the wallet file into `credentials/wallet_info.json` on the host.

Replace `create --save` with another command to run it. Keep the same two volumes so the commands find the wallet file and write exports to `exports/`:

- `balance`
- `send`
- `history`
- `export`

The container runs as UID `10001`, and the `chown` makes both directories writable for it. Without the `chown`, `create --save` cannot write the wallet file on a Linux host. Inside a container `127.0.0.1` is the container itself, so `.env` needs an address that the container can reach, not the host loopback.

## Build from Source

Skip this section if you use the published image. The steps below build the same commit from source.

<Steps>

### Install the Build Tools

On Debian or Ubuntu:

```bash
sudo apt-get update
sudo apt-get install -y git curl ca-certificates build-essential cmake libclang-dev \
  libprotobuf-dev libssl-dev perl pkg-config protobuf-compiler
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --profile minimal --default-toolchain none
. "$HOME/.cargo/env"
```

The repository pins a nightly Rust toolchain in `rust-toolchain.toml`, and `rustup` installs it on the first `cargo build`.

### Clone and Build

```bash
git clone --branch dev https://github.com/asi-alliance/asi-chain-wallet-cli.git
cd asi-chain-wallet-cli
git checkout --detach 95d4b635c2b30b9db404badf9c2e7c8af450222b
cargo build --release --locked
```

The build downloads its dependencies from crates.io and GitHub.

</Steps>

## Commands

Run these from the source directory after a build. With the image, put the command after `"$WALLET_IMAGE"` as shown above.

```bash
./target/release/asi-chain-wallet-cli --help
./target/release/asi-chain-wallet-cli create --save
./target/release/asi-chain-wallet-cli balance
./target/release/asi-chain-wallet-cli history --limit 10
./target/release/asi-chain-wallet-cli export --format json --limit 10
```

`create --save` prints the private key and writes the wallet credentials to a file under `OUTPUT_DIR`. Protect both the printed output and the file. On Unix the file is created with owner-only permissions.

`create --save` does not replace an existing `wallet_info.json` and stops with `Could not save a new wallet`, so choose another `OUTPUT_DIR` for a second wallet.

`send` requires a complete wallet file whose private key, public key and address match. Otherwise it stops with one of these errors:

- `Wallet private key does not match its public key`
- `Wallet public key does not match its address`

`balance`, `history` and `export` only need a matching `public_key` and `address`, so a watch-only `wallet_info.json` without `private_key` is enough for them.

To send tokens, pass the recipient address and the amount in atomic units, the smallest unit, which the CLI prints as `dust`:

```bash
asi-chain-wallet-cli send --to <RECIPIENT_ADDRESS> --amount <RAW_INTEGER_AMOUNT>
```

| ASI Amount | Amount in Atomic Units (18 Decimals) |
|---|---|
| 0.5 | `500000000000000000` |
| 1 | `1000000000000000000` |
| 10 | `10000000000000000000` |

ASI has 18 decimal places. See [Token Amounts](/reference/token-amounts/).

Give amounts as exact integers greater than zero.

`send` checks the balance first and prints `Deploy ID: <id>` before it submits, so you have the ID even if the connection drops.

It reports `Transfer complete.` only after the deploy is finalized and the vault reports a successful transfer. The signed transfer expires 30 minutes after signing.

When the node refuses the deploy, the error starts with `Transfer not accepted for deploy <id>`. It may add `Retry after <n> s.` and one of these causes:

- `Cause: deployer_share`, the queue limit for your deployer is full. Only retry the same signed deploy, because running `send` again signs a new transfer.
- `Cause: validator`, the queue is full for that reason. Wait, then run `send` again, which signs with a current block height.
- `Cause: validator_idle`, `Cause: shard` and `Cause: storage` mean the same, so wait and run `send` again.

Add `--retry-deployer-share` to let `send` handle the first case. On a `deployer_share` refusal that carries a retry time, it waits and sends the same signed transfer once more. If the transfer would expire before the wait ends, it skips the retry and shows the original error. Other refusals are never retried.

```bash
asi-chain-wallet-cli send --to <RECIPIENT_ADDRESS> --amount <RAW_INTEGER_AMOUNT> --retry-deployer-share
```

A deploy that fails after the queue accepted it ends with one of these errors:

- `Transfer failed for deploy <id>` means the deploy failed.
- `Transfer result unreadable for deploy <id>` means the deploy is finalized but its result cannot be read. Do not resubmit that deploy. Read its result by the deploy ID instead.
- `Transfer outcome unknown for deploy <id>` is the error for any other outcome, including a timeout. Keep the deploy ID and check the result before you send again.

## Next Steps

<CardGrid columns="2">
  <DocCard title="Network Endpoints" href="/reference/endpoints/">DevNet applications and network settings</DocCard>
  <DocCard title="Container Images" href="/reference/container-images/">Published images, tags and digests</DocCard>
  <DocCard title="Set Up a Private Shard" href="/nodes/private-shard/">Start a shard to try balance and send</DocCard>
  <DocCard title="Troubleshooting" href="/help/troubleshooting/">Find a symptom and work through its checks</DocCard>
</CardGrid>
