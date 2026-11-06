// Shown in the "Launch Modes" section of architecture/state-diagrams/startup/index.md.
// A transition label that names what the mode does is the second line of that mode, so only the four conditions that
// pick a mode stay on lines.
export default {
  kind: 'flow',
  title: 'Launch modes',
  desc: 'After launch the node picks one of four modes. With an approved block in storage it reconnects by building Casper from storage and goes to Running. With no approved block and genesis validator mode it signs the candidate genesis block and goes to Initializing. With no approved block and ceremony master mode it collects approvals, the genesis block is approved, and it goes to Running. With no approved block and no ceremony mode it joins an existing network, imports the state from the network in Initializing and goes to Running.',
  legend: true,
  legendLabels: { service: 'Launch mode', terminal: 'Start, end or Running' },
  opts: { colGaps: [148, 36, 22], rowGaps: [30, 30, 30], labelWrap: 16, wrap: 20 },
  nodes: [
    { id: 'start', label: 'Start', kind: 'terminal', col: 0, row: 0 },
    { id: 'launch', label: 'Launch', col: 0, row: 1.5 },
    { id: 'reconnect', label: 'Reconnect', sub: 'build Casper from storage', col: 1, row: 0 },
    { id: 'master', label: 'CeremonyMaster', sub: ['approvals collected,', 'genesis approved'], col: 1, row: 1 },
    { id: 'genesis', label: 'GenesisValidator', sub: ['candidate genesis', 'block signed'], col: 1, row: 2 },
    { id: 'init', label: 'Initializing', sub: ['state imported from', 'the network'], col: 1, row: 3 },
    { id: 'running', label: 'Running', kind: 'terminal', col: 2, row: 1.5 },
    { id: 'end', label: 'End', kind: 'terminal', col: 3, row: 1.5 },
  ],
  edges: [
    { from: 'start', to: 'launch' },
    { from: 'launch', to: 'reconnect', label: 'approved block in storage', via: [[0.2, 1.5], [0.2, 0]], labelAt: [0.62, 0] },
    { from: 'launch', to: 'master', label: 'no approved block, ceremony master mode', via: [[0.2, 1.5], [0.2, 1]], labelAt: [0.62, 1] },
    { from: 'launch', to: 'genesis', label: 'no approved block, genesis validator mode', via: [[0.2, 1.5], [0.2, 2]], labelAt: [0.62, 2] },
    { from: 'launch', to: 'init', label: 'no approved block, join an existing network', via: [[0.2, 1.5], [0.2, 3]], labelAt: [0.62, 3] },
    { from: 'genesis', to: 'init' },
    { from: 'reconnect', to: 'running' },
    { from: 'master', to: 'running' },
    { from: 'init', to: 'running' },
    { from: 'running', to: 'end' },
  ],
  // Phone layout: one column, the four conditions on the left trunk and the exits to Running on the right one.
  narrow: {
    opts: { colGap: 56, rowGaps: [36, 30, 30, 30, 30, 30, 30], labelWrap: 16, wrap: 20 },
    nodes: {
      start: { col: 0, row: 0 }, launch: { col: 0, row: 1 }, reconnect: { col: 0, row: 2 }, master: { col: 0, row: 3 },
      genesis: { col: 0, row: 4 }, init: { col: 0, row: 5 }, running: { col: 0, row: 6 }, end: { col: 0, row: 7 },
    },
    edges: {
      'launch>reconnect': { via: [[-2.3, 1], [-2.3, 2]], labelAt: [-1.15, 2], labelWrap: 16 },
      'launch>master': { via: [[-2.3, 1], [-2.3, 3]], labelAt: [-1.15, 3] },
      'launch>genesis': { via: [[-2.3, 1], [-2.3, 4]], labelAt: [-1.15, 4] },
      'launch>init': { via: [[-2.3, 1], [-2.3, 5]], labelAt: [-1.15, 5] },
      'reconnect>running': { via: [[0.5, 2], [0.5, 6]] },
      'master>running': { via: [[0.5, 3], [0.5, 6]] },
    },
  },
};
