# Validator Node Image

Technical documentation for the ASI:Chain validator node Docker image and configuration.

## Official Docker Image

ASI:Chain validators use the official Docker image hosted on AWS ECR:

```bash
533793137436.dkr.ecr.us-east-1.amazonaws.com/asi-chain/node:latest
```

This image contains:
- RNode implementation (F1R3FLY-based)
- Rholang execution environment
- Consensus engine (CBC Casper)
- Network communication protocols
- API servers (gRPC, HTTP, WebSocket)

## Image Contents

### Core Components

**RNode Binary:**
- Located at `/opt/docker/bin/rnode`
- Main blockchain node executable
- Handles all node operations

**Configuration:**
- Default config at `/var/lib/rnode/rnode.conf`
- Can be overridden via volume mounts
- Environment variables supported

**Data Directory:**
- `/var/lib/rnode/` - Main data directory
- Stores blockchain data
- Keeps node state
- Contains generated certificates

### Included Libraries

- Scala runtime
- JVM (Java Virtual Machine)
- Cryptographic libraries
- Network protocols
- Storage backends

## Using the Image

### Pull the Image

```bash
docker pull 533793137436.dkr.ecr.us-east-1.amazonaws.com/asi-chain/node:latest
```

### Basic Container Run

```bash
docker run -d \
  --name validator \
  -p 40400:40400 \
  -v ./data:/var/lib/rnode/ \
  -v ./conf/validator.conf:/var/lib/rnode/rnode.conf \
  533793137436.dkr.ecr.us-east-1.amazonaws.com/asi-chain/node:latest \
  --bootstrap=rnode://e5e6faf012f36a30176d459ddc0db81435f6f1dc@54.152.57.201?protocol=40400&discovery=40404
```

### With Docker Compose

Recommended approach using `docker-compose.yml`:

```yaml
version: '3.9'
services:
  validator:
    image: 533793137436.dkr.ecr.us-east-1.amazonaws.com/asi-chain/node:latest
    container_name: validator
    ports:
      - "40400:40400"  # Protocol server
      - "40401:40401"  # Public gRPC API
      - "40402:40402"  # Internal gRPC API
      - "40403:40403"  # HTTP API
      - "40404:40404"  # Kademlia discovery
      - "40405:40405"  # Admin HTTP API
    volumes:
      - ./data:/var/lib/rnode/
      - ./conf/validator.conf:/var/lib/rnode/rnode.conf
    environment:
      - VALIDATOR_PRIVATE_KEY=${VALIDATOR_PRIVATE_KEY}
      - VALIDATOR_HOST=${VALIDATOR_HOST}
    command:
      - "--bootstrap=rnode://e5e6faf012f36a30176d459ddc0db81435f6f1dc@54.152.57.201?protocol=40400&discovery=40404"
    restart: unless-stopped
```

## Configuration

### Required Configuration Files

**1. validator.conf** - Node configuration

```hocon
api-server {
  host = ${?VALIDATOR_HOST}
  port = 40403
  port-grpc-external = 40401
  port-grpc-internal = 40402
  port-http = 40403
  port-kademlia = 40404
  enable-reporting = true
}

casper {
  validator-public-key = "<YOUR-PUBLIC-KEY>"
  validator-private-key = "<YOUR-PRIVATE-KEY>"
  fault-tolerance-threshold = 0.99
}

tls {
  certificate-path = "node.certificate.pem"
  key-path = "node.key.pem"
}
```

**2. .env** - Environment variables

```env
VALIDATOR_PRIVATE_KEY=<YOUR-PRIVATE-KEY>
VALIDATOR_HOST=<YOUR-PUBLIC-IP>
```

### Volume Mounts

**Required volumes:**

```yaml
volumes:
  - ./data:/var/lib/rnode/              # Blockchain data
  - ./conf/validator.conf:/var/lib/rnode/rnode.conf  # Configuration
```

**Optional volumes:**

```yaml
  - ./conf/validator.certificate.pem:/var/lib/rnode/node.certificate.pem
  - ./conf/validator.key.pem:/var/lib/rnode/node.key.pem
  - ./conf/logback.xml:/var/lib/rnode/logback.xml
```

> **Note:** If certificates are not provided, RNode will auto-generate them on first run.

### Port Mapping

All ports must be exposed for proper operation:

| Container Port | Host Port | Purpose |
|----------------|-----------|---------|
| 40400 | 40400 | Protocol server |
| 40401 | 40401 | Public gRPC API |
| 40402 | 40402 | Internal gRPC API |
| 40403 | 40403 | HTTP API |
| 40404 | 40404 | Peer discovery |
| 40405 | 40405 | Admin interface |

## Command-Line Arguments

### Bootstrap Connection

```bash
--bootstrap=rnode://e5e6faf012f36a30176d459ddc0db81435f6f1dc@54.152.57.201?protocol=40400&discovery=40404
```

This connects your validator to the network via the bootstrap node.

### Common Arguments

```bash
--host <ip>                    # Public IP address
--data-dir <path>              # Data directory path
--config-file <path>           # Configuration file path
--port <number>                # Protocol port
--standalone                   # Run without bootstrap (genesis only)
```

## Resource Requirements

### Minimum Specifications

- **CPU:** 4 cores
- **RAM:** 16 GB
- **Storage:** 250+ GB SSD
- **Network:** 100 Mbps, low latency

### Recommended Specifications

- **CPU:** 8 cores
- **RAM:** 32 GB
- **Storage:** 500+ GB SSD
- **Network:** 1 Gbps, dedicated

### Storage Considerations

**Growth Rate:**
- Blockchain data grows continuously
- Rate depends on network activity
- Plan for long-term storage needs

**Performance:**
- SSD strongly recommended
- Fast I/O critical for validator performance
- IOPS matter more than sequential speed

## Running the Validator

### Start Container

```bash
docker compose -f validator.yml up -d
```

### View Logs

```bash
docker logs validator -f
```

### Stop Container

```bash
docker compose -f validator.yml down
```

### Restart Container

```bash
docker compose -f validator.yml restart
```

## Monitoring

### Health Checks

**Container status:**
```bash
docker ps -a
```

**Resource usage:**
```bash
docker stats validator
```

**Logs:**
```bash
docker logs validator --tail 100 -f
```

### API Endpoints

**Status check:**
```bash
curl http://localhost:40403/status
```

**Peer count:**
Check logs for: `Peers: X`

**Block height:**
```bash
curl http://localhost:40403/blocks | jq '.[0].blockNumber'
```

## Troubleshooting

### Container Won't Start

**Check Docker logs:**
```bash
docker logs validator
```

**Common issues:**
- Port conflicts
- Missing configuration
- Invalid private key
- Insufficient resources

### Connection Issues

**Verify bootstrap:**
```bash
ping 54.152.57.201
telnet 54.152.57.201 40400
```

**Check firewall:**
```bash
sudo ufw status
```

### Synchronization Problems

**Reset blockchain data:**
```bash
docker compose -f validator.yml down
rm -rf data/
docker compose -f validator.yml up -d
```

## Updates and Maintenance

### Update Image

```bash
docker compose -f validator.yml down
docker pull 533793137436.dkr.ecr.us-east-1.amazonaws.com/asi-chain/node:latest
docker compose -f validator.yml up -d
```

### Backup Data

**Important files to backup:**
- `conf/validator.conf` - Configuration
- `.env` - Environment variables
- Private keys (store securely offline)

**Blockchain data:**
- Can be re-synced from network
- Not critical to backup
- But saves time on recovery

### Log Management

**Rotate logs:**
```bash
docker compose -f validator.yml logs --tail=1000 > validator.log
```

**Limit log size in compose:**
```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

## Security Best Practices

### Key Management

- Never commit private keys to git
- Store keys in `.env` file (add to `.gitignore`)
- Use strong key generation methods
- Backup keys securely offline

### Network Security

- Use firewall to restrict access
- Only expose necessary ports
- Consider VPN for admin access
- Monitor for unusual activity

### Container Security

- Run as non-root user (if possible)
- Limit container resources
- Regular security updates
- Monitor container logs

## Advanced Configuration

### Custom Network

For private networks:

```bash
docker run ... \
  --standalone \
  --genesis-validator \
  --validator-private-key <key> \
  --validator-public-key <key>
```

### Performance Tuning

**JVM options:**
```yaml
environment:
  - JAVA_OPTS=-Xms8g -Xmx16g
```

**Network buffers:**
```hocon
api-server {
  max-message-size = 268435456  # 256 MB
}
```

## Support

For issues with the validator image:

- [GitHub Repository](https://github.com/asi-alliance/asi-chain)
- [Docker Hub](https://hub.docker.com/) (if public)
- [Setup Guide](/quick-start/join-validator/)
- [FAQ](/faq/)

---

**This image is for ASI:Chain DevNet. Always use the latest version for best compatibility.**
