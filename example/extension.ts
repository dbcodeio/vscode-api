/**
 * DBCode Integration Example
 * 
 * This example demonstrates how to integrate with the DBCode VSCode extension
 * using the @dbcode/vscode-types package for type safety.
 * 
 * The example shows:
 * 1. How to connect to the DBCode extension API
 * 2. How to add single database connections
 * 3. How to remove database connections  
 * 4. How to add multiple connections at once
 * 5. Proper error handling patterns
 * 
 * To use this example:
 * 1. Ensure DBCode extension is installed
 * 2. Copy this file to your extension project
 * 3. Install @dbcode/vscode-types package
 * 4. Register the commands in your package.json
 */

import * as vscode from 'vscode';
import { 
  DBCodeAPI, 
  ConnectionConfig, 
  ConnectionOperationResult
} from '@dbcode/vscode-types';

// Global variable to store the DBCode API instance
let dbcodeAPI: DBCodeAPI | null = null;

/**
 * Extension activation function
 * Called when the extension is activated by VSCode
 */
export async function activate(context: vscode.ExtensionContext) {
  console.log('DBCode Integration Example extension is now active');

  // Step 1: Get reference to the DBCode extension
  // The extension ID should match the actual DBCode extension
  const dbcodeExtension = vscode.extensions.getExtension('dbcode.dbcode');
  
  if (!dbcodeExtension) {
    vscode.window.showErrorMessage(
      'DBCode extension not found. Please install DBCode extension first.'
    );
    return;
  }

  // Step 2: Activate the DBCode extension if it's not already active
  // This ensures the API is available for use
  if (!dbcodeExtension.isActive) {
    try {
      await dbcodeExtension.activate();
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to activate DBCode extension: ${error}`);
      return;
    }
  }

  // Step 3: Get the DBCode API from the extension exports
  // The exports should contain an 'api' property with the DBCode API methods
  const exports = dbcodeExtension.exports;
  if (!exports || !exports.api) {
    vscode.window.showErrorMessage('DBCode API not available');
    return;
  }

  // Store the API for use in command handlers
  dbcodeAPI = exports.api as DBCodeAPI;

  // Step 4: Register all commands that will use the DBCode API
  registerCommands(context);

  vscode.window.showInformationMessage('DBCode Integration Example activated successfully!');
}

/**
 * Extension deactivation function
 * Called when the extension is deactivated
 */
export function deactivate() {
  // Clean up resources if needed
  dbcodeAPI = null;
}

/**
 * Register all commands provided by this example extension
 * Each command demonstrates different aspects of the DBCode API
 */
function registerCommands(context: vscode.ExtensionContext) {
  
  // Command 1: Add a single sample connection
  const addConnectionCommand = vscode.commands.registerCommand(
    'dbcode-example.addConnection',
    addSampleConnection
  );

  // Command 2: Remove a sample connection by ID
  const removeConnectionCommand = vscode.commands.registerCommand(
    'dbcode-example.removeConnection',
    removeSampleConnection
  );

  // Command 3: Add multiple connections at once
  const addMultipleCommand = vscode.commands.registerCommand(
    'dbcode-example.addMultipleConnections',
    addMultipleConnections
  );

  // Register all commands with VSCode for proper cleanup
  context.subscriptions.push(
    addConnectionCommand,
    removeConnectionCommand,
    addMultipleCommand
  );
}

/**
 * Example 1: Add a Single Database Connection
 * 
 * This function demonstrates how to create and add a PostgreSQL connection
 * using the DBCode API. It shows the proper structure of ConnectionConfig
 * and how to handle the API response.
 */
async function addSampleConnection() {
  // Always check if the API is available before using it
  if (!dbcodeAPI) {
    vscode.window.showErrorMessage('DBCode API not available');
    return;
  }

  // Create a connection configuration object
  // This example shows a PostgreSQL connection with common settings
  const connection: ConnectionConfig = {
    // Unique identifier - must be unique across all connections
    connectionId: 'example-postgres-1',
    
    // Display name shown in the UI
    name: 'Example PostgreSQL Connection',
    
    // Connection method: 'host' for network connections, 'socket' for local sockets
    connectionType: 'host',
    
    // Database driver - one of the 36+ supported drivers
    driver: 'postgres',
    
    // Network connection details (required for 'host' connectionType)
    host: 'localhost',
    port: 5432,
    
    // Database to connect to (optional)
    database: 'example_db',
    
    // Authentication credentials (optional but usually needed)
    username: 'postgres',
    // Note: password would typically be handled securely
    
    // Password storage preference
    savePassword: 'session', // Options: 'no', 'yes', 'session', 'encrypted', 'secretStorage', 'na', 'cmd'
    
    // Connection timeout in milliseconds
    connectionTimeout: 30000,
    
    // Environment role for categorization
    role: 'development', // Options: 'production', 'testing', 'development', ''
    
    // Driver-specific options (optional)
    driverOptions: {
      application_name: 'DBCode Example Extension'
    }
  };

  try {
    // Call the DBCode API to add the connection
    // addConnections accepts an array of connections and returns a result
    const result: ConnectionOperationResult = await dbcodeAPI.addConnections([connection]);

    // Check if the operation was successful
    if (result.success) {
      vscode.window.showInformationMessage(
        `✅ Successfully added connection: ${connection.name}`
      );
    } else {
      // Handle API errors gracefully
      vscode.window.showErrorMessage(
        `❌ Failed to add connection: ${result.error || 'Unknown error'}`
      );
    }
  } catch (error) {
    // Handle unexpected errors (network issues, API changes, etc.)
    vscode.window.showErrorMessage(`💥 Error adding connection: ${error}`);
  }
}

/**
 * Example 2: Remove a Database Connection
 * 
 * This function demonstrates how to remove a connection by its ID
 * and handle the API response appropriately.
 */
async function removeSampleConnection() {
  // Always check if the API is available
  if (!dbcodeAPI) {
    vscode.window.showErrorMessage('DBCode API not available');
    return;
  }

  // Connection ID to remove (must match an existing connection)
  const connectionId = 'example-postgres-1';

  try {
    // Call the DBCode API to remove the connection
    // removeConnections accepts an array of connection IDs
    const result: ConnectionOperationResult = await dbcodeAPI.removeConnections([connectionId]);

    // Check the operation result
    if (result.success) {
      vscode.window.showInformationMessage(
        `🗑️ Successfully removed connection: ${connectionId}`
      );
    } else {
      vscode.window.showErrorMessage(
        `❌ Failed to remove connection: ${result.error || 'Unknown error'}`
      );
    }
  } catch (error) {
    vscode.window.showErrorMessage(`💥 Error removing connection: ${error}`);
  }
}

/**
 * Example 3: Add Multiple Database Connections
 * 
 * This function demonstrates how to add multiple different types of 
 * database connections in a single API call, showing various driver
 * types and connection configurations.
 */
async function addMultipleConnections() {
  if (!dbcodeAPI) {
    vscode.window.showErrorMessage('DBCode API not available');
    return;
  }

  // Create an array of different connection configurations
  // This shows the variety of databases supported by DBCode
  const connections: ConnectionConfig[] = [
    
    // MySQL connection example
    {
      connectionId: 'example-mysql-1',
      name: 'Example MySQL Connection',
      connectionType: 'host',
      driver: 'mysql',
      host: 'localhost',
      port: 3306,
      database: 'test_db',
      username: 'root',
      role: 'testing',
      savePassword: 'session'
    },
    
    // Redis connection example (NoSQL)
    {
      connectionId: 'example-redis-1',
      name: 'Example Redis Connection',
      connectionType: 'host',
      driver: 'redis',
      host: 'localhost',
      port: 6379,
      database: '0', // Redis database number
      role: 'development'
    },
    
    // SQLite connection example (socket-based, file database)
    {
      connectionId: 'example-sqlite-1',
      name: 'Example SQLite Connection',
      connectionType: 'socket',
      driver: 'sqlite',
      socket: '/path/to/database.db', // File path for SQLite
      role: 'development'
    }
  ];

  try {
    // Add all connections in a single API call
    // This is more efficient than adding them one by one
    const result: ConnectionOperationResult = await dbcodeAPI.addConnections(connections);

    if (result.success) {
      vscode.window.showInformationMessage(
        `🎉 Successfully added ${connections.length} connections`
      );
    } else {
      vscode.window.showErrorMessage(
        `❌ Failed to add connections: ${result.error || 'Unknown error'}`
      );
    }
  } catch (error) {
    vscode.window.showErrorMessage(`💥 Error adding multiple connections: ${error}`);
  }
}

/**
 * Additional Notes for Implementation:
 * 
 * 1. Connection IDs must be unique across all connections
 * 2. Adding a connection with an existing ID will update that connection
 * 3. Always handle both success and error cases
 * 4. Use appropriate connection types: 'host' for network, 'socket' for files/local
 * 5. Choose the correct driver from the 36+ supported options
 * 6. Consider security when handling passwords
 * 7. Use descriptive connection names for better UX
 * 8. Set appropriate roles for environment categorization
 * 
 * Package.json commands to add:
 * {
 *   "commands": [
 *     {
 *       "command": "dbcode-example.addConnection",
 *       "title": "Add Sample Connection"
 *     },
 *     {
 *       "command": "dbcode-example.removeConnection",
 *       "title": "Remove Sample Connection"
 *     },
 *     {
 *       "command": "dbcode-example.addMultipleConnections",
 *       "title": "Add Multiple Connections"
 *     }
 *   ]
 * }
 */
