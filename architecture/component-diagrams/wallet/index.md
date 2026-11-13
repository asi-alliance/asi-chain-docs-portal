# Wallet Components

The ASI Wallet is a browser-based React application for managing accounts and sending transactions. Account calls to the network go through the [Wallet SDK](/wallet-sdk/overview/), which signs deploys, keeps wallets in the browser and calls the node and the indexer.

← [Back to Component Diagrams](/architecture/component-diagrams/)

## Layers

<Diagram name="wallet-layers" caption="How a call travels from the wallet pages through the Redux store and the SDK to the nodes and the indexer." />

| Layer | What it does |
|-------|--------------|
| Pages | Screens the user sees and the forms on them |
| Redux store and RTK Query | Wallet list, selected network and account, auth state, theme, cached balances and history |
| `SdkWalletService` | The wallet's only entry point to the SDK |
| `Client` | Creates and unlocks wallets, signs and submits deploys, reads balances, watches deploy status |
| `ApiClientManager` | Holds one HTTP client per node role |

React components do not call the SDK client directly. A page dispatches a Redux thunk or uses an RTK Query hook, and the thunk calls `SdkWalletService`.

## Pages

| Page | Purpose |
|------|---------|
| Login | Unlock the wallet with a password |
| Dashboard | Balance of the selected account and quick actions |
| Accounts | Account management |
| Send | Send tokens to another address |
| Receive | Show the address of the selected account |
| History | Transaction history of the account |
| Deploy | Deploy Rholang code to the selected network |
| Settings | Network and application settings |

## State

| Slice | Data managed |
|-------|--------------|
| `walletsStore` | Wallet metadata, selected account, configured networks, selected network, deploys being watched |
| `walletsApi` | Balances and transaction history, fetched through the SDK and cached for 30 seconds |
| `auth` | Whether the wallet is unlocked |
| `theme` | Light or dark theme |
| `networkActivity` | Whether a network operation is running and which networks are busy |
| `sdkClient` | Whether the SDK client is pending, ready or failed |

## Storage

| Data | Where it lives |
|------|----------------|
| Wallets, accounts, custom networks, signer material | IndexedDB, managed by the SDK. Keys are encrypted with the wallet password |
| Selected network and account, theme, Deploy page files | `localStorage` |
| Balances and transaction history | Not stored. Kept only in the RTK Query cache in memory and fetched again after a reload |

A private key never reaches Redux. It is decrypted inside the SDK only for the moment of signing.

## Network Connections

The SDK reads three addresses and a node profile for every network from its configuration (see [Custom Network](/wallet/custom-network/) and the [SDK overview](/wallet-sdk/overview/)).

| Setting | Meaning |
|---------|---------|
| `ValidatorURL` | Node that accepts signed deploys |
| `ReadOnlyURL` | Node that answers balance queries and deploy status. There is no fallback to `ValidatorURL` |
| `IndexerURL` | GraphQL endpoint with transaction history |
| `nodeApiProfile` | `scala` or `rust`. It selects the Rholang terms, the request body of balance queries and the finalization threshold |

The preinstalled network of the hosted wallet uses addresses that are built into the application. For the endpoints of DevNet, see [Network Endpoints](/reference/endpoints/).

Which call goes to which address:

| Operation | Request | Address |
|-----------|---------|---------|
| Balance | `POST /api/explore-deploy` | `ReadOnlyURL` |
| Block number (before signing) | `GET /api/blocks` | `ReadOnlyURL` |
| Send tokens or deploy code | `POST /api/deploy` | `ValidatorURL` |
| Deploy status | `GET /api/deploy/{id}` | `ReadOnlyURL` |
| Transaction history | GraphQL query | `IndexerURL` |

Balance queries run as exploratory deploys, and a node accepts them only if it is read-only or started in developer mode. A validator without developer mode answers `readonly_node_required`, so `ReadOnlyURL` has to point at a read-only node.

## Next Steps

<CardGrid columns="2">
<DocCard title="ASI Wallet" href="/wallet/usage/">How to use the wallet</DocCard>
<DocCard title="Balance Query Flow" href="/architecture/sequence-diagrams/balance/">How the balance is read</DocCard>
<DocCard title="Transaction Flow" href="/architecture/sequence-diagrams/transaction/">Transaction lifecycle</DocCard>
<DocCard title="Wallet SDK" href="/wallet-sdk/overview/">The library under the wallet</DocCard>
</CardGrid>
