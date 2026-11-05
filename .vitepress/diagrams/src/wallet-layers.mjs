// Shown in architecture/component-diagrams/wallet/index.md.
export default {
  kind: 'flow',
  title: 'Wallet layers',
  desc: 'In the browser wallet, pages use the Redux store and RTK Query, which call SdkWalletService. The service calls the SDK Client. The Client uses IndexedDB and ApiClientManager. ApiClientManager calls the validator node at ValidatorURL, the read-only node at ReadOnlyURL and the indexer at IndexerURL.',
  legend: true,
  opts: { colGaps: [70, 80], rowGaps: [30, 30, 30], wrap: 14 },
  groups: [
    { id: 'wallet', label: 'ASI Wallet (browser)', nodes: ['ui', 'redux', 'svc'] },
    { id: 'sdk', label: 'Wallet SDK', nodes: ['api', 'client', 'idb'] },
    { id: 'net', label: 'Network', nodes: ['val', 'ro', 'idx'] },
  ],
  nodes: [
    { id: 'ui', label: 'Pages (React)', col: 0, row: 0, w: 150 },
    { id: 'redux', label: 'Redux store and RTK Query', col: 0, row: 1, w: 150 },
    { id: 'svc', label: 'SdkWalletService', col: 0, row: 2, w: 150 },
    { id: 'api', label: 'ApiClientManager', kind: 'chain', col: 1, row: 1, w: 150 },
    { id: 'client', label: 'Client', kind: 'chain', col: 1, row: 2, w: 150 },
    { id: 'idb', label: 'IndexedDB', kind: 'store', col: 1, row: 3, w: 150 },
    { id: 'val', label: 'Validator node', sub: '(ValidatorURL)', kind: 'chain', col: 2, row: 0, w: 150 },
    { id: 'ro', label: 'Read-only node', sub: '(ReadOnlyURL)', kind: 'chain', col: 2, row: 1, w: 150 },
    { id: 'idx', label: 'Indexer', sub: '(IndexerURL)', col: 2, row: 2, w: 150 },
  ],
  edges: [
    { from: 'ui', to: 'redux' },
    { from: 'redux', to: 'svc' },
    { from: 'svc', to: 'client' },
    { from: 'client', to: 'api' },
    { from: 'client', to: 'idb' },
    { from: 'api', to: 'val', via: [[1.5, 1], [1.5, 0]] },
    { from: 'api', to: 'ro' },
    { from: 'api', to: 'idx', via: [[1.5, 1], [1.5, 2]] },
  ],
  narrow: {
    opts: { colGaps: [18], rowGaps: [26, 26, 66, 30, 66, 30, 30], wrap: 14 },
    nodes: {
      ui: { col: 0, row: 0, w: 150 }, redux: { col: 0, row: 1, w: 150 }, svc: { col: 0, row: 2, w: 150 },
      client: { col: 0, row: 3, w: 150 }, idb: { col: 1, row: 3, w: 100 }, api: { col: 0, row: 4, w: 150 },
      val: { col: 0, row: 5, w: 150 }, ro: { col: 0, row: 6, w: 150 }, idx: { col: 0, row: 7, w: 150 },
    },
    edges: {
      'client>api': {},
      'api>val': { via: [[0.5, 4], [0.5, 5]] },
      'api>ro': { via: [[0.5, 4], [0.5, 6]] },
      'api>idx': { via: [[0.5, 4], [0.5, 7]] },
    },
  },
};
