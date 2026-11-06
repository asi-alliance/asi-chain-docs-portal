# Codec

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/v2.1.0/src/utils/codec/index.ts)

These plain functions encode and decode Base16, Base58 and Base64 and do a few byte conversions. All of them are exported from the package root.

## Import

```ts
import {
    arrayBufferToBase64,
    base64ToArrayBuffer,
    bigIntToBuffer,
    bufferToBigInt,
    decodeBase16,
    decodeBase58,
    encodeBase16,
    encodeBase58,
    toUint8Array,
} from "@asichain/asi-wallet-sdk";
```

## Functions

### encodeBase58()

```ts
encodeBase58(hex: string): string
```

Converts a hex string to a Base58-encoded string.

| Name | Type | Description |
|------|------|-------------|
| `hex` | `string` | Hex string to encode. |

Returns `string` with the Base58-encoded result.

### decodeBase58()

```ts
decodeBase58(value: string): Uint8Array
```

Decodes a Base58 string into a `Uint8Array`. Throws if the string contains characters outside the Base58 alphabet.

| Name | Type | Description |
|------|------|-------------|
| `value` | `string` | Base58-encoded string. |

Returns `Uint8Array` with the decoded bytes.

### decodeBase16()

```ts
decodeBase16(hex: string): Uint8Array
```

Parses a hex string into a `Uint8Array`.

| Name | Type | Description |
|------|------|-------------|
| `hex` | `string` | Hex string of even length. |

Returns `Uint8Array` with the decoded bytes.

The function does not validate its input. With an odd length the last digit is silently dropped, and a non-hex pair becomes the byte `0`, so check the string before calling.

### encodeBase16()

```ts
encodeBase16(bytes: Uint8Array): string
```

Encodes bytes to a lowercase hex string with two digits per byte.

| Name | Type | Description |
|------|------|-------------|
| `bytes` | `Uint8Array` | Bytes to encode. |

Returns `string` with the lowercase hex digits.

### arrayBufferToBase64()

```ts
arrayBufferToBase64(buffer: ArrayBuffer): string
```

Converts an `ArrayBuffer` to a Base64 string.

| Name | Type | Description |
|------|------|-------------|
| `buffer` | `ArrayBuffer` | Buffer to encode. |

Returns `string` with the Base64 encoding.

### base64ToArrayBuffer()

```ts
base64ToArrayBuffer(base64: string): ArrayBuffer
```

Converts a Base64 string to an `ArrayBuffer`.

| Name | Type | Description |
|------|------|-------------|
| `base64` | `string` | Base64 string to decode. |

Returns `ArrayBuffer`.

### toUint8Array()

```ts
toUint8Array(value: unknown): Uint8Array
```

Converts the byte containers that appear after JSON round trips into a `Uint8Array`. It accepts a `Uint8Array` (returned as is), a Node.js `Buffer` serialized as `{ type: 'Buffer', data: number[] }`, an array of bytes, and an object with consecutive numeric keys `"0"`, `"1"`, and so on.

| Name | Type | Description |
|------|------|-------------|
| `value` | `unknown` | Value to convert. |

Returns `Uint8Array`.

Throws `Error("Invalid byte value")` if an element is not an integer from 0 to 255 or if the keys of an object are not the consecutive indexes `"0"`, `"1"` and so on. It throws `Error("Unsupported data format")` for any other input, such as a string, a number or `null`.

### bufferToBigInt()

```ts
bufferToBigInt(buffer: Uint8Array): bigint
```

Reads the bytes as one big-endian unsigned integer.

| Name | Type | Description |
|------|------|-------------|
| `buffer` | `Uint8Array` | Bytes to convert. |

Returns `bigint`.

Throws `SyntaxError` when `buffer` is empty.

### bigIntToBuffer()

```ts
bigIntToBuffer(num: bigint): Uint8Array
```

Writes a non-negative integer as big-endian bytes, left-padded with zeros to at least 32 bytes. It is the inverse of `bufferToBigInt` for 32-byte values such as private keys.

| Name | Type | Description |
|------|------|-------------|
| `num` | `bigint` | Non-negative integer. |

Returns `Uint8Array`.

## Example

```ts
import { encodeBase16, decodeBase16, encodeBase58, decodeBase58 } from '@asichain/asi-wallet-sdk';

const bytes = decodeBase16('00ff10ab');
console.log(encodeBase16(bytes)); // 00ff10ab
console.log(encodeBase58('00ff10ab'));
console.log(decodeBase58(encodeBase58('00ff10ab')).length); // 4
```
