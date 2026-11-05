# Client

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/v2.1.0/src/domains/Client/index.ts)

`Client` is the entry point of the SDK. It owns the wallets that are open in memory, the list of networks, the signing sessions, the transaction reservations and the event bus. Create it with `Client.create`, because the constructor is private. The [Wallet](/wallet-sdk/api-reference/wallet/) page covers the objects that `Client` returns.

The SDK keeps no active account. Every call that touches an account names its wallet and its account, and a wallet id that is not open or an account id that does not belong to the wallet throws.

## Create the Client

```ts
Client.create(options: ICreateClientOptions): Promise<Client>
```

```ts
interface ICreateClientOptions {
    networksConfig: TNetworksConfig;
    defaultNetwork?: NetworkName;
    storageOptions?: IStorageFabricOptions;
    eventDispatcher?: IClientEventDispatcher;
    onListenerError?: TClientEventListenerErrorHandler;
    flags?: ICreateClientFlags;
    security?: ISessionPolicy;
}
```

| Option | Meaning |
|--------|---------|
| `networksConfig` | Network name mapped to `{ ValidatorURL, ReadOnlyURL, IndexerURL, nodeApiProfile }`. See [Network Configuration](/wallet-sdk/overview/#network-configuration). |
| `defaultNetwork` | Name of the network to select at start. |
| `storageOptions` | `{ nodeStorageDir }` sets the directory of the Node.js storage. The default is `./storage`. The browser build uses IndexedDB and ignores it. |
| `eventDispatcher` | Callbacks fixed at creation time. Prefer `getEventBus()`, which can subscribe at any time. |
| `onListenerError` | Receives the error of an event listener that threw or rejected. |
| `flags` | `{ withInsensitiveCacheStorage }` keeps a cache of public account data, which `getInsensitiveAccountsData()` reads. |
| `security` | Signing session policy. |

`create` also brings storage up to date. It refuses to touch data written by a newer SDK build, a broken migration chain, or a migration that an earlier run left unfinished. In those cases it rejects with `StorageSchemaError`, whose `isStorageIntact` flag says whether the data on disk is still readable.

`nodeApiProfile` is required on every network and has no default, so a missing or unknown value makes `create` throw. Every URL must be valid.

### Session Policy

```ts
interface ISessionPolicy {
    autoLockMs?: number;
    requirePassword?: RequirePassword;
}
```

`requirePassword` is `"once-per-session"` (the default) or `"every-signature"`. In the first mode, `openWallet`, `unlockWallet` or the first call that carries a password starts a session, and later operations reuse the decrypted secret until the session ends. `autoLockMs` is the length of the session and defaults to `DEFAULT_AUTO_LOCK_MS`, 15 minutes. Activity does not extend a session.

In the second mode no session is ever held, every signature needs the password, and `unlockWallet` throws. A non-positive `autoLockMs` switches the client to this mode whatever `requirePassword` says.

```ts
import {
    Client,
    NodeApiProfile,
    RequirePassword,
} from "@asichain/asi-wallet-sdk";

export function createClient(validatorUrl: string, indexerUrl: string): Promise<Client> {
    return Client.create({
        networksConfig: {
            DevNet: {
                ValidatorURL: validatorUrl,
                ReadOnlyURL: validatorUrl,
                IndexerURL: indexerUrl,
                nodeApiProfile: NodeApiProfile.SCALA,
            },
        },
        defaultNetwork: "DevNet",
        security: {
            autoLockMs: 5 * 60 * 1000,
            requirePassword: RequirePassword.ONCE_PER_SESSION,
        },
        onListenerError: (name, error) => console.error(name, error),
    });
}
```

## Wallets

```ts
generateMnemonic(strength?: MnemonicStrength): string
generatePrivateKey(): Uint8Array
createHDWallet(payload: ICreateHDWalletPayload, password: string): Promise<Wallet>
createPrivateKeyWallet(payload: ICreatePrivateKeyWalletPayload, password: string): Promise<Wallet>
openWallet(signerId: string, password: string): Promise<Wallet>
closeWallet(walletId: string): void
closeAllWallets(): void
isWalletOpen(walletId: string): boolean
removeWallet(walletId: string): Promise<Wallet>
getWalletManager(): WalletManager
```

```ts
interface ICreateHDWalletPayload {
    mnemonic: string;
    accountName: string;
    index?: number;
}
```

```ts
interface ICreatePrivateKeyWalletPayload {
    privateKey: Uint8Array;
    accountName: string;
}
```

`createHDWallet` and `createPrivateKeyWallet` store the wallet encrypted with the password and return it open but locked. `openWallet` takes the signer id of a stored wallet, which `getWalletManager().getPublicWalletsMetadata()` lists. It rejects a signer that is already open, decrypts the signer, and with the default policy starts a session.

A wallet is open when it is in memory and unlocked when a session holds its secret. `closeWallet` and `closeAllWallets` drop wallets from memory without touching storage and lock them first. Only `removeWallet` deletes stored data.

Creation is protected against duplicates. A secret that is already stored throws `DuplicateWalletError`, and a key that already belongs to a stored account throws `DuplicateAccountError`. Both carry the ids of the existing owner and both work while every wallet is locked. An HD wallet is identified by its mnemonic together with its root HD path, so the same mnemonic on another root path is a different wallet.

If the setup that follows loading fails, for example because the reservations cannot be restored, the client takes the wallet out again. A failed `openWallet` can be repeated as it is. A failed `createHDWallet`, `createPrivateKeyWallet` or `importWalletKeyfile` has already stored the wallet, so repeating it throws `DuplicateWalletError`. Call `openWallet` instead.

`removeWallet` and `clearPersistence` run exclusively. While one of them runs, new operations are refused with `OperationsSuspendedError`, and operations in flight are waited for first.

## Signing Sessions

```ts
isWalletUnlocked(walletId: string): boolean
unlockWallet(walletId: string, password: string): Promise<void>
lockWallet(walletId: string): void
```

`unlockWallet` addresses a wallet that is already open by its wallet id, not a stored signer by its signer id. `lockWallet` ends the session and clears the secret from memory, and the `walletLocked` event fires. Signing after the session expired, without a password, throws `WalletLockedError` with status `403`, so a UI can handle it like an expired token and ask for the password again.

## Accounts

```ts
deriveAccount(walletId: string, accountName: string, password: string): Promise<ICreatedAccountData>
removeAccount(walletId: string, accountId: string): Promise<Account>
renameAccount(walletId: string, accountId: string, name: string): Promise<void>
getAccount(walletId: Wallet["id"], accountId: Account["id"]): Account
```

`deriveAccount` returns `{ accountId, account }`. Both `deriveAccount` and `removeAccount` work on HD wallets only and throw `HDWalletOnlyOperationError` on a private-key wallet. `removeAccount` also refuses to remove the last account of a wallet with `LastAccountRemovalError`.

## Networks

```ts
getNetworks(): INetworkRecord[]
getNetworksState(): INetworksState
getNetwork(id: NetworkId): INetworkRecord
getCurrentNetwork(): INetworkRecord
getCurrentNetworkId(): NetworkId
setNetwork(networkId: NetworkId): void
addNetwork(name: NetworkName, config: INetworkConfig): Promise<INetworkRecord>
updateNetwork(id: NetworkId, update: INetworkUpdate): Promise<void>
removeNetwork(id: NetworkId): Promise<void>
isNetworkBusy(networkId?: NetworkId): boolean
hasNetworkReservations(networkId?: NetworkId): boolean
```

The networks passed to `Client.create` are built in. They have `isDefault: true`, and `updateNetwork` and `removeNetwork` reject them. A network added with `addNetwork` is custom, gets a generated id, and is stored, so it survives a restart. Address a network by its id, because the name can be edited.

A network with an operation in flight cannot be switched, updated or removed. `setNetwork`, `updateNetwork` and `removeNetwork` throw `NetworkBusyError` until the network is idle. `isNetworkBusy` and the `networkBusyChanged` event let a UI disable those controls. `hasNetworkReservations` tells whether open wallets still hold funds reserved on the network, and removing the network drops those reservations.

Every change to the list or the selection emits one `networksChanged` event with the full state, `{ networks, selectedNetwork }`. A failed storage write changes nothing and emits nothing.

```ts
import { Client, ClientEvent, NodeApiProfile } from "@asichain/asi-wallet-sdk";

export async function addStaging(client: Client, validatorUrl: string, indexerUrl: string): Promise<void> {
    const unsubscribe = client
        .getEventBus()
        .on(ClientEvent.NETWORKS_CHANGED, ({ networks, selectedNetwork }) => {
            console.log(networks.length, "networks, selected:", selectedNetwork.name);
        });

    const staging = await client.addNetwork("Staging", {
        ValidatorURL: validatorUrl,
        ReadOnlyURL: validatorUrl,
        IndexerURL: indexerUrl,
        nodeApiProfile: NodeApiProfile.SCALA,
    });
    client.setNetwork(staging.id);

    unsubscribe();
}
```

## Balances and Amounts

```ts
getBalance(address: Address): Promise<bigint>
getAvailableBalance(walletId: string, accountId: string): Promise<bigint>
toDisplayAmount(atomicAmount: bigint): string
toAtomicAmount(amount: number | string): bigint
```

`getBalance` returns the total balance of an address on the current network. `getAvailableBalance` subtracts the funds that pending reservations hold. Amounts are `bigint` values in atomic units, and ASI has 8 decimal places, so `toAtomicAmount("10")` is `1000000000n`.

A balance that cannot be trusted throws `BalanceUnavailableError` with status `502`, carrying the address and a reason. It never resolves to `0n`, because an unreachable node, a vault that reports an error and an empty account are three different outcomes.

## Transfers and Deploys

```ts
transfer(request: ITransferRequest, password?: string): Promise<IReservedOperationResult>
deploy(request: IDeployRequest, password?: string): Promise<IReservedOperationResult>
signDeploy(request: ISignDeployRequest, password?: string): Promise<SignedResult>
exploreDeploy(rholang: string): Promise<unknown>
watchDeploy(deployId: string, callbacks?: IDeployWatchCallbacks, options?: IDeployWatchOptions): IDeployWatchHandle
```

```ts
interface ITransferRequest {
    walletId: string;
    accountId: string;
    to: Address;
    amount: bigint;
}
```

```ts
interface IDeployRequest {
    walletId: string;
    accountId: string;
    term: string;
    phloLimit?: number;
}
```

```ts
interface ISignDeployRequest {
    walletId: string;
    accountId: string;
    term: string;
    phloLimit?: number;
    phloPrice?: number;
    shardId?: string;
}
```

```ts
interface IReservedOperationResult {
    deployId: string;
    subscribe: (callbacks: IDeployWatchCallbacks) => () => void;
}
```

```ts
interface IDeployWatchCallbacks {
    onConfirmed?: (result: IDeployConfirmedResult) => void;
    onError?: (error: Error) => void;
    onStatus?: (status: IDeployStatusResult, deployId: string) => void;
}
```

`password` is optional. When a session is active, leave it out. When you pass it and the policy holds sessions, the call starts the session before it signs.

`transfer` and `deploy` reserve funds before they send the deploy. The reservation is stored first, and `deployId` is the deploy signature, known before the node answers, so a crash while the request is in flight cannot lose the lock. A deploy reserves `phloLimit * phloPrice`. What happens to the funds depends on how the submission ends.

| Submission outcome | Reservation | Error |
|--------------------|-------------|-------|
| The node accepted the deploy | Kept until the deploy is confirmed or the reservation expires | none |
| The node refused it (HTTP 4xx) | Removed, funds released | `DeploySubmissionRejectedError`, status `400` |
| The outcome is unknown (dropped connection, timeout, HTTP 5xx) | Kept, because the deploy may still land | `ApiRequestError`, status `502` |
| The wallet was closed before the deploy left | Removed, nothing is sent | `DomainClosedError`, status `410` |

`DeploySubmissionRejectedError` extends `ApiRequestError`, so existing handlers for `ApiRequestError` keep working.

`signDeploy` builds the deploy, signs it and returns `{ data, deployer, signature, sigAlgorithm }` without sending anything and without creating a reservation. Use it when you submit the deploy yourself, and pair it with `addTransactionReservation`. Unlike `deploy`, its request carries `phloPrice` and `shardId`. The defaults are `DEFAULT_PHLO_LIMIT` (500000), `DEFAULT_PHLO_PRICE` (1) and the shard `"root"`. The call reads the current block number from the network. A blank `term` or a non-positive phlo value is rejected before anything is signed.

`exploreDeploy` runs read-only Rholang and needs no password. `watchDeploy` polls the status of a deploy and returns `{ cancel, done }`.

```ts
import { Client } from "@asichain/asi-wallet-sdk";

export async function signOnly(client: Client, walletId: string, accountId: string, password: string): Promise<string> {
    const signed = await client.signDeploy(
        { walletId, accountId, term: "new x in { Nil }" },
        password,
    );
    return signed.signature;
}
```

## Reservations

```ts
getReservations(walletId: string): Promise<ITransactionReservation[]>
addTransactionReservation(request: TTransactionReservationRequest, password?: string): Promise<ITransactionReservation>
updateTransactionReservation(reservationId: ITransactionReservation["id"], request: TTransactionReservationRequest, password?: string): Promise<ITransactionReservation>
removeTransactionReservation(walletId: string, reservationId: ITransactionReservation["id"]): Promise<ITransactionReservation>
```

`transfer` and `deploy` create reservations on their own. The three write methods are for deploys that you submit outside the SDK, for example through a hardware signer or a relayer, and that still have to lock funds so the available balance and the pending history stay correct.

A request is `{ walletId, accountId }` plus either a transfer or a deploy description.

```ts
interface ITransferReservationMeta {
    kind: "transfer";
    to: Address;
    amount: bigint;
}
```

```ts
interface IDeployReservationMeta {
    kind: "deploy";
    term?: string;
}
```

Both also carry `deployId`, `pendingAmount` and `gasCost`. `pendingAmount` is the total to lock in atomic units. Every call validates the request before it stores anything.

- `deployId` is not empty and unique among the live reservations of the network.
- `pendingAmount` is positive and fits the remote balance minus what is already reserved. Reserving the whole balance is allowed.
- `gasCost` is not negative and does not exceed `pendingAmount`.
- For a transfer, `to` is a valid checksummed address, `amount` is positive, and `amount + gasCost` fits inside `pendingAmount`.

`updateTransactionReservation` keeps the reservation id and checks the balance against the change of `pendingAmount`, so shrinking a reservation never fails on funds. It cannot move a reservation to another account or network, which takes a remove and an add. A second action on the same account, deploy or reservation throws `ReservationActionInProgressError`.

A reservation expires after `RESERVATION_EXPIRATION_TIME` and is released when the deploy is confirmed.

## History

```ts
getTransactionsHistory(walletId: string, accountId: string, options?: ITransactionsHistoryOptions): Promise<Transaction[]>
```

```ts
interface ITransactionsHistoryOptions {
    sources?: THistorySource[];
    pagination?: Pagination;
}
```

`getTransactionsHistory` merges the indexed history of the account with its pending transactions on the current network. It removes duplicates by deploy id, so the indexed row wins once the deploy is confirmed, and sorts newest first. `sources` is `["pending", "executed"]` by default. `["pending"]` reads reservations only and never calls the indexer.

The two sides come from different backends, because a reservation is released when the node confirms the deploy and the indexer ingests the block later. For a short time a transaction can therefore be in both lists or in neither.

The SDK team lists a known limitation, [issue 178](https://github.com/asi-alliance/asi-chain-wallet-sdk/issues/178). Only the first page of the executed history is reliable, because the indexer query applies `offset` and `limit` to transfers and deployments separately.

## Keyfiles

```ts
getExportedAccountData(walletId: string, accountId: string): IAccountKeyfile
exportWalletKeyfile(walletId: string, password: string): Promise<IWalletKeyfile>
previewWalletKeyfileImport(source: unknown, password: string): Promise<IKeyfileImportPreview>
importWalletKeyfile(source: unknown, password: string, options?: IImportWalletKeyfileOptions): Promise<Wallet>
importKeyfileAccounts(source: unknown, password: string, options?: IImportWalletKeyfileOptions): Promise<IKeyfileAccountsImportResult>
```

```ts
interface IImportWalletKeyfileOptions {
    accountIndexes?: number[];
}
```

There are two kinds of keyfile, told apart by `type`. A wallet keyfile (`asi-wallet-keyfile`) holds the encrypted secret and the encrypted account list, and it restores a wallet. An account keyfile (`asi-account-keyfile`) from `getExportedAccountData` is a public descriptor with the name, address and index. It holds no key material and restores nothing.

`previewWalletKeyfileImport` writes nothing. It decrypts the keyfile, derives its accounts and marks each one `"new"` or `"already-imported"`. `source` can be the object or its JSON string. A keyfile is matched to a stored wallet by its secret and, for HD wallets, its root HD path, so accounts are never merged into a wallet that would derive other keys. The account list is limited to `MAX_KEYFILE_ACCOUNTS` (1000) entries with names of at most `MAX_KEYFILE_ACCOUNT_NAME_LENGTH` (128) characters, and the SDK does not apply those limits when you create or rename an account.

```ts
import { Client, KeyfileImportAccountStatus } from "@asichain/asi-wallet-sdk";

export async function restoreKeyfile(client: Client, keyfile: unknown, password: string): Promise<void> {
    const preview = await client.previewWalletKeyfileImport(keyfile, password);

    if (preview.existingSignerId) {
        // The secret is stored already, so import only the new accounts.
        const accountIndexes = preview.accounts.flatMap((account) =>
            account.status === KeyfileImportAccountStatus.NEW && account.index !== null
                ? [account.index]
                : [],
        );
        await client.importKeyfileAccounts(keyfile, password, { accountIndexes });
    } else {
        await client.importWalletKeyfile(keyfile, password);
    }
}
```

## Events

```ts
getEventBus(): IClientEventSource
```

`getEventBus()` returns a typed source with `on(name, listener)`, which returns its own unsubscribe function, and `off(name, listener)`. Subscriptions can be added and removed at any time. A listener that throws or rejects does not break the other listeners or the operation that emitted the event. Its error goes to `onListenerError`.

| Event | Payload | Emitted when |
|-------|---------|--------------|
| `walletsChanged` | `Wallet[]` | A wallet was opened, closed, created, imported or removed |
| `accountsChanged` | `walletId, Account[]` | The accounts of an open wallet changed |
| `networksChanged` | `INetworksState` | A network was added, updated, removed or selected |
| `networkChanged` | `INetworkRecord` | The selection changed. Deprecated in favor of `networksChanged` |
| `reservationsChanged` | `TReservationsByWallet` | A reservation was added, replaced, removed, confirmed or expired |
| `networkBusyChanged` | `networkId, isBusy` | An operation started or finished on a network |
| `walletLocked` | `walletId` | A signing session ended, by `lockWallet` or by the auto-lock |
| `walletFingerprintUpgraded` | `walletId` | A wallet stored by version 2.0.0 or earlier got a new fingerprint when it was opened. Transitional |

The names are the values of the `ClientEvent` enum.

## Cleanup

```ts
clearPersistence(): Promise<void>
getInsensitiveAccountsData(): Promise<IInsensitiveCacheRecord[]>
close(): Promise<void>
```

`clearPersistence` closes the open wallets, deletes all stored data and emits `walletsChanged`. Wallets that are still being opened, created or imported are discarded, and their calls reject with `WalletOperationCancelledError`. `getInsensitiveAccountsData` needs the `withInsensitiveCacheStorage` flag. `close` locks and drops every open wallet, removes the event listeners, and shuts down the storage and the network clients. Closing twice does nothing.
