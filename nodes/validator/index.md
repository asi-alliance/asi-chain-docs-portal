# Run a Validator

Run a [validator node](/nodes/roles/) on a [shard](/reference/glossary/#shard) that an operator already runs, then [bond](/reference/glossary/#bond) it and wait until it joins consensus. You need Docker and a few values from the shard operator.

::: info Terminal
The commands are written for bash. On Linux run them in a terminal. On macOS run `bash` in a terminal first, because commands with `read -rsp` do not work in zsh. On Windows run them in a WSL terminal such as Ubuntu with the WSL integration of Docker Desktop turned on, and keep key files in the Linux home directory, not under `/mnt/c`, because the client refuses a key file that other users can read.
:::

## Before You Start

You need Docker and OpenSSL 3. Ask the shard operator for:

- The node image and the client image the shard accepts.
- The [bootstrap URI](/reference/glossary/#bootstrap-uri).
- The [network ID](/reference/glossary/#network-id) and the [shard name](/reference/glossary/#shard-name).
- The gRPC and HTTP URLs of a [bonded validator](/reference/glossary/#bonded-validator).
- The gRPC and HTTP URLs of an [observer](/nodes/roles/).
- The stake to bond, in [atomic units](/reference/token-amounts/).

## Run the Validator

Run all steps in one bash terminal. In a new terminal, run the block of Set the Variables and the second block of Create the Validator Key again.

<Steps>

### Set the Variables

Replace each value in single quotes with the operator's value. The images come from the image catalog. Replace them if the operator names others. The bootstrap URI has the form `rnode://<node-id>@<host>?protocol=40400&discovery=40404`. `PUBLIC_HOST` is the public IP or DNS name at which the shard nodes reach this machine, with TCP ports `40400` and `40404` open to them. `STAKE_ATOMIC_UNITS` is an integer (see [Token Amounts](/reference/token-amounts/)).

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

Each `docker pull` prints a `Digest:` line.

### Create the Validator Key

Create the key directory and generate the key pair in it. The directory must not exist yet. If it does, set `KEY_DIR` to another path. The second block saves the [public key](/reference/glossary/#public-key) and the [vault address](/reference/glossary/#vault-address) and prints the address, which starts with `1111`.

```bash
mkdir -m 700 "$KEY_DIR" && \
docker run --rm --platform linux/amd64 --network none --read-only --cap-drop ALL \
  --security-opt no-new-privileges --user "$(id -u):$(id -g)" \
  --mount "type=bind,src=$KEY_DIR,dst=/keys" \
  "$CLIENT_IMAGE" generate-key-pair --save --output-dir /keys
```

```bash
VALIDATOR_PUBLIC_KEY="$(cat "$KEY_DIR/public_key.hex")"
VALIDATOR_ADDRESS="$(client generate-vault-address --private-key-file /keys/private_key.hex \
  | sed -n 's/^ *Vault address: //p')"
echo "$VALIDATOR_ADDRESS"
```

::: danger Protect the Private Key
`private_key.hex` is the signing key of the validator and holds its funds. Keep it with mode 0600 and save a protected backup. Never put it in a command argument, a container image, a log or Git.
:::

### Convert the Key

Convert `private_key.hex` into the encrypted file `f1r3fly.key` that the node reads. `openssl pkcs8` asks for a new password twice, and you type the same password when the node starts.

```bash
umask 077
printf 'asn1=SEQUENCE:ec_key\n[ec_key]\nversion=INTEGER:1\nprivateKey=FORMAT:HEX,OCTETSTRING:%s\nparameters=EXPLICIT:0,OID:secp256k1\n' \
  "$(tr -d '\n' < "$KEY_DIR/private_key.hex")" > "$KEY_DIR/ec.conf"
openssl asn1parse -genconf "$KEY_DIR/ec.conf" -noout -out "$KEY_DIR/key.der"
openssl ec -inform DER -in "$KEY_DIR/key.der" -out "$KEY_DIR/key.pem"
openssl pkcs8 -topk8 -v2 aes-256-cbc -in "$KEY_DIR/key.pem" -out "$KEY_DIR/f1r3fly.key"
rm -f "$KEY_DIR/ec.conf" "$KEY_DIR/key.der" "$KEY_DIR/key.pem"
```

The last line removes the temporary files that hold the plain key. `$KEY_DIR` now holds `f1r3fly.key`.

### Prepare the Data Volume

Create the data volume for the node. The second command gives the node access to the volume, and the third copies `f1r3fly.key` into it.

```bash
docker volume create validator-data
docker run --rm -u root --platform linux/amd64 --entrypoint chown \
  -v validator-data:/var/lib/rnode "$NODE_IMAGE" daemon:daemon /var/lib/rnode
test -f "$KEY_DIR/f1r3fly.key" && \
docker run --rm -u root --platform linux/amd64 --entrypoint install \
  -v validator-data:/var/lib/rnode \
  -v "$KEY_DIR/f1r3fly.key:/tmp/f1r3fly.key:ro" \
  "$NODE_IMAGE" -o daemon -g daemon -m 600 /tmp/f1r3fly.key /var/lib/rnode/f1r3fly.key \
  || echo 'f1r3fly.key is missing, run the OpenSSL commands of Convert the Key again'
```

### Start the Node

Type the key password at the prompt. `read` does not show it, and the node reads it from `F1R3NODE_VALIDATOR_PASSWORD`. The token flags repeat the token settings of the shard. To restart the node later, run `docker restart validator`.

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

::: danger Password Is Visible to Docker Users
Anyone with access to Docker on this machine can read the password with `docker inspect validator`.
:::

### Check Synchronization

Ask the node for its state and repeat until it is synchronized.

```bash
curl -s -w ' HTTP %{http_code}\n' http://127.0.0.1:40403/api/ready
curl -s http://127.0.0.1:40403/api/status
```

`/api/ready` returns `{"ready":true} HTTP 200`. The node is synchronized when `/api/status` shows `"isReady":true`, a `"peers"` value above 0 and a `"lastFinalizedBlockNumber"` that grows from one run to the next.

### Fund the Validator

Send the address from `echo "$VALIDATOR_ADDRESS"` to the operator and ask them to fund it with the stake plus 5000000000 atomic units. Check the balance on the observer and repeat until it reaches this sum.

```bash
client wallet-balance --address "$VALIDATOR_ADDRESS" --http "$OBSERVER_HTTP"
```

The output has the form `Balance for <address>: <atomic units>`.

### Submit the Bond

Send the bond to the operator's bonded validator, not to your own node. Status and result queries go to the observer. The command prints `Deploy ID`, `Block hash` and `Total time`, and ends with `Bonding complete`. If the command times out, check the [deploy](/reference/glossary/#deploy) before you bond again.

```bash
client bond-validator --stake "$STAKE_ATOMIC_UNITS" \
  --private-key-file /keys/private_key.hex \
  --grpc "$BONDED_VALIDATOR_GRPC" --http "$BONDED_VALIDATOR_HTTP" \
  --observer "$OBSERVER_HTTP" --shard-id "$SHARD_NAME" --max-wait 300
```

Replace the value in single quotes with the deploy ID and check the deploy. The bond is in the chain when `deploy-status` shows `State: Finalized` and `Rejection count: 0`.

```bash
DEPLOY_ID='<deploy ID>'
client deploy-status --sig "$DEPLOY_ID" --http "$OBSERVER_HTTP"
curl -s "$OBSERVER_HTTP/api/deploy/$DEPLOY_ID"
```

### Wait for Activation

The bond takes effect at the next [epoch](/reference/glossary/#epoch) boundary. Until then `validator-status` shows `BONDED` and `NOT ACTIVE`. `epoch-info` reads the epoch from the observer's gRPC port and shows its progress. Repeat the commands until the status shows `ACTIVE: participating in consensus`. Then `active-validators` lists your public key.

```bash
client epoch-info --grpc "$OBSERVER_GRPC"
client validator-status --public-key "$VALIDATOR_PUBLIC_KEY" --http "$OBSERVER_HTTP"
client bonds --http "$OBSERVER_HTTP"
client active-validators --http "$OBSERVER_HTTP"
```

Then look for your public key in `blockInfo.sender` of the recent blocks. If the status stays `NOT ACTIVE` after a boundary, see [Bond Does Not Activate](/help/troubleshooting/#bond-does-not-activate).

```bash
client blocks --number 20 --http "$OBSERVER_HTTP"
```

</Steps>

## Next Steps

<CardGrid columns="2">
<DocCard title="Troubleshooting" href="/help/troubleshooting/">What to check when the node does not start, find peers or activate</DocCard>
<DocCard title="Node Image" href="/nodes/image/">Image selection, ports and configuration flags</DocCard>
<DocCard title="Token Amounts" href="/reference/token-amounts/">Atomic units and decimals of the token</DocCard>
</CardGrid>

The [validator lifecycle guide](https://github.com/asi-alliance/asi-chain-client/blob/rust-dev/docs/guides/bonding-a-validator.md) of the client covers bonding, activation and withdrawal.
