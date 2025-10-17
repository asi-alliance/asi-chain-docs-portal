# Network Configuration
Current ASI:Chain testnet configuration and node topology.

## Network Composition
- **1 Bootstrap Node** - Network entry point
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

## External Validator Integration
**Status**: External validator connection with custom wallets is under development.

**Current Requirement**: Use prepared wallet credentials from [`testnet-wallets.txt`](https://github.com/asi-alliance/asi-chain/blob/master/chain/testnet-wallets.txt).

**Development Timeline**: Connection procedures for custom wallets are being validated with F1R3FLY and MetaCycle teams.

## Documentation References
- [Network Parameters](/network-configuration/parameters/) - Detailed consensus and configuration parameters
- [Network Topology](/network-configuration/topology/) - Visual network layout and node roles
- [Quick Start Guide](/quick-start/) - Validator connection procedures