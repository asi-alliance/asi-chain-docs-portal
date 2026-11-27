# Network Endpoints

Find the DevNet applications and the network settings that the wallet and the Wallet SDK take.

## Applications

| Application | URL |
|---|---|
| Wallet | [wallet.dev.asichain.io](https://wallet.dev.asichain.io) |
| Explorer | [explorer.dev.asichain.io](https://explorer.dev.asichain.io) |
| Faucet | [faucet.dev.asichain.io](https://faucet.dev.asichain.io) |
| Documentation | [docs.asichain.io](https://docs.asichain.io) |

All four answer on HTTPS. Plain HTTP is redirected to HTTPS.

## Wallet and SDK Roles

The wallet and the [Wallet SDK](/wallet-sdk/overview/) take three addresses per network and a node profile.

| Setting | Role |
|---|---|
| `ValidatorURL` | Receives deploys and status requests |
| `ReadOnlyURL` | Answers balance queries and deploy lookups |
| `IndexerURL` | GraphQL endpoint with transaction history |
| `nodeApiProfile` | Request format of the node, `rust` on DevNet |

Deploys go to `POST /api/deploy` on `ValidatorURL`. The wallet does not fall back from `ReadOnlyURL` to `ValidatorURL`, so both must be set even when they hold the same address. For a network of your own, see [Custom Network Connection](/wallet/custom-network/).

## Next Steps

<CardGrid columns="2">
  <DocCard title="Get DevNet ASI" href="/quick-start/get-asi/">Request tokens through the faucet</DocCard>
  <DocCard title="Custom Network Connection" href="/wallet/custom-network/">Set the three addresses for a network of your own</DocCard>
  <DocCard title="Wallet SDK" href="/wallet-sdk/overview/">Connect to a network from TypeScript</DocCard>
  <DocCard title="Container Images" href="/reference/container-images/">Published images, tags and digests</DocCard>
</CardGrid>
