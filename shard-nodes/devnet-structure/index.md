# DevNet Structure & Entities

Complete overview of ASI:Chain DevNet architecture, components, and how they interact.

## Network Overview

ASI:Chain DevNet is a development blockchain network designed for testing and experimentation. It consists of multiple interconnected components that work together to provide a complete blockchain ecosystem.

**Current Configuration:**
- **Network Name:** DevNet (Development Network)
- **Status:** Active
- **Purpose:** Testing, development, and learning
- **Token Type:** Test tokens (no real value)

## Network Components

### 1. Bootstrap Node

**Role:** Network entry point and peer discovery

**Function:**
- Acts as the initial connection point for new nodes
- Maintains a list of active network participants
- Facilitates peer discovery
- Does **not** participate in consensus or validation

**Technical Details:**
- **Host:** `54.152.57.201`
- **Port Range:** 40400-40405
- **Connection String:**
```
rnode://e5e6faf012f36a30176d459ddc0db81435f6f1dc@54.152.57.201?protocol=40400&discovery=40404
```

**Key Characteristics:**
- Single bootstrap node for the network
- Always-on availability
- No validator responsibilities
- Essential for network operation

### 2. Validator Nodes

**Role:** Consensus participants and block producers

**Function:**
- Validate transactions
- Propose new blocks
- Participate in consensus
- Sign blocks with validator keys
- Maintain network security

**Technical Details:**
- **Current Count:** 3 active validators
- **Minimum Required:** 3 validators for network operation
- **Consensus:** CBC Casper
- **Block Time:** ~20 seconds average

**Validator Requirements:**
- Valid public/private key pair
- Sufficient stake (on mainnet, not required on DevNet)
- Proper network configuration
- Open ports for communication
- Reliable uptime

**External Validators:**
The network supports external validators joining:
- Anyone can become a validator
- Create wallet on [wallet.dev.asichain.io](https://wallet.dev.asichain.io)
- Get test tokens from [faucet](https://faucet.dev.asichain.io)
- Follow [setup guide](/quick-start/join-validator/)

### 3. Observer Node

**Role:** Read-only network participant

**Function:**
- Synchronizes with blockchain
- Provides read access to data
- Does not participate in consensus
- Does not sign or propose blocks
- Powers external services

**Technical Details:**
- **Host:** `54.152.57.201`
- **HTTP Port:** 40453
- **gRPC Port:** 40451
- **Port Range:** 40450-40455

**Use Cases:**
- Blockchain explorers
- API services
- Data indexing
- Network monitoring
- Application backends

**Public Access:**
```
HTTP: http://54.152.57.201:40453
gRPC: 54.152.57.201:40451
```

## Network Services

### Block Explorer

**Purpose:** Visualize and explore blockchain data

**Access:** [explorer.dev.asichain.io](https://explorer.dev.asichain.io)

**Features:**
- Real-time block monitoring
- Transaction search
- Validator statistics
- Network performance metrics
- WebSocket live updates

**Data Source:** Connected to Observer Node

### Blockchain Indexer

**Purpose:** Index and organize blockchain data

**Access:** [indexer.dev.asichain.io](https://indexer.dev.asichain.io)

**Features:**
- Fast data retrieval
- Indexed transactions and blocks
- API endpoints for applications
- Historical data access
- Efficient queries

**Function:** Powers the Block Explorer and provides API access

### ASI Wallet

**Purpose:** User interface for blockchain interaction

**Access:** [wallet.dev.asichain.io](https://wallet.dev.asichain.io)

**Features:**
- Account management
- Token transfers
- Smart contract deployment
- Integrated Rholang IDE
- Transaction history
- Multi-account support

**Connection:** Direct peer-to-peer to validator and observer nodes

### Faucet

**Purpose:** Distribute test tokens

**Access:** [faucet.dev.asichain.io](https://faucet.dev.asichain.io)

**Features:**
- Request test tokens
- No authentication required
- Transaction status tracking
- Balance display
- Simple interface

**Function:** Sends test ASI tokens to specified addresses

## Network Architecture

### Visual Diagram

```
                    ┌─────────────────┐
                    │  Bootstrap Node │
                    │  (Entry Point)  │
                    │  54.152.57.201  │
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │ Validator 1  │  │ Validator 2  │  │ Validator 3  │
    │  (Consensus) │  │  (Consensus) │  │  (Consensus) │
    │     + ASI    │  │     + ASI    │  │  + External  │
    └──────┬───────┘  └──────┬───────┘  └───────┬──────┘
           │                 │                  │
           └─────────────────┼──────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Observer Node  │
                    │  (Read-Only)    │
                    │  54.152.57.201  │
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────┬─────────────┐
            │                │                │             │
            ▼                ▼                ▼             ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │   Wallet     │  │   Explorer   │  │   Indexer    │  │   Faucet     │
    │  (Web App)   │  │  (Web App)   │  │  (Service)   │  │  (Web App)   │
    │  wallet.dev  │  │ explorer.dev │  │ indexer.dev  │  │  faucet.dev  │
    └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
            │                │                              
            └────────────────┤  Direct User Access
                             ▼
                        ┌──────────┐
                        │  Users   │
                        └──────────┘
```

### Communication Flow

**New Node Joining:**
1. Node connects to Bootstrap Node
2. Bootstrap provides peer list
3. Node connects to Validators
4. Node synchronizes blockchain
5. Node participates (if validator) or observes

**Transaction Flow:**
1. User submits transaction to Validator
2. Validator validates and broadcasts
3. Other validators receive transaction
4. Consensus reached on new block
5. Block added to chain
6. Observer synchronizes new block
7. Explorer/Indexer update display

**Data Query Flow:**
1. User requests data via Wallet/Explorer
2. Request routed to Observer Node
3. Observer queries local blockchain copy
4. Response returned to user
5. Data displayed in interface

## Port Allocation

### Bootstrap Node
| Service | Port | Purpose |
|---------|------|---------|
| Protocol | 40400 | Node communication |
| Public gRPC | 40401 | External API |
| Internal gRPC | 40402 | Internal API |
| HTTP API | 40403 | HTTP access |
| Discovery | 40404 | Peer discovery |
| Admin | 40405 | Administration |

### Validator Nodes
Validators use similar port ranges (404X0-404X5 pattern) but are not publicly exposed for security.

### Observer Node
| Service | Port | Purpose |
|---------|------|---------|
| Protocol | 40450 | Node communication |
| Public gRPC | 40451 | External API |
| Internal gRPC | 40452 | Internal API |
| HTTP API | 40453 | HTTP access |
| Discovery | 40454 | Peer discovery |
| Admin | 40455 | Administration |

## Network Parameters

### Consensus Configuration

**Algorithm:** CBC Casper
**Minimum Validators:** 3
**Fault Tolerance Threshold:** 0.99
**Average Block Time:** ~20 seconds
**Finality:** Probabilistic

### Network Topology

**Type:** Mesh network
**Connectivity:** Peer-to-peer
**Discovery:** Kademlia-based
**Bootstrap Required:** Yes

### Resource Requirements

**For Validators:**
- CPU: 4-8 cores
- RAM: 16-32 GB
- Storage: 250+ GB
- Network: Stable, low latency

**For Observers:**
- CPU: 2-4 cores
- RAM: 8-16 GB
- Storage: 250+ GB
- Network: Stable connection

## Security Model

### Network Security

**Validator Authentication:**
- Public/private key cryptography
- ED25519 signatures
- Key-based node identity

**Communication:**
- Encrypted peer connections
- Secure protocol implementation
- DOS protection

**Consensus Security:**
- Byzantine fault tolerance
- Stake-based participation (mainnet)
- Multiple validator requirement

### Data Integrity

**Block Validation:**
- Cryptographic hash chains
- Merkle tree verification
- Signature validation

**State Consistency:**
- Replicated state across validators
- Synchronization protocols
- Conflict resolution

## Scalability

### Current Capacity

**Transactions:** Limited by block size and time
**Throughput:** ~0.01-1 TPS (test network)
**Block Size:** Configured limit
**State Size:** Growing with usage

## Joining the Network

### As a User

1. Create wallet account
2. Request test tokens
3. Start making transactions
4. Deploy smart contracts

### As a Validator

1. Meet system requirements
2. Generate validator keys
3. Configure node software
4. Connect to bootstrap
5. Participate in consensus

See [Join DevNet as Validator](/quick-start/join-validator/) for details.

### As a Developer

1. Get test tokens
2. Use wallet or CLI tools
3. Deploy contracts
4. Build applications
5. Access via observer node

## Monitoring

### Network Status

Check network health:
- [Block Explorer](https://explorer.dev.asichain.io)
- Validator uptime
- Block production rate
- Transaction throughput

### Individual Node

Monitor your node:
```bash
# View logs
sudo docker logs validator -f

# Check status
curl http://localhost:40403/status

# Monitor resources
docker stats validator
```

## Support

For more information:
- [Useful Links](/general/useful-links/)
- [FAQ](/faq/)
- [GitHub Repository](https://github.com/asi-alliance/asi-chain)

---

**This network is for development and testing. All tokens have no real value.**
