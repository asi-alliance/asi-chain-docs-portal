# Troubleshooting

Start with the image digest, source revision, configuration and host mappings. The runtime is Rust; JVM tuning and former configurator/connector commands do not apply.

## Image pull or startup fails

Use a digest from [container images](/general/container-images/) and `--platform linux/amd64`. Check Docker connectivity and disk capacity. Do not silently substitute another build for a missing ARM image.

For your own container, inspect:

```bash
docker inspect validator --format '{{.Config.Image}}'
docker port validator
docker logs --tail 100 validator
```

Replace `validator` with its actual name. Check configuration paths and permissions for the image user. Keep keys and TLS private material out of shared diagnostics.

## No peer connection

Confirm the operator-provided bootstrap identity/host and TCP peer ports. Discovery uses TCP `40404` for the documented Rust revision. Do not open all API/admin ports to fix P2P connectivity.

Check DNS, routing, advertised host and firewall policy on both ends. TCP connectivity alone does not establish the correct shard, synchronization or finalization.

## API unavailable

Compare the endpoint with the host mapping and gateway base path. HTTP may use a different host port from container default `40403`.

```bash
curl --fail --show-error http://127.0.0.1:40403/api/ready
```

This example is for a locally mapped management endpoint. A `503` during initialization is different from a transport failure. Public gateways may intentionally omit this route.

Keep internal gRPC `40402`, admin HTTP `40405` and `/metrics` private. Do not disable TLS or expose privileged listeners as a diagnostic shortcut.

## CLI or indexer response mismatch

Confirm the consumer source and client gitlink. Images do not inherit later merges. The [catalog](/general/container-images/) identifies client/CLI artifacts; [CLI configuration](/cli/usage/#configuration) uses explicit URLs.

Check the selected node's HTTP/Protobuf contract before changing a consumer. Cost-accounting APIs and newer integer/transfer representations require compatible clients and separate acceptance checks.

## Slow sync or uncertain transfer result

Compare peer progress, readiness and canonical finalization separately. Retain the original deploy ID when a transfer outcome is unknown; investigate before sending again. A timeout is not proof that payment failed.

Back up state and private inputs before an operator-reviewed recovery. Deleting chain data or running Docker-wide prune commands is not a routine troubleshooting step.

## Reporting a problem

Open an issue in the affected [public component repository](/general/useful-links/). Include digest, public source revision, sanitized error and reproduction steps. Include no keys, real environment files, credentials or internal endpoints.
