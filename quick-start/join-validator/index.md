# Join DevNet as Validator

This guide will help you join the ASI:Chain DevNet as a validator and participate in network consensus.

![ASI:Chain Workflows](/images/asi-chain-workflows.png)

## What is a Validator?

Validators are nodes that:
- Participate in consensus
- Validate and propose blocks
- Sign transactions
- Maintain network security

---

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

---

## Step 2: Get Test Tokens

Before running a validator, get test tokens from the faucet.

1. Visit [faucet.dev.asichain.io](https://faucet.dev.asichain.io)
2. Paste your ASI address
3. Click **FAUCET** button
4. Wait for tokens to arrive (check status on faucet page)

You can verify your balance in the wallet after receiving tokens.

---

## Step 3: Clone Repository

Clone the complete ASI:Chain repository with all submodules:

```bash
git clone https://github.com/asi-alliance/asi-chain.git
cd asi-chain/chain/validator
```

::: warning Important
Work from the `chain/validator/` directory for all validator operations.
:::

---

## Step 4: Build Docker Images

All operations are performed from the `chain/validator` directory.

### 4.1 Build Configurator Image

The configurator automatically generates missing wallet credentials:

```bash
docker build -f configurator.Dockerfile -t configurator:latest ../..
```

::: info Build Context
The build context must be set to the project root (`../..`) to access the wallet-generator utility.
:::

### 4.2 Build Connector Image

The connector handles the bonding transaction to register your validator:

```bash
docker build -f connector.Dockerfile -t connector:latest .
```

### 4.3 Verify Images

Confirm both images were created successfully:

```bash
docker image ls
```

Expected output should include:

| REPOSITORY   | TAG    |
|--------------|--------|
| configurator | latest |
| connector    | latest |

### 4.4 Update Docker Compose Files

The compose files reference ECR images by default. Update them to use your local images.

**In `configurator.yml`:**
```yaml
image: configurator:latest
```

**In `connector.yml` (if using manual bonding):**
```yaml
image: connector:latest
```

**In `validator.yml` (connector service):**
```yaml
image: connector:latest
```

---

## Step 5: Configure Environment

### 5.1 Prepare Configuration File

Copy the template configuration:

```bash
cp conf/validator.env .env
```

The template contains two sections:
* **Chain config** — Network parameters (pre-filled, don't change unless connecting to different shard)
* **Validator config** — Parameters you must configure

### 5.2 Configure Validator Parameters

Choose one of the following options:

#### Option A: Generate New Wallet (Recommended)

Leave validator parameters empty in `.env`. The configurator will:
- Generate new credentials (`VALIDATOR_PRIVATE_KEY`, `VALIDATOR_PUBLIC_KEY`, `VALIDATOR_ADDRESS`)
- Write them to the `.env` file
- Display them in container logs

::: warning Save Your Credentials
Once generated, **save your credentials securely**. You'll need them to restart your validator.
:::

#### Option B: Use Existing Wallet

If you already have wallet credentials from [Step 1](#step-1-create-your-wallet), provide all three parameters in `.env`:

```env
VALIDATOR_ADDRESS=<your-address>
VALIDATOR_PUBLIC_KEY=<your-public-key>
VALIDATOR_PRIVATE_KEY=<your-private-key>
```

### 5.3 Set Your Host

Update the `VALIDATOR_HOST` in `.env` with your server's public IP address:

```env
VALIDATOR_HOST=<your-public-ip>
```

To find your public IP:
```bash
curl ifconfig.me
```

::: danger Important
Do NOT use `localhost` or `127.0.0.1` as your validator host. Use your server's **public IP address**.
:::

### 5.4 Understanding the Stake Parameter

The `STAKE` parameter in `.env` determines the bonding amount (default: `100000000`).

The connector utility handles funding automatically:
- If wallet balance is sufficient for the stake amount, bonding proceeds
- If balance is insufficient, connector requests funds from the faucet
- If faucet limits are exceeded and balance remains insufficient, connector exits with error

---

## Step 6: Run Configurator

Execute the configurator to generate or validate credentials:

```bash
docker compose -f ./configurator.yml up
```

The configurator will:
1. Read your `.env` file
2. Check for missing required parameters
3. Generate new wallet credentials if none exist
4. Write generated parameters back to `.env`

::: tip What to Look For
If new credentials were generated, you'll see them in the container logs. **Save these credentials immediately**.
:::

---

## Step 7: Start Validator

### Standard Deployment (Recommended)

Run both bonding and validation with a single command:

```bash
docker compose -f ./validator.yml up -d
```

This starts two services:
1. **connector** — Utility container that sends the bonding transaction (runs once and exits)
2. **validator** — Your validator node (runs continuously)

The `-d` flag runs services in detached mode.

::: info Bonding Process
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

---

## Step 8: Verify Synchronization

### 8.1 Check Your Validator Logs

Monitor your validator's synchronization progress:

```bash
docker logs validator -f
```

### 8.2 Check Network Status

**Check the observer's latest finalized block:**
```
http://54.152.57.201:40453/api/last-finalized-block
```

If the response contains at least one block, the network is operational.

**Check your validator's latest finalized block:**

Replace with your validator's host and HTTP API port (40443):
```
http://<YOUR_VALIDATOR_HOST>:40443/api/last-finalized-block
```

### 8.3 Evaluate Synchronization

- If your validator shows at least one block, synchronization has started
- When your validator's last block approximately matches the observer's (within ~50 blocks), synchronization is successful
- If the validator is behind, allow time for it to catch up

::: tip Synchronization Time
Initial synchronization may take several minutes to hours depending on blockchain size and network speed.
:::

---

## Step 9: Transaction Deployment Verification

Verify your validator can submit transactions to the network.

### 9.1 Install Rust CLI Client

Clone and build the Rust client:

```bash
git clone https://github.com/singnet/rust-client.git
cd rust-client
cargo build --release
```

### 9.2 Deploy Test Transaction

From the `rust-client` directory, deploy a test transaction:

```bash
cargo run -- full-deploy -f ./rho_examples/stdout.rho --private-key <YOUR_PRIVATE_KEY> -p 40442
```

Replace `<YOUR_PRIVATE_KEY>` with your validator's private key.

::: success Expected Response
```
Response: Success!
DeployId is: 304402206c435cee64d97d123f0c1b4552b3568698e64096a29fb50ec38f11a6c5f7758b022002e05322156bf5ed878ce20cef072cd8faf9e8bb15b58131f2fee06053b5d1c5
```
:::

This confirms your validator can successfully send transactions to the network.

---

## Step 10: Monitor Your Validator

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

---

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

---

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

---

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

---

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

---

## Network Endpoints

- **Bootstrap Node:** `rnode://e5e6faf012f36a30176d459ddc0db81435f6f1dc@54.152.57.201?protocol=40400&discovery=40404`
- **Observer API:** http://54.152.57.201:40453/api/last-finalized-block
- **Faucet:** https://faucet.dev.asichain.io
- **Wallet:** https://wallet.dev.asichain.io
- **Explorer:** https://explorer.dev.asichain.io

---

## Security Best Practices

1. **Key Management**
   - Store private keys securely, never in plain text
   - Create encrypted backups
   - Never share private keys

2. **Firewall Configuration**
   - Only open necessary ports (40440-40445)
   - Use UFW or iptables for port management
   - Consider additional security layers

3. **Regular Updates**
   - Keep Docker images updated
   - Monitor security advisories
   - Update validator software regularly

4. **Monitoring**
   - Set up alerts for node downtime
   - Monitor resource usage
   - Track peer connections

5. **Backups**
   - Regular backups of configuration files
   - Secure storage of wallet credentials
   - Test restore procedures

---

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

---

## Next Steps

Now that your validator is running:

1. **Monitor Performance** — Keep an eye on logs and resource usage
2. **Explore the Network** — Use the [Block Explorer](https://explorer.dev.asichain.io)
3. **Deploy Contracts** — Try deploying your own smart contracts via [Wallet](https://wallet.dev.asichain.io)
4. **Join the Community** — Connect with other validators and developers

---

## Support

If you need help:

- **Documentation**: Browse this site for detailed guides
- **GitHub Repository**: [asi-alliance/asi-chain](https://github.com/asi-alliance/asi-chain)
- **GitHub Issues**: Report issues on GitHub
- **FAQ**: Check [FAQ section](/faq/) for common questions

---

You are now running a validator on ASI:Chain DevNet and helping secure the network!
