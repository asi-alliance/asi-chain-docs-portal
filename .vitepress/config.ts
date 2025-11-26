import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import CustomLanguages from "../config/languages";

export default withMermaid(defineConfig({
  title: "ASI:Chain Docs",
  description: "Complete guide for ASI:Chain blockchain network",
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
      { text: 'Home', link: '/' },
      { text: 'Quick Start', link: '/quick-start/join-validator/' },
      { text: 'Wallet', link: 'https://wallet.dev.asichain.io' },
      { text: 'Explorer', link: 'https://explorer.dev.asichain.io' },
      { text: 'Faucet', link: 'https://faucet.dev.asichain.io' },
      { text: 'Github', items: [
        {
          text: 'Explorer repository', link: "https://github.com/asi-alliance/asi-chain-explorer",
        },
        {
          text: 'Wallet repository', link: "https://github.com/asi-alliance/asi-chain-wallet",
        },
        {
          text: 'Faucet repository', link: "https://github.com/asi-alliance/asi-chain-faucet",
        }
      ]}
    ],

    sidebar: [
      {
        text: 'General',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/general/overview/' },
          { text: 'Useful Links', link: '/general/useful-links/' },
        ]
      },
      {
        text: 'Quick Start',
        collapsed: false,
        items: [
          { text: 'Join DevNet as Validator', link: '/quick-start/join-validator/' },
          { text: 'Join DevNet as Observer', link: '/quick-start/join-observer/' },
          { text: 'How to Get DevNet ASI', link: '/quick-start/get-asi/' },
          { text: 'Troubleshooting', link: '/quick-start/troubleshooting/' },
        ]
      },
      {
        text: 'Shard & Nodes',
        collapsed: false,
        items: [
          { text: 'DevNet Structure & Entities', link: '/shard-nodes/devnet-structure/' },
          { text: 'Validator Node Image', link: '/shard-nodes/validator-image/' },
          { text: 'Observer Node Image', link: '/shard-nodes/observer-image/' },
          { text: 'Own Shard Setting Up', link: '/shard-nodes/own-shard/' },
        ]
      },
      {
        text: 'Wallet',
        collapsed: false,
        items: [
          { text: 'Usage Guide', link: '/wallet/usage/' },
          { text: 'Custom Network Connection', link: '/wallet/custom-network/' },
        ]
      },
      {
        text: 'Explorer',
        collapsed: false,
        items: [
          { text: 'Usage Guide', link: '/explorer/usage/' },
        ]
      },
      {
        text: 'Faucet',
        collapsed: false,
        items: [
          { text: 'Usage Guide', link: '/faucet/usage/' },
        ]
      },
      {
        text: 'Architecture',
        collapsed: true,
        items: [
          { text: 'Overview', link: '/architecture/' },
          { text: 'Component Diagrams', link: '/architecture/component-diagrams/',
            items: [
              { text: 'Wallet', link: '/architecture/component-diagrams/wallet/' },
              { text: 'Explorer', link: '/architecture/component-diagrams/explorer/' },
              { text: 'Node', link: '/architecture/component-diagrams/node/' },
            ]
          },
          { text: 'Sequence Diagrams', link: '/architecture/sequence-diagrams/',
            items: [
              { text: 'Transaction Flow', link: '/architecture/sequence-diagrams/transaction/' },
              { text: 'Balance Query', link: '/architecture/sequence-diagrams/balance/' },
            ]
          },
          { text: 'State Diagrams', link: '/architecture/state-diagrams/',
            items: [
              { text: 'Startup States', link: '/architecture/state-diagrams/startup/' },
              { text: 'Operational States', link: '/architecture/state-diagrams/operations/' },
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
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap', rel: 'stylesheet' }],
    ['meta', { name: 'theme-color', content: '#5f67ee' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en' }],
    ['meta', { property: 'og:title', content: 'ASI:Chain Docs' }],
    ['meta', { property: 'og:site_name', content: 'ASI:Chain Docs' }],
    ['meta', { property: 'og:url', content: 'https://docs.asi-chain.singularitynet.dev/' }],
  ]
}))