# Container images

Registry snapshot checked on **2026-11-04** using ECR Public image metadata. The current namespace is **`public.ecr.aws/l2u2v4a8/asi-chain/`**. Use the versioned tags below to identify artifacts and the digests to pin them. All listed artifacts are **`linux/amd64`**.

The catalog covers eight components and nine selected artifacts, including two distinct node revisions. Older tags remain in the registry but are omitted here. Publication is not proof of deployment or compatibility for every combination.

## Published artifacts

Repository paths in the table are relative to the namespace above. Each source link pins the application revision; release packaging can add runtime configuration and provenance without changing that application's source identity.

| Component / repository | Versioned tag | Manifest digest | Public application source |
|---|---|---|---|
| Node baseline / `node-rust` | `0.4.46-dev.20261102-e6ecf23814a3` | `sha256:3c93b745dc3edbb1aa1ca8e2a3fec030cc96e016a29044b575ab549da44abab0` | [e6ecf23814a3](https://github.com/F1R3FLY-io/f1r3node-rust/tree/e6ecf23814a306e4ad9850ea44fc753f40966db8) |
| Node client-compatibility target / `node-rust` | `0.4.46-dev.20261103-5dafbc37dad3` | `sha256:e6e82cdc5c9bc794367e15314d9c22256a8ebc0b2457d9492d633b2453c4c1df` | [5dafbc37dad3](https://github.com/F1R3FLY-io/f1r3node-rust/tree/5dafbc37dad3ebf3da810641fc0d8cecd5a1127b) |
| Indexer / `indexer` | `1.0.0-dev.20261103-71e80edb0bba` | `sha256:c8312b9e073c1d133e69626a0641008418c8e0a37cf045cc2e89749b2d3b00e0` | [71e80edb0bba](https://github.com/asi-alliance/asi-chain-indexer/tree/71e80edb0bbae7dfbbab0e0393901edb70df471d) |
| Explorer frontend / `explorer` | `0.1.0-dev.20261102-0ae1eea64234` | `sha256:9e1922fd33a952ca4e8c1c68b8457745c1e7dcac44f98ba679439ce12fd2d107` | [0ae1eea64234](https://github.com/asi-alliance/asi-chain-explorer/tree/0ae1eea64234c86937b3adf39fc6a5551b228f1a) |
| Wallet frontend / `wallet` | `0.2.0-dev.20261102-b2e3a45f70d1` | `sha256:b4222f3676cb24a2c7c20fdd805aa46e5744ad2c867ff25f67e1c96554f3afa7` | [b2e3a45f70d1](https://github.com/asi-alliance/asi-chain-wallet/tree/b2e3a45f70d17c05979de38290d7a4fb7e8c42dd) |
| Faucet frontend / `faucet` | `0.0.0-dev.20261102-aaa32cd2efa8` | `sha256:a7c9c7de715e957375b38c531d27809f1beab410730a6f532e125a410571f45e` | [aaa32cd2efa8](https://github.com/asi-alliance/asi-chain-faucet/tree/aaa32cd2efa8c6ffca06013a2c25a03b60afa8c0) |
| Faucet API / `faucet-api` | `0.1.0-dev.20261103-aaa32cd2efa8` | `sha256:ee2c5a2dcb30902a8d85f1aac2a9bae0ca10248dca7a467d38a1d9a529d4a1e2` | [aaa32cd2efa8](https://github.com/asi-alliance/asi-chain-faucet/tree/aaa32cd2efa8c6ffca06013a2c25a03b60afa8c0) |
| Wallet CLI / `wallet-cli` | `0.1.0-dev.20261103-8f6c20ea43eb` | `sha256:a954cc84152aaa32c35f24d906714d9f657e112645e194e69115c87c0f75b32d` | [8f6c20ea43eb](https://github.com/asi-alliance/asi-chain-wallet-cli/tree/8f6c20ea43ebc6d333783f936372d4220e449681) |
| ASI client / `client` | `0.2.9-dev.20261103-40f2a9408040` | `sha256:f26511e261ca9d21c568b2a523fee916630ed7ac2622e65cebd2099e72db4fe7` | [40f2a9408040](https://github.com/asi-alliance/asi-chain-client/tree/40f2a9408040252dd23761cd06adb9f1407ef228) |

## Pull and inspect

For example, pull the published indexer artifact:

```bash
IMAGE=public.ecr.aws/l2u2v4a8/asi-chain/indexer@sha256:c8312b9e073c1d133e69626a0641008418c8e0a37cf045cc2e89749b2d3b00e0
docker pull --platform linux/amd64 "$IMAGE"
docker image inspect "$IMAGE" --format '{{json .Config.Labels}}'
```

Anonymous pulls do not require AWS credentials. The [ECR Public gallery](https://gallery.ecr.aws/l2u2v4a8) also exposes the public registry. Verify the source/revision labels and selected digest before writing a deployment manifest. Avoid mutable `latest` tags.

## Select compatible artifacts

- **Node baseline vs compatibility target:** `e6ecf238` and `5dafbc37` are separate published builds. The ASI client/Wallet CLI compatibility suites target the latter digest. Listing it does not promote it over the former for an existing deployment. See the [pinned client workflow](https://github.com/asi-alliance/asi-chain-client/blob/40f2a9408040252dd23761cd06adb9f1407ef228/.github/workflows/build-and-test.yml) and [wallet CLI workflow](https://github.com/asi-alliance/asi-chain-wallet-cli/blob/8f6c20ea43ebc6d333783f936372d4220e449681/.github/workflows/compatibility.yml).
- **Wallet CLI:** the `8f6c20e` image embeds ASI client gitlink `77cbdc8180d8f83a7216dbf54b23268106ea3e91`. It does not acquire later `dev` or PR changes. The standalone client image is a separate operator tool.
- **Indexer:** the `71e80ed` image includes the merged PR #20 behavior. Later API or cost-accounting candidates are separate work. PostgreSQL, migrations and Hasura metadata/permissions remain deployment inputs.
- **Faucet API:** publication of the `aaa32cd2` artifact does not establish compatibility with the client 0.2.9 / node `5dafbc37` pair. Review its own repository-local client dependency and verify funding behavior before use.

## Runtime configuration

| Artifact | Runtime contract |
|---|---|
| Node | Rust binary, role-specific configuration, persistent state and private TLS/signing inputs; see [node image](/shard-nodes/validator-image/) |
| Indexer | Explicit `NODE_HOST`, `GRPC_PORT`, `HTTP_PORT` and database settings; PostgreSQL and Hasura are separate services |
| Explorer / wallet frontends | nginx on container port `8080`; public runtime endpoint URLs; no browser-visible admin secrets |
| Faucet frontend | nginx on container port `8080`; runtime `VITE_BASE_URL` points to the faucet API |
| Faucet API | `/app/asi-faucet`, HTTP `8000` by default; explicit node/observer endpoints and protected funding key |
| Wallet CLI / ASI client | Command-line tools, no resident listener; append commands to their image entrypoints |

### Frontend URL variables

| Image | Required public runtime values |
|---|---|
| Explorer | `REACT_APP_GRAPHQL_URL` (HTTP/S, including `/v1/graphql`), `REACT_APP_GRAPHQL_WS_URL` (WS/S, including `/v1/graphql`) |
| Wallet | `WALLET_VALIDATOR_URL`, `WALLET_OBSERVER_URL`, `WALLET_INDEXER_URL` (the SDK's indexer endpoint contract) |
| Faucet frontend | `VITE_BASE_URL` (faucet API base URL) |

Wallet `REACT_APP_EXPLORER_URL` and `REACT_APP_FAUCET_URL` are optional public links. Confirm the wallet SDK's indexer route rather than assuming its URL is interchangeable with every raw GraphQL endpoint. The explorer image rejects non-empty `REACT_APP_HASURA_ADMIN_SECRET` and `REACT_APP_AUTH_TOKEN`; configure restricted public Hasura permissions or a server-side gateway instead.

The frontend images substitute endpoint URLs at startup. Supply the image-specific public URL variables, permit their startup write paths, and recreate containers when changing endpoints. Source-repository Dockerfiles can differ from these published packages; inspect the artifact before assuming a runtime configuration contract.

See [documentation status](/general/documentation-status/) for review scope and [useful links](/general/useful-links/) for public component repositories.
