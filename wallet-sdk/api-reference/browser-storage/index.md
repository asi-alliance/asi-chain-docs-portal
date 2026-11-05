# BrowserStorage

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/v2.1.0/src/domains/BrowserStorage/index.ts) · [Table interface](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/v2.1.0/src/domains/TableService/index.ts)

A wrapper over the browser's IndexedDB. It keeps records in named tables and implements `ITableService<ITableRecord>`. The SDK's storage repositories use it to persist wallets, accounts and reservations in a browser, and in Node.js they use `NodeStorage`, which has the same interface and keeps files in a directory (`DEFAULT_NODE_STORAGE_DIR`). You only need `BrowserStorage` directly when you want your own tables next to the SDK's.

All methods are asynchronous except `getVersion`, `getDatabaseName`, `getTableNamesList` and `isInitialized`. The class needs `indexedDB`, so it works in a browser and does not work in Node.js.

## Record

`ITableRecord` is an object with a string `id` and any other fields. The `id` is the table key unless you pick another `keyPath` in `createTable`. `insert` and `insertMany` add the fields `createdAt` and `updatedAt` (Unix time in milliseconds), and `update` refreshes `updatedAt`.

## Constructor

```ts
new BrowserStorage(name?: string)
```

`name` is the database name and defaults to `"AppDatabase"`.

```ts
BrowserStorage.getInstance(name?: string): BrowserStorage
```

`getInstance` returns one shared instance. The `name` is used only by the first call.

## Opening and Tables

```ts
init(): Promise<IDBDatabase>
createTable(tableName: string, keyPath?: string): Promise<void>
dropTable(tableName: string): Promise<void>
tableExists(tableName: string): Promise<boolean>
getTableNames(): Promise<string[]>
close(): Promise<void>
```

`init` opens the database and returns it. Calling it again returns the open database. The other methods call `init` themselves, so you can skip it.

`createTable` creates a table whose key is `keyPath` (default `"id"`) with an index on `createdAt`. IndexedDB can change its set of tables only in a version upgrade, so `createTable` and `dropTable` close the database and reopen it with the next version number.

Methods that work with a table throw `Error("Table '<name>' does not exist. Use createTable() first.")` when the table is missing.

## Records

```ts
insert(tableName: string, record: ITableRecord): Promise<void>
insertMany(tableName: string, records: ITableRecord[]): Promise<void>
getById(tableName: string, id: string | number): Promise<ITableRecord | null>
getAll(tableName: string): Promise<ITableRecord[]>
update(tableName: string, id: string | number, data: Partial<ITableRecord>): Promise<void>
delete(tableName: string, id: string | number): Promise<void>
deleteMany(tableName: string, ids: (string | number)[]): Promise<void>
clearTable(tableName: string): Promise<void>
```

| Method | Behavior |
|--------|----------|
| `insert`, `insertMany` | Add new records. A record with an existing `id` makes the transaction fail with `StorageOperationError`. |
| `getById` | Returns the record, or `null` when there is none. |
| `getAll` | Returns all records of the table, or an empty array. |
| `update` | Merges `data` into the stored record and keeps its `id`. Throws `Error("Record with id '<id>' not found in table '<name>'")` when the record does not exist. |
| `delete`, `deleteMany` | Remove records by key. Missing keys are ignored. |
| `clearTable` | Removes all records and keeps the table. |

## State

```ts
isInitialized(): boolean
getVersion(): number
getDatabaseName(): string
getTableNamesList(): string[]
```

`getVersion` returns the current IndexedDB version, or `0` before `init`. `getTableNamesList` is the synchronous form of `getTableNames` and returns an empty array until the database is open.

## Example

```ts
import { BrowserStorage } from "@asichain/asi-wallet-sdk";

async function main(): Promise<void> {
    const storage = new BrowserStorage("MyAppDb");

    await storage.init();

    if (!(await storage.tableExists("notes"))) {
        await storage.createTable("notes");
    }

    await storage.insert("notes", { id: "n1", text: "hello" });
    await storage.update("notes", "n1", { text: "bye" });

    console.log(await storage.getById("notes", "n1")); // { id: "n1", text: "bye", createdAt: ..., updatedAt: ... }
    console.log(await storage.getById("notes", "missing")); // null

    await storage.delete("notes", "n1");
    await storage.close();
}

if (typeof indexedDB !== "undefined") {
    await main();
}
```
