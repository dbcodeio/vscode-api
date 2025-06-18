# @dbcode/vscode-api

TypeScript types for integrating with the DBCode VSCode extension API. This package provides type definitions that allow other VSCode extensions to safely interact with DBCode's database connection management features.

## Installation

```bash
npm install @dbcode/vscode-api
```

## Overview

DBCode is a VSCode extension for database management. This types package allows other extensions to:

- Add database connections programmatically
- Remove database connections
- Reveal and navigate to connections in the DBCode explorer
- Manage connection configurations with full type safety

The API provides three main methods:
- `addConnections()` - Add one or more database connections
- `removeConnections()` - Remove connections by ID  
- `revealConnection()` - Show the explorer and optionally select a connection

## Core Types

### ConnectionConfig

The main interface for defining database connections:

```typescript
interface ConnectionConfig {
  connectionId: string;         // Unique identifier
  name: string;                 // Display name
  connectionType: 'host' | 'socket'; // Connection method
  driver: Driver;               // Database driver
  host?: string;                // Server host (for host connections)
  port?: number;                // Server port (for host connections)
  socket?: string;              // Socket path (for socket connections)
  database?: string;            // Database name
  username?: string;            // Auth username
  password?: string;            // Auth password
  // ... additional options
}
```

### Driver

Comprehensive database driver support:

```typescript
type Driver = 
  | 'postgres' | 'mssql' | 'azure' | 'cockroach' | 'yugabyte' | 'timescale'
  | 'mysql' | 'mariadb' | 'mongodb' | 'sqlite' | 'libsql' | 'd1'
  | 'redshift' | 'oracle' | 'duckdb' | 'cassandra' | 'snowflake'
  | 'motherduck' | 'db2' | 'bigquery' | 'redis' | 'starrocks'
  | 'singlestore' | 'doris' | 'excel' | 'csv' | 'greenplum'
  | 'clickhouse' | 'dataverse' | 'risingwave' | 'trino' | 'athena'
  | 'databricks' | 'elasticsearch' | 'questdb' | 'azuresynapse';
```

Supports 36+ database systems including traditional databases, cloud data warehouses, analytics engines, and data formats.

## API Interface

### DBCodeAPI

Main API for connection management:

```typescript
interface DBCodeAPI {
  addConnections(connections: ConnectionConfig[]): Promise<ConnectionOperationResult>;
  removeConnections(connectionIds: string[]): Promise<ConnectionOperationResult>;
  revealConnection(connectionId?: string): Promise<ConnectionOperationResult>;
}
```

## Usage Example

See the [example extension file](./example/extension.ts) for a complete, commented implementation, or check out the basic usage below:

```typescript
import * as vscode from 'vscode';
import { DBCodeAPI, ConnectionConfig } from '@dbcode/vscode-api';

export async function activate(context: vscode.ExtensionContext) {
  // Get DBCode API
  const dbcodeExtension = vscode.extensions.getExtension('dbcode.dbcode');
  if (!dbcodeExtension) {
    vscode.window.showErrorMessage('DBCode extension not found');
    return;
  }

  await dbcodeExtension.activate();
  const dbcodeAPI: DBCodeAPI = dbcodeExtension.exports.api;

  // Add a connection
  const connection: ConnectionConfig = {
    connectionId: 'my-postgres-db',
    name: 'My PostgreSQL Database',
    connectionType: 'host',
    driver: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'myapp',
    username: 'postgres'
  };

  const result = await dbcodeAPI.addConnections([connection]);
  if (result.success) {
    vscode.window.showInformationMessage('Connection added successfully!');
    
    // Reveal the connection in the explorer
    await dbcodeAPI.revealConnection('my-postgres-db');
  }
}
```

## Key Features

### Connection Management
- **Add Connections**: Add single or multiple connections with automatic deduplication
- **Remove Connections**: Remove connections by ID
- **Reveal Explorer**: Show the DBCode explorer and optionally select/expand a specific connection
- **Update Existing**: Connections with existing IDs are updated, not duplicated

### Explorer Navigation
- **Show Explorer**: Reveal the DBCode tree view panel
- **Connection Selection**: Automatically find and select a connection by ID
- **Auto Expansion**: Expand the selected connection to show its database structure

### Type Safety
- Full TypeScript support with comprehensive type definitions
- Strongly typed connection configurations
- Type-safe API methods

## Connection ID Behavior

- **Uniqueness**: Connection IDs must be unique across all connections
- **Add Operations**: Adding a connection with an existing ID will update the existing connection
- **Remove Operations**: Removing by ID will find and remove the matching connection
- **No Duplicates**: The system prevents duplicate connections based on ID

## SSL/TLS Support

Configure secure connections with individual SSL properties:

```typescript
const connection: ConnectionConfig = {
  connectionId: 'secure-connection',
  name: 'Secure Database',
  driver: 'postgres',
  connectionType: 'host',
  host: 'localhost',
  port: 5432,
  ssl: true,
  sslTrustCertificate: false,
  sslCACert: '/path/to/ca.pem',
  sslClientCert: '/path/to/client-cert.pem',
  sslClientKey: '/path/to/client-key.pem'
};
```

## Explorer Navigation

### Revealing Connections

Use `revealConnection()` to show the DBCode explorer and navigate to specific connections:

```typescript
// Reveal the explorer without selecting any specific connection
await dbcodeAPI.revealConnection();

// Reveal and select a specific connection by ID
await dbcodeAPI.revealConnection('my-connection-id');

// Complete example with error handling
const result = await dbcodeAPI.revealConnection('production-db');
if (result.success) {
  console.log('Explorer revealed and connection selected');
} else {
  console.error('Failed to reveal connection:', result.error);
}
```

**Behavior:**
- **Without connection ID**: Shows the DBCode explorer panel in the sidebar
- **With connection ID**: Shows the explorer, finds the connection, selects it, and expands it to show databases/tables
- **Invalid connection ID**: Returns an error in the operation result but still reveals the explorer
- **Explorer Focus**: The explorer panel will receive focus when revealed

**Use Cases:**
- Guide users to database connections after adding them
- Deep-link to specific connections from other parts of your extension
- Help users locate connections quickly in large connection lists
- Provide navigation shortcuts in your extension's UI

## Error Handling

All API methods return `ConnectionOperationResult` with success/error information:

```typescript
const result = await dbcodeAPI.addConnections(connections);
if (!result.success) {
  console.error('Failed to add connections:', result.error);
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT - see LICENSE file for details.

## Support

For issues and questions:
- File an issue on the [GitHub repository](https://github.com/dbcodeio/vscode-api)
- Check the [DBCode extension documentation](https://dbcode.io/docs)
