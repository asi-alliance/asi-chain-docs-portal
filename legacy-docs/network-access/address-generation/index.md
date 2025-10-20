# ASI Address Generation

This guide describes alternative methods to generate a wallet key pair required to run a validator or interact with the ASI:Chain network.

## Recommended Method: ASI Wallet

The easiest and recommended way to generate keys is through the ASI Wallet:

1. Visit [wallet.dev.asichain.io](https://wallet.dev.asichain.io)
2. Navigate to **Accounts** or **Generate Keys** page
3. Click **Generate New Keypair** or **Create Account**
4. Save your credentials:
   - Private Key (64 hex characters)
   - Public Key (130+ hex characters with '04' prefix)
   - ASI Address (50-54 characters starting with "1111")

> [!CAUTION]
> Keep your private key secure and never share it. There is no way to recover lost keys.

## Alternative: CLI Wallet Generator

For advanced users who need to generate keys programmatically, you can use the wallet generator tool from the repository:

### Steps:

1. Clone the repository:
```bash
git clone https://github.com/asi-alliance/asi-chain.git
cd asi-chain/wallet-generator
```

2. Build and run the tool following repository instructions

You will obtain:
- `PRIVATE_KEY`
- `PUBLIC_KEY`
- `ASI_ADDRESS`

## Using Generated Keys

### In Environment Variables (.env)

```env
VALIDATOR_PRIVATE_KEY=<YOUR_GENERATED_PRIVATE_KEY>
VALIDATOR_HOST=<YOUR_PUBLIC_IP>
```

### In Configuration File (validator.conf)

```hocon
casper {
  validator-public-key = <YOUR_GENERATED_PUBLIC_KEY>
  validator-private-key = <YOUR_GENERATED_PRIVATE_KEY>
}
```

## Security Best Practices

- **Never share** your private key with anyone
- **Store securely** offline in a safe location
- **Backup** your keys in multiple secure locations
- **Do not commit** keys to version control (add .env to .gitignore)

## Next Steps

Once you have generated your keys:

1. Get test tokens from the [Faucet](https://faucet.dev.asichain.io)
2. Configure your validator using [Validator Setup](/quick-start/join-validator/)
3. Connect to the network using the bootstrap node

---

**Recommended:** Use the [ASI Wallet](https://wallet.dev.asichain.io) for the simplest key generation experience.
