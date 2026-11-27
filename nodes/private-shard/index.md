# Set Up a Private Shard

Start a shard of your own with one validator and a read-only node, then add a second validator. A private shard needs its own genesis, validator identities, bonds, token metadata, storage and network configuration. It does not reuse the bootstrap identity of an existing network.

::: info Terminal
The commands are written for bash. On Linux run them in a terminal. On macOS run `bash` in a terminal first, because commands with `read -rsp` do not work in zsh. On Windows run them in a WSL terminal such as Ubuntu with the WSL integration of Docker Desktop turned on, and keep key files in the Linux home directory, not under `/mnt/c`, because the client refuses a key file that other users can read.
:::

Use the maintained [Rust source](https://github.com/asi-alliance/asi-chain-rust-node/tree/dev) and the published digest from the [node image](/nodes/image/#select-the-image) page.

## Required Decisions

| Input | Define Before Initialization |
|---|---|
| Node and client pair | Exact revisions, digests and API compatibility |
| Network ID | `--network-id`, default `testnet`. Every node of the shard must use the same value, and a node with another ID gets no peers, because its connections close with `Wrong network id`. |
| Shard name | `--shard-name`, default `root`. It is reported as `shardId` in `/api/status`. |
| Genesis | Allocations (`wallets.txt`), bonds (`bonds.txt`) and ceremony participants |
| Native token | For ASI, explicitly set name `ASI`, symbol `ASI` and 18 decimals. These values cannot change after genesis. |
| Consensus | Bonded stake, validator admission and safety assumptions |
| Networking | Bootstrap identity, `--host`, private management access and approved API routes |
| Persistence | Ownership, backups, recovery and retention |
| Consumers | Indexer migrations, PostgreSQL, Hasura metadata/permissions and application endpoints |

Set `--native-token-name ASI --native-token-symbol ASI --native-token-decimals 18` on every node of an ASI shard. See [Token Amounts](/reference/token-amounts/). The client and Wallet CLI images from the [catalog](/reference/container-images/) work with this node image.

The number of nodes in a sample topology is not a minimum and does not guarantee fault tolerance. Check the bonded set and stake assumptions of your own shard. Review block times and safety thresholds before you copy them from examples.

## Start the Shard

<Steps>

### Create the Genesis Key

The genesis validator needs a key pair and the genesis wallet needs a [vault address](/reference/glossary/#vault-address). Both come from the ASI client, and one key serves both roles, which is enough for a test shard. `generate-key-pair --save` writes `private_key.hex` and `public_key.hex` into `$KEY_DIR`. The [public key](/reference/glossary/#public-key) has 130 hex characters and starts with `04`, and the vault address starts with `1111`.

```bash
CLIENT_IMAGE='public.ecr.aws/l2u2v4a8/asi-chain/client@sha256:9efdbf3937bc26d2fa0d461b953df5320fc733d138d8e7f2c916ebcae0bcc45c'
KEY_DIR="$HOME/shard-keys"
client() {
  docker run --rm --platform linux/amd64 --read-only --cap-drop ALL \
    --security-opt no-new-privileges --user "$(id -u):$(id -g)" \
    --mount "type=bind,src=$KEY_DIR,dst=/keys,readonly" \
    "$CLIENT_IMAGE" "$@"
}

mkdir -m 700 "$KEY_DIR"
docker run --rm --platform linux/amd64 --network none --read-only --cap-drop ALL \
  --security-opt no-new-privileges --user "$(id -u):$(id -g)" \
  --mount "type=bind,src=$KEY_DIR,dst=/keys" \
  "$CLIENT_IMAGE" generate-key-pair --save --output-dir /keys
client generate-vault-address --private-key-file /keys/private_key.hex
```

![Terminal output of generate-key-pair and generate-vault-address with the saved key files, a public key that starts with 04 and a vault address that starts with 1111.](/images/nodes/shard-genesis-key.webp){.console width=680 height=275}

::: danger Protect the Private Key
`private_key.hex` is the signing key of the genesis validator and controls the genesis funds. Keep it in the directory with mode 700, and never paste its content into a command, a document or Git.
:::

### Write the Genesis Files

Create the two genesis files in a directory named `genesis`. The genesis wallet later funds the second validator, so its balance is large.

- `bonds.txt` has one line per [bonded validator](/reference/glossary/#bonded-validator), `<public-key> <stake>`. The stake here is 1000000.
- `wallets.txt` has one line per funded vault, `<vault-address>,<balance>`. The balance is in [atomic units](/reference/token-amounts/), and 10^24 is 1,000,000 ASI.

```bash
mkdir genesis
echo "$(cat "$KEY_DIR/public_key.hex") 1000000" > genesis/bonds.txt
echo "$(client generate-vault-address --private-key-file /keys/private_key.hex \
  | sed -n 's/^ *Vault address: //p'),1000000000000000000000000" > genesis/wallets.txt
cat genesis/bonds.txt genesis/wallets.txt
```

![Terminal output of the block. cat prints the bonds.txt line with the public key and the stake 1000000, then the wallets.txt line with the vault address and the balance.](/images/nodes/shard-genesis-files.webp){.console width=680 height=215}

### Start a Single-Node Shard

A single node creates its own genesis with `--standalone`. Run the block from the folder that contains the `genesis` directory.

```bash
NODE_IMAGE='public.ecr.aws/l2u2v4a8/asi-chain/node-rust@sha256:a0e619e48a88418d0d5caf12123a97d9c6a096dbfc45db60616f0276f700fb5f'
VALIDATOR_PRIVATE_KEY="$(tr -d '\n' < "$KEY_DIR/private_key.hex")"
docker network create shard-net
docker volume create shard-data
docker run --rm --platform linux/amd64 -u root --entrypoint sh \
  -v shard-data:/var/lib/rnode "$NODE_IMAGE" -c 'chown daemon:daemon /var/lib/rnode'

docker run -d --name my-shard --network shard-net --platform linux/amd64 \
  -v shard-data:/var/lib/rnode \
  -v "$PWD/genesis:/var/lib/rnode/genesis:ro" \
  -p 40403:40403 \
  "$NODE_IMAGE" run --standalone \
  --network-id my-shard-net --shard-name my-shard \
  --host my-shard --no-upnp --allow-private-addresses \
  --native-token-name ASI --native-token-symbol ASI --native-token-decimals 18 \
  --epoch-length 20 --quarantine-length 20 \
  --validator-private-key "$VALIDATOR_PRIVATE_KEY"
```

- `chown` gives the node, which runs as `daemon`, access to the new volume.
- `--host` names the node inside `shard-net`. The name resolves to a private address, so the node needs `--allow-private-addresses`.
- `--epoch-length 20 --quarantine-length 20` shorten [epochs](/reference/glossary/#epoch) from the default 10,000 blocks, so a validator added later becomes active within minutes. Only this node reads them.
- `--validator-private-key` shows the key to anyone who can run `docker inspect`, so use it only for a throwaway shard. The box after the steps keeps the key off the command line.

### Check the Shard

Half a minute after the container starts, the node reports the values you chose. `address` is the bootstrap address of the shard, and the next steps read it from here.

```bash
curl -s http://localhost:40403/api/status \
  | jq '{address, networkId, shardId, nativeTokenDecimals, isReady}'
```

![Terminal output of curl and jq with the status of the single-node shard. It shows the node address, networkId my-shard-net, shardId my-shard, 18 decimals and isReady true.](/images/nodes/shard-status.webp){.console width=680 height=255}

### Start a Read-Only Node

Balance queries run as exploratory deploys, and a validator refuses them with `HTTP 400 (readonly_node_required)`. Wallets, the SDK and the Wallet CLI read balances from a read-only node, so start one next to the validator. It is the [observer](/nodes/observer/) of this shard and connects through the `address` of the validator.

```bash
BOOTSTRAP="$(curl -s http://localhost:40403/api/status | jq -r .address)"
docker volume create shard-obs-data
docker run --rm --platform linux/amd64 -u root --entrypoint sh \
  -v shard-obs-data:/var/lib/rnode "$NODE_IMAGE" -c 'chown daemon:daemon /var/lib/rnode'

docker run -d --name my-shard-obs --network shard-net --platform linux/amd64 \
  -v shard-obs-data:/var/lib/rnode \
  -p 40453:40403 \
  "$NODE_IMAGE" run \
  --network-id my-shard-net --shard-name my-shard \
  --host my-shard-obs --no-upnp --allow-private-addresses \
  --native-token-name ASI --native-token-symbol ASI --native-token-decimals 18 \
  --bootstrap "$BOOTSTRAP"
```

Half a minute after the container starts, the command below will report `"isReadOnly": true`, `"peers": 1` and the finalized block height of the validator. If `peers` stays at 0, see [No Peer Connection](/help/troubleshooting/#no-peer-connection).

```bash
curl -s http://localhost:40453/api/status \
  | jq '{isReadOnly, peers, lastFinalizedBlockNumber}'
```

![Terminal output of curl and jq with the status of the read-only node. It shows isReadOnly true, 1 peer and the last finalized block.](/images/nodes/shard-readonly-status.webp){.console width=680 height=195}

### Add a Validator

A second validator joins the running shard and becomes active at an epoch boundary. The next steps are those of [Run a Validator](/nodes/validator/) with the values of this shard. Run them in one terminal, and in a new terminal run the block below again.

```bash
NODE_IMAGE='public.ecr.aws/l2u2v4a8/asi-chain/node-rust@sha256:a0e619e48a88418d0d5caf12123a97d9c6a096dbfc45db60616f0276f700fb5f'
CLIENT_IMAGE='public.ecr.aws/l2u2v4a8/asi-chain/client@sha256:9efdbf3937bc26d2fa0d461b953df5320fc733d138d8e7f2c916ebcae0bcc45c'
KEY_DIR="$HOME/validator-keys"
BOOTSTRAP="$(curl -s http://localhost:40403/api/status | jq -r .address)"

client() {
  docker run --rm --platform linux/amd64 --network shard-net --read-only \
    --cap-drop ALL --security-opt no-new-privileges --user "$(id -u):$(id -g)" \
    --mount "type=bind,src=$KEY_DIR,dst=/keys,readonly" \
    "$CLIENT_IMAGE" "$@"
}
```

`client` runs in `shard-net`, where the validator answers as `my-shard` and the read-only node as `my-shard-obs`.

### Create the Validator Key

Create the key directory of the new validator and generate its key pair. The directory must not exist yet. The second block saves the [public key](/reference/glossary/#public-key) and the [vault address](/reference/glossary/#vault-address) and prints the address, which starts with `1111`.

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

![Terminal output of the two blocks. generate-key-pair saves private_key.hex and public_key.hex in /keys, and echo prints a vault address that starts with 1111.](/images/nodes/shard-validator-key.webp){.console width=680 height=295}

### Convert the Key

Convert `private_key.hex` into the encrypted file `f1r3fly.key` that the node reads. `openssl pkcs8` asks for a new password twice, and you type the same password when the node starts. The last line removes the temporary files that hold the plain key.

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

![Terminal output of the conversion. openssl ec prints read EC key and writing EC key, and openssl pkcs8 asks for the password twice without showing it.](/images/nodes/shard-validator-convert.webp){.console width=680 height=295}

### Start the Validator

The first block creates the data volume, gives the node access to it and copies `f1r3fly.key` into it. The second asks for the key password and starts the node in `shard-net`. The node publishes host port `40413`, because the shard uses `40403` and `40453`, and like the other nodes of the shard it needs `--allow-private-addresses` and `--no-upnp`.

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

```bash
read -rsp 'Key password: ' F1R3NODE_VALIDATOR_PASSWORD; echo
export F1R3NODE_VALIDATOR_PASSWORD

docker run -d --name validator --network shard-net --platform linux/amd64 \
  -e F1R3NODE_VALIDATOR_PASSWORD \
  -v validator-data:/var/lib/rnode \
  -p 127.0.0.1:40413:40403 \
  "$NODE_IMAGE" run --network-id my-shard-net --shard-name my-shard \
  --host validator --bootstrap "$BOOTSTRAP" \
  --allow-private-addresses --no-upnp \
  --validator-public-key "$VALIDATOR_PUBLIC_KEY" \
  --validator-private-key-path /var/lib/rnode/f1r3fly.key \
  --native-token-name ASI --native-token-symbol ASI --native-token-decimals 18
```

### Check the Validator

Ask the new validator for its state and repeat until it is synchronized. `/api/ready` answers `{"ready":true} HTTP 200`, and `/api/status` of a synchronized node shows:

- `"isReady": true`
- a `"peers"` value above 0
- a `"lastFinalizedBlockNumber"` that grows from one run to the next

```bash
curl -s -w ' HTTP %{http_code}\n' http://127.0.0.1:40413/api/ready
curl -s http://127.0.0.1:40413/api/status \
  | jq '{isReady, peers, lastFinalizedBlockNumber}'
```

![Terminal output of the two checks on port 40413. The ready route answers HTTP 200, and jq prints isReady true, the number of peers and the last finalized block.](/images/nodes/shard-validator-checks.webp){.console width=680 height=235}

### Fund the New Validator

The new validator needs funds for the stake and for the cost of the bond transaction. Send them from the genesis wallet. `client` reads the key from `$KEY_DIR`, so the block points it at the genesis key for the transfer and then back at the key of the new validator.

```bash
KEY_DIR="$HOME/shard-keys"
client transfer --to-address "$VALIDATOR_ADDRESS" --amount 1000000000000 \
  --private-key-file /keys/private_key.hex \
  --grpc http://my-shard:40401 --http http://my-shard:40403 \
  --observer http://my-shard-obs:40403 --shard-id my-shard --max-wait 300
KEY_DIR="$HOME/validator-keys"
client wallet-balance --address "$VALIDATOR_ADDRESS" --http http://my-shard-obs:40403
```

![Terminal output of the block. The transfer from the genesis wallet prints its deploy ID and block hash and ends with Transfer complete, and wallet-balance shows 1000000000000 for the new validator.](/images/nodes/shard-fund.webp){.console width=680 height=495}

The balance shows `1000000000000`.

### Submit the Bond

Send the bond to the first validator, `my-shard`. Status and result queries go to the read-only node. The command prints `Deploy ID`, `Block hash` and `Total time`, and ends with `Bonding complete`.

```bash
client bond-validator --stake 1000000 \
  --private-key-file /keys/private_key.hex \
  --grpc http://my-shard:40401 --http http://my-shard:40403 \
  --observer http://my-shard-obs:40403 --shard-id my-shard \
  --phlo-price 1 --max-wait 300
```

![Terminal output of bond-validator with the stake, the phlo limit, the deploy ID, the block hash, the total time and Bonding complete.](/images/nodes/shard-validator-bond.webp){.console width=680 height=295}

Replace the value in single quotes with the deploy ID and check the deploy. The bond is in the chain when `deploy-status` shows `State: Finalized` and `Rejection count: 0`.

```bash
DEPLOY_ID='<deploy ID>'
client deploy-status --sig "$DEPLOY_ID" --http http://my-shard-obs:40403
```

![Terminal output of deploy-status for the bond with State Finalized and Rejection count 0.](/images/nodes/shard-validator-deploy-status.webp){.console width=680 height=275}

### Wait for Activation

The bond takes effect at the next epoch boundary, which comes no later than 20 blocks after the bond because of the epoch flags of the first node. Until then `validator-status` shows `BONDED` and `NOT ACTIVE`. Repeat the command until it shows `ACTIVE: participating in consensus` and `PROPOSING: blocks at …`. If the status stays `NOT ACTIVE` after the boundary, see [Bond Does Not Activate](/help/troubleshooting/#bond-does-not-activate).

```bash
client validator-status --public-key "$VALIDATOR_PUBLIC_KEY" \
  --http http://my-shard-obs:40403
```

![Terminal output of validator-status after the epoch boundary with the lines BONDED, ACTIVE: participating in consensus and PROPOSING.](/images/nodes/shard-validator-active.webp){.console width=680 height=315}

</Steps>

For more validators, repeat Add a Validator with new container names, or see the compose layout in the upstream [shard topology](https://github.com/asi-alliance/asi-chain-rust-node/blob/dev/docker/shard.yml). Set the native-token flags of every node to `ASI`, `ASI` and `18`.

::: details Keep the Genesis Validator Key Off the Command Line
Start a Single-Node Shard passes the hex key with `--validator-private-key`, and `docker inspect` shows it. To avoid that, create an encrypted key with `keygen` before the first start and let the node read it from the volume. The `keygen` command asks twice for a password, so run it in a terminal. It writes `f1r3fly.key`, `f1r3fly.pub.pem` and `f1r3fly.pub.hex` into the volume. The public key in `f1r3fly.pub.hex` is upper-case hex, and `bonds.txt` accepts it as it is.

Run the block of [Start a Single-Node Shard](#start-a-single-node-shard) up to and including its `chown` command, then this block, and then the `docker run -d` command of that block. This block replaces the `bonds.txt` file of the previous step.

```bash
docker run --rm -it --platform linux/amd64 \
  -v shard-data:/var/lib/rnode "$NODE_IMAGE" keygen /var/lib/rnode
GENESIS_PUBLIC_KEY="$(docker run --rm --platform linux/amd64 --entrypoint cat \
  -v shard-data:/var/lib/rnode "$NODE_IMAGE" /var/lib/rnode/f1r3fly.pub.hex)"
echo "$GENESIS_PUBLIC_KEY 1000000" > genesis/bonds.txt
read -rsp 'Key password: ' F1R3NODE_VALIDATOR_PASSWORD; echo
export F1R3NODE_VALIDATOR_PASSWORD
```

Then add `-e F1R3NODE_VALIDATOR_PASSWORD` to `docker run`, and pass these options in place of `--validator-private-key "$VALIDATOR_PRIVATE_KEY"`.

```text
--validator-public-key "$GENESIS_PUBLIC_KEY" --validator-private-key-path /var/lib/rnode/f1r3fly.key
```

The password stays in the container environment, so `docker inspect` shows it to anyone with access to Docker on the host.
:::

## Next Steps

<CardGrid columns="2">
<DocCard title="Run an Observer" href="/nodes/observer/">Start a read-only node and manage it</DocCard>
<DocCard title="Run a Validator" href="/nodes/validator/">Create the key, start the node, fund it and submit the bond</DocCard>
<DocCard title="Wallet CLI" href="/cli/usage/">Check balances against the shard's read-only node</DocCard>
</CardGrid>
