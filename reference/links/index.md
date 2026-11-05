# Useful Links

This page collects the public applications, packages and source repositories of ASI:Chain.

## Applications

| Application | URL |
|---|---|
| Documentation | [docs.asichain.io](https://docs.asichain.io) |
| Wallet | [wallet.dev.asichain.io](https://wallet.dev.asichain.io) |
| Explorer | [explorer.dev.asichain.io](https://explorer.dev.asichain.io) |
| Faucet | [faucet.dev.asichain.io](https://faucet.dev.asichain.io) |

Node addresses are on [Network Endpoints](/reference/endpoints/).

## Packages

| Package | Registry |
|---|---|
| Wallet SDK | [@asichain/asi-wallet-sdk](https://www.npmjs.com/package/@asichain/asi-wallet-sdk) on npm |

## Source Code

| Component | Repository |
|---|---|
| Rust node | [github.com/asi-alliance/asi-chain-rust-node](https://github.com/asi-alliance/asi-chain-rust-node) |
| Rust node upstream | [github.com/F1R3FLY-io/f1r3node-rust](https://github.com/F1R3FLY-io/f1r3node-rust) |
| ASI node client | [github.com/asi-alliance/asi-chain-client](https://github.com/asi-alliance/asi-chain-client) |
| Wallet CLI | [github.com/asi-alliance/asi-chain-wallet-cli](https://github.com/asi-alliance/asi-chain-wallet-cli) |
| Indexer | [github.com/asi-alliance/asi-chain-indexer](https://github.com/asi-alliance/asi-chain-indexer) |
| Explorer | [github.com/asi-alliance/asi-chain-explorer](https://github.com/asi-alliance/asi-chain-explorer) |
| Web wallet | [github.com/asi-alliance/asi-chain-wallet](https://github.com/asi-alliance/asi-chain-wallet) |
| Wallet SDK | [github.com/asi-alliance/asi-chain-wallet-sdk](https://github.com/asi-alliance/asi-chain-wallet-sdk) |
| Faucet | [github.com/asi-alliance/asi-chain-faucet](https://github.com/asi-alliance/asi-chain-faucet) |
| Documentation | [github.com/asi-alliance/asi-chain-docs-portal](https://github.com/asi-alliance/asi-chain-docs-portal) |

The repository [github.com/asi-alliance/asi-chain](https://github.com/asi-alliance/asi-chain) is the legacy deployment repository. Do not use it as the source for node setup.

Check the branch or tag you build from, because the default branch of a repository does not always hold the current ASI integration.

## Report a Problem

To report a problem, open an issue in the affected repository. Describe how to reproduce it, and leave out keys and `.env` values.

## Next Steps

<CardGrid columns="2">
  <DocCard title="Network Endpoints" href="/reference/endpoints/" icon="endpoints">DevNet applications and node addresses.</DocCard>
  <DocCard title="Container Images" href="/reference/container-images/" icon="image">Published images, tags and digests.</DocCard>
  <DocCard title="Wallet SDK" href="/wallet-sdk/overview/" icon="sdk">TypeScript SDK.</DocCard>
  <DocCard title="Architecture" href="/architecture/" icon="architecture">How node, indexer, GraphQL and applications connect.</DocCard>
</CardGrid>
