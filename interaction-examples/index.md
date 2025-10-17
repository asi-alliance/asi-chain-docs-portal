# Network Interaction Procedures

Standard operations for interacting with the ASI:Chain network after node deployment and synchronization.

## Prerequisites

- Running and synchronized RNode instance
- HTTP API access (port 40403)
- For deployment operations: gRPC Internal API access (port 40402)

## Available Operations

### Install CLI

First, build the Rust CLI from the repository:

```bash
git clone https://github.com/singnet/rust-client.git
cd rust-client
cargo build --release
```

### Smart Contract Deployment

Deploy Rholang contracts to validator nodes:

```bash
cargo run -- deploy -f ./<path to contract>/smartcontractname.rho --private-key <private key> -H <host> -p <port>
```

Example:
```bash
cargo run -- deploy -f ./examples/stdout.rho --private-key "<PRIVATE-KEY>" -H localhost -p 40402
```

### Block History Query

Retrieve block information via HTTP API:

```bash
curl http://localhost:40403/blocks
```

### Account Balance Query

Query wallet state using the explore-deploy endpoint:

```bash
curl -X POST http://localhost:40403/explore-deploy \
  -H 'Content-Type: application/json' \
  -d '{"term": "new rl(`rho:registry:lookup`) in { rl!(\"rho:rchain:asiVault\") }"}'
```

### Node Status Verification

```bash
curl http://localhost:40403/status
```

## Block Explorer Access

Web interface for network monitoring: [http://44.198.8.24:5173/](http://44.198.8.24:5173/)

## Operation Requirements

| Operation | Required Access | Port |
|-----------|----------------|------|
| Contract Deployment | Validator gRPC Internal | 40402 |
| Data Queries | HTTP API | 40403 |
| Status Monitoring | HTTP API | 40403 |

## Documentation References

- [Smart Contract Deployment](/interaction-examples/smart-contracts/)
- [Block History Procedures](/interaction-examples/block-history/)
- [Balance Query Methods](/interaction-examples/balance-check/)