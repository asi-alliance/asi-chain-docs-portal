# Wallet CLI

The ASI wallet CLI creates wallets, queries balances, sends tokens and reads and exports deploy history from a terminal. Run it from the published image or build it from source.

## Published Image

```text
public.ecr.aws/l2u2v4a8/asi-chain/wallet-cli:0.1.0-dev.20261103-8f6c20ea43eb
public.ecr.aws/l2u2v4a8/asi-chain/wallet-cli@sha256:a954cc84152aaa32c35f24d906714d9f657e112645e194e69115c87c0f75b32d
```

This image was built from the wallet CLI at commit `8f6c20ea43ebc6d333783f936372d4220e449681` ([github.com/asi-alliance/asi-chain-wallet-cli](https://github.com/asi-alliance/asi-chain-wallet-cli/tree/8f6c20ea43ebc6d333783f936372d4220e449681)), with ASI client gitlink `77cbdc8180d8f83a7216dbf54b23268106ea3e91`. Its compatibility tests target the node image `5dafbc37` listed in [Container Images](/reference/container-images/). Later changes to the source do not modify this image.

The CLI builds the ASI client from the `rust-client` git submodule into its own binary. The standalone `client` container is a different tool, and its image tag for enrollment is built from a different commit than the one in this submodule, so do not swap one for the other.

To show the help text without connecting to a network, pull the image and run it with `--network none`:

```bash
WALLET_IMAGE=public.ecr.aws/l2u2v4a8/asi-chain/wallet-cli@sha256:a954cc84152aaa32c35f24d906714d9f657e112645e194e69115c87c0f75b32d
docker pull --platform linux/amd64 "$WALLET_IMAGE"
docker run --rm --platform linux/amd64 --network none "$WALLET_IMAGE" --help
docker run --rm --platform linux/amd64 --network none "$WALLET_IMAGE" send --help
```

## Compatibility

The CLI is written for the HTTP and gRPC API of the Rust node.

Use a Rust node, such as one started from the [node image](/nodes/image/) or a [private shard](/nodes/private-shard/), for `balance` and `send`.

## Configuration

Copy the [pinned `.env.example`](https://github.com/asi-alliance/asi-chain-wallet-cli/blob/8f6c20ea43ebc6d333783f936372d4220e449681/.env.example) to a private `.env`. The CLI has no default node addresses, and every command, including `create`, stops at startup if these four values are missing:

- `VALIDATOR_GRPC_URL`, the gRPC endpoint of a validator, which `send` uses to submit the deploy.
- `VALIDATOR_HTTP_URL`, the HTTP endpoint of the same validator.
- `OBSERVER_HTTP_URL`, the HTTP endpoint of a read-only node. `balance` queries it, and `send` uses it to confirm finalization. A Rust validator answers balance queries with `HTTP 400 (readonly_node_required)`.
- `OUTPUT_DIR`, the directory with `wallet_info.json`.

Without them the CLI prints `Error loading configuration: VALIDATOR_HOST is not set`. Instead of a URL you can set `VALIDATOR_HOST` with `VALIDATOR_GRPC_PORT` and `VALIDATOR_HTTP_PORT`, and `OBSERVER_HOST` with `OBSERVER_HTTP_PORT`.

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
```

The values after `OUTPUT_DIR` are the defaults. `.env.example` ships local mappings (`127.0.0.1:40412`, `40413`, `40453`) that fit only a node started with exactly those host ports.

`send` submits through the external gRPC port of a validator (`40401` by default). Open it only to the clients that need it. The HTTP ports are mapped separately from the gRPC port. HTTPS URLs use TLS, and `NODE_CA_CERT` points to a private CA certificate.

`GRAPHQL_URL` is needed only by `history` and `export`. The CLI opens it as a GraphQL WebSocket, so it must start with `ws://` or `wss://`, and the endpoint has to accept the `graphql-ws` protocol. With an `https://` URL both commands end with `Failed to connect to WebSocket`. Ask the network operator for the endpoint.

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

`SHARD_ID` must match `--shard-name`. Nodes started without the token flags report `F1R3`, and `balance` then stops with `Wrong native token: expected ASI, node reports F1R3` until `EXPECTED_TOKEN_SYMBOL` matches the reported symbol.

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

The working directory of the image is `/app`, so the default `OUTPUT_DIR=./credentials` puts the wallet file into `credentials/wallet_info.json` on the host. Replace `create --save` with `balance`, `send`, `history` or `export` for the other commands, and keep the same two volumes so they find the wallet file and write exports to `exports/`.

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

The repository pins `nightly-2026-02-09` in `rust-toolchain.toml`, and `rustup` installs it on the first `cargo build`.

### Clone and Build

```bash
git clone --branch dev https://github.com/asi-alliance/asi-chain-wallet-cli.git
cd asi-chain-wallet-cli
git checkout --detach 8f6c20ea43ebc6d333783f936372d4220e449681
git submodule update --init --recursive
cargo build --release --locked
```

The build downloads its dependencies from crates.io and GitHub. `cargo build` itself takes 6 to 8 minutes on a 12-core machine.

::: warning Select the dev Branch
Select `dev` explicitly. The default branch `main` is older and points the `rust-client` submodule to another repository (`singnet/rust-client`, commit `cb3caab`), so a plain clone builds a different client.

Do not use `git submodule update --remote`: it replaces the pinned client with the newest commit of its branch.
:::

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

`create --save` writes private wallet credentials under `OUTPUT_DIR`. Protect its output and the generated file. `balance` and `history` also require a complete matching wallet file at this revision, and watch-only files are not supported.

To send tokens, pass the recipient address and the amount in raw dust, the smallest unit:

```bash
asi-chain-wallet-cli send --to <RECIPIENT_ADDRESS> --amount <RAW_INTEGER_AMOUNT>
```

| ASI Amount | Raw CLI Amount (8 Decimals) |
|---|---|
| 0.5 | `50000000` |
| 1 | `100000000` |
| 10 | `1000000000` |

The table is for 8 decimals, as on DevNet. See [Token Amounts](/reference/token-amounts/).

Give amounts as exact integers. The CLI reads them without a size limit, so values above JavaScript's safe integer range (2^53 − 1) stay exact. `send` reports success only after the deploy is finalized and the vault reports a successful transfer. If the outcome is unknown, keep the deploy ID and check the result before you send again.

The node's native-token configuration and expected symbol must match the target shard.

## Next Steps

<CardGrid columns="2">
  <DocCard title="Network Endpoints" href="/reference/endpoints/">DevNet applications and node addresses</DocCard>
  <DocCard title="Container Images" href="/reference/container-images/">Published images, tags and digests</DocCard>
  <DocCard title="Set Up a Private Shard" href="/nodes/private-shard/">Start a shard to try balance and send</DocCard>
  <DocCard title="Troubleshooting" href="/help/troubleshooting/">Check which revision the CLI was built from</DocCard>
</CardGrid>
