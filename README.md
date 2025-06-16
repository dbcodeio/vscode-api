# @dbcode/vscode-types

TypeScript types for integrating with the DBCode VSCode extension API. This package provides type definitions that allow other VSCode extensions to safely interact with DBCode's database connection management features.

## Installation

```bash
npm install @dbcode/vscode-types
```

## Overview

DBCode is a VSCode extension for database management. This types package allows other extensions to:

- Add database connections programmatically
- Remove database connections
- Manage connection configurations with full type safety

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
}
```

## Usage Example

See the [example extension file](./example/extension.ts) for a complete, commented implementation, or check out the basic usage below:

```typescript
import * as vscode from 'vscode';
import { DBCodeAPI, ConnectionConfig } from '@dbcode/vscode-types';

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
  }
}
```

## Key Features

### Connection Management
- **Add Connections**: Add single or multiple connections with automatic deduplication
- **Remove Connections**: Remove connections by ID
- **Update Existing**: Connections with existing IDs are updated, not duplicated

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
- File an issue on the [GitHub repository](https://github.com/dbcodeio/vscode-types)
- Check the [DBCode extension documentation](https://dbcode.io/docs)
