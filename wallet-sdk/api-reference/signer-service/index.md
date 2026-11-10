# SignerService

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/v2.1.0/src/services/Signer/index.ts)

`SignerService` serializes deploy data into the bytes that get signed. It has one member and does not sign anything itself.

::: warning Network precision and compatibility
The planned testnet uses 18 decimals. These SDK examples describe the legacy eight-decimal API; changing a constant does not provide uint256 signing support. Select a compatible SDK release and verified network metadata before using it on the new testnet. See [Token Amounts and 18 Decimals](/reference/token-amounts/).
:::

## Import

```ts
import { SignerService } from "@asichain/asi-wallet-sdk";
```

## Methods

### deployDataProtobufSerialize()

```ts
static deployDataProtobufSerialize(deployData: DeployData): Uint8Array
```

Encodes a deploy as protobuf bytes. It writes `term` (field 2), `timestamp` (3), `phloPrice` (7), `phloLimit` (8), `validAfterBlockNumber` (10) and `shardId` (11) with `BinaryWriter`. An omitted `shardId` is written as an empty string.

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

`SignedResult` is what a signing call returns: `deployer` is the hex-encoded public key, `signature` is the hex-encoded secp256k1 signature, and `sigAlgorithm` is `"secp256k1"`.

## Signing

A deploy is signed by `Client.signDeploy` or `Wallet.signDeploy`, and the private key stays inside the wallet's `Signer` (see [Wallet](/wallet-sdk/api-reference/wallet/)). Both calls return a `SignedResult`. See [Client](/wallet-sdk/api-reference/client/) for the signing and submission flow.
