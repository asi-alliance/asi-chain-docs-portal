# Wallet CLI

A command-line wallet for the ASI Chain network. The CLI provides wallet management, token transfers, balance checking, and deploy history monitoring directly from your terminal.

**Source code**: [github.com/asi-alliance/asi-chain-wallet-cli](https://github.com/asi-alliance/asi-chain-wallet-cli)

::: warning SECURITY NOTICE
The CLI stores wallet credentials in a local JSON file. Keep your `credentials/wallet_info.json` file secure and never share it. There is no recovery mechanism for lost private keys.
:::

## Prerequisites

Before using the CLI, ensure you have:

- [Rust](https://www.rust-lang.org/tools/install) installed (edition 2024)
- Access to ASI Chain network nodes (Validator and Observer)
- GraphQL API endpoint for deploy history features

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/asi-alliance/asi-chain-wallet-cli.git
cd asi-chain-wallet-cli
```

### Step 2: Initialize Submodules

The CLI depends on the `rust-client` submodule for low-level blockchain interactions:

```bash
git submodule init
git submodule update
```

To keep the submodule up-to-date:

```bash
git submodule update --init --remote -- rust-client
```

### Step 3: Build the Project

```bash
cargo build --release
```

The compiled binary will be available at `target/release/asi-chain-wallet-cli`.

## Configuration

### Step 1: Create Configuration File

Copy the example configuration:

```bash
cp .env.example .env
```

### Step 2: Configure Network Connection

Edit the `.env` file with your network settings.

**For DevNet:**

```env
# Validator 1 handles both write (deploys) and read (queries),
# because the dedicated observer is currently unstable.
VALIDATOR_HOST=34.196.119.4
VALIDATOR_GRPC_PORT=40401
VALIDATOR_HTTP_PORT=40403

OBSERVER_HOST=34.196.119.4
OBSERVER_GRPC_PORT=40401
OBSERVER_HTTP_PORT=40403

OUTPUT_DIR=./credentials
TOKEN="ASI"

VERBOSE_LOGS=false

GRAPHQL_URL=https://indexer.dev.asichain.io/v1/graphql
```

::: warning
Both `VALIDATOR_HOST` and `OBSERVER_HOST` point to **Validator 1** (`34.196.119.4`) for now: the dedicated DevNet observer is unstable, so Validator 1 serves both deploys and read queries until the observer is stabilized.

The bootstrap node (`54.152.57.201`) is the network's peer-discovery entry point — used only when launching your own node, not by the CLI directly.
:::

**Configuration Parameters:**

| Parameter | Description | DevNet Value |
|-----------|-------------|--------------|
| `VALIDATOR_HOST` | Host accepting deploys | `34.196.119.4` (Validator 1) |
| `VALIDATOR_GRPC_PORT` | gRPC port for write operations | `40401` |
| `VALIDATOR_HTTP_PORT` | HTTP port for write operations | `40403` |
| `OBSERVER_HOST` | Host serving read queries | `34.196.119.4` (Validator 1, observer is unstable) |
| `OBSERVER_GRPC_PORT` | gRPC port for read operations | `40401` |
| `OUTPUT_DIR` | Directory for storing wallet credentials | `./credentials` |
| `TOKEN` | Token name to use | `ASI` |
| `VERBOSE_LOGS` | Show detailed logs from rust-client | `false` |
| `GRAPHQL_URL` | Indexer GraphQL endpoint for deploy history | `https://indexer.dev.asichain.io/v1/graphql` |

::: tip Other ports
The default `40432/40433/40452` values that ship with `.env.example` are local-development defaults (multiple nodes on a single machine using the `404XY` pattern with X = node index). For DevNet, use the values above.
:::

## Commands

### Create Wallet

Generate a new wallet with private key, public key, and ASI address.

```bash
# Create and display keys (not saved to disk)
cargo run -- create

# Create and save to credentials file
cargo run -- create --save
```

When using the `--save` flag, wallet credentials are stored in `./credentials/wallet_info.json`:

```json
{
  "private_key": "...",
  "public_key": "...",
  "address": "1111..."
}
```

::: warning
Back up your `wallet_info.json` file securely. If you lose this file or your private key, you will lose access to your funds permanently.
:::

### Check Balance

Check the current balance of your wallet:

```bash
cargo run -- balance
```

Or use the short alias:

```bash
cargo run -- bal
```

The command reads the wallet address from your saved credentials and queries the Observer node for the current balance.

### Send Tokens

Transfer ASI tokens to another address:

```bash
cargo run -- send --to <recipient-address> --amount <amount>
```

**Example:**

```bash
cargo run -- send --to 1111AtahZeefej4tvVR6ti9TJtv8yxLebT31SCEVDCKMNikBk5r3g --amount 100000000
```

**Parameters:**

| Parameter | Description |
|-----------|-------------|
| `--to` | Recipient's ASI address (starts with `1111`) |
| `--amount` | Amount in smallest units (see [Token Decimals](#token-decimals)) |

The command performs several checks before sending:
- Verifies sufficient balance
- Validates recipient address format
- Confirms amount is greater than zero

After deployment, the CLI displays the deploy ID and waits for deploy finalization.

### Deploy History

Monitor your deploy history in real-time:

```bash
# Display last 10 deployments and monitor for new ones
cargo run -- history

# Specify custom limit
cargo run -- history --limit 20

# Using alias
cargo run -- hist --limit 20
```

**Features:**

- Displays recent deployments (both incoming and outgoing transfers)
- Shows deploy ID, block number, status, and timestamp
- Lists associated transfers with direction (IN/OUT) and amounts
- Continuously monitors for new deploys via WebSocket subscription
- Real-time updates as new blocks are created

**Output example:**

```
>>> Starting real-time deploy monitoring...
Wallet: 1111AtahZeefej4tvVR6ti9TJtv8yxLebT31SCEVDCKMNikBk5r3g
Public Key: 04abc...

================================================================================

Recent History (last 10):

================================================================================
Deploy ID: 3045022100abc...
Block: #12345
Status: finalized
Created at: 2025-01-15 10:30:45 UTC

 💳  Associated Transfers:
  ← IN  | 100000000 dust
     From: 1111La6tHaCtGjRiv4wkffbTAAjGyMsVhzSUNzQxH1jjZH9jtEi3M
================================================================================

>>> Monitoring for new deployments...
```

### Export Data

Export your deploy history to a file for analysis or record-keeping:

```bash
# Export as JSON (default format)
cargo run -- export

# Export as CSV
cargo run -- export --format csv

# Specify custom output path
cargo run -- export --output my_deploys.json

# Limit number of records (default: 100)
cargo run -- export --limit 50

# Combine options
cargo run -- export --format csv --output reports/wallet_2024.csv --limit 200
```

**Parameters:**

| Parameter | Description | Default |
|-----------|-------------|---------|
| `--format` | Output format: `json` or `csv` | json |
| `--output` | Custom output file path | Auto-generated in `exports/` |
| `--limit` | Maximum number of records to export | 100 |

**Default output location:** `exports/wallet_export_YYYYMMDD_HHMMSS.{json|csv}`

**Exported data includes:**

- Deploy ID
- Block number
- Status
- Timestamp
- Transfer direction (IN/OUT)
- Transfer amount
- Sender and recipient addresses

### Help

Display available commands and usage information:

```bash
cargo run -- help
```

## Docker

You can build and run the wallet CLI using Docker instead of compiling from source.

### Build Docker Image

```bash
docker build -t wallet-cli .
```

### Run with Docker Compose

Run commands using Docker Compose:

```bash
docker compose run --rm wallet-cli balance
docker compose run --rm wallet-cli send --to <ADDRESS> --amount 1000
```

::: tip Volume Mounts
Docker Compose automatically mounts `./credentials` and `./exports` directories, so your wallet credentials and exported data persist on your local filesystem.
:::

## Token Decimals

ASI token uses 8 decimal places. When specifying amounts in CLI commands, use the smallest unit:

| Human-Readable | CLI Amount |
|----------------|------------|
| 0.5 ASI | 50000000 |
| 1 ASI | 100000000 |
| 10 ASI | 1000000000 |
| 100 ASI | 10000000000 |

**Formula:** `CLI Amount = Human Amount × 100000000`

::: tip
To send 1 ASI token, use `--amount 100000000` (1 × 10⁸)
:::

## Deploy Statuses

Your deploys can have the following statuses:

| Status | Description |
|--------|-------------|
| **Deploying** | Deploy is sent but not yet included in a block |
| **Finalizing** | Deploy is included in a block but not finalized |
| **Finalized** | Deploy successfully completed |

::: info Status Timing
Deploys typically take a few seconds to finalize. The CLI automatically monitors and displays status updates during the send operation.
:::

## Troubleshooting

**"VALIDATOR_HOST is not set in .env":**
- Ensure your `.env` file exists and contains all required variables
- Check that variable names match exactly (case-sensitive)

**"Failed to read wallet info from ...":**
- Create a wallet first using `cargo run -- create --save`
- Verify the `OUTPUT_DIR` path in your `.env` file

**"Insufficient balance to complete the transfer":**
- Check your current balance with `cargo run -- balance`
- Remember to account for token decimals (1 ASI = 100000000)

## Project Structure

```
asi-chain-wallet-cli/
├── Cargo.toml              # Project dependencies
├── .env.example            # Environment configuration template
├── Dockerfile              # Docker build configuration
├── docker-compose.yml      # Docker Compose configuration
├── src/
│   ├── main.rs             # Entry point and CLI commands
│   ├── config.rs           # Configuration management
│   ├── models.rs           # Data models
│   ├── commands/
│   │   ├── balance.rs      # Balance command
│   │   ├── export.rs       # Export command
│   │   ├── history.rs      # History command
│   │   ├── keys.rs         # Create wallet command
│   │   └── send.rs         # Send command
│   ├── requests/
│   │   └── graphql.rs      # GraphQL queries
│   └── utils/
│       ├── deployment.rs   # Deployment utilities
│       └── websocket.rs    # WebSocket connection
└── rust-client/            # Submodule: low-level node CLI
```

## Support Resources

- **Documentation**: [docs.asichain.io](https://docs.asichain.io)
- **Web Wallet**: [wallet.dev.asichain.io](https://wallet.dev.asichain.io)
- **Block Explorer**: [explorer.dev.asichain.io](https://explorer.dev.asichain.io)
- **Faucet**: [faucet.dev.asichain.io](https://faucet.dev.asichain.io)
- **GitHub**: [asi-alliance/asi-chain-wallet-cli](https://github.com/asi-alliance/asi-chain-wallet-cli)

---

**Note**: The Wallet CLI is currently in beta. For production use cases, ensure you have proper backups of your credentials and test with small amounts first.
