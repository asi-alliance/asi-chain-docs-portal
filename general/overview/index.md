# General Overview

## What is ASI:Chain?

ASI:Chain is a blockchain network built for the ASI Alliance ecosystem, powered by F1R3FLY technology. It provides a decentralized platform for executing smart contracts written in Rholang and managing digital assets.

## Ecosystem Components

ASI:Chain DevNet consists of several interconnected components that work together to provide a complete blockchain experience:

![ASI:Chain Ecosystem Overview](/images/asi-chain-ecosystem-overview.png)

### 1. DevNet (Shard)

The **DevNet** is the current development network (shard) where all testing and development activities take place.

**Network Configuration:**
- **1 Bootstrap Node** - Entry point for network discovery
- **3 Validator Nodes** - Participate in consensus and validate transactions
- **1 Observer Node** - Provides read-only access for monitoring

**Key Characteristics:**
- Permissionless - External validators can join the network
- Test Environment - Uses test tokens with no real value
- Active Development - Regular updates and improvements

### 2. Wallet (Client Application)

The **ASI Wallet** is a browser-based application for managing your assets and interacting with the blockchain.

**Access:** [wallet.dev.asichain.io](https://wallet.dev.asichain.io)

**Features:**
- 100% client-side (no backend required)
- Multi-account support
- Integrated Rholang IDE for smart contract development
- Direct blockchain connection
- Transaction history and monitoring

### 3. Block Explorer

The **Block Explorer** provides real-time visibility into blockchain activity.

**Access:** [explorer.dev.asichain.io](https://explorer.dev.asichain.io)

**Features:**
- Real-time block monitoring
- Transaction history and search
- Validator information and statistics
- Network performance metrics
- WebSocket-based live updates

### 4. Indexer

The **Indexer** maintains synchronized blockchain data for fast querying and analysis.

**Access:** [indexer.dev.asichain.io](https://indexer.dev.asichain.io)

**Purpose:**
- Indexes blockchain data for quick retrieval
- Powers the Block Explorer
- Provides API endpoints for applications
- Maintains transaction history

### 5. Faucet

The **Faucet** distributes test ASI tokens for development and testing.

**Access:** [faucet.dev.asichain.io](https://faucet.dev.asichain.io)

**Purpose:**
- Provides test tokens for new users
- Enables testing without real value
- Simple request process
- No authentication required

## Network Architecture

The network architecture is detailed in the [DevNet Structure & Entities](/shard-nodes/devnet-structure/) guide.

## How External Validators Connect

External participants can join the DevNet as validators:

1. **Create Wallet** - Generate keys using the ASI Wallet
2. **Get Test Tokens** - Request tokens from the Faucet
3. **Setup Node** - Configure and run a validator node
4. **Connect to Network** - Use the bootstrap node to join
5. **Participate** - Start validating transactions and proposing blocks

## Use Cases

![ASI:Chain Workflows](/images/asi-chain-workflows.png)

### 1. Funds Transfers & Smart Contract Deployments

**Users and Developers** can interact with the DevNet through the Web Wallet:

**Transaction Flow:**
- User/Developer → Web Wallet → DevNet

**Capabilities:**
- Send ASI tokens between accounts
- Deploy smart contracts written in Rholang
- Execute contract functions
- Monitor transaction status

**Read Data:**
- Check account balances
- View transaction history through Block Explorer
- Explorer → DevNet (read-only access)

### 2. Running a DevNet Node

**Node Operators** can join the network by running their own validator or observer node:

**Setup Flow:**
- Node Operator → Configure Node → Bootstrap Node → DevNet Network

**Options:**
- **Validator Node:** Participate in consensus and block production
- **Observer Node:** Read-only access for monitoring and queries

**Process:**
1. Generate validator keys using the wallet
2. Configure node with proper settings
3. Connect to Bootstrap Node for network discovery
4. Sync with Validators and Observers in the network
5. Begin participating (validator) or observing (observer)

See [Join DevNet as Validator](/quick-start/join-validator/) or [Join DevNet as Observer](/quick-start/join-observer/) for detailed setup guides.

## Technology Stack

**Blockchain Core:** F1R3FLY-based RNode implementation
**Smart Contracts:** Rholang language
**Consensus:** CBC Casper
**Infrastructure:** Docker-based deployment
**Network:** Peer-to-peer communication

## Current Network Status

**Network:** DevNet (Development Network)
**Status:** Active
**Bootstrap Node:** `54.152.57.201`
**Total Validators:** 3 active validators
**Block Time:** ~20 seconds average
**Explorer:** [explorer.dev.asichain.io](https://explorer.dev.asichain.io)

## Getting Started

Ready to join the network? Choose your path:

- **Use the Network** → Start with the [Wallet](https://wallet.dev.asichain.io) and [Faucet](https://faucet.dev.asichain.io)
- **Become a Validator** → Follow the [Join DevNet as Validator](/quick-start/join-validator/) guide
- **Explore the Data** → Visit the [Block Explorer](https://explorer.dev.asichain.io)
- **Learn More** → Read the [DevNet Structure & Entities](/shard-nodes/devnet-structure/) documentation

## Support & Resources

- **Documentation:** You're reading it! Navigate using the sidebar
- **GitHub Repository:** [asi-alliance/asi-chain](https://github.com/asi-alliance/asi-chain)
- **Rust Client:** [singnet/rust-client](https://github.com/singnet/rust-client)

---

**Note:** DevNet uses test tokens with no real value. This is a development environment for testing and learning.
