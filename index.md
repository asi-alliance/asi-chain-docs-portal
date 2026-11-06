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
<DocCard title="Use ASI:Chain" href="/use/" icon="wallet">Create an account, get test tokens and follow transfers in the explorer</DocCard>
<DocCard title="Run a Node" href="/nodes/" icon="node">Run a Rust validator or observer node from the published images</DocCard>
<DocCard title="Build on ASI:Chain" href="/build/" icon="sdk">Build wallets and integrations with the TypeScript SDK</DocCard>
</CardGrid>

## More

<CardGrid columns="2">
<DocCard title="What Is ASI:Chain" href="/overview/" icon="book">The node, the indexer and the applications, and how they fit together</DocCard>
<DocCard title="Technical Architecture" href="/architecture/" icon="architecture">Components, data flow and network topology</DocCard>
<DocCard title="Reference" href="/reference/" icon="links">Network endpoints, container images and useful links</DocCard>
<DocCard title="Help" href="/help/" icon="help">FAQ, troubleshooting and the documentation status</DocCard>
<DocCard title="DevNet Wallet" href="https://wallet.dev.asichain.io" icon="wallet">wallet.dev.asichain.io</DocCard>
<DocCard title="DevNet Explorer" href="https://explorer.dev.asichain.io" icon="explorer">explorer.dev.asichain.io</DocCard>
<DocCard title="DevNet Faucet" href="https://faucet.dev.asichain.io" icon="faucet">faucet.dev.asichain.io</DocCard>
<DocCard title="Rust Node on GitHub" href="https://github.com/asi-alliance/asi-chain-rust-node" icon="github">github.com/asi-alliance/asi-chain-rust-node</DocCard>
</CardGrid>

## Before You Start

DevNet tokens are for testing and have no real value. The [Get Started](/quick-start/) page sends you to the right guide for using the network, running a node or building on it.

Node setup uses the [published container images](/reference/container-images/) and their source revisions. Public DevNet services are listed on [Network Endpoints](/reference/endpoints/). Ask the network operator for the bootstrap identity of the network you join, because the published images do not say which deployment is live. The [documentation status](/help/documentation-status/) page lists which pages are verified and which still wait for review.
