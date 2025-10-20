# Network Nodes Configuration

## Network Overview

This document contains the configuration for ASI Chain Devnet nodes. The network consists of validator nodes for transaction processing and observer nodes for read-only operations.

## Devnet Nodes

### Primary Validator Node

The primary validator node handles transaction processing and contract deployments.

**Connection Details**:
- **Host**: `54.152.57.201`
- **HTTP Port**: `40413`
- **gRPC Port**: `40401`
- **HTTP URL**: `http://54.152.57.201:40413`
- **gRPC URL**: `54.152.57.201:40401`

**Use Cases**:
- Transaction submission
- Contract deployment
- Write operations

### Observer Node

The observer node provides read-only access to the blockchain state.

**Connection Details**:
- **Host**: `54.152.57.201`
- **HTTP Port**: `40453`
- **gRPC Port**: `40451`
- **HTTP URL**: `http://54.152.57.201:40453`
- **gRPC URL**: `54.152.57.201:40451`

**Use Cases**:
- Balance queries
- Block exploration
- Read-only operations
- State inspection

## Configuration Guide

### Wallet Configuration

For the ASI Wallet, use these settings:

**Validator Node (for transactions)**:
```
Host: 54.152.57.201
gRPC Port: 40401
HTTP Port: 40413
```

**Observer Node (read-only operations)**:
```
Host: 54.152.57.201
gRPC Port: 40451
HTTP Port: 40453
```

### Node Selection Strategy

The wallet automatically routes operations based on type:
- **Write Operations**: Routed to Validator node (40413)
  - Token transfers
  - Contract deployments
  - State modifications
- **Read Operations**: Routed to Observer node (40453)
  - Balance checks
  - Block queries
  - State reads

## Local Development

For local development and testing, use localhost configuration:

**Local Validator**:
```
URL: http://localhost:40413
gRPC: localhost:40401
```

**Local Observer**:
```
URL: http://localhost:40453
gRPC: localhost:40451
```

**Local Admin**:
```
URL: http://localhost:40405
```

## Network Access

### Public Endpoints

All Devnet nodes are publicly accessible and do not require authentication for basic operations.

### Rate Limiting

Please be mindful of network resources. For high-frequency operations, consider running your own local node.

## Connection Examples

### HTTP Request (Observer Node)

```bash
curl http://54.152.57.201:40453/api/blocks/1
```

### HTTP Request (Validator Node)

```bash
curl -X POST http://54.152.57.201:40413/api/deploy \
  -H "Content-Type: application/json" \
  -d '{"term": "new stdout(`rho:io:stdout`) in { stdout!(\"Hello\") }"}'
```

### gRPC Connection

```bash
grpcurl -plaintext 54.152.57.201:40401 list
```

## Troubleshooting

### Connection Issues

**Cannot connect to validator node**:
- Verify the URL: `http://54.152.57.201:40413`
- Check firewall settings
- Ensure internet connectivity

**Cannot connect to observer node**:
- Verify the URL: `http://54.152.57.201:40453`
- Try using HTTP instead of HTTPS
- Check if port 40453 is accessible

### Performance Issues

**Slow response times**:
- Use Observer node for read operations
- Use Validator node only for write operations
- Consider running a local node for development

## Additional Resources

- **Wallet Guide**: [/wallet/](/wallet/)
- **Network Configuration**: [/network-configuration/](/network-configuration/)
- **Faucet**: [faucet.dev.asichain.io](https://faucet.dev.asichain.io)
- **Block Explorer**: [explorer.dev.asichain.io](https://explorer.dev.asichain.io)
