import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import CustomLanguages from "../config/languages";
import { writeRedirectStubs } from "./redirect-stubs";
import { deepSpaceLight, deepSpaceDark } from "./theme/shiki";

const sidebarGetStarted = [
  {
    text: 'Get Started',
    items: [
      { text: 'Get Started', link: '/quick-start/' },
      { text: 'What Is ASI:Chain', link: '/overview/' },
      { text: 'Get DevNet ASI', link: '/quick-start/get-asi/' },
    ]
  },
]

const sidebarUse = [
  {
    text: 'Use',
    items: [
      { text: 'Use ASI:Chain', link: '/use/' },
      { text: 'Get DevNet ASI', link: '/quick-start/get-asi/' },
      { text: 'ASI Wallet', link: '/wallet/usage/' },
      { text: 'Custom Network Connection', link: '/wallet/custom-network/' },
      { text: 'Faucet', link: '/faucet/usage/' },
      { text: 'ASI Block Explorer', link: '/explorer/usage/' },
    ]
  },
]

const sidebarBuild = [
  {
    text: 'Build',
    items: [
      { text: 'Build on ASI:Chain', link: '/build/' },
      { text: 'Wallet CLI', link: '/cli/usage/' },
    ]
  },
]

export default withMermaid(defineConfig({
  title: "ASI:Chain Docs",
  description: "Use the wallet, get test tokens, run a node and build on ASI:Chain",
  css: ['custom.css'],
  srcExclude: ['README.md', 'LICENSE.md'],
  buildEnd: writeRedirectStubs,

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
      { text: 'Get Started', link: '/quick-start/', activeMatch: '^/(quick-start|overview)/' },
      { text: 'Use', link: '/use/', activeMatch: '^/(use|wallet|faucet|explorer)/' },
      { text: 'Run a Node', link: '/nodes/', activeMatch: '^/nodes/' },
      { text: 'Build', link: '/build/', activeMatch: '^/(build|cli|wallet-sdk|architecture)/' },
      { text: 'Reference', link: '/reference/', activeMatch: '^/reference/' },
      { text: 'Help', link: '/help/', activeMatch: '^/help/' },
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

    // One sidebar per section, so a page shows only the menu of its own section and
    // prev/next never jumps into another one. Groups that do not hold the current page are collapsed.
    sidebar: {
      '/quick-start/': sidebarGetStarted,
      '/overview/': sidebarGetStarted,
      '/use/': sidebarUse,
      '/wallet/': sidebarUse,
      '/faucet/': sidebarUse,
      '/explorer/': sidebarUse,
      '/nodes/': [
        {
          text: 'Run a Node',
          items: [
            { text: 'Run a Node', link: '/nodes/' },
            { text: 'Shard and Node Roles', link: '/nodes/roles/' },
            { text: 'Node Image', link: '/nodes/image/' },
            { text: 'Run an Observer', link: '/nodes/observer/' },
            { text: 'Run a Validator', link: '/nodes/validator/' },
            { text: 'Enroll a Validator', link: '/nodes/validator-enrollment/' },
            { text: 'Set Up a Private Shard', link: '/nodes/private-shard/' },
          ]
        },
      ],
      '/build/': sidebarBuild,
      '/cli/': sidebarBuild,
      '/wallet-sdk/': [
        {
          text: 'Wallet SDK',
          items: [
            { text: 'Wallet SDK', link: '/wallet-sdk/overview/' },
            { text: 'Wallet SDK API Reference', link: '/wallet-sdk/api-reference/',
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
      ],
      '/architecture/': [
        {
          text: 'Architecture',
          items: [
            { text: 'Technical Architecture', link: '/architecture/' },
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
      ],
      '/reference/': [
        {
          text: 'Reference',
          items: [
            { text: 'Reference', link: '/reference/' },
            { text: 'Network Endpoints', link: '/reference/endpoints/' },
            { text: 'Container Images', link: '/reference/container-images/' },
            { text: 'Useful Links', link: '/reference/links/' },
          ]
        },
      ],
      '/help/': [
        {
          text: 'Help',
          items: [
            { text: 'Help', link: '/help/' },
            { text: 'Frequently Asked Questions', link: '/help/faq/' },
            { text: 'Troubleshooting', link: '/help/troubleshooting/' },
            { text: 'Documentation Status', link: '/help/documentation-status/' },
          ]
        },
      ],
    },

    footer: {
      message: 'ASI:Chain DevNet - Development Network',
      copyright: 'Test tokens have no real value. For testing purposes only.'
    },

    outline: [2, 3],

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
    languages: CustomLanguages,
    theme: { light: deepSpaceLight, dark: deepSpaceDark },
    // Tables get a scroll wrapper, so a wide table scrolls in its own box and not the page.
    config(md) {
      const open = md.renderer.rules.table_open
      const close = md.renderer.rules.table_close
      // The region name lists the column headers, so a screen reader tells tables on one page apart.
      md.renderer.rules.table_open = (tokens, idx, options, env, self) => {
        const cols: string[] = []
        for (let i = idx + 1; i < tokens.length && tokens[i].type !== 'thead_close'; i++)
          if (tokens[i].type === 'inline') cols.push(tokens[i].content.replace(/[`*_]/g, ''))
        const label = md.utils.escapeHtml(cols.length ? 'Table: ' + cols.join(', ') : 'Table')
        return `<div class="table-wrap" role="region" aria-label="${label}" tabindex="0">` +
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
    // Roboto Mono for code and the logo text. Inter comes with VitePress.
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;700&display=swap', rel: 'stylesheet' }],
    ['meta', { name: 'theme-color', content: '#0D1012' }],
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
