// Replaces the Mermaid block in architecture/index.md.
export default {
  kind: 'flow',
  title: 'Architecture overview',
  desc: 'The web wallet and SDK call the node over HTTP, and the Wallet CLI and the faucet API call it over gRPC or HTTP. The faucet frontend calls the faucet API. The Python indexer reads the node over gRPC or HTTP and writes to PostgreSQL. Hasura reads PostgreSQL and serves GraphQL to the explorer frontend and the web wallet.',
  legend: true,
  opts: { colGaps: [104, 104, 72], rowGaps: [44, 44], wrap: 12, labelWrap: 12 },
  nodes: [
    { id: 'wallet', label: 'Web wallet / SDK', col: 0, row: 0 },
    { id: 'cli', label: 'Wallet CLI / ASI client', col: 0, row: 1 },
    { id: 'faucetWeb', label: 'Faucet frontend', col: 0, row: 2 },
    { id: 'faucet', label: 'Faucet API', col: 1, row: 2 },
    { id: 'node', label: 'Node', kind: 'chain', col: 1, row: 1 },
    { id: 'explorer', label: 'Explorer frontend', col: 2, row: 0 },
    { id: 'indexer', label: 'Python indexer', col: 2, row: 1 },
    { id: 'hasura', label: 'Hasura GraphQL', col: 3, row: 0 },
    { id: 'db', label: 'PostgreSQL', kind: 'store', col: 3, row: 1 },
  ],
  edges: [
    { from: 'wallet', to: 'node', label: 'HTTP' },
    { from: 'cli', to: 'node', label: 'gRPC / HTTP' },
    { from: 'indexer', to: 'node', label: 'gRPC / HTTP' },
    { from: 'indexer', to: 'db', label: 'writes' },
    { from: 'hasura', to: 'db', label: 'reads' },
    { from: 'explorer', to: 'hasura', label: 'GraphQL' },
    { from: 'wallet', to: 'hasura', label: 'GraphQL', via: [[0, -0.5], [3, -0.5]] },
    { from: 'faucet', to: 'node', label: 'gRPC / HTTP' },
    { from: 'faucetWeb', to: 'faucet', label: 'HTTP' },
  ],
  // Phone layout: two columns, the node on the left with its four callers around it.
  narrow: {
    opts: { colGaps: [80], rowGaps: [44, 36, 44, 44, 44], wrap: 12, labelWrap: 8 },
    nodes: {
      explorer: { col: 1, row: 0 },
      wallet: { col: 0, row: 1 }, hasura: { col: 1, row: 1, wrap: 8 },
      db: { col: 1, row: 2 },
      node: { col: 0, row: 3, w: 130 }, indexer: { col: 1, row: 3, wrap: 8 },
      faucet: { col: 1, row: 4 },
      cli: { col: 0, row: 5 }, faucetWeb: { col: 1, row: 5, wrap: 8 },
    },
    edges: {
      'wallet>hasura': {},
      'faucet>node': { toOff: 35 },
      'cli>node': { fromOff: -35, toOff: -35 },
    },
  },
};
