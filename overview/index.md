# What Is ASI:Chain

ASI:Chain is a blockchain for Rholang contracts and applications of the ASI ecosystem. You use it through a web wallet, a block explorer and a faucet, and you can run your own node.

## Components

| Component | What it does | Guide |
|---|---|---|
| Node | Consensus, Rholang execution, state and the HTTP and gRPC APIs | [Node image](/nodes/image/) |
| Wallet | Web app for accounts, transfers and deploys | [Wallet](/wallet/usage/) |
| Wallet SDK | TypeScript package `@asichain/asi-wallet-sdk` for building your own wallet or tool | [Wallet SDK](/wallet-sdk/overview/) |
| Wallet CLI | Command-line wallet | [Wallet CLI](/cli/usage/) |
| Indexer | Reads blocks from a node and stores them in PostgreSQL | [Architecture](/architecture/) |
| Explorer | Web app for blocks, transactions and validators, fed by the indexer through GraphQL | [Explorer](/explorer/usage/) |
| Faucet | Web app that sends test tokens | [Faucet](/faucet/usage/) |

[Architecture](/architecture/) shows how these parts exchange data. [Container images](/reference/container-images/) lists the published images, and [Useful Links](/reference/links/) lists applications and source repositories.

## Networks

DevNet is the development network at `dev.asichain.io`. Its tokens have no real value. The DevNet addresses are on [Network Endpoints](/reference/endpoints/). The node guides in this portal describe the Rust node from [github.com/asi-alliance/asi-chain-rust-node](https://github.com/asi-alliance/asi-chain-rust-node). The node uses CBC Casper consensus and keeps state in RSpace++.

A network is made of nodes with different roles. A bootstrap node is the entry point for new peers. A validator proposes and validates blocks. An observer follows the chain and answers read requests without taking part in consensus. [Shard and Node Roles](/nodes/roles/) describes them in more detail.

## Token

The native token is ASI. It has 18 decimal places, so 1 ASI is `1000000000000000000` atomic units, and the Wallet CLI takes amounts in atomic units. See [Token Amounts](/reference/token-amounts/). Account addresses are Base58 strings that start with `1111`.

## Next Steps

<CardGrid columns="2">
<DocCard title="Get DevNet ASI" href="/quick-start/get-asi/">Open the wallet and get tokens from the faucet</DocCard>
<DocCard title="ASI Wallet" href="/wallet/usage/">Create accounts, send tokens and deploy contracts</DocCard>
<DocCard title="Technical Architecture" href="/architecture/">See how the parts exchange data</DocCard>
<DocCard title="Run a Node" href="/nodes/">Take part in the network as an observer or a validator</DocCard>
</CardGrid>
