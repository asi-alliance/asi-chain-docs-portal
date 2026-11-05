# Wallet CLI

The ASI wallet CLI creates wallets, queries balances, sends tokens and reads/exports deploy history. It embeds its repository-local ASI client dependency; the standalone client container is a separate tool.

## Published image

```text
public.ecr.aws/l2u2v4a8/asi-chain/wallet-cli:0.1.0-dev.20261103-8f6c20ea43eb
public.ecr.aws/l2u2v4a8/asi-chain/wallet-cli@sha256:a954cc84152aaa32c35f24d906714d9f657e112645e194e69115c87c0f75b32d
```

This image was built from [wallet CLI `8f6c20ea43ebc6d333783f936372d4220e449681`](https://github.com/asi-alliance/asi-chain-wallet-cli/tree/8f6c20ea43ebc6d333783f936372d4220e449681), with ASI client gitlink `77cbdc8180d8f83a7216dbf54b23268106ea3e91`. Its compatibility tests target the node `5dafbc37` image listed in [container images](/general/container-images/). The tested source was merged into `dev`; later source changes do not modify this artifact.

Inspect help without accessing a network:

```bash
WALLET_IMAGE=public.ecr.aws/l2u2v4a8/asi-chain/wallet-cli@sha256:a954cc84152aaa32c35f24d906714d9f657e112645e194e69115c87c0f75b32d
docker pull --platform linux/amd64 "$WALLET_IMAGE"
docker run --rm --platform linux/amd64 --network none "$WALLET_IMAGE" --help
docker run --rm --platform linux/amd64 --network none "$WALLET_IMAGE" send --help
```

For actual commands, pass a protected environment file and mount the required credential/output directories. The container runs as UID `10001`; arrange ownership and paths explicitly. Host loopback URLs do not reach host services from a normal Docker bridge container.

## Source installation

For current integration development, explicitly select `dev`, inspect its full SHA and committed gitlink, and follow that revision's prerequisites. To reproduce the published application source:

```bash
git clone --branch dev https://github.com/asi-alliance/asi-chain-wallet-cli.git
cd asi-chain-wallet-cli
git checkout --detach 8f6c20ea43ebc6d333783f936372d4220e449681
git submodule update --init --recursive
cargo build --release --locked
```

Use the pinned `rust-toolchain.toml`, `Cargo.lock` and submodule. Do not use `git submodule update --remote`: it replaces the reviewed dependency with a moving head. The default release branch and a sibling client checkout are not substitutes for the gitlink.

## Configuration

Copy the [pinned `.env.example`](https://github.com/asi-alliance/asi-chain-wallet-cli/blob/8f6c20ea43ebc6d333783f936372d4220e449681/.env.example) to a private `.env`. Replace these local mapping examples with actual approved URLs:

```dotenv
VALIDATOR_GRPC_URL=http://127.0.0.1:40412
VALIDATOR_HTTP_URL=http://127.0.0.1:40413
OBSERVER_HTTP_URL=http://127.0.0.1:40453
OUTPUT_DIR=./credentials
EXPECTED_TOKEN_SYMBOL=ASI
SHARD_ID=root
DEPLOY_MAX_WAIT_SECONDS=480
DEPLOY_CHECK_INTERVAL_SECONDS=5
NODE_CONNECT_TIMEOUT_SECONDS=10
NODE_TIMEOUT_SECONDS=30
GRAPHQL_URL=
```

The example gRPC port is a locally mapped validator **internal** listener. Keep it private. HTTP ports are independent mappings, not inferred from gRPC. HTTPS URLs use TLS; optional `NODE_CA_CERT` supplies a private CA.

Legacy `VALIDATOR_HOST` with `VALIDATOR_GRPC_PORT` / `VALIDATOR_HTTP_PORT` is supported. For observers, supply `OBSERVER_HTTP_URL` or `OBSERVER_HOST` with **`OBSERVER_HTTP_PORT`**. `OBSERVER_GRPC_PORT` is no longer used.

`GRAPHQL_URL` is needed for history/export only. Configure the actual Hasura schema, permissions and WebSocket endpoint without putting admin credentials in public URLs. Full deployment acceptance for history/export remains tracked in [wallet CLI issue #5](https://github.com/asi-alliance/asi-chain-wallet-cli/issues/5).

## Commands

Run from the configured source directory:

```bash
./target/release/asi-chain-wallet-cli --help
./target/release/asi-chain-wallet-cli create --save
./target/release/asi-chain-wallet-cli balance
./target/release/asi-chain-wallet-cli history --limit 10
./target/release/asi-chain-wallet-cli export --format json --limit 10
```

`create --save` writes private wallet credentials under `OUTPUT_DIR`. Protect its output and generated file. Balance/history also require a complete matching wallet file at this revision; watch-only files are not supported.

To send, explicitly choose the recipient and **raw dust** amount. The command shape is:

```text
asi-chain-wallet-cli send --to <RECIPIENT_ADDRESS> --amount <RAW_INTEGER_AMOUNT>
```

| ASI amount | Raw CLI amount (8 decimals) |
|---|---|
| 0.5 | `50000000` |
| 1 | `100000000` |
| 10 | `1000000000` |

Keep amounts as exact integers, including values above JavaScript's safe integer range. Success requires canonical finalization and a positive vault verdict. When the outcome is unknown, retain the deploy ID and investigate before sending again.

The node's native-token configuration and expected symbol must match the target shard. Cost-accounting APIs and later node API changes require their own compatible source/image pair; they are not enabled by substituting an image tag here.
