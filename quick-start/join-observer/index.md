# Join DevNet as Observer

> [!WARNING]
> The dedicated DevNet observer node is currently **unstable**. Until it is stabilized, use **Validator 1** (`http://34.196.119.4:40403`) for all read operations. On TestNet and MainNet only the observer will be available for blockchain reads.

Documentation for running a self-hosted observer node is under development. While it is being prepared, use the public read endpoints below.

## Public Read Access (via Validator 1)

**HTTP Endpoint:**
```
http://34.196.119.4:40403
```

**gRPC Endpoint:**
```
34.196.119.4:40401
```

### Usage Examples

**Query Blocks:**
```bash
curl http://34.196.119.4:40403/blocks
```

**Explore Deploy:**
```bash
curl -X POST http://34.196.119.4:40403/explore-deploy \
  -H 'Content-Type: application/json' \
  -d '{"term": "new rl(`rho:registry:lookup`) in { rl!(\"rho:rchain:asiVault\") }"}'
```

**Check Network Status:**
```bash
curl http://34.196.119.4:40403/status
```

**Latest Finalized Block:**
```bash
curl http://34.196.119.4:40403/api/last-finalized-block
```

### Indexer GraphQL (for app development)

For applications that need indexed historical data (Explorer-like), use the public indexer:

```
https://indexer.dev.asichain.io/v1/graphql
```

## What is an Observer Node?

Observer nodes:
- Synchronize with the blockchain
- Provide read access to blockchain data
- Do **not** participate in consensus
- Do **not** validate or propose blocks
- Power external services like explorers and APIs

## System Requirements

**Minimum:**
- CPU: 2 cores
- RAM: 8 GB
- Storage: 250+ GB

**Recommended:**
- CPU: 4 cores
- RAM: 16 GB
- Storage: 250+ GB

## Use Cases

### For Developers
- Query blockchain data for applications
- Build custom explorers or analytics tools
- Test API integrations

### For Infrastructure
- Provide API access for dApps
- Run blockchain indexing services
- Monitor network health

### For Data Analysis
- Analyze blockchain history
- Track network statistics
- Research blockchain patterns

## Related Documentation

- [DevNet Structure](/shard-nodes/devnet-structure/)
- [Observer Node Image](/shard-nodes/observer-image/)
- [GitHub Repository](https://github.com/asi-alliance/asi-chain)

---

**Note:** Documentation for self-hosted observer setup will be available soon.
