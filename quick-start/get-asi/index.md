# How Can I Get DevNet ASI?

Get test ASI tokens for development and testing on the ASI:Chain DevNet.

## About DevNet Tokens

**DevNet ASI tokens** are test tokens used exclusively for:
- Testing transactions
- Deploying smart contracts
- Experimenting with the network
- Learning how the blockchain works

> [!IMPORTANT]
> **DevNet tokens have NO real value.** They are for testing purposes only and cannot be exchanged for real currency.

## Using the Faucet

The easiest way to get DevNet ASI tokens is through the faucet.

### Access the Faucet

**URL:** [faucet.dev.asichain.io](https://faucet.dev.asichain.io)

### Step-by-Step Guide

#### Step 1: Get Your ASI Address

You need an ASI address to receive tokens. Get one by:

**Option A: Create Account in Wallet**
1. Visit [wallet.dev.asichain.io](https://wallet.dev.asichain.io)
2. Go to **Accounts** page
3. Click **Create Account**
4. Your ASI address will be displayed
5. Click to copy your address

**Option B: Generate Keys**
1. Visit [wallet.dev.asichain.io/#/keys](https://wallet.dev.asichain.io/#/keys)
2. Click **Generate New Keypair**
3. Copy the **ASI Address** (starts with "1111")

#### Step 2: Request Tokens

1. Navigate to [faucet.dev.asichain.io](https://faucet.dev.asichain.io)
2. In the **Address** field, paste your ASI address
3. Verify your address is correct (50-54 characters, starts with "1111")
4. Click the **FAUCET** button

#### Step 3: Wait for Confirmation

The faucet will process your request:

**Transaction Status:**
- **Deploying** - Transaction is being processed
- **Finalizing** - Network is confirming your transaction
- **Finalized** - Tokens successfully sent

**Status Updates:**
The page shows "Next check in: X sec" for automatic status updates.

#### Step 4: Verify Receipt

Check your balance:

**In the Wallet:**
1. Go to [wallet.dev.asichain.io](https://wallet.dev.asichain.io)
2. View your **Dashboard**
3. Your balance should show the received tokens

**In the Faucet:**
The faucet page displays your current balance after the transaction completes.

## Transaction Statuses

| Status | Description | Action |
|--------|-------------|--------|
| **Deploying** | Transaction being broadcast | Wait... |
| **Finalizing** | Network confirming | Wait... |
| **Finalized** | Successfully completed | Check balance |
| **Finalization Error** | Error during confirmation | Try again |
| **Deploy Error** | Error during deployment | Try again |
| **Unknown** | Status cannot be determined | Check explorer |

## Troubleshooting

### "Address is not eligible"

**Possible reasons:**
- You requested tokens recently (cooldown period)
- Invalid address format
- Address already received maximum amount

**Solutions:**
- Wait before requesting again
- Verify your address is correct
- Check if you already have tokens

### Transaction Stuck in "Deploying"

**This usually means:**
- Network is busy
- High transaction volume

**What to do:**
1. Wait a few minutes
2. Check status again
3. If still stuck after 10 minutes, try requesting again

### Balance Not Updating

**Possible reasons:**
- Transaction still confirming
- Browser cache issue
- Network delay

**Solutions:**
1. Wait 1-2 minutes
2. Refresh the page
3. Check [Block Explorer](https://explorer.dev.asichain.io) for your transaction
4. Clear browser cache

### "Invalid Address Format"

**Your address must:**
- Be 50-54 characters long
- Start with "1111"
- Contain only valid characters

**Solution:**
Copy your address directly from the wallet to avoid typos.

## Limits and Restrictions

### Request Limits

- **Cooldown Period:** You can request tokens once per period
- **Amount per Request:** Fixed amount per request
- **Maximum Balance:** May be limited per address

### Eligibility

The faucet is available to:
- All developers and testers
- New accounts
- Existing accounts (subject to limits)

## Security Notice

::: warning IMPORTANT
**The faucet NEVER asks for:**
- Your private key
- Seed phrase
- Transaction signatures
- Password

**If you see such a request, you are on a fake site!**

Always verify you're on the official faucet:
**[https://faucet.dev.asichain.io](https://faucet.dev.asichain.io)**
:::

## After Getting Tokens

Once you have tokens, you can:

### 1. Transfer Tokens

Send tokens to other addresses:
1. Open [Wallet](https://wallet.dev.asichain.io)
2. Go to **Send** page
3. Enter recipient address and amount
4. Confirm transaction

### 2. Deploy Smart Contracts

Use your tokens to deploy contracts:
1. Go to **Deploy** or **IDE** page in wallet
2. Write your Rholang contract
3. Click **Deploy**
4. Tokens will be used for transaction fees

### 3. Explore the Network

See your tokens in action:
1. Visit [Block Explorer](https://explorer.dev.asichain.io)
2. Search for your address
3. View transaction history

## Need More Tokens?

If you've used up your tokens:

### Request Again

Wait for the cooldown period to end, then request more tokens from the faucet.

### Best Practices

To make your tokens last:
- Test with small amounts first
- Use the IDE's **Explore** (read-only) mode when possible
- Plan your transactions carefully

## Alternative Methods

### For Validators

If you're running a validator, you can earn tokens by:
- Participating in consensus
- Proposing blocks
- Validating transactions

See [Join DevNet as Validator](/quick-start/join-validator/) for details.

## Support

### Having Issues?

1. **Check Status:** Visit the faucet and check your transaction status
2. **Verify Address:** Make sure your address is correct
3. **Clear Cache:** Try clearing your browser cache
4. **FAQ:** Check the [FAQ section](/faq/) for common issues

### Still Need Help?

- Review [Troubleshooting Guide](/quick-start/troubleshooting/)
- Check [GitHub Issues](https://github.com/asi-alliance/asi-chain)
- Visit [Block Explorer](https://explorer.dev.asichain.io) to verify network status

## Next Steps

Now that you have tokens:

- **Learn Smart Contracts** - Try deploying your first contract
- **Explore the Wallet** - Familiarize yourself with all features
- **Join as Validator** - Consider running your own validator node
- **Build Applications** - Start building on ASI:Chain

---

**Remember:** DevNet tokens are for testing only. Experiment freely and learn.
