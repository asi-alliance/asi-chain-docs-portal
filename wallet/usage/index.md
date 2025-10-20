# ASI Wallet

A modern, secure, and fully decentralized wallet for the ASI Chain network with an integrated Rholang IDE and enhanced deployment tracking.

**Access the wallet**: [wallet.dev.asichain.io](https://wallet.dev.asichain.io)

## Key Features

### 100% Client-Side Architecture
- **No Backend Required**: Runs entirely in your browser
- **Direct Blockchain Connection**: Peer-to-peer connection to ASI Chain nodes
- **Local Encrypted Storage**: All data encrypted with AES-256 in browser
- **Offline Capable**: PWA with service worker support

### Advanced Account Management
- **Multi-Account Support**: Create and manage multiple accounts
- **Quick Account Switcher**: Fast account switching with real-time balance updates
- **Import Options**: Private key, ETH address, or ASI address
- **Watch-Only Accounts**: Monitor addresses without private keys
- **Encrypted Export**: Backup accounts with password protection

### Enhanced Transaction Features
- **QR Code Support**: Scan or paste QR codes for recipient addresses
- **Smart Routing**: Automatic node selection for operations
- **Real-Time Status**: Track deployment inclusion in blocks
- **Gas Optimization**: Accurate gas cost estimation
- **Transaction History**: Comprehensive local transaction log with export
- **Auto-Refresh**: Transaction history updates every 30 seconds

### Integrated Development Environment
- **Monaco Editor**: Professional code editor with Rholang support
- **Syntax Highlighting**: Custom Rholang language support
- **File Management**: Create, edit, and organize contracts in folders
- **Example Contracts**: Pre-loaded examples to get started quickly
- **Direct Deployment**: Deploy contracts with confirmation dialogs
- **Workspace Import/Export**: Share complete workspaces
- **Console Output**: Real-time deployment feedback

### Modern User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Themes**: Toggle between themes
- **Real-Time Updates**: Live balance and status updates
- **Intuitive Navigation**: Clean, modern interface

## Getting Started

### Step 1: Create or Import Your Account

1. Navigate to the [Accounts page](https://wallet.dev.asichain.io/#/accounts)
2. **Create New Account**:
   - Enter an account name (maximum 30 characters)
   - Click "Create Account" button
   - The wallet will generate a secure private key automatically
   - Your account will appear in the account list with "UNLOCKED" status
3. **Or Import Existing Account**:
   - Enter an account name (maximum 30 characters)
   - Select import type from dropdown:
     - **Private Key**: Full account access with transaction capabilities
     - **Ethereum Address (Watch Only)**: Monitor-only mode
     - **ASI Address (Watch Only)**: Monitor-only mode
   - Enter the corresponding value
   - Click "Import Account"
   - Your account will be added to the wallet

**Security Note**: Keep your private key secure and never share it with anyone. The wallet uses AES-256-GCM encryption to protect your keys locally.

### Step 2: Configure the Network

After creating or importing your account, configure the network connection to ASI Chain Devnet.

#### Devnet Configuration

Navigate to [Settings page](https://wallet.dev.asichain.io/#/settings) and verify the Devnet configuration.

The Devnet configuration should be:

**Validator Node (for transactions)**:
- Host: `54.152.57.201`
- gRPC Port: `40401`
- HTTP Port: `40413`

**Observer Node (read-only operations)**:
- Host: `54.152.57.201`
- gRPC Port: `40451`
- HTTP Port: `40453`

The wallet automatically routes operations to the appropriate node:
- Write operations (transfers, deployments) use the Validator node
- Read operations (balance checks, queries) use the Observer node

**Network Settings Persistence**: Your network configurations are automatically saved and will persist across browser sessions.

**Editing Configuration**: Click "Edit Configuration" button to modify network settings if needed.

For the complete list of available nodes and their endpoints, see [Network Nodes documentation](/network-configuration/network-nodes/).

### Step 3: Request Test Tokens

Before you can perform transactions on the network, you'll need test tokens.

Visit the [ASI Chain Faucet](https://faucet.dev.asichain.io) and request tokens for your wallet address.

## Using Your Wallet

### Dashboard

The [Dashboard](https://wallet.dev.asichain.io/#/dashboard) provides an overview of your account:

**Account Information**:
- Current balance (displayed prominently)
- Refresh Balance button
- Account name
- ASI Address (click to copy)
- ETH Address (click to copy)
- Network name
- Last update timestamp

**Quick Actions**:
- Send ASI
- Receive ASI
- Manage Accounts
- Deploy Contract
- IDE
- Transaction History

**Network Status**:
- Current network name
- Connection status
- Last update time

### Send Tokens

The [Send page](https://wallet.dev.asichain.io/#/send) allows you to transfer ASI tokens:

**Sending Process**:
1. **Enter Recipient Address**:
   - Type or paste the ASI address in the input field
   - Use the camera button to scan a QR code
   - Use the "Paste" button to paste a QR code image from clipboard
   - Tip: You can copy a QR code image and paste it directly in the field

2. **Enter Amount**:
   - Type the amount of ASI to send
   - Click "Max" button to send maximum available balance
   - Available balance is displayed above

3. **Review and Send**:
   - Click "Send Transaction" button
   - Confirm the transaction details
   - Wait for transaction confirmation

**Features**:
- Real-time balance display
- QR code scanning for recipient address
- Maximum amount button
- Transaction confirmation dialog

### Receive Tokens

The [Receive page](https://wallet.dev.asichain.io/#/receive) displays your address for receiving tokens:

**Address Display**:
- Toggle between "ASI Address" and "ETH Address" tabs
- Full address text (click to copy)
- QR code for easy scanning
- "Copy Address" button
- "Download QR Code" button to save QR code image

**Important Notes**:
- Only send ASI tokens to the ASI Address
- The ETH address is for compatibility - mainly for address derivation
- Always double-check the address before sending
- Verify you're on the correct network

### Transaction History

The [History page](https://wallet.dev.asichain.io/#/history) shows all your transactions:

**Features**:
- **Auto-Refresh**: Updates every 30 seconds automatically
- **Manual Refresh**: Click "Refresh Status" button
- **Export Options**:
  - Export JSON: Download history in JSON format
  - Export CSV: Download history in CSV format
- **Clear History**: Remove all transaction records from local storage

**Filters**:
- **Type Filter**: All Types, Send, Deploy
- **Status Filter**: All Status, Pending, Confirmed, Failed

**Statistics**:
- Total Transactions count
- Sent transactions count
- Deployments count

**Transaction Details**:
Each transaction shows:
- Type (Send/Deploy)
- Status (Pending/Confirmed/Failed)
- Amount (for transfers)
- Recipient address
- Timestamp
- Block information (when confirmed)

### Deploy Contracts

The [Deploy page](https://wallet.dev.asichain.io/#/deploy) provides a simple interface for deploying Rholang contracts:

**Deployment Process**:
1. **Enter Rholang Code**:
   - Type or paste your contract in the textarea
   - Click "Load Example" to load a sample contract
   - Click "Clear" to empty the editor

2. **Configure Parameters**:
   - **Phlo Limit**: Maximum computational resources (default: 100000000)
   - **Phlo Price**: Price per unit of computation (default: 1)

3. **Deploy**:
   - Click "Back" to return to dashboard
   - Click "Explore (Read-only)" to test without deploying
   - Click "Deploy" to deploy the contract to the network

**Default Example Contract**:
```rholang
new stdout(`rho:io:stdout`), deployerId(`rho:rchain:deployerId`) in {
  stdout!("Hello from ASI Wallet!") |
  deployerId!("Deploy successful")
}
```

### Integrated Development Environment (IDE)

The [IDE page](https://wallet.dev.asichain.io/#/ide) provides a full-featured development environment:

**Interface Layout**:
- **Left Sidebar**: File tree and workspace management
- **Center**: Monaco code editor
- **Bottom**: Console output

**File Management**:
- **New File** button: Create a new Rholang file
- **New Folder** button: Create a new folder
- **Import File** button: Import `.rho` files from your computer
- **File Tree**: Organize files in folders (Examples, Contracts)
- **Default Files**: Includes `hello.rho` example in Examples folder

**Workspace Management**:
- **Export Workspace**: Save entire workspace as JSON file
- **Import Workspace**: Load previously exported workspace

**Editor Features**:
- Monaco Editor with Rholang syntax highlighting
- Line numbers
- Code folding
- Multiple file support with tabs
- Close button on each tab

**Deployment Controls**:
- **Phlo Limit** input: Set computational resource limit
- **Phlo Price** input: Set computation price
- **Explore** button: Test code in read-only mode
- **Deploy** button: Deploy current file to network

**Console**:
- Real-time deployment output
- Transaction status messages
- Error messages and debugging info
- "Clear" button to clear console

**Example File** (`hello.rho`):
```rholang
new stdout(`rho:io:stdout`), deployerId(`rho:rchain:deployerId`) in {
  stdout!("Hello from ASI Wallet!") |
  deployerId!("Deploy successful")
}
```

## Account Management

### Account List

On the [Accounts page](https://wallet.dev.asichain.io/#/accounts), each account shows:
- Account name (customizable)
- Shortened ASI address
- Current balance
- Status badges: "SELECTED" (active account), "UNLOCKED" (accessible)
- Action buttons: "Export", "Remove"

### Account Actions

**Refresh Balances**: Click button to update all account balances

**Export Account**: 
- Click "Export" button on account card
- Save encrypted account data

**Remove Account**:
- Click "Remove" button on account card
- Confirm deletion (cannot be undone)

**Select Account**:
- Click on any account card to make it active
- Balance and history automatically update

### Quick Account Switcher

Access the account switcher from the header:
- Click on the account dropdown button in the header
- Shows: account name, shortened address, balance
- Select different account from dropdown
- No re-authentication required

## Generate Keys

The [Generate Keys page](https://wallet.dev.asichain.io/#/keys) provides cryptographic key generation for validator setup:

### Generate New Keypair

**Process**:
1. Click "Generate New Keypair" button
2. System creates a new random keypair
3. Save all displayed credentials:
   - Private Key (64 hex characters)
   - Public Key (130+ hex characters with '04' prefix)
   - Ethereum Address (with '0x' prefix)
   - ASI Address (50-54 characters starting with '1111')

### Import Private Key

**Process**:
1. Enter your 64-character hexadecimal private key in the input field
2. Click "Import" button
3. System derives and displays:
   - Public Key
   - Ethereum Address
   - ASI Address

**About Keys**:
- The ETH address is compatible with MetaMask and all Ethereum wallets
- The ASI Address is specific to the ASI Chain network
- Save your private key securely - it cannot be recovered if lost

## Network Settings

The [Settings page](https://wallet.dev.asichain.io/#/settings) manages network configurations.

The wallet supports two network configurations:

### Devnet Configuration

**Devnet** is the primary network for development and testing:

**Validator Node (for transactions)**:
- Host: `54.152.57.201`
- gRPC Port: `40401`
- HTTP Port: `40413`
- HTTP URL: `http://54.152.57.201:40413`

**Observer Node (read-only operations)**:
- Host: `54.152.57.201`
- gRPC Port: `40451`
- HTTP Port: `40453`
- HTTP URL: `http://54.152.57.201:40453`

**Actions**:
- "Edit Configuration" button: Modify Devnet settings
- Settings are disabled when not in edit mode

### Local Network Configuration

**Local Network** is for local development and testing with your own node:

**Configuration**:
- Validator URL: `http://localhost:40413`
- Observer URL: `http://localhost:40453`
- Admin URL: `http://localhost:40405`

**Actions**:
- "Edit Network" button to modify settings

### Private Keys Management

View and manage private keys for all accounts:

**Features**:
- List of all accounts with names and shortened addresses
- "View Private Key" button for each account
- Password protection for viewing private keys
- Warning about keeping keys safe

## Security Features

### Encryption
- **AES-256-GCM**: Military-grade encryption for private keys
- **PBKDF2**: Key derivation with 100,000 iterations
- **Random Salt/IV**: Unique per encryption operation
- **Memory Cleanup**: Keys cleared after use

### Access Control
- **Password Protection**: Required for sensitive operations
- **Session Timeout**: Automatic lock after 15 minutes of inactivity
- **No Recovery**: Lost passwords cannot be recovered
- **Local Storage Only**: No cloud backup or recovery

### Network Security
- **HTTPS Only**: All connections encrypted in production
- **Direct Connection**: No proxy servers or intermediaries
- **CORS Protection**: Prevent cross-origin attacks

## Troubleshooting

### Common Issues

**Blank Screen or Loading Issues**:
- Verify JavaScript is enabled in browser
- Clear browser cache and reload page
- Check browser console for errors
- Ensure using a modern browser (Chrome, Firefox, Safari, Edge)

**Network Connection Errors**:
- Verify node URLs are correct in Settings
- Ensure validator node is running and accessible
- Check network connectivity
- Verify firewall settings

**Transaction Failures**:
- Ensure sufficient balance for transaction and gas fees
- Verify recipient address format is correct
- Check phlo limit is adequate for operation
- Confirm network is not congested

**Account Import Problems**:
- Verify private key format (64 hex characters, no prefix)
- Remove any extra spaces or characters
- Check if account already exists in wallet
- Try creating new account instead

**QR Code Scanning Issues**:
- Allow camera permissions in browser
- Ensure good lighting for QR code
- Try pasting QR code image instead
- Verify QR code contains valid ASI address

### Support Resources

- **Documentation**: [docs.asichain.io](https://docs.asichain.io)
- **Block Explorer**: [explorer.dev.asichain.io](https://explorer.dev.asichain.io)
- **Network Indexer**: [indexer.dev.asichain.io](https://indexer.dev.asichain.io)
- **Faucet**: [faucet.dev.asichain.io](https://faucet.dev.asichain.io)

## Next Steps

After setting up your wallet:

1. **Request test tokens** from the [Faucet](https://faucet.dev.asichain.io)
2. **Explore the network** via [Block Explorer](https://explorer.dev.asichain.io)
3. **Try smart contract deployment** using the Deploy page or IDE
4. **Configure validator node** if running network infrastructure (see [Validator Node Setup](/node-image/validator/))

## Important Security Reminders

**Your Keys, Your Responsibility**:
- This is a decentralized wallet with no backend
- You control your keys and data
- No recovery mechanism for lost passwords or keys
- No customer support for lost access

**Best Practices**:
- Never share your private key with anyone
- Always backup your keys securely offline
- Use strong, unique passwords
- Verify all transaction details before confirming
- Keep your browser updated
- Be cautious of phishing attempts

**Data Privacy**:
- All data stored locally in your browser
- No telemetry or tracking
- No cloud synchronization
- Full control over your information

---

**Remember**: With decentralized wallets, you have complete control and complete responsibility. There is no central authority to recover lost keys or reverse transactions. Always maintain secure backups and follow security best practices.
