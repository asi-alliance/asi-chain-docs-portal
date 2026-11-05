# Run a Node

Take part in the network as an observer or a validator. Both roles run the same Rust node image.

::: warning DevNet Runs the Scala Node
As of 5 November 2026 the public DevNet runs a Scala node, and the Rust node from these guides does not connect to it. Use the guides with a Rust shard that you or your operator run. [Documentation Status](/help/documentation-status/) has the details.
:::

## Choose a Role

<CardGrid columns="2">
<DocCard title="Run an Observer" href="/nodes/observer/" icon="observer">Follow the chain and answer read requests</DocCard>
<DocCard title="Run a Validator" href="/nodes/validator/" icon="validator">Prepare a Rust node that is meant to become a validator</DocCard>
<DocCard title="Enroll a Validator" href="/nodes/validator-enrollment/" icon="key">Create the identity, fund the validator and submit the bond</DocCard>
<DocCard title="Set Up a Private Shard" href="/nodes/private-shard/" icon="shard">Start a shard with its own genesis, validators and network configuration</DocCard>
</CardGrid>

## Background

<CardGrid columns="2">
<DocCard title="Shard and Node Roles" href="/nodes/roles/" icon="diagram">How peer connectivity, consensus, execution and state fit together in a shard</DocCard>
<DocCard title="Node Image" href="/nodes/image/" icon="image">Select the image, check its settings and default container ports</DocCard>
<DocCard title="Container Images" href="/reference/container-images/" icon="book">Image versions, digests and source revisions</DocCard>
<DocCard title="Troubleshooting" href="/help/troubleshooting/" icon="help">What to check when a node does not connect or stays out of sync</DocCard>
</CardGrid>
