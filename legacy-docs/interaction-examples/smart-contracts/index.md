# Smart Contract Deployment

## Overview

This guide shows how to deploy Rholang smart contracts to the ASI:Chain testnet using your validator node.

## Requirements

- Running validator node with API access
- Valid private key for transaction signing
- Node synchronized with the network

## Basic Contract Example

### Hello World Contract

```rholang
new stdout(`rho:io:stdout`) in {
  stdout!("Hello, ASI:Chain!")
}
```

## Deployment Process

### Step 1: Install CLI

First, build the Rust CLI from the repository:

```bash
git clone https://github.com/singnet/rust-client.git
cd rust-client
cargo build --release
```

### Step 2: Deploy Contract

Use the Rust CLI to deploy your contract:

```bash
cargo run -- deploy -f ./<path to contract>/smartcontractname.rho --private-key <private key> -H <host> -p <port>
```

Example:
```bash
cargo run -- deploy -f ./examples/stdout.rho --private-key "<YOUR-PRIVATE-KEY>" -H localhost -p 40402
```

### Parameters Explanation

- `-f`: Path to your Rholang contract file
- `--private-key`: Your validator's private key
- `-H`: Host address (localhost for local node)
- `-p`: Port number (40402 for internal gRPC)

### Step 3: Verify Deployment

**Expected Success Response**:
```
Response: Success!
DeployId is: 304402206c435cee64d97d123f0c1b4552b3568698e64096a29fb50ec38f11a6c5f7758b022002e05322156bf5ed878ce20cef072cd8faf9e8bb15b58131f2fee06053b5d1c5
```

### Step 4: Propose Block

After deployment, propose a block to include your contract:

```bash
cargo run -- propose --private-key <private key> -H <host> -p <port>
```

Example:
```bash
cargo run -- propose --private-key "<YOUR-PRIVATE-KEY>" -H localhost -p 40402
```

**Expected Success Response**:
```
Response: Success! Block 4dda69c62838e18abd3c131818e60110ac3caccc66ec05792cedb327a3bafff7 created and added.
```

## Verify Execution

### Check Logs

Monitor validator logs for contract execution:

```bash
sudo docker logs validator -f
```

Look for your contract output (e.g., "Hello, ASI:Chain!")

### Alternative: Custom Term Deployment

You can also deploy custom Rholang code by creating a `.rho` file first:

1. Create your contract file:
```bash
echo 'new stdout(`rho:io:stdout`) in { stdout!("Custom message") }' > custom.rho
```

2. Deploy it:
```bash
cargo run -- deploy -f ./custom.rho --private-key "<YOUR-PRIVATE-KEY>" -H localhost -p 40402
```

## Available Examples

The node container includes example contracts in `/opt/docker/examples/`:
- `stdout.rho` - Simple output example

## Troubleshooting

**Deployment Fails**:
- Verify private key is correct
- Check node synchronization status
- Ensure sufficient phlo limit

**No Output in Logs**:
- Wait for block proposal and finalization
- Check if contract uses stdout correctly
- Verify contract syntax