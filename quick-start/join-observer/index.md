# Join DevNet as Observer

Documentation for running an observer node is currently under development.

## Public Observer Access

While the self-hosted observer documentation is being prepared, you can use the ASI:Chain public observer node:

**HTTP Endpoint:**
```
http://54.152.57.201:40453
```

**gRPC Endpoint:**
```
54.152.57.201:40451
```

### Usage Examples

**Query Blocks:**
```bash
curl http://54.152.57.201:40453/blocks
```

**Explore Deploy:**
```bash
curl -X POST http://54.152.57.201:40453/explore-deploy \
  -H 'Content-Type: application/json' \
  -d '{"term": "new rl(`rho:registry:lookup`) in { rl!(\"rho:rchain:asiVault\") }"}'
```

**Check Network Status:**
```bash
curl http://54.152.57.201:40453/status
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
