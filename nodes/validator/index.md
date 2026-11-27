# Run a Validator

Run a [validator node](/nodes/roles/) on ASI:Chain DevNet, then [bond](/reference/glossary/#bond) it and wait until it joins consensus.

::: info Terminal
The commands are written for bash.

- On Linux run them in a terminal.
- On macOS run `bash` in a terminal first, because commands with `read -rsp` do not work in zsh.
- On Windows run them in a WSL terminal such as Ubuntu with the WSL integration of Docker Desktop turned on.
- On Windows keep key files in the Linux home directory, not under `/mnt/c`, because the client refuses a key file that other users can read.
:::

## Before You Start

You need Docker, OpenSSL 3 and jq, plus:

- A public IP address or DNS name of this machine.
- TCP ports `40400` and `40404` open to the internet.
- ASI for the stake and the fees.
- The values of [Set the Variables](#set-the-variables) from the network operator.
- A machine that meets the [system requirements](#system-requirements).

## System Requirements

One node needs this hardware.

| Resource | Minimum | Recommended |
|---|---|---|
| CPU | 4 cores | 8 cores |
| Memory | 16 GB | 32 GB |
| Disk | 500 GB SSD | 1 TB SSD |

The chain data grows with the traffic of the network, so keep it on a volume that you can extend and leave at least 30% of the volume free.

## Run the Validator

Run all steps in one bash terminal. In a new terminal, run the block of Set the Variables and the second block of Create the Validator Key again. The terminal screenshots come from a [private shard](/nodes/private-shard/), so the network names, amounts and block numbers in them differ from DevNet.

<Steps>

### Set the Variables

Replace the values in angle brackets. The network operator gives all of them except `PUBLIC_HOST`.

- `PUBLIC_HOST` is the public IP address or DNS name of this machine.
- `NETWORK_ID`, `SHARD_NAME` and `BOOTSTRAP_URI` identify the network and its entry node.
- `BONDED_VALIDATOR_GRPC` and `BONDED_VALIDATOR_HTTP` point to a [bonded validator](/reference/glossary/#bonded-validator) that receives the bond.
- `OBSERVER_HTTP` points to an [observer](/reference/glossary/#observer) that answers status and balance queries.
- `PHLO_PRICE` is the minimum [phlo](/reference/glossary/#phlo) price that an observer reports as `minPhloPrice` in `/api/status`.
- `STAKE_ATOMIC_UNITS` is the stake in [atomic units](/reference/token-amounts/).

```bash
NODE_IMAGE='public.ecr.aws/l2u2v4a8/asi-chain/node-rust@sha256:a0e619e48a88418d0d5caf12123a97d9c6a096dbfc45db60616f0276f700fb5f'
CLIENT_IMAGE='public.ecr.aws/l2u2v4a8/asi-chain/client@sha256:9efdbf3937bc26d2fa0d461b953df5320fc733d138d8e7f2c916ebcae0bcc45c'
NETWORK_ID='<network ID>'
SHARD_NAME='<shard name>'
PUBLIC_HOST='<public IP or DNS name of this machine>'
BOOTSTRAP_URI='rnode://<node ID>@<bootstrap host>?protocol=40400&discovery=40404'
BONDED_VALIDATOR_GRPC='<gRPC URL of a bonded validator>'
BONDED_VALIDATOR_HTTP='<HTTP URL of a bonded validator>'
OBSERVER_HTTP='<HTTP URL of an observer>'
PHLO_PRICE='<minimum phlo price>'
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
VALIDATOR_ADDRESS="$(client generate-vault-address \
  --private-key-file /keys/private_key.hex | sed -n 's/^ *Vault address: //p')"
echo "$VALIDATOR_ADDRESS"
```

![Terminal output of the two blocks. generate-key-pair saves private_key.hex and public_key.hex in /keys, and echo prints a vault address that starts with 1111.](/images/nodes/validator-key.webp){.console width=680 height=295}

::: danger Protect the Private Key
`private_key.hex` is the signing key of the validator and holds its funds. Keep it with mode 0600 and save a protected backup. Never put it in a command argument, a container image, a log or Git.
:::

### Convert the Key

Convert `private_key.hex` into the encrypted file `f1r3fly.key` that the node reads. `openssl pkcs8` asks for a new password twice, and you type the same password when the node starts.

```bash
umask 077
printf '%s\n' 'asn1=SEQUENCE:ec_key' '[ec_key]' 'version=INTEGER:1' \
  "privateKey=FORMAT:HEX,OCTETSTRING:$(tr -d '\n' < "$KEY_DIR/private_key.hex")" \
  'parameters=EXPLICIT:0,OID:secp256k1' > "$KEY_DIR/ec.conf"
openssl asn1parse -genconf "$KEY_DIR/ec.conf" -noout -out "$KEY_DIR/key.der"
openssl ec -inform DER -in "$KEY_DIR/key.der" -out "$KEY_DIR/key.pem"
openssl pkcs8 -topk8 -v2 aes-256-cbc -in "$KEY_DIR/key.pem" -out "$KEY_DIR/f1r3fly.key"
rm -f "$KEY_DIR/ec.conf" "$KEY_DIR/key.der" "$KEY_DIR/key.pem"
```

![Terminal output of the conversion. openssl ec prints read EC key and writing EC key, and openssl pkcs8 asks for the password twice without showing it.](/images/nodes/validator-convert.webp){.console width=680 height=295}

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

Ask the node for its state and repeat until it is synchronized. `/api/ready` answers `{"ready":true} HTTP 200`, and `/api/status` of a synchronized node shows:

- `"isReady": true`
- a `"peers"` value above 0
- a `"lastFinalizedBlockNumber"` that grows from one run to the next

```bash
curl -s -w ' HTTP %{http_code}\n' http://127.0.0.1:40403/api/ready
curl -s http://127.0.0.1:40403/api/status \
  | jq '{isReady, peers, lastFinalizedBlockNumber}'
```

![Terminal output of the two checks. The ready route answers HTTP 200, and jq prints isReady true, the number of peers and the last finalized block.](/images/nodes/validator-sync.webp){.console width=680 height=235}

### Fund the Validator

Request ASI from the [faucet](/faucet/usage/) for the address from `echo "$VALIDATOR_ADDRESS"` until the balance covers `STAKE_ATOMIC_UNITS` and the fee of the bond. The fee is at most 10,000,000 phlo times `PHLO_PRICE`.

```bash
client wallet-balance --address "$VALIDATOR_ADDRESS" --http "$OBSERVER_HTTP"
```

![Terminal output of wallet-balance. The line Balance for the validator address ends with the balance in atomic units.](/images/nodes/validator-balance.webp){.console width=680 height=215}

The output has the form `Balance for <address>: <atomic units>`.

### Submit the Bond

Send the bond to a bonded validator of the network, not to your own node. Status and result queries go to the observer. The command prints `Deploy ID`, `Block hash` and `Total time`, and ends with `Bonding complete`. If the command times out, check the [deploy](/reference/glossary/#deploy) before you bond again.

```bash
client bond-validator --stake "$STAKE_ATOMIC_UNITS" \
  --private-key-file /keys/private_key.hex \
  --grpc "$BONDED_VALIDATOR_GRPC" --http "$BONDED_VALIDATOR_HTTP" \
  --observer "$OBSERVER_HTTP" --shard-id "$SHARD_NAME" \
  --phlo-price "$PHLO_PRICE" --max-wait 300
```

![Terminal output of bond-validator with the stake, the phlo limit, the deploy ID, the block hash, the total time and Bonding complete.](/images/nodes/validator-bond.webp){.console width=680 height=295}

Replace the value in single quotes with the deploy ID and check the deploy. The bond is in the chain when `deploy-status` shows `State: Finalized` and `Rejection count: 0`.

```bash
DEPLOY_ID='<deploy ID>'
client deploy-status --sig "$DEPLOY_ID" --http "$OBSERVER_HTTP"
curl -s "$OBSERVER_HTTP/api/deploy/$DEPLOY_ID"
```

![Terminal output of deploy-status for the bond with State Finalized and Rejection count 0.](/images/nodes/validator-deploy-status.webp){.console width=680 height=275}

### Wait for Activation

The bond takes effect at the next [epoch](/reference/glossary/#epoch) boundary. Repeat the command until its output has these lines:

- `BONDED: stake …` shows that the bond is in the chain.
- `ACTIVE: participating in consensus` appears after the epoch boundary. Until then the line reads `NOT ACTIVE`. If it stays so after the boundary, see [Bond Does Not Activate](/help/troubleshooting/#bond-does-not-activate).
- `PROPOSING: blocks at …` appears after the first block of your validator. Until then the line reads `NOT PROPOSING`.

```bash
client validator-status --public-key "$VALIDATOR_PUBLIC_KEY" --http "$OBSERVER_HTTP"
```

![Terminal output of validator-status after the epoch boundary with the lines BONDED, ACTIVE: participating in consensus and PROPOSING.](/images/nodes/validator-status-active.webp){.console width=680 height=295}

</Steps>

## Next Steps

<CardGrid columns="2">
<DocCard title="Troubleshooting" href="/help/troubleshooting/">What to check when the node does not start, find peers or activate</DocCard>
<DocCard title="Node Image" href="/nodes/image/">Image selection, ports and configuration flags</DocCard>
<DocCard title="Token Amounts" href="/reference/token-amounts/">Atomic units and decimals of the token</DocCard>
</CardGrid>

The [validator lifecycle guide](https://github.com/asi-alliance/asi-chain-client/blob/rust-dev/docs/guides/bonding-a-validator.md) of the client covers bonding, activation and withdrawal.
