#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const MWBParser = require('./src/mwbParser');
const DrawioGenerator = require('./src/drawioGenerator');
const config = require('./config');

/**
 * SchemaFlow - Convert MySQL Workbench (.mwb) files to draw.io (.drawio) format
 */
class SchemaFlow {
  constructor() {
    this.parser = new MWBParser();
    this.generator = new DrawioGenerator();
  }

  /**
   * Main conversion process
   */
  async convert() {
    console.log('🚀 SchemaFlow - MySQL Workbench to Draw.io Converter');
    console.log('=' .repeat(60));
    
    try {
      // Check if input file exists
      if (!fs.existsSync(config.INPUT_FILE)) {
        throw new Error(`Input file not found: ${config.INPUT_FILE}`);
      }

      console.log(`📁 Input file: ${config.INPUT_FILE}`);
      console.log(`📁 Output file: ${config.OUTPUT_FILE}`);
      console.log('');

      // Step 1: Parse MWB file
      console.log('Step 1: Parsing MySQL Workbench file...');
      const schemaData = await this.parser.parseMWBFile(config.INPUT_FILE);
      
      // Display parsed information
      this.displaySchemaInfo(schemaData);

      // Step 2: Generate draw.io XML
      console.log('Step 2: Generating draw.io XML...');
      const drawioXML = this.generator.generateDrawioXML(schemaData);

      // Step 3: Save output file
      console.log('Step 3: Saving output file...');
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
    }
  }

  /**
   * Display parsed schema information
   * @param {Object} schemaData - Parsed schema data
   */
  displaySchemaInfo(schemaData) {
    console.log('');
    console.log('📊 Schema Information:');
    console.log(`   Schema Name: ${schemaData.schemaName}`);
    console.log(`   Tables: ${schemaData.tables.length}`);
    console.log(`   Relationships: ${schemaData.relationships.length}`);
    console.log('');
    
    if (schemaData.tables.length > 0) {
      console.log('📋 Tables found:');
      schemaData.tables.forEach((table, index) => {
        const pkCount = table.primaryKeys.length;
        const fkCount = table.foreignKeys.length;
        console.log(`   ${index + 1}. ${table.name} (${table.columns.length} columns, ${pkCount} PK, ${fkCount} FK)`);
      });
      console.log('');
    }

    if (schemaData.relationships.length > 0) {
      console.log('🔗 Relationships found:');
      schemaData.relationships.forEach((rel, index) => {
        console.log(`   ${index + 1}. ${rel.fromTableName} → ${rel.toTableName}`);
      });
      console.log('');
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

