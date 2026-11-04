# Frequently asked questions

## Which container registry should I use?

Use `public.ecr.aws/l2u2v4a8/asi-chain/` and the versioned tags/digests in [container images](/general/container-images/). Pin a digest. The catalog includes the node, indexer, explorer, wallet, faucet frontend/API, wallet CLI and ASI client.

## Which node implementation is maintained?

The pure Rust source is [asi-alliance/asi-chain-rust-node](https://github.com/asi-alliance/asi-chain-rust-node). New ASI images record this source; historical images retain their original provenance. Old combined/Scala repositories and legacy deployment helpers are not the setup source for these images.

## Does a newer image mean I should upgrade?

Select the image with the target network's accepted configuration and client/API contract. The new ASI dev `e18defd4` build, historical `e6ecf238` baseline and `5dafbc37` compatibility target are distinct artifacts. Publication and packaging checks do not establish live deployment acceptance.

## Can I use a hard-coded public node IP from an older page?

Obtain current URLs and bootstrap identity from the operator. Historical IPs and observer availability are not a current network inventory. Host mappings can differ from container defaults.

## Which ports must be reachable?

Intended peers use TCP `40400` and `40404`. External gRPC and HTTP need approved client access. Keep internal gRPC, admin HTTP and `/metrics` private. See the [port table](/shard-nodes/validator-image/#default-container-ports).

## Does an observer enforce read-only API access?

Its role describes consensus behavior. API permissions and allowed routes are configured separately; do not assume all writes are rejected because it is unbonded.

## Does the explorer run the indexer?

The explorer is a frontend querying Hasura GraphQL. The separate Python indexer reads node gRPC/HTTP and stores PostgreSQL data. It does not invoke the standalone Rust CLI.

## Should I update the wallet CLI submodule with --remote?

Use `git submodule update --init --recursive` at the selected parent revision. Preserve its committed client gitlink. See [wallet CLI](/cli/usage/) for the published artifact's exact dependency.

## What amount does the wallet CLI expect?

Raw integer dust: `100000000` represents one ASI with eight decimals. Keep exact integers. Investigate an unknown transfer outcome using its original deploy ID before sending again.

## Are all portal pages verified?

See [documentation status](/general/documentation-status/). UI walkthroughs, the SDK reference and detailed transaction/state diagrams still need revision-specific review. A VitePress build validates rendering rather than API accuracy.
