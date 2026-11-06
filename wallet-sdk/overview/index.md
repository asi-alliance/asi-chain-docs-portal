# Wallet SDK

TypeScript SDK for wallet management and chain access on ASI:Chain. The pages in this section describe `@asichain/asi-wallet-sdk` 2.1.0, a beta release. The source is at [github.com/asi-alliance/asi-chain-wallet-sdk](https://github.com/asi-alliance/asi-chain-wallet-sdk).

## What the SDK Does

- `Client` is the single entry point for wallets, networks, balances, transfers and events. See the [Client](/wallet-sdk/api-reference/client/) page.
- Wallets are HD wallets (BIP-39 mnemonic, BIP-44 paths) or private-key wallets, and HD accounts are derived on demand.
- A wallet that is open in memory is not necessarily unlocked. An unlocked wallet holds its decrypted secret for a fixed time, 15 minutes by default, and then locks itself. A wallet managed by `Client` never hands out its private key.
- Secrets are encrypted with PBKDF2 and AES-GCM. Storage is IndexedDB in the browser and `node-persist` in Node.js, with a versioned schema and migrations.
- Each network has a validator URL, a read-only URL, an indexer URL and a node API profile. Networks can be added, switched and removed while the client runs.
- A transfer reserves its funds before the deploy is sent, so the available balance stays correct while the deploy is pending.
- A whole wallet can be exported to a password-protected keyfile and imported back, with a preview before anything is written.
- Typed listeners report changes to wallets, accounts, networks, reservations and session locks.
- Failures carry a machine-readable code. See [Error Types](/wallet-sdk/api-reference/error-types/).
- Addresses come from secp256k1 keys through keccak256 and a blake2b checksum.

## Install the SDK

```bash
npm install @asichain/asi-wallet-sdk
```

The package ships ES module and CommonJS builds with type declarations.

## Configure Networks

`Client.create` takes a map from network name to network config. Every network needs four fields.

- `ValidatorURL` is the node that receives deploys.
- `ReadOnlyURL` is the node that answers block and deploy reads.
- `IndexerURL` is the GraphQL indexer that serves transaction history.
- `nodeApiProfile` selects the request format of the node, `NodeApiProfile.SCALA` or `NodeApiProfile.RUST`.

`nodeApiProfile` has no default. A missing or unknown value makes `Client.create` throw, because a guessed profile would send Scala-shaped requests to a Rust node. The public DevNet runs a Scala node, so use `NodeApiProfile.SCALA` for it. The DevNet node addresses are listed on [Network Endpoints](/reference/endpoints/). The indexer address is not published there, so ask the network operator for it if you need transaction history.

::: warning Rust Nodes and SDK 2.1.0
With `NodeApiProfile.RUST`, Wallet SDK 2.1.0 cannot read balances, because a Rust node returns them as `ExprBigInt` and the SDK reads only `ExprInt`. `getBalance` then fails with `BALANCE_UNAVAILABLE`, and so does every transfer. `watchDeploy` also never reports a deploy as finalized on a Rust node. See [Balance Query Flow](/architecture/sequence-diagrams/balance/) and [Transaction Flow](/architecture/sequence-diagrams/transaction/).
:::

```ts
import { NodeApiProfile, type TNetworksConfig } from "@asichain/asi-wallet-sdk";

export const networksConfig: TNetworksConfig = {
    DevNet: {
        ValidatorURL: "<validator-url>",
        ReadOnlyURL: "<validator-url>",
        IndexerURL: "<indexer-url>",
        nodeApiProfile: NodeApiProfile.SCALA,
    },
};

console.log(Object.keys(networksConfig));
```

`Client.create` rejects an invalid URL, so replace the placeholders above before you create a client.

## Try the SDK

### Create a Wallet

The example below points at a local node address and never sends a request. It creates an HD wallet, reopens it from storage, locks it and removes it. The wallet that `createHDWallet` returns is open but locked. `openWallet` loads a stored wallet by its signer id and, with the default session policy, unlocks it.

```ts
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
    Client,
    MnemonicStrength,
    NodeApiProfile,
    type TNetworksConfig,
} from "@asichain/asi-wallet-sdk";

// A local node URL keeps the example offline. For DevNet, take the values from
// Network Endpoints.
const networksConfig: TNetworksConfig = {
    Local: {
        ValidatorURL: "http://localhost:40403",
        ReadOnlyURL: "http://localhost:40403",
        IndexerURL: "http://localhost:8080",
        nodeApiProfile: NodeApiProfile.SCALA,
    },
};

const client = await Client.create({
    networksConfig,
    defaultNetwork: "Local",
    storageOptions: { nodeStorageDir: await mkdtemp(join(tmpdir(), "asi-")) },
});

const mnemonic = client.generateMnemonic(MnemonicStrength.TWELVE_WORDS);
const wallet = await client.createHDWallet(
    { mnemonic, accountName: "Account 1" },
    "wallet-password",
);
const [account] = wallet.getAccounts();
console.log("Address:", account.getAddress());

// A created wallet is open but locked. openWallet loads a stored wallet and,
// with the default session policy, unlocks it.
const [{ signerId }] = await client.getWalletManager().getPublicWalletsMetadata();
client.closeWallet(wallet.getId());
const opened = await client.openWallet(signerId, "wallet-password");
console.log("Unlocked:", client.isWalletUnlocked(opened.getId()));

client.lockWallet(opened.getId());
console.log("Unlocked:", client.isWalletUnlocked(opened.getId()));

await client.removeWallet(opened.getId());
await client.close();
```

### Check Balance and Transfer

A transfer needs a reachable DevNet node and an account with funds, so this example is a function that you call yourself. `transfer` returns the deploy id at once, and the `subscribe` callbacks follow the deploy until the node confirms it. Amounts are `bigint` values in atomic units, and ASI has 8 decimal places.

```ts
import { Client, isAddress } from "@asichain/asi-wallet-sdk";

export async function sendTen(
    client: Client,
    walletId: string,
    accountId: string,
    recipient: string,
    password: string,
): Promise<void> {
    if (!isAddress(recipient)) {
        throw new Error("Not an ASI Chain address");
    }

    const account = client.getAccount(walletId, accountId);
    const balance = await client.getBalance(account.getAddress());
    const available = await client.getAvailableBalance(walletId, accountId);
    console.log(
        `Balance ${client.toDisplayAmount(balance)}, available ${client.toDisplayAmount(available)}`,
    );

    const { deployId, subscribe } = await client.transfer(
        {
            walletId,
            accountId,
            to: recipient,
            amount: client.toAtomicAmount("10"),
        },
        password,
    );
    console.log("Deploy id:", deployId);

    const unsubscribe = subscribe({
        onStatus: (status) => console.log("Status:", status.status),
        onConfirmed: () => {
            console.log("Confirmed");
            unsubscribe();
        },
        onError: (error) => console.error(error.message),
    });
}
```

### Use the Low-Level Primitives

`Wallets`, `Mnemonic` and the other services work without a client and without storage. They create keys and addresses and nothing else. Applications should use `Client`.

```ts
import { Mnemonic, Wallets } from "@asichain/asi-wallet-sdk";

// A random key pair
const random = Wallets.createWallet();
console.log("Address:", random.address);

// Index 0 of a new mnemonic
const mnemonic = Mnemonic.generateMnemonic();
const derived = await Wallets.createFirstWalletWithMnemonic(mnemonic, 0);
console.log("Derived Address:", derived.address);
```

## Find a Module

The SDK has four layers. `Client` sits on top, and your application talks to it. Below it are services that implement the logic, domains that model stateful entities, and utilities. The API reference has a page for every module in the picture.

<Diagram name="sdk-modules" caption="The four layers of the Wallet SDK and the modules in each layer." />

### Client

- [`Client`](/wallet-sdk/api-reference/client/) manages wallets, networks, balances, transfers, events and keyfiles.

### Services

- [`Wallets`](/wallet-sdk/api-reference/wallets-service/) creates key pairs and derives ASI addresses.
- [`Mnemonic`](/wallet-sdk/api-reference/mnemonic-service/), [`KeyDerivation`](/wallet-sdk/api-reference/key-derivation/) and [`KeysManager`](/wallet-sdk/api-reference/keys-manager/) form the derivation pipeline from BIP-39 words through BIP-44 paths to secp256k1 keys.
- [`Crypto`](/wallet-sdk/api-reference/crypto-service/) encrypts stored secrets with PBKDF2 and AES-GCM.
- [`SignerService`](/wallet-sdk/api-reference/signer-service/) serializes deploy data for signing.
- [`AssetsService`](/wallet-sdk/api-reference/assets-service/) reads the balance of an address.

### Domains

- [`Wallet`](/wallet-sdk/api-reference/wallet/) holds a wallet with its accounts and its signing session.
- [`Asset`](/wallet-sdk/api-reference/asset/) is the token model, with an identifier, a name and decimal precision.
- [`BrowserStorage`](/wallet-sdk/api-reference/browser-storage/) is IndexedDB storage behind a table interface.
- [`CustomError`](/wallet-sdk/api-reference/error-types/) is the base class of the typed SDK errors.

### Utilities

- [`Codec`](/wallet-sdk/api-reference/codec/) encodes Base16, Base58 and Base64.
- [`Functions`](/wallet-sdk/api-reference/functions/) converts between display and atomic amounts.
- [`Validators`](/wallet-sdk/api-reference/validators/) checks addresses and account names.
- [`Constants`](/wallet-sdk/api-reference/constants/) and [`Polyfills`](/wallet-sdk/api-reference/polyfills/) hold shared values and the browser `Buffer` setup.

## Cryptography

- Keys are secp256k1 key pairs, and the public key is 65 bytes, uncompressed.
- The address is the keccak256 hash of the public key without its first byte, followed by the chain prefix, a blake2b checksum and Base58 encoding. Addresses start with `1111`.
- Encryption is PBKDF2 with 100,000 iterations followed by AES-GCM.
- Mnemonics follow BIP-39 and have 12 or 24 words.
- The derivation path is BIP-44, `m/44'/coin'/account'/change/index`. For an HD wallet the root path is part of its identity, so the same mnemonic on another root path is a different wallet.

## Dependencies

| Package | Version Range | Purpose |
|---------|---------------|---------|
| [axios](https://github.com/axios/axios) | ^1.13.2 | HTTP client for node communication |
| [bip32](https://github.com/bitcoinjs/bip32) | ^4.0.0 | BIP-32 hierarchical deterministic wallets |
| [bip39](https://github.com/bitcoinjs/bip39) | ^3.1.0 | BIP-39 mnemonic generation |
| [blakejs](https://github.com/dcposch/blakejs) | ^1.2.1 | BLAKE2b hashing for addresses |
| [bs58](https://github.com/cryptocoinjs/bs58) | ^6.0.0 | Base58 encoding |
| [buffer](https://github.com/feross/buffer) | ^6.0.3 | `Buffer` polyfill for browser environments |
| [@noble/hashes](https://github.com/paulmillr/noble-hashes) | ^1.6.0 | Cryptographic hash helpers |
| [@noble/secp256k1](https://github.com/paulmillr/noble-secp256k1) | ^1.7.0 | secp256k1 key generation and signing |
| [js-sha3](https://github.com/emn178/js-sha3) | ^0.9.3 | keccak256 hashing |
| [node-persist](https://github.com/simonlast/node-persist) | ^4.0.4 | Storage in Node.js |

## Next Steps

<CardGrid columns="2">
<DocCard title="Wallet SDK API Reference" href="/wallet-sdk/api-reference/" icon="book">A page for every SDK module</DocCard>
<DocCard title="Client" href="/wallet-sdk/api-reference/client/" icon="sdk">Wallets, networks, balances, transfers and events</DocCard>
<DocCard title="Error Types" href="/wallet-sdk/api-reference/error-types/" icon="help">Every failure carries a machine-readable code</DocCard>
<DocCard title="Useful Links" href="/reference/links/" icon="links">Repositories and DevNet service addresses</DocCard>
</CardGrid>
