# Asset

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/v2.1.0/src/domains/Asset/index.ts)

An `Asset` is the model of a token. It holds the identifier, the name and the number of decimals of a token, and optionally the address of its contract. `AssetsService.getBalance` takes an `Asset` and returns it together with the balance.

The module also defines the types `AssetId = string` and `Assets = Map<AssetId, Asset>`.

## Import

```ts
import { Asset, DEFAULT_ASSET } from "@asichain/asi-wallet-sdk";
```

## Constructor

```ts
new Asset({ id, name, decimals, contractAddress }: IAssetOptions)
```

The constructor takes one options object.

```ts
interface IAssetOptions {
    id: string;
    name: string;
    decimals?: number;
    contractAddress?: string;
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Unique asset identifier. |
| `name` | `string` | Yes | Human-readable asset name. |
| `decimals` | `number` | No | Number of decimal places. Defaults to `NATIVE_TOKEN_DECIMALS_AMOUNT` (`8`). |
| `contractAddress` | `string` | No | Address of the token contract. `getContractAddress()` returns `null` when it is not set. |

## Methods

```ts
getId(): string
getName(): string
getDecimals(): number
getContractAddress(): string | null
```

All four are plain getters.

## Default Asset

`DEFAULT_ASSET` is the native ASI asset: name `"ASI"`, 8 decimals, no contract address, and a random `id` that is generated when the SDK is loaded. `Client.getBalance(address)` uses it.

## Example

```ts
import { Asset, DEFAULT_ASSET } from "@asichain/asi-wallet-sdk";

const token = new Asset({ id: "demo-token", name: "Demo", decimals: 6 });

console.log(token.getName(), token.getDecimals(), token.getContractAddress()); // Demo 6 null
console.log(DEFAULT_ASSET.getName(), DEFAULT_ASSET.getDecimals()); // ASI 8
```
