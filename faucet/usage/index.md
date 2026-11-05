# Faucet

The ASI:Chain Faucet sends test ASI to a wallet address on the DevNet. These tokens have no real value and are meant for testing transfers and contract deployments. Open it at [faucet.dev.asichain.io](https://faucet.dev.asichain.io).

::: warning Security notice
The faucet never asks you to sign a transaction or to enter a seed phrase, a private key or a password. If a page asks for any of these, you are not on the official faucet.
:::

For the short path from a new wallet to a balance, see [Get DevNet ASI](/quick-start/get-asi/).

## Rules

- One request sends 10,000 ASI.
- There is no waiting time between requests. You can ask again as soon as the previous request is finished.
- A request is refused when the balance of the address is above 20,000 ASI. Below that limit the FAUCET button works for any address.

The request amount and the limit are the defaults of the faucet server, and the web page has the limit built in as well. If an operator changes them, the actual values differ from the numbers above.

## Request Tokens

### Enter an Address

Paste your wallet address into the **Address** field. A DevNet address is 50 to 54 characters long and starts with `1111`.

As soon as the address is valid, the page loads its balance and shows it under **Address Balance**, next to the **FAUCET** button.

![Faucet Form](/images/faucet/faucet-form.png)

### Press FAUCET

Press **FAUCET**. The page shows `Tokens requested successfully.` once the faucet has accepted the request, and the **TX status check** field on the right fills in the `deploy_id` of the transfer. You can also paste a `deploy_id` into that field yourself to follow an older request.

If the balance is above the limit, the button stays disabled and the page shows `Your address is not eligible`.

### Follow the Status

The **TX status check** section shows the current status and `Next check in`, the seconds left until the next automatic check. The page checks the status every 30 seconds. When the status is `Finalized`, the page reloads the balance, which now includes the new tokens.

![Faucet Status](/images/faucet/faucet-status.png)

If the transfer is still not finalized after 15 minutes, the page stops checking and shows `Polling stopped after 15 minutes.`. To start checking again, clear the field and paste the `deploy_id` back. The page also stops when the node returns an error status or when the status request fails.

## Statuses

| Status | Meaning |
|--------|---------|
| `Deploying` | The transfer is being sent to the network. |
| `Finalizing` | The transfer is in a block and waits for finalization. |
| `Finalized` | The transfer is final and the tokens are on your address. |
| `FinalizationError` | The transfer could not be finalized. |
| `DeployError` | The transfer could not be sent. |
| `Unknown` | The status cannot be determined. |

`Finalizing` and `FinalizationError` are not reported by every faucet build. A build that omits them goes from `Deploying` straight to `Finalized`.

## Troubleshooting

### Your address is not eligible

The balance of the address is above 20,000 ASI. Send some of it to another address or use a different address.

### The Balance Cannot Be Loaded

If the page shows `Unable to acquire address balance. Please try again…`, check the address for typos and try again. Copy the address from the wallet instead of typing it.

### The Status Stays at Deploying

The network may be busy. Wait for the next check. If the page has stopped checking, clear the field and paste the `deploy_id` back before you request tokens a second time, because every request sends another 10,000 ASI.

### The Balance Does Not Change

The balance updates when the status becomes `Finalized`. If it still shows the old value, reload the page and enter the address again. You can also open your account in the wallet at [wallet.dev.asichain.io](https://wallet.dev.asichain.io) or look up the transfer in the explorer at [explorer.dev.asichain.io](https://explorer.dev.asichain.io).

## Links

- Documentation: [docs.asichain.io](https://docs.asichain.io)
- Wallet: [wallet.dev.asichain.io](https://wallet.dev.asichain.io)
- Explorer: [explorer.dev.asichain.io](https://explorer.dev.asichain.io)
- GitHub: [github.com/asi-alliance/asi-chain-faucet](https://github.com/asi-alliance/asi-chain-faucet)
