# Validators

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/v2.1.0/src/utils/validators/domain.ts) · [Primitives](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/v2.1.0/src/utils/validators/primitives.ts)

Validation helpers for names, addresses, URLs, keys and request payloads. They are plain functions exported from the package root, and none of them touches the network. Most helpers return `{ isValid: boolean; error?: string }`. The address validator returns an error code instead of a message.

## Import

```ts
import {
    ensureValid,
    isAddress,
    isIntegerInRange,
    isPrivateKeyValid,
    isValidUrl,
    validateAccountName,
    validateAddress,
    validateDeployPayload,
    validateNetworkConfigUrls,
    validateNetworkUniqueness,
    validateNodeApiProfile,
    validatePositiveAmount,
    validatePrivateKey,
    validateReservationPayload,
    validateReservationUpdateTarget,
    validateUrl,
    validateWalletKeyfile,
    validateWalletKeyfileAccounts,
} from "@asichain/asi-wallet-sdk";
```

## Functions

### Account Names

```ts
validateAccountName(name: string, maxLength?: number): { isValid: boolean; error?: string }
```

Checks a wallet or account name. `maxLength` defaults to `30`. The forbidden characters are `<`, `>`, `:`, `"`, `/`, `\`, `|`, `?` and `*`.

| Check | `error` |
|-------|---------|
| Empty or whitespace only | `Account name is required` |
| Longer than `maxLength` | `Account name must be <maxLength> characters or less` |
| Contains a forbidden character | `Account name contains invalid characters` |

### Addresses

```ts
isAddress(address: string): address is Address
validateAddress(address: string): AddressValidationResult
```

`validateAddress` runs the full decode and checksum check and reports the first failing step. `isAddress` is the same check as a type guard, so after `if (isAddress(value))` the value has the `Address` type.

`AddressValidationResult` is `{ isValid: boolean; errorCode?: AddressValidationErrorCode }`. `AddressValidationErrorCode` is an enum exported from the package root, and its member values equal their names.

| Step | `errorCode` | Check |
|------|-------------|-------|
| 1 | `INVALID_PREFIX` | The address starts with `1111`. |
| 2 | `INVALID_LENGTH` | The length is from 50 to 54 characters. |
| 3 | `INVALID_ALPHABET` | Only letters and digits. |
| 4 | `INVALID_BASE58` | No `0`, `O`, `I` or `l`. |
| 5 | `INVALID_HEX_LENGTH` | The decoded bytes are 80 hex characters long (72 of payload and 8 of checksum). |
| 6 | `NON_CANONICAL` | Encoding the decoded bytes again gives the same address. |
| 7 | `INVALID_CHAIN_PREFIX` | The payload starts with the ASI chain prefix. |
| 8 | `INVALID_CHECKSUM` | The first 8 hex characters of the Blake2b-256 hash of the payload equal the checksum. |

### URLs and Network Settings

```ts
validateUrl(url: string): { isValid: boolean; error?: string }
isValidUrl(url: string): boolean
validateNodeApiProfile(profile: unknown): { isValid: boolean; error?: string }
validateNetworkConfigUrls(config: Partial<INetworkConfig>, { allowEmpty }: { allowEmpty: boolean }): { isValid: boolean; error?: string }
validateNetworkUniqueness(name: NetworkName, config: INetworkConfig, otherRecords: INetworkRecord[]): { isValid: boolean; error?: string }
```

`validateUrl` accepts only `http:` and `https:` URLs with a host. The possible errors are `URL is required`, `URL is not valid`, `URL must use http or https protocol` and `URL must contain a host`.

`validateNodeApiProfile` accepts one of the values of `NODE_API_PROFILES`. `validateNetworkConfigUrls` checks every URL field of a network config and prefixes the error with the field name (`Invalid <field>: ...`). With `allowEmpty: true` an empty string is skipped. `validateNetworkUniqueness` rejects a network that has the same config or the same name as one of `otherRecords`.

### Keys

```ts
validatePrivateKey(privateKey: Uint8Array): { isValid: boolean; error?: string }
isPrivateKeyValid(privateKey: Uint8Array): boolean
isIntegerInRange(value: number, min: number, max: number): boolean
```

`validatePrivateKey` requires exactly `PRIVATE_KEY_LENGTH` (32) bytes and a value inside the secp256k1 curve range. The errors are `Private key must be 32 bytes` and `Private key is out of the secp256k1 curve range`. `isIntegerInRange` is true for integers from `min` to `max` inclusive.

### Amounts, Deploys and Keyfiles

```ts
validatePositiveAmount(amount: bigint): { isValid: boolean; error?: string }
validateDeployPayload({ term, phloLimit, phloPrice, shardId }: TDeployDetails): { isValid: boolean; error?: string }
validateReservationPayload(payload: TCreateTransactionReservationPayload): { isValid: boolean; error?: string }
validateReservationUpdateTarget(currentReservation: ITransactionReservation, payload: TCreateTransactionReservationPayload): { isValid: boolean; error?: string }
validateWalletKeyfile(source: unknown): { isValid: boolean; error?: string }
validateWalletKeyfileAccounts(source: unknown, walletType: WalletTypes): { isValid: boolean; error?: string }
ensureValid({ isValid, error }: { isValid: boolean; error?: string }, { context }: IErrorContext): void
```

`validatePositiveAmount` fails with `Amount must be greater than zero` for zero and negative values. `validateDeployPayload` requires a non-empty `term`, positive safe integers for `phloLimit` and `phloPrice` when they are set, and a non-empty `shardId` when it is set.

`validateReservationPayload` and `validateReservationUpdateTarget` check the payloads of the transaction reservations that [`Client`](/wallet-sdk/api-reference/client/) creates when you send a transfer or a deploy. `validateWalletKeyfile` and `validateWalletKeyfileAccounts` check the structure of an exported keyfile and of its account list.

`ensureValid` throws `Error("<context>: <error>")` when the result is not valid, and does nothing otherwise.

## Example

```ts
import {
    Wallets,
    isAddress,
    validateAccountName,
    validateAddress,
} from "@asichain/asi-wallet-sdk";

const created = Wallets.createWallet();
const address = created.address;

console.log(validateAddress(address)); // { isValid: true }
console.log(isAddress(address)); // true

const broken = address.slice(0, -1) + (address.endsWith("a") ? "b" : "a");

console.log(validateAddress(broken)); // { isValid: false, errorCode: "INVALID_CHECKSUM" }
console.log(validateAddress("1111abc")); // { isValid: false, errorCode: "INVALID_LENGTH" }
console.log(validateAccountName("a/b")); // { isValid: false, error: "Account name contains invalid characters" }
```
