# Frequently Asked Questions

Answers to common questions about DevNet tokens, wallets, the faucet, the explorer, nodes and the Wallet CLI.

## Getting Started

### What Are DevNet Tokens?

DevNet ASI is a test token for trying out transfers, contracts and nodes. It has no real value and cannot be exchanged for real currency.

### Where Do I Begin?

Start at [Get Started](/quick-start/). It has one path for using the network, one for running a node and one for building on it.

### What Does an ASI Address Look Like?

It starts with `1111`. The faucet accepts addresses of 50 to 54 characters. On DevNet amounts have 8 decimal places, so one ASI is `100000000` atomic units. See [Token Amounts](/reference/token-amounts/).

## Wallet and Keys

### How Do I Create an Account?

Open the [wallet](/wallet/usage/) and create a wallet on first launch. It is protected by a password you choose and comes with a recovery phrase.

### Who Can See My Recovery Phrase or Private Key?

Nobody but you, if you keep them private. The faucet only needs an address and never asks for a key or a recovery phrase. Write the phrase down and keep it offline. The wallet can also export a keyfile as a backup.

### Where Does the Wallet Keep My Accounts?

In the storage of your browser (IndexedDB), together with your custom networks. Clearing the site data of the browser removes them, so back up the recovery phrase or a keyfile first.

### Can the Wallet Connect to My Own Network?

Yes. The wallet has a network settings page where you add a custom network with its node and indexer URLs. See [Custom Network Connection](/wallet/custom-network/).

### How Often Does the Wallet Update Balances?

The wallet refreshes account data every 30 seconds.

## Faucet

### How Do I Get Test Tokens?

Create a wallet account, copy its address and paste it into the faucet at [faucet.dev.asichain.io](https://faucet.dev.asichain.io). The steps are in [Get DevNet ASI](/quick-start/get-asi/).

### Is There a Waiting Period Between Requests?

No. The faucet API sets no time limit between requests. The faucet refuses an address only when its balance is above the faucet's limit. The page then shows `Your address is not eligible`.

### The Tokens Have Not Arrived. What Should I Do?

The faucet page checks the transfer status every 30 seconds and, with the default settings, stops after 15 minutes. If nothing arrived by then, look the transfer up in the [explorer](/explorer/usage/) by its deploy ID before you ask again. A second request sends a second amount as long as your balance is below the limit.

## Explorer

### What Does the Explorer Show?

Blocks, transactions, validators and network statistics. See [ASI Block Explorer](/explorer/usage/).

### Does the Explorer Run the Indexer?

No. The explorer is a web frontend that queries a Hasura GraphQL API. A separate indexer reads the node over gRPC and HTTP and stores what it finds in PostgreSQL.

## Nodes

### Which Node Implementation Is Maintained?

The Rust node, [github.com/asi-alliance/asi-chain-rust-node](https://github.com/asi-alliance/asi-chain-rust-node). New images record this source. The older Scala repositories and deployment helpers are not the setup source for the images.

### Which Container Registry Should I Use?

`public.ecr.aws/l2u2v4a8/asi-chain/`. Use the versioned tags and digests from the [container images](/reference/container-images/) catalog and pin a digest. The catalog lists the node, indexer, explorer, wallet, faucet, Wallet CLI and ASI client images.

### Can I Use a Node IP Address from an Older Page?

No. Take the DevNet addresses from [Network Endpoints](/reference/endpoints/). For any other network, ask its operator for the URLs and the bootstrap identity. Old IP addresses and the availability of a particular observer can change, and host port mappings can differ from the container defaults.

### Which Ports Must Be Reachable?

Peers connect over TCP on `40400` and `40404`. Clients need access to the external gRPC and HTTP ports you decide to expose. Keep internal gRPC, admin HTTP and `/metrics` private. See the [port table](/nodes/image/#default-container-ports).

### Does an Observer Reject Writes?

Yes. A node started without a validator key runs in read-only mode. It rejects deploys with `Deploy was rejected because node is running in read-only mode.` and does not propose blocks, but it answers queries. Exploratory deploys, which balance queries use, run only on a read-only node or on a node started in developer mode, such as DevNet Validator 1.

## Tools

### What Amount Does the Wallet CLI Expect?

An integer in atomic units. On DevNet `100000000` is one ASI. See [Token Amounts](/reference/token-amounts/). Keep the exact integer, and if a transfer ends with an unknown result, check its deploy ID before sending again.

### Should I Update the Wallet CLI Submodule with `--remote`?

No. Run `git submodule update --init --recursive` and keep the committed client revision. The [Wallet CLI](/cli/usage/) page names the revision of the published image.

## More Help

### Where Can I Ask a Question or Report a Problem?

For node problems, start with [Troubleshooting](/help/troubleshooting/). For anything else, open an issue in the repository of the component:

- [github.com/asi-alliance/asi-chain-wallet](https://github.com/asi-alliance/asi-chain-wallet) for the wallet
- [github.com/asi-alliance/asi-chain-explorer](https://github.com/asi-alliance/asi-chain-explorer) for the explorer
- [github.com/asi-alliance/asi-chain-faucet](https://github.com/asi-alliance/asi-chain-faucet) for the faucet
- [github.com/asi-alliance/asi-chain-wallet-cli](https://github.com/asi-alliance/asi-chain-wallet-cli) for the Wallet CLI
- [github.com/asi-alliance/asi-chain-docs-portal](https://github.com/asi-alliance/asi-chain-docs-portal) for this documentation

## Next Steps

<CardGrid columns="2">
  <DocCard title="Get Started" href="/quick-start/">Paths for using the network, running a node and building on it</DocCard>
  <DocCard title="Troubleshooting" href="/help/troubleshooting/">Checks for common node and wallet problems</DocCard>
</CardGrid>
