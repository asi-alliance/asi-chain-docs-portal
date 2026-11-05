# Get DevNet ASI

DevNet ASI is a test token for trying out transfers and contract deployments on the ASI:Chain DevNet. Four steps take you from a new wallet to a balance.

::: warning DevNet Tokens Have No Value
They exist for testing only and cannot be exchanged for real currency.
:::

## Get Your Tokens

<Steps>

### Get an Address

Open [wallet.dev.asichain.io](https://wallet.dev.asichain.io), create a wallet or import one, and copy the ASI address of your account. The address starts with `1111`. [Wallet Usage](/wallet/usage/) describes each screen.

### Request Tokens

Open [faucet.dev.asichain.io](https://faucet.dev.asichain.io), paste the address into the **Address** field and press **FAUCET**. The faucet sends 10,000 ASI to an address whose balance is not above 20,000 ASI.

### Wait for the Finalized Status

The **TX status check** section shows the status of the transfer and refreshes it every 30 seconds. Wait for `Finalized`. [Faucet Usage](/faucet/usage/) lists all statuses and error messages.

### Check the Balance

The faucet shows the new balance under **Address Balance**, and the wallet shows it on its **Wallet** page.

</Steps>

## Next Steps

With a balance, you can send tokens on the wallet's **Send** page, deploy a contract on its **Deploy** page, or look up your transactions in the explorer at [explorer.dev.asichain.io](https://explorer.dev.asichain.io).

<CardGrid columns="2">
<DocCard title="ASI Wallet" href="/wallet/usage/" icon="wallet">Send tokens and deploy a contract</DocCard>
<DocCard title="Block Explorer" href="/explorer/usage/" icon="explorer">Look up your transactions</DocCard>
</CardGrid>
