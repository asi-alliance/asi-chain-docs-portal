# Run a Validator

This page prepares a Rust node that is meant to become a validator. Preparation comes first. Key generation, funding and the bond transaction follow on [Enroll a Validator](/nodes/validator-enrollment/). The configurator and connector workflow in `asi-chain/chain/validator` does not apply to this node. The public DevNet runs a Scala node, which this Rust image does not connect to, so follow this guide on a Rust shard that you or your operator run.

## Prepare the Validator

<Steps>

### Obtain Network Inputs

Ask the shard operator for the bootstrap URI, the shard and genesis configuration, the native-token metadata, the admission and bonding process and the node image that the shard accepts. A matching version number or a downloaded image does not show that your node is compatible with a running network.

- The bootstrap URI looks like `rnode://<node-id>@<host>?protocol=40400&discovery=40404`. The node ID is the `address` field of `GET /api/status` on the bootstrap node.
- The `--network-id` value must equal the `networkId` that the bootstrap node reports. The default is `testnet`, and a node ignores messages from any other network.
- The `--shard-name` value must equal the `shardId` that the bootstrap node reports. The default is `root`.
- The `--host` value is the address other nodes use to reach yours. If you leave it out, the node tries to guess its public address, which fails behind NAT and on container networks.

Check storage, CPU, memory and retention requirements with the operator. No sizing has been measured for these images.

### Inspect the Published Image

Follow [Node Image](/nodes/image/) to pull the image, read its labels and run `run --help`. The [catalog](/reference/container-images/) lists the builds, all for `linux/amd64`. Confirm which exact revision the target shard accepts.

### Prepare Storage, Configuration and Keys

A new Docker volume is owned by `root`, but the image runs as `daemon` (uid 1). Change the owner before the first start, otherwise the node exits with `The data dir must be a directory and have read and write permissions`.

```bash
NODE_IMAGE=<image from the catalog>
docker volume create validator-data
docker run --rm -u root --platform linux/amd64 --entrypoint chown \
  -v validator-data:/var/lib/rnode "$NODE_IMAGE" daemon:daemon /var/lib/rnode
```

The node keeps its state, its TLS certificate and its identity in `/var/lib/rnode/`. Options are applied in this order: command line, configuration file, built-in defaults ([defaults.conf at the pinned revision](https://github.com/asi-alliance/asi-chain-rust-node/blob/e18defd44d43fe460379efefb88223797709a0cf/node/src/main/resources/defaults.conf)).

- The node reads `/var/lib/rnode/f1r3fly.conf` without any flag. It also accepts the older name `rnode.conf` and logs a warning. `run --config-file <path>` points to another file.
- Do not pass `--profile`. The image entrypoint adds `--profile=docker`, and the node exits with an error if you pass `--profile` as well.
- Match the shard and native-token settings to the target genesis. The defaults are `shard-name = root`, token `F1R3CAP` with symbol `F1R3` and 8 decimals, and they cannot change after genesis.
- Joining an existing shard does not use `--genesis-validator`, and a development `bonds.txt` is not an enrollment procedure. Genesis participation, joining and bonding are separate steps.

### Validator Key

The validator key reaches the node in one of two ways, and both are used together with `--validator-public-key`. The node does not check at start that the public key belongs to the private key, so take both from the same key pair.

- `--validator-private-key-path` takes an encrypted PEM file. The node asks for its password at start, or reads it from the `F1R3NODE_VALIDATOR_PASSWORD` environment variable. Without a terminal and without that variable the node exits with `No such device or address`, and with a wrong password it exits with `Could not decrypt PEM file`. The plain hex file saved by the ASI client is not accepted and fails with `malformedframing`.
- `--validator-private-key` takes the hex key itself. The option is hidden from `run --help`, and the key then shows in `docker inspect` and in the process list, so use it only on a host that nobody else can read.

To create a new key pair for the node, run `keygen` in a terminal. It asks twice for a password and writes `f1r3fly.key` (the encrypted private key), `f1r3fly.pub.pem` and `f1r3fly.pub.hex` into the volume. The second command prints the public key for `--validator-public-key`. `f1r3fly.pub.hex` holds the key in upper-case hex, while the ASI client and the `sender` field of blocks use lower case. The node and `/api/bond-status` accept both, so compare keys case-insensitively.

```bash
docker run --rm -it --platform linux/amd64 \
  -v validator-data:/var/lib/rnode "$NODE_IMAGE" keygen /var/lib/rnode
docker run --rm --platform linux/amd64 --entrypoint cat \
  -v validator-data:/var/lib/rnode "$NODE_IMAGE" /var/lib/rnode/f1r3fly.pub.hex
```

To keep the key that the ASI client saved in `validator-keys/private_key.hex` during [enrollment](/nodes/validator-enrollment/), convert it to an encrypted PEM file with OpenSSL 3 and copy the result into the volume. `openssl pkcs8` asks for the password of the new file. The temporary files that hold the plain key are removed at the end, and the public key does not change: it remains the one in `validator-keys/public_key.hex`.

```bash
umask 077
printf 'asn1=SEQUENCE:ec_key\n[ec_key]\nversion=INTEGER:1\nprivateKey=FORMAT:HEX,OCTETSTRING:%s\nparameters=EXPLICIT:0,OID:secp256k1\n' \
  "$(tr -d '\n' < validator-keys/private_key.hex)" > ec.conf
openssl asn1parse -genconf ec.conf -noout -out key.der
openssl ec -inform DER -in key.der -out key.pem
openssl pkcs8 -topk8 -v2 aes-256-cbc -in key.pem -out validator-keys/f1r3fly.key
rm -f ec.conf key.der key.pem
docker run --rm -u root --platform linux/amd64 --entrypoint install \
  -v validator-data:/var/lib/rnode \
  -v "$PWD/validator-keys/f1r3fly.key:/tmp/f1r3fly.key:ro" \
  "$NODE_IMAGE" -o daemon -g daemon -m 600 /tmp/f1r3fly.key /var/lib/rnode/f1r3fly.key
```

::: danger Never Publish Keys
Never publish a key or a TLS file in logs, examples or Git.
:::

### Start the Node

With either key file in place, start the node with the values from step 1 and the public key of the validator key. `read` asks for the key password without showing it, and `-e` passes the variable to the container.

```bash
NETWORK_ID=<networkId of the shard>
SHARD_NAME=<shardId of the shard>
PUBLIC_HOST=<public IP or DNS name of this machine>
BOOTSTRAP_URI='<bootstrap URI from the shard operator>'
VALIDATOR_PUBLIC_KEY=<public key of the validator key>
read -rsp 'Key password: ' F1R3NODE_VALIDATOR_PASSWORD; echo
export F1R3NODE_VALIDATOR_PASSWORD

docker run -d --name validator --platform linux/amd64 \
  -e F1R3NODE_VALIDATOR_PASSWORD \
  -v validator-data:/var/lib/rnode \
  -p 40400:40400 -p 40404:40404 -p 127.0.0.1:40403:40403 \
  "$NODE_IMAGE" run --network-id "$NETWORK_ID" --shard-name "$SHARD_NAME" \
  --host "$PUBLIC_HOST" --bootstrap "$BOOTSTRAP_URI" \
  --validator-public-key "$VALIDATOR_PUBLIC_KEY" \
  --validator-private-key-path /var/lib/rnode/f1r3fly.key
```

Add the token flags `--native-token-name`, `--native-token-symbol` and `--native-token-decimals` when the shard does not use the defaults. On a private network add `--allow-private-addresses`, and add `--no-upnp` when the ports are forwarded by hand.

::: danger Password Is Visible to Docker Users
The password stays in the container environment, so `docker inspect validator` shows it to anyone with access to Docker on the host.
:::

### Review Networking

Peers must reach TCP `40400` and `40404`. Configure client access separately, and keep internal gRPC `40402`, admin HTTP `40405` and `/metrics` private. See the [port table](/nodes/image/#default-container-ports). The `api-server.host` setting applies to every API listener, so enforce boundaries with host port bindings, firewall rules and gateway routes.

### Validate the Node

After you start the node, run these checks in order.

```bash
curl -s -w ' HTTP %{http_code}\n' http://127.0.0.1:40403/api/ready
curl -s http://127.0.0.1:40403/api/status
```

The node is synchronized when `/api/status` shows `isReady: true`, a positive `peers` count and a growing `lastFinalizedBlockNumber`. The `isValidator` field only says that a validator key is configured. It does not say that the node is bonded. The following endpoints on the HTTP port show the bond itself.

- `GET /api/bond-status/{public key}` returns `{"publicKey": "...", "isBonded": true}` once the bond is active.
- `GET /api/validators` lists the bonded validators and their stakes.
- `GET /api/epoch` shows the epoch length and `blocksUntilNextEpoch`.

A bond and a withdrawal take effect only at an epoch boundary. Between boundaries a new bond is recorded but not active. Confirm the actual validator set before you count the node as a consensus participant.

Do not run live transfers as an installation test. See [Troubleshooting](/help/troubleshooting/) if the node does not start or does not find peers.

</Steps>

## Next Steps

<CardGrid columns="2">
<DocCard title="Enroll a Validator" href="/nodes/validator-enrollment/">Generate keys, fund the vault and submit the bond</DocCard>
<DocCard title="Node Image" href="/nodes/image/">Image selection, ports and configuration flags</DocCard>
<DocCard title="Troubleshooting" href="/help/troubleshooting/">What to check when the node does not start or does not find peers</DocCard>
</CardGrid>
