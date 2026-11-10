# AssetsService

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/v2.1.0/src/services/AssetsService/index.ts)

`AssetsService` reads the balance of an address through an exploratory deploy (see [Balance Query Flow](/architecture/sequence-diagrams/balance/)). The service has one method. Transfers are not part of it: they go through [`Client`](/wallet-sdk/api-reference/client/), which signs and submits them.

The package exports the class as `AssetsService`. You rarely build it yourself, because `ApiServiceRegistry.getInstance().assets` holds an instance. `Client.getBalance(address)` calls it with `DEFAULT_ASSET` and returns the amount as a `bigint`.

::: warning Network precision and compatibility
The planned testnet uses 18 decimals. These SDK examples describe the legacy eight-decimal API; changing a constant does not provide uint256 signing support. Select a compatible SDK release and verified network metadata before using it on the new testnet. See [Token Amounts and 18 Decimals](/reference/token-amounts/).
:::

## Import

```ts
import { AssetsService } from "@asichain/asi-wallet-sdk";
```

## Constructor

```ts
new AssetsService(deployService: DeployService, nodeApiProvider?: NodeApiProvider)
```

`nodeApiProvider` is optional. It is used to pick the Rholang balance query that fits the profile of the active node (Scala or Rust). With a Rust node, SDK 2.1.0 cannot read balances, so `getBalance` throws `BalanceUnavailableError` (see [Configure Networks](/wallet-sdk/overview/#configure-networks)).

## Methods

### getBalance()

```ts
getBalance(address: Address, asset: Asset): Promise<IBalanceData>
```

Reads the balance of `address` and returns it together with `asset`. The `asset` argument is not sent to the node. It is returned as it is, so you can keep the amount and its token in one object.

| Name | Type | Description |
|------|------|-------------|
| `address` | `Address` | Address to query. |
| `asset` | [`Asset`](/wallet-sdk/api-reference/asset/) | Token the amount is reported in. `DEFAULT_ASSET` is the native ASI. |

Returns `Promise<IBalanceData>`.

```ts
interface IBalanceData {
    amount: bigint; // atomic units
    asset: Asset;
}
```

It throws:

- `Error("AssetsService.getBalance: Invalid address: <errorCode>")` when `address` fails [`validateAddress`](/wallet-sdk/api-reference/validators/). The code is one of the `AddressValidationErrorCode` values.
- `BalanceUnavailableError` when the balance cannot be read: the node request fails, the node returns no balance or an unexpected value, or the vault replies with an error string.

The method does not return `0n` on failure, so a zero in `amount` is a real zero balance.

## Errors

### BalanceUnavailableError

`BalanceUnavailableError` extends `CustomError` and is exported from the package root.

| Field | Type | Description |
|-------|------|-------------|
| `address` | `Address` | The address that was queried. |
| `reason` | `string` | What went wrong, for example the message of the failed request or `the node returned no balance expression`. |
| `code` | `CustomErrorCode` | `BALANCE_UNAVAILABLE`. |
| `status` | `number` | `502`. |
| `message` | `string` | `Balance of <address> could not be read: <reason>`. |

## Example

```ts
import {
    BalanceUnavailableError,
    DEFAULT_ASSET,
    fromAtomicAmount,
    type Address,
    type AssetsService,
} from "@asichain/asi-wallet-sdk";

export async function printBalance(
    assets: AssetsService,
    owner: Address,
): Promise<void> {
    try {
        const { amount, asset } = await assets.getBalance(owner, DEFAULT_ASSET);

        console.log(`${fromAtomicAmount(amount, asset.getDecimals())} ${asset.getName()}`);
    } catch (error) {
        if (error instanceof BalanceUnavailableError) {
            console.error(`No balance for ${error.address}: ${error.reason}`);
            return;
        }

        throw error;
    }
}
```
