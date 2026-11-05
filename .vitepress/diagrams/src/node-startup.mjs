// Replaces the Mermaid block in the "Startup Sequence" section of architecture/state-diagrams/startup/index.md
// and the lifecycle block in architecture/state-diagrams/index.md.
export default {
  kind: 'flow',
  title: 'Node startup',
  desc: 'The node loads its configuration, keys and storage, chooses a launch mode, starts the transport, Kademlia, gRPC and HTTP servers, and starts the node discovery and clear-connections loops. A node that is not standalone waits for its first peer connection. Then it runs engine init and reaches the Running state. If engine init fails, the node shuts down.',
  legend: true,
  opts: { colGap: 56, rowGap: 28, wrap: 26 },
  nodes: [
    { id: 'load', label: 'Load configuration, keys and storage', col: 1, row: 0 },
    { id: 'mode', label: 'Choose launch mode', col: 1, row: 1 },
    { id: 'servers', label: 'Start servers: transport, Kademlia, gRPC, HTTP', col: 1, row: 2 },
    { id: 'loops', label: 'Start node discovery and clear-connections loops', col: 1, row: 3 },
    { id: 'standalone', label: 'Standalone?', kind: 'decision', col: 1, row: 4 },
    { id: 'peer', label: 'Wait for first peer connection', col: 1, row: 5 },
    { id: 'init', label: 'Run engine init', col: 1, row: 6 },
    { id: 'running', label: 'Running', kind: 'terminal', col: 1, row: 7 },
    { id: 'down', label: 'Node shuts down', kind: 'terminal', col: 0, row: 6, wrap: 8 },
  ],
  edges: [
    { from: 'load', to: 'mode' },
    { from: 'mode', to: 'servers' },
    { from: 'servers', to: 'loops' },
    { from: 'loops', to: 'standalone' },
    { from: 'standalone', to: 'peer', label: 'No' },
    { from: 'standalone', to: 'init', label: 'Yes', via: [[2, 4], [2, 6]], labelAt: [1.5, 4] },
    { from: 'peer', to: 'init' },
    { from: 'init', to: 'running' },
    { from: 'init', to: 'down', label: 'error' },
  ],
  narrow: {
    opts: { colGap: 40, wrap: 20 },
    nodes: { down: { wrap: 7 } },
    edges: { 'standalone>init': { via: [[2, 4], [2, 6]], labelAt: [1.5, 4] } },
  },
};
