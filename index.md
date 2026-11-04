---
layout: home
title: Home
description: ASI Chain development documentation and published container images
hero:
  name: "ASI:Chain"
  text: "Development Documentation"
  tagline: "Check source revisions and container images before connecting to a network"
  image:
    alt: ASI:Chain
  actions:
    - theme: brand
      text: Container Images
      link: /general/container-images/
    - theme: alt
      text: Documentation Status
      link: /general/documentation-status/
    - theme: alt
      text: View on GitHub
      link: https://github.com/asi-alliance/asi-chain-docs-portal
features:
  - title: Node Preparation
    details: Select the Rust image, configuration and network inputs
    link: /quick-start/join-validator/
  - title: Wallet CLI
    details: Use pinned dependencies, explicit endpoints and exact amounts
    link: /cli/usage/
  - title: Architecture
    details: Understand the node, indexer, PostgreSQL, Hasura and applications
    link: /architecture/
  - title: Useful Links
    details: Find public component repositories and application links
    link: /general/useful-links/
  - title: Troubleshooting
    details: Inspect image identity, mappings, connectivity and readiness
    link: /quick-start/troubleshooting/
  - title: Review Status
    details: See verified pages and material awaiting source review
    link: /general/documentation-status/
---

## Before you start

Use the [published image catalog](/general/container-images/) and its public source revisions. Request current endpoints, bootstrap identity and accepted shard settings from the target network operator. Published images do not identify the live deployment or guarantee interoperability for every combination.

The portal is undergoing a source review. Read [documentation status](/general/documentation-status/) before relying on older UI walkthroughs, SDK examples or detailed diagrams. DevNet tokens are for testing and have no real value.
