# Useful Links

Quick access to all ASI:Chain DevNet resources and tools.

## Web Applications

### ASI Wallet
**URL:** [wallet.dev.asichain.io](https://wallet.dev.asichain.io)

Create accounts, manage assets, deploy smart contracts, and interact with the ASI:Chain network.

### Block Explorer
**URL:** [explorer.dev.asichain.io](https://explorer.dev.asichain.io)

Monitor real-time blockchain activity, search transactions, and view network statistics.

### Faucet
**URL:** [faucet.dev.asichain.io](https://faucet.dev.asichain.io)

Request test ASI tokens for development and testing.

### Indexer
**URL:** [indexer.dev.asichain.io](https://indexer.dev.asichain.io)

Access indexed blockchain data and API endpoints.

## Network Endpoints

### Bootstrap Node
```
rnode://e5e6faf012f36a30176d459ddc0db81435f6f1dc@54.152.57.201?protocol=40400&discovery=40404
```
Use this endpoint to connect your node to the DevNet.

### Validator Node (HTTP)
```
http://54.152.57.201:40413
```
For transaction submission and contract deployment.

### Observer Node (HTTP)
```
http://54.152.57.201:40453
```
For read-only operations and blockchain queries.

## Repositories

### ASI Chain Core
**GitHub:** [asi-alliance/asi-chain](https://github.com/asi-alliance/asi-chain)

Main repository containing:
- Node Docker configurations
- Network setup scripts
- Documentation source
- Example contracts

### Rust Client (CLI)
**GitHub:** [singnet/rust-client](https://github.com/singnet/rust-client)

Command-line interface for:
- Deploying smart contracts
- Proposing blocks
- Interacting with the network

## Docker Images

### Official Node Image
```
533793137436.dkr.ecr.us-east-1.amazonaws.com/asi-chain/node:latest
```
Docker image for running validator and observer nodes.

## Documentation Sections

### Quick Start
- [Join DevNet as Validator](/quick-start/join-validator/) - Become a validator
- [Get DevNet ASI Tokens](/quick-start/get-asi/) - Request test tokens

### Shard & Nodes
- [DevNet Structure & Entities](/shard-nodes/devnet-structure/) - Network architecture
- [Validator Node Image](/shard-nodes/validator-image/) - Validator setup
- [Observer Node Image](/shard-nodes/observer-image/) - Observer setup

### Tools
- [Wallet Usage Guide](/wallet/usage/) - Wallet documentation
- [Explorer Usage Guide](/explorer/usage/) - Explorer documentation
- [Faucet Usage Guide](/faucet/usage/) - Faucet documentation

## Development Tools

### Smart Contract Development
- **Language:** Rholang
- **IDE:** Built into [ASI Wallet](https://wallet.dev.asichain.io/#/ide)
- **Examples:** Available in wallet and [GitHub](https://github.com/asi-alliance/asi-chain/tree/master/examples)

### Network Interaction
- **CLI Tool:** [Rust Client](https://github.com/singnet/rust-client)
- **HTTP API:** `http://54.152.57.201:40413` (Validator)
- **gRPC API:** `54.152.57.201:40401` (Validator)

## Network Information

### Current Configuration
- **Network:** DevNet (Development Network)
- **Bootstrap Nodes:** 1
- **Validators:** 3 active
- **Observer Nodes:** 1
- **Average Block Time:** ~20 seconds

### System Requirements
**Minimum:**
- CPU: 4 cores
- RAM: 16 GB
- Storage: 250+ GB
- Network: Stable internet connection

**Recommended:**
- CPU: 8 cores
- RAM: 32 GB
- Storage: 250+ GB
- Network: Stable internet connection

## Support

### Getting Help
- **Documentation:** Browse this site using the sidebar
- **GitHub Issues:** Report bugs or request features
- **FAQ:** Check the [FAQ section](/faq/) for common questions

### Quick Troubleshooting
- **Wallet Issues:** Clear browser cache, check network settings
- **Node Connection:** Verify bootstrap endpoint and firewall settings
- **Transaction Failures:** Ensure sufficient balance and correct parameters

## Quick Command Reference

### Deploy Smart Contract
```bash
cargo run -- deploy -f ./contract.rho --private-key <key> -H localhost -p 40402
```

### Propose Block
```bash
cargo run -- propose --private-key <key> -H localhost -p 40402
```

### Check Balance
```bash
curl -X POST http://54.152.57.201:40453/explore-deploy \
  -H 'Content-Type: application/json' \
  -d '{"term": "new rl(`rho:registry:lookup`) in { rl!(\"rho:rchain:asiVault\") }"}'
```

### Query Block History
```bash
curl http://54.152.57.201:40453/blocks
```

---

**Bookmark this page** for quick access to all ASI:Chain resources.
