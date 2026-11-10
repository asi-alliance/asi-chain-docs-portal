# ASI Wallet

ASI Wallet is a browser wallet for ASI:Chain. It has no backend of its own: it keeps your keys in the browser, signs transactions locally and talks directly to the network nodes and the indexer. A Rholang editor for deploying contracts is built in.

The DevNet wallet is at [wallet.dev.asichain.io](https://wallet.dev.asichain.io). It connects to DevNet out of the box, so there is nothing to configure. Node and service addresses are listed on [Network Endpoints](/reference/endpoints/), and connecting the wallet to your own node is described in [Custom Network Connection](/wallet/custom-network/).

::: warning Back Up Your Recovery Phrase
The wallet shows the recovery phrase once, when the wallet is created. Anyone who has it can control your accounts, and if you lose both the phrase and the browser data you lose access for good. Write the phrase down, keep it offline, and never put it in a screenshot or a text file.
:::

## Create a Wallet

The first time you open the wallet it shows the **Welcome** screen with **Create your first wallet**. The **Account Type** switch chooses between an HD wallet and a private key wallet. An HD wallet is built from one 12- or 24-word recovery phrase and can hold any number of accounts. A private key wallet is built from a single key and holds exactly one account.

![The Welcome screen with the Create your first wallet card, the Account Type switch and a hint about wallet types.](/images/wallet/accounts-create.light.webp){.light-only width=753 height=701}
![The Welcome screen with the Create your first wallet card, the Account Type switch and a hint about wallet types.](/images/wallet/accounts-create.dark.webp){.dark-only width=753 height=701}

To create an HD wallet, follow these steps.

<Steps>

### Start Setup

Click **Create Wallet**.

### Name the Account

Enter an account name of up to 30 characters and choose a phrase length, 12 or 24 words.

### Save the Phrase

Click **Show**, write the phrase down and click **I've Saved My Phrase**.

### Set a Password

Set a wallet password and confirm it. The password needs at least 8 characters, with one uppercase letter, one lowercase letter, one number and one special character.

### Finish Setup

Click **Continue**. The wallet opens on the **Accounts** page with your first account.

</Steps>

To use an existing wallet, click **Import Wallet** and enter the recovery phrase, or click **Import Wallet from keyfile** and pick a keyfile exported earlier with **Export Keyfile**. A single private key is imported from the **Accounts** page with **Import Private Key**. It becomes its own wallet, with its own password.

The wallet asks for the password every time you open it in a browser that already holds a wallet (**Unlock Wallet**, then **Unlock**). **Logout** in the header locks the wallet again.

## Get Test Tokens

Copy your address from **Accounts** or **Receive**, then request tokens from the ASI:Chain Faucet at [faucet.dev.asichain.io](https://faucet.dev.asichain.io). [Get DevNet ASI](/quick-start/get-asi/) walks through it, and the [Faucet](/faucet/usage/) page explains the statuses and errors. The balance shows up in the wallet after the transfer is finalized.

## Wallet

The **Wallet** page is the dashboard. It shows the selected account, its balance and its ASI address, with **Send** and **Receive** buttons below. The header shows the same account with a shortened address and its balance, and the **DevNet** indicator next to it shows whether the wallet is connected to the network.

![The Wallet page with the selected account, its balance and address, and the Send and Receive buttons.](/images/wallet/dashboard.light.webp){.light-only width=900 height=592}
![The Wallet page with the selected account, its balance and address, and the Send and Receive buttons.](/images/wallet/dashboard.dark.webp){.dark-only width=900 height=592}

The menu has these pages: **Wallet**, **Send**, **Bridge**, **Receive**, **Accounts**, **Transactions**, **Deploy** and **Network Settings**.

## Send

Open **Send** to transfer ASI.

<Steps>

### Pick the Account

Pick the **Account** to send from.

### Enter the Recipient

Enter the **Recipient Address**. You can type it, paste it, or paste an image of a QR code from the clipboard.

### Enter the Amount

Enter the **Amount**, or click **Max** to send the balance minus the estimated fee.

::: info Token Decimals
The wallet counts ASI with 8 decimals, as DevNet does. TestNet is planned with 18 decimals and will need a new wallet release. See [Token Amounts](/reference/token-amounts/).
:::

### Send the Transfer

Click **Send**.

</Steps>

**Clear all** empties the form.

![The Send ASI page with the account selector, the balance and the Recipient Address field.](/images/wallet/send-page.light.webp){.light-only width=648 height=631}
![The Send ASI page with the account selector, the balance and the Recipient Address field.](/images/wallet/send-page.dark.webp){.dark-only width=648 height=631}

Before anything is sent, the wallet shows **Confirm Transaction** with the sending account and address, the recipient, the amount, the estimated commission and the total cost. A transfer cannot be reversed. After **Confirm & Send** the unlocked wallet signs the transfer without asking for the password again. It then shows **Transaction pending** with the deploy ID until the transfer is finalized.

![The Confirm Transaction dialog with the sender, recipient, amount, commission and total cost.](/images/wallet/send-confirmation.light.webp){.light-only width=548 height=721}
![The Confirm Transaction dialog with the sender, recipient, amount, commission and total cost.](/images/wallet/send-confirmation.dark.webp){.dark-only width=548 height=721}

The transfer then appears in **Transactions**.

## Receive

**Receive** shows the address of the selected account. The only **Address Format** is **ASI**.

- **Copy ASI Address** puts the address on the clipboard.
- **Show QR Code** displays the address as a QR code, and **Download QR** saves it as an image.

![The Receive Tokens page with the account and address format selectors, the ASI address with a copy icon and the Show QR Code control.](/images/wallet/receive.light.webp){.light-only width=648 height=791}
![The Receive Tokens page with the account and address format selectors, the ASI address with a copy icon and the Show QR Code control.](/images/wallet/receive.dark.webp){.dark-only width=648 height=791}

::: tip Check the Network
Send only ASI tokens to this address, and check that the wallet is on the right network (the page names it, for example DevNet) before you share the address.
:::

## Transactions

**Transactions** lists the transactions of the selected account and refreshes itself every 30 seconds. The history comes from the indexer.

Each row has a date, a type (**Send**, **Receive** or **Deploy**), a status (**Pending**, **Completed** or **Failed**), the sender (**From**), the recipient (**To**), the amount and a **Details** value. The **Export** button under the list is inactive in this version of the wallet.

![The Transactions page with the account selector, the column filters and one Send and one Receive row.](/images/wallet/history.light.webp){.light-only width=1026 height=349}
![The Transactions page with the account selector, the column filters and one Send and one Receive row.](/images/wallet/history.dark.webp){.dark-only width=1026 height=349}

The column headers open filters: a time range (the last hour up to the last 180 days, or custom dates), the type, the status, the sender, the recipient and an amount range. **Clear Filter** removes them all.

## Deploy

**Deploy** sends Rholang code to the network. The **Mode** switch at the top has two settings.

### Lite Mode

Lite mode is a single code field with the **Phlo Limit** (100000000 by default) and the **Phlo Price** (1, fixed by the network and read-only).

- **Load Example** fills the field with a sample contract.
- **Explore** runs the code read-only, without a deploy.
- **Deploy** sends the code to the network.
- **Clear** empties the field.

The sample contract is:

```rholang
new stdout(`rho:io:stdout`), deployerId(`rho:rchain:deployerId`) in {
  stdout!("Hello from ASI Wallet!") |
  deployerId!("Deploy successful")
}
```

![The Deploy Rholang Contract page in Lite mode with the Phlo Limit and Phlo Price fields, the Load Example button and the Rholang code field.](/images/wallet/deploy-page.light.webp){.light-only width=900 height=906}
![The Deploy Rholang Contract page in Lite mode with the Phlo Limit and Phlo Price fields, the Load Example button and the Rholang code field.](/images/wallet/deploy-page.dark.webp){.dark-only width=900 height=906}

**Deploy** and **Explore** first open a confirmation dialog. For a deploy it shows the account, the length of the code, the phlo limit and price, the estimated cost and the code itself, with a warning that the deployment will consume gas (the dialog's word for phlo) and cannot be reversed. **Deploy Contract** then asks for the wallet password.

![The Confirm Deployment dialog with the account, code length, phlo limit and price, and estimated cost.](/images/wallet/deploy-confirmation.light.webp){.light-only width=648 height=823}
![The Confirm Deployment dialog with the account, code length, phlo limit and price, and estimated cost.](/images/wallet/deploy-confirmation.dark.webp){.dark-only width=648 height=823}

### Pro Mode

Pro mode replaces the single field with an editor. A file panel on the left holds your files and a folder of **Examples**, the editor opens files in tabs, and the **Console** under it prints the result of **Explore** and **Deploy**. **Import Workspace** and **Export Workspace** load and save the whole file tree. The phlo fields and the **Load Example**, **Deploy**, **Explore** and **Clear** buttons work as in Lite mode.

## Accounts

**Accounts** shows the wallet and its accounts.

![The Your Wallet section with the Main account and its Savings sub-account, each with its balance and address, above the import and export buttons.](/images/wallet/accounts-list.light.webp){.light-only width=900 height=1031}
![The Your Wallet section with the Main account and its Savings sub-account, each with its balance and address, above the import and export buttons.](/images/wallet/accounts-list.dark.webp){.dark-only width=900 height=1031}

- **Refresh Balances** reloads the balances.
- The **Edit** button next to an account name renames the account.
- **Create Account** derives a new account from the recovery phrase of an HD wallet. A private key wallet has no such button.
- **Import Wallet**, **Import Private Key** and **Import Wallet from keyfile** add another wallet.
- **Export Keyfile**, in **Wallet backup**, saves the wallet to a keyfile that **Import Wallet from keyfile** can read back.
- **Delete Wallet** removes the wallet and all its accounts from this browser. Restoring it needs the recovery phrase or the private key.

The account selector in the header switches the active account on every page.

## Network Settings

DevNet is built into the wallet, so it does not appear on this page and cannot be edited. **Network Settings** is for networks of your own. The form **Custom Network Configuration** takes a **Network Name**, a **Node API Profile** (the node type the network runs), and the **Validator URL**, **Read-only URL** and **Indexer URL**. All three addresses are required, and **Save Custom Network** reports every field that is empty or invalid. Saved networks are listed under **Existing Custom Networks**.

![The Network Settings page with the Custom Network Configuration form.](/images/wallet/settings-network.light.webp){.light-only width=648 height=1011}
![The Network Settings page with the Custom Network Configuration form.](/images/wallet/settings-network.dark.webp){.dark-only width=648 height=1011}

[Custom Network Connection](/wallet/custom-network/) describes the form field by field, with examples for a local node.

## Bridge

**Bridge** is the form for transfers from ASI:Chain to an EVM network. On DevNet it offers **ASI Chain** as the source and **Sepolia** as the destination. You pick the account and the **Amount** (up to 8 decimal places), connect an EVM wallet with **Connect EVM Wallet**, enter the **ETH recipient address** and start with **Lock on ASI Chain**.

## Next Steps

<CardGrid columns="2">
<DocCard title="Get DevNet ASI" href="/quick-start/get-asi/">Request test tokens for your address</DocCard>
<DocCard title="Custom Network Connection" href="/wallet/custom-network/">Connect the wallet to your own node</DocCard>
<DocCard title="ASI Block Explorer" href="/explorer/usage/">Look up blocks and transactions</DocCard>
<DocCard title="Wallet Source" href="https://github.com/asi-alliance/asi-chain-wallet">github.com/asi-alliance/asi-chain-wallet</DocCard>
</CardGrid>

The block explorer is at [explorer.dev.asichain.io](https://explorer.dev.asichain.io).
