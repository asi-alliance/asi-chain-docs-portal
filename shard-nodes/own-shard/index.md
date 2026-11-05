# Set Up a Private Shard

A private shard needs its own genesis, validator identities, bonds, token metadata, storage and network configuration. It does not join an existing network by reusing that network's bootstrap identity.

Use the maintained [Rust source at the selected revision](https://github.com/asi-alliance/asi-chain-rust-node/tree/8e6517d630e22c24004b7feb2d9685a44d7384d5) and a published digest from the [validator image](/shard-nodes/validator-image/#select-the-image) page. The upstream [Docker guide](https://github.com/asi-alliance/asi-chain-rust-node/blob/8e6517d630e22c24004b7feb2d9685a44d7384d5/docker/README.md) and [shard topology](https://github.com/asi-alliance/asi-chain-rust-node/blob/8e6517d630e22c24004b7feb2d9685a44d7384d5/docker/shard.yml) are development references. Review image and build settings. Sample keys and public host mappings must not become production settings.

## Required Decisions

| Input | Define before initialization |
|---|---|
| Node and client pair | Exact revisions, digests and API compatibility |
| Network ID | `--network-id`, default `testnet`. Every node of the shard must use the same value, and nodes drop messages from other IDs. |
| Shard name | `--shard-name`, default `root`. It is reported as `shardId` in `/api/status`. |
| Genesis | Allocations (`wallets.txt`), bonds (`bonds.txt`) and ceremony participants |
| Native token | Name, symbol and decimals. The node defaults are `F1R3CAP`, `F1R3` and 8 decimals, and the allowed range is 0 to 18. These values cannot change after genesis. |
| Consensus | Bonded stake, validator admission and safety assumptions |
| Networking | Bootstrap identity, `--host`, private management access and approved API routes |
| Persistence | Ownership, backups, recovery and retention |
| Consumers | Indexer migrations, PostgreSQL, Hasura metadata/permissions and application endpoints |

The ASI wallet and SDK use eight decimals, which is also the node default, so the decimals flag only needs to be set when you want a different value. Set the token name and symbol deliberately, because the defaults carry the upstream names, not ASI ones.

A sample topology's count is not a universal minimum or a fault-tolerance guarantee. Validate the actual bonded set and stake assumptions. Fixed block times and safety thresholds cannot be copied from older examples without review.

## Single-Node Shard

A single node can create its own genesis with `--standalone`. It is enough to check the setup before you plan several validators. Prepare a directory named `genesis` with the two genesis files, and have a fresh validator key ready:

- `bonds.txt` has one line per bonded validator, `<public-key> <stake>`. The public key is the uncompressed secp256k1 key of the validator, 130 hex characters starting with `04`.
- `wallets.txt` has one line per funded vault, `<vault-address>,<balance>`, with the balance in the smallest unit (10^-8 of a token).
- The key pair and the vault address come from the ASI client, as in [Prepare and Enroll a Rust Validator](/quick-start/validator-enrollment/). `generate-key-pair --save` writes `private_key.hex`, the value for `VALIDATOR_PRIVATE_KEY`, and `public_key.hex`, the public key for `bonds.txt`. `generate-vault-address` prints the vault address for `wallets.txt`.

```bash
NODE_IMAGE=<image from the catalog>
docker volume create shard-data
docker run --rm --platform linux/amd64 -u root --entrypoint sh \
  -v shard-data:/var/lib/rnode "$NODE_IMAGE" -c 'chown daemon:daemon /var/lib/rnode'

docker run -d --name my-shard --platform linux/amd64 \
  -v shard-data:/var/lib/rnode \
  -v "$PWD/genesis:/var/lib/rnode/genesis:ro" \
  -p 40403:40403 \
  "$NODE_IMAGE" run --standalone \
  --network-id my-shard-net --shard-name my-shard \
  --host localhost --no-upnp --allow-private-addresses \
  --validator-private-key "$VALIDATOR_PRIVATE_KEY"
```

The `chown` is required because a new Docker volume is owned by `root` and the node runs as `daemon`. `--host localhost` is accepted only together with `--allow-private-addresses`. A hex key on the command line is visible to everyone who can run `docker inspect` on the host, so use this form only for a throwaway shard and never put a production key on a command line.

About 15 seconds after the container starts, `curl -s http://localhost:40403/api/status` reports the values you chose:

```text
"networkId":"my-shard-net","shardId":"my-shard","nativeTokenDecimals":8,"isValidator":true,"isReady":true,"lastFinalizedBlockNumber":1
```

For several validators, follow the upstream shard topology above.

Use fresh private credentials. Do not reuse published development keys or older deployment helpers. See [validator image](/shard-nodes/validator-image/) for paths, ports and flags, and [architecture](/architecture/) for consumer data paths.
