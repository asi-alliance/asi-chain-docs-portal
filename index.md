---
layout: home
title: Home
description: Documentation for the ASI:Chain DevNet (wallet, explorer, faucet, node setup and developer tools)
hero:
  name: "ASI:Chain"
  text: "DevNet Documentation"
  tagline: "Use the wallet, get test tokens, run a node and build on ASI:Chain"
  actions:
    - theme: brand
      text: Get Started
      link: /quick-start/
    - theme: alt
      text: Container Images
      link: /reference/container-images/
    - theme: alt
      text: View on GitHub
      link: https://github.com/asi-alliance/asi-chain-rust-node
---

## Start Here

<CardGrid columns="3">
<DocCard title="Use the Wallet" href="/wallet/usage/" icon="wallet">Create an account, send and receive ASI and deploy Rholang contracts</DocCard>
<DocCard title="Run a Node" href="/quick-start/" icon="node">Run a Rust validator or observer node from the published images</DocCard>
<DocCard title="Build" href="/wallet-sdk/overview/" icon="sdk">Build wallets and integrations with the TypeScript SDK</DocCard>
</CardGrid>

## Products

<CardGrid columns="2">
<DocCard title="Wallet" href="/wallet/usage/" icon="wallet">Create an account, send and receive ASI and deploy Rholang contracts</DocCard>
<DocCard title="Explorer" href="/explorer/usage/" icon="explorer">Browse blocks, transactions, validators and network statistics</DocCard>
<DocCard title="Faucet" href="/faucet/usage/" icon="faucet">Request DevNet ASI for testing</DocCard>
<DocCard title="Wallet SDK" href="/wallet-sdk/overview/" icon="sdk">Build wallets and integrations with the TypeScript SDK</DocCard>
<DocCard title="Wallet CLI" href="/cli/usage/" icon="cli">Create wallets, check balances and send tokens from a terminal</DocCard>
<DocCard title="Node Setup" href="/nodes/validator/" icon="node">Run a Rust validator or observer node from the published images</DocCard>
<DocCard title="Architecture" href="/architecture/" icon="architecture">Components, data flow and network topology</DocCard>
<DocCard title="FAQ" href="/faq/" icon="faq">Answers to common questions about accounts, tokens and nodes</DocCard>
</CardGrid>


## Before You Start

DevNet tokens are for testing and have no real value. The [Get Started](/quick-start/) page sends you to the right guide for using the network, running a node or building on it.

Node setup uses the [published container images](/reference/container-images/) and their source revisions. Public DevNet services are listed on [Network Endpoints](/reference/endpoints/). Ask the network operator for the bootstrap identity of the network you join, because published images do not identify the live deployment. The [documentation status](/help/documentation-status/) page lists which pages are verified and which still wait for review.
