# Validators

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/utils/validators/index.ts)

Validation helpers for account names and blockchain addresses.

## `validateAccountName`

```ts
validateAccountName(name: string, maxLength?: number): { isValid: boolean; error?: string }
```

Validates a wallet or account name.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `name` | `string` | Yes | Account name to validate. |
| `maxLength` | `number` | No | Maximum allowed length. Defaults to `30`. |

**Returns:** `{ isValid: boolean; error?: string }` — `error` is set if `isValid` is `false`.

**Constraints:**
- Must be non-empty after trimming.
- Must not exceed `maxLength` characters.
- Must not contain forbidden filesystem characters: `< > : " / \ | ? *`.

## `isAddress`

```ts
isAddress(address: string): address is Address
```

Type guard that checks if a string is a valid `Address`. Runs the full decode + checksum validation.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `address` | `string` | Yes | String to check. |

**Returns:** `boolean` — `true` if the string is a valid `Address`.

## `validateAddress`

```ts
validateAddress(address: string): { isValid: boolean; errorCode?: AddressValidationErrorCode }
```

Performs detailed multi-step validation of an ASI address.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `address` | `string` | Yes | Address string to validate. |

**Returns:** `{ isValid: boolean; errorCode?: AddressValidationErrorCode }`.

**Validation steps (in order):**

| Step | ErrorCode | Check |
|------|-----------|-------|
| 1 | `INVALID_PREFIX` | Must start with `"1111"` |
| 2 | `INVALID_LENGTH` | Length must be between 50 and 54 characters |
| 3 | `INVALID_ALPHABET` | Must contain only alphanumeric characters |
| 4 | `INVALID_BASE58` | Must use valid Base58 alphabet (no `0`, `O`, `I`, `l`) |
| 5 | `INVALID_HEX_LENGTH` | Decoded hex must be 80 characters (72 payload + 8 checksum) |
| 6 | `NON_CANONICAL` | Re-encoding the decoded bytes must produce the same address |
| 7 | `INVALID_CHAIN_PREFIX` | Payload must start with ASI chain prefix |
| 8 | `INVALID_CHECKSUM` | Blake2b-256 of payload — first 8 hex chars must match checksum |
