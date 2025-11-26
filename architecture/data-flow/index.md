# Data Flow Diagrams

How data moves through the ASI:Chain ecosystem.

← [Back to Architecture Overview](../)

## Wallet Data Flow

Data flow from user actions to blockchain.

```mermaid
graph LR
    User([User]) --> UI[Wallet UI]
    UI --> Store[Redux Store]
    Store --> Services[Services]
    Services --> Nodes[Blockchain Nodes]
    Nodes --> Services
    Services --> Store
    Store --> UI
```

### Flow Details

| Layer | Input | Output |
|-------|-------|--------|
| UI | User actions | Display updates |
| Store | State changes | Persisted state |
| Services | API calls | Responses |
| Nodes | Deploys/queries | Results |

### Data Types

| Type | Encryption | Storage |
|------|------------|---------|
| Private keys | AES-256 | Browser |
| Transactions | Signed | Blockchain |
| Balances | None | In-memory |

---

## Explorer Data Flow

Blockchain data to user interface.

```mermaid
graph LR
    Node[ASI Node] --> Parser[Parser]
    Parser --> DB[(SQLite)]
    DB --> API[Flask API]
    API --> Browser([Browser])
```

### Indexing Pipeline

| Source | Process | Storage |
|--------|---------|---------|
| Docker logs | Parse blocks | blocks table |
| RPC API | Get details | deployments table |
| HTTP API | Query balance | Live query |

---

## Transaction Lifecycle

End-to-end transaction flow.

```mermaid
graph TD
    Create[Create Transaction] --> Sign[Sign Deploy]
    Sign --> Submit[Submit to Validator]
    Submit --> Validate[Validate]
    Validate --> Block[Include in Block]
    Block --> Finalize[Finalize]
    Finalize --> Confirm[Confirmation]
```

| Stage | Component |
|-------|-----------|
| Create/Sign | Wallet |
| Submit/Validate | Validator |
| Block | Consensus |
| Finalize | Network |

---

## Related Documentation

- [Sequence Diagrams](../sequence-diagrams/) - Detailed interactions
- [Component Diagrams](../component-diagrams/) - Internal structure
- [Network Topology](../network-topology/) - Infrastructure
