// Replaces public/images/wallet-sdk/module-architecture.svg on the Wallet SDK overview.
// The module list repeats in wallet-sdk/api-reference/index.md, wallet-sdk/overview/index.md and the sidebar in
// .vitepress/config.ts: change all four places together.
const mods = (ids) => ids;
export default {
  kind: 'flow',
  title: 'Wallet SDK modules',
  desc: 'Your application uses Client. Client uses the services Wallets, Mnemonic, KeyDerivation, KeysManager, Crypto, SignerService and AssetsService. The services use the domains Wallet, Asset, BrowserStorage and CustomError. The domains use the utilities Codec, Functions, Validators, Constants and Polyfills.',
  opts: { colGaps: [14, 14, 14, 14], rowGaps: [80, 80, 14, 76, 70], wrap: 20 },
  groups: [
    { id: 'client', label: 'Client', sub: 'uses Services', nodes: ['client'], pad: { l: 20, r: 20 } },
    { id: 'services', label: 'Services', sub: 'use Domains', nodes: mods(['wallets', 'mnemonic', 'kd', 'km', 'crypto', 'signer', 'assets']) },
    { id: 'domains', label: 'Domains', sub: 'use Utilities', nodes: mods(['wallet', 'asset', 'bs', 'ce']) },
    { id: 'utils', label: 'Utilities', nodes: mods(['codec', 'fn', 'val', 'const', 'poly']) },
  ],
  nodes: [
    { id: 'app', label: 'Your Application', kind: 'terminal', col: 1.5, row: 0 },
    { id: 'client', label: 'Client', sub: 'wallets · sessions · networks · transfers · events', kind: 'chain', col: 1.5, row: 1, w: 350 },
    { id: 'wallets', label: 'Wallets', col: 0, row: 2, w: 128 },
    { id: 'mnemonic', label: 'Mnemonic', col: 1, row: 2, w: 128 },
    { id: 'kd', label: 'KeyDerivation', col: 2, row: 2, w: 128 },
    { id: 'km', label: 'KeysManager', col: 3, row: 2, w: 128 },
    { id: 'crypto', label: 'Crypto', col: 0, row: 3, w: 128 },
    { id: 'signer', label: 'SignerService', col: 1, row: 3, w: 128 },
    { id: 'assets', label: 'AssetsService', col: 2, row: 3, w: 128 },
    { id: 'wallet', label: 'Wallet', col: 0, row: 4, w: 128 },
    { id: 'asset', label: 'Asset', col: 1, row: 4, w: 128 },
    { id: 'bs', label: 'BrowserStorage', col: 2, row: 4, w: 128 },
    { id: 'ce', label: 'CustomError', col: 3, row: 4, w: 128 },
    { id: 'codec', label: 'Codec', col: 0, row: 5, w: 128 },
    { id: 'fn', label: 'Functions', col: 1, row: 5, w: 128 },
    { id: 'val', label: 'Validators', col: 2, row: 5, w: 128 },
    { id: 'const', label: 'Constants', col: 3, row: 5, w: 128 },
    { id: 'poly', label: 'Polyfills', col: 4, row: 5, w: 128 },
  ],
  edges: [
    { from: 'app', to: 'client', label: 'uses' },
  ],
  narrow: {
    opts: { colGaps: [12], rowGaps: [80, 80, 10, 10, 10, 76, 10, 76, 10, 10] },
    nodes: {
      app: { col: 0.5, row: 0 },
      client: { col: 0.5, row: 1, w: 268, sub: '' },
      wallets: { col: 0, row: 2 }, mnemonic: { col: 1, row: 2 },
      kd: { col: 0, row: 3 }, km: { col: 1, row: 3 },
      crypto: { col: 0, row: 4 }, signer: { col: 1, row: 4 },
      assets: { col: 0, row: 5 },
      wallet: { col: 0, row: 6 }, asset: { col: 1, row: 6 },
      bs: { col: 0, row: 7 }, ce: { col: 1, row: 7 },
      codec: { col: 0, row: 8 }, fn: { col: 1, row: 8 },
      val: { col: 0, row: 9 }, const: { col: 1, row: 9 },
      poly: { col: 0, row: 10 },
    },
  },
};
