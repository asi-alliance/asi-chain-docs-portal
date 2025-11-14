# Node Image Source

## Overview

ASI:Chain is powered by a flexible Docker-based infrastructure that supports multiple node roles within the network. Each participant in the network is represented by a **node**, which can be hosted either locally or remotely. Nodes can assume one of three roles depending on their purpose and configuration.

## Docker Image

All node types use the official ASI Chain Docker image:

```bash
public.ecr.aws/f6y9h6x4/asi-chain/node:latest
```

This image is referenced across all Docker Compose configurations, including:

- `validator.yml`
- `observer.yml` 
- `bootstrap.yml`
- `shard.yml`

## Node Types

### Bootstrap Node

Acts as the **initial entry point** to the network. It maintains a minimal peer list and shares it with newcomers.

- Does **not** participate in consensus or validate blocks
- Can be run as a standalone node or co-located with a validator
- Configured via the `--bootstrap` flag or by starting first in the network

**Note:** At least one bootstrap node is required for other nodes to join the network. The bootstrap node is not a validator.

### Validator Node

Responsible for **consensus participation**, **block validation**, and **finalization**.

- Connects to a bootstrap node during startup using the `--bootstrap` flag
- May also serve as a bootstrap node itself, if needed
- Must be registered in the network at genesis via its public key

### Observer Node

A **read-only** node used for monitoring and accessing blockchain data.

- Does not sign or propose blocks
- Useful for running explorers, APIs, or passive listeners
- Fully synchronizes the chain state from the network

## Minimum Network Requirements

To form a functional ASI:Chain network:

- At least **3 validator nodes** are required to maintain consensus
- One **bootstrap node** (which is not a validator)

## System Requirements

**Minimum Requirements:**
- **RAM**: 16GB
- **CPU**: 4 cores
- **Storage**: 250GB+ free space
- **Network**: Stable connection, no strict firewall

**Recommended Requirements:**
- **RAM**: 32GB
- **CPU**: 8 cores
- **Storage**: 250GB+ free space
- **Network**: Stable connection, no strict firewall

## Software Requirements

Check versions with these commands:

```bash
docker --version          # Need: 20.10+
docker compose version    # Need: 2.0+
java -version             # Need: OpenJDK 11 or 17
git --version             # Need: 2.0+
cargo --version           # Need: 1.70+
```

## Installation Guides

### macOS Setup
```bash
brew install openjdk@17 sbt rust
export JAVA_HOME="/opt/homebrew/opt/openjdk@17"
export PATH="$JAVA_HOME/bin:$PATH"
```

### Ubuntu Setup
```bash
sudo apt update
sudo apt install -y openjdk-17-jdk sbt docker.io docker-compose
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

## Related Setup Guides

- [Validator Node Setup](/legacy-docs/node-image/validator/)