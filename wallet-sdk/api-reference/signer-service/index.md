# SignerService

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/services/Signer/index.ts)

Builds and signs deploy payloads without exposing raw key bytes to callers.

## `sign`

```ts
sign(request: SigningRequest, passwordProvider: PasswordProvider): Promise<SignedResult>
```

Signs a deploy using the wallet's password-protected private key. The signing flow: obtains password from `passwordProvider`, unlocks the wallet via `withSigningCapability`, serializes the deploy using `BinaryWriter`, hashes with blake2b-256, signs with secp256k1, and returns the result. The decrypted key is zeroed immediately after signing.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `request` | `SigningRequest` | Yes | Object with `wallet: Wallet` and `data: DeployData` to sign. |
| `passwordProvider` | `PasswordProvider` | Yes | Async callback returning the wallet password: `() => Promise<string>`. |

**Returns:** `Promise<SignedResult>` — object with:
- `data` — deploy fields (term, timestamp, phloPrice, phloLimit, validAfterBlockNumber, shardId)
- `deployer: string` — hex-encoded public key
- `signature: string` — hex-encoded secp256k1 signature
- `sigAlgorithm: string` — `"secp256k1"`

**Throws:** `Error("SignerService.sign: ${errorMessage}")` — wraps any internal error.

> **Security note:** The normal signing path never returns decrypted private key bytes. The signing capability expires as soon as the callback returns.

## Types

```ts
interface SigningRequest {
  wallet: Wallet;
  data: any;        // Deploy data to sign
}

interface SignedResult {
  data: any;            // Signed deploy fields
  deployer: string;     // Hex-encoded public key
  signature: string;    // Hex-encoded secp256k1 signature
  sigAlgorithm: string; // "secp256k1"
}

type PasswordProvider = () => Promise<string>
```
