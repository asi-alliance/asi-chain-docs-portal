# Set Up a Private Shard

Start a shard of your own with one validator and a read-only node. A private shard needs its own genesis, validator identities, bonds, token metadata, storage and network configuration. It does not reuse the bootstrap identity of an existing network.

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

### Start a Single-Node Shard

A single node can create its own genesis with `--standalone`. This is enough to check the setup before you plan several validators. Prepare a directory named `genesis` with the two genesis files, and have a fresh validator key ready:

- `bonds.txt` has one line per bonded validator, `<public-key> <stake>`. The public key is the uncompressed secp256k1 key of the validator, 130 hex characters starting with `04`.
- `wallets.txt` has one line per funded vault, `<vault-address>,<balance>`, with the balance in the smallest unit (10^-18 ASI).
- The key pair and the vault address come from the ASI client, as in [Enroll a Validator](/nodes/validator-enrollment/). `generate-key-pair --save` writes `private_key.hex`, the value for `VALIDATOR_PRIVATE_KEY`, and `public_key.hex`, the public key for `bonds.txt`. `generate-vault-address` prints the vault address for `wallets.txt`.

```bash
NODE_IMAGE=<image from the catalog>
VALIDATOR_PRIVATE_KEY="$(tr -d '\n' < validator-keys/private_key.hex)"
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
  --validator-private-key "$VALIDATOR_PRIVATE_KEY"
```

The `chown` is required because a new Docker volume is owned by `root` and the node runs as `daemon`. `--host` is the name under which other containers on `shard-net` reach the node. It resolves to a private address, so the node also needs `--allow-private-addresses`. The token flags explicitly select ASI with 18 decimals.

::: danger Throwaway Keys Only
A hex key on the command line is visible to everyone who can run `docker inspect` on the host, so use this form only for a throwaway shard and never put a production key on a command line.
:::

About 15 seconds after the container starts, `curl -s http://localhost:40403/api/status` reports the values you chose. The line below shows selected fields of the answer, and `lastFinalizedBlockNumber` keeps growing.

```text
"networkId":"my-shard-net","shardId":"my-shard","nativeTokenSymbol":"ASI","nativeTokenDecimals":18,"isValidator":true,"isReady":true,"lastFinalizedBlockNumber":2
```

### Start a Read-Only Node

Balance queries run as exploratory deploys, and a validator refuses them with `HTTP 400 (readonly_node_required)`. Wallets, the SDK and the [Wallet CLI](/cli/usage/) read balances from a read-only node, so start one next to the validator. When the validator reports `"isReady":true`, copy the `address` field from its `/api/status`. It has the form `rnode://<node-id>@my-shard?protocol=40400&discovery=40404`.

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

Within 15 seconds after the container starts, `curl -s http://localhost:40453/api/status` reports `"isReadOnly":true`, `"peers":1` and the finalized block height of the validator. Give the read-only node the same network ID, shard name and token flags as the validator. A node restarted with other token values stops.

If `peers` stays at 0, see [Troubleshooting](/help/troubleshooting/#no-peer-connection).

</Steps>

For several validators, see the compose layout in the upstream [shard topology](https://github.com/asi-alliance/asi-chain-rust-node/blob/dev/docker/shard.yml). Set the native-token flags of every node to `ASI`, `ASI` and `18`.

::: danger Use Fresh Credentials
Use fresh private credentials. Do not reuse published development keys.
:::

## Next Steps

<CardGrid columns="2">
<DocCard title="Node Image" href="/nodes/image/">Paths, ports and flags</DocCard>
<DocCard title="Technical Architecture" href="/architecture/">How the node, indexer, GraphQL and applications connect</DocCard>
<DocCard title="Wallet CLI" href="/cli/usage/">Check balances against the shard's read-only node</DocCard>
</CardGrid>
