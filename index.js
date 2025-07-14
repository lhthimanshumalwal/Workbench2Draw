#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const MySQLSchemaFetcher = require('./src/mysqlSchemaFetcher');
const SampleDatabaseGenerator = require('./src/sampleDatabaseGenerator');
const DrawioGenerator = require('./src/drawioGenerator');
const config = require('./config');

/**
 * SchemaFlow - Convert MySQL Database Schema to draw.io (.drawio) format
 */
class SchemaFlow {
  constructor() {
    this.schemaFetcher = config.TEST_MODE ? null : new MySQLSchemaFetcher(config.DATABASE_URL);
    this.sampleGenerator = new SampleDatabaseGenerator();
    this.generator = new DrawioGenerator();
  }

  /**
   * Main conversion process
   */
  async convert() {
    console.log('🚀 SchemaFlow - MySQL Database to Draw.io Converter');
    console.log('=' .repeat(60));
    
    try {
      console.log(`📁 Output file: ${config.OUTPUT_FILE}`);
      
      let schemaData;
      
      if (config.TEST_MODE) {
        console.log('🧪 Running in TEST MODE - using sample data');
        console.log('');
        
        // Step 1: Generate sample schema
        console.log('Step 1: Generating sample database schema...');
        schemaData = this.sampleGenerator.generateSampleSchema();
        console.log('✅ Sample schema generated successfully');
        console.log('');
        
      } else {
        // Check if DATABASE_URL is provided
        if (!config.DATABASE_URL) {
          throw new Error('DATABASE_URL is required. Please set it in your .env file or enable TEST_MODE.');
        }

        console.log(`🔗 Database URL: ${this.maskDatabaseUrl(config.DATABASE_URL)}`);
        console.log('');

        // Step 1: Test database connection
        console.log('Step 1: Testing database connection...');
        const isConnected = await this.schemaFetcher.testConnection();
        if (!isConnected) {
          throw new Error('Failed to connect to database. Please check your DATABASE_URL.');
        }
        console.log('✅ Database connection successful');
        console.log('');

        // Step 2: Fetch database schema
        console.log('Step 2: Fetching database schema...');
        schemaData = await this.schemaFetcher.fetchSchema();
      }
      
      // Display parsed information
      this.displaySchemaInfo(schemaData);

      // Step 3: Generate draw.io XML
      console.log('Step 3: Generating draw.io XML...');
      const drawioXML = this.generator.generateDrawioXML(schemaData);

      // Step 4: Save output file
      console.log('Step 4: Saving output file...');
      this.ensureOutputDirectory();
      fs.writeFileSync(config.OUTPUT_FILE, drawioXML, 'utf8');

      // Success message
      console.log('');
      console.log('✅ Conversion completed successfully!');
      console.log(`📄 Output saved to: ${config.OUTPUT_FILE}`);
      console.log('');
      console.log('📋 Next steps:');
      console.log('1. Open https://app.diagrams.net (draw.io)');
      console.log('2. Click "Open Existing Diagram"');
      console.log(`3. Select the generated file: ${config.OUTPUT_FILE}`);
      console.log('4. View and edit your database schema!');
      
    } catch (error) {
      console.error('');
      console.error('❌ Conversion failed:');
      console.error(`   ${error.message}`);
      console.error('');
      
      if (error.stack) {
        console.error('Stack trace:');
        console.error(error.stack);
      }
      
      process.exit(1);
    } finally {
      // Always close database connection (if not in test mode)
      if (!config.TEST_MODE && this.schemaFetcher) {
        try {
          await this.schemaFetcher.close();
        } catch (error) {
          // Ignore connection close errors
        }
      }
    }
  }

  /**
   * Display parsed schema information
   * @param {Object} schemaData - Parsed schema data
   */
  displaySchemaInfo(schemaData) {
    console.log('');
    console.log('📊 Schema Information:');
    console.log(`   Database: ${schemaData.schemaName}`);
    console.log(`   Tables: ${schemaData.tables.length}`);
    console.log(`   Relationships: ${schemaData.relationships.length}`);
    console.log('');
    
    if (schemaData.tables.length > 0) {
      console.log('📋 Tables found:');
      schemaData.tables.forEach((table, index) => {
        const pkCount = table.primaryKeys.length;
        const fkCount = table.foreignKeys.length;
        const rowCount = table.rowCount ? ` (${table.rowCount} rows)` : '';
        console.log(`   ${index + 1}. ${table.name} (${table.columns.length} columns, ${pkCount} PK, ${fkCount} FK)${rowCount}`);
      });
      console.log('');
    }

    if (schemaData.relationships.length > 0) {
      console.log('🔗 Relationships found:');
      schemaData.relationships.forEach((rel, index) => {
        console.log(`   ${index + 1}. ${rel.fromTableName}.${rel.fromColumn} → ${rel.toTableName}.${rel.toColumn}`);
      });
      console.log('');
    }
  }

  /**
   * Mask sensitive information in database URL
   * @param {string} url - Database URL
   * @returns {string} Masked URL
   */
  maskDatabaseUrl(url) {
    try {
      const urlObj = new URL(url);
      const maskedPassword = urlObj.password ? '***' : '';
      return `${urlObj.protocol}//${urlObj.username}:${maskedPassword}@${urlObj.host}${urlObj.pathname}`;
    } catch (error) {
      return 'Invalid URL format';
    }
  }

  /**
   * Ensure output directory exists
   */
  ensureOutputDirectory() {
    const outputDir = path.dirname(config.OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`📁 Created output directory: ${outputDir}`);
    }
  }
}

// Run the application
if (require.main === module) {
  const app = new SchemaFlow();
  app.convert().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = SchemaFlow;
