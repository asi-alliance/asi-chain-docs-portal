# State Diagrams

These pages show how the Rust node from [github.com/asi-alliance/asi-chain-rust-node](https://github.com/asi-alliance/asi-chain-rust-node) starts and what it does once it is running.

← [Back to Architecture Overview](/architecture/)

## Pages

- [Node Startup](/architecture/state-diagrams/startup/) covers the steps from process start to the Running state and the four launch modes.
- [Running Node](/architecture/state-diagrams/operations/) covers what a validator and a read-only node do after startup.

## Lifecycle

The node has no single state machine for startup. It runs a fixed sequence of steps, and the launch mode it picks after loading storage decides how it reaches the Running state.

A node started with `--standalone` skips the wait for the first peer. Once the node is Running, `GET /api/ready` returns 200 and `GET /api/status` reports `"isReady": true`.

## Check the Current State

```bash
# Readiness probe: 200 when Running, 503 before that
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:40403/api/ready

# Role and readiness
curl -s http://localhost:40403/api/status

# Log line written on the transition
docker logs <container> 2>&1 | grep "transition to Running"
```

## Next Steps

<CardGrid columns="2">
<DocCard title="Component Diagrams" href="/architecture/component-diagrams/">Node, explorer and wallet components</DocCard>
<DocCard title="Sequence Diagrams" href="/architecture/sequence-diagrams/">Interaction flows between the wallet and the nodes</DocCard>
<DocCard title="Troubleshooting" href="/help/troubleshooting/">Checks for common node and wallet problems</DocCard>
</CardGrid>
