# Container Images

Look up the published ASI:Chain container images. Use the versioned tags to identify an artifact and the digests to pin it.

The namespace is `public.ecr.aws/l2u2v4a8/asi-chain/`, and all listed artifacts are `linux/amd64`.

The floating `dev` tags of `node-rust` and `indexer` move with every build, so do not use them. Pin the digest.

## Published Artifacts

Repository paths are relative to the namespace above. Each source link points to the exact application commit. Release packaging can add runtime configuration and provenance to the image, but the application source stays at that commit.

| Component | Repository | Source |
|---|---|---|
| Node | `node-rust` | [d57a3f450151](https://github.com/asi-alliance/asi-chain-rust-node/tree/d57a3f4501513c699887af6e457607bc928c8faa) |
| Indexer | `indexer` | [69150e125e62](https://github.com/asi-alliance/asi-chain-indexer/tree/69150e125e62360e66f9e7ff2bcf616c07db3854) |
| Explorer frontend | `explorer` | [0dcafbf3b28c](https://github.com/asi-alliance/asi-chain-explorer/tree/0dcafbf3b28c898c907996c33cb679b65edf54c1) |
| Wallet frontend | `wallet` | [b2e3a45f70d1](https://github.com/asi-alliance/asi-chain-wallet/tree/b2e3a45f70d17c05979de38290d7a4fb7e8c42dd) |
| Faucet frontend | `faucet` | [d2d271d27e93](https://github.com/asi-alliance/asi-chain-faucet/tree/d2d271d27e93936624e5ed3c6e0e4200605a6299) |
| Faucet API | `faucet-api` | [0487b1f366a6](https://github.com/asi-alliance/asi-chain-faucet/tree/0487b1f366a6f42b4c715d89a5f2668069edde06) |
| Wallet CLI | `wallet-cli` | [971f6ba2ac85](https://github.com/asi-alliance/asi-chain-wallet-cli/tree/971f6ba2ac852073699c4666eb9ec49444cc75fe) |
| ASI client | `client` | [5d1c9b4d12e3](https://github.com/asi-alliance/asi-chain-client/tree/5d1c9b4d12e33ec8b64a74a28df196ef03478e73) |

Each line below gives the repository, the versioned tag and the manifest digest of one artifact, in the order of the table. The end of each tag matches the commit in the Source column.

```text
node-rust:0.4.46-dev.20261113-d57a3f450151@sha256:f46bc3542ae9cab873f3a6e4f40651546bfeba47fb3d1d65966564b18d3123b6
indexer:1.0.0-dev.20261113-69150e125e62@sha256:ceb270182ac547eb2fc39776ed399ba36ef993fc3c5d3f4e55cd585dbaf2db35
explorer:0.1.0-dev.20261112-0dcafbf3b28c@sha256:9b0f3a41e81c1814d330cac4d15bfa5d21972d39a2a622c3da6b1bca02869de0
wallet:0.2.0-dev.20261102-b2e3a45f70d1@sha256:b4222f3676cb24a2c7c20fdd805aa46e5744ad2c867ff25f67e1c96554f3afa7
faucet:0.1.0-dev.20261111-d2d271d27e93@sha256:8dee8d04ab9b230c052ec79c20fafd7f72af1cf7dcdf8ee1ab30a9eb044271df
faucet-api:0.1.0-dev.20261112-0487b1f366a6@sha256:e0fd2cf9262004af88428bdd5d6e0db5d0d4f162d2adf3f59c96b101323e7c35
wallet-cli:0.1.0-dev.20261112-971f6ba2ac85@sha256:c05db1874773b0e740299439e3e900852ae341f5f8bda228234f6835c40cc252
client:0.2.7-rust-dev.20261111-5d1c9b4d12e3@sha256:5b192be72df772f2a0f446245d583f1f916e970b8a6fd6ad97d32b0ab8ef20f4
```

## Pull and Inspect

For example, pull the published indexer artifact:

```bash
IMAGE=public.ecr.aws/l2u2v4a8/asi-chain/indexer@sha256:ceb270182ac547eb2fc39776ed399ba36ef993fc3c5d3f4e55cd585dbaf2db35
docker pull --platform linux/amd64 "$IMAGE"
docker image inspect "$IMAGE" --format '{{json .Config.Labels}}'
```

Anonymous pulls do not require AWS credentials. The ECR Public gallery at [gallery.ecr.aws/l2u2v4a8](https://gallery.ecr.aws/l2u2v4a8) also exposes the public registry. Verify the source and revision labels and the selected digest before writing a deployment manifest. Avoid mutable tags such as `dev`.

## Runtime Configuration

| Artifact | Runtime Contract |
|---|---|
| Node | Rust binary, role-specific configuration, persistent state and private TLS and signing inputs. See [node image](/nodes/image/) |
| Indexer | `NODE_HOST`, `GRPC_PORT`, `HTTP_PORT` and the database settings. Without them the indexer connects to `localhost`. It serves its status on port `9090`. PostgreSQL and Hasura are separate services |
| Explorer and wallet frontends | nginx on container port `8080`, public runtime endpoint URLs and no browser-visible admin secrets |
| Faucet frontend | nginx on container port `8080`. `VITE_BASE_URL` points to the faucet API and is required |
| Faucet API | `/app/asi-faucet`, HTTP `8000` by default, the variables listed below and a protected funding key |
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
- `INDEXER_STATUS_URL` is the indexer status endpoint that the explorer proxies to `/api/indexer/status`. It must be an HTTP or HTTPS URL that ends in `/status`. The default is `http://host.docker.internal:9090/status`, and without a reachable indexer the status page of the explorer is unavailable.
- `REACT_APP_INDEXER_API_URL` is `/api/indexer` by default.
- `REACT_APP_HASURA_ADMIN_SECRET` and `REACT_APP_AUTH_TOKEN` do not reach the browser, because the explorer sends no admin secret or bearer token. Configure restricted Hasura permissions or a server-side gateway instead.

The frontend images substitute endpoint URLs at startup. Supply the image-specific public URL variables, permit their startup write paths, and recreate containers when changing endpoints. The Dockerfiles in the source repositories can differ from these published images, so inspect the artifact before you rely on its runtime configuration.

### Faucet API Variables

| Variable | Meaning |
|---|---|
| `PRIVATE_KEY` | Funding key of the faucet. Without it the process exits with `PRIVATE_KEY environment variable is required` |
| `NODE_HOSTS`, `NODE_GRPC_PORTS`, `NODE_HTTP_PORTS` | Nodes that receive the transfers, as lists of equal length |
| `OBSERVER_HOST`, `OBSERVER_GRPC_PORT`, `OBSERVER_HTTP_PORT` | Read-only node that answers balance queries |
| `FAUCET_TOKEN_DECIMALS` | Decimal places of the token, from 0 to 18. Set `18` for ASI |
| `FAUCET_AMOUNT` | Amount of one payout in atomic units, for example `1000000000000000000` for 1 ASI |
| `FAUCET_MAX_BALANCE` | Eligibility limit in whole ASI. A request is refused when the balance of the address is equal to or above it |

`GET /config` of the faucet API returns the values that the process uses.

## Next Steps

<CardGrid columns="2">
  <DocCard title="Node Image" href="/nodes/image/">How to run the node image</DocCard>
  <DocCard title="Useful Links" href="/reference/links/">Applications, packages and source repositories</DocCard>
</CardGrid>
