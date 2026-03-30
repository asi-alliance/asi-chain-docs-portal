# Polyfills

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/main/src/utils/polyfills/index.ts)

## `setupBufferPolyfill`

```ts
setupBufferPolyfill(): void
```

Ensures `window.Buffer` is available in browser environments by assigning Node's `Buffer` from the `buffer` package when missing. No-op in non-browser environments.

Call this once at application startup if using the SDK in a browser context without a bundler that provides `Buffer` globally.

**Returns:** `void`.
