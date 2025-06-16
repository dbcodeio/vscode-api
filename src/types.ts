/**
 * Represents the database driver types supported by DBCode
 */
export type Driver = 
  | 'postgres'
  | 'mssql'
  | 'azure'
  | 'cockroach'
  | 'yugabyte'
  | 'timescale'
  | 'mysql'
  | 'mariadb'
  | 'mongodb'
  | 'sqlite'
  | 'libsql'
  | 'd1'
  | 'redshift'
  | 'oracle'
  | 'duckdb'
  | 'cassandra'
  | 'snowflake'
  | 'motherduck'
  | 'db2'
  | 'bigquery'
  | 'redis'
  | 'starrocks'
  | 'singlestore'
  | 'doris'
  | 'excel'
  | 'csv'
  | 'greenplum'
  | 'clickhouse'
  | 'dataverse'
  | 'risingwave'
  | 'trino'
  | 'athena'
  | 'databricks'
  | 'elasticsearch'
  | 'questdb'
  | 'azuresynapse';


/**
 * Password save options for database connections
 */
export type SavePasswordOption = 
  | 'no' 
  | 'yes' 
  | 'session' 
  | 'encrypted' 
  | 'secretStorage' 
  | 'na' 
  | 'cmd';

/**
 * Connection role types for environment categorization
 */
export type ConnectionRole = 
  | 'production' 
  | 'testing' 
  | 'development' 
  | '';

/**
 * Connection configuration for database connections
 */
export interface ConnectionConfig {
  /** Unique identifier for the connection */
  connectionId: string;
  /** Tunnel ID if connecting through a tunnel */
  tunnelId?: string;
  /** The type of connection, either host-based or socket-based */
  connectionType: 'host' | 'socket';
  /** Database host/server address (required for host connections) */
  host?: string;
  /** Database port number (required for host connections) */
  port?: number;
  /** Socket path for socket-based connections */
  socket?: string;
  /** Database driver type */
  driver: Driver;
  /** Display name for the connection */
  name: string;
  /** Username for database authentication */
  username?: string;
  /** Password for database authentication */
  password?: string;
  /** Color identifier for UI display */
  color?: string;
  /** Database name to connect to */
  database?: string;
  /** How the password should be saved and managed */
  savePassword?: SavePasswordOption;
  /** Connection timeout in milliseconds */
  connectionTimeout?: number;
  /** Request timeout in milliseconds */
  requestTimeout?: number;
  /** Group name for organizing connections */
  group?: string;
  /** Whether to use SSL/TLS encryption */
  ssl?: boolean;
  /** Whether to trust self-signed or unauthorized SSL certificates */
  sslTrustCertificate?: boolean;
  /** Path to the SSL Certificate Authority (CA) certificate file */
  sslCACert?: string;
  /** Path to the SSL client certificate file */
  sslClientCert?: string;
  /** Path to the SSL client private key file */
  sslClientKey?: string;
  /** Driver-specific configuration options */
  driverOptions?: { [key: string]: string | number | boolean };
  /** Filters to apply to the connection for data display */
  filters?: { [key: string]: string[] };
  /** Whether the connection should be read-only */
  readOnly?: boolean;
  /** Environment role of the connection for categorization */
  role?: ConnectionRole;
}

/**
 * Result of connection operations
 */
export interface ConnectionOperationResult {
  /** Whether the operation was successful */
  success: boolean;
  /** Error message if operation failed */
  error?: string;
}


/**
 * DBCode API interface for managing database connections
 */
export interface DBCodeAPI {
  /**
   * Add one or more database connections
   * @param connections Array of connection configurations to add
   * @returns Promise resolving to operation result
   */
  addConnections(connections: ConnectionConfig[]): Promise<ConnectionOperationResult>;

  /**
   * Remove one or more database connections
   * @param connectionIds Array of connection IDs to remove
   * @returns Promise resolving to operation result
   */
  removeConnections(connectionIds: string[]): Promise<ConnectionOperationResult>;
}
