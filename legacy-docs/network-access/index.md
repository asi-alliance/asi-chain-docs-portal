# Network Access

This section provides addresses and endpoints required to access the ASI:Chain network.

## Block Explorer Address

You can browse the testnet using the public explorer:

**Explorer URL**:  
[https://explorer.dev.asichain.io](https://explorer.dev.asichain.io)

The explorer fetches live data from the network via an Observer Node.

## Bootstrap Node Endpoint

To connect a node to the testnet, use the following bootstrap address:

```text
rnode://e5e6faf012f36a30176d459ddc0db81435f6f1dc@54.152.57.201?protocol=40400&discovery=40404
```

Use this in your configuration or `--bootstrap` command line parameter.

## API Access

These ports are typically used by RNode:

- **gRPC External**: 40401
- **gRPC Internal**: 40402
- **HTTP API**: 40403
- **Admin HTTP**: 40405

HTTP API endpoints:
- `/status`
- `/deploy`
- `/blocks`
- `/query`
- WebSocket: `/ws`

For instructions on generating your own validator keypair, see [Address Generation](/legacy-docs/network-access/address-generation/).
