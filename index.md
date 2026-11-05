---
layout: home
title: Home
description: Documentation for the ASI:Chain DevNet (wallet, explorer, faucet, node setup and developer tools)
hero:
  name: "ASI:Chain"
  text: "DevNet Documentation"
  tagline: "Use the wallet, get test tokens, run a node and build on ASI:Chain"
  image:
    alt: ASI:Chain
  actions:
    - theme: brand
      text: Get Started
      link: /quick-start/
    - theme: alt
      text: Container Images
      link: /general/container-images/
    - theme: alt
      text: View on GitHub
      link: https://github.com/asi-alliance/asi-chain-rust-node
features:
  - title: Wallet
    details: Create an account, send and receive ASI and deploy Rholang contracts
    link: /wallet/usage/
  - title: Explorer
    details: Browse blocks, transactions, validators and network statistics
    link: /explorer/usage/
  - title: Faucet
    details: Request DevNet ASI for testing
    link: /faucet/usage/
  - title: Wallet SDK
    details: Build wallets and integrations with the TypeScript SDK
    link: /wallet-sdk/overview/
  - title: Wallet CLI
    details: Create wallets, check balances and send tokens from a terminal
    link: /cli/usage/
  - title: Node Setup
    details: Run a Rust validator or observer node from the published images
    link: /quick-start/join-validator/
  - title: Architecture
    details: Components, data flow and network topology
    link: /architecture/
  - title: FAQ
    details: Answers to common questions about accounts, tokens and nodes
    link: /faq/
---

## Before you start

DevNet tokens are for testing and have no real value. The [Get Started](/quick-start/) page sends you to the right guide for using the network, running a node or building on it.

Node setup uses the [published container images](/general/container-images/) and their source revisions. Public DevNet services are listed on [Network Endpoints](/general/endpoints/). Ask the network operator for the bootstrap identity of the network you join, because published images do not identify the live deployment. The [documentation status](/general/documentation-status/) page lists which pages are verified and which still wait for review.
