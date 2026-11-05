import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import CustomLanguages from "../config/languages";

export default withMermaid(defineConfig({
  title: "ASI:Chain Docs",
  description: "Use the wallet, get test tokens, run a node and build on ASI:Chain",
  css: ['custom.css'],

  mermaid: {
    theme: 'base',
    themeVariables: {
      fontFamily: '"Roboto Mono", monospace'
    }
  },

  themeConfig: {
    logo: {
      light: '/logo-light.svg',
      dark: '/logo-dark.svg'
    },
    
    nav: [
      { text: 'Get Started', link: '/quick-start/' },
      { text: 'Guides', items: [
          { text: 'Documentation', items: [
              { text: 'Wallet', link: '/wallet/usage/' },
              { text: 'Wallet SDK', link: '/wallet-sdk/overview/' },
              { text: 'Wallet CLI', link: '/cli/usage/' },
              { text: 'Explorer', link: '/explorer/usage/' },
              { text: 'Faucet', link: '/faucet/usage/' },
            ]
          },
          { text: 'DevNet Apps', items: [
              { text: 'Wallet', link: 'https://wallet.dev.asichain.io' },
              { text: 'Explorer', link: 'https://explorer.dev.asichain.io' },
              { text: 'Faucet', link: 'https://faucet.dev.asichain.io' },
            ]
          },
        ]
      },
      { text: 'Nodes', items: [
          { text: 'Join as an Observer', link: '/quick-start/join-observer/' },
          { text: 'Join as a Validator', link: '/quick-start/join-validator/' },
          { text: 'Validator Node Image', link: '/shard-nodes/validator-image/' },
          { text: 'Set Up a Private Shard', link: '/shard-nodes/own-shard/' },
        ]
      },
      { text: 'Architecture', link: '/architecture/' },
      { text: 'FAQ', link: '/faq/' },
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

    sidebar: [
      {
        text: 'General',
        collapsed: false,
        items: [
          { text: 'General Overview', link: '/general/overview/' },
          { text: 'Network Endpoints', link: '/general/endpoints/' },
          { text: 'Documentation Status', link: '/general/documentation-status/' },
          { text: 'Container Images', link: '/general/container-images/' },
          { text: 'Useful Links', link: '/general/useful-links/' },
        ]
      },
      {
        text: 'Quick Start',
        collapsed: false,
        items: [
          { text: 'Get Started', link: '/quick-start/' },
          { text: 'How Can I Get DevNet ASI?', link: '/quick-start/get-asi/' },
          { text: 'Join as an Observer', link: '/quick-start/join-observer/' },
          { text: 'Join as a Validator', link: '/quick-start/join-validator/' },
          { text: 'Prepare and Enroll a Rust Validator', link: '/quick-start/validator-enrollment/' },
          { text: 'Troubleshooting', link: '/quick-start/troubleshooting/' },
        ]
      },
      {
        text: 'Shard & Nodes',
        collapsed: false,
        items: [
          { text: 'Shard and Node Roles', link: '/shard-nodes/devnet-structure/' },
          { text: 'Validator Node Image', link: '/shard-nodes/validator-image/' },
          { text: 'Set Up a Private Shard', link: '/shard-nodes/own-shard/' },
        ]
      },
      {
        text: 'Wallet',
        collapsed: false,
        items: [
          { text: 'ASI Wallet', link: '/wallet/usage/' },
          { text: 'Custom Network Connection', link: '/wallet/custom-network/' },
        ]
      },
      {
        text: 'Wallet SDK',
        collapsed: false,
        items: [
          { text: 'Wallet SDK', link: '/wallet-sdk/overview/' },
          { text: 'Wallet SDK API Reference', link: '/wallet-sdk/api-reference/',
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
        text: 'Wallet CLI',
        collapsed: false,
        items: [
          { text: 'Wallet CLI', link: '/cli/usage/' },
        ]
      },
      {
        text: 'Explorer',
        collapsed: false,
        items: [
          { text: 'ASI Block Explorer', link: '/explorer/usage/' },
        ]
      },
      {
        text: 'Faucet',
        collapsed: false,
        items: [
          { text: 'Faucet', link: '/faucet/usage/' },
        ]
      },
      {
        text: 'Architecture',
        collapsed: true,
        items: [
          { text: 'Technical Architecture', link: '/architecture/' },
          { text: 'Component Diagrams', link: '/architecture/component-diagrams/',
            items: [
              { text: 'Wallet Architecture', link: '/architecture/component-diagrams/wallet/' },
              { text: 'Explorer Components', link: '/architecture/component-diagrams/explorer/' },
              { text: 'Node Components', link: '/architecture/component-diagrams/node/' },
            ]
          },
          { text: 'Sequence Diagrams', link: '/architecture/sequence-diagrams/',
            items: [
              { text: 'Transaction Flow', link: '/architecture/sequence-diagrams/transaction/' },
              { text: 'Balance Query Flow', link: '/architecture/sequence-diagrams/balance/' },
            ]
          },
          { text: 'State Diagrams', link: '/architecture/state-diagrams/',
            items: [
              { text: 'Node Startup', link: '/architecture/state-diagrams/startup/' },
              { text: 'Running Node', link: '/architecture/state-diagrams/operations/' },
            ]
          },
          { text: 'Data Flow', link: '/architecture/data-flow/' },
          { text: 'Network Topology', link: '/architecture/network-topology/' },
        ]
      },
      {
        text: 'FAQ',
        collapsed: false,
        items: [
          { text: 'Frequently Asked Questions', link: '/faq/' },
        ]
      },
    ],

    footer: {
      message: 'ASI:Chain DevNet - Development Network',
      copyright: 'Test tokens have no real value. For testing purposes only.'
    },

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/asi-alliance/asi-chain-docs-portal/edit/dev/:path',
      text: 'Edit this page on GitHub'
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
    languages: CustomLanguages
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
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap', rel: 'stylesheet' }],
    ['meta', { name: 'theme-color', content: '#5f67ee' }],
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
}))
