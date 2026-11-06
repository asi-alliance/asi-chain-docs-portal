# Enroll a Validator

The ASI Rust client provides the key-generation and bonding operations needed to enroll a validator. A separate configurator or connector image is optional packaging around these operations. Older helper containers target a previous workflow, so do not assume they work with current Rust nodes.

::: warning DevNet Runs the Scala Node
As of 5 November 2026 the public DevNet runs a Scala node (Validator 1 reports `RChain Node 1.0.0-SNAPSHOT`), and the Rust client commands on this page do not work against it. In a test against Validator 1, `wallet-balance` returned HTTP 404, and `validator-status`, `bonds` and `active-validators` failed with `unexpected exploratory deploy response from the node: missing field cost`. The same commands passed against a Rust node. Run this procedure only against a Rust shard.
:::

## Before You Start

Ask the network operator for the following.

- The admitted node and client pair and the exact node image digest.
- The full bootstrap URI, the `networkId`, the shard ID, the genesis files and the effective shared configuration. The shard ID is the node's `casper.shard-name`, and it is the `shardId` field of `GET /api/status`. The built-in default is `root`.
- The external gRPC and HTTP URLs of a bonded validator, and the HTTP and gRPC URLs of a read-only observer.
- The shard's minimum stake. The node option `--bond-minimum` sets it at genesis, and a stake below it is refused.
- The active-set capacity, network access and storage requirements.

Validators included in the initial genesis bonds use the network's genesis ceremony. They do not need a second dynamic bonding transaction. The steps below concern a new validator joining an existing shard.

The commands below read their inputs from these variables. Set them to the values you received.

```bash
BONDED_VALIDATOR_GRPC=<gRPC URL of a bonded validator>
BONDED_VALIDATOR_HTTP=<HTTP URL of a bonded validator>
OBSERVER_GRPC=<gRPC URL of the observer>
OBSERVER_HTTP=<HTTP URL of the observer>
SHARD_ID=<shard ID>
STAKE_BASE_UNITS=<stake in base units>
```

## Enroll the Validator

<Steps>

### Create and Protect the Identity

The standalone ASI client is published as this image:

```bash
CLIENT_IMAGE='public.ecr.aws/l2u2v4a8/asi-chain/client@sha256:f26511e261ca9d21c568b2a523fee916630ed7ac2622e65cebd2099e72db4fe7'
docker pull --platform linux/amd64 "$CLIENT_IMAGE"
```

This image contains client 0.2.9 built from commit [`40f2a9408040`](https://github.com/asi-alliance/asi-chain-client/tree/40f2a9408040252dd23761cd06adb9f1407ef228) on the `dev` branch of asi-chain-client. The image exists for `linux/amd64` only. Confirm compatibility with the operator's selected node digest, because the same version label on another image does not establish compatibility.

On Linux or a WSL Linux filesystem, create a new protected directory and save keys without printing the private key:

```bash
mkdir -m 700 ./validator-keys
docker run --rm --platform linux/amd64 --network none --read-only --cap-drop ALL \
  --security-opt no-new-privileges --user "$(id -u):$(id -g)" \
  --mount "type=bind,src=$PWD/validator-keys,dst=/keys" \
  "$CLIENT_IMAGE" generate-key-pair --save --output-dir /keys
```

::: danger Protect the Private Key
`private_key.hex` is the validator's signing key and holds its funds. Keep it owned by the signing user with mode 0600 and save a protected backup. Never place it in a command argument, in documentation or in a container image, and do not run the same validator identity on two machines. The signing identity and the P2P TLS identity of the node are different keys.
:::

For the remaining client commands, mount the key directory read-only:

```bash
client() {
  docker run --rm --platform linux/amd64 --read-only --cap-drop ALL \
    --security-opt no-new-privileges --user "$(id -u):$(id -g)" \
    --mount "type=bind,src=$PWD/validator-keys,dst=/keys,readonly" \
    "$CLIENT_IMAGE" "$@"
}
client generate-vault-address --private-key-file /keys/private_key.hex
```

The command prints the public key and the vault address. The later commands use both, so keep them in variables:

```bash
VALIDATOR_PUBLIC_KEY="$(cat validator-keys/public_key.hex)"
VALIDATOR_ADDRESS="$(client generate-vault-address --private-key-file /keys/private_key.hex \
  | sed -n 's/^ *Vault address: //p')"
```

`generate-key-pair --save` writes the public key to `public_key.hex` as 130 hex characters (uncompressed). The vault address starts with `1111`.

The default Docker bridge must reach the operator's URLs. For local container networks, add `--network <name>` to the `client` function, where `<name>` is the Docker network you name explicitly. Container `localhost` refers to that container. Use the client's `--ca-cert` option and a read-only CA mount when the operator supplies private HTTPS endpoints.

### Start and Synchronize the Joining Node

Prepare storage and the key, and start the node as described in [Run a Validator](/nodes/validator/#start-the-node). Joining an existing shard needs these node options, and `--genesis-validator` and `--ceremony-master-mode` stay unset:

- `--bootstrap` with the operator's URI.
- `--network-id` equal to the shard's `networkId`.
- `--shard-name` equal to the shard's `shardId`.
- `--host` with the address that other nodes use to reach this node.
- `--validator-public-key` with `$VALIDATOR_PUBLIC_KEY` and `--validator-private-key-path` with the key converted from `private_key.hex` as shown in [Validator Key](/nodes/validator/#validator-key). The node does not read `private_key.hex` itself.
- The token flags `--native-token-name`, `--native-token-symbol` and `--native-token-decimals` when the shard does not use the defaults.

The pinned [node option definitions](https://github.com/asi-alliance/asi-chain-rust-node/blob/e18defd44d43fe460379efefb88223797709a0cf/node/src/rust/configuration/commandline/options.rs) list every flag. Keep management APIs and metrics private and confirm container-to-host port mappings.

Check peers, synchronization and advancing canonical finalization before bonding. A ready HTTP endpoint or `isValidator` flag alone does not establish active consensus participation.

### Fund the Validator

The new validator's vault must cover the stake and the bond transaction's execution budget: `stake + phlo_limit * phlo_price`. Amounts are integer base units. In this client, `bond-validator` defaults to a phlo limit of 5,000,000,000 and price 1. Confirm the native token's decimals and the shard's required prices instead of assuming a whole-token amount.

Use an approved transfer or faucet process to fund the derived address. A normal transfer does not require changing genesis wallets or restarting the network. Check the resulting balance on the read-only observer:

```bash
client wallet-balance --address "$VALIDATOR_ADDRESS" --http "$OBSERVER_HTTP"
```

### Check the Epoch

A bond is recorded when its deploy finalizes, but it becomes active only at the next epoch boundary. The client reads the epoch from the observer's gRPC port:

```bash
client epoch-info --grpc "$OBSERVER_GRPC"
```

The output shows the current block and epoch, the epoch length and the quarantine length in blocks, and the progress through the epoch. In a shard with default settings the epoch is 10,000 blocks long. A withdrawal also takes effect at a boundary, and the stake is paid out after the quarantine period.

### Submit the Bond Once and Verify Participation

Send the deploy to an already bonded validator, because a node that cannot propose accepts a deploy and never includes it. Do not send it to the joining node itself or to the bootstrap or ceremony-master node. Use the read-only observer for status and result queries. The stake must be at least the shard's `bond-minimum`, and bonding the same key twice fails with `already bonded`.

```bash
client bond-validator --stake "$STAKE_BASE_UNITS" \
  --private-key-file /keys/private_key.hex \
  --grpc "$BONDED_VALIDATOR_GRPC" --http "$BONDED_VALIDATOR_HTTP" \
  --observer "$OBSERVER_HTTP" --shard-id "$SHARD_ID" --max-wait 300

client validator-status --public-key "$VALIDATOR_PUBLIC_KEY" \
  --http "$OBSERVER_HTTP"
client bonds --http "$OBSERVER_HTTP"
client active-validators --http "$OBSERVER_HTTP"
```

Record the deploy ID and outcome.

::: danger Do Not Repeat the Bond
A timeout can leave the transaction's outcome unknown, and the verdict for a deploy appears only after its block finalizes, so do not repeat the bond.
:::

Check the deploy first, either with `client deploy-status --sig <deploy signature> --http "$OBSERVER_HTTP"` or with `GET <observer HTTP URL>/api/deploy/<deploy ID>`. An underfunded vault does not reject the deploy. The deploy lands in a block and fails there with `Deploy payment failed: Insufficient funds`, and the client may not show that message. Do not treat a read error as proof that the validator is unbonded.

Bonded membership and active membership are separate. Activation follows the shard's epoch and active-set rules, so `validator-status` reports `BONDED` first and `ACTIVE` after the boundary, and a full active set can prevent activation. Confirm that the node authors blocks, that its authored blocks finalize, and that the network continues finalizing. The client's `blocks` command prints recent blocks from the observer as JSON, including `blockInfo.sender`, `blockHash` and `isFinalized`.

The client's pinned [validator lifecycle guide](https://github.com/asi-alliance/asi-chain-client/blob/40f2a9408040252dd23761cd06adb9f1407ef228/docs/guides/bonding-a-validator.md) explains bonding, activation, withdrawal and troubleshooting. Its example topology and ports are test fixtures, not the target network's connection data.

</Steps>

## Next Steps

<CardGrid columns="2">
<DocCard title="Run a Validator" href="/nodes/validator/">Prepare storage, keys and the node itself</DocCard>
<DocCard title="Node Image" href="/nodes/image/">Image selection, ports and configuration flags</DocCard>
<DocCard title="Troubleshooting" href="/help/troubleshooting/">What to check when the node does not start or does not find peers</DocCard>
</CardGrid>
