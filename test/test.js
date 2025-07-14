#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const SampleMwbGenerator = require('../src/sampleMwbGenerator');
const SchemaFlow = require('../index');

/**
 * Test script for SchemaFlow
 */
class SchemaFlowTest {
  constructor() {
    this.sampleGenerator = new SampleMwbGenerator();
  }

  async runTests() {
    console.log('🧪 SchemaFlow Test Suite');
    console.log('=' .repeat(50));

    try {
      // Test 1: Generate sample data
      await this.testSampleGeneration();
      
      // Test 2: Test conversion (if sample file exists)
      await this.testConversion();
      
      console.log('');
      console.log('✅ All tests completed successfully!');
      
    } catch (error) {
      console.error('');
      console.error('❌ Test failed:');
      console.error(`   ${error.message}`);
      process.exit(1);
    }
  }

  async testSampleGeneration() {
    console.log('');
    console.log('Test 1: Sample Data Generation');
    console.log('-'.repeat(30));
    
    const samplePath = './samples/sample.xml';
    await this.sampleGenerator.createSampleMwbFile('./samples/sample.mwb');
    
    if (fs.existsSync(samplePath)) {
      console.log('✅ Sample XML file generated successfully');
      
      // Display sample content info
      const content = fs.readFileSync(samplePath, 'utf8');
      const tableMatches = content.match(/struct-name="db\.mysql\.Table"/g);
      const tableCount = tableMatches ? tableMatches.length : 0;
      console.log(`   Found ${tableCount} tables in sample data`);
    } else {
      throw new Error('Sample file was not created');
    }
  }

  async testConversion() {
    console.log('');
    console.log('Test 2: Conversion Process');
    console.log('-'.repeat(30));
    
    // Note: This test would work with a real .mwb file
    // For now, we'll just verify the classes can be instantiated
    const schemaFlow = new SchemaFlow();
    console.log('✅ SchemaFlow instance created successfully');
    
    // Test configuration
    const config = require('../config');
    console.log(`✅ Configuration loaded: ${config.INPUT_FILE} → ${config.OUTPUT_FILE}`);
    
    console.log('');
    console.log('📋 To test with real data:');
    console.log('1. Export a .mwb file from MySQL Workbench');
    console.log('2. Place it at: ./samples/sample.mwb');
    console.log('3. Run: npm start');
  }
}

// Run tests
if (require.main === module) {
  const test = new SchemaFlowTest();
  test.runTests().catch(error => {
    console.error('Fatal test error:', error);
    process.exit(1);
  });
}

