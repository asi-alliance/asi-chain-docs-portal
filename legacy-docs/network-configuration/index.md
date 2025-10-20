# Network Configuration

Current ASI:Chain DevNet configuration and node topology.

## Network Composition

- **1 Bootstrap Node** - Network entry point (not a validator)
- **3 Validator Nodes** - Consensus participants  
- **1 Observer Node** - Read-only access

Technology stack: F1R3FLY-based blockchain implementation.

## Infrastructure Details

All nodes are currently hosted on a single server with IP: **54.152.57.201**

### Port Allocation Scheme

Each node uses a range of 6 ports (404X0-404X5) with the following purposes:
- **404X0** - Protocol server
- **404X1** - Public gRPC API
- **404X2** - Internal gRPC API
- **404X3** - HTTP API
- **404X4** - Kademlia server (discovery)
- **404X5** - Admin HTTP API

## Node Addresses

### Bootstrap Node

```
rnode://e5e6faf012f36a30176d459ddc0db81435f6f1dc@54.152.57.201?protocol=40400&discovery=40404
```

**Port range:** 40400-40405

### Observer Node (Read-only)

- **Server:** 54.152.57.201
- **Port range:** 40450-40455
- **Protocol port:** 40450
- **Discovery port:** 40454
- **HTTP API:** 40453
- **gRPC API:** 40451
- **Status:** Read-only access for monitoring and querying the network

## Network Topology

```
                    ┌─────────────┐
                    │  Bootstrap  │
                    │  (Genesis)  │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
    ┌───────────┐    ┌───────────┐    ┌───────────┐
    │Validator 1│    │Validator 2│    │Validator 3│
    └─────┬─────┘    └─────┬─────┘    └─────┬─────┘
          │                │                │
          └────────────────┼────────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Observer   │
                    │ (Read-only) │
                    └─────────────┘
```

## Port Reference Table

| Node Type | Protocol | Public gRPC | Internal gRPC | HTTP API | Discovery | Admin HTTP |
|-----------|----------|-------------|---------------|----------|-----------|------------|
| Bootstrap | 40400    | 40401       | 40402         | 40403    | 40404     | 40405      |
| Validator 1| 40410   | 40411       | 40412         | 40413    | 40414     | 40415      |
| Validator 2| 40420   | 40421       | 40422         | 40423    | 40424     | 40425      |
| Validator 3| 40430   | 40431       | 40432         | 40433    | 40434     | 40435      |
| Observer  | 40450    | 40451       | 40452         | 40453    | 40454     | 40455      |

**Note:** Internal validator endpoints are not publicly exposed for security reasons.

## External Validator Connection

External validators can join the DevNet by:

1. Creating a wallet at [wallet.dev.asichain.io](https://wallet.dev.asichain.io)
2. Getting test tokens from the [Faucet](https://faucet.dev.asichain.io)
3. Following the [Join as Validator](/quick-start/join-validator/) guide
4. Connecting to the bootstrap node using the bootstrap URI above

See the [Validator Setup Guide](/quick-start/join-validator/) for detailed instructions.

## Documentation References

- [Network Parameters](/network-configuration/parameters/) - Detailed consensus and configuration parameters
- [Network Topology](/network-configuration/topology/) - Visual network layout and node roles
- [Quick Start Guide](/quick-start/) - Validator connection procedures
- [DevNet Structure](/shard-nodes/devnet-structure/) - Complete network architecture

