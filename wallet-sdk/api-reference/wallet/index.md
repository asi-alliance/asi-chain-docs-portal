# Wallet

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/v2.1.0/src/domains/Wallet/index.ts)

A `Wallet` owns one `Signer` and a set of `Account`s. It is either a private-key wallet with a single account or an HD wallet with accounts derived from a mnemonic. This page also covers `Account`, `Signer` and `SigningSession`, which a wallet is built from.

::: tip Use Client in applications
`Client` creates, stores, opens and removes wallets for you. Use these classes directly only when you need the low-level pieces, for example to build a wallet in memory without storage. See [Client](/wallet-sdk/api-reference/client/).
:::

```ts
import { Wallet, Account, Signer, SigningSession } from '@asichain/asi-wallet-sdk';
```

## Secrets

Secrets never travel as plain options. Every factory and every call that needs a password takes a `SecretsProvider`, a closure that returns the secret when the SDK asks for it.

```ts
class SecretsProvider {
  constructor(providerInterface: () => any)
  getSecret(): any
}
```

For `Wallet.createPk` the closure returns `{ password, secret: { privateKey } }`. For `Wallet.createHD` it returns `{ password, secret: { seed } }`, where `seed` is the recovery phrase. For calls that only check or unlock, `{ password }` is enough.

## Creating a Wallet

The constructor is private. A wallet comes from one of four static factories.

```ts
class Wallet {
  static createPk(accountOptions: TCreateAccountPayload, secretProvider: SecretsProvider): Promise<Wallet>
  static createHD(options: ICreateHDWalletOptions, secretProvider: SecretsProvider): Promise<Wallet>
  static importKeyfile({ walletType, encryptedSecret, accounts }: IImportKeyfileWalletPayload, passwordProvider: SecretsProvider): Promise<Wallet>
  static restore(payload: IRestoreWalletPayload, passwordProvider: SecretsProvider): Promise<Wallet>
}
```

| Factory | Use |
|---------|-----|
| `createPk` | New private-key wallet with one account. `accountOptions` is `{ name }`. |
| `createHD` | New HD wallet. `options.pathOptions` is `{ index }` or `{ customHDPath }`, and `options.accountOptions` describes the first account. |
| `importKeyfile` | Wallet from a decrypted keyfile. It gets a new signer id and a freshly encrypted secret. |
| `restore` | Wallet rebuilt from stored records. The signer fingerprint is recomputed from the decrypted secret. |

```ts
interface ICreateHDWalletOptions {
  pathOptions: TCreateHDPathWalletOptions // { index: number } | { customHDPath: Bip44Path }
  accountOptions: TCreateAccountPayload
}

interface IImportKeyfileWalletPayload {
  walletType: WalletTypes
  encryptedSecret: EncryptedData
  accounts: TCreateAccountPayload[]
}
```

```ts
import { KeysManager, Mnemonic, SecretsProvider, Wallet, WalletTypes } from '@asichain/asi-wallet-sdk';

const keyPair = KeysManager.generateKeyPair();
const privateKey = keyPair.privateKey;
const provider = new SecretsProvider(() => ({
  password: 'example-password',
  secret: { privateKey },
}));

const wallet = await Wallet.createPk({ name: 'Main' }, provider);
const [account] = wallet.getAccounts();

console.log(wallet.getType() === WalletTypes.PRIVATE_KEY);
console.log(account.getName(), account.getAddress().startsWith('1111'));

const hdProvider = new SecretsProvider(() => ({
  password: 'example-password',
  secret: { seed: Mnemonic.generateMnemonic() },
}));
const hd = await Wallet.createHD(
  { pathOptions: { index: 0 }, accountOptions: { name: 'Account 1' } },
  hdProvider,
);
const derived = await hd.deriveAccount({ name: 'Account 2' }, hdProvider);
console.log(hd.getAccounts().length, derived.account.getIndex());
```

## Identity and Accounts

```ts
class Wallet {
  getId(): string
  getType(): WalletTypes
  getSigner(): Signer
  getAccounts(): Account[]
  getAccountsMap(): Map<string, Account>
  getAccount(id: string): Account
  runAccountOperation<TResult>(accountId: string, operation: (account: Account) => Promise<TResult>): Promise<TResult>
}

enum WalletTypes {
  PRIVATE_KEY = 'private-key',
  HD = 'hd',
}
```

A wallet has no active account. `getAccount` resolves the id on every call and throws `UnknownAccountError` when the id belongs to another wallet. `runAccountOperation` resolves the account and marks it busy for the duration of the callback, which is what lets `removeAccount` refuse an account that is signing.

## Session

A wallet delegates its signing session to its `Signer`.

```ts
class Wallet {
  isUnlocked(): boolean
  unlock(passwordProvider: SecretsProvider, options?: ISigningSessionOptions): Promise<void>
  lock(): void
  isPasswordValid(passwordProvider: SecretsProvider): Promise<boolean>
}

interface ISigningSessionOptions {
  autoLockMs?: number
  onAutoLock?: () => void
}
```

`unlock` decrypts the secret once and keeps it in memory until `lock` or the auto-lock timer. When `autoLockMs` is omitted, the session lasts 15 minutes (`DEFAULT_AUTO_LOCK_MS`). A value of zero or less holds no session, so the wallet stays locked. The timer is fixed and does not restart on activity.

`isPasswordValid` returns `false` only for a wrong password. A storage failure, damaged data or an unsupported encryption version is rethrown, so a broken store is not reported as a typo.

## Changing Accounts

```ts
class Wallet {
  deriveAccount(payload: Omit<TCreateAccountPayload, "index">, passwordProvider: SecretsProvider): Promise<ICreatedAccountData>
  addAccounts(accounts: Account[]): void
  removeAccount(id: string): Account
  updateAccount(id: string, payload: TEditableAccountOptions): void
}

interface ICreatedAccountData {
  accountId: string
  account: Account
}
```

- `deriveAccount` takes the next free derivation index. On a private-key wallet it throws `HDWalletOnlyOperationError`.
- `removeAccount` works only on HD wallets. It throws `AccountBusyError` while the account has an operation in flight and `LastAccountRemovalError` for the last account. To drop a whole wallet use `Client.removeWallet`.
- `updateAccount` changes the account name, which is the only editable field (`TEditableAccountOptions` is `{ name? }`).
- `addAccounts` adds several accounts at once and keeps them ordered by derivation index.

See [Error Types](/wallet-sdk/api-reference/error-types/) for the error classes.

## Signing and Transfers

Each call takes the account id first. `passwordProvider` is optional when the wallet is unlocked. Without a session and without a provider the call throws `WalletLockedError`.

```ts
class Wallet {
  transfer(accountId: string, payload: ITransferDetails, passwordProvider?: SecretsProvider): Promise<string>
  deploy(accountId: string, payload: TDeployDetails, passwordProvider?: SecretsProvider): Promise<string>
  signDeploy(accountId: string, payload: TDeployDetails, passwordProvider?: SecretsProvider): Promise<SignedResult>
  signTransfer(accountId: string, payload: ITransferDetails, passwordProvider?: SecretsProvider): Promise<SignedResult>
}

interface ITransferDetails {
  to: Address
  amount: bigint
  asset: Asset
  phloLimit?: number
  phloPrice?: number
  shardId?: string
}
```

| Method | Result |
|--------|--------|
| `transfer` | Signs and submits a transfer, then returns the deploy id. |
| `deploy` | Signs and submits a deploy, then returns the deploy id. |
| `signTransfer` | Validates the recipient, signs the transfer and returns it without submitting. |
| `signDeploy` | Signs the deploy and returns it without submitting. |

`TDeployDetails` is `{ term, phloLimit?, phloPrice?, shardId? }` as accepted by `Client.signDeploy`. A `SignedResult` is described on the [SignerService](/wallet-sdk/api-reference/signer-service/) page.

## Account

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/v2.1.0/src/domains/Account/index.ts)

One address inside a wallet with its asset portfolio.

```ts
class Account {
  constructor({ id, name, index, portfolioOptions, address, publicKey }: IAccountOptions)
  static create(accountOptions: TCreateAccountPayload, secretProvider: SecretsProvider): Promise<Account>
  getId(): string
  getName(): string
  getIndex(): number | null
  getAddress(): Address
  getPublicKey(): Uint8Array
  getFingerprint(): string
  listAssets(): Asset[]
  getAsset(id: Asset["id"]): Asset | null
  registerAsset(asset: Asset): void
  setPrimaryAsset(id: Asset["id"]): void
  update(options: TEditableAccountOptions): void
  getBalance(): Promise<IBalanceData>
  getTransactionsHistory(networkId?: NetworkId, pagination?: Pagination): Promise<Transaction[]>
}
```

`getIndex` is `null` for a private-key account. `getFingerprint` returns the hex SHA-256 of the public key, which identifies the key pair without decrypting anything. `getBalance` and `getTransactionsHistory` read from the active network and need an initialized `Client`. The history combines transfers matched by address with deploys matched by the deployer public key, newest first.

## Signer

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/v2.1.0/src/domains/Signer/index.ts)

The signing boundary. It holds the encrypted secret and produces signatures without handing key bytes to callers. `HDSigner` and `PrivateKeySigner` implement it. `Wallet.getSigner()` returns the wallet's signer.

```ts
abstract class Signer {
  getId(): string
  getFingerprint(): string
  getEncryptedSecret(): EncryptedData
  getEncryptedDataKey(): EncryptedData
  isUnlocked(): boolean
  unlock(passwordProvider: SecretsProvider, options?: ISigningSessionOptions): Promise<void>
  resolveDataKey(passwordProvider?: SecretsProvider): Promise<string>
  lock(): void
  isPasswordValid(passwordProvider: SecretsProvider): Promise<boolean>
  abstract sign(payload: string, signingContext: TSigningContext): Promise<ISignedMessageResponse>
}

type ISignedMessageResponse = { signature: Uint8Array; publicKey: Uint8Array }
type TPKSigningContext = { passwordProvider?: SecretsProvider }
type THDSigningContext = { passwordProvider?: SecretsProvider; index: number }
type TSigningContext = TPKSigningContext | THDSigningContext
```

`sign` uses the in-memory secret when a session is active and otherwise decrypts with `signingContext.passwordProvider`. It throws `WalletLockedError` when neither is available. The private key is zeroed after an ephemeral decrypt. `resolveDataKey` returns the second secret that encrypts non-secret user data at rest, such as transaction reservations, and never signs anything.

## SigningSession

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/v2.1.0/src/domains/SigningSession/index.ts)

The in-memory session of one signer. A `Signer` creates it and keeps it for its whole life, so you rarely build one yourself.

```ts
class SigningSession {
  constructor(signerId: string)
  isActive(): boolean
  getSecret(): TDecryptedSecret | null
  getDataKey(): string | null
  getSessionGeneration(): number
  release(): void
  hold(currentGeneration: number, secrets: ISigningSessionSecrets, options?: ISigningSessionOptions): void
}
```

`release` always raises the generation counter and is safe to call twice. `unlock` reads the generation before it decrypts, and `hold` compares it afterwards. If the wallet was locked while the decryption was running, `hold` zeroes the fresh secret and throws `WalletOperationCancelledError`, so a slow unlock cannot reopen a wallet the user has just locked.
