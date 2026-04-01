# BrowserStorage

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/domains/BrowserStorage/index.ts)

`localStorage` adapter with prefix-based key isolation. All keys are stored as `${prefix}_${id}`.

## Constructor

```ts
new BrowserStorage(prefix?: string)
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `prefix` | `string` | No | Key prefix for namespace isolation. Defaults to `"storage_prefix"`. |

**Throws:** `Error("localStorage is not supported in this environment.")` — if `localStorage` is not available.

## Methods

### `write`

```ts
write(id: string, data: string): void
```

Writes data to `localStorage` under the prefixed key.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | Yes | Data identifier. |
| `data` | `string` | Yes | String value to store. |

### `read`

```ts
read(id: string): string | null
```

Reads data from `localStorage`.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | Yes | Data identifier. |

**Returns:** `string | null` — stored value, or `null` if not found.

### `delete`

```ts
delete(id: string): void
```

Removes a prefixed key from `localStorage`.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | Yes | Data identifier to delete. |

### `has`

```ts
has(id: string): boolean
```

Checks if a key exists in `localStorage`.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | Yes | Data identifier. |

**Returns:** `boolean`.

### `isEmpty`

```ts
isEmpty(): boolean
```

Returns `true` if no prefixed keys exist in `localStorage`.

**Returns:** `boolean`.

### `clear`

```ts
clear(): void
```

Removes all keys with the configured prefix from `localStorage`.
