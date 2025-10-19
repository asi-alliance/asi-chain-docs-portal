# Frequently Asked Questions (FAQ)

Common questions and answers about ASI:Chain DevNet.

## General Questions

### What is ASI:Chain?

ASI:Chain is a blockchain network built for the ASI Alliance ecosystem, powered by F1R3FLY technology. It provides a decentralized platform for executing smart contracts written in Rholang.

### What is DevNet?

DevNet is the development network (test network) where you can experiment with the blockchain without using real value tokens. It's designed for testing, learning, and development.

### Are DevNet tokens valuable?

**No.** DevNet ASI tokens have **zero real value**. They are exclusively for testing purposes and cannot be exchanged for real currency or assets.

### Can I lose money on DevNet?

No, because DevNet tokens have no real value. Feel free to experiment without financial risk.

## Getting Started

### How do I get DevNet tokens?

Visit the [Faucet](https://faucet.dev.asichain.io), enter your ASI address, and request tokens. See [How to Get DevNet ASI](/quick-start/get-asi/) for details.

### Do I need to create an account?

Yes, you'll need to create an account in the [ASI Wallet](https://wallet.dev.asichain.io) to receive tokens and interact with the network.

### Is there a limit on faucet requests?

Yes, there's a cooldown period between requests to prevent abuse. If you see "Address is not eligible," wait before requesting again.

### Can I run a validator?

Yes! Anyone can run a validator on DevNet. Follow the [Join DevNet as Validator](/quick-start/join-validator/) guide to get started.

## Wallet Questions

### Where are my private keys stored?

Your private keys are stored **locally in your browser** using AES-256-GCM encryption. They never leave your device and are never sent to any server.

### What if I forget my password?

Unfortunately, there is **no way to recover** a lost password or private keys. Always keep secure backups of your keys.

### Can I use the same wallet on different devices?

Your wallet data is stored locally per browser. To use the same account on multiple devices:
1. Export your private key from one device
2. Import it on another device
3. Or use the backup/restore feature

### Why do I need an Ethereum address?

The ASI address is derived from an Ethereum-compatible key pair for broader compatibility. However, you primarily use the ASI address (starting with "1111") on ASI:Chain.

### Can I connect the wallet to my own node?

Yes! Go to Settings and configure a custom network pointing to your local or private node. See [Custom Network Connection](/wallet/custom-network/).

## Transaction Questions

### Why did my transaction fail?

Common reasons:
- Insufficient balance for transaction + fees
- Invalid recipient address format
- Network congestion
- Node synchronization issues

### How long do transactions take?

Average block time is ~20 seconds. Your transaction should be confirmed within 1-3 blocks (20-60 seconds) under normal conditions.

### Can I cancel a transaction?

Once a transaction is broadcast to the network, it cannot be cancelled. Double-check all details before confirming.

### What are phlo limit and phlo price?

- **Phlo Limit**: Maximum computational resources your transaction can use (similar to gas limit)
- **Phlo Price**: Price per unit of computation (similar to gas price)

For DevNet, standard values are:
- Phlo Limit: 10000000
- Phlo Price: 1

## Smart Contract Questions

### What language do I use for smart contracts?

Smart contracts on ASI:Chain are written in **Rholang**, a concurrent, functional programming language designed for blockchain.

### Where can I learn Rholang?

Resources:
- Built-in IDE in [ASI Wallet](https://wallet.dev.asichain.io/#/ide) with examples
- [GitHub repository](https://github.com/asi-alliance/asi-chain) with example contracts
- RChain documentation (ASI:Chain is based on RChain technology)

### Can I deploy any contract to DevNet?

Yes, you can deploy any valid Rholang contract to DevNet. Experiment freely - it's a test environment!

### How much do deployments cost?

On DevNet, deployments use test tokens. There's a computational cost (phlo), but since tokens have no value, it's essentially free for testing.

## Validator Questions

### What are the system requirements?

**Minimum:**
- CPU: 4 cores
- RAM: 16 GB
- Storage: 250+ GB
- Network: Stable connection

**Recommended:**
- CPU: 8 cores
- RAM: 32 GB
- Storage: 250+ GB
- Network: Dedicated server

### Do I need to stake tokens?

On DevNet, staking is not required. You just need to configure your validator with valid keys.

### How do I know if my validator is working?

Check:
- Docker logs: `docker logs validator -f`
- Peer connections (should show 4+)
- [Block Explorer](https://explorer.dev.asichain.io) for your validator
- Successful block proposals

### Can I stop my validator?

Yes, you can stop your validator anytime:
```bash
docker compose -f validator.yml down
```

There's no penalty for downtime on DevNet.

### My validator isn't proposing blocks, why?

Possible reasons:
- Not fully synchronized yet
- Network connectivity issues
- Insufficient peer connections
- Configuration problems

Check logs and see [Troubleshooting Guide](/quick-start/troubleshooting/).

## Network Questions

### How many validators are there?

Currently there are **3 active validators** plus the network accepts external validators joining.

### What's the current network status?

Check:
- [Block Explorer](https://explorer.dev.asichain.io) - Real-time network stats
- Network status indicator in wallet
- Bootstrap node connectivity

### Can the network go down?

Like any system, brief outages are possible. DevNet status:
- Check [Explorer](https://explorer.dev.asichain.io)
- Review [GitHub](https://github.com/asi-alliance/asi-chain) for announcements

### Where is the network hosted?

Bootstrap and observer nodes are hosted at IP: `54.152.57.201`

## Technical Questions

### What consensus algorithm is used?

ASI:Chain uses **CBC Casper** consensus, a proof-of-stake variant designed for safety and liveness.

### What's the block time?

Average block time is approximately **20 seconds**.

### Is there a maximum supply?

On DevNet, token supply is unlimited via the faucet since tokens have no value. Mainnet economics (when launched) will be different.

### Can I query the blockchain directly?

Yes! Use the observer node at `http://54.152.57.201:40453` for direct API access.

### What ports need to be open?

For validators:
- 40400-40405 (protocol, APIs, discovery)

For observers:
- 40450-40455

## Troubleshooting

### Wallet won't load

Try:
1. Clear browser cache
2. Disable browser extensions
3. Try incognito/private mode
4. Use a different browser
5. Check JavaScript is enabled

### Can't connect to network

Solutions:
1. Check internet connection
2. Verify firewall isn't blocking requests
3. Try different network (DevNet/Local)
4. Check if node is running (for local)

### Balance shows zero after getting tokens

Wait a few moments and:
1. Click "Refresh Balance" in wallet
2. Check transaction status on faucet page
3. Verify on [Block Explorer](https://explorer.dev.asichain.io)
4. Clear cache and reload

### Node won't synchronize

Try:
1. Check logs: `docker logs validator -f`
2. Verify bootstrap connectivity
3. Reset and resync:
   ```bash
   docker compose down
   rm -rf data/
   docker compose up -d
   ```

## Development Questions

### Can I build applications on DevNet?

Yes! DevNet is specifically for development and testing. Build and test freely.

### Are there API endpoints?

Yes:
- **Validator:** `http://54.152.57.201:40413`
- **Observer:** `http://54.152.57.201:40453`
- **gRPC:** ports 40401 (validator), 40451 (observer)

### Is there an SDK?

Use the [Rust Client](https://github.com/singnet/rust-client) for command-line interaction. For web apps, use HTTP/gRPC APIs directly.

### Can I run my own explorer?

Yes, you can deploy your own explorer instance connected to your observer node. Source code will be available in the repository.

## Security Questions

### Is my data safe?

Your **private keys** are encrypted and stored locally. Your **transaction data** is public on the blockchain (as with all blockchains).

### Should I use DevNet keys on mainnet?

**No!** Always generate new keys for mainnet. DevNet keys may be compromised since they're used in testing.

### What if someone gets my private key?

They have full access to your account. Always:
- Keep keys secure
- Never share them
- Use strong passwords
- Backup securely offline

### Is HTTPS required?

For production and mainnet: **Yes, absolutely.**
For local development on DevNet: HTTP is acceptable.

## Future Plans

### When is mainnet launching?

Mainnet launch date will be announced. Subscribe to official channels for updates.

### Will DevNet always be available?

DevNet is intended as a permanent test network for development and experimentation.

### Can I propose new features?

Yes! Visit the [GitHub repository](https://github.com/asi-alliance/asi-chain) to:
- Open issues
- Propose features
- Submit pull requests
- Join discussions

## Still Have Questions?

If your question isn't answered here:

1. **Check Documentation:** Browse other sections in this site
2. **GitHub Issues:** Search or ask on [GitHub](https://github.com/asi-alliance/asi-chain)
3. **Useful Links:** See [Useful Links](/general/useful-links/) for resources
4. **Community:** Connect with other developers

---

This FAQ is regularly updated. Bookmark this page for future reference.
