# Get DevNet ASI

DevNet ASI is a test token for trying out transfers and contract deployments on the ASI:Chain DevNet. Four steps take you from a new wallet to a balance.

::: warning DevNet Tokens Have No Value
DevNet ASI exists for testing only and cannot be exchanged for real currency.
:::

## Get Your Tokens

<Steps>

### Get an Address

Open [wallet.dev.asichain.io](https://wallet.dev.asichain.io), create a wallet or import one, and copy the ASI address of your account. The address starts with `1111`. The [ASI Wallet](/wallet/usage/) page describes each screen.

### Request Tokens

Open [faucet.dev.asichain.io](https://faucet.dev.asichain.io), paste the address into the **Address** field and press **FAUCET**. The faucet sends the amount set in its configuration and refuses an address whose balance is equal to or above its eligibility limit.

### Wait for the Finalized Status

The **TX status check** section shows the status of the transfer and refreshes it every 30 seconds. Wait for `Finalized`. If you see another status or an error, the [Faucet](/faucet/usage/) page explains each one.

### Check the Balance

The faucet shows the new balance under **Address Balance**, and the wallet shows it on its **Wallet** page.

</Steps>

## Next Steps

<CardGrid columns="2">
<DocCard title="ASI Wallet" href="/wallet/usage/">Send tokens and deploy a contract</DocCard>
<DocCard title="ASI Block Explorer" href="/explorer/usage/">Look up your transactions at explorer.dev.asichain.io</DocCard>
</CardGrid>
