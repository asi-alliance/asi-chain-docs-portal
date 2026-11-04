# Documentation status

Reviewed on **2026-11-04**. This portal is being updated for the maintained Rust node and ASI application images in ECR Public.

## Verified scope

- [Container images](/general/container-images/): published tags and immutable digests checked against ECR Public, with public application source revisions.
- [Validator image](/shard-nodes/validator-image/) and [observer image](/shard-nodes/observer-image/): Rust runtime, configuration inputs, API boundaries and image selection.
- [Wallet CLI](/cli/usage/): the published image's pinned ASI client, explicit endpoints and raw integer amounts.
- [Architecture](/architecture/) and [network topology](/architecture/network-topology/): component responsibilities and default container ports.

The catalog records published artifacts. It does not establish which images or endpoints a running network uses, or prove interoperability for every artifact combination. Request the target network's current connection details before joining or sending transactions.

## Source selection

| Component | Public source revision |
|---|---|
| Node baseline | [e6ecf23814a306e4ad9850ea44fc753f40966db8](https://github.com/F1R3FLY-io/f1r3node-rust/tree/e6ecf23814a306e4ad9850ea44fc753f40966db8) |
| Node used by client compatibility tests | [5dafbc37dad3ebf3da810641fc0d8cecd5a1127b](https://github.com/F1R3FLY-io/f1r3node-rust/tree/5dafbc37dad3ebf3da810641fc0d8cecd5a1127b) |
| ASI client image | [40f2a9408040252dd23761cd06adb9f1407ef228](https://github.com/asi-alliance/asi-chain-client/tree/40f2a9408040252dd23761cd06adb9f1407ef228) |
| Wallet CLI image | [8f6c20ea43ebc6d333783f936372d4220e449681](https://github.com/asi-alliance/asi-chain-wallet-cli/tree/8f6c20ea43ebc6d333783f936372d4220e449681); client gitlink `77cbdc8180d8f83a7216dbf54b23268106ea3e91` |

The maintained node is the pure Rust repository above. Old combined node repositories and legacy `asi-chain` deployment helpers do not supply setup instructions for these images. Node images retain their F1R3FLY source identity.

For application development, inspect remote `dev` and freeze its full revision before building. For a published image, use its recorded revision even if `dev` has moved. Published wallet CLI images do not acquire client changes from later pull requests. A default branch or matching package version does not replace a consumer's committed gitlink.

## Remaining review

Wallet, faucet and explorer UI walkthroughs, the Wallet SDK reference and detailed transaction/balance/state diagrams retain earlier material. Verify methods, screenshots, endpoints and token behavior against the exact component revision you use. They are not included in this source audit.

Historical IPs, observer availability, validator counts, resource estimates and block-time claims are not a current network inventory. This update removes them from principal setup pages; remaining walkthroughs may still contain historical examples.

## Contributing verified instructions

Link the public source revision and relevant manifest, configuration or implementation. Keep container defaults separate from host mappings. Run `npm run docs:build`, then check technical claims independently. Never publish keys, real environment files or administrator credentials.
