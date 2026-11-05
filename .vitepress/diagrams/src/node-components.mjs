// Shown in architecture/component-diagrams/node/index.md.
export default {
  kind: 'flow',
  title: 'Node components',
  desc: 'Three interfaces sit on top of the Rust node. Transport on 40400 and discovery on 40404 go to comm. The gRPC ports 40401 and 40402 and the HTTP ports 40403 and 40405 go to the node crate, which uses casper and comm. Casper uses rholang, block-storage, comm and the shared crates. Rholang uses rspace++, and block-storage uses the shared crates.',
  opts: { colGaps: [44, 44], colGap: 40, rowGaps: [44, 50, 50, 50], wrap: 18 },
  groups: [
    { id: 'interfaces', label: 'Interfaces', nodes: ['p2p', 'grpc', 'http'] },
  ],
  nodes: [
    { id: 'p2p', label: 'Transport 40400, discovery 40404', col: 0, row: 0 },
    { id: 'grpc', label: 'gRPC 40401 external, 40402 internal', col: 1, row: 0 },
    { id: 'http', label: 'HTTP 40403 public, 40405 admin', col: 2, row: 0 },
    { id: 'node', label: 'node: runtime, API servers, web routes', kind: 'chain', col: 1.5, row: 1 },
    { id: 'comm', label: 'comm: transport, Kademlia, TLS', kind: 'chain', col: 0, row: 2 },
    { id: 'casper', label: 'casper: engine, proposer, validation, finality', kind: 'chain', col: 1.5, row: 2 },
    { id: 'rholang', label: 'rholang: interpreter', kind: 'chain', col: 1, row: 3 },
    { id: 'blocks', label: 'block-storage: blocks and DAG on LMDB', kind: 'store', col: 2, row: 3 },
    { id: 'common', label: 'models, crypto, shared', col: 2, row: 4 },
    { id: 'rspace', label: 'rspace++: tuple space', kind: 'store', col: 1, row: 4 },
  ],
  edges: [
    { from: 'p2p', to: 'comm', fromOff: -14, toOff: -14 },
    { from: 'grpc', to: 'node' },
    { from: 'http', to: 'node' },
    { from: 'node', to: 'casper' },
    { from: 'node', to: 'comm', via: [[0, 1]], toOff: 14 },
    { from: 'casper', to: 'comm' },
    { from: 'casper', to: 'rholang' },
    { from: 'casper', to: 'blocks' },
    { from: 'casper', to: 'common', via: [[2.5, 2], [2.5, 4]] },
    { from: 'rholang', to: 'rspace' },
    { from: 'blocks', to: 'common' },
  ],
  // Phone layout: two columns, the interface nodes first. Edges that would cross a node use the gap between the columns (0.5).
  narrow: {
    opts: { colGaps: [20], rowGaps: [34, 44, 36, 36, 36], wrap: 14 },
    groups: { interfaces: { pad: { l: 14, r: 14 } } },
    nodes: {
      p2p: { col: 0, row: 0, w: 130 }, grpc: { col: 1, row: 0, w: 130 }, http: { col: 1, row: 1, w: 130 },
      comm: { col: 0, row: 2, w: 130 }, node: { col: 1, row: 2, w: 130 },
      casper: { col: 1, row: 3, w: 130 },
      rholang: { col: 0, row: 4, w: 130 }, blocks: { col: 1, row: 4, w: 130 },
      rspace: { col: 0, row: 5, w: 130 }, common: { col: 1, row: 5, w: 130 },
    },
    edges: {
      'p2p>comm': { fromOff: 0, toOff: 0 },
      'grpc>node': { via: [[0.5, 0], [0.5, 2]], toOff: -12 },
      'http>node': {},
      'node>comm': { fromOff: 12, toOff: 12 },
      'casper>common': { via: [[0.5, 3], [0.5, 5]] },
    },
  },
};
