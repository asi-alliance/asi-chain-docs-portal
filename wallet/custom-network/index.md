# Custom Network Connection

The ASI Wallet at [wallet.dev.asichain.io](https://wallet.dev.asichain.io) comes with one built-in network, DevNet. To use the wallet with your own node, such as a local observer or a private shard, add a custom network on the Network Settings page. The public DevNet addresses are listed on the [Network Endpoints](/general/endpoints/) page.

## Open the Form

1. Open the wallet and unlock it.
2. Choose **Network Settings** in the menu.
3. The **Custom Network Configuration** card holds the form. The **Existing Custom Networks** card below it lists the networks you have saved.

DevNet is built into the wallet. It is not listed on this page and cannot be edited or deleted here. You select it in the network selector in the header, next to the connection status.

![Custom Network Configuration form](/images/wallet/custom-network-form.png)

## Form Fields

`Network Name` is the label shown in the network selector. It cannot be empty and must differ, ignoring case, from the name of every other network, including DevNet.

`Node API Profile` tells the wallet which node implementation answers on the URLs below. The list offers `Scala node` (stable) and `Rust node` (experimental), and the default is `Scala node`. The public DevNet currently runs a Scala node.

`Validator URL` is where the wallet sends deploys and transfers.

`Read-only URL` is where the wallet sends read queries, such as balances, deploy status and blocks. There is no fallback to the validator URL, so enter the same address again if one node serves both.

`Indexer URL` is the GraphQL endpoint the wallet reads transaction history from. The field cannot be left empty, and without a working indexer the Transactions page has no history to show.

Each URL must use `http` or `https` and contain a host. Do not add a path such as `/api`, because the wallet appends `/api/...` to the address itself. The **Direct Links** block under the fields lists the filled URLs as links, so you can open each one in a new tab.

**Save Custom Network** checks every field and shows an error next to each one that fails, for example `Network name is required.` or `Validator URL: URL must use http or https protocol`. After a successful save the form is cleared. **Clear form** does the same at any time and restores the default profile.

## Switch to the Network

After saving, the network appears in the **Existing Custom Networks** card and in the selector in the header. Saving does not switch to it, so pick it in the selector. The card of each saved network has **Edit network** and **Delete network** buttons.

The header then shows `Connected` or `Disconnected`. The wallet checks the Read-only URL with `GET <read-only-url>/api/status` when you switch and then every 60 seconds.

The networks are stored in the browser together with your wallets. Clearing the browser data removes them, and the form has to be filled in again.

## Local Node

For a node on your own machine, the values depend on the ports the node publishes. A node on the default ports, with one HTTP API on `40403` serving both reads and writes, looks like this.

| Field | Value |
| --- | --- |
| Network Name | `Local Node` |
| Node API Profile | `Rust node` or `Scala node`, as your node is built |
| Validator URL | `http://localhost:40403` |
| Read-only URL | `http://localhost:40403` |
| Indexer URL | `http://localhost:8080/v1/graphql` |

The compose files in [github.com/asi-alliance/asi-chain](https://github.com/asi-alliance/asi-chain) publish different ports. `chain/validator/validator.yml` maps the validator HTTP API to `40443`, and `chain/genesis/devnet-observer/observer.yml` maps the observer HTTP API to `40403`. Set the URLs to the port that your own compose file publishes. The compose files need their `.env` values and a bootstrap address, so start from the [observer guide](/quick-start/join-observer/) or the [validator guide](/quick-start/join-validator/) instead of running them as they are.

Check the node before you save the network.

```bash
curl -4 http://localhost:40403/api/status
```

A running node answers with JSON that contains its `version`. If the command fails, the wallet will not connect either.

The hosted wallet runs on HTTPS, and Chrome asks you for permission before it lets a public site reach `localhost`. Without that permission the requests fail with `Permission was denied for this request to access the loopback address space`, and the header shows `Disconnected`. Allow access to the local network for the wallet site in the browser, or run the wallet yourself (see [Run the Wallet Yourself](#run-the-wallet-yourself)).

The node must also answer the browser's CORS preflight. The Rust node allows any origin by default. If you put a proxy in front of the node, make sure it passes the node's CORS headers through.

## Remote Node

The hosted wallet is served over HTTPS, so the browser blocks every `http://` address except `localhost`. The console reports `Mixed Content ... This request has been blocked`, and the header shows `Disconnected`. A node on another machine therefore needs an HTTPS front, for example nginx with a certificate for its domain.

```nginx
server {
    listen 443 ssl;
    server_name node.example.com;

    ssl_certificate     /etc/nginx/certs/fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/privkey.pem;

    location /api/ {
        proxy_pass http://127.0.0.1:40403;
        proxy_set_header Host $host;
    }
}
```

`proxy_pass` has no path after the port, so nginx forwards the request path unchanged and `/api/status` reaches the node as `/api/status`. With `proxy_pass http://127.0.0.1:40403/;` nginx would cut the `/api/` prefix, so the node would receive `/deploy` instead of `/api/deploy` and answer 404. The status check would still pass, because the node also serves `/status`, and the header would show `Connected` while deploys and queries fail.

Then fill in the form with the domain only.

| Field | Value |
| --- | --- |
| Validator URL | `https://node.example.com` |
| Read-only URL | `https://node.example.com` |
| Indexer URL | `https://indexer.example.com/v1/graphql` |

Only expose the HTTP API port through the proxy. The gRPC and admin ports (`40401`, `40402` and `40405` by default) stay private.

## Troubleshooting

When the header shows `Disconnected`, open the browser console on the wallet page and look at the first error.

- `Mixed Content` means a URL starts with `http://` on a host other than `localhost`. Use an HTTPS front, as in the section above.
- `blocked by CORS policy: No 'Access-Control-Allow-Origin' header` means the node or the proxy in front of it does not send CORS headers.
- `Permission was denied for this request to access the loopback address space` means the browser has not been allowed to reach `localhost` from the wallet site.
- `404` on `/api/deploy` or `/api/explore-deploy` behind a proxy, while the header shows `Connected`, usually means that `proxy_pass` cuts the `/api/` prefix.
- A timeout means the host or port is unreachable from your machine. Test the Read-only URL, which the header checks, with `curl -4 <read-only-url>/api/status`, and the Validator URL the same way.

## Run the Wallet Yourself

A wallet served from `http://localhost:3000` talks to nodes on `localhost` without the mixed content and local network prompts. The wallet reads its built-in networks from the `NETWORKS` variable at build time, and the build fails without it. Follow the Local Development steps in the wallet repository, [github.com/asi-alliance/asi-chain-wallet](https://github.com/asi-alliance/asi-chain-wallet#local-development), and fill `NETWORKS` and the bridge variables in `.env` before `npm start`. The published Docker image always serves the networks it was built with, so your own configuration needs your own image.

## Support

- Check the DevNet state on [explorer.dev.asichain.io](https://explorer.dev.asichain.io).
- For a node you run yourself, see the [observer guide](/quick-start/join-observer/) and the [validator guide](/quick-start/join-validator/).
- For general questions, see the [FAQ](/faq/).
