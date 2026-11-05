# Documentation Status

This page records what was checked against running software and published sources, and what was not. The checks were made on 5 November 2026.

## Public DevNet

The public DevNet node reports `RChain Node 1.0.0-SNAPSHOT (2994310d2edd)` and network ID `devnet1`, so it runs a Scala node. The node guides in this portal describe the Rust node and its images. An image from [Container Images](/general/container-images/) was started on a local machine. It reached the DevNet bootstrap node and found other nodes through discovery, but after 6.5 minutes it was still at `Waiting for first connection` with no peers. Treat the node guides as instructions for the Rust node, not as a way to join the public DevNet today. [Network Endpoints](/general/endpoints/) lists what DevNet offers now.

## What was checked

| Area | How it was checked |
|---|---|
| Site | The portal was built (the build fails on dead internal links and unclosed tags), and its pages were opened in a browser with the console watched for errors. |
| Container images | Tags and digests were looked up in ECR Public, and the commands on the image pages were run against the published node image. |
| Node image | The commands on the node pages were run in Docker on a local machine, apart from bonding and enrollment. |
| Wallet CLI | The published image was pulled and its commands were run against DevNet. |
| Wallet SDK | The examples were compiled against `@asichain/asi-wallet-sdk` 2.1.0, and read-only calls were made to the DevNet node. |
| Network addresses | The addresses were taken from the network team's environment description and requested directly. |
| README | The commands in README.md were run in a clean Node.js 24 container. |
| External links | Every external link was requested once. |

## Known limits

- The Wallet CLI is built for the API of the Rust node. Against the Scala node of DevNet only `create` works, while `balance` and `send` fail, because that node has no `/api/balance` endpoint and does not report a token symbol. See [Wallet CLI](/cli/usage/).
- The `history` and `export` commands of the Wallet CLI need a WebSocket address for GraphQL, which this portal does not publish.
- The commands that change the validator set, bonding and enrollment, were not run. Those pages follow the source code and `--help` output of the tools.
- Faucet requests were not made as part of the checks, apart from one request for a test wallet. The faucet page describes the behavior found in the faucet source code.
- With the `rust` profile, Wallet SDK 2.1.0 cannot read balances or send transfers, and `watchDeploy` never reports finalization. This was found on a local Rust node. See [Wallet SDK](/wallet-sdk/overview/).
- No page describes TestNet yet.

## Contributing Verified Instructions

When you add an instruction, link the source file or the command output it comes from. Keep container defaults separate from host port mappings, and run `npm run docs:build` before you open a pull request. A successful build shows that links and diagrams render. It does not show that a command works. Never publish keys, real `.env` files or administrator credentials.
