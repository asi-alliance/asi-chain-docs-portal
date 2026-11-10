# Container Images

Look up the published ASI:Chain container images. Use the versioned tags to identify an artifact and the digests to pin it.

The current namespace is `public.ecr.aws/l2u2v4a8/asi-chain/`, and all listed artifacts are `linux/amd64`. The tags and digests were read with `docker buildx imagetools inspect` on 5 November 2026. The two node builds `2cce114` and `0ccc315` were added on 10 November 2026, and their digests were read from the registry manifests.

The catalog lists fourteen artifacts of eight components, seven of them node builds. The registry can hold more tags than the catalog, and tags are removed over time. One tag that was in the registry on 4 November 2026 was gone on 5 November 2026.

The floating `dev` tags of `node-rust` and `indexer` move with every build, so do not use them. Pin the digest. A published image is not proof that it is deployed or that every combination of images works together.

## Published Artifacts

Repository paths are relative to the namespace above. Each source link points to the exact application commit. Release packaging can add runtime configuration and provenance to the image, but the application source stays at that commit.

| Component | Repository | Source |
|---|---|---|
| Latest ASI dev build, uint256 | `node-rust` | [0ccc315d84b3](https://github.com/asi-alliance/asi-chain-rust-node/tree/0ccc315d84b32d668e8db49cd56ba3c576693e15) |
| Newer ASI dev build | `node-rust` | [2cce114a52ac](https://github.com/asi-alliance/asi-chain-rust-node/tree/2cce114a52ac1e1a85bbd03e0120de848df80d6d) |
| Guide ASI dev build | `node-rust` | [8e6517d630e2](https://github.com/asi-alliance/asi-chain-rust-node/tree/8e6517d630e22c24004b7feb2d9685a44d7384d5) |
| Previous ASI dev build | `node-rust` | [e18defd44d43](https://github.com/asi-alliance/asi-chain-rust-node/tree/e18defd44d43fe460379efefb88223797709a0cf) |
| Earlier ASI dev build | `node-rust` | [72c9126ca17b](https://github.com/asi-alliance/asi-chain-rust-node/tree/72c9126ca17b26c4b5c33b093422020cabe91f45) |
| Node baseline | `node-rust` | [e6ecf23814a3](https://github.com/F1R3FLY-io/f1r3node-rust/tree/e6ecf23814a306e4ad9850ea44fc753f40966db8) |
| Node client-compatibility target | `node-rust` | [5dafbc37dad3](https://github.com/F1R3FLY-io/f1r3node-rust/tree/5dafbc37dad3ebf3da810641fc0d8cecd5a1127b) |
| Indexer | `indexer` | [0bb60e89db36](https://github.com/asi-alliance/asi-chain-indexer/tree/0bb60e89db364145b547e2da5dd31dbd6a2adbcd) |
| Explorer frontend | `explorer` | [0ae1eea64234](https://github.com/asi-alliance/asi-chain-explorer/tree/0ae1eea64234c86937b3adf39fc6a5551b228f1a) |
| Wallet frontend | `wallet` | [b2e3a45f70d1](https://github.com/asi-alliance/asi-chain-wallet/tree/b2e3a45f70d17c05979de38290d7a4fb7e8c42dd) |
| Faucet frontend | `faucet` | [aaa32cd2efa8](https://github.com/asi-alliance/asi-chain-faucet/tree/aaa32cd2efa8c6ffca06013a2c25a03b60afa8c0) |
| Faucet API | `faucet-api` | [aaa32cd2efa8](https://github.com/asi-alliance/asi-chain-faucet/tree/aaa32cd2efa8c6ffca06013a2c25a03b60afa8c0) |
| Wallet CLI | `wallet-cli` | [8f6c20ea43eb](https://github.com/asi-alliance/asi-chain-wallet-cli/tree/8f6c20ea43ebc6d333783f936372d4220e449681) |
| ASI client | `client` | [40f2a9408040](https://github.com/asi-alliance/asi-chain-client/tree/40f2a9408040252dd23761cd06adb9f1407ef228) |

Each line below gives the repository, the versioned tag and the manifest digest of one artifact, in the order of the table. The end of each tag matches the commit in the Source column.

```text
node-rust:0.4.46-dev.20261109-0ccc315d84b3@sha256:d91e1325ca7b3aa539b6d6009b5351ce9033bce4d10c7ac58f68dbc0172b6c1b
node-rust:0.4.46-dev.20261106-2cce114a52ac@sha256:185d1db5853a5fa454fb6575238cd2bdcb948cdd772241345d4fb22414adc235
node-rust:0.4.46-dev.20261105-8e6517d630e2@sha256:983fa20895078bc74ad6c447dc505b5f539b54e9e2f092708f08290e09d6ea55
node-rust:0.4.46-dev.20261104-e18defd44d43@sha256:e06a0a4ca43d9e60309c514a19f4c664d27eb216796b9b52d1bc67c10947694e
node-rust:0.4.46-dev.20261104-72c9126ca17b@sha256:269bee1885371eb7918380984730217c36cd4d259b13ca85e579f1ba2cb5e1e8
node-rust:0.4.46-dev.20261102-e6ecf23814a3@sha256:3c93b745dc3edbb1aa1ca8e2a3fec030cc96e016a29044b575ab549da44abab0
node-rust:0.4.46-dev.20261103-5dafbc37dad3@sha256:e6e82cdc5c9bc794367e15314d9c22256a8ebc0b2457d9492d633b2453c4c1df
indexer:1.0.0-dev.20261105-0bb60e89db36@sha256:922c96e4f172c001fcda8bb331f38945b99c0435166ef0375bd75950b30b6943
explorer:0.1.0-dev.20261102-0ae1eea64234@sha256:9e1922fd33a952ca4e8c1c68b8457745c1e7dcac44f98ba679439ce12fd2d107
wallet:0.2.0-dev.20261102-b2e3a45f70d1@sha256:b4222f3676cb24a2c7c20fdd805aa46e5744ad2c867ff25f67e1c96554f3afa7
faucet:0.0.0-dev.20261102-aaa32cd2efa8@sha256:a7c9c7de715e957375b38c531d27809f1beab410730a6f532e125a410571f45e
faucet-api:0.1.0-dev.20261103-aaa32cd2efa8@sha256:ee2c5a2dcb30902a8d85f1aac2a9bae0ca10248dca7a467d38a1d9a529d4a1e2
wallet-cli:0.1.0-dev.20261103-8f6c20ea43eb@sha256:a954cc84152aaa32c35f24d906714d9f657e112645e194e69115c87c0f75b32d
client:0.2.9-dev.20261103-40f2a9408040@sha256:f26511e261ca9d21c568b2a523fee916630ed7ac2622e65cebd2099e72db4fe7
```

## Pull and Inspect

For example, pull the published indexer artifact:

```bash
IMAGE=public.ecr.aws/l2u2v4a8/asi-chain/indexer@sha256:922c96e4f172c001fcda8bb331f38945b99c0435166ef0375bd75950b30b6943
docker pull --platform linux/amd64 "$IMAGE"
docker image inspect "$IMAGE" --format '{{json .Config.Labels}}'
```

Anonymous pulls do not require AWS credentials. The ECR Public gallery at [gallery.ecr.aws/l2u2v4a8](https://gallery.ecr.aws/l2u2v4a8) also exposes the public registry. Verify the source and revision labels and the selected digest before writing a deployment manifest. Avoid mutable `latest` and `dev` tags.

## Select Compatible Artifacts

### Latest ASI Dev Node

The `0ccc315` image is the `asi-chain-rust-node` merge of upstream PR #966 and the first published build with uint256 amounts (upstream PR #881). The floating `dev` tag points to it today. The API returns amounts as decimal strings, `defaults.conf` holds the bond and price limits as strings, the block hash scheme changed, and old deploy records are quarantined. It includes the known-peers change from [PR #927](https://github.com/F1R3FLY-io/f1r3node-rust/pull/927). The published ASI client 0.2.9, the Wallet CLI and SDK 2.1.0 sign the deploy price in a field that this build reserved, so they do not work with it. Its manifest and labels were read on 10 November 2026, the image was not started, and no CI result or client check is recorded here. See [node image](/nodes/image/#build-0ccc315-with-uint256) for the changes and [Token Amounts and 18 Decimals](/reference/token-amounts/) for the amount format.

### Newer ASI Dev Node

The `2cce114` image is the `asi-chain-rust-node` merge of upstream PR #951 from 6 November, built before uint256. Its Dockerfile, entrypoint and `defaults.conf` are identical to those of `8e6517d6`. Its manifest and labels were read on 10 November 2026, and the image was not started. See [node image](/nodes/image/#build-2cce114).

### Guide ASI Dev Node

The `8e6517d6` image is the `asi-chain-rust-node` merge of upstream PR #941 ([github.com/F1R3FLY-io/f1r3node-rust/pull/941](https://github.com/F1R3FLY-io/f1r3node-rust/pull/941)), 12 commits after `e18defd4`. Its Dockerfile, entrypoint and `defaults.conf` are identical to those of `e18defd4`. Its manifest, `org.opencontainers.image.revision` label and a container start were checked on 5 November 2026. This catalog records no CI result for this exact revision and no client check against it. The instructions of [node image](/nodes/image/) are written for this build, and the published client 0.2.9 signs deploys in the format that this build accepts. It does not contain the known-peers change from PR #927, which is in `0ccc315`.

### Previous ASI Dev Node

The `e18defd4` image was compiled from a clean LF export of the ASI `dev` branch. When this entry was recorded, the [upstream CI run for this source](https://github.com/F1R3FLY-io/f1r3node-rust/actions/runs/41875249228) had failed in the casper test shard (`Test (casper 1/2)` and `Test Gate (casper)`), and the [authority adapter run](https://github.com/F1R3FLY-io/f1r3node-rust/actions/runs/41875248335) had failed too. This source does not contain the known-peers change from [PR #927](https://github.com/F1R3FLY-io/f1r3node-rust/pull/927). Checks of the client and of deployments with this image are separate and not recorded here.

### Earlier ASI Dev Node

The `72c9126` image comes from the ASI fork of the maintained pure-Rust repository. Checks of the version and help output, provenance, runtime lock and anonymous pull by digest passed. The [upstream CI run for the same source](https://github.com/F1R3FLY-io/f1r3node-rust/actions/runs/41746432130) passed the crate tests but failed the Soak Harness Tests (a CbC runtime and lockfile mismatch), and the integration gates were skipped. The separate [authority adapter run](https://github.com/F1R3FLY-io/f1r3node-rust/actions/runs/41746432069) failed as well. Client and deployment checks of older builds do not carry over to this image.

### Node Baseline and Compatibility Target

`e6ecf238` and `5dafbc37` are separate published builds. The compatibility suites of the ASI client and the Wallet CLI target `5dafbc37`. That does not make it a better choice than `e6ecf238` for an existing deployment. See the [pinned client workflow](https://github.com/asi-alliance/asi-chain-client/blob/40f2a9408040252dd23761cd06adb9f1407ef228/.github/workflows/build-and-test.yml) and [Wallet CLI workflow](https://github.com/asi-alliance/asi-chain-wallet-cli/blob/8f6c20ea43ebc6d333783f936372d4220e449681/.github/workflows/compatibility.yml).

### Wallet CLI

The `8f6c20e` image embeds the ASI client at submodule commit `77cbdc8180d8f83a7216dbf54b23268106ea3e91`. It does not acquire later `dev` or PR changes. Both the embedded client and the standalone `client` image use the node models of `5dafbc37`, so they sign the deploy price as `int64` and do not support uint256 nodes. The standalone client image is a separate operator tool, and the listed `client` tag was built from a different commit than that submodule commit. The image built from the submodule commit is tagged `0.2.9-pr3.20261103-77cbdc8180d8`, digest `sha256:b3ba6dcb31dd08b7d89c57193672947821d0c13eb65bd33527d62ada409cfc19`.

### Indexer

The `0bb60e8` image includes the merged PR #20 behavior, the PostgreSQL 18.6 and Hasura v2.51.4 upgrade (PR #25) and CI for pull requests (PR #26). PR #38 was merged on 9 November 2026 but is not in this image, and the registry has no newer indexer tag. Later API or cost-accounting candidates are separate work. PostgreSQL, migrations and the Hasura metadata and permissions remain deployment inputs.

### Faucet API

The `aaa32cd2` artifact is published, but that does not mean it works with the pair of client 0.2.9 and node `5dafbc37`. Before you use it, review its own repository-local client dependency and test that funding works.

## Runtime Configuration

| Artifact | Runtime Contract |
|---|---|
| Node | Rust binary, role-specific configuration, persistent state and private TLS and signing inputs. See [node image](/nodes/image/) |
| Indexer | Explicit `NODE_HOST`, `GRPC_PORT`, `HTTP_PORT` and database settings. PostgreSQL and Hasura are separate services |
| Explorer and wallet frontends | nginx on container port `8080`, public runtime endpoint URLs and no browser-visible admin secrets |
| Faucet frontend | nginx on container port `8080`. The runtime `VITE_BASE_URL` points to the faucet API |
| Faucet API | `/app/asi-faucet`, HTTP `8000` by default, explicit node and observer endpoints and a protected funding key |
| Wallet CLI and ASI client | Command-line tools without a resident listener. Append commands to their image entrypoints |

### Frontend URL Variables

| Image | Required Public Runtime Values |
|---|---|
| Explorer | `REACT_APP_GRAPHQL_URL` (HTTP/S, including `/v1/graphql`), `REACT_APP_GRAPHQL_WS_URL` (WS/S, including `/v1/graphql`) |
| Wallet | `WALLET_VALIDATOR_URL`, `WALLET_OBSERVER_URL`, `WALLET_INDEXER_URL` (the SDK's indexer endpoint contract) |
| Faucet frontend | `VITE_BASE_URL` (faucet API base URL) |

The other variables behave as follows:

- `REACT_APP_EXPLORER_URL` and `REACT_APP_FAUCET_URL` add optional public links to the wallet.
- `REACT_APP_RCHAIN_NODE_URL` is accepted by the explorer, but no page of this explorer image calls the node, so the variable can stay unset.
- `REACT_APP_HASURA_ADMIN_SECRET` and `REACT_APP_AUTH_TOKEN` must stay empty, because the explorer image rejects non-empty values. Configure restricted public Hasura permissions or a server-side gateway instead.

Do not assume that the Wallet SDK's indexer URL works with every raw GraphQL endpoint. Check its route first.

The frontend images substitute endpoint URLs at startup. Supply the image-specific public URL variables, permit their startup write paths, and recreate containers when changing endpoints. The Dockerfiles in the source repositories can differ from these published images, so inspect the artifact before you rely on its runtime configuration.

## Next Steps

<CardGrid columns="2">
  <DocCard title="Node Image" href="/nodes/image/">How to run the node image</DocCard>
  <DocCard title="Useful Links" href="/reference/links/">Public applications, packages and source repositories</DocCard>
</CardGrid>
