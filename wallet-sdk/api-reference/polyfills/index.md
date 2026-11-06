# Polyfills

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/v2.1.0/src/utils/polyfills/index.ts)

`setupBufferPolyfill` provides the global `Buffer` in a browser, where the SDK needs it.

## Import

```ts
import { setupBufferPolyfill } from "@asichain/asi-wallet-sdk";
```

## Functions

### setupBufferPolyfill()

```ts
setupBufferPolyfill(): void
```

Sets `window.Buffer` to the `Buffer` class from the `buffer` package when it is missing. Outside a browser, where `window` is undefined, the call does nothing.

Returns `void`.

The `KeyDerivation` and `Mnemonic` modules call it themselves when they are imported, so an application that imports them needs no extra call. Call it once at startup only in one case: code that needs a global `Buffer` runs before those imports, and your bundler does not provide one.
