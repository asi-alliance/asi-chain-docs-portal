# Codec

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/utils/codec/index.ts)

Encoding and decoding helpers for Base16, Base58, and Base64.

## `encodeBase58`

```ts
encodeBase58(hex: string): string
```

Converts a hex string to a Base58-encoded string.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `hex` | `string` | Yes | Hex string to encode. |

**Returns:** `string` — Base58-encoded result.

## `decodeBase16`

```ts
decodeBase16(hex: string): Uint8Array
```

Parses a hex string into a `Uint8Array`.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `hex` | `string` | Yes | Hex string (even length). |

**Returns:** `Uint8Array` — decoded bytes.

## `encodeBase16`

```ts
encodeBase16(bytes: Uint8Array): string
```

Encodes bytes to a lowercase hex string (zero-padded).

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `bytes` | `Uint8Array` | Yes | Bytes to encode. |

**Returns:** `string` — hex string.

## `arrayBufferToBase64`

```ts
arrayBufferToBase64(buffer: ArrayBuffer): string
```

Converts an `ArrayBuffer` to a Base64 string.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `buffer` | `ArrayBuffer` | Yes | Buffer to encode. |

**Returns:** `string` — Base64 string.

## `base64ToArrayBuffer`

```ts
base64ToArrayBuffer(base64: string): ArrayBuffer
```

Converts a Base64 string to an `ArrayBuffer`.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `base64` | `string` | Yes | Base64 string to decode. |

**Returns:** `ArrayBuffer`.
