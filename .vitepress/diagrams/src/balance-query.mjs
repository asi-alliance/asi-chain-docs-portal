// Replaces the Mermaid block in architecture/sequence-diagrams/balance/index.md.
export default {
  kind: 'sequence',
  title: 'Balance query',
  desc: 'The wallet page asks the SDK client for the balance of an account. The SDK validates the address, builds the Rholang term for the node profile and posts it to the explore-deploy endpoint of the read-only node. The node runs the term on the last finalized state and returns a result expression. The SDK reads it as an atomic amount and returns the balance. The wallet page subtracts the reserved funds, converts the amount to ASI and displays it.',
  participants: [
    { id: 'ui', label: 'Wallet page' },
    { id: 'sdk', label: 'SDK Client', kind: 'chain' },
    { id: 'rn', label: 'Read-only node', kind: 'chain' },
  ],
  steps: [
    { from: 'ui', to: 'sdk', label: 'Balance of the account' },
    { from: 'sdk', to: 'sdk', label: 'Validate the address' },
    { from: 'sdk', to: 'sdk', label: 'Build the Rholang term for the node profile' },
    { from: 'sdk', to: 'rn', label: 'POST /api/explore-deploy' },
    { from: 'rn', to: 'rn', label: 'Run the term on the last finalized state' },
    { from: 'rn', to: 'sdk', label: 'Result expression', reply: true },
    { from: 'sdk', to: 'sdk', label: 'Read the result as an atomic amount' },
    { from: 'sdk', to: 'ui', label: 'Balance', reply: true },
    { from: 'ui', to: 'ui', label: 'Subtract reserved funds' },
    { from: 'ui', to: 'ui', label: 'Convert to ASI and display' },
  ],
  wide: { gap: 110, pad: 36, wrapMsg: 26, wrapSelf: 24 },
  narrow: { gap: 20, pad: 0, wrapMsg: 11, wrapSelf: 26, headWrap: 5 },
};
