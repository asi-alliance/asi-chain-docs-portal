# Run a Validator

Run a validator on an existing shard. This page creates the validator key, starts the node and waits for it to synchronize, funds the validator, submits the bond and waits for activation. Every step uses the values from the shard operator, so read the page from top to bottom without skipping steps.

::: info Terminal
The commands are written for bash. On Linux and macOS run them in a terminal. On Windows run them in a WSL terminal such as Ubuntu with the WSL integration of Docker Desktop turned on, and keep key files in the Linux home directory, not under `/mnt/c`, because the client refuses a key file that other users can read.
:::

## Before You Start

You need Docker and OpenSSL 3 on the machine. Ask the operator for the following.

- The node image and the client image that the shard accepts. The commands below use the digests that the [image catalog](/reference/container-images/) lists, and the operator confirms that this node and client pair works with the shard. Both images are published for `linux/amd64` only. [Node Image](/nodes/image/) shows how to pull the node image and read its labels.
- The bootstrap URI, which looks like `rnode://<node-id>@<host>?protocol=40400&discovery=40404`. The node ID is the `address` field of `GET /api/status` on the bootstrap node.
- The `networkId` of the shard. The `--network-id` value must equal the `networkId` that the bootstrap node reports. The default is `testnet`, and a node that joins with another network ID exits with a `Wrong network id` error.
- The shard ID, which is the `shardId` field of `GET /api/status` and the node option `casper.shard-name`. The `--shard-name` value must equal it. The default is `root`.
- The native-token settings of the shard. They are fixed at genesis, and a node restarted with other values stops. The commands below use the name `ASI`, the symbol `ASI` and 18 decimals.
- The gRPC and HTTP URLs of a bonded validator, in the form `http://host:40401` and `http://host:40403`. The bond goes to this node.
- The gRPC and HTTP URLs of a read-only observer of the shard, in the same form. The observer answers all status and result queries.
- The minimum stake and the stake to bond. The shard sets the minimum with the node option `--bond-minimum` at genesis, and a stake below it is refused. The node reports the decimals of the shard token as `nativeTokenDecimals` in `/api/status`, and `STAKE_ATOMIC_UNITS` depends on it. Amounts are integers in atomic units of the token. With 18 decimals one ASI is `1000000000000000000` atomic units (see [Token Amounts](/reference/token-amounts/)).
- The capacity of the active validator set. A full active set can prevent activation.
- The CPU, memory and disk space that a node of this network needs, and its data retention requirements.
- How the operator funds a new validator, and how to send the vault address to the operator.

A validator that is listed in the initial genesis bonds joins through the genesis ceremony of the network and does not need the bond transaction from this page.

## Run the Validator

<Steps>

### Set the Variables

Replace each value in angle brackets with the value from the operator. `PUBLIC_HOST` is the address that other nodes use to reach this machine. If you leave `--host` out, the node tries to guess its public address, which fails behind NAT and on container networks.

```bash
NODE_IMAGE='public.ecr.aws/l2u2v4a8/asi-chain/node-rust@sha256:f46bc3542ae9cab873f3a6e4f40651546bfeba47fb3d1d65966564b18d3123b6'
CLIENT_IMAGE='public.ecr.aws/l2u2v4a8/asi-chain/client@sha256:5b192be72df772f2a0f446245d583f1f916e970b8a6fd6ad97d32b0ab8ef20f4'
NETWORK_ID='<networkId of the shard>'
SHARD_NAME='<shardId of the shard>'
PUBLIC_HOST='<public IP or DNS name of this machine>'
BOOTSTRAP_URI='<bootstrap URI from the shard operator>'
BONDED_VALIDATOR_GRPC='<gRPC URL of a bonded validator>'
BONDED_VALIDATOR_HTTP='<HTTP URL of a bonded validator>'
OBSERVER_GRPC='<gRPC URL of the observer>'
OBSERVER_HTTP='<HTTP URL of the observer>'
STAKE_ATOMIC_UNITS='<stake in atomic units>'
KEY_DIR="$HOME/validator-keys"

client() {
  docker run --rm --platform linux/amd64 --read-only --cap-drop ALL \
    --security-opt no-new-privileges --user "$(id -u):$(id -g)" \
    --mount "type=bind,src=$KEY_DIR,dst=/keys,readonly" \
    "$CLIENT_IMAGE" "$@"
}

docker pull --platform linux/amd64 "$CLIENT_IMAGE"
docker pull --platform linux/amd64 "$NODE_IMAGE"
```

Keep this terminal open until the end of the page. In a new terminal, run the block again, because the variables and the `client` function exist only in the terminal that defined them. Once the keys exist, also run the two lines from [Create the Validator Key](#create-the-validator-key) that set `VALIDATOR_PUBLIC_KEY` and `VALIDATOR_ADDRESS`. The client image holds the ASI client built from the `rust-dev` branch of [asi-chain-client](https://github.com/asi-alliance/asi-chain-client/tree/rust-dev).

The client has a `--ca-cert` option for private HTTPS endpoints of the operator that use their own CA. Mount the CA file read-only. Inside the client container `localhost` means the container itself, not your machine. To run the commands against a Docker network of your own, add `--network <name>` to the `client` function and to the `docker run` of the node, and use container names in the URLs. [Set Up a Private Shard](/nodes/private-shard/#add-a-validator) does this for a shard on the same machine.

### Create the Validator Key

The client saves the key as a hex file, and the node reads only an encrypted PEM file. Create the key with the client first and convert it afterwards. The directory must not exist yet, so that a key you already hold is not overwritten. If it exists, set `KEY_DIR` to another path.

```bash
mkdir -m 700 "$KEY_DIR" && \
docker run --rm --platform linux/amd64 --network none --read-only --cap-drop ALL \
  --security-opt no-new-privileges --user "$(id -u):$(id -g)" \
  --mount "type=bind,src=$KEY_DIR,dst=/keys" \
  "$CLIENT_IMAGE" generate-key-pair --save --output-dir /keys
```

::: danger Protect the Private Key
`private_key.hex` is the validator's signing key and holds its funds. Keep it owned by the signing user with mode 0600 and save a protected backup. Never place it in a command argument, in documentation, in a container image, in logs or in Git. Never publish the TLS files of the node, and do not run the same validator identity on two machines. The signing identity and the P2P TLS identity of the node are different keys.
:::

`generate-key-pair --save` writes `public_key.hex` as 130 hex characters (uncompressed). The vault address starts with `1111`. The later steps use both, so keep them in variables:

```bash
VALIDATOR_PUBLIC_KEY="$(cat "$KEY_DIR/public_key.hex")"
VALIDATOR_ADDRESS="$(client generate-vault-address --private-key-file /keys/private_key.hex \
  | sed -n 's/^ *Vault address: //p')"
echo "$VALIDATOR_ADDRESS"
```

Now convert `private_key.hex` to an encrypted PEM file with OpenSSL 3. `openssl pkcs8` asks twice for the password of the new file. Choose a password, because you type the same one when the node starts. The `rm -f` line removes the temporary files that hold the plain key. The public key does not change.

```bash
umask 077
printf 'asn1=SEQUENCE:ec_key\n[ec_key]\nversion=INTEGER:1\nprivateKey=FORMAT:HEX,OCTETSTRING:%s\nparameters=EXPLICIT:0,OID:secp256k1\n' \
  "$(tr -d '\n' < "$KEY_DIR/private_key.hex")" > "$KEY_DIR/ec.conf"
openssl asn1parse -genconf "$KEY_DIR/ec.conf" -noout -out "$KEY_DIR/key.der"
openssl ec -inform DER -in "$KEY_DIR/key.der" -out "$KEY_DIR/key.pem"
openssl pkcs8 -topk8 -v2 aes-256-cbc -in "$KEY_DIR/key.pem" -out "$KEY_DIR/f1r3fly.key"
rm -f "$KEY_DIR/ec.conf" "$KEY_DIR/key.der" "$KEY_DIR/key.pem"
```

### Prepare the Data Volume

A new Docker volume is owned by `root`, but the image runs as `daemon` (uid 1). Change the owner before the first start, otherwise the node exits with `The data dir must be a directory and have read and write permissions`. The last command copies the encrypted key into the volume. It runs only if `f1r3fly.key` exists, because otherwise Docker would create a directory of that name.

```bash
docker volume create validator-data
docker run --rm -u root --platform linux/amd64 --entrypoint chown \
  -v validator-data:/var/lib/rnode "$NODE_IMAGE" daemon:daemon /var/lib/rnode
test -f "$KEY_DIR/f1r3fly.key" && \
docker run --rm -u root --platform linux/amd64 --entrypoint install \
  -v validator-data:/var/lib/rnode \
  -v "$KEY_DIR/f1r3fly.key:/tmp/f1r3fly.key:ro" \
  "$NODE_IMAGE" -o daemon -g daemon -m 600 /tmp/f1r3fly.key /var/lib/rnode/f1r3fly.key \
  || echo 'f1r3fly.key is missing, run the OpenSSL commands of Create the Validator Key again'
```

The node keeps its state, its TLS certificate and its identity in `/var/lib/rnode/`.

### Start the Node

The node asks for the key password at start or reads it from the `F1R3NODE_VALIDATOR_PASSWORD` environment variable. `read` asks for the password without showing it, and `-e` passes the variable to the container.

::: danger Password Is Visible to Docker Users
The password stays in the container environment, so `docker inspect validator` shows it to anyone with access to Docker on the host.
:::

```bash
read -rsp 'Key password: ' F1R3NODE_VALIDATOR_PASSWORD; echo
export F1R3NODE_VALIDATOR_PASSWORD

docker run -d --name validator --platform linux/amd64 \
  -e F1R3NODE_VALIDATOR_PASSWORD \
  -v validator-data:/var/lib/rnode \
  -p 40400:40400 -p 40404:40404 -p 127.0.0.1:40403:40403 \
  "$NODE_IMAGE" run --network-id "$NETWORK_ID" --shard-name "$SHARD_NAME" \
  --host "$PUBLIC_HOST" --bootstrap "$BOOTSTRAP_URI" \
  --validator-public-key "$VALIDATOR_PUBLIC_KEY" \
  --validator-private-key-path /var/lib/rnode/f1r3fly.key \
  --native-token-name ASI --native-token-symbol ASI --native-token-decimals 18
```

The node also accepts the hex key itself in the hidden option `--validator-private-key`, but then the key is visible in `docker inspect` and in the process list, so use the PEM file. The node does not check at start that the public key belongs to the private key, so both must come from the same key pair. For the errors when the node cannot read the key, see [Troubleshooting](/help/troubleshooting/#image-pull-or-startup-fails).

Joining an existing shard does not use `--genesis-validator` or `--ceremony-master-mode`, so leave them out. A development `bonds.txt` does not enroll a validator in an existing shard. Add other flags only when you need them.

- On a private network add `--allow-private-addresses`.
- When the ports are forwarded by hand, add `--no-upnp`.
- Do not pass `--profile`. The image entrypoint adds `--profile=docker`, and the node exits with an error if you pass it as well.
- The node reads `/var/lib/rnode/f1r3fly.conf` without any flag, and `run --config-file <path>` points to another file. Options are applied in this order: command line, configuration file, built-in defaults ([defaults.conf](https://github.com/asi-alliance/asi-chain-rust-node/blob/dev/node/src/main/resources/defaults.conf)).
- The `--epoch-length` and `--quarantine-length` flags are read only by the node that creates the genesis. A joining node takes both values from the chain.

Peers must reach TCP `40400` and `40404`, and the command above publishes them. It binds the HTTP port `40403` to the local machine only. Keep internal gRPC `40402`, admin HTTP `40405` and `/metrics` closed. See the [port table](/nodes/image/#default-container-ports). The `api-server.host` setting applies to every API listener, so enforce boundaries with host port bindings, firewall rules and gateway routes. If a port on the left side of a `-p` pair is already taken on this machine, change that number and use the new one in the commands below. The [node option definitions](https://github.com/asi-alliance/asi-chain-rust-node/blob/dev/node/src/rust/configuration/commandline/options.rs) list every flag.

`docker restart validator` keeps the password, because the container stores it. A new container made with `docker run` needs the variable again, so run the `read` line first.

### Check Synchronization

```bash
curl -s -w ' HTTP %{http_code}\n' http://127.0.0.1:40403/api/ready
curl -s http://127.0.0.1:40403/api/status
```

The node is synchronized when `/api/status` shows `isReady: true`, a positive `peers` count and a growing `lastFinalizedBlockNumber`. The `isValidator` field only says that a validator key is configured. It does not say that the node is bonded, and a ready HTTP endpoint alone does not mean that the node takes part in consensus. Before the bond, look only at these three values. If the node does not start or does not find peers, see [Troubleshooting](/help/troubleshooting/). Do not run live transfers as an installation test.

### Fund the Validator

The vault of the new validator must cover the stake and the execution budget of the bond transaction: `stake + phlo_limit * phlo_price`. In this client `bond-validator` uses a phlo limit of 5,000,000,000 and a price of 1 by default. Ask for the stake plus 5,000,000,000 atomic units, which is 0.000000005 ASI at 18 decimals. The shard may require other prices, so confirm them with the operator.

Send the address from `echo "$VALIDATOR_ADDRESS"` to the operator and ask them to fund it. A normal transfer does not require changing genesis wallets or restarting the network. On your own shard you make the transfer yourself, see [Fund the New Validator](/nodes/private-shard/#fund-the-new-validator).

Check the balance on the observer and repeat the command until it shows the amount. The output has the form `Balance for <address>: <atomic units>`.

```bash
client wallet-balance --address "$VALIDATOR_ADDRESS" --http "$OBSERVER_HTTP"
```

### Submit the Bond

Send the bond to an already bonded validator, because a node that cannot propose accepts a deploy and never includes it. Do not send it to the joining node itself or to the bootstrap or ceremony-master node. Status and result queries go to the observer. The stake must be at least the shard's minimum, and bonding the same key twice fails with `already bonded`.

`--max-wait 300` is the number of seconds that the client waits for the deploy to finalize. Activation comes later, at an epoch boundary.

```bash
client bond-validator --stake "$STAKE_ATOMIC_UNITS" \
  --private-key-file /keys/private_key.hex \
  --grpc "$BONDED_VALIDATOR_GRPC" --http "$BONDED_VALIDATOR_HTTP" \
  --observer "$OBSERVER_HTTP" --shard-id "$SHARD_NAME" --max-wait 300
```

The command prints `Deploy ID`, `Block hash` and `Total time`, and ends with `Bonding complete`. Write down the deploy ID, which is the deploy signature.

::: danger Do Not Repeat the Bond
A timeout can leave the outcome of the transaction unknown, and the verdict for a deploy appears only after its block finalizes, so do not repeat the bond. Check the deploy instead.
:::

Replace the value in angle brackets with the deploy ID from the output of `bond-validator`.

```bash
DEPLOY_ID='<deploy ID>'
client deploy-status --sig "$DEPLOY_ID" --http "$OBSERVER_HTTP"
curl -s "$OBSERVER_HTTP/api/deploy/$DEPLOY_ID"
```

An underfunded vault does not reject the deploy. The deploy lands in a block and fails there with `Deploy payment failed: Insufficient funds`, and the client may not show that message. In that case fund the vault with the missing amount and bond again only after `deploy-status` shows that the first deploy failed. Do not treat a read error as proof that the validator is unbonded.

The client's [validator lifecycle guide](https://github.com/asi-alliance/asi-chain-client/blob/rust-dev/docs/guides/bonding-a-validator.md) explains bonding, activation, withdrawal and troubleshooting. Its example topology and ports are test fixtures, not the connection data of your network.

### Wait for Activation

A bond and a withdrawal take effect only at an epoch boundary. Between boundaries a new bond is recorded but not active, so `validator-status` shows `BONDED` and `NOT ACTIVE` until the boundary, and `BONDED` and `ACTIVE` after it. The client reads the epoch from the gRPC port of the observer:

```bash
client epoch-info --grpc "$OBSERVER_GRPC"
client validator-status --public-key "$VALIDATOR_PUBLIC_KEY" --http "$OBSERVER_HTTP"
client bonds --http "$OBSERVER_HTTP"
client active-validators --http "$OBSERVER_HTTP"
```

`bonds` lists the bonded validators. `epoch-info` reads the epoch length and the quarantine length from the chain and shows them in blocks, together with the current block, the epoch and the progress through the epoch. In a shard with default settings the epoch is 10,000 blocks long and the quarantine is 50,000 blocks. A withdrawal also takes effect at a boundary, and the stake is paid out after the quarantine period.

To estimate the wait, read the epoch twice, a minute apart. The difference of `lastFinalizedBlockNumber` is the number of blocks per minute, and `blocksUntilNextEpoch` divided by it is the wait in minutes.

```bash
curl -s "$OBSERVER_HTTP/api/epoch"; sleep 60; curl -s "$OBSERVER_HTTP/api/epoch"
```

The HTTP port of the node serves these endpoints.

- `GET /api/bond-status/{public key}` returns `{"publicKey": "...", "isBonded": true}` as soon as the bond is in a finalized block, before the validator becomes active.
- `GET /api/validators` lists the bonded validators and their stakes. A read-only node answers it, and a validator replies with `readonly_node_required`, so send it to the observer.
- `GET /api/epoch` shows `blocksUntilNextEpoch`. Do not take `quarantineLength` from it, because the node reports its own local setting there, which on a joined node can differ from the chain. Use `client epoch-info` for the epoch length and the quarantine.

Bonded membership and active membership are separate. Activation follows the shard's epoch and active-set rules, and a full active set can prevent it. After `validator-status` shows `ACTIVE`, confirm that the node authors blocks, that its authored blocks finalize, and that the network continues finalizing. The `blocks` command prints recent blocks from the observer as JSON, including `blockInfo.sender`, `blockHash` and `isFinalized`. Look for your public key in `sender`.

```bash
client blocks --number 20 --http "$OBSERVER_HTTP"
```

If the status stays `NOT ACTIVE` after a boundary, see [Bond Does Not Activate](/help/troubleshooting/#bond-does-not-activate).

</Steps>

## Next Steps

<CardGrid columns="2">
<DocCard title="Node Image" href="/nodes/image/">Image selection, ports and configuration flags</DocCard>
<DocCard title="Set Up a Private Shard" href="/nodes/private-shard/">Start a shard with its own genesis, validators and network configuration</DocCard>
<DocCard title="Troubleshooting" href="/help/troubleshooting/">What to check when the node does not start or does not find peers</DocCard>
</CardGrid>
