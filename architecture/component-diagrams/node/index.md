# ASI Node Architecture

The ASI Scala Node is the core blockchain engine running in Docker.

← [Back to Component Diagrams](../)

## High-Level Overview

```mermaid
graph TB
    subgraph "ASI Node"
        Core[Node Core]
        API[API Layer]
        P2P[P2P Network]
    end
    
    subgraph "External"
        Bootstrap[Bootstrap Node]
        Peers[Peer Nodes]
        Clients[API Clients]
    end
    
    Bootstrap --> P2P
    Peers <-.-> P2P
    Clients --> API
    API --> Core
    P2P --> Core
```

## Port Configuration

Each node exposes multiple ports for different protocols.

```mermaid
graph LR
    subgraph "Node Ports"
        N[Node]
    end
    
    N --> P1[":40440 P2P"]
    N --> P2[":40443 HTTP API"]
    N --> P3[":40444 Discovery"]
    N --> P4[":40445 Admin"]
```

| Port | Protocol | Purpose | Access |
|------|----------|---------|--------|
| 40440 | TCP | P2P communication | Public |
| 40443 | HTTP | Deploy and query API | Public |
| 40444 | UDP | Peer discovery | Public |
| 40445 | HTTP | Admin API | Localhost only |

## Core Services

The node core handles consensus and smart contract execution.

```mermaid
graph TD
    subgraph "Core Services"
        CE[Consensus Engine]
        RR[Rholang Runtime]
        ST[Storage]
    end
    
    CE --> |validates| Blocks[Blocks]
    RR --> |executes| Deploys[Smart Contracts]
    ST --> |persists| State[Blockchain State]
```

| Service | Function |
|---------|----------|
| Consensus Engine | CBC Casper block validation and finalization |
| Rholang Runtime | Smart contract execution environment |
| Storage Layer | Block and state persistence (LMDB) |

## API Layer

HTTP and gRPC interfaces for client interaction.

```mermaid
graph LR
    subgraph "HTTP API"
        D[/api/deploy]
        E[/api/explore-deploy]
        B[/api/blocks]
        S[/status]
    end
```

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/deploy` | POST | Submit signed deploy |
| `/api/explore-deploy` | POST | Read-only query |
| `/api/blocks` | GET | Block information |
| `/status` | GET | Node status |

## P2P Networking

Nodes communicate using the Kademlia protocol.

```mermaid
graph TD
    subgraph "P2P Flow"
        BT[Connect to Bootstrap]
        PD[Peer Discovery]
        SY[Synchronization]
        BG[Block Gossip]
    end
    
    BT --> PD
    PD --> SY
    SY --> BG
```

| Phase | Description |
|-------|-------------|
| Bootstrap | Initial connection to known node |
| Discovery | Find and connect to peers |
| Sync | Download missing blocks |
| Gossip | Propagate new blocks/deploys |

## Configuration Files

| File | Purpose |
|------|---------|
| `rnode.conf` | Network and node settings |
| `logback.xml` | Logging configuration |
| Validator keys | Private key for signing |

---

## Related Documentation

- [Validator Setup](/quick-start/join-validator/) - How to run a validator
- [Observer Setup](/quick-start/join-observer/) - Read-only node setup
- [Node Lifecycle](../../state-diagrams/) - Node states
