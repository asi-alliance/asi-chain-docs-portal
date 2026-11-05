// Shown in architecture/sequence-diagrams/transaction/index.md (phase 4).
export default {
  kind: 'sequence',
  title: 'Deploy status polling',
  desc: 'Every 5 seconds, up to 180 seconds, the SDK asks the read-only node for the deploy and receives deploy info or an error. Then the SDK tells the wallet that the deploy is finalized, failed or timed out, and the wallet refreshes the balance and the history.',
  participants: [
    { id: 'w', label: 'Wallet' },
    { id: 'sdk', label: 'SDK Client', kind: 'chain' },
    { id: 'rn', label: 'Read-only node', kind: 'chain' },
  ],
  steps: [
    { frame: 'loop', label: 'Every 5 seconds, up to 180 seconds', steps: [
      { from: 'sdk', to: 'rn', label: 'GET /api/deploy/{id}' },
      { from: 'rn', to: 'sdk', label: 'Deploy info or error', reply: true },
    ] },
    { from: 'sdk', to: 'w', label: 'Finalized, error or timeout', reply: true },
    { from: 'w', to: 'w', label: 'Refresh balance and history' },
  ],
  wide: { gap: 110, pad: 36, wrapMsg: 26, wrapSelf: 24, headWrap: 14 },
  narrow: { gap: 20, pad: 0, wrapMsg: 11, wrapSelf: 26, headWrap: 5 },
};
