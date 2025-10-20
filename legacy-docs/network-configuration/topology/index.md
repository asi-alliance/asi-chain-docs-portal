# Network Topology

This section visualizes the ASI:Chain DevNet topology and provides a brief description of each node role.

## Topology Diagram

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

## Node Roles

### Bootstrap Node
- First node in the network
- Acts as the entry point for new peers
- Does **not** participate in consensus or validation

### Validator Nodes
- Sign, propose, and finalize blocks
- Minimum 3 validators required for network operation
- Can be internal or external validators

### Observer Node
- Read-only access to blockchain data
- No participation in consensus
- Powers the block explorer and monitoring tools

## Network Configuration

**Current Setup:**
- 1 Bootstrap Node
- 3 Validator Nodes
- 1 Observer Node

**Consensus:** CBC Casper
**Fault Tolerance:** 0.99
**Block Time:** ~20 seconds average

## Notes

- Bootstrap node is essential for network discovery but does not validate
- External validators can join the network by following the [validator setup guide](/quick-start/join-validator/)
- All nodes communicate via peer-to-peer protocol

Continue to [Quick Start Guide](/legacy-docs/quick-start/) to learn how to join this topology.
