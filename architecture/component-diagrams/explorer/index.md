# Block Explorer Architecture

The Block Explorer is a Flask web application that indexes and displays blockchain data.

← [Back to Component Diagrams](../)

## High-Level Overview

```mermaid
graph TB
    subgraph "Block Explorer"
        Parser[Enhanced Parser]
        DB[(SQLite Database)]
        Web[Flask Web App]
    end
    
    subgraph "External"
        Docker[Docker Container]
        Node[Node API :40453]
    end
    
    subgraph "Clients"
        Browser[Web Browser]
    end
    
    Docker --> Parser
    Node --> Parser
    Parser --> DB
    DB --> Web
    Web --> Browser
```

## Data Processing

The Enhanced Parser continuously indexes blockchain data.

```mermaid
graph LR
    subgraph "Parser Process"
        LP[Log Parser]
        RPC[RPC Client]
        AGG[Aggregator]
    end
    
    LP --> |block events| AGG
    RPC --> |block details| AGG
    AGG --> DB[(Database)]
```

| Component | Function |
|-----------|----------|
| Log Parser | Read Docker logs |
| RPC Client | Query block details |
| Aggregator | Combine and store |

## Database Schema

SQLite stores indexed blockchain data.

```mermaid
erDiagram
    blocks ||--o{ deployments : contains
    blocks ||--o{ block_validators : has
    validators ||--o{ block_validators : participates
    
    blocks {
        int block_number
        string block_hash
        string proposer
        datetime created_at
    }
    
    deployments {
        string deploy_id
        string deployer
        string term
        int phlo_cost
        boolean errored
    }
    
    validators {
        string public_key
        string alias
    }
```

## Web Interface

Flask serves both HTML pages and REST API endpoints.

```mermaid
graph TD
    subgraph "Routes"
        HTML[HTML Pages]
        API[REST API]
    end
    
    HTML --> H1[/ - Block list]
    HTML --> H2[/block/:hash - Details]
    
    API --> A1[/api/blocks]
    API --> A2[/api/deployments]
    API --> A3[/api/validators]
    API --> A4[/api/wallet/:address]
```

## API Endpoints

| Endpoint | Method | Returns |
|----------|--------|---------|
| `/api/blocks` | GET | Block list with pagination |
| `/api/block/<hash>` | GET | Block details + deployments |
| `/api/validators` | GET | Active validator list |
| `/api/wallet/<address>` | GET | Balance + transaction history |
| `/api/transfers` | GET | Recent transfers |

## Data Sources

| Source | Data Type | Access Method |
|--------|-----------|---------------|
| Docker logs | Block creation events | `docker logs` command |
| Node RPC | Block details, deploys | `show-blocks`, `show-block` |
| Node HTTP | Balance queries | `/api/explore-deploy` |

---

## Related Documentation

- [Explorer Usage Guide](/explorer/usage/) - How to use the explorer
- [Explorer Query Flow](../../sequence-diagrams/) - Data retrieval sequence
- [Network Topology](../../network-topology/) - Node connections
