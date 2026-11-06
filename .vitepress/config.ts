import { defineConfig } from 'vitepress'
import CustomLanguages from "../config/languages";
import { writeRedirectStubs } from "./redirect-stubs";
import { deepSpaceLight, deepSpaceDark } from "./theme/shiki";

const sidebar = [
  {
    text: 'Get Started',
    link: '/quick-start/',
    collapsed: false,
    items: [
      { text: 'What Is ASI:Chain', link: '/overview/' },
      { text: 'Get DevNet ASI', link: '/quick-start/get-asi/' },
    ]
  },
  {
    text: 'Use',
    link: '/use/',
    collapsed: false,
    items: [
      { text: 'ASI Wallet', link: '/wallet/usage/' },
      { text: 'Custom Network Connection', link: '/wallet/custom-network/' },
      { text: 'Faucet', link: '/faucet/usage/' },
      { text: 'ASI Block Explorer', link: '/explorer/usage/' },
    ]
  },
  {
    text: 'Run a Node',
    link: '/nodes/',
    collapsed: false,
    items: [
      { text: 'Shard and Node Roles', link: '/nodes/roles/' },
      { text: 'Node Image', link: '/nodes/image/' },
      { text: 'Run an Observer', link: '/nodes/observer/' },
      { text: 'Run a Validator', link: '/nodes/validator/' },
      { text: 'Enroll a Validator', link: '/nodes/validator-enrollment/' },
      { text: 'Set Up a Private Shard', link: '/nodes/private-shard/' },
    ]
  },
  {
    text: 'Build',
    link: '/build/',
    collapsed: false,
    items: [
      { text: 'Wallet CLI', link: '/cli/usage/' },
      {
        text: 'Wallet SDK',
        link: '/wallet-sdk/overview/',
        collapsed: true,
        items: [
          {
            text: 'API Reference',
            link: '/wallet-sdk/api-reference/',
            collapsed: true,
            items: [
              { text: 'Client', link: '/wallet-sdk/api-reference/client/' },
              {
                text: 'Services',
                collapsed: true,
                items: [
                  { text: 'Wallets', link: '/wallet-sdk/api-reference/wallets-service/' },
                  { text: 'Crypto', link: '/wallet-sdk/api-reference/crypto-service/' },
                  { text: 'Mnemonic', link: '/wallet-sdk/api-reference/mnemonic-service/' },
                  { text: 'KeyDerivation', link: '/wallet-sdk/api-reference/key-derivation/' },
                  { text: 'KeysManager', link: '/wallet-sdk/api-reference/keys-manager/' },
                  { text: 'SignerService', link: '/wallet-sdk/api-reference/signer-service/' },
                  { text: 'AssetsService', link: '/wallet-sdk/api-reference/assets-service/' },
                ]
              },
              {
                text: 'Domains',
                collapsed: true,
                items: [
                  { text: 'Wallet', link: '/wallet-sdk/api-reference/wallet/' },
                  { text: 'Asset', link: '/wallet-sdk/api-reference/asset/' },
                  { text: 'BrowserStorage', link: '/wallet-sdk/api-reference/browser-storage/' },
                ]
              },
              {
                text: 'Error Handling',
                collapsed: true,
                items: [
                  { text: 'Error Types', link: '/wallet-sdk/api-reference/error-types/' },
                ]
              },
              {
                text: 'Utilities',
                collapsed: true,
                items: [
                  { text: 'Codec', link: '/wallet-sdk/api-reference/codec/' },
                  { text: 'Functions', link: '/wallet-sdk/api-reference/functions/' },
                  { text: 'Validators', link: '/wallet-sdk/api-reference/validators/' },
                  { text: 'Constants', link: '/wallet-sdk/api-reference/constants/' },
                  { text: 'Polyfills', link: '/wallet-sdk/api-reference/polyfills/' },
                ]
              },
            ]
          },
        ]
      },
      {
        text: 'Architecture',
        link: '/architecture/',
        collapsed: true,
        items: [
          { text: 'Component Diagrams', link: '/architecture/component-diagrams/',
            collapsed: true,
            items: [
              { text: 'Wallet Components', link: '/architecture/component-diagrams/wallet/' },
              { text: 'Explorer Components', link: '/architecture/component-diagrams/explorer/' },
              { text: 'Node Components', link: '/architecture/component-diagrams/node/' },
            ]
          },
          { text: 'Sequence Diagrams', link: '/architecture/sequence-diagrams/',
            collapsed: true,
            items: [
              { text: 'Transaction Flow', link: '/architecture/sequence-diagrams/transaction/' },
              { text: 'Balance Query Flow', link: '/architecture/sequence-diagrams/balance/' },
            ]
          },
          { text: 'State Diagrams', link: '/architecture/state-diagrams/',
            collapsed: true,
            items: [
              { text: 'Node Startup', link: '/architecture/state-diagrams/startup/' },
              { text: 'Running Node', link: '/architecture/state-diagrams/operations/' },
            ]
          },
          { text: 'Data Flow', link: '/architecture/data-flow/' },
          { text: 'Network Topology', link: '/architecture/network-topology/' },
        ]
      },
    ]
  },
  {
    text: 'Reference',
    link: '/reference/',
    collapsed: false,
    items: [
      { text: 'Network Endpoints', link: '/reference/endpoints/' },
      { text: 'Container Images', link: '/reference/container-images/' },
      { text: 'Useful Links', link: '/reference/links/' },
    ]
  },
  {
    text: 'Help',
    link: '/help/',
    collapsed: false,
    items: [
      { text: 'Frequently Asked Questions', link: '/help/faq/' },
      { text: 'Troubleshooting', link: '/help/troubleshooting/' },
    ]
  },
]

export default defineConfig({
  title: "ASI:Chain Docs",
  description: "Use the wallet, get test tokens, run a node and build on ASI:Chain",
  srcExclude: ['README.md', 'LICENSE.md'],
  buildEnd: writeRedirectStubs,

  themeConfig: {
    logo: {
      light: '/logo-light.svg',
      dark: '/logo-dark.svg'
    },
    
    nav: [
      { text: 'DevNet Apps', items: [
          { text: 'Wallet', link: 'https://wallet.dev.asichain.io' },
          { text: 'Explorer', link: 'https://explorer.dev.asichain.io' },
          { text: 'Faucet', link: 'https://faucet.dev.asichain.io' },
        ]
      },
      { text: 'GitHub', items: [
          { text: 'Rust Node', link: 'https://github.com/asi-alliance/asi-chain-rust-node' },
          { text: 'ASI Client', link: 'https://github.com/asi-alliance/asi-chain-client' },
          { text: 'Indexer', link: 'https://github.com/asi-alliance/asi-chain-indexer' },
          { text: 'Wallet SDK', link: 'https://github.com/asi-alliance/asi-chain-wallet-sdk' },
          { text: 'Wallet', link: 'https://github.com/asi-alliance/asi-chain-wallet' },
          { text: 'Wallet CLI', link: 'https://github.com/asi-alliance/asi-chain-wallet-cli' },
          { text: 'Explorer', link: 'https://github.com/asi-alliance/asi-chain-explorer' },
          { text: 'Faucet', link: 'https://github.com/asi-alliance/asi-chain-faucet' },
          { text: 'Docs Portal', link: 'https://github.com/asi-alliance/asi-chain-docs-portal' },
        ]
      },
    ],

    sidebar,

    footer: {
      message: 'ASI:Chain DevNet - Development Network',
      copyright: 'Test tokens have no real value. For testing purposes only.'
    },

    outline: [2, 3],

    search: {
      provider: 'local'
    },

    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    }
  },
  markdown: {
    languages: CustomLanguages,
    theme: { light: deepSpaceLight, dark: deepSpaceDark },
    // Screenshots load when they come near the screen, and the hidden one of a light and dark pair never loads.
    image: { lazyLoading: true },
    // Tables get a scroll wrapper, so a wide table scrolls in its own box and not the page.
    config(md) {
      const open = md.renderer.rules.table_open
      const close = md.renderer.rules.table_close
      // The region name is the nearest heading above the table and the column headers, so a screen reader
      // tells tables on one page apart. Two tables with the same columns under one heading would still share
      // a name, so a repeated name gets a number.
      const plain = (s: string) =>
        s.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/\s*\{#[^}]*\}\s*$/, '').replace(/[`*_]/g, '')
      md.renderer.rules.table_open = (tokens, idx, options, env, self) => {
        const cols: string[] = []
        for (let i = idx + 1; i < tokens.length && tokens[i].type !== 'thead_close'; i++)
          if (tokens[i].type === 'inline') cols.push(plain(tokens[i].content))
        let heading = ''
        for (let i = idx - 1; i >= 0 && !heading; i--)
          if (tokens[i].type === 'heading_open') heading = plain(tokens[i + 1].content)
        let label = (heading || 'Table') + (cols.length ? ', columns ' + cols.join(', ') : '')
        const seen: Record<string, number> = (env.tableLabels ??= {})
        seen[label] = (seen[label] || 0) + 1
        if (seen[label] > 1) label += ` (${seen[label]})`
        return `<div class="table-wrap" role="region" aria-label="${md.utils.escapeHtml(label)}" tabindex="0">` +
          (open ? open(tokens, idx, options, env, self) : self.renderToken(tokens, idx, options))
      }
      md.renderer.rules.table_close = (tokens, idx, options, env, self) =>
        (close ? close(tokens, idx, options, env, self) : self.renderToken(tokens, idx, options)) + '</div>'
    }
  },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' }],
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    // Roboto for text and controls, Roboto Mono for headings, the wordmark and code, as in the products.
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&family=Roboto+Mono:wght@400;500;700&display=swap', rel: 'stylesheet' }],
    ['meta', { name: 'theme-color', content: '#FFFFFF', media: '(prefers-color-scheme: light)' }],
    ['meta', { name: 'theme-color', content: '#1B1F21', media: '(prefers-color-scheme: dark)' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en' }],
    ['meta', { property: 'og:title', content: 'ASI:Chain Documentation' }],
    ['meta', { property: 'og:site_name', content: 'ASI:Chain Docs' }],
    ['meta', { property: 'og:url', content: 'https://docs.asichain.io/' }],
    ['meta', { property: 'og:description', content: 'Use the wallet, get test tokens, run a node and build on ASI:Chain' }],
    ['meta', { property: 'og:image', content: 'https://docs.asichain.io/logo-light.svg' }],
    ['meta', { property: 'og:image:width', content: '512' }],
    ['meta', { property: 'og:image:height', content: '512' }],
    ['meta', { property: 'og:image:type', content: 'image/svg+xml' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'ASI:Chain Documentation' }],
    ['meta', { name: 'twitter:description', content: 'Use the wallet, get test tokens, run a node and build on ASI:Chain' }],
    ['meta', { name: 'twitter:image', content: 'https://docs.asichain.io/logo-light.svg' }],
  ]
})
