# Glossary

Short definitions of the terms on the node pages, with links to the pages that explain them in more detail.

## Active Validator

An active validator is a bonded validator that has joined consensus. A new bond becomes active at an epoch boundary. See [Wait for Activation](/nodes/validator/#wait-for-activation).

## Admin Port

The admin HTTP port `40405` and the `/metrics` path are for the operator only. Do not open them to the public. See [Default Container Ports](/nodes/image/#default-container-ports).

## Atomic Units

Atomic units are the smallest part of the token. 1 ASI is 10^18 atomic units, and node commands take amounts in this unit. See [Token Amounts](/reference/token-amounts/).

## Bond

To bond is to lock an amount of tokens, the stake, so that a validator can join consensus.

## Bonded Validator

A bonded validator has put a stake into the bond set of the shard.

## Bootstrap URI

A bootstrap node is the node that a new node contacts first to find the other peers. The bootstrap URI is its address in the form `rnode://<node-id>@<host>?protocol=40400&discovery=40404`. See [Network Settings](/nodes/image/#network-settings).

## Deploy

A deploy is a signed program that you send to the chain. It runs in a block and may change the state.

## Epoch

An epoch is a fixed number of blocks. Bonds, withdrawals and payouts take effect only at the boundary between two epochs. See [Bond Does Not Activate](/help/troubleshooting/#bond-does-not-activate).

## Exploratory Deploy

An exploratory deploy runs a program against the current state and returns the result. Nothing is written to the chain.

## Finalized Block

A block is finalized when the shard has agreed that it will not be undone. A deploy in a finalized block is part of the permanent state.

## Gateway

A gateway is a proxy in front of the node that lets outside clients reach only the HTTP paths that you approve. See [Who Reads the Observer](/nodes/observer/#who-reads-the-observer).

## Genesis

Genesis is the first block of a shard. It fixes the starting balances, the first bonds and the token settings. See [Set Up a Private Shard](/nodes/private-shard/).

## Genesis Ceremony

The genesis ceremony is the start of a new shard, when one node builds the genesis block and the other genesis validators approve it. See [Node Startup](/architecture/state-diagrams/startup/).

## gRPC and HTTP API

A node answers requests on two interfaces.

- gRPC on port `40401` (external) and port `40402` (internal) serves tools such as the client.
- HTTP on port `40403` serves `/api/status` and `/api/ready`.

See [Default Container Ports](/nodes/image/#default-container-ports).

## Healthcheck

The healthcheck is the Docker check that calls `/api/ready`. The node is ready (`{"ready":true}`) only after it has a peer and the log shows the Running state. See [API Unavailable](/help/troubleshooting/#api-unavailable).

## Image Digest

A digest is the fixed fingerprint of one image build, `sha256:...`. An image pinned by digest cannot change, unlike a tag. See [Select the Image](/nodes/image/#select-the-image).

## Indexer

The indexer copies blocks from a node into PostgreSQL. Hasura serves that database as GraphQL, and the explorer reads from it. See [Data Flow](/architecture/data-flow/).

## Joining Node

A joining node is a new node that connects to a running shard through its bootstrap node. It first catches up with the chain and is not a validator until it is bonded. See [Shard and Node Roles](/nodes/roles/).

## Native Token

The native token is the coin of the shard. Its name, symbol and number of decimals are set at genesis. For ASI, the node needs these flags:

```text
--native-token-name ASI --native-token-symbol ASI --native-token-decimals 18
```

See [Token Amounts](/reference/token-amounts/).

## Network ID

The network ID is a label of the network, set by the `--network-id` option, with `testnet` by default. A node refuses to join a network whose ID differs from its own.

## Node ID

The node ID identifies a node to its peers. The node derives it from its TLS key, so a new data directory gives a new ID. See [Node Startup](/architecture/state-diagrams/startup/).

## Observer

An observer, or read-only node, follows the chain and answers read requests, but never creates blocks. It has no validator key. See [Run an Observer](/nodes/observer/).

## P2P

P2P is the direct connection between nodes on TCP port `40400`. Peer discovery, on TCP port `40404`, is how a node finds other nodes. See [Default Container Ports](/nodes/image/#default-container-ports).

## Peer

A peer is another node that your node is connected to. The `peers` field of `/api/status` counts them.

## Phlo

Phlo is the unit that a deploy spends to run, like gas. A deploy sets a limit and a price per phlo, and the sender pays `phlo_limit * phlo_price` in tokens.

## Private Key

The private key (`private_key.hex`) signs your actions and proves control of the funds. It must stay secret.

## Propose

To propose is to create the next block from the pending deploys. Only a bonded validator can do it.

## Public Key

The public key is the half of the key pair that identifies the validator.

## Quarantine

The quarantine is a number of blocks during which a withdrawn stake is held before the validator can take it back.

## Running State

The Running state is the normal mode of a node that has finished startup and joined the network. The log shows `Making a transition to Running state`. See [Node Startup](/architecture/state-diagrams/startup/).

## Shard

A shard is one network of nodes that agree on a single chain. Its genesis, token and set of validators belong to that network only. See [Shard and Node Roles](/nodes/roles/).

## Shard Name

The shard name is a label of the shard, `root` by default. The same value appears as `shardId` in `/api/status`, and every node of the shard must use it.

## UPnP

UPnP is the router feature that opens ports by itself, and `--no-upnp` turns it off. The `--host` option sets the public address that peers use to reach your node. See [Run an Observer](/nodes/observer/#before-you-start).

## Validator

A validator is a node that creates blocks and takes part in consensus. It needs a signing key and a bond. See [Run a Validator](/nodes/validator/).

## Vault Address

A vault holds the token balance of a key. The vault address is derived from the public key, begins with `1111` and is the address that you fund.
