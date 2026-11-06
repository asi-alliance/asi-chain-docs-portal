# Sequence Diagrams

Interaction flows between the wallet and the nodes of ASI:Chain.

← [Back to Architecture Overview](/architecture/)

## Available Diagrams

### [Transaction Flow](/architecture/sequence-diagrams/transaction/)

From the moment the user sends tokens to the moment the transfer is finalized.

- Check and reserve the amount
- Sign the deploy
- Submit it to the validator
- Watch the deploy until it is finalized

### [Balance Query](/architecture/sequence-diagrams/balance/)

How the wallet reads and shows the balance of an account.

- Read-only query to the node
- Funds reserved by pending operations
- Atomic units and refresh interval

## Quick Reference

The wallet takes the address of every node role from the network configuration. See [Wallet Components](/architecture/component-diagrams/wallet/#network-connections) for the roles.

| Operation | Calls | Addresses used |
|-----------|-------|----------------|
| Send tokens | `GET /api/blocks`, `POST /api/deploy`, then `GET /api/deploy/{id}` until finalized | `ReadOnlyURL` and `ValidatorURL` |
| Deploy contract | The same calls as for sending tokens | `ReadOnlyURL` and `ValidatorURL` |
| Check balance | `POST /api/explore-deploy` | `ReadOnlyURL` |
| Transaction history | GraphQL query | `IndexerURL` |

## Next Steps

<CardGrid columns="2">
<DocCard title="Component Diagrams" href="/architecture/component-diagrams/" icon="architecture">Node, explorer and wallet components</DocCard>
<DocCard title="State Diagrams" href="/architecture/state-diagrams/" icon="diagram">Startup and runtime behavior of the Rust node</DocCard>
<DocCard title="ASI Wallet" href="/wallet/usage/" icon="wallet">How to use the wallet</DocCard>
</CardGrid>
