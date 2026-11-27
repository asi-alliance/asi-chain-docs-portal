# SignerService

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/dev/src/services/Signer/index.ts)

`SignerService` serializes deploy data into the bytes that get signed. It has one member and does not sign anything itself.

## Import

```ts
import { SignerService } from "@asichain/asi-wallet-sdk";
```

## Methods

### deployDataProtobufSerialize()

```ts
static deployDataProtobufSerialize(deployData: DeployData): Uint8Array
```

Encodes a deploy as protobuf bytes with `BinaryWriter`. It writes these fields:

- `term`, field 2
- `timestamp`, field 3
- `phloPrice`, field 7
- `phloLimit`, field 8
- `validAfterBlockNumber`, field 10
- `shardId`, field 11

An omitted `shardId`, like any empty or zero value, is left out of the bytes.

| Name | Type | Description |
|------|------|-------------|
| `deployData` | `DeployData` | Deploy fields to encode. |

Returns `Uint8Array` with the protobuf-encoded deploy.

## Types

```ts
interface DeployData {
  term: string
  phloLimit: number
  phloPrice: number
  validAfterBlockNumber: number
  timestamp: number
  shardId?: string
}

interface SigningRequest {
  wallet: Wallet
  data: any
}

interface SignedResult {
  data: any
  deployer: string
  signature: string
  sigAlgorithm: string
}
```

`SignedResult` is what a signing call returns.

- `deployer` is the hex-encoded public key.
- `signature` is the hex-encoded secp256k1 signature.
- `sigAlgorithm` is `"secp256k1"`.

## Signing

A deploy is signed by `Client.signDeploy` or `Wallet.signDeploy`, and the private key stays inside the wallet's `Signer` (see [Wallet](/wallet-sdk/api-reference/wallet/)). Both calls return a `SignedResult`. See [Client](/wallet-sdk/api-reference/client/) for the signing and submission flow.
