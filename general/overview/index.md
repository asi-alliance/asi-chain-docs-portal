# General Overview

ASI:Chain is a blockchain for Rholang contracts and applications of the ASI ecosystem. The node described in this portal is written in Rust and lives in [github.com/asi-alliance/asi-chain-rust-node](https://github.com/asi-alliance/asi-chain-rust-node). It uses CBC Casper consensus and keeps state in RSpace++. The public DevNet still runs a Scala node, as described under [Networks](#networks).

## Components

| Component | What it does | Guide |
|---|---|---|
| Node | Consensus, Rholang execution, state and the HTTP and gRPC APIs | [Node image](/shard-nodes/validator-image/) |
| Wallet | Web app for accounts, transfers and deploys | [Wallet](/wallet/usage/) |
| Wallet SDK | TypeScript package `@asichain/asi-wallet-sdk` for building your own wallet or tool | [Wallet SDK](/wallet-sdk/overview/) |
| Wallet CLI | Command-line wallet | [Wallet CLI](/cli/usage/) |
| Indexer | Reads blocks from a node and stores them in PostgreSQL | [Architecture](/architecture/) |
| Explorer | Web app for blocks, transactions and validators, fed by the indexer through GraphQL | [Explorer](/explorer/usage/) |
| Faucet | Web app that sends test tokens | [Faucet](/faucet/usage/) |

[Architecture](/architecture/) shows how these parts exchange data. [Container images](/general/container-images/) lists the published images, and [Useful Links](/general/useful-links/) lists applications and source repositories.

## Networks

DevNet is the public development network at `dev.asichain.io`. Its tokens have no real value. The DevNet addresses are on [Network Endpoints](/general/endpoints/). The public DevNet currently runs a Scala node, while the node guides in this portal describe the Rust node.

A network is made of nodes with different roles. A bootstrap node is the entry point for new peers. A validator proposes and validates blocks. An observer follows the chain and answers read requests without taking part in consensus. [Shard and Node Roles](/shard-nodes/devnet-structure/) describes them in more detail.

## Token

The native token is ASI. It has 8 decimal places, so 1 ASI is `100000000` in the smallest unit, and the Wallet CLI takes amounts in that unit. Account addresses are Base58 strings that start with `1111`.

## Before you start

If you only want to try the network, get tokens from the [faucet](/quick-start/get-asi/) and open the [wallet](/wallet/usage/). Known limits of these pages are listed on [Documentation Status](/general/documentation-status/).
