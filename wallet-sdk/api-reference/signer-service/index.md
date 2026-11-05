# SignerService

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/v2.1.0/src/services/Signer/index.ts)

Serializes deploy data into the byte string that is signed. `SignerService` has one member and does not sign anything itself.

## `deployDataProtobufSerialize`

```ts
deployDataProtobufSerialize(deployData: DeployData): Uint8Array
```

Encodes a deploy as protobuf bytes. The `static` field writes `term` (field 2), `timestamp` (3), `phloPrice` (7), `phloLimit` (8), `validAfterBlockNumber` (10) and `shardId` (11) with `BinaryWriter`. An omitted `shardId` is written as an empty string.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `deployData` | `DeployData` | Yes | Deploy fields to encode. |

**Returns:** `Uint8Array` — protobuf-encoded deploy.

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

Earlier versions had `SignerService.sign` with a password callback. It is gone. A deploy is now signed by `Client.signDeploy` or `Wallet.signDeploy`, and the private key stays inside the wallet's `Signer` (see [Wallet](/wallet-sdk/api-reference/wallet/)). Both calls return a `SignedResult`. See [Client](/wallet-sdk/api-reference/client/) for the signing and submission flow.
