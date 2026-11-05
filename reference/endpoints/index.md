# Network Endpoints

This page lists the public DevNet addresses. Other pages link here instead of repeating them. The addresses were checked with direct requests on 5 November 2026.

::: info DevNet Runs the Scala Node
On 5 November 2026 the public DevNet node reports `RChain Node 1.0.0-SNAPSHOT (2994310d2edd)` and network ID `devnet1`. It is not the Rust node described in the [node image](/nodes/image/) guide. Clients that need to know which node dialect they talk to must be set to the Scala profile for DevNet.
:::

## Applications

| Application | URL |
|---|---|
| Wallet | [wallet.dev.asichain.io](https://wallet.dev.asichain.io) |
| Explorer | [explorer.dev.asichain.io](https://explorer.dev.asichain.io) |
| Faucet | [faucet.dev.asichain.io](https://faucet.dev.asichain.io) |
| Documentation | [docs.asichain.io](https://docs.asichain.io) |

All four answer on HTTPS. Plain HTTP is redirected to HTTPS.

## Node

DevNet has one public node address, Validator 1 at `34.196.119.4`. It runs in developer mode, so it serves both reads and writes, including balance queries. DevNet does not publish an observer address, so read from Validator 1 as well.

| Service | Address | Used For |
|---|---|---|
| HTTP API | `http://34.196.119.4:40403` | Status, balance queries, deploy submission, deploy and block lookup |
| Public gRPC API | `34.196.119.4:40401` | gRPC clients |

Check that the node is reachable:

```bash
curl http://34.196.119.4:40403/api/status
```

The reply is JSON. These fields identify the network:

```json
{
  "version": { "api": "1", "node": "RChain Node 1.0.0-SNAPSHOT (2994310d2edd764cfeb46579efdb00737e5e67b3)" },
  "networkId": "devnet1",
  "shardId": "root",
  "minPhloPrice": 1
}
```

The node also returns its own `address`, the `peers` count and the `nodes` count. The last two change over time.

::: warning Plain HTTP only
The node address uses `http://`. A web page served over HTTPS cannot call it directly, because browsers block mixed content. Use it from scripts, the SDK in Node.js or the [Wallet CLI](/cli/usage/). The hosted wallet at wallet.dev.asichain.io already contains its DevNet settings, so you enter nothing there.
:::

The other ports of a node (P2P, discovery, internal gRPC and admin HTTP) are not public entry points. They are described in the [port table](/nodes/image/) for the Rust image.

## Wallet and SDK Roles

The wallet and the [Wallet SDK](/wallet-sdk/overview/) take three addresses per network and a node profile.

| Setting | Role | DevNet Value for Scripts, SDK and CLI |
|---|---|---|
| `ValidatorURL` | Receives deploys (`POST /api/deploy`) and status requests | Validator 1 HTTP API from the table above |
| `ReadOnlyURL` | Answers balance queries and deploy lookups | The same Validator 1 HTTP API, because DevNet does not publish an observer address |
| `IndexerURL` | GraphQL endpoint with transaction history | Not published |
| `nodeApiProfile` | Request format of the node | `scala` |

The wallet does not fall back from `ReadOnlyURL` to `ValidatorURL`, so both must be set even when they hold the same address. For a network of your own, see [Custom Network](/wallet/custom-network/).

## Not Published

The GraphQL address of the indexer and the address behind the faucet are not listed here. Request tokens through the faucet at [faucet.dev.asichain.io](https://faucet.dev.asichain.io), as described in the [guide to getting DevNet ASI](/quick-start/get-asi/). If you need the indexer address for your own client, ask the network operator.

## Next Steps

<CardGrid columns="2">
  <DocCard title="Get DevNet ASI" href="/quick-start/get-asi/" icon="faucet">Request tokens through the faucet.</DocCard>
  <DocCard title="Custom Network" href="/wallet/custom-network/" icon="wallet">Set the three addresses for a network of your own.</DocCard>
  <DocCard title="Wallet SDK" href="/wallet-sdk/overview/" icon="sdk">Use the node address from TypeScript.</DocCard>
  <DocCard title="Container Images" href="/reference/container-images/" icon="image">Published images, tags and digests.</DocCard>
</CardGrid>
