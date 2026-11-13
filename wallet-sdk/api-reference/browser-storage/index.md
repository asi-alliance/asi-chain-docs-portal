# BrowserStorage

[Source](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/dev/src/domains/BrowserStorage/index.ts) · [Table interface](https://github.com/asi-alliance/asi-chain-wallet-sdk/blob/dev/src/domains/TableService/index.ts)

`BrowserStorage` wraps the browser's IndexedDB. It keeps records in named tables and implements `ITableService<ITableRecord>`. You only need it directly when you want your own tables next to the SDK's.

The class needs `indexedDB`, so it works only in a browser. The SDK's storage repositories use it to persist wallets, accounts and reservations in a browser. In Node.js they use `NodeStorage`, which has the same interface and keeps files in a directory (`DEFAULT_NODE_STORAGE_DIR`). All methods are asynchronous except `getVersion`, `getDatabaseName`, `getTableNamesList` and `isInitialized`.

## Import

```ts
import { BrowserStorage } from "@asichain/asi-wallet-sdk";
```

## Constructor

```ts
new BrowserStorage(name?: string)
```

`name` is the database name and defaults to `"AppDatabase"`.

```ts
BrowserStorage.getInstance(name?: string): BrowserStorage
```

`getInstance` returns one shared instance. The `name` is used only by the first call.

## Methods

Methods that work with a table throw `Error("Table '<name>' does not exist. Use createTable() first.")` when the table is missing.

### init()

```ts
init(): Promise<IDBDatabase>
```

`init` opens the database and returns it. Calling it again returns the open database. The other methods call `init` themselves, so you can skip it.

### createTable()

```ts
createTable(tableName: string, keyPath?: string): Promise<void>
```

`createTable` creates a table whose key is `keyPath` (default `"id"`) with an index on `createdAt`. IndexedDB can change its set of tables only in a version upgrade, so `createTable` and `dropTable` close the database and reopen it with the next version number.

### dropTable()

```ts
dropTable(tableName: string): Promise<void>
```

`dropTable` deletes the table and its records.

### tableExists()

```ts
tableExists(tableName: string): Promise<boolean>
```

`tableExists` returns `true` when the table exists.

### getTableNames()

```ts
getTableNames(): Promise<string[]>
```

`getTableNames` opens the database if needed and returns the names of its tables.

### close()

```ts
close(): Promise<void>
```

`close` closes the database. On a closed database it does nothing.

### insert()

```ts
insert(tableName: string, record: ITableRecord): Promise<void>
```

`insert` and `insertMany` add new records. A record with an existing `id` makes the transaction fail with `StorageOperationError`.

### insertMany()

```ts
insertMany(tableName: string, records: ITableRecord[]): Promise<void>
```

### getById()

```ts
getById(tableName: string, id: string | number): Promise<ITableRecord | null>
```

`getById` returns the record, or `null` when there is none.

### getAll()

```ts
getAll(tableName: string): Promise<ITableRecord[]>
```

`getAll` returns all records of the table, or an empty array.

### update()

```ts
update(tableName: string, id: string | number, data: Partial<ITableRecord>): Promise<void>
```

`update` merges `data` into the stored record and keeps its `id`. It throws `Error("Record with id '<id>' not found in table '<name>'")` when the record does not exist.

### delete()

```ts
delete(tableName: string, id: string | number): Promise<void>
```

`delete` and `deleteMany` remove records by key. Missing keys are ignored.

### deleteMany()

```ts
deleteMany(tableName: string, ids: (string | number)[]): Promise<void>
```

### clearTable()

```ts
clearTable(tableName: string): Promise<void>
```

`clearTable` removes all records and keeps the table.

### isInitialized()

```ts
isInitialized(): boolean
```

`isInitialized` returns `true` while the database is open.

### getVersion()

```ts
getVersion(): number
```

`getVersion` returns the current IndexedDB version, or `0` before `init`.

### getDatabaseName()

```ts
getDatabaseName(): string
```

`getDatabaseName` returns the database name.

### getTableNamesList()

```ts
getTableNamesList(): string[]
```

`getTableNamesList` is the synchronous form of `getTableNames` and returns an empty array until the database is open.

## Types

### ITableRecord

`ITableRecord` is an object with a string `id` and any other fields. The `id` is the table key unless you pick another `keyPath` in `createTable`. `insert` and `insertMany` add the fields `createdAt` and `updatedAt` (Unix time in milliseconds), and `update` refreshes `updatedAt`.

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
