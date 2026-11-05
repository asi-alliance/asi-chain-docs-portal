# Wallet SDK API Reference

API reference for `@asichain/asi-wallet-sdk` 2.1.0. Applications start with `Client`. The services below it are low-level primitives that `Client` builds on, and you rarely call them directly.

**Source code**: [github.com/asi-alliance/asi-chain-wallet-sdk](https://github.com/asi-alliance/asi-chain-wallet-sdk)

## Client

| Module | Description |
|--------|-------------|
| [Client](./client/) | Wallets, signing sessions, networks, balances, transfers, reservations, keyfiles and events |

## Services

| Module | Description |
|--------|-------------|
| [Wallets](./wallets-service/) | Key pair creation and address derivation |
| [Crypto](./crypto-service/) | Password-based AES-GCM encryption and decryption |
| [Mnemonic](./mnemonic-service/) | BIP-39 mnemonic generation and validation |
| [KeyDerivation](./key-derivation/) | BIP-32 and BIP-44 hierarchical key derivation |
| [KeysManager](./keys-manager/) | secp256k1 key generation and management |
| [SignerService](./signer-service/) | Serialization of deploy data for signing |
| [AssetsService](./assets-service/) | Balance queries for an address |

## Domains

| Module | Description |
|--------|-------------|
| [Wallet](./wallet/) | A wallet with its accounts and its signing session |
| [Asset](./asset/) | Token model |
| [BrowserStorage](./browser-storage/) | IndexedDB storage behind a table interface |

## Error Handling

| Module | Description |
|--------|-------------|
| [Error Types](./error-types/) | `CustomError`, its error codes and the typed errors that the SDK throws |

## Utilities

| Module | Description |
|--------|-------------|
| [Codec](./codec/) | Base16, Base58 and Base64 encoding helpers |
| [Functions](./functions/) | Atomic amount conversion |
| [Validators](./validators/) | Address checksum and account name validation |
| [Constants](./constants/) | Library-wide constants such as `ASI_DECIMALS`, `ASI_BASE_UNIT` and `GasFee` |
| [Polyfills](./polyfills/) | Browser `Buffer` polyfill setup |
