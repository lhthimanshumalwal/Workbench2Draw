const mysql = require('mysql2/promise');
const { URL } = require('url');

class MySQLSchemaFetcher {
  constructor(databaseUrl) {
    this.databaseUrl = databaseUrl;
    this.connection = null;
    this.databaseName = null;
  }

  /**
   * Parse DATABASE_URL and extract connection details
   * @returns {Object} Connection configuration
   */
  parseConnectionUrl() {
    try {
      const url = new URL(this.databaseUrl);
      
      this.databaseName = url.pathname.substring(1); // Remove leading slash
      
      return {
        host: url.hostname,
        port: url.port || 3306,
        user: url.username,
        password: url.password,
        database: this.databaseName,
        ssl: {
          rejectUnauthorized: false // For AWS RDS
        }
      };
    } catch (error) {
      throw new Error(`Invalid DATABASE_URL format: ${error.message}`);
    }
  }

  /**
   * Connect to MySQL database
   */
  async connect() {
    try {
      const config = this.parseConnectionUrl();
      console.log(`🔌 Connecting to MySQL database: ${config.host}:${config.port}/${config.database}`);
      
      this.connection = await mysql.createConnection(config);
      console.log('✅ Successfully connected to MySQL database');
      
    } catch (error) {
      throw new Error(`Failed to connect to database: ${error.message}`);
    }
  }

  /**
   * Fetch complete database schema
   * @returns {Object} Schema data with tables and relationships
   */
  async fetchSchema() {
    try {
      console.log('📊 Fetching database schema...');
      
      if (!this.connection) {
        await this.connect();
      }

      // Fetch tables
      const tables = await this.fetchTables();
      console.log(`📋 Found ${tables.length} tables`);

      // Fetch columns for each table
      for (const table of tables) {
        table.columns = await this.fetchColumns(table.name);
        table.primaryKeys = await this.fetchPrimaryKeys(table.name);
        table.foreignKeys = await this.fetchForeignKeys(table.name);
      }

      // Fetch relationships
      const relationships = await this.fetchRelationships();
      console.log(`🔗 Found ${relationships.length} relationships`);

      const schemaData = {
        schemaName: this.databaseName,
        tables: tables,
        relationships: relationships
      };

      console.log(`✅ Successfully fetched schema for database: ${this.databaseName}`);
      return schemaData;

    } catch (error) {
      throw new Error(`Failed to fetch schema: ${error.message}`);
    }
  }

  /**
   * Fetch all tables in the database
   * @returns {Array} Array of table objects
   */
  async fetchTables() {
    const query = `
      SELECT 
        TABLE_NAME as name,
        TABLE_COMMENT as comment,
        ENGINE as engine,
        TABLE_ROWS as row_count
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_TYPE = 'BASE TABLE'
      ORDER BY TABLE_NAME
    `;

    const [rows] = await this.connection.execute(query, [this.databaseName]);
    
    return rows.map(row => ({
      id: `table_${row.name}`,
      name: row.name,
      comment: row.comment || '',
      engine: row.engine || 'InnoDB',
      rowCount: row.row_count || 0,
      columns: [],
      primaryKeys: [],
      foreignKeys: []
    }));
  }

  /**
   * Fetch columns for a specific table
   * @param {string} tableName - Name of the table
   * @returns {Array} Array of column objects
   */
  async fetchColumns(tableName) {
    const query = `
      SELECT 
        COLUMN_NAME as name,
        DATA_TYPE as dataType,
        COLUMN_TYPE as fullType,
        IS_NULLABLE as nullable,
        COLUMN_DEFAULT as defaultValue,
        EXTRA as extra,
        COLUMN_COMMENT as comment,
        CHARACTER_MAXIMUM_LENGTH as maxLength,
        NUMERIC_PRECISION as numericPrecision,
        NUMERIC_SCALE as numericScale,
        ORDINAL_POSITION as position
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
      ORDER BY ORDINAL_POSITION
    `;

    const [rows] = await this.connection.execute(query, [this.databaseName, tableName]);
    
    return rows.map(row => ({
      id: `col_${tableName}_${row.name}`,
      name: row.name,
      dataType: row.dataType.toUpperCase(),
      fullType: row.fullType,
      nullable: row.nullable === 'YES',
      defaultValue: row.defaultValue,
      autoIncrement: row.extra.includes('auto_increment'),
      comment: row.comment || '',
      maxLength: row.maxLength,
      numericPrecision: row.numericPrecision,
      numericScale: row.numericScale,
      position: row.position
    }));
  }

  /**
   * Fetch primary keys for a specific table
   * @param {string} tableName - Name of the table
   * @returns {Array} Array of primary key column names
   */
  async fetchPrimaryKeys(tableName) {
    const query = `
      SELECT COLUMN_NAME as columnName
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = ? 
      AND CONSTRAINT_NAME = 'PRIMARY'
      ORDER BY ORDINAL_POSITION
    `;

    const [rows] = await this.connection.execute(query, [this.databaseName, tableName]);
    return rows.map(row => row.columnName);
  }

  /**
   * Fetch foreign keys for a specific table
   * @param {string} tableName - Name of the table
   * @returns {Array} Array of foreign key objects
   */
  async fetchForeignKeys(tableName) {
    const query = `
      SELECT 
        kcu.CONSTRAINT_NAME as constraintName,
        kcu.COLUMN_NAME as columnName,
        kcu.REFERENCED_TABLE_NAME as referencedTable,
        kcu.REFERENCED_COLUMN_NAME as referencedColumn,
        rc.UPDATE_RULE as updateRule,
        rc.DELETE_RULE as deleteRule
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu
      JOIN INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc 
        ON kcu.CONSTRAINT_NAME = rc.CONSTRAINT_NAME 
        AND kcu.TABLE_SCHEMA = rc.CONSTRAINT_SCHEMA
      WHERE kcu.TABLE_SCHEMA = ? 
      AND kcu.TABLE_NAME = ?
      AND kcu.REFERENCED_TABLE_NAME IS NOT NULL
      ORDER BY kcu.ORDINAL_POSITION
    `;

    const [rows] = await this.connection.execute(query, [this.databaseName, tableName]);
    
    return rows.map(row => ({
      id: `fk_${tableName}_${row.constraintName}`,
      name: row.constraintName,
      columnName: row.columnName,
      referencedTable: row.referencedTable,
      referencedColumn: row.referencedColumn,
      updateRule: row.updateRule,
      deleteRule: row.deleteRule
    }));
  }

  /**
   * Fetch all relationships in the database
   * @returns {Array} Array of relationship objects
   */
  async fetchRelationships() {
    const query = `
      SELECT 
        kcu.TABLE_NAME as fromTable,
        kcu.COLUMN_NAME as fromColumn,
        kcu.REFERENCED_TABLE_NAME as toTable,
        kcu.REFERENCED_COLUMN_NAME as toColumn,
        kcu.CONSTRAINT_NAME as constraintName,
        rc.UPDATE_RULE as updateRule,
        rc.DELETE_RULE as deleteRule
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu
      JOIN INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc 
        ON kcu.CONSTRAINT_NAME = rc.CONSTRAINT_NAME 
        AND kcu.TABLE_SCHEMA = rc.CONSTRAINT_SCHEMA
      WHERE kcu.TABLE_SCHEMA = ?
      AND kcu.REFERENCED_TABLE_NAME IS NOT NULL
      ORDER BY kcu.TABLE_NAME, kcu.ORDINAL_POSITION
    `;

    const [rows] = await this.connection.execute(query, [this.databaseName]);
    
    return rows.map(row => ({
      id: `rel_${row.constraintName}`,
      fromTable: `table_${row.fromTable}`,
      toTable: `table_${row.toTable}`,
      fromTableName: row.fromTable,
      toTableName: row.toTable,
      fromColumn: row.fromColumn,
      toColumn: row.toColumn,
      constraintName: row.constraintName,
      type: 'foreign_key',
      updateRule: row.updateRule,
      deleteRule: row.deleteRule
    }));
  }

  /**
   * Get database statistics
   * @returns {Object} Database statistics
   */
  async getDatabaseStats() {
    try {
      const tableCountQuery = `
        SELECT COUNT(*) as tableCount 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_SCHEMA = ? AND TABLE_TYPE = 'BASE TABLE'
      `;

      const relationshipCountQuery = `
        SELECT COUNT(*) as relationshipCount 
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
        WHERE TABLE_SCHEMA = ? AND REFERENCED_TABLE_NAME IS NOT NULL
      `;

      const [tableResult] = await this.connection.execute(tableCountQuery, [this.databaseName]);
      const [relationshipResult] = await this.connection.execute(relationshipCountQuery, [this.databaseName]);

      return {
        databaseName: this.databaseName,
        tableCount: tableResult[0].tableCount,
        relationshipCount: relationshipResult[0].relationshipCount
      };

    } catch (error) {
      console.warn('⚠️ Could not fetch database statistics:', error.message);
      return {
        databaseName: this.databaseName,
        tableCount: 0,
        relationshipCount: 0
      };
    }
  }

  /**
   * Close database connection
   */
  async close() {
    if (this.connection) {
      await this.connection.end();
      console.log('🔌 Database connection closed');
    }
  }

  /**
   * Test database connection
   * @returns {boolean} Connection status
   */
  async testConnection() {
    try {
      await this.connect();
      const [rows] = await this.connection.execute('SELECT 1 as test');
      await this.close();
      return rows[0].test === 1;
    } catch (error) {
      console.error('❌ Connection test failed:', error.message);
      return false;
    }
  }
}

module.exports = MySQLSchemaFetcher;

