# Frequently Asked Questions

## Getting started

### What are DevNet tokens?

DevNet ASI is a test token for trying out transfers, contracts and nodes. It has no real value and cannot be exchanged for real currency.

### Where do I begin?

The [Get Started](/quick-start/) page has one path for using the network, one for running a node and one for building on it.

### What does an ASI address look like?

It starts with `1111`. The faucet accepts addresses of 50 to 54 characters. Amounts have 8 decimal places, so one ASI is `100000000` in the smallest unit.

## Wallet and keys

### How do I create an account?

Open the [wallet](/wallet/usage/) and create a wallet on first launch. It is protected by a password you choose and comes with a recovery phrase.

### Who can see my recovery phrase or private key?

Nobody but you, if you keep them private. The faucet only needs an address and never asks for a key or a recovery phrase. Write the phrase down and keep it offline. The wallet can also export a keyfile as a backup.

### Where does the wallet keep my accounts?

In the storage of your browser (IndexedDB), together with your custom networks. Clearing the site data of the browser removes them, so back up the recovery phrase or a keyfile first.

### Can the wallet connect to my own network?

Yes. The wallet has a network settings page where you add a custom network with its node and indexer URLs. See [custom networks](/wallet/custom-network/).

### How often does the wallet update balances?

The wallet refreshes account data every 30 seconds.

## Faucet

### How do I get test tokens?

Create a wallet account, copy its address and paste it into the faucet at [faucet.dev.asichain.io](https://faucet.dev.asichain.io). The guide is in [how to get DevNet ASI](/quick-start/get-asi/). On 5 November 2026 one request credited 10,000 ASI.

### Is there a waiting period between requests?

Not in the faucet API, which sets no time limit between requests, although a proxy in front of the public faucet can still limit the request rate. The faucet refuses an address only when the balance of that address is above the faucet's limit, and then the page shows `Your address is not eligible`.

### The tokens have not arrived. What should I do?

The faucet page checks the transfer status every 30 seconds and, with the default settings, stops after 15 minutes. If nothing arrived by then, look the transfer up in the [explorer](/explorer/usage/) by its deploy ID before you ask again. A second request sends a second amount as long as your balance is below the limit.

## Explorer

### What does the explorer show?

Blocks, transactions, validators and network statistics. See [explorer usage](/explorer/usage/).

### Does the explorer run the indexer?

No. The explorer is a web frontend that queries a Hasura GraphQL API. A separate indexer reads the node over gRPC and HTTP and stores what it finds in PostgreSQL.

## Nodes

### Which node implementation is maintained?

The Rust node, [github.com/asi-alliance/asi-chain-rust-node](https://github.com/asi-alliance/asi-chain-rust-node). New images record this source. As of 5 November 2026 the public DevNet still runs the Scala node, and a Rust node started with the DevNet bootstrap did not connect to it. The older Scala repositories and deployment helpers are not the setup source for the current images.

### Which container registry should I use?

`public.ecr.aws/l2u2v4a8/asi-chain/`. Use the versioned tags and digests from the [container images](/general/container-images/) catalog and pin a digest. The catalog lists the node, indexer, explorer, wallet, faucet, Wallet CLI and ASI client images.

### Does a newer image mean I should upgrade?

Not by itself. Pick the image that matches the network's accepted configuration and the API your clients use. A published image does not show that a network runs it.

### Can I use a node IP address from an older page?

Ask the network operator for the current URLs and the bootstrap identity. Old IP addresses and the availability of a particular observer are not a current inventory, and host port mappings can differ from the container defaults.

### Which ports must be reachable?

Peers connect over TCP on `40400` and `40404`. Clients need access to the external gRPC and HTTP ports you decide to expose. Keep internal gRPC, admin HTTP and `/metrics` private. See the [port table](/shard-nodes/validator-image/#default-container-ports).

### Does an observer reject writes?

Yes. A node started without a validator key runs in read-only mode. It rejects deploys with `Deploy was rejected because node is running in read-only mode.` and does not propose blocks, but it still answers queries, and only a read-only node accepts exploratory deploys.

## Tools

### Does the Wallet CLI work with DevNet?

On 5 November 2026 only `create` does, because the public DevNet still runs the Scala node and the CLI is written for the Rust node API. See [Wallet CLI](/cli/usage/#compatibility).

### What amount does the Wallet CLI expect?

An integer in the smallest unit: `100000000` is one ASI. Keep the exact integer, and if a transfer ends with an unknown result, check its deploy ID before sending again.

### Should I update the Wallet CLI submodule with `--remote`?

No. Run `git submodule update --init --recursive` and keep the committed client revision. The [Wallet CLI](/cli/usage/) page names the revision of the published image.

## More help

### Are all pages verified?

See [documentation status](/general/documentation-status/). A VitePress build checks that pages render and links resolve, not that the described API is correct.

### Where can I ask a question or report a problem?

For node problems start with [troubleshooting](/quick-start/troubleshooting/). Otherwise open an issue in the repository of the component: [github.com/asi-alliance/asi-chain-wallet](https://github.com/asi-alliance/asi-chain-wallet), [github.com/asi-alliance/asi-chain-explorer](https://github.com/asi-alliance/asi-chain-explorer), [github.com/asi-alliance/asi-chain-faucet](https://github.com/asi-alliance/asi-chain-faucet), [github.com/asi-alliance/asi-chain-wallet-cli](https://github.com/asi-alliance/asi-chain-wallet-cli) or [github.com/asi-alliance/asi-chain-docs-portal](https://github.com/asi-alliance/asi-chain-docs-portal).
