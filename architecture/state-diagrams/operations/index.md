# Node Operational States

Runtime states for active validator and observer nodes.

← [Back to State Diagrams](../)

## Validator States

Active validator nodes cycle through consensus states.

```mermaid
flowchart TD
    subgraph Consensus["Consensus Cycle"]
        Active((Active))
        Proposing[Proposing]
        Voting[Voting]
        Finalizing[Finalizing]
        
        Active --> |Create block| Proposing
        Active --> |Validate block| Voting
        Active --> |Commit block| Finalizing
        
        Proposing --> Active
        Voting --> Active
        Finalizing --> Active
    end
    
    subgraph Recovery["Connection Recovery"]
        Disconnected[Disconnected]
        Reconnecting[Reconnecting]
    end
    
    Active --> |Network loss| Disconnected
    Disconnected --> |Auto retry| Reconnecting
    Reconnecting --> |Restored| Active
```

## Observer States

Observer nodes monitor without participating in consensus.

```mermaid
flowchart LR
    subgraph Normal["Normal Operation"]
        Observer((Observer))
    end
    
    subgraph Recovery["Connection Recovery"]
        Disconnected[Disconnected]
        Reconnecting[Reconnecting]
    end
    
    Observer --> |Network loss| Disconnected
    Disconnected --> |Auto retry| Reconnecting
    Reconnecting --> |Restored| Observer
```

::: tip Observer Mode
Observer nodes continuously receive and store blocks but do not participate in consensus voting.
:::

## State Descriptions

### Active (Validator)

| State | Trigger | Description |
|-------|---------|-------------|
| **Proposing** | Block slot | Creating new block proposal |
| **Voting** | Received block | Validating peer's block |
| **Finalizing** | Consensus reached | Committing finalized block |

### Observer

| State | Description |
|-------|-------------|
| **Observer** | Receiving and storing blocks |
| **Disconnected** | Network connection lost |
| **Reconnecting** | Attempting to restore connection |

## Monitoring

Check current node activity:

```bash
# Watch consensus activity
docker logs -f validator 2>&1 | grep -E "propose|vote|finalized"

# Check connection status
docker logs validator 2>&1 | grep -i "connected\|disconnected"
```

## Connection Recovery

| Scenario | Auto-Recovery |
|----------|---------------|
| Brief network drop | Yes, automatic |
| Extended outage | Yes, with resync |
| Bootstrap unreachable | Retry with backoff |

---

## Related Documentation

- [Startup States](../startup/) - Node initialization
- [Network Topology](../../network-topology/) - Node connections
- [Troubleshooting](/quick-start/troubleshooting/) - Common issues
