<div align="center">

# ASI:Chain Documentation Portal

[![Status](https://img.shields.io/badge/Status-BETA-FFA500?style=for-the-badge)](https://github.com/asi-alliance/asi-chain-docs-portal)
[![License](https://img.shields.io/badge/License-Apache%202.0-1A1A1A?style=for-the-badge)](LICENSE.md)
[![Docs](https://img.shields.io/badge/Docs-Available-C4F0C1?style=for-the-badge)](https://docs.asichain.io)

<h3>Official documentation portal for ASI:Chain blockchain network</h3>

Part of the [Artificial Superintelligence Alliance](https://superintelligence.io) ecosystem

*Uniting Fetch.ai, SingularityNET, and CUDOS*

</div>

---

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Project Structure](#project-structure)
4. [Feedback Form](#feedback-form)
5. [Contributing](#contributing)
6. [License](#license)

---

## Overview

This repository contains the source code for the ASI:Chain documentation portal, built with VitePress. The documentation covers the wallet, Wallet SDK and Wallet CLI, block explorer, faucet, node setup and architecture.

Live documentation: [docs.asichain.io](https://docs.asichain.io)

---

## Quick Start

### Prerequisites

- Node.js 20 or later
- npm

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run docs:dev

# Build for production
npm run docs:build

# Preview production build
npm run docs:preview
```

---

## Project Structure

```
asi-chain-docs-portal/
├── .github/              # CI workflows
├── .vitepress/           # VitePress configuration and theme
├── architecture/         # Architecture diagrams
├── assets/               # Syntax highlighting grammars
├── cli/                  # Wallet CLI guide
├── components/           # Vue components of the theme
├── config/               # Language registration for code blocks
├── build/                # Landing for developers
├── explorer/             # Block explorer guide
├── faucet/               # Faucet guide
├── help/                 # FAQ, troubleshooting, documentation status
├── nodes/                # Node roles, images and setup guides
├── overview/             # What is ASI:Chain
├── reference/            # Endpoints, container images, links
├── public/               # Static assets
├── quick-start/          # Getting started guides
├── utils/                # Constants of the feedback form
├── use/                  # Landing for users
├── wallet/               # Wallet guide
├── wallet-sdk/           # Wallet SDK reference
├── .gitignore
├── index.md              # Homepage
├── LICENSE.md
├── package.json
├── README.md
└── sonar-project.properties
```

Every directory with an `index.md` is a page, and its address is the directory path with a trailing slash. The sidebar and the top menu are written by hand in `.vitepress/config.ts`, so a new page appears in the menu only after it is added there.

---

## Feedback Form

The feedback form at the top of each page needs a `.env` file in the repository root with three variables.

```env
VITE_FEEDBACK_FORM_URL=
VITE_JSAPI_URL=
VITE_CAPTCHA_TOKEN=
```

The values are not stored in the repository, so ask the maintainers for them. Without them the console shows `Captcha configuration missing` and the form does not send anything. The rest of the site works, so you do not need the file to edit text. `.env` is listed in `.gitignore`.

---

## Contributing

Known issues and bugs are tracked in the [Issues](https://github.com/asi-alliance/asi-chain-docs-portal/issues) section.
If you encounter a problem that is not listed, open a new issue with as much detail as possible.

---

## License

Copyright 2025 Artificial Superintelligence Alliance

Licensed under the Apache License, Version 2.0. See the [LICENSE](LICENSE.md) file for details.

---

ASI Alliance founding members: Fetch.ai, SingularityNET, and CUDOS
