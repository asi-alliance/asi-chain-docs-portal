# Validator Node Setup

This guide describes how you can connect to the ASI:Chain testnet and become a validator.

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

Verify you have the required software versions:

```bash
docker --version          # Need: 20.10+
docker compose version    # Need: 2.0+
java -version             # Need: OpenJDK 11 or 17
git --version             # Need: 2.0+
cargo --version           # Need: 1.70+
```

## Installation

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

## Setup

### Create Your Wallet

1. Navigate to [ASI Wallet](https://wallet.dev.asichain.io)
2. Create a new account or import an existing private key
3. Save your private key and public key securely
4. Request test tokens from the [Faucet](https://faucet.dev.asichain.io/)

> [!CAUTION]
> Keep your private key secure and never share it with anyone. There is no way to recover lost keys.

## Setup Process

### Step 1: Clone Repository

```bash
git clone https://github.com/asi-alliance/asi-chain.git
cd asi-chain/chain
```

### Step 2: Configure Environment

Create your `.env` file using `.env.example` as a template:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
VALIDATOR_PRIVATE_KEY=<YOUR-PRIVATE-KEY>
VALIDATOR_HOST=<YOUR-PUBLIC-IP-ADDRESS>
```

### Step 3: Configure Validator YAML

Edit `validator.yml` to set up ports (or leave defaults):

```yaml
ports:
  - "40400:40400"
  - "40401:40401"
  - "40402:40402"
  - "40403:40403"
  - "40404:40404"
  - "40405:40405"
```

### Step 4: Configure Validator Settings

Edit `conf/validator.conf` and replace the validator keys in the `casper` section:

```hocon
casper {
  validator-public-key = <YOUR-PUBLIC-KEY>
  validator-private-key = <YOUR-PRIVATE-KEY>
}
```

### Step 5: Launch Validator Node

Start your validator:

```bash
sudo docker compose -f validator.yml up -d
```

### Step 6: Monitor Synchronization

Check logs and wait for full sync:

```bash
sudo docker logs validator -f
```

Wait for logs indicating successful synchronization:

```
rnode.readonly  | Approved state for block Block #0 (b22fa19038...) with empty parents (supposedly genesis) is successfully restored.
rnode.readonly  | Received ForkChoiceTipRequest from rnode.validator2
rnode.readonly  | Sending tips [b22fa19038...] to rnode.validator2
rnode.readonly  | Received ForkChoiceTipRequest from rnode.bootstrap
rnode.readonly  | Sending tips [b22fa19038...] to rnode.bootstrap
```

This indicates your node has finished synchronization with the network.

## Testing Your Setup

### Install CLI

First, install the Rust CLI from the repository:

```bash
git clone https://github.com/singnet/rust-client.git
cd rust-client
cargo build --release
```

### Deploy a Smart Contract

```bash
cargo run -- deploy -f ./<path to contract>/smartcontractname.rho --private-key <private key> -H <host> -p <port>
```

Example:
```bash
cargo run -- deploy -f ./examples/stdout.rho --private-key "<YOUR-PRIVATE-KEY>" -H localhost -p 40402
```

Expected response:
```
Response: Success!
DeployId is: 304402206c435cee64d97d123f0c1b4552b3568698e64096a29fb50ec38f11a6c5f7758b022002e05322156bf5ed878ce20cef072cd8faf9e8bb15b58131f2fee06053b5d1c5
```

### Propose a Block

```bash
cargo run -- propose --private-key <private key> -H <host> -p <port>
```

Example:
```bash
cargo run -- propose --private-key "<YOUR-PRIVATE-KEY>" -H localhost -p 40402
```

Expected response:
```
Response: Success! Block 4dda69c62838e18abd3c131818e60110ac3caccc66ec05792cedb327a3bafff7 created and added.
```

## Next Steps

- [Troubleshoot common issues](/quick-start/troubleshooting/)
- [Explore interaction examples](/interaction-examples/)
- [Check network configuration](/network-configuration/)

## Getting Help

If you encounter issues:
1. Check [common errors and solutions](/quick-start/troubleshooting/)
2. Visit the [GitHub repository](https://github.com/asi-alliance/asi-chain) for support