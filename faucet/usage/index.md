# Faucet

The ASI:Chain Faucet sends test ASI to a wallet address on the DevNet. These tokens have no real value and are meant for testing transfers and contract deployments. Open it at [faucet.dev.asichain.io](https://faucet.dev.asichain.io).

::: warning Security Notice
The faucet never asks you to sign a transaction or to enter a seed phrase, a private key or a password. If a page asks for any of these, you are not on the official faucet.
:::

For the short path from a new wallet to a balance, see [Get DevNet ASI](/quick-start/get-asi/).

## Rules

- One request sends the amount shown on the page, supplied by the faucet API configuration.
- There is no waiting time between requests. You can ask again as soon as the previous request is finished.
- A request is refused when the balance of the address is above the configured eligibility limit.

The frontend reads `native_token_decimals`, `faucet_amount` and `eligibility_ceiling` from the API's `/config` endpoint. For ASI, operators set `FAUCET_TOKEN_DECIMALS=18` and the matching raw amount and eligibility limit. For example, 10,000 ASI is `10000000000000000000000` atomic units. See [Token Amounts](/reference/token-amounts/).

## Request Tokens

<Steps>

### Enter the Address

Paste your wallet address into the **Address** field. A DevNet address is 50 to 54 characters long and starts with `1111`.

As soon as the address is valid, the page loads its balance and shows it under **Address Balance**, next to the **FAUCET** button.

![The faucet page with the empty Address and TX status check fields.](/images/faucet/faucet-form.webp){width=1000 height=300}

### Request the Tokens

Press **FAUCET**. When the faucet accepts the request, the page shows `Tokens requested successfully.`, and the **TX status check** field on the right shows the `deploy_id` of the transfer. To follow an older request, paste its `deploy_id` into that field yourself.

If the balance is above the limit, the button stays disabled and the page shows `Your address is not eligible`.

### Follow the Status

The **TX status check** section shows the current status and `Next check in`, the seconds left until the next automatic check. The page checks the status every 30 seconds. When the status is `Finalized`, the page reloads the balance, which now includes the new tokens.

![The faucet with a filled address, the balance of 10000 ASI, the FAUCET button and the TX status check field showing Finalized.](/images/faucet/faucet-status.webp){width=1000 height=300}

If the transfer is still not finalized after 15 minutes, the page stops checking and shows `Polling stopped after 15 minutes.`. To start checking again, clear the field and paste the `deploy_id` back. The page also stops when the node returns an error status or when the status request fails.

</Steps>

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

### Your Address Is Not Eligible

The balance of the address is above the faucet's configured eligibility limit. Send some of it to another address or use a different address.

### The Balance Cannot Be Loaded

If the page shows `Unable to acquire address balance. Please try again…`, check the address for typos and try again. Copy the address from the wallet instead of typing it.

### The Status Stays at Deploying

The network may be busy. Wait for the next check. If the page has stopped checking, clear the field and paste the `deploy_id` back before you request tokens a second time, because every accepted request sends the configured amount again.

### The Balance Does Not Change

The balance updates when the status becomes `Finalized`. If it still shows the old value, reload the page and enter the address again. You can also open your account in the wallet at [wallet.dev.asichain.io](https://wallet.dev.asichain.io) or look up the transfer in the explorer at [explorer.dev.asichain.io](https://explorer.dev.asichain.io).

## Next Steps

<CardGrid columns="2">
<DocCard title="ASI Wallet" href="/wallet/usage/">Open your account at wallet.dev.asichain.io</DocCard>
<DocCard title="ASI Block Explorer" href="/explorer/usage/">Look up the transfer at explorer.dev.asichain.io</DocCard>
<DocCard title="Get DevNet ASI" href="/quick-start/get-asi/">The short path from a new wallet to a balance</DocCard>
<DocCard title="Faucet Source" href="https://github.com/asi-alliance/asi-chain-faucet">github.com/asi-alliance/asi-chain-faucet</DocCard>
</CardGrid>
