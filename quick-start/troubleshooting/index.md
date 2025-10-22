# Troubleshooting Guide

Common issues and solutions when working with ASI:Chain DevNet.

## Connection Issues

### Node Cannot Connect to Network

**Symptoms:**
- Node fails to sync
- No peer connections
- Timeout errors

**Solutions:**

1. **Verify Bootstrap Connection**
   ```bash
   ping 54.152.57.201
   telnet 54.152.57.201 40400
   ```

2. **Check Firewall Rules**
   ```bash
   sudo ufw status
   sudo ufw allow 40400:40405/tcp
   ```

3. **Restart Node**
   ```bash
   docker compose -f validator.yml restart
   ```

4. **Check Logs**
   ```bash
   docker logs validator -f
   ```

### Node Won't Start

**Symptoms:**
- Container exits immediately
- Docker compose fails

**Solutions:**

1. **Check Configuration**
   - Verify `.env` file exists and is correct
   - Check `validator.conf` syntax
   - Ensure private key is valid

2. **Check Port Conflicts**
   ```bash
   netstat -tulpn | grep 40400
   ```

3. **View Container Logs**
   ```bash
   docker logs validator
   ```

4. **Remove and Recreate**
   ```bash
   docker compose -f validator.yml down
   rm -rf data/
   docker compose -f validator.yml up -d
   ```

## Synchronization Problems

### Node Not Synchronizing

**Symptoms:**
- Stuck at old block height
- No new blocks appearing

**Solutions:**

1. **Check Peer Connections**
   Look for `Peers: X` in logs - should be 3+

2. **Verify Network Connectivity**
   ```bash
   curl http://54.152.57.201:40453/status
   ```

3. **Reset Blockchain Data**
   ```bash
   docker compose -f validator.yml down
   rm -rf data/
   docker compose -f validator.yml up -d
   ```

### Slow Synchronization

**Causes:**
- Network bandwidth limitation
- Slow disk I/O
- High network congestion

**Solutions:**
- Use SSD for storage
- Increase allocated resources
- Check network speed
- Wait for sync to complete

## Wallet Issues

### Wallet Won't Load

**Solutions:**

1. **Clear Browser Cache**
   - Chrome: Settings > Privacy > Clear browsing data
   - Firefox: Settings > Privacy & Security > Clear Data

2. **Try Incognito/Private Mode**
   - Eliminates extension conflicts
   - Fresh start without cache

3. **Check JavaScript**
   - Ensure JavaScript is enabled
   - Disable blocking extensions

4. **Try Different Browser**
   - Chrome, Firefox, Safari, Edge

### Cannot Connect to Network

**Solutions:**

1. **Check Network Selection**
   - Verify correct network is selected
   - Try switching networks

2. **Verify Endpoints**
   - DevNet: `54.152.57.201`
   - Check Settings page

3. **Test Connectivity**
   ```bash
   curl http://54.152.57.201:40453/status
   ```

### Balance Not Showing

**Solutions:**

1. **Refresh Balance**
   - Click "Refresh Balance" button
   - Wait a few seconds

2. **Check Transaction Status**
   - Verify faucet transaction completed
   - Check on Block Explorer

3. **Clear Cache and Reload**
   - Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

## Transaction Issues

### Transaction Failed

**Common Reasons:**

1. **Insufficient Balance**
   - Need balance for amount + fees
   - Request more from faucet

2. **Invalid Address**
   - Check recipient address format
   - Must be 50-54 characters
   - Starts with "1111"

3. **Network Issues**
   - Check network connectivity
   - Retry transaction

### Transaction Pending Too Long

**Solutions:**

1. **Wait for Confirmation**
   - Average: 20-60 seconds
   - Network may be busy

2. **Check Explorer**
   - Verify transaction exists
   - Check block confirmations

3. **Check Node Status**
   - Ensure network is operational
   - Visit [Explorer](https://explorer.dev.asichain.io)

## Validator Issues

### Validator Not Proposing Blocks

**Causes:**

1. **Not Fully Synchronized**
   - Check sync status in logs
   - Wait for full sync

2. **Insufficient Peer Connections**
   - Need 3+ peers
   - Check network connectivity

3. **Configuration Issues**
   - Verify private/public keys
   - Check validator.conf

**Solutions:**

1. **Check Logs**
   ```bash
   docker logs validator -f
   ```

2. **Verify Peers**
   Look for: `Peers: 4` or more

3. **Restart Validator**
   ```bash
   docker compose -f validator.yml restart
   ```

### High Resource Usage

**Solutions:**

1. **Increase Allocated Resources**
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '8.0'
         memory: 32G
   ```

2. **Use SSD Storage**
   - Much faster I/O
   - Critical for validators

3. **Monitor Performance**
   ```bash
   docker stats validator
   ```

## Docker Issues

### Permission Denied Errors

**Solution:**
```bash
sudo usermod -aG docker $USER
newgrp docker
```

### Out of Disk Space

**Solutions:**

1. **Clean Docker**
   ```bash
   docker system prune -a
   ```

2. **Check Disk Usage**
   ```bash
   df -h
   ```

3. **Remove Old Containers**
   ```bash
   docker container prune
   ```

### Image Pull Failed

**Solutions:**

1. **Check Internet Connection**

2. **Retry Pull**
   ```bash
   docker pull 533793137436.dkr.ecr.us-east-1.amazonaws.com/asi-chain/node:latest
   ```

3. **Clear Docker Cache**
   ```bash
   docker system prune -a
   ```

## API Issues

### Cannot Access HTTP API

**Solutions:**

1. **Check Node is Running**
   ```bash
   docker ps | grep validator
   ```

2. **Verify Port Mapping**
   ```bash
   docker port validator
   ```

3. **Test Endpoint**
   ```bash
   curl http://localhost:40403/status
   ```

4. **Check Firewall**
   ```bash
   sudo ufw allow 40403/tcp
   ```

### gRPC Connection Failed

**Solutions:**

1. **Verify Port**
   - Internal: 40402
   - External: 40401

2. **Test Connection**
   ```bash
   grpcurl -plaintext localhost:40401 list
   ```

## Network Issues

### DNS Resolution Failed

**Solution:**
```bash
# Use IP directly
54.152.57.201
```

### Timeout Errors

**Causes:**
- Slow network
- Server overload
- Firewall blocking

**Solutions:**
1. Check internet speed
2. Try different network
3. Wait and retry

## Smart Contract Issues

### Deployment Failed

**Common Issues:**

1. **Syntax Errors**
   - Check Rholang syntax
   - Use IDE validation

2. **Insufficient Phlo**
   - Increase phlo-limit
   - Default: 10000000

3. **Invalid Private Key**
   - Verify key format
   - Check key is correct

### Contract Not Executing

**Solutions:**

1. **Check Logs**
   ```bash
   docker logs validator -f
   ```

2. **Verify Deployment**
   - Check DeployId
   - Search on Explorer

3. **Propose Block**
   ```bash
   cargo run -- propose --private-key <key> -H localhost -p 40402
   ```

## CLI Issues

### Rust Client Not Found

**Solution:**
```bash
git clone https://github.com/singnet/rust-client.git
cd rust-client
cargo build --release
```

### Command Failed

**Solutions:**

1. **Check Syntax**
   ```bash
   cargo run -- deploy -f ./contract.rho --private-key <key> -H <host> -p <port>
   ```

2. **Verify Node Running**
   ```bash
   curl http://localhost:40402
   ```

3. **Check Private Key**
   - Must be 64 hex characters
   - No prefix or suffix

## Getting More Help

If issues persist:

1. **Check FAQ**
   - [FAQ Section](/faq/)
   - Common questions answered

2. **Review Logs**
   - Docker logs provide clues
   - Share relevant logs when asking for help

3. **GitHub Issues**
   - [Create an issue](https://github.com/asi-alliance/asi-chain/issues)
   - Provide details and logs

4. **Documentation**
   - [DevNet Structure](/shard-nodes/devnet-structure/)
   - [Validator Setup](/quick-start/join-validator/)
   - [Useful Links](/general/useful-links/)

## Diagnostic Commands

### Quick Health Check

```bash
# Docker status
docker ps -a

# View logs
docker logs validator --tail 50

# Check resources
docker stats validator

# Test API
curl http://localhost:40403/status

# Check network
ping 54.152.57.201
```

### Collect Debug Information

```bash
# System info
uname -a
docker --version

# Container info
docker inspect validator

# Full logs
docker logs validator > validator.log

# Network status
netstat -tulpn | grep 404
```

---

**Remember:** Most issues can be resolved by checking logs, verifying configuration, and restarting services. Don't hesitate to ask for help if stuck!
