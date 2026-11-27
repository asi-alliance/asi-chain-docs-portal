# Run a Node

Take part in a shard as a validator or an observer, or start a shard of your own. All roles run the same Rust node image. The guides work with a shard that you run yourself or that another shard operator runs.

::: info Terminal
The commands are written for bash.

- On Linux run them in a terminal.
- On macOS run `bash` in a terminal first, because commands with `read -rsp` do not work in zsh.
- On Windows run them in a WSL terminal such as Ubuntu with the WSL integration of Docker Desktop turned on. Keep key files in the Linux home directory, not under `/mnt/c`, because the client refuses a key file that other users can read.
:::

## Choose a Role

<CardGrid columns="2">
<DocCard title="Run a Validator" href="/nodes/validator/">Create the key, start the node, fund it and submit the bond</DocCard>
<DocCard title="Run an Observer" href="/nodes/observer/">Follow the chain and answer read requests</DocCard>
<DocCard title="Set Up a Private Shard" href="/nodes/private-shard/">Start a shard with its own genesis, validators and network configuration</DocCard>
</CardGrid>

## Background

<CardGrid columns="2">
<DocCard title="Shard and Node Roles" href="/nodes/roles/">How peer connectivity, consensus, execution and state fit together in a shard</DocCard>
<DocCard title="Node Image" href="/nodes/image/">Select the image, check its settings and default container ports</DocCard>
<DocCard title="Container Images" href="/reference/container-images/">Image versions, digests and source revisions</DocCard>
<DocCard title="Troubleshooting" href="/help/troubleshooting/">What to check when a node does not connect or stays out of sync</DocCard>
</CardGrid>
