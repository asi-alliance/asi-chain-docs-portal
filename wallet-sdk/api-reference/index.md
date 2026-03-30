# Wallet SDK — API Reference

Complete API reference for ASI Chain Wallet SDK services, domains, and utilities.

**Source code**: [github.com/asi-alliance/asi-chain-wallet-sdk](https://github.com/asi-alliance/asi-chain-wallet-sdk)

## Services

| Module | Description |
|--------|-------------|
| [WalletsService](./wallets-service/) | Wallet creation and address derivation |
| [CryptoService](./crypto-service/) | Password-based AES-GCM encryption/decryption |
| [MnemonicService](./mnemonic-service/) | BIP-39 mnemonic generation and validation |
| [KeyDerivationService](./key-derivation/) | BIP-32/BIP-44 hierarchical key derivation |
| [KeysManager](./keys-manager/) | secp256k1 key generation and management |
| [SignerService](./signer-service/) | Deploy signing without exposing raw key bytes |
| [AssetsService](./assets-service/) | Token transfers and balance queries |
| [DeployResubmitter](./deploy-resubmitter/) | Deploy retry and resubmission logic |

## Domains

| Module | Description |
|--------|-------------|
| [Wallet](./wallet/) | Encrypted wallet with scoped signing capability |
| [Vault](./vault/) | Multi-wallet encrypted browser storage |
| [BlockchainGateway](./blockchain-gateway/) | Singleton gateway for node communication |
| [EncryptedRecord](./encrypted-record/) | Encrypted data wrapper for seed storage |
| [Asset](./asset/) | Token model |
| [BrowserStorage](./browser-storage/) | `localStorage` adapter with key isolation |

## Error Handling

| Module | Description |
|--------|-------------|
| [Error Types](./error-types/) | Deploy error classification, recoverable/fatal error enums, and `DeploymentErrorHandler` |

## Utilities

| Module | Description |
|--------|-------------|
| [Codec](./codec/) | Base16, Base58, and Base64 encoding helpers |
| [Functions](./functions/) | Atomic amount conversion utilities |
| [Validators](./validators/) | Address checksum and account name validation |
| [Constants](./constants/) | Library-wide constants (`ASI_DECIMALS`, `ASI_BASE_UNIT`, `GasFee`, etc.) |
| [Polyfills](./polyfills/) | Browser `Buffer` polyfill setup |
