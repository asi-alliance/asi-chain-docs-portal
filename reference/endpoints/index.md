# Network Endpoints

Find the DevNet addresses of the apps and the node, and the values to enter in the wallet, the Wallet SDK and the CLI.

## Applications

| Application | URL |
|---|---|
| Wallet | [wallet.dev.asichain.io](https://wallet.dev.asichain.io) |
| Explorer | [explorer.dev.asichain.io](https://explorer.dev.asichain.io) |
| Faucet | [faucet.dev.asichain.io](https://faucet.dev.asichain.io) |
| Documentation | [docs.asichain.io](https://docs.asichain.io) |

All four answer on HTTPS. Plain HTTP is redirected to HTTPS.

## Node

DevNet has one node address, Validator 1 at `34.196.119.4`. It runs in developer mode, so it serves both reads and writes, including balance queries.

- HTTP API at `http://34.196.119.4:40403` for status, balance queries, deploy submission, deploy and block lookup.
- gRPC API at `34.196.119.4:40401` for gRPC clients.

Check that the node is reachable:

```bash
curl http://34.196.119.4:40403/api/status
```

The reply is JSON. These fields describe the network:

```json
{
  "shardId": "root",
  "minPhloPrice": "1"
}
```

The node also returns its own `address`, the `peers` count and the `nodes` count. The last two change over time.

::: warning Plain HTTP Only
The node address uses `http://`. A web page served over HTTPS cannot call it directly, because browsers block mixed content. Use it from scripts, the SDK in Node.js or the [Wallet CLI](/cli/usage/). The hosted wallet at wallet.dev.asichain.io already contains its DevNet settings, so you enter nothing there.
:::

The other ports of a node (P2P, discovery, internal gRPC and admin HTTP) are not public entry points. They are described in [Default Container Ports](/nodes/image/#default-container-ports) for the Rust image.

## Wallet and SDK Roles

The wallet and the [Wallet SDK](/wallet-sdk/overview/) take three addresses per network and a node profile. The last column gives the DevNet values for scripts, the SDK and the CLI.

| Setting | Role | DevNet Value |
|---|---|---|
| `ValidatorURL` | Receives deploys and status requests | Validator 1 HTTP API |
| `ReadOnlyURL` | Answers balance queries and deploy lookups | Validator 1 HTTP API |
| `IndexerURL` | GraphQL endpoint with transaction history | Ask the network operator |
| `nodeApiProfile` | Request format of the node | `scala` |

Deploys go to `POST /api/deploy` on `ValidatorURL`. The wallet does not fall back from `ReadOnlyURL` to `ValidatorURL`, so both must be set even when they hold the same address. For a network of your own, see [Custom Network Connection](/wallet/custom-network/).

## Next Steps

<CardGrid columns="2">
  <DocCard title="Get DevNet ASI" href="/quick-start/get-asi/">Request tokens through the faucet</DocCard>
  <DocCard title="Custom Network Connection" href="/wallet/custom-network/">Set the three addresses for a network of your own</DocCard>
  <DocCard title="Wallet SDK" href="/wallet-sdk/overview/">Use the node address from TypeScript</DocCard>
  <DocCard title="Container Images" href="/reference/container-images/">Published images, tags and digests</DocCard>
</CardGrid>
