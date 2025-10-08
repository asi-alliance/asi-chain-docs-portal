# ASI Block Explorer

A modern, real-time blockchain explorer for the ASI Chain network providing comprehensive insights into blocks, transactions, validators, and network statistics.

**Access the explorer**: [explorer.dev.asichain.io](https://explorer.dev.asichain.io)

## Key Features

### Real-Time Monitoring
- **Live Updates**: Automatic updates via WebSocket connection
- **Connected Status**: Real-time connection indicator in header
- **Block Tracking**: Instant notifications of new blocks
- **Transaction Feed**: Live activity stream of deployments and transfers

### Comprehensive Search
- **Universal Search**: Search blocks, transactions, and addresses
- **Advanced Filters**: Filter by type, status, and date range
- **Quick Access**: Search bar available on every page

### Network Insights
- **Block Explorer**: Detailed block information with transaction details
- **Transaction Viewer**: Comprehensive deployment and transfer data
- **Validator Dashboard**: Active validator monitoring with stake distribution
- **Network Statistics**: Performance metrics and health monitoring

## Getting Started

### Navigation

The explorer provides five main sections accessible from the top navigation bar:

- **Blocks**: Main dashboard with recent blocks and live activity
- **Transactions**: Smart contract deployments and token transfers
- **Validators**: Active validator information and stake distribution
- **Statistics**: Network performance metrics and analytics
- **Indexer**: Indexer synchronization status

### Connection Status

The header displays a real-time connection indicator:
- **Green indicator with "Connected"**: Explorer is receiving live updates
- **Real-time updates active**: Shows connection status

## Blocks Page

The [Blocks page](https://explorer.dev.asichain.io/) is the main dashboard showing network overview and recent blocks.

### Network Summary

Four key metrics displayed at the top:

**Latest Block**: Current block number (e.g., 31019)

**Active Validators**: Number of validators currently validating (3)

**Avg Block Time**: Average time between blocks (20.0s)

**Network Status**: Overall network health (Active/Inactive)

### Live Activity Feed

Real-time feed showing recent network events:

**Block Proposals**:
- Block number
- Proposing validator (abbreviated public key)
- Number of deployments in block
- Time since block creation

**Deployments**:
- Deployer address (abbreviated)
- Contract type (e.g., smart_contract)
- Time since deployment

**Transfers**:
- Transfer amount in ASI
- Sender and recipient addresses (abbreviated)
- Time since transfer

### Recent Blocks Table

Comprehensive table of recent blocks:

**Columns**:
- **Block**: Block number (clickable link to block details)
- **Hash**: Block hash (abbreviated, clickable)
- **Validator**: Proposing validator's public key (abbreviated)
- **Time**: Relative time since block creation
- **Status**: Confirmation status (✓ Confirmed)

**Features**:
- Search by block number or hash
- Live Updates indicator
- Pagination controls at bottom
- 20 blocks per page
- Shows "Showing 1-20 of X blocks" counter

## Transactions Page

The [Transactions page](https://explorer.dev.asichain.io/transactions) displays all smart contract deployments and token transfers.

### Transaction Statistics

Three summary cards at the top:

**Deployments**: Total number of contract deployments (31041)

**Transfers**: Total number of token transfers (18)

**Total**: Combined total transactions (31059)

### Transaction Types

Tab navigation to filter transactions:

**Deployments Tab** (default):
- Shows all smart contract deployments
- Displays deployer address
- Shows block number and timestamp
- Status indicator (confirmed/pending)

**Transfers Tab**:
- Shows all token transfers
- Displays amount transferred
- Shows sender and recipient addresses
- Timestamp and status

### Transaction Cards

Each transaction displays:
- **Type Badge**: DEPLOY (orange) or TRANSFER (blue)
- **Summary**: "Deploy by [address]" or "Transfer: [amount] ASI"
- **Details**: Block number and relative time
- **Status Icon**: Green checkmark for confirmed transactions

**Features**:
- Search by ID, address, or block hash
- Filter by type (Deployments/Transfers)
- Pagination controls
- 10 transactions per page selector
- "Page X of Y" navigation

## Validators Page

The [Validators page](https://explorer.dev.asichain.io/validators) shows all active validators and their stake information.

### Validator Summary

Three key metrics:

**Total Validators**: Number of active validators (3)

**Total ASI Staked**: Combined stake across all validators (30,000,000,000,000.00 ASI)

**Avg. Stake**: Average stake per validator (10,000,000,000,000.00 ASI)

### Active Validators Table

Comprehensive validator information:

**Table Columns**:
- **Public Key**: Validator's full public key (abbreviated display)
- **Stake (ASI)**: Amount of ASI staked (e.g., 10000000.00M)
- **Stake %**: Percentage of total network stake (33.33% each)
- **Blocks Proposed**: Number of blocks proposed by validator
- **First Seen**: Block number when validator first appeared (#0)
- **Last Seen**: Block number of most recent activity (#30833)
- **Last Active**: Block number of last validation (#30833)
- **Status**: Current status (active)

**Features**:
- Live Updates indicator
- "View History" button for historical validator data
- Color-coded status (green for active)
- Sortable columns

## Statistics Page

The [Statistics page](https://explorer.dev.asichain.io/statistics) provides comprehensive network performance metrics and analytics.

### Time Range Selector

Choose data timeframe:
- **1h**: Last hour
- **6h**: Last 6 hours
- **24h**: Last 24 hours (default)
- **7d**: Last 7 days

### Network Health Overview

Overall health status with key metrics:

**Status Indicator**: Displays current health (Excellent, Good, Fair, Poor)

**Health Metrics**:
- **Block Time**: Average time between blocks (20.0s)
- **Finality Time**: Time to finalize transactions (40.0s)
- **Validator Uptime**: Validator availability percentage (100.0%)
- **Network Latency**: Average network response time (150.0ms)

### Network Metrics Cards

Six detailed metric cards with trend indicators:

**Block Time**:
- Current average: 20.0s
- Description: Average time between blocks
- Trend indicator (up/down arrow with percentage)
- Mini sparkline graph

**Transactions/sec**:
- Current rate: 0.01 TPS
- Description: Network throughput
- Trend indicator
- Mini sparkline graph

**Active Validators**:
- Current count: 3
- Description: Currently validating nodes
- Trend indicator
- Mini sparkline graph

**Network Health**:
- Current status: 100%
- Description: Overall network performance
- Trend indicator

**Total Stake**:
- Current amount: 3,000 ASI
- Description: Total staked tokens
- Trend indicator

**Latest Block**:
- Current block: #31021
- Description: Most recent block
- Trend indicator

### Performance Charts

Two interactive charts showing historical data:

**Performance Metrics Chart**:
- Line graph with two metrics
- **Block Time** (green line): Shows block production speed over time
- **TPS** (blue line): Shows transaction throughput over time
- X-axis: Time (hourly intervals)
- Y-axis: Dual axes for different metrics
- Hover for detailed values

**Network Activity Chart**:
- Line graph with two metrics
- **Deployments** (green line): Smart contract deployments over time
- **Transfers** (blue line): Token transfers over time
- X-axis: Time (hourly intervals)
- Legend at bottom

## Indexer Status Page

The [Indexer Status page](https://explorer.dev.asichain.io/indexer-status) displays the synchronization status of the blockchain indexer.

### Sync Status Indicator

Shows current synchronization state:
- **Green indicator**: Synced
- **Status text**: "Synced" when up to date

### Sync Progress Overview

Four key metrics:

**Sync Progress**:
- Percentage complete: 100.00%
- Visual progress bar (green when fully synced)

**Last Indexed Block**:
- Block number: #30833
- Blocks behind: 0 blocks behind

**Highest Block**:
- Latest block on network: #30833

**Last Update**:
- Time of last sync: "about 1 hour ago"

### Indexer Status Table

Detailed status information:

**Table Rows**:
- **Last Indexed Block**: Shows block number (#30833)
- **Highest Block**: Shows highest known block (#30833)
- **Sync Status**: Current state (Synced in green)

**Status Colors**:
- Green: Synced (up to date)
- Yellow: Syncing (catching up)
- Red: Out of sync (behind)

## Search Functionality

The universal search bar is available in the header on all pages.

### Search Features

**Search Types**:
- Block numbers (e.g., "31019")
- Block hashes
- Transaction IDs
- Validator addresses
- User addresses

**Search Interface**:
- Placeholder text: "Search blocks, transfers, addresses..."
- Advanced Filters button (funnel icon)
- Clear button (X icon)

**Advanced Filters**:
Click the funnel icon to access additional filters:
- Filter by transaction type
- Date range selection
- Status filtering

## Understanding the Data

### Block Information

**Block Number**: Sequential identifier starting from genesis block (#0)

**Block Hash**: Unique cryptographic hash identifying the block

**Validator**: Public key of the validator who proposed the block

**Timestamp**: When the block was created (shown as relative time)

**Status**: Confirmation status (Confirmed/Pending)

### Transaction Information

**Deployment Transactions**:
- Smart contract deployments to the network
- Identified by "DEPLOY" badge
- Shows deployer address and contract type

**Transfer Transactions**:
- ASI token transfers between addresses
- Identified by "TRANSFER" badge
- Shows amount, sender, and recipient

**Transaction Status**:
- ✓ Confirmed: Transaction included in finalized block
- Pending: Transaction waiting for confirmation

### Validator Information

**Validator Public Key**: Unique identifier for validator node (130+ characters)

**Stake**: Amount of ASI tokens locked by validator

**Stake Percentage**: Validator's portion of total network stake

**Blocks Proposed**: Total number of blocks proposed by validator

**Status**: Current operational status (active/inactive)

## Network Connection

### Connection Indicator

Located in the top-right header:

**Connected Status**:
- Green circle with checkmark
- Text: "Connected"
- Subtitle: "Real-time updates active"

**Connection Issues**:
If you see connection problems:
- Refresh the page
- Check your internet connection
- Verify the explorer service is running

### Real-Time Updates

When connected:
- New blocks appear automatically
- Live activity feed updates instantly
- No manual refresh needed
- Statistics update continuously

## Tips for Using the Explorer

### Efficient Navigation

**Keyboard Shortcuts**:
- Focus search: Click search bar or use Ctrl/Cmd + K
- Clear search: Click X button or press Escape

**Bookmarking**:
- Bookmark specific blocks: `https://explorer.dev.asichain.io/block/[number]`
- Bookmark transactions: `https://explorer.dev.asichain.io/transaction/[id]`

### Data Interpretation

**Block Times**:
- Average block time: ~20 seconds
- Consistent block times indicate healthy network
- Large variations may indicate network issues

**Validator Distribution**:
- Stake percentage shows validator influence
- Equal distribution (33.33% each) indicates balanced network
- Monitor for centralization risks

**Transaction Activity**:
- Deployments indicate smart contract activity
- Transfers show token movement
- High activity suggests active network usage

## Troubleshooting

### Common Issues

**No Data Showing**:
- Check connection indicator in header
- Refresh the page
- Verify internet connection
- Check if indexer is running (Indexer Status page)

**Slow Updates**:
- Slow internet connection may delay updates
- Heavy network load can cause delays
- Check Network Statistics for performance issues

**Search Not Working**:
- Verify search term format (block numbers, hashes, addresses)
- Try removing filters and searching again
- Ensure you're on the correct network

**Charts Not Displaying**:
- Ensure JavaScript is enabled
- Try a different browser
- Clear browser cache

### Performance Tips

**For Best Performance**:
- Use a modern browser (Chrome, Firefox, Safari, Edge)
- Enable JavaScript
- Stable internet connection recommended for real-time updates
- Close unnecessary browser tabs if experiencing slowness

## Support Resources

- **Documentation**: [docs.asichain.io](https://docs.asichain.io)
- **Wallet**: [wallet.dev.asichain.io](https://wallet.dev.asichain.io)
- **Network Indexer**: [indexer.dev.asichain.io](https://indexer.dev.asichain.io)
- **Faucet**: [faucet.dev.asichain.io](https://faucet.dev.asichain.io)

## Additional Features

### Block Details Page

Click any block number to view detailed information:
- Complete block hash
- Full validator public key
- All transactions in block
- Block metadata
- Parent block reference

### Transaction Details Page

Click any transaction to view:
- Complete transaction ID
- Full deployer/sender/recipient addresses
- Transaction code or data
- Gas costs and phlo details
- Block inclusion information



---

**Note**: The explorer is updated in real-time as new blocks are produced on the ASI Chain network. Data shown is pulled directly from the blockchain and reflects the current state of the network.
