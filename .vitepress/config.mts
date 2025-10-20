import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "ASI:Chain Documentation",
  description: "Complete guide for ASI:Chain blockchain network",
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Quick Start', link: '/quick-start/join-validator/' },
      { text: 'Wallet', link: 'https://wallet.dev.asichain.io' },
      { text: 'Explorer', link: 'https://explorer.dev.asichain.io' },
      { text: 'Faucet', link: 'https://faucet.dev.asichain.io' },
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
        text: 'FAQ',
        collapsed: false,
        items: [
          { text: 'Frequently Asked Questions', link: '/faq/' },
        ]
      },
      {
        text: '──────────',
        items: []
      },
      {
        text: 'Legacy Docs (Old Structure)',
        collapsed: true,
        items: [
          {
            text: 'Quick Start (Old)',
            collapsed: true,
            items: [
              { text: 'Quick Start Guide', link: '/legacy-docs/quick-start/' },
              { text: 'Message Exchange', link: '/legacy-docs/quick-start/messages/' },
              { text: 'Configuration', link: '/legacy-docs/quick-start/configuration/' },
            ]
          },
          {
            text: 'Node Image (Old)',
            collapsed: true,
            items: [
              { text: 'Node Image Source', link: '/legacy-docs/node-image/' },
              { text: 'Validator Setup', link: '/legacy-docs/node-image/validator/' },
              { text: 'Observer Setup', link: '/legacy-docs/node-image/observer/' },
            ]
          },
          {
            text: 'Network Configuration (Old)',
            collapsed: true,
            items: [
              { text: 'Overview', link: '/legacy-docs/network-configuration/' },
              { text: 'Network Nodes', link: '/legacy-docs/network-configuration/network-nodes/' },
              { text: 'Parameters', link: '/legacy-docs/network-configuration/parameters/' },
              { text: 'Topology', link: '/legacy-docs/network-configuration/topology/' },
            ]
          },
          {
            text: 'Network Access (Old)',
            collapsed: true,
            items: [
              { text: 'Endpoints', link: '/legacy-docs/network-access/' },
              { text: 'Address Generation', link: '/legacy-docs/network-access/address-generation/' },
            ]
          },
          {
            text: 'Interaction Examples (Old)',
            collapsed: true,
            items: [
              { text: 'Overview', link: '/legacy-docs/interaction-examples/' },
              { text: 'Smart Contracts', link: '/legacy-docs/interaction-examples/smart-contracts/' },
              { text: 'Block History', link: '/legacy-docs/interaction-examples/block-history/' },
              { text: 'Balance Check', link: '/legacy-docs/interaction-examples/balance-check/' },
            ]
          },
          {
            text: 'YAML Configuration (Old)',
            collapsed: true,
            items: [
              { text: 'YAML File Source', link: '/legacy-docs/yaml-configuration/' },
              { text: 'Parameters', link: '/legacy-docs/yaml-configuration/parameters/' },
            ]
          },
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/asi-alliance/asi-chain/' }
    ],

    footer: {
      message: 'ASI:Chain DevNet - Development Network',
      copyright: 'Test tokens have no real value. For testing purposes only.'
    },

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/asi-alliance/asi-chain/edit/main/docs/:path',
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

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#5f67ee' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en' }],
    ['meta', { property: 'og:title', content: 'ASI:Chain Documentation' }],
    ['meta', { property: 'og:site_name', content: 'ASI:Chain Docs' }],
    ['meta', { property: 'og:url', content: 'https://docs.asi-chain.singularitynet.dev/' }],
  ]
})
