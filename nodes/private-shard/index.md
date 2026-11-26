# Set Up a Private Shard

Start a shard of your own with one validator and a read-only node, then add a second validator. A private shard needs its own genesis, validator identities, bonds, token metadata, storage and network configuration. It does not reuse the bootstrap identity of an existing network.

::: info Terminal
The commands are written for bash. On Linux and macOS run them in a terminal. On Windows run them in a WSL terminal such as Ubuntu with the WSL integration of Docker Desktop turned on, and keep key files in the Linux home directory, not under `/mnt/c`, because the client refuses a key file that other users can read.
:::

Use the maintained [Rust source](https://github.com/asi-alliance/asi-chain-rust-node/tree/dev) and the published digest from the [node image](/nodes/image/#select-the-image) page.

## Required Decisions

| Input | Define Before Initialization |
|---|---|
| Node and client pair | Exact revisions, digests and API compatibility |
| Network ID | `--network-id`, default `testnet`. Every node of the shard must use the same value, and a node with another ID exits with a `Wrong network id` error. |
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

The genesis validator needs a key pair and the genesis wallet needs a vault address. Both come from the ASI client. This step uses one key for both roles, which is enough for a test shard.

```bash
CLIENT_IMAGE='public.ecr.aws/l2u2v4a8/asi-chain/client@sha256:5b192be72df772f2a0f446245d583f1f916e970b8a6fd6ad97d32b0ab8ef20f4'
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

`generate-key-pair --save` writes `private_key.hex` and `public_key.hex` into `$KEY_DIR`. The public key has 130 hex characters and starts with `04`. The vault address starts with `1111`.

::: danger Protect the Private Key
`private_key.hex` is the signing key of the genesis validator and controls the genesis funds. Keep it in the directory with mode 700, and never paste its content into a command, a document or Git.
:::

Create the two genesis files in a directory named `genesis`.

- `bonds.txt` has one line per bonded validator, `<public-key> <stake>`. The stake here is 1000000.
- `wallets.txt` has one line per funded vault, `<vault-address>,<balance>`, with the balance in atomic units (10^-18 ASI). The balance here is 10^24, which is 1,000,000 ASI. Keep it large, because you later send funds from this wallet to the second validator.

```bash
mkdir genesis
echo "$(cat "$KEY_DIR/public_key.hex") 1000000" > genesis/bonds.txt
echo "$(client generate-vault-address --private-key-file /keys/private_key.hex \
  | sed -n 's/^ *Vault address: //p'),1000000000000000000000000" > genesis/wallets.txt
cat genesis/bonds.txt genesis/wallets.txt
```

Keep the key directory. You need the same key later to send funds from the genesis wallet.

### Start a Single-Node Shard

A single node can create its own genesis with `--standalone`. This is enough to check the setup before you plan several validators. Run the block from the folder that contains the `genesis` directory of the previous step.

```bash
NODE_IMAGE='public.ecr.aws/l2u2v4a8/asi-chain/node-rust@sha256:f46bc3542ae9cab873f3a6e4f40651546bfeba47fb3d1d65966564b18d3123b6'
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

The `chown` command is required because a new Docker volume is owned by `root` and the node runs as `daemon`. `--host` is the name under which other containers on `shard-net` reach the node. It resolves to a private address, so the node also needs `--allow-private-addresses`. The token flags explicitly select ASI with 18 decimals.

`--epoch-length 20 --quarantine-length 20` make epochs short, so that a validator you add later becomes active within minutes. Without them an epoch lasts 10,000 blocks and a withdrawn stake is held for 50,000 blocks. Only the node that creates the genesis reads these flags, and only at its first start. Nodes that join later take the values from the chain. Leave the flags out for a shard that should keep the defaults.

::: danger Throwaway Keys Only
A hex key on the command line is visible to everyone who can run `docker inspect` on the host, so use this form only for a throwaway shard and never put a production key on a command line.
:::

Half a minute after the container starts, `curl -s http://localhost:40403/api/status` will report the values you chose. The line below shows selected fields of the answer. The number in `lastFinalizedBlockNumber` differs on every run and keeps growing.

```text
"networkId":"my-shard-net","shardId":"my-shard","nativeTokenSymbol":"ASI","nativeTokenDecimals":18,"isValidator":true,"isReady":true,"lastFinalizedBlockNumber":2
```

### Start a Read-Only Node

Balance queries run as exploratory deploys, and a validator refuses them with `HTTP 400 (readonly_node_required)`. Wallets, the SDK and the [Wallet CLI](/cli/usage/) read balances from a read-only node, so start one next to the validator. This is the observer that [Run an Observer](/nodes/observer/) describes, here placed in a Docker network on this machine. When the validator reports `"isReady":true`, copy the `address` field from its `/api/status`. It has the form `rnode://<node-id>@my-shard?protocol=40400&discovery=40404`.

Replace each value in angle brackets with the value from your shard.

```bash
BOOTSTRAP='rnode://<node-id>@my-shard?protocol=40400&discovery=40404'
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

Half a minute after the container starts, `curl -s http://localhost:40453/api/status` will report `"isReadOnly":true`, `"peers":1` and the finalized block height of the validator. Give the read-only node the same network ID, shard name and token flags as the validator. A node restarted with other token values stops.

If `peers` stays at 0, see [Troubleshooting](/help/troubleshooting/#no-peer-connection).

### Add a Validator

A second validator joins the running shard and becomes active at an epoch boundary. The steps are those of [Run a Validator](/nodes/validator/), with the values of this shard. First run the block of [Set the Variables](/nodes/validator/#set-the-variables) on that page as it is, without replacing the values in angle brackets. Then run the block below in the same terminal, and its values replace them. `BOOTSTRAP` is the variable from the previous step, so in a new terminal run the `BOOTSTRAP` line of [Start a Read-Only Node](#start-a-read-only-node) again first. The block also defines the `client` function again, this time with `--network shard-net`, because the shard and the read-only node are reachable by their container names only inside that network.

```bash
NETWORK_ID='my-shard-net'
SHARD_NAME='my-shard'
PUBLIC_HOST='validator'
BOOTSTRAP_URI="$BOOTSTRAP"
BONDED_VALIDATOR_GRPC='http://my-shard:40401'
BONDED_VALIDATOR_HTTP='http://my-shard:40403'
OBSERVER_GRPC='http://my-shard-obs:40401'
OBSERVER_HTTP='http://my-shard-obs:40403'
STAKE_ATOMIC_UNITS='1000000'
KEY_DIR="$HOME/validator-keys"

client() {
  docker run --rm --platform linux/amd64 --network shard-net --read-only --cap-drop ALL \
    --security-opt no-new-privileges --user "$(id -u):$(id -g)" \
    --mount "type=bind,src=$KEY_DIR,dst=/keys,readonly" \
    "$CLIENT_IMAGE" "$@"
}
```

`PUBLIC_HOST` is the name of the container that you start for the new validator, so keep the container name `validator`. Then follow the steps of Run a Validator in this order.

1. [Create the Validator Key](/nodes/validator/#create-the-validator-key).
2. [Prepare the Data Volume](/nodes/validator/#prepare-the-data-volume).
3. The block below instead of [Start the Node](/nodes/validator/#start-the-node).
4. The two checks below instead of [Check Synchronization](/nodes/validator/#check-synchronization).
5. [Fund the New Validator](#fund-the-new-validator) on this page.
6. [Submit the Bond](/nodes/validator/#submit-the-bond) and [Wait for Activation](/nodes/validator/#wait-for-activation) on that page.

The block starts the validator in the Docker network of the shard. The container name resolves to a private address, so the node needs `--allow-private-addresses`, and there is no router to forward ports, so it needs `--no-upnp`. The shard already publishes host ports `40403` and `40453`, so the new node uses `40413` and publishes neither `40400` nor `40404`. Containers in `shard-net` reach each other without published ports.

```bash
read -rsp 'Key password: ' F1R3NODE_VALIDATOR_PASSWORD; echo
export F1R3NODE_VALIDATOR_PASSWORD

docker run -d --name validator --network shard-net --platform linux/amd64 \
  -e F1R3NODE_VALIDATOR_PASSWORD \
  -v validator-data:/var/lib/rnode \
  -p 127.0.0.1:40413:40403 \
  "$NODE_IMAGE" run --network-id "$NETWORK_ID" --shard-name "$SHARD_NAME" \
  --host "$PUBLIC_HOST" --bootstrap "$BOOTSTRAP_URI" \
  --allow-private-addresses --no-upnp \
  --validator-public-key "$VALIDATOR_PUBLIC_KEY" \
  --validator-private-key-path /var/lib/rnode/f1r3fly.key \
  --native-token-name ASI --native-token-symbol ASI --native-token-decimals 18
```

Container names resolve only inside `shard-net`, so `curl` on the host cannot use the name in `$OBSERVER_HTTP`. It goes to the published ports instead. The read-only node answers on `http://localhost:40453` and the new validator on `http://127.0.0.1:40413`. The `client` commands run inside `shard-net` and use the container names as they are. Wherever Run a Validator calls `curl` with `$OBSERVER_HTTP`, write `http://localhost:40453` in its place.

These two checks replace the ones on Run a Validator. They use port `40413`.

```bash
curl -s -w ' HTTP %{http_code}\n' http://127.0.0.1:40413/api/ready
curl -s http://127.0.0.1:40413/api/status
```

The values to look for are the same as there. When the node is synchronized, fund it in the next step before you submit the bond.

### Fund the New Validator

The new validator needs funds for the stake and for the cost of the bond transaction. Send them from the genesis wallet. The `client` function reads the key from `$KEY_DIR`, so point it at the genesis key for this one command and then back at the validator key. `VALIDATOR_ADDRESS` is the vault address of the new validator from the step that created its key.

```bash
KEY_DIR="$HOME/shard-keys"
client transfer --to-address "$VALIDATOR_ADDRESS" --amount 1000000000000 \
  --private-key-file /keys/private_key.hex \
  --grpc http://my-shard:40401 --http http://my-shard:40403 \
  --observer http://my-shard-obs:40403 --shard-id my-shard --max-wait 300
KEY_DIR="$HOME/validator-keys"
client wallet-balance --address "$VALIDATOR_ADDRESS" --http "$OBSERVER_HTTP"
```

The balance shows `1000000000000`. Go back to [Submit the Bond](/nodes/validator/#submit-the-bond) and finish with [Wait for Activation](/nodes/validator/#wait-for-activation). With the epoch flags from the first node, the validator becomes `ACTIVE` at the nearest epoch boundary, which is no later than 20 blocks after the bond.

</Steps>

For more validators, repeat Add a Validator with new container names, or see the compose layout in the upstream [shard topology](https://github.com/asi-alliance/asi-chain-rust-node/blob/dev/docker/shard.yml). Set the native-token flags of every node to `ASI`, `ASI` and `18`.

::: details Keep the Genesis Validator Key Off the Command Line
Start a Single-Node Shard passes the hex key with `--validator-private-key`, and `docker inspect` shows it. To avoid that, create an encrypted key with `keygen` before the first start and let the node read it from the volume. The `keygen` command asks twice for a password, so run it in a terminal. It writes `f1r3fly.key`, `f1r3fly.pub.pem` and `f1r3fly.pub.hex` into the volume. The public key in `f1r3fly.pub.hex` is upper-case hex, and `bonds.txt` accepts it as it is.

Run the block of [Start a Single-Node Shard](#start-a-single-node-shard) up to and including its `chown` command, then this block, and then the `docker run -d` command of that block. It replaces the `bonds.txt` file of the previous step.

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

::: danger Use Fresh Credentials
Do not reuse published development keys. Generate new credentials for every shard.
:::

## Next Steps

<CardGrid columns="2">
<DocCard title="Run an Observer" href="/nodes/observer/">Start a read-only node and manage it</DocCard>
<DocCard title="Run a Validator" href="/nodes/validator/">Create the key, start the node, fund it and submit the bond</DocCard>
<DocCard title="Wallet CLI" href="/cli/usage/">Check balances against the shard's read-only node</DocCard>
</CardGrid>
