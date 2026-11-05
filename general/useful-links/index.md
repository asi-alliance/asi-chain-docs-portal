# Useful links

## Applications

| Application | URL |
|---|---|
| Wallet | [wallet.dev.asichain.io](https://wallet.dev.asichain.io) |
| Explorer | [explorer.dev.asichain.io](https://explorer.dev.asichain.io) |
| Faucet | [faucet.dev.asichain.io](https://faucet.dev.asichain.io) |

These are application links, not a live health report. Obtain current node HTTP/gRPC endpoints, GraphQL URLs and bootstrap identity from the target network operator. Historical raw IPs and observer status are not current connection instructions.

## Public sources

| Component | Repository |
|---|---|
| Maintained ASI Rust node | [asi-alliance/asi-chain-rust-node](https://github.com/asi-alliance/asi-chain-rust-node) |
| Rust node upstream reference | [F1R3FLY-io/f1r3node-rust](https://github.com/F1R3FLY-io/f1r3node-rust) |
| ASI node client | [asi-alliance/asi-chain-client](https://github.com/asi-alliance/asi-chain-client) |
| Wallet CLI | [asi-alliance/asi-chain-wallet-cli](https://github.com/asi-alliance/asi-chain-wallet-cli) |
| Indexer | [asi-alliance/asi-chain-indexer](https://github.com/asi-alliance/asi-chain-indexer) |
| Explorer | [asi-alliance/asi-chain-explorer](https://github.com/asi-alliance/asi-chain-explorer) |
| Web wallet | [asi-alliance/asi-chain-wallet](https://github.com/asi-alliance/asi-chain-wallet) |
| Wallet SDK | [asi-alliance/asi-chain-wallet-sdk](https://github.com/asi-alliance/asi-chain-wallet-sdk) |
| Faucet | [asi-alliance/asi-chain-faucet](https://github.com/asi-alliance/asi-chain-faucet) |
| Documentation | [asi-alliance/asi-chain-docs-portal](https://github.com/asi-alliance/asi-chain-docs-portal) |

Inspect the selected revision and consumer gitlinks; repository defaults do not always select the current ASI integration. The current ASI node fork follows the maintained pure-Rust parent. Older published images retain their upstream provenance. Legacy deployment repositories are not the source of current node setup instructions.

## Images and guides

- [ECR image catalog](/general/container-images/): current namespace, versioned tags, digests and source revisions.
- [Documentation status](/general/documentation-status/): verified scope and material awaiting review.
- [Validator image](/shard-nodes/validator-image/) and [observer image](/shard-nodes/observer-image/): runtime and configuration inputs.
- [Wallet CLI](/cli/usage/): pinned dependency, explicit endpoints and exact amounts.
- [Architecture](/architecture/): node, indexer, database, Hasura and application responsibilities.

For a problem, open an issue in the affected public repository with sanitized reproduction steps and exact source/image identity.
