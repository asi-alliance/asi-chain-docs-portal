// Shown in architecture/sequence-diagrams/transaction/index.md (phase 1).
export default {
  kind: 'sequence',
  title: 'Check and reserve',
  desc: 'The user enters the recipient and amount in the wallet. The wallet calls transfer on the SDK client. If the session is locked or the policy asks for a password on every signature, the SDK asks the wallet for a password and the user provides it. The SDK computes pending as amount plus maximum fee, queries the balance from the read-only node through explore-deploy, and checks that the balance minus reserved funds covers pending.',
  participants: [
    { id: 'u', label: 'User', kind: 'external' },
    { id: 'w', label: 'Wallet' },
    { id: 'sdk', label: 'SDK Client', kind: 'chain' },
    { id: 'rn', label: 'Read-only node', kind: 'chain' },
  ],
  steps: [
    { from: 'u', to: 'w', label: 'Enter recipient and amount' },
    { from: 'w', to: 'sdk', label: 'transfer(account, recipient, amount)' },
    { frame: 'opt', label: 'Session is locked or the policy asks for a password on every signature', steps: [
      { from: 'sdk', to: 'w', label: 'Password required', reply: true },
      { from: 'w', to: 'u', label: 'Request password' },
      { from: 'u', to: 'w', label: 'Provide password' },
    ] },
    { from: 'sdk', to: 'sdk', label: 'pending = amount + maximum fee' },
    { from: 'sdk', to: 'rn', label: 'Query balance (explore-deploy)' },
    { from: 'rn', to: 'sdk', label: 'Balance', reply: true },
    { from: 'sdk', to: 'sdk', label: 'Balance minus reserved funds covers pending?' },
  ],
  wide: { gap: 110, pad: 36, wrapMsg: 26, wrapSelf: 24 },
  narrow: { gap: 20, pad: 0, wrapMsg: 11, wrapSelf: 26, headWrap: 5 },
};
