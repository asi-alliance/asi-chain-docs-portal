# Wallet SDK API Reference

API reference for `@asichain/asi-wallet-sdk` 2.1.0. Applications start with `Client`. The services below it are low-level primitives that `Client` builds on, and you rarely call them directly.

The source code is at [github.com/asi-alliance/asi-chain-wallet-sdk](https://github.com/asi-alliance/asi-chain-wallet-sdk).

## Client

| Module | Description |
|--------|-------------|
| [Client](/wallet-sdk/api-reference/client/) | Wallets, signing sessions, networks, balances, transfers, reservations, keyfiles and events |

## Services

| Module | Description |
|--------|-------------|
| [Wallets](/wallet-sdk/api-reference/wallets-service/) | Key pair creation and address derivation |
| [Crypto](/wallet-sdk/api-reference/crypto-service/) | Password-based AES-GCM encryption and decryption |
| [Mnemonic](/wallet-sdk/api-reference/mnemonic-service/) | BIP-39 mnemonic generation and validation |
| [KeyDerivation](/wallet-sdk/api-reference/key-derivation/) | BIP-32 and BIP-44 hierarchical key derivation |
| [KeysManager](/wallet-sdk/api-reference/keys-manager/) | secp256k1 key generation and management |
| [SignerService](/wallet-sdk/api-reference/signer-service/) | Serialization of deploy data for signing |
| [AssetsService](/wallet-sdk/api-reference/assets-service/) | Balance queries for an address |

## Domains

| Module | Description |
|--------|-------------|
| [Wallet](/wallet-sdk/api-reference/wallet/) | A wallet with its accounts and its signing session |
| [Asset](/wallet-sdk/api-reference/asset/) | Token model |
| [BrowserStorage](/wallet-sdk/api-reference/browser-storage/) | IndexedDB storage behind a table interface |

## Error Handling

| Module | Description |
|--------|-------------|
| [Error Types](/wallet-sdk/api-reference/error-types/) | `CustomError`, its error codes and the typed errors that the SDK throws |

## Utilities

| Module | Description |
|--------|-------------|
| [Codec](/wallet-sdk/api-reference/codec/) | Base16, Base58 and Base64 encoding helpers |
| [Functions](/wallet-sdk/api-reference/functions/) | Atomic amount conversion |
| [Validators](/wallet-sdk/api-reference/validators/) | Address checksum and account name validation |
| [Constants](/wallet-sdk/api-reference/constants/) | Library-wide constants such as `ASI_DECIMALS`, `ASI_BASE_UNIT` and `GasFee` |
| [Polyfills](/wallet-sdk/api-reference/polyfills/) | Browser `Buffer` polyfill setup |
