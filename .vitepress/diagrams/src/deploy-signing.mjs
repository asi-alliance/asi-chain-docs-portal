// Replaces the Mermaid block of phase 2 in architecture/sequence-diagrams/transaction/index.md.
export default {
  kind: 'sequence',
  title: 'Deploy signing',
  desc: 'The SDK validates the recipient address and the amount and builds the transfer term for the node profile. It asks the read-only node for the latest block number, sets validAfterBlockNumber to that number minus 1, serializes the deploy fields, hashes them with blake2b and signs the hash with secp256k1.',
  participants: [
    { id: 'sdk', label: 'SDK Client', kind: 'chain' },
    { id: 'rn', label: 'Read-only node', kind: 'chain' },
  ],
  steps: [
    { from: 'sdk', to: 'sdk', label: 'Validate the recipient address and the amount' },
    { from: 'sdk', to: 'sdk', label: 'Build the transfer term for the node profile' },
    { from: 'sdk', to: 'rn', label: 'GET /api/blocks' },
    { from: 'rn', to: 'sdk', label: 'Latest block number', reply: true },
    { from: 'sdk', to: 'sdk', label: 'validAfterBlockNumber = latest - 1' },
    { from: 'sdk', to: 'sdk', label: 'Serialize the deploy fields' },
    { from: 'sdk', to: 'sdk', label: 'Hash with blake2b and sign with secp256k1' },
  ],
  wide: { gap: 110, pad: 36, wrapMsg: 26, wrapSelf: 36 },
  narrow: { gap: 20, pad: 0, wrapMsg: 11, wrapSelf: 26, headWrap: 5 },
};
