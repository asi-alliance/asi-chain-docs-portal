# Technical Architecture

Technical diagrams for the ASI:Chain ecosystem.

## Documentation Structure

### [Component Diagrams](./component-diagrams/)

Internal architecture of each major component:

- [Wallet Architecture](./component-diagrams/wallet/) - UI, state, services
- [Explorer Architecture](./component-diagrams/explorer/) - Parsing, storage, API
- [Node Architecture](./component-diagrams/node/) - Core, ports, P2P

### [Sequence Diagrams](./sequence-diagrams/)

Interaction flows between components:

- [Transaction Flow](./sequence-diagrams/transaction/) - Send tokens lifecycle
- [Balance Query](./sequence-diagrams/balance/) - Check balance flow

### [State Diagrams](./state-diagrams/)

Node lifecycle and state transitions:

- [Startup States](./state-diagrams/startup/) - Initialization process
- [Operational States](./state-diagrams/operations/) - Runtime states

### [Data Flow](./data-flow/)

Data movement through the system:

- Wallet data flow
- Explorer indexing pipeline

### [Network Topology](./network-topology/)

Network infrastructure:

- Bootstrap and validator nodes
- Port configuration
- External services

## Quick Navigation

| Need to understand... | See |
|----------------------|-----|
| How wallet works | [Wallet Architecture](./component-diagrams/wallet/) |
| Transaction lifecycle | [Transaction Flow](./sequence-diagrams/transaction/) |
| Node states | [State Diagrams](./state-diagrams/) |
| Network setup | [Network Topology](./network-topology/) |

## Diagram Technology

All diagrams use **Mermaid** syntax for easy maintenance and version control.

::: tip
If diagrams don't render, ensure JavaScript is enabled in your browser.
:::

---

## Related Documentation

- [General Overview](/general/overview/) - High-level ecosystem
- [DevNet Structure](/shard-nodes/devnet-structure/) - Network entities
- [Validator Setup](/quick-start/join-validator/) - Deployment guide
