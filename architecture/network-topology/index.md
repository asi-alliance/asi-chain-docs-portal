# Network Topology

Learn which role each node and service plays, which ports a node listens on by default and which of them to open in a firewall. DevNet addresses are on [Network Endpoints](/reference/endpoints/).

## Roles

| Role | Responsibility |
|---|---|
| Bootstrap peer | First contact for a joining node. Whether it takes part in the genesis ceremony depends on its configuration |
| Validator | Proposes blocks according to its bonded stake and shard admission |
| Observer | Follows chain state and serves queries without proposing blocks |
| Indexer | Reads node APIs and stores derived chain data in PostgreSQL |
| Hasura | Exposes approved database data through GraphQL |
| Applications | Wallet, SDK, CLI and faucet send requests to a node API. The wallet and SDK read history through GraphQL, and the CLI uses GraphQL only for `history` and `export` |

A bootstrap peer is not automatically a bonded validator. After the first connection every node talks to its peers through discovery, so the bootstrap peer is not a hub for traffic.

<Diagram name="network-topology" caption="Clients call the validator on ports 40403 and 40401, nodes reach each other on 40400 and 40404, and the indexer feeds Hasura through PostgreSQL." />

Applications and the indexer can talk to any node that exposes the API ports, including an observer. Balance queries (`/api/explore-deploy`) are accepted only by a read-only node or by a validator started with `--dev-mode`. The diagram shows a validator because that is the entry point of DevNet.

## Ports and Access

| Port | Protocol | Purpose | Access |
|---|---|---|---|
| 40400 | TCP | P2P transport between nodes | Open to peers |
| 40401 | TCP, gRPC | External API, Deploy service | Public behind a network ACL |
| 40402 | TCP, gRPC | Internal API: Repl, Deploy, Propose, Lsp | Private |
| 40403 | TCP, HTTP | Public HTTP API: `/api/*` including deploy submission, `/status`, `/metrics` | Public behind a gateway or ACL |
| 40404 | TCP, gRPC | Peer discovery (Kademlia) | Open to peers |
| 40405 | TCP, HTTP | Admin HTTP API, for example `/api/propose` | Private |

These are the Rust node defaults. Container ports and host mappings differ between setups, and [Node Image](/nodes/image/#default-container-ports) lists the container side.

::: warning API Listeners Are Not Local
All API listeners bind to `0.0.0.0` by default (`api-server.host`), so the node does not keep 40402 or 40405 local by itself. Restrict them with a firewall or by setting `api-server.host`. The `/metrics` route is registered on the public HTTP router, so it is reachable on 40403. A public gateway in front of the node should pass only the routes you intend to publish.
:::

## Firewall

A node that other nodes must reach needs inbound P2P and discovery:

```bash
sudo ufw allow 40400/tcp
sudo ufw allow 40404/tcp
```

::: warning Discovery Uses TCP
The node's discovery client opens a gRPC channel to `http://<host>:<discovery port>`, even though the field in the peer record is called `udp_port`. Allowing `40404/udp` does nothing for discovery.
:::

Open the API ports only when the node serves public clients, and prefer a gateway or an ACL over a bare rule:

```bash
sudo ufw allow 40403/tcp
```

Leave 40402 and 40405 closed to the outside.
