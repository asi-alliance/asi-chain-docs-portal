import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'ASI:Chain',
  description: 'Complete guide for ASI:Chain blockchain network',
  
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap', rel: 'stylesheet' }]
  ],

  themeConfig: {
    logo: {
      light: '/logo-light.svg',
      dark: '/logo-dark.svg'
    },
    
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Quick Start', link: '/quick-start/join-validator/' },
      { text: 'Wallet', link: '/wallet/usage/' },
      { text: 'Explorer', link: '/explorer/usage/' },
      { text: 'Faucet', link: '/faucet/usage/' }
    ],

    sidebar: {
      '/quick-start/': [
        {
          text: 'Quick Start',
          items: [
            { text: 'Join as Validator', link: '/quick-start/join-validator/' },
            { text: 'Join as Observer', link: '/quick-start/join-observer/' },
            { text: 'Get DevNet Tokens', link: '/quick-start/get-asi/' },
            { text: 'Troubleshooting', link: '/quick-start/troubleshooting/' }
          ]
        }
      ],
      '/shard-nodes/': [
        {
          text: 'Shard & Nodes',
          items: [
            { text: 'DevNet Structure', link: '/shard-nodes/devnet-structure/' },
            { text: 'Validator Node Image', link: '/shard-nodes/validator-image/' },
            { text: 'Observer Node Image', link: '/shard-nodes/observer-image/' },
            { text: 'Own Shard Setup', link: '/shard-nodes/own-shard/' }
          ]
        }
      ],
      '/wallet/': [
        {
          text: 'Wallet',
          items: [
            { text: 'Usage Guide', link: '/wallet/usage/' },
            { text: 'Custom Network', link: '/wallet/custom-network/' }
          ]
        }
      ],
      '/explorer/': [
        {
          text: 'Block Explorer',
          items: [
            { text: 'Usage Guide', link: '/explorer/usage/' }
          ]
        }
      ],
      '/faucet/': [
        {
          text: 'Faucet',
          items: [
            { text: 'Usage Guide', link: '/faucet/usage/' }
          ]
        }
      ],
      '/general/': [
        {
          text: 'General',
          items: [
            { text: 'Overview', link: '/general/overview/' },
            { text: 'Useful Links', link: '/general/useful-links/' }
          ]
        }
      ],
      '/faq/': [
        {
          text: 'FAQ',
          items: [
            { text: 'Frequently Asked Questions', link: '/faq/' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/asi-alliance/asi-chain' }
    ],

    footer: {
      message: 'ASI:Chain DevNet Documentation',
      copyright: 'Copyright © 2024 ASI Alliance'
    }
  },

  css: ['custom.css']
})
