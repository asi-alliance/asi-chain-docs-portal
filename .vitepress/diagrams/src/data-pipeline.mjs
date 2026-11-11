// Shown in the "Indexing Path" section of architecture/data-flow/index.md.
export default {
  kind: 'flow',
  title: 'Data pipeline',
  desc: 'The Python indexer reads the node over gRPC and HTTP and writes indexed rows to PostgreSQL. Hasura serves authorized queries from PostgreSQL and returns GraphQL responses to the explorer frontend and to the wallet and SDK. The wallet and SDK also read the node directly over HTTP.',
  legend: true,
  opts: { colGaps: [110, 110], rowGaps: [60, 50], labelWrap: 12 },
  nodes: [
    { id: 'node', label: 'Node', kind: 'chain', col: 0, row: 0 },
    { id: 'indexer', label: 'Python indexer', col: 1, row: 0, wrap: 14 },
    { id: 'db', label: 'PostgreSQL', kind: 'store', col: 2, row: 0 },
    { id: 'wallet', label: 'Wallet / SDK', col: 0, row: 1 },
    { id: 'hasura', label: 'Hasura GraphQL', col: 2, row: 1, wrap: 8 },
    { id: 'explorer', label: 'Explorer frontend', col: 2, row: 2, wrap: 10 },
  ],
  edges: [
    { from: 'node', to: 'indexer', label: 'gRPC / HTTP responses' },
    { from: 'indexer', to: 'db', label: 'indexed rows' },
    { from: 'db', to: 'hasura', label: 'authorized queries', labelWrap: 20 },
    { from: 'hasura', to: 'explorer', label: 'GraphQL responses', labelWrap: 20 },
    { from: 'hasura', to: 'wallet', label: 'GraphQL responses', labelWrap: 20 },
    { from: 'node', to: 'wallet', label: 'HTTP responses', labelWrap: 20 },
  ],
  narrow: {
    opts: { colGaps: [70], rowGaps: [56, 56, 56], labelWrap: 9 },
    nodes: {
      node: { col: 0, row: 0 }, indexer: { col: 1, row: 0 }, db: { col: 1, row: 1 },
      hasura: { col: 1, row: 2 }, explorer: { col: 1, row: 3 }, wallet: { col: 0, row: 2 },
    },
    edges: {
      'node>wallet': { labelAt: [0, 1], labelWrap: 14 },
      'db>hasura': { labelWrap: 20 },
      'hasura>explorer': { labelWrap: 20 },
      'hasura>wallet': { labelWrap: 9 },
      'indexer>db': { labelWrap: 20 },
    },
  },
};
