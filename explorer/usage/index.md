# ASI Block Explorer

The explorer shows blocks, transactions, validators and network statistics for the ASI:Chain DevNet. Open it at [explorer.dev.asichain.io](https://explorer.dev.asichain.io).

::: tip Live Updates
New blocks appear without reloading the page. A green check icon in the header shows that the live connection is up.
:::

## Navigation

The menu under the header has five sections: **Blocks**, **Transactions**, **Validators**, **Statistics** and **Indexer**. The search box in the header works on every page.

## Blocks

The **Blocks** page is the start page.

The four cards at the top show the latest block number, the number of active validators, the average block time and the network status. Next to them, **Live Activity** lists new blocks, deployments and transfers as they arrive.

Under the cards, the **Recent Blocks** table lists the newest blocks with their number, abbreviated hash, abbreviated validator key and age. The number is a link to the block details. The **Status** column shows a check mark and **Confirmed**, because the explorer lists only blocks that the indexer has already stored. The search field above the table filters it by block number or hash.

![The Blocks page with the summary cards, Live Activity and the Recent Blocks table.](/images/explorer/blocks-page.webp){width=976 height=974}

## Block Details

Click a block number to open the details page. The top of the page repeats the block number, proposer, age and status. Below it, the **Block Details** list shows these fields:

- block hash, parent hash, state hash, state root hash and pre-state hash
- proposer public key
- timestamp and finalization status
- version, sequence number, shard ID and fault tolerance
- deployment count

The **Advanced Information** section holds the block signature and its algorithm, the validator bonds map with the stake of every validator at that block, and the block justifications. At the bottom, **Transactions / Deployments** lists the deployments included in the block, each with its status, deploy ID and deployer.

## Transactions

The **Transactions** page lists deployments and token transfers on two tabs, **Deployments** and **Transfers**. Every row has a type badge (DEPLOY or TRANSFER), a short description, the block number and the age. The field above the list searches by ID, address or block hash.

Click a deployment to open the transaction details. The header of that page has a button that downloads the transaction as JSON.

![The Transactions page with the Deployments and Transfers tabs and a list of rows.](/images/explorer/transactions-page.webp){width=976 height=668}

## Transaction Details

The details page has four tabs: **Overview**, **Code**, **Transfers** and **Block Info**.

The **Overview** tab shows the transaction ID, deployer, type and timestamp. Under **Execution Details** it lists the phlo cost, phlo price, phlo limit, the block after which the deploy is valid, and the signature. **Blockchain Information** gives the number and hash of the block that contains the transaction. The **Code** tab shows the deployed Rholang source, and the **Transfers** tab lists the transfers made by that deployment.

## Validators

The **Validators** page starts with three cards, **Total Validators**, **Total ASI Staked** and **Avg. Stake**. The table below lists every validator with its abbreviated public key, stake in ASI, share of the total stake, the number of blocks it proposed, the block where it first appeared, the last block where it appeared, the block of its latest bond (the **Last Active** column) and its status. Large stakes are shortened, so 100000 ASI appears as 100.00K.

The **View History** button opens the **Validator History** page.

![The Validators page with summary cards and the table of validators and their stakes.](/images/explorer/validators-page.webp){width=976 height=692}

### Validator History

**Validator History** shows the validator set at any block. Type a block number into the **Block** field. The page then shows the block time and proposer, the number of active validators, and a table with each validator's stake and share, where the block proposer is marked. Total, average, minimum and maximum stake for that block are listed under the table.

![The Validator History page for one block with its proposer, validator count and stake table.](/images/explorer/validators-history.webp){width=976 height=876}

## Statistics

The **Statistics** page is titled **Network Dashboard**. The buttons in the top right set the time range to 1h, 6h, 1d or 7d, and 1d is selected by default.

Four cards show the latest block, the average block time, transactions per second and the number of active validators. Below them, the **Performance Metrics** chart plots block time and transactions per second over the chosen range, and the **Network Activity** chart plots deployments and transfers.

![The Network Dashboard with the time range buttons, summary cards and two charts.](/images/explorer/statistics-page.webp){width=976 height=890}

## Indexer Status

The indexer is the service that reads blocks from the node and stores them in the database that the explorer queries. The **Indexer** page shows how far it has progressed.

The label in the top right is **Synched** when the indexer is up to date, **Syncing** when it is slightly behind and **Behind** when it is far behind. The cards show the sync progress, the last indexed block with the number of blocks it is behind, the highest block, and the age of the last update. The table at the bottom repeats the last indexed block, the highest block and the sync status.

The highest block on this page is the newest block in the explorer database, not a value read from the node. The **Last Update** age is therefore the more useful sign of a stalled indexer: if it keeps growing while the **Blocks** page shows no new blocks, the indexer has stopped.

![The Indexer page with the sync status label, progress cards and the table of block numbers.](/images/explorer/indexer-status.webp){width=976 height=760}

## Search

The search box in the header looks up blocks, transfers and deployments. Type a block number or hash, a transfer or deployment ID or an address and press Enter. The matches appear under the box, and a click opens the block or transaction details.

The funnel icon opens **Filters**. **Search Type** narrows the search to **All Types**, **Blocks**, **Transfers** or **Deployments**. The panel has one group of filters for each type.

![The search box with the Filters panel open, showing Search Type and the block, transfer and deployment filter fields.](/images/explorer/search-tab.webp){width=976 height=912}

| Group | Filters |
| --- | --- |
| Block Filters | Proposer address and minimum and maximum block number |
| Transfer Filters | Sender and recipient address, and minimum and maximum amount in ASI |
| Deployment Filters | Deployer address, and minimum and maximum phlo cost |

**Clear All** resets the form.

## Export

The green icon next to the page title downloads a CSV file with up to 5,000 records. On the **Blocks** page it sits next to **Recent Blocks** and saves `recent_blocks.csv`. On the **Transactions** page it exports the open tab and saves `recent_deployments.csv` or `recent_transfers.csv`.

## Data Source

The explorer does not read the node directly. The indexer reads blocks from the node and writes them into PostgreSQL, and the explorer queries that database through a GraphQL API. A block therefore shows up in the explorer shortly after the node finalizes it. See [Data Flow](/architecture/data-flow/) for the whole path and [What Is ASI:Chain](/overview/) for the components.

## Next Steps

<CardGrid columns="2">
<DocCard title="Data Flow" href="/architecture/data-flow/">The path from the node to the explorer</DocCard>
<DocCard title="What Is ASI:Chain" href="/overview/">The components of the network</DocCard>
<DocCard title="ASI Wallet" href="/wallet/usage/">Open the wallet at wallet.dev.asichain.io</DocCard>
<DocCard title="Faucet" href="/faucet/usage/">Request tokens at faucet.dev.asichain.io</DocCard>
</CardGrid>

The wallet is at [wallet.dev.asichain.io](https://wallet.dev.asichain.io), the faucet at [faucet.dev.asichain.io](https://faucet.dev.asichain.io) and the documentation at [docs.asichain.io](https://docs.asichain.io). The explorer source is at [github.com/asi-alliance/asi-chain-explorer](https://github.com/asi-alliance/asi-chain-explorer).
