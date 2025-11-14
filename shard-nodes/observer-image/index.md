# Observer Node Image

Technical documentation for the ASI:Chain observer node Docker image and configuration.

## Overview

Observer nodes use the same Docker image as validators but are configured for read-only operation. They synchronize with the blockchain without participating in consensus.

## Official Docker Image

```bash
public.ecr.aws/f6y9h6x4/asi-chain/node:latest
```

Same image as validators, different configuration.

## Purpose of Observer Nodes

Observer nodes provide:
- **Read Access** - Query blockchain data without validation
- **API Services** - Power external applications
- **Monitoring** - Track network activity
- **Data Distribution** - Reduce load on validators

**Key Difference from Validators:**
- No consensus participation
- No block signing
- No staking required
- Read-only operation

## Public Observer Access

ASI:Chain provides a public observer node:

**HTTP Endpoint:**
```
http://54.152.57.201:40453
```

**gRPC Endpoint:**
```
54.152.57.201:40451
```

Use these for:
- Application development
- Data queries
- Network monitoring
- Testing integrations

## Running Your Own Observer

### Configuration Example

**docker-compose.yml:**
```yaml
version: '3.9'
services:
  observer:
    image: public.ecr.aws/f6y9h6x4/asi-chain/node:latest
    container_name: observer
    ports:
      - "40450:40450"  # Protocol server
      - "40451:40451"  # Public gRPC API
      - "40452:40452"  # Internal gRPC API
      - "40453:40453"  # HTTP API
      - "40454:40454"  # Kademlia discovery
      - "40455:40455"  # Admin HTTP API
    volumes:
      - ./data/observer:/var/lib/rnode/
      - ./conf/observer.conf:/var/lib/rnode/rnode.conf
    environment:
      - OBSERVER_HOST=${OBSERVER_HOST}
    command:
      - "--bootstrap=rnode://e5e6faf012f36a30176d459ddc0db81435f6f1dc@54.152.57.201?protocol=40400&discovery=40404"
    restart: unless-stopped
```

### Observer Configuration

**observer.conf:**
```hocon
api-server {
  host = ${?OBSERVER_HOST}
  port = 40453
  port-grpc-external = 40451
  port-grpc-internal = 40452
  port-http = 40453
  port-kademlia = 40454
  enable-reporting = true
}

# No casper configuration needed for observer
# Observer doesn't validate or sign blocks

tls {
  certificate-path = "node.certificate.pem"
  key-path = "node.key.pem"
}
```

**.env file:**
```env
OBSERVER_HOST=<YOUR-PUBLIC-IP>
```

## System Requirements

### Minimum Specifications

- **CPU:** 2 cores
- **RAM:** 8 GB  
- **Storage:** 250+ GB
- **Network:** Stable connection

### Recommended Specifications

- **CPU:** 4 cores
- **RAM:** 16 GB
- **Storage:** 500+ GB SSD
- **Network:** 100+ Mbps

**Note:** Observer nodes require fewer resources than validators since they don't participate in consensus.

## API Endpoints

Observer nodes provide full API access:

### HTTP API

**Status:**
```bash
curl http://localhost:40453/status
```

**Blocks:**
```bash
curl http://localhost:40453/blocks
```

**Explore Deploy:**
```bash
curl -X POST http://localhost:40453/explore-deploy \
  -H 'Content-Type: application/json' \
  -d '{"term": "..."}'
```

### gRPC API

**List services:**
```bash
grpcurl -plaintext localhost:40451 list
```

## Use Cases

### 1. Block Explorers

Connect explorer frontend to observer:
```javascript
const API_URL = 'http://54.152.57.201:40453';
fetch(`${API_URL}/blocks`)
  .then(res => res.json())
  .then(data => console.log(data));
```

### 2. Application Backends

Query blockchain state:
```bash
curl -X POST http://localhost:40453/explore-deploy \
  -H 'Content-Type: application/json' \
  -d '{"term": "new stdout(`rho:io:stdout`) in { stdout!(\"data\") }"}'
```

### 3. Monitoring Services

Track network metrics:
```bash
# Check status every minute
watch -n 60 'curl -s http://localhost:40453/status'
```

### 4. Data Indexing

Build custom indexes:
```python
import requests

def index_blocks():
    response = requests.get('http://54.152.57.201:40453/blocks')
    blocks = response.json()
    # Process and index blocks
    for block in blocks:
        store_in_database(block)
```

## Running the Observer

### Start Observer

```bash
docker compose -f observer.yml up -d
```

### Monitor Logs

```bash
docker logs observer -f
```

### Verify Synchronization

Look for these log messages:
```
observer | Approved state for block Block #0 restored
observer | Received ForkChoiceTipRequest
observer | Sending tips [...]
observer | Peers: 4
```

## Monitoring

### Health Checks

**Container status:**
```bash
docker ps | grep observer
```

**Resource usage:**
```bash
docker stats observer
```

**Sync status:**
```bash
curl http://localhost:40453/status | jq '.syncStatus'
```

### Performance Metrics

Monitor:
- CPU usage
- Memory consumption
- Disk I/O
- Network bandwidth
- Block sync rate

## Troubleshooting

### Synchronization Issues

**Reset and resync:**
```bash
docker compose -f observer.yml down
rm -rf data/observer
docker compose -f observer.yml up -d
```

### Connection Problems

**Check bootstrap connectivity:**
```bash
ping 54.152.57.201
telnet 54.152.57.201 40400
```

**Verify firewall:**
```bash
sudo ufw status
sudo ufw allow 40450:40455/tcp
```

### API Not Responding

**Check if observer is running:**
```bash
docker ps | grep observer
```

**Check logs for errors:**
```bash
docker logs observer --tail 100
```

**Test API:**
```bash
curl -v http://localhost:40453/status
```

## Security Considerations

### Public Access

If exposing observer publicly:
- Use reverse proxy (nginx)
- Implement rate limiting
- Add authentication if needed
- Monitor for abuse

### Firewall Configuration

**Allow necessary ports:**
```bash
sudo ufw allow 40450:40455/tcp
sudo ufw enable
```

**Or restrict to specific IPs:**
```bash
sudo ufw allow from <trusted-ip> to any port 40453
```

## Updates

### Update Observer Node

```bash
docker compose -f observer.yml down
docker pull public.ecr.aws/f6y9h6x4/asi-chain/node:latest
docker compose -f observer.yml up -d
```

### Backup Configuration

Backup these files:
- `conf/observer.conf`
- `.env`
- Custom scripts or configs

Blockchain data can be re-synced from the network.

## Comparison: Observer vs Validator

| Feature | Observer | Validator |
|---------|----------|-----------|
| Consensus | No | Yes |
| Block Signing | No | Yes |
| Read Access | Yes | Yes |
| Write Access | No | Yes |
| Staking Required | No | Yes (mainnet) |
| Resource Needs | Lower | Higher |
| Purpose | Querying | Validation |

## Advanced Configuration

### Custom Ports

Change port mapping in docker-compose.yml:
```yaml
ports:
  - "8080:40453"  # Map HTTP API to port 8080
```

### Resource Limits

```yaml
deploy:
  resources:
    limits:
      cpus: '2.0'
      memory: 8G
    reservations:
      cpus: '1.0'
      memory: 4G
```

### Logging

```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

## Support

For observer node issues:

- [DevNet Structure](/shard-nodes/devnet-structure/)
- [Useful Links](/general/useful-links/)
- [FAQ](/faq/)
- [GitHub](https://github.com/asi-alliance/asi-chain)

---

**Observer nodes are perfect for applications that need read access without validation responsibilities.**
