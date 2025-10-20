# Custom Network Connection

Guide for connecting ASI Wallet to custom networks, including DevNet, local nodes, and private shards.

## Overview

ASI Wallet supports connecting to different networks:
- **DevNet** - Official development network
- **Local Network** - Your local validator/observer node
- **Custom Networks** - Private shards or other networks

## Accessing Network Settings

1. Open [ASI Wallet](https://wallet.dev.asichain.io)
2. Navigate to **Settings** page
3. View current network configurations
4. Edit or add new networks

## DevNet Configuration

DevNet is the default network for testing and development.

### DevNet Endpoints

**Validator Node (for transactions):**
- Host: `54.152.57.201`
- gRPC Port: `40401`
- HTTP Port: `40413`
- HTTP URL: `http://54.152.57.201:40413`

**Observer Node (read-only operations):**
- Host: `54.152.57.201`
- gRPC Port: `40451`
- HTTP Port: `40453`
- HTTP URL: `http://54.152.57.201:40453`

### How It Works

The wallet automatically routes operations:
- **Write Operations** (transfers, deployments) → Validator node (40413)
- **Read Operations** (balance checks, queries) → Observer node (40453)

### Editing DevNet Configuration

1. Go to Settings page
2. Find Devnet Configuration section
3. Click **Edit Configuration** button
4. Update endpoint URLs if needed
5. Save changes

> **Note:** DevNet configuration is pre-configured and usually doesn't need changes.

## Local Network Configuration

Connect to your own local validator or observer node.

### Setup Local Node First

Before configuring the wallet, ensure you have a running node:

**For Validator:**
```bash
cd asi-chain/chain
sudo docker compose -f validator.yml up -d
```

**For Observer:**
```bash
cd asi-chain/chain  
sudo docker compose -f observer.yml up -d
```

### Local Network Settings

**Configuration:**
- Validator URL: `http://localhost:40413`
- Observer URL: `http://localhost:40453`
- Admin URL: `http://localhost:40405`

### How to Configure

1. Go to Settings page in wallet
2. Find Local Network section
3. Click **Edit Network** button
4. Verify URLs:
   ```
   Validator: http://localhost:40413
   Observer: http://localhost:40453
   Admin: http://localhost:40405
   ```
5. Save configuration

### Switch to Local Network

To use your local node:
1. Select Local Network from network dropdown
2. Wallet will now connect to localhost
3. All operations use your local node

## Custom Network Configuration

Connect to a private shard or custom deployment.

### Requirements

Before connecting to a custom network, you need:
- IP address or domain of the network
- HTTP port for validator node
- HTTP port for observer node (if available)
- Confirmation that network is accessible

### Adding Custom Network

1. Go to Settings page
2. Look for option to add custom network (if available)
3. Provide network details:
   - **Network Name:** Friendly name
   - **Validator URL:** `http://<ip>:<port>`
   - **Observer URL:** `http://<ip>:<port>` (optional)

### Example Custom Network

For a private shard at `192.168.1.100`:

```
Network Name: Private Test
Validator URL: http://192.168.1.100:40413
Observer URL: http://192.168.1.100:40453
```

## Network Selection

### Switching Networks

The wallet allows switching between configured networks:

1. Find network selector (typically in header or settings)
2. Click current network name
3. Select desired network from dropdown
4. Wallet reconnects to selected network

**Important:** Switching networks changes:
- Which blockchain you're connected to
- Available accounts (different networks = different balances)
- Transaction history shown

### Active Network Indicator

The wallet shows which network is currently active:
- Look for network name in header or status bar
- Connection indicator (green = connected)
- Real-time updates when switched

## Troubleshooting Network Connections

### Cannot Connect to DevNet

**Symptoms:**
- "Connection failed" error
- Transactions timing out
- Balance not loading

**Solutions:**
1. Check internet connection
2. Verify firewall isn't blocking requests
3. Try refreshing the page
4. Check if DevNet is operational at [explorer.dev.asichain.io](https://explorer.dev.asichain.io)

### Cannot Connect to Local Network

**Symptoms:**
- Wallet can't reach localhost
- "Network unreachable" error

**Solutions:**
1. Verify node is running:
   ```bash
   docker ps | grep validator
   ```

2. Check node logs:
   ```bash
   docker logs validator -f
   ```

3. Test endpoint manually:
   ```bash
   curl http://localhost:40413/status
   ```

4. Verify ports are correct:
   - Validator HTTP: 40413
   - Observer HTTP: 40453

5. Check if ports are listening:
   ```bash
   netstat -an | grep 40413
   ```

### Cannot Connect to Custom Network

**Symptoms:**
- "Cannot reach network" error
- Timeout errors

**Solutions:**
1. **Verify IP and ports are correct**
   - Double-check IP address
   - Confirm port numbers
   - Test with curl: `curl http://<ip>:<port>/status`

2. **Check firewall rules**
   - Ensure ports are open
   - Verify network security groups (if cloud)

3. **Test network connectivity**
   ```bash
   ping <ip>
   telnet <ip> <port>
   ```

4. **Verify node is running**
   - Check if target node is operational
   - Review node logs for errors

### CORS Issues

If you see CORS errors:

**Problem:** Browser security blocks cross-origin requests

**Solution for local development:**
- Run wallet locally, not from hosted site
- Configure node to allow CORS
- Use browser extension to bypass CORS (development only)

**For production:**
- Ensure nodes have proper CORS headers
- Use same domain for wallet and nodes
- Or use reverse proxy

## Advanced Network Configuration

### Port Forwarding

If running node on local network but accessing from outside:

1. **Configure Router:**
   - Forward ports 40400-40405
   - Point to local node IP

2. **Update Wallet:**
   - Use public IP instead of localhost
   - Example: `http://<your-public-ip>:40413`

3. **Security:**
   - Consider VPN instead of public exposure
   - Use firewall rules
   - Monitor for unauthorized access

### Reverse Proxy Setup

For production deployments, use reverse proxy:

**Nginx Example:**
```nginx
server {
    listen 80;
    server_name wallet.example.com;
    
    location /api/ {
        proxy_pass http://localhost:40413/;
        proxy_set_header Host $host;
    }
}
```

**Then connect wallet to:**
```
http://wallet.example.com/api/
```

### SSL/TLS Configuration

For secure connections:

1. **Get SSL certificate**
   - Use Let's Encrypt
   - Or commercial certificate

2. **Configure proxy with SSL**
   ```nginx
   server {
       listen 443 ssl;
       ssl_certificate /path/to/cert.pem;
       ssl_certificate_key /path/to/key.pem;
       ...
   }
   ```

3. **Update wallet URLs**
   ```
   https://secure.example.com
   ```

## Network Performance

### Monitoring Connection

Check connection quality:
- **Latency:** Response time for requests
- **Reliability:** Success rate of operations
- **Bandwidth:** Data transfer speed

### Optimizing Performance

**For Better Performance:**
1. Use observer node for read operations
2. Connect to geographically close nodes
3. Use wired connection over WiFi
4. Close unnecessary browser tabs

**Node-Side Optimization:**
1. Ensure adequate server resources
2. Use SSD storage
3. Optimize network settings
4. Monitor node performance

## Security Considerations

### Secure Connections

**Best Practices:**
- Use HTTPS for public networks
- Verify SSL certificates
- Don't connect to untrusted nodes
- Monitor for unusual activity

### Private Keys

**Network-Independent Security:**
- Private keys work across all networks
- But balances are network-specific
- Keep keys secure regardless of network
- Same key = same address on all networks

### Network Trust

**When Connecting to Custom Networks:**
- Only connect to networks you trust
- Verify node operators
- Understand network rules
- Be aware of risks

## Multi-Network Strategy

### Why Use Multiple Networks?

**Development Workflow:**
1. **DevNet:** Initial testing and learning
2. **Local:** Development and debugging
3. **Private:** Staging and integration testing
4. **Mainnet:** Production deployment (when available)

### Managing Multiple Networks

**Organization Tips:**
- Use descriptive network names
- Document network configurations
- Keep endpoint lists updated
- Test connections regularly

## Support

For network connection issues:

- **DevNet Problems:** Check [explorer status](https://explorer.dev.asichain.io)
- **Local Issues:** Review [validator setup guide](/quick-start/join-validator/)
- **Custom Networks:** Contact network administrator
- **General Help:** See [FAQ](/faq/)

---

**Network configurations are saved locally in your browser and persist across sessions.**
