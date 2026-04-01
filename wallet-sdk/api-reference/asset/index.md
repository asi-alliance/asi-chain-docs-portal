# Asset

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/domains/Asset/index.ts)

Simple token model.

**Types:** `AssetId = string`, `Assets = Map<AssetId, Asset>`.

## Constructor

```ts
new Asset(id: string, name: string, decimals?: number)
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | Yes | Unique asset identifier. |
| `name` | `string` | Yes | Human-readable asset name. |
| `decimals` | `number` | No | Decimal precision. Defaults to `ASI_DECIMALS` (`8`). |

## Methods

```ts
getId(): string        // Returns the asset identifier
getName(): string      // Returns the asset name
getDecimals(): number  // Returns the decimal precision
```
