# Prepare and enroll a Rust validator

The ASI Rust client provides the key-generation and bonding operations needed
to enroll a validator. A separate configurator or connector image is optional
packaging around these operations. The historical helper containers target
an older workflow and should not be assumed compatible with current Rust nodes.

## Obtain the network inputs

Ask the network operator for the admitted node/client pair, exact node image
digest, full bootstrap URI, shard ID, genesis files and effective shared
configuration. Obtain a bonded validator's external gRPC and HTTP URLs and a
read-only observer's HTTP URL. Confirm admission, stake limits, active-set
capacity, network access and storage requirements.

Validators included in the initial genesis bonds use the network's genesis
ceremony. They do not need a second dynamic bonding transaction. The steps
below concern a new validator joining an existing shard.

## Create and protect the identity

The published standalone ASI client is available as:

```bash
CLIENT_IMAGE='public.ecr.aws/l2u2v4a8/asi-chain/client@sha256:f26511e261ca9d21c568b2a523fee916630ed7ac2622e65cebd2099e72db4fe7'
docker pull "$CLIENT_IMAGE"
```

This image contains client 0.2.9 from ASI dev source
[`40f2a9408040`](https://github.com/asi-alliance/asi-chain-client/tree/40f2a9408040252dd23761cd06adb9f1407ef228).
Confirm compatibility with the operator's selected node digest. The same
version label on another image does not establish compatibility.

On Linux or a WSL Linux filesystem, create a new protected directory and save
keys without printing the private key:

```bash
mkdir -m 700 ./validator-keys
docker run --rm --network none --read-only --cap-drop ALL \
  --security-opt no-new-privileges --user "$(id -u):$(id -g)" \
  --mount "type=bind,src=$PWD/validator-keys,dst=/keys" \
  "$CLIENT_IMAGE" generate-key-pair --save --output-dir /keys
```

Keep `private_key.hex` owned by the signing user with mode 0600. Save a
protected backup; never place a private key in a command argument, documentation
or container image. A validator signing identity and its P2P TLS identity are
different. Do not run the same validator identity on two machines.

For the remaining client commands, mount the key directory read-only:

```bash
client() {
  docker run --rm --read-only --cap-drop ALL \
    --security-opt no-new-privileges --user "$(id -u):$(id -g)" \
    --mount "type=bind,src=$PWD/validator-keys,dst=/keys,readonly" \
    "$CLIENT_IMAGE" "$@"
}
client generate-vault-address --private-key-file /keys/private_key.hex
```

The default Docker bridge must reach the operator's URLs. For local container
networks, select the explicitly named Docker network instead. Container
`localhost` refers to that container. Use the client's `--ca-cert` option and a
read-only CA mount when the operator supplies private HTTPS endpoints.

## Start and synchronize the joining node

Use the operator-reviewed Rust node manifest and persistent storage. Configure
its public key and protected signing-key input, advertised host and bootstrap
URI. Joining an existing shard does not require `--genesis-validator`. Keep
management APIs and metrics private and confirm container-to-host port mappings.

Check peers, synchronization and advancing canonical finalization before
bonding. A ready HTTP endpoint or `isValidator` flag alone does not establish
active consensus participation. See the selected source's
[node configuration](https://github.com/asi-alliance/asi-chain-rust-node) and the
operator's deployment manifest for the exact options.

## Fund the validator

The new validator's vault must cover the stake and the bond transaction's
execution budget: `stake + phlo_limit * phlo_price`. Amounts are integer base
units. In this client, `bond-validator` defaults to a phlo limit of
5,000,000,000 and price 1. Confirm the native token's decimals and the shard's
required prices instead of assuming a whole-token amount.

Use an approved transfer or faucet process to fund the derived address. A
normal transfer does not require changing genesis wallets or restarting the
network. Check the resulting balance on the read-only observer:

```bash
client wallet-balance --address "$VALIDATOR_ADDRESS" --http "$OBSERVER_HTTP"
```

## Submit the bond once and verify participation

Supply actual URLs and the operator's shard ID. Send the deploy to an already
bonded validator; use the read-only observer for status and result queries.

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

Record the deploy ID and outcome. A timeout can leave the transaction's outcome
unknown: inspect that deploy before submitting another bond. Read errors must
not be interpreted as an unbonded validator.

Bonded membership and active membership are separate. Activation follows the
shard's epoch and active-set rules; a full active set can prevent activation.
Confirm that the node authors blocks, that its authored blocks finalize, and
that the network continues finalizing. The CLI `blocks` command can inspect
the observer's recent block JSON, including `blockInfo.sender`, `blockHash`
and `isFinalized`.

The client's pinned [validator lifecycle guide](https://github.com/asi-alliance/asi-chain-client/blob/40f2a9408040252dd23761cd06adb9f1407ef228/docs/guides/bonding-a-validator.md)
explains bonding, activation, withdrawal and troubleshooting. Its example
topology and ports are test fixtures, not the target network's connection data.
