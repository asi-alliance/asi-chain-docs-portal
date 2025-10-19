# Join DevNet as Observer

**Status:** Coming Soon

This guide for joining ASI:Chain DevNet as an observer node is currently under development.

## What is an Observer Node?

Observer nodes are read-only nodes that:
- Synchronize with the blockchain
- Do not participate in consensus
- Provide read access to blockchain data
- Useful for running explorers, APIs, or monitoring

## Why Run an Observer?

- **Lower Requirements** - No staking or validation required
- **Read Access** - Query blockchain data directly
- **Application Support** - Power your dApps with direct node access
- **Network Monitoring** - Monitor network health and activity

## Coming Soon

We are currently finalizing the observer node documentation. This guide will include:

- System requirements for observer nodes
- Step-by-step setup instructions
- Configuration examples
- Connection to DevNet
- API endpoint usage
- Troubleshooting tips

## In the Meantime

While we prepare this guide, you can:

1. **Use Public Endpoints** - Access the existing observer node at `54.152.57.201:40453`
2. **Explore the Code** - Review the observer configuration in the [GitHub repository](https://github.com/asi-alliance/asi-chain)
3. **Check Back Soon** - This guide will be available in the near future

## Public Observer Access

For now, you can use the public observer node:

**HTTP Endpoint:**
```
http://54.152.57.201:40453
```

**Use Cases:**
- Query blocks: `curl http://54.152.57.201:40453/blocks`
- Check balance: `curl -X POST http://54.152.57.201:40453/explore-deploy`
- Monitor network status

## Questions?

If you have specific questions about running an observer node, please:

- Check the [FAQ section](/faq/)
- Visit the [GitHub repository](https://github.com/asi-alliance/asi-chain)
- Review the [DevNet Structure](/shard-nodes/devnet-structure/) documentation

---

This page will be updated soon with complete observer node setup instructions.
