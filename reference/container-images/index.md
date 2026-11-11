# Container Images

Look up the published ASI:Chain container images. Use the versioned tags to identify an artifact and the digests to pin it.

The namespace is `public.ecr.aws/l2u2v4a8/asi-chain/`, and all listed artifacts are `linux/amd64`.

The floating `dev` tags of `node-rust` and `indexer` move with every build, so do not use them. Pin the digest.

## Published Artifacts

Repository paths are relative to the namespace above. Each source link points to the exact application commit. Release packaging can add runtime configuration and provenance to the image, but the application source stays at that commit.

| Component | Repository | Source |
|---|---|---|
| ASI dev build used in the guides | `node-rust` | [8e6517d630e2](https://github.com/asi-alliance/asi-chain-rust-node/tree/8e6517d630e22c24004b7feb2d9685a44d7384d5) |
| Indexer | `indexer` | [0bb60e89db36](https://github.com/asi-alliance/asi-chain-indexer/tree/0bb60e89db364145b547e2da5dd31dbd6a2adbcd) |
| Explorer frontend | `explorer` | [0ae1eea64234](https://github.com/asi-alliance/asi-chain-explorer/tree/0ae1eea64234c86937b3adf39fc6a5551b228f1a) |
| Wallet frontend | `wallet` | [b2e3a45f70d1](https://github.com/asi-alliance/asi-chain-wallet/tree/b2e3a45f70d17c05979de38290d7a4fb7e8c42dd) |
| Faucet frontend | `faucet` | [aaa32cd2efa8](https://github.com/asi-alliance/asi-chain-faucet/tree/aaa32cd2efa8c6ffca06013a2c25a03b60afa8c0) |
| Faucet API | `faucet-api` | [aaa32cd2efa8](https://github.com/asi-alliance/asi-chain-faucet/tree/aaa32cd2efa8c6ffca06013a2c25a03b60afa8c0) |
| Wallet CLI | `wallet-cli` | [8f6c20ea43eb](https://github.com/asi-alliance/asi-chain-wallet-cli/tree/8f6c20ea43ebc6d333783f936372d4220e449681) |
| ASI client | `client` | [40f2a9408040](https://github.com/asi-alliance/asi-chain-client/tree/40f2a9408040252dd23761cd06adb9f1407ef228) |

Each line below gives the repository, the versioned tag and the manifest digest of one artifact, in the order of the table. The end of each tag matches the commit in the Source column.

```text
node-rust:0.4.46-dev.20261105-8e6517d630e2@sha256:983fa20895078bc74ad6c447dc505b5f539b54e9e2f092708f08290e09d6ea55
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

The frontend images substitute endpoint URLs at startup. Supply the image-specific public URL variables, permit their startup write paths, and recreate containers when changing endpoints. The Dockerfiles in the source repositories can differ from these published images, so inspect the artifact before you rely on its runtime configuration.

## Next Steps

<CardGrid columns="2">
  <DocCard title="Node Image" href="/nodes/image/">How to run the node image</DocCard>
  <DocCard title="Useful Links" href="/reference/links/">Public applications, packages and source repositories</DocCard>
</CardGrid>
