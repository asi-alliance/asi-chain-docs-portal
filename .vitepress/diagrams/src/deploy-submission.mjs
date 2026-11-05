// Shown in architecture/sequence-diagrams/transaction/index.md (phase 3).
// The alt frame shows the three outcomes that the text under the diagram describes.
export default {
  kind: 'sequence',
  title: 'Deploy submission',
  desc: 'The SDK saves the reservation in local storage and posts the signed deploy to the validator node. The node checks the signature, the price and the term. If it accepts the deploy it returns the deploy ID, and the wallet uses the signature as the deploy ID. If it refuses the deploy with a 4xx answer, the SDK releases the reservation. If the outcome is unknown, for example after a network error, the reservation stays.',
  participants: [
    { id: 'sdk', label: 'SDK Client', kind: 'chain' },
    { id: 'st', label: 'Local storage (IndexedDB)', kind: 'store' },
    { id: 'vn', label: 'Validator node', kind: 'chain' },
  ],
  steps: [
    { from: 'sdk', to: 'st', label: 'Save the reservation' },
    { from: 'sdk', to: 'vn', label: 'POST /api/deploy' },
    { from: 'vn', to: 'vn', label: 'Check the signature, the price and the term' },
    { frame: 'alt', label: 'The node accepts the deploy', steps: [
      { from: 'vn', to: 'sdk', label: 'Deploy ID', reply: true },
      { note: 'The wallet uses the signature as the deploy ID', over: ['sdk', 'st'] },
    ], else: [
      { label: 'The node refuses with a 4xx answer', steps: [
        { from: 'vn', to: 'sdk', label: '4xx answer', reply: true },
        { from: 'sdk', to: 'st', label: 'Release the reservation' },
      ] },
      { label: 'The outcome is unknown, for example a network error', steps: [
        { note: 'The reservation stays, because the deploy may still reach the network', over: ['sdk', 'st'] },
      ] },
    ] },
  ],
  wide: { gap: 120, pad: 36, wrapMsg: 26, wrapSelf: 24, headWrap: 14 },
  narrow: { gap: 20, pad: 0, wrapMsg: 11, wrapSelf: 26, headWrap: 5 },
};
