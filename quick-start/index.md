# Get Started

Pick the path that matches what you want to do. The wallet, faucet and explorer work with the public ASI:Chain DevNet, and DevNet tokens have no real value. If you are new here, read [What Is ASI:Chain](/overview/) first.

## Use the Network

You want an account, some test tokens and a way to see what happens on the chain.

<Steps>

### Create an Account

Open the [wallet](/wallet/usage/) and create an account. It gives you an ASI address that starts with `1111`.

### Request Test Tokens

Request test tokens for that address at the [faucet](/faucet/usage/). The step-by-step guide is in [how to get DevNet ASI](/quick-start/get-asi/).

### Follow Your Transfers

Follow your transfers and balances in the [explorer](/explorer/usage/).

</Steps>

## Run a Node

You want to take part in the network as an observer or a validator.

::: warning DevNet Runs the Scala Node
As of 5 November 2026 the public DevNet runs a Scala node, and the Rust node from these guides does not connect to it. Use the guides with a Rust shard that you or your operator run. [Documentation Status](/help/documentation-status/) has the details.
:::

- Look up the image versions and their source revisions in the [container images](/reference/container-images/) catalog.
- Start an [observer](/nodes/observer/) to follow the chain, or prepare a [validator](/nodes/validator/).
- To bond a validator, follow [validator enrollment](/nodes/validator-enrollment/).
- If a node does not connect or stays out of sync, see [troubleshooting](/help/troubleshooting/).

Public DevNet services are listed on [Network Endpoints](/reference/endpoints/). Ask the network operator for the bootstrap identity before you connect a node.

## Build on ASI:Chain

You want to write an application, a script or a contract.

- Read the [Wallet SDK overview](/wallet-sdk/overview/) and the [API reference](/wallet-sdk/api-reference/) to sign and send transactions from TypeScript.
- Use the [Wallet CLI](/cli/usage/) to create wallets and send tokens from a terminal. The CLI is built for the Rust node API, and against the Scala node of the public DevNet only `create` works as of 5 November 2026.
- Look at the [architecture](/architecture/) pages to see how the node, indexer, GraphQL API and applications fit together.

## Next Steps

<CardGrid columns="2">
<DocCard title="What Is ASI:Chain" href="/overview/" icon="book">Components, networks and the token</DocCard>
<DocCard title="Get DevNet ASI" href="/quick-start/get-asi/" icon="faucet">Get an address and request tokens from the faucet</DocCard>
<DocCard title="Network Endpoints" href="/reference/endpoints/" icon="endpoints">Public DevNet services</DocCard>
<DocCard title="Documentation Status" href="/help/documentation-status/" icon="status">Known limits of these pages</DocCard>
</CardGrid>
