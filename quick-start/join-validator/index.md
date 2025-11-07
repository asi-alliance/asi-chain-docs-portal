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
git --version             # Need: 2.0+
cargo --version           # Need: 1.70+ (for transaction testing)
```

### Installation

**macOS:**
```bash
brew install docker docker-compose rust
```

**Ubuntu:**
```bash
sudo apt update
sudo apt install -y docker.io docker-compose
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

---

# Validator Setup Flow

This section describes the standard process for deploying your validator on ASI:Chain DevNet.  
You can either generate credentials automatically or use existing wallet credentials.

## Step 1: Clone Repository

Clone the complete ASI:Chain repository with all submodules:

```bash
git clone https://github.com/asi-alliance/asi-chain.git
cd asi-chain/chain/validator
```

::: warning Important
Work from the `chain/validator/` directory for all validator operations.
:::

## Step 2: Prepare Configuration

Copy the template configuration:

```bash
cp conf/validator.env .env
```

The template contains two sections:
* **Chain config** — Network parameters (pre-filled, don't change unless connecting to different shard)
* **Validator config** — Automatically configured by the configurator in the next step

### Understanding the Stake Parameter

The `STAKE` parameter in `.env` determines the bonding amount (default: `100000000`).

The connector utility handles funding automatically:
- If wallet balance is sufficient for the stake amount, bonding proceeds
- If balance is insufficient, connector requests funds from the faucet
- If faucet limits are exceeded and balance remains insufficient, connector exits with error

## Step 3: Run Configurator

The configurator automatically sets up your validator environment. Choose **one** option:

### Option A — **Auto-generate everything** (recommended for testing)

Leave all validator parameters empty in `.env` and run:

```bash
docker compose -f ./configurator.yml up
```

The configurator will automatically:
1. Detect your server's public IP and set `VALIDATOR_HOST`
2. Generate new credentials (`VALIDATOR_PRIVATE_KEY`, `VALIDATOR_PUBLIC_KEY`, `VALIDATOR_ADDRESS`)
3. Write all parameters to `.env`
4. Display the generated values in container logs

::: warning Save Your Credentials
Once generated, **save your credentials securely**. You'll need them to restart your validator.
:::

::: tip How It Works
The configurator uses `curl ifconfig.me` to detect your public IP automatically. If you need to use a different IP address, you can set `VALIDATOR_HOST` manually in `.env` before running the configurator.
:::

### Option B — **Use existing wallet credentials**

If you want to use existing credentials from the Wallet:

1. **Get credentials from Wallet:**
   - Visit [wallet.dev.asichain.io](https://wallet.dev.asichain.io)
   - Create or access your account (see [Wallet docs](/wallet/usage/) for details)
   - Export your credentials (private key, public key, and address)

2. **Fill `.env` with your credentials:**
   ```env
   VALIDATOR_ADDRESS=<your-address>
   VALIDATOR_PUBLIC_KEY=<your-public-key>
   VALIDATOR_PRIVATE_KEY=<your-private-key>
   ```

3. **Run the configurator:**
   ```bash
   docker compose -f ./configurator.yml up
   ```

The configurator will:
- Detect and set your `VALIDATOR_HOST` (or use the one you specified)
- Write `VALIDATOR_HOST` to `.env`

## Step 4: Verify Configuration

After running the configurator, check your `.env` file:

```bash
cat .env
```

You should see all validator parameters filled:
```env
VALIDATOR_HOST=<your-ip>
VALIDATOR_PRIVATE_KEY=<generated-or-provided>
VALIDATOR_PUBLIC_KEY=<generated-or-provided>
VALIDATOR_ADDRESS=<generated-or-provided>
```

## Step 5: Start Validator

Run both bonding and validation with a single command:

```bash
docker compose -f ./validator.yml up -d
```

This starts two services:
1. **connector** — Utility container that sends the bonding transaction (runs once and exits)
2. **validator** — Your validator node (runs continuously)

The `-d` flag runs services in detached mode.

::: info Images & Bonding
Compose files reference **public images** by default:

* Configurator: `public.ecr.aws/f6y9h6x4/asi-chain/validator-configurator:latest`
* Connector: `public.ecr.aws/f6y9h6x4/asi-chain/validator-connector:latest`
* Node: `public.ecr.aws/f6y9h6x4/asi-chain/node:latest`

The connector will:
- Check your wallet balance
- Request funds from faucet if needed
- Send bonding transaction
- Exit after successful bonding
:::

### Alternative: Manual Bonding

If you prefer to bond separately before starting the validator:

**Step 1: Run bonding utility**

```bash
docker compose -f ./connector.yml up
```

Wait for confirmation: `Validator bonded successfully`

The container will exit automatically after successful bonding.

**Step 2: Start validator**

```bash
docker compose -f ./validator.yml up -d
```

## Step 6: Verify Synchronization

### 6.1 Check Validator Logs

Monitor your validator's synchronization progress:

```bash
docker logs validator -f
```

### 6.2 Check Network Status

**Check the observer's latest finalized block:**
```
http://54.235.138.68:40403/api/last-finalized-block
```

If the response contains at least one block, the network is operational.

**Check your validator's latest finalized block:**

Replace with your validator's host and HTTP API port (40443):
```
http://<YOUR_VALIDATOR_HOST>:40443/api/last-finalized-block
```

### 6.3 Evaluate Synchronization

- If your validator shows at least one block, synchronization has started
- When your validator's last block approximately matches the observer's (within ~50 blocks), synchronization is successful
- If the validator is behind, allow time for it to catch up

::: tip Synchronization Time
Initial synchronization may take several minutes to hours depending on blockchain size and network speed.
:::

## Step 7: Transaction Deployment Test

Verify your validator can submit transactions to the network.

### 7.1 Install Rust CLI Client

Clone and build the Rust client:

```bash
git clone https://github.com/singnet/rust-client.git
cd rust-client
cargo build --release
```

### 7.2 Deploy Test Transaction

From the `rust-client` directory, deploy a test transaction:

```bash
cargo run -- full-deploy -f ./rho_examples/stdout.rho --private-key <YOUR_PRIVATE_KEY> -p 40442
```

Replace `<YOUR_PRIVATE_KEY>` with your validator's private key.

Expected Response
```
Response: Success!
DeployId is: 304402206c435cee64d97d123f0c1b4552b3568698e64096a29fb50ec38f11a6c5f7758b022002e05322156bf5ed878ce20cef072cd8faf9e8bb15b58131f2fee06053b5d1c5
```

This confirms your validator can successfully send transactions to the network.



## Step 8: Monitor & Maintain

### Check Container Status

```bash
docker ps
```

You should see your validator container running.

### View Recent Logs

```bash
docker logs validator --tail 50 -f
```

### Verify on Block Explorer

Visit [explorer.dev.asichain.io](https://explorer.dev.asichain.io) and look for your validator's public key in the validators list.



## Stop Validator

To stop your validator:

```bash
docker compose -f ./validator.yml stop
```

This stops the container without deleting it, preserving state for future restarts.

### Data Persistence

The validator stores blockchain data in the `./data` directory. This data persists after stopping, which means:
- You can restart the validator without re-synchronizing
- The validator will resume from its last state
- Blockchain data is preserved during container updates

::: danger Complete Reset
To completely restart with fresh synchronization, remove the data directory:
```bash
rm -rf ./data
```
:::



## Port Configuration

The validator uses the following ports (configured in `validator.yml`):

| Port  | Purpose |
|-------|---------|
| 40440 | Protocol port |
| 40441 | API port gRPC external |
| 40442 | API port gRPC internal |
| 40443 | API port HTTP |
| 40444 | Discovery port |
| 40445 | API port admin HTTP |

::: warning Firewall Configuration
Ensure these ports are open in your firewall for the validator to function properly.
:::



## Configuration Files Reference

| File | Description |
|------|-------------|
| `conf/validator.env` | Configuration template with chain and validator parameters |
| `.env` | Active configuration file (created from template) |
| `conf/validator.conf` | RNode configuration |
| `conf/logback.xml` | Logging configuration |

### Docker Compose Files

| File | Purpose |
|------|---------|
| `configurator.yml` | Runs configurator for environment setup |
| `validator.yml` | Main validator with automatic bonding |
| `connector.yml` | Standalone bonding utility (optional) |

### Key Parameters in .env

**Chain Config:**
- `BOOTSTRAP` — Bootstrap node connection string
- `FAUCET_API_URL` — Testnet faucet URL for automatic funding
- `BOOTSTRAP_PUBLIC_GRPC_PORT` — Bootstrap gRPC port (40401)
- `OBSERVER_INTERNAL_GRPC_PORT` — Observer internal port (40452)
- `STAKE` — Amount to stake when bonding (100000000)

**Validator Config:**
- `VALIDATOR_HOST` — Your validator's public IP address
- `VALIDATOR_PRIVATE_KEY` — Private key for signing blocks
- `VALIDATOR_PUBLIC_KEY` — Public key for validator identity
- `VALIDATOR_ADDRESS` — Validator wallet address



## Troubleshooting

### Node Won't Start

**Check Docker status:**
```bash
docker ps -a
docker logs validator
```

**Common issues:**
- Ports already in use
- Insufficient system resources
- Network connectivity problems

### Synchronization Issues

**Reset and restart:**
```bash
docker compose -f ./validator.yml stop
rm -rf ./data
docker compose -f ./validator.yml up -d
```

### Connection Problems

**Verify ports are open:**
```bash
sudo ufw status
```

**Allow required ports:**
```bash
sudo ufw allow 40440:40445/tcp
```

### Connector Fails to Bond

**Check wallet balance:**
Visit [faucet.dev.asichain.io](https://faucet.dev.asichain.io) to get test tokens.

**Check connector logs:**
```bash
docker logs validator-connector-job
```

### More Help

See [Troubleshooting Guide](/quick-start/troubleshooting/) for detailed solutions to common problems.



## Network Endpoints

* **Bootstrap Node:** `rnode://e5e6faf012f36a30176d459ddc0db81435f6f1dc@54.152.57.201?protocol=40400&discovery=40404`
* **Observer API:** `http://54.235.138.68:40403/api/last-finalized-block`
* **Faucet:** `https://faucet.dev.asichain.io`
* **Wallet:** `https://wallet.dev.asichain.io`
* **Explorer:** `https://explorer.dev.asichain.io`



## Security Best Practices

1. **Key Management**

   * Store private keys securely, never in plain text
   * Create encrypted backups
   * Never share private keys
2. **Firewall Configuration**

   * Only open necessary ports (40440-40445)
   * Use UFW or iptables for port management
   * Consider additional security layers
3. **Regular Updates**

   * Keep Docker images updated
   * Monitor security advisories
   * Update validator software regularly
4. **Monitoring**

   * Set up alerts for node downtime
   * Monitor resource usage
   * Track peer connections
5. **Backups**

   * Regular backups of configuration files
   * Secure storage of wallet credentials
   * Test restore procedures



## Maintenance

### Update Your Validator

To update to the latest version:

```bash
cd asi-chain/chain/validator
git pull origin main
docker compose -f ./validator.yml down
docker compose -f ./validator.yml pull
docker compose -f ./validator.yml up -d
```

### Regular Checks

Monitor these metrics regularly:
- Disk space usage in `./data` directory
- Memory consumption
- Network bandwidth
- CPU load
- Peer connections
- Block synchronization status



## Optional: Build Images from Source (Advanced)

> Use this **only** if you want to build from sources. The main flow uses **public images** referenced in compose files.

All operations are performed from the `chain/validator` directory.

### Build Configurator Image

```bash
docker build -f configurator.Dockerfile -t configurator:latest ../..
```

::: info Build Context
The build context must be the project root (`../..`) to access the wallet-generator utility.
:::

### Build Connector Image

```bash
docker build -f connector.Dockerfile -t connector:latest .
```

### Verify Images

```bash
docker image ls
```

Expected output should include:

| REPOSITORY   | TAG    |
| ------------ | ------ |
| configurator | latest |
| connector    | latest |

### Use Local Images in Compose (optional)

You can use these public images directly, or build local images as described above and update the compose files to use `configurator:latest` and `connector:latest`.



## Next Steps

Now that your validator is running:

1. **Monitor Performance** — Keep an eye on logs and resource usage
2. **Explore the Network** — Use the [Block Explorer](https://explorer.dev.asichain.io)
3. **Deploy Contracts** — Try deploying your own smart contracts via [Wallet](https://wallet.dev.asichain.io)
4. **Join the Community** — Connect with other validators and developers



## Support

If you need help:

- **Documentation**: Browse this site for detailed guides
- **GitHub Repository**: [asi-alliance/asi-chain](https://github.com/asi-alliance/asi-chain)
- **GitHub Issues**: Report issues on GitHub
- **FAQ**: Check [FAQ section](/faq/) for common questions
