// Replaces the Mermaid block in the "Deploy Lifecycle" section of architecture/data-flow/index.md.
export default {
  kind: 'flow',
  title: 'Deploy lifecycle',
  desc: 'A client signs a deploy and posts it to the node, where it waits in the pending deploy pool. When the proposer runs with its constraints met, a validator creates and signs a block. The Rholang of the deploy is executed in RSpace++ and the block is broadcast to peers. The peers validate it and the block enters the DAG. The clique oracle then finalizes the block.',
  opts: { colGaps: [120, 120], rowGaps: [64], labelWrap: 16 },
  nodes: [
    { id: 'client', label: 'Client signs deploy', col: 0, row: 0, wrap: 12 },
    { id: 'pool', label: 'Pending deploy pool', col: 1, row: 0, wrap: 12 },
    { id: 'block', label: 'Block created and signed', col: 2, row: 0, wrap: 12 },
    { id: 'broadcast', label: 'Broadcast to peers', col: 2, row: 1, wrap: 12 },
    { id: 'dag', label: 'Block in the DAG', col: 1, row: 1, wrap: 12 },
    { id: 'final', label: 'Block finalized', kind: 'chain', col: 0, row: 1, wrap: 12 },
  ],
  edges: [
    { from: 'client', to: 'pool', label: 'POST /api/deploy' },
    { from: 'pool', to: 'block', label: 'proposer runs with constraints met' },
    { from: 'block', to: 'broadcast', label: 'Rholang executed in RSpace++' },
    { from: 'broadcast', to: 'dag', label: 'peers validate' },
    { from: 'dag', to: 'final', label: 'clique oracle' },
  ],
  narrow: {
    opts: { colGaps: [], rowGaps: [48, 52, 52, 40, 40], labelWrap: 30 },
    nodes: {
      client: { col: 0, row: 0, wrap: 20 }, pool: { col: 0, row: 1, wrap: 20 }, block: { col: 0, row: 2, wrap: 20 },
      broadcast: { col: 0, row: 3, wrap: 20 }, dag: { col: 0, row: 4, wrap: 20 }, final: { col: 0, row: 5, wrap: 20 },
    },
  },
};
