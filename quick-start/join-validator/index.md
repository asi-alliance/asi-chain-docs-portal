# Join DevNet as Validator

This guide will help you join the ASI:Chain DevNet as a validator and participate in network consensus.

![ASI:Chain Workflows](/images/asi-chain-workflows.png)

## What is a Validator?

Validators are nodes that:
- Participate in consensus
- Validate and propose blocks
- Sign transactions
- Maintain network security

## Prerequisites

Before you begin, ensure you meet the system requirements and have necessary software installed.

### System Requirements

**Minimum Requirements:**
- **CPU**: 4 cores
- **RAM**: 16 GB
- **Storage**: 250+ GB free space
- **Network**: Stable internet connection, open ports

**Recommended Requirements:**
- **CPU**: 8 cores
- **RAM**: 32 GB
- **Storage**: 250+ GB free space
- **Network**: Stable internet connection, dedicated server

### Software Requirements

Verify you have the required software:

```bash
docker --version          # Need: 20.10+
docker compose version    # Need: 2.0+
java -version             # Need: OpenJDK 11 or 17
git --version             # Need: 2.0+
cargo --version           # Need: 1.70+
```

### Installation

**macOS:**
```bash
brew install openjdk@17 sbt rust
export JAVA_HOME="/opt/homebrew/opt/openjdk@17"
export PATH="$JAVA_HOME/bin:$PATH"
```

**Ubuntu:**
```bash
sudo apt update
sudo apt install -y openjdk-17-jdk sbt docker.io docker-compose
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

## Step 1: Create Your Wallet

First, you'll need a wallet with private and public keys.

### Using ASI Wallet (Recommended)

1. Visit [wallet.dev.asichain.io](https://wallet.dev.asichain.io)
2. Navigate to **Accounts** page
3. Click **Create Account**
4. Enter an account name
5. **Save your private key securely** - you'll need it for validator setup
6. Copy your public key as well

> [!CAUTION]
> **Keep your private key secure!** Never share it with anyone. There is no way to recover lost keys. Store it in a safe place, preferably offline.

### Generate Keys Page

You can also use the wallet's **Generate Keys** page:

1. Go to [wallet.dev.asichain.io/#/keys](https://wallet.dev.asichain.io/#/keys)
2. Click **Generate New Keypair**
3. Save all displayed credentials:
   - Private Key (64 hex characters)
   - Public Key (130+ hex characters with '04' prefix)
   - ASI Address (50-54 characters)

## Step 2: Get Test Tokens

Before running a validator, get test tokens from the faucet.

1. Visit [faucet.dev.asichain.io](https://faucet.dev.asichain.io)
2. Paste your ASI address
3. Click **FAUCET** button
4. Wait for tokens to arrive (check status on faucet page)

You can verify your balance in the wallet after receiving tokens.

## Step 3: Clone Repository

Clone the ASI:Chain repository:

```bash
git clone https://github.com/asi-alliance/asi-chain.git
cd asi-chain/chain
```

## Step 4: Configure Environment

Create your `.env` file:

```bash
cp .env.example .env
```

Edit the `.env` file with your credentials:

```env
VALIDATOR_PRIVATE_KEY=<YOUR-PRIVATE-KEY>
VALIDATOR_HOST=<YOUR-PUBLIC-IP-ADDRESS>
```

**Important:**
- Use your **private key** from Step 1
- Use your server's **public IP address** (not localhost)

To find your public IP:
```bash
curl ifconfig.me
```

## Step 5: Configure Validator YAML

Edit `validator.yml` to configure ports (or leave defaults):

```yaml
ports:
  - "40400:40400"  # Protocol server
  - "40401:40401"  # Public gRPC API
  - "40402:40402"  # Internal gRPC API
  - "40403:40403"  # HTTP API
  - "40404:40404"  # Kademlia discovery
  - "40405:40405"  # Admin HTTP API
```

**Note:** These ports must be open in your firewall for the validator to function properly.

## Step 6: Configure Validator Settings

Edit `conf/validator.conf` and update the `casper` section with your keys:

```hocon
casper {
  validator-public-key = <YOUR-PUBLIC-KEY>
  validator-private-key = <YOUR-PRIVATE-KEY>
}
```

Use the keys generated in Step 1.

## Step 7: Update Bootstrap Connection

Ensure your validator connects to the correct bootstrap node.

In `validator.yml`, verify the bootstrap connection:

```yaml
command:
  - "--bootstrap=rnode://e5e6faf012f36a30176d459ddc0db81435f6f1dc@54.152.57.201?protocol=40400&discovery=40404"
```

This should already be set correctly in the repository.

## Step 8: Launch Validator

Start your validator node:

```bash
sudo docker compose -f validator.yml up -d
```

The node will start and begin synchronizing with the network.

## Step 9: Monitor Synchronization

Check your validator logs:

```bash
sudo docker logs validator -f
```

### What to Look For

**Successful synchronization indicators:**

```
rnode.validator | Approved state for block Block #0 (b22fa19038...) with empty parents (supposedly genesis) is successfully restored.
rnode.validator | Received ForkChoiceTipRequest from rnode.bootstrap
rnode.validator | Sending tips [b22fa19038...] to rnode.bootstrap
rnode.validator | Responded to protocol handshake request from rnode://...
```

**Connection status:**
```
rnode.validator | Peers: 4
```

When you see these messages, your validator is synchronized and connected to the network.

## Step 10: Test Your Setup

### Install Rust CLI

First, install the Rust CLI client:

```bash
git clone https://github.com/singnet/rust-client.git
cd rust-client
cargo build --release
```

### Deploy a Test Contract

Navigate back to your validator directory and deploy a test contract:

```bash
cargo run -- deploy -f ./examples/stdout.rho --private-key "<YOUR-PRIVATE-KEY>" -H localhost -p 40402
```

**Expected response:**
```
Response: Success!
DeployId is: 304402206c435cee64d97d123f0c1b4552b3568698e64096a29fb50ec38f11a6c5f7758b022002e05322156bf5ed878ce20cef072cd8faf9e8bb15b58131f2fee06053b5d1c5
```

### Propose a Block

After deploying, propose a block:

```bash
cargo run -- propose --private-key "<YOUR-PRIVATE-KEY>" -H localhost -p 40402
```

**Expected response:**
```
Response: Success! Block 4dda69c62838e18abd3c131818e60110ac3caccc66ec05792cedb327a3bafff7 created and added.
```

## Verification

After completing these steps, verify your validator is working:

### 1. Check Block Explorer

Visit [explorer.dev.asichain.io](https://explorer.dev.asichain.io) and look for your validator's public key in the validators list.

### 2. Monitor Logs

Your validator should show ongoing activity:
```bash
sudo docker logs validator -f --tail 50
```

### 3. Check Peer Connections

Your validator should maintain connections with other network participants:
```
Peers: 4 or more
```

## Troubleshooting

### Node Won't Start

**Check Docker status:**
```bash
sudo docker ps -a
```

**View logs:**
```bash
sudo docker logs validator
```

### Synchronization Issues

**Reset and restart:**
```bash
sudo docker stop validator
sudo docker rm validator
rm -rf data/
sudo docker compose -f validator.yml up -d
```

### Connection Problems

**Verify ports are open:**
```bash
sudo ufw status
```

**Allow required ports:**
```bash
sudo ufw allow 40400:40405/tcp
```

### Common Errors

See [Troubleshooting Guide](/quick-start/troubleshooting/) for detailed solutions to common problems.

## Next Steps

Now that your validator is running:

1. **Monitor Performance** - Keep an eye on logs and resource usage
2. **Explore the Network** - Use the [Block Explorer](https://explorer.dev.asichain.io)
3. **Deploy Contracts** - Try deploying your own smart contracts
4. **Join the Community** - Connect with other validators and developers

## Maintenance

### Update Your Node

To update to the latest version:

```bash
cd asi-chain/chain
git pull origin main
sudo docker compose -f validator.yml down
sudo docker compose -f validator.yml pull
sudo docker compose -f validator.yml up -d
```

### Backup Your Keys

Regularly backup:
- `.env` file
- `conf/validator.conf`
- Your private keys (stored securely offline)

### Monitor Resources

Keep track of:
- Disk space usage
- Memory consumption
- Network bandwidth
- CPU load

## Security Best Practices

1. **Firewall Configuration** - Only open necessary ports
2. **Key Management** - Store private keys securely, never in plain text
3. **Regular Updates** - Keep your node software up to date
4. **Monitoring** - Set up alerts for node downtime
5. **Backups** - Regular backups of configuration and keys

## Support

If you need help:

- **Documentation**: Browse this site for detailed guides
- **GitHub Issues**: [asi-alliance/asi-chain](https://github.com/asi-alliance/asi-chain)
- **FAQ**: Check [FAQ section](/faq/) for common questions

---

You are now running a validator on ASI:Chain DevNet and helping secure the network.
