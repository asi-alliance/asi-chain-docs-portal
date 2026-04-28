# Wallet Architecture

The ASI Wallet v2 is a browser-based React application for managing accounts and transactions.

← [Back to Component Diagrams](../)

## High-Level Overview

```mermaid
graph TB
    subgraph "ASI Wallet v2"
        UI[User Interface]
        Store[Redux Store]
        Services[Services Layer]
    end
    
    subgraph "External"
        V1["Validator 1 34.196.119.4:40403<br/>(write + read; observer is unstable)"]
        WC[WalletConnect]
    end
    
    UI --> Store
    Store --> Services
    Services --> V1
    Services --> WC
```

## UI Layer

The user interface consists of React components organized by feature.

```mermaid
graph LR
    subgraph "Pages"
        P1[Dashboard]
        P2[Send]
        P3[Receive]
        P4[Accounts]
        P5[History]
        P6[Settings]
    end
    
    subgraph "Features"
        F1[IDE]
        F2[Deploy]
        F3[WalletConnect]
    end
```

| Page | Purpose |
|------|---------|
| Dashboard | Balance overview, quick actions |
| Send/Receive | Token transfers |
| Accounts | Account management |
| History | Transaction history |
| IDE | Rholang code editor |
| Deploy | Smart contract deployment |

## State Management

Redux store slices manage application state.

```mermaid
graph TD
    subgraph "Redux Store"
        WS[walletSlice]
        WCS[walletConnectSlice]
        AS[authSlice]
        TS[themeSlice]
    end
    
    WS --> |accounts, networks, transactions| Data[Persistent Data]
    WCS --> |sessions, pending requests| Sessions[DApp Sessions]
    AS --> |password state| Auth[Authentication]
```

| Slice | Data Managed |
|-------|--------------|
| walletSlice | Accounts, networks, transactions |
| walletConnectSlice | DApp sessions, pending requests |
| authSlice | Password and unlock state |
| themeSlice | UI theme preferences |

## Services Layer

Services handle external communication and data management.

```mermaid
graph LR
    subgraph "Services"
        RS[ASI Chain Service]
        SS[Secure Storage]
        WCS[WalletConnect Service]
    end
    
    RS --> |deploy, query| Nodes[Blockchain Nodes]
    SS --> |encrypted keys| Browser[Browser Storage]
    WCS --> |sessions| Bridge[WC Bridge]
```

| Service | Responsibility |
|---------|---------------|
| ASI Chain Service | Balance queries, deploys, transactions |
| Secure Storage | Encrypted private key storage |
| WalletConnect | DApp connection management |

## Node Connections

The wallet connects to different nodes for different operations.

| Operation | Node | Port | Purpose |
|-----------|------|------|---------|
| Send tokens | Validator 1 (`34.196.119.4`) | :40403 | Write |
| Check balance | Validator 1 (`34.196.119.4`) | :40403 | Read (observer is unstable) |
| Deploy contract | Validator 1 (`34.196.119.4`) | :40403 | Write |

---

## Related Documentation

- [Wallet Usage Guide](/wallet/usage/) - How to use the wallet
- [Transaction Flow](../../sequence-diagrams/transaction/) - Transaction lifecycle
- [WalletConnect Integration](/wallet/custom-network/) - DApp connections
