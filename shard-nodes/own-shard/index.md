# Own Shard Setting Up

Documentation for setting up a private ASI:Chain shard is currently under development.

## Overview

A private shard is an independent blockchain network that:
- Operates separately from the public DevNet
- Has its own genesis configuration
- Requires minimum 3 validators to function
- Uses the same Docker image as DevNet
- Can be configured for enterprise or private testing

## Core Requirements

**Technical Prerequisites:**
- Docker and Docker Compose installed
- Multiple servers (minimum 4: bootstrap + 3 validators)
- Network connectivity between servers
- Understanding of blockchain node operations

**Resource Requirements per Node:**
- CPU: 4-8 cores
- RAM: 16-32 GB
- Storage: 250+ GB
- Stable network infrastructure

## Network Components

A private shard requires:

1. **Bootstrap Node** - Network entry point (not a validator)
2. **Validator Nodes** - Minimum 3 for consensus
3. **Observer Node** - (Optional) For read access
4. **Genesis Configuration** - Initial network parameters

## Docker Image

Use the official ASI:Chain node image:
```
public.ecr.aws/f6y9h6x4/asi-chain/node:latest
```

## Key Configuration Parameters

Based on DevNet configuration:
- **Consensus:** CBC Casper
- **Fault Tolerance Threshold:** 0.99
- **Minimum Validators:** 3
- **Block Time:** ~20 seconds average

## Reference Materials

To understand the implementation, study the DevNet setup:
- [DevNet Structure](/shard-nodes/devnet-structure/) - Network architecture
- [Validator Node Image](/shard-nodes/validator-image/) - Node configuration
- [GitHub Repository](https://github.com/asi-alliance/asi-chain) - Source code and examples

## Bootstrap Connection Format

Bootstrap nodes use this URI format:
```
rnode://e5e6faf012f36a30176d459ddc0db81435f6f1dc@54.152.57.201?protocol=40400&discovery=40404
```

Where:
- First part: Bootstrap node public key
- IP address: Bootstrap server
- protocol: Protocol server port
- discovery: Kademlia discovery port

## Support

For questions about private shards:
- Review the public DevNet configuration in [GitHub](https://github.com/asi-alliance/asi-chain)
- Check [DevNet Structure](/shard-nodes/devnet-structure/) for architecture details
- See [Validator Setup](/quick-start/join-validator/) for node configuration examples

---

**Note:** Detailed setup guide with step-by-step instructions will be added soon.
