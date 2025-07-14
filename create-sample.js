#!/usr/bin/env node

/**
 * Create a sample .mwb file for demonstration
 * This creates a simplified ZIP structure that mimics a real .mwb file
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Sample XML content that mimics MySQL Workbench structure
const sampleXML = `<?xml version="1.0" encoding="UTF-8"?>
<data version="1.0">
  <value type="object" struct-name="workbench.Document">
    <value type="object" struct-name="workbench.physical.Model">
      <value type="object" struct-name="db.mysql.Catalog" id="catalog1">
        <value type="string" key="name">sample_db</value>
        <value type="list" key="schemata">
          <value type="object" struct-name="db.mysql.Schema" id="schema1">
            <value type="string" key="name">blog_schema</value>
            <value type="list" key="tables">
              
              <value type="object" struct-name="db.mysql.Table" id="table_users">
                <value type="string" key="name">users</value>
                <value type="list" key="columns">
                  <value type="object" struct-name="db.mysql.Column" id="col_user_id">
                    <value type="string" key="name">id</value>
                    <value type="string" key="simpleType">INT</value>
                    <value type="string" key="length">11</value>
                    <value type="int" key="isNotNull">1</value>
                    <value type="int" key="autoIncrement">1</value>
                  </value>
                  <value type="object" struct-name="db.mysql.Column" id="col_username">
                    <value type="string" key="name">username</value>
                    <value type="string" key="simpleType">VARCHAR</value>
                    <value type="string" key="length">50</value>
                    <value type="int" key="isNotNull">1</value>
                  </value>
                  <value type="object" struct-name="db.mysql.Column" id="col_email">
                    <value type="string" key="name">email</value>
                    <value type="string" key="simpleType">VARCHAR</value>
                    <value type="string" key="length">100</value>
                    <value type="int" key="isNotNull">1</value>
                  </value>
                </value>
                <value type="list" key="indices">
                  <value type="object" struct-name="db.mysql.Index" id="idx_users_primary">
                    <value type="string" key="name">PRIMARY</value>
                    <value type="string" key="indexType">PRIMARY</value>
                    <value type="list" key="columns">
                      <value type="object" struct-name="db.mysql.IndexColumn">
                        <value type="string" key="referencedColumn">col_user_id</value>
                      </value>
                    </value>
                  </value>
                </value>
              </value>

              <value type="object" struct-name="db.mysql.Table" id="table_posts">
                <value type="string" key="name">posts</value>
                <value type="list" key="columns">
                  <value type="object" struct-name="db.mysql.Column" id="col_post_id">
                    <value type="string" key="name">id</value>
                    <value type="string" key="simpleType">INT</value>
                    <value type="string" key="length">11</value>
                    <value type="int" key="isNotNull">1</value>
                    <value type="int" key="autoIncrement">1</value>
                  </value>
                  <value type="object" struct-name="db.mysql.Column" id="col_post_user_id">
                    <value type="string" key="name">user_id</value>
                    <value type="string" key="simpleType">INT</value>
                    <value type="string" key="length">11</value>
                    <value type="int" key="isNotNull">1</value>
                  </value>
                  <value type="object" struct-name="db.mysql.Column" id="col_title">
                    <value type="string" key="name">title</value>
                    <value type="string" key="simpleType">VARCHAR</value>
                    <value type="string" key="length">200</value>
                    <value type="int" key="isNotNull">1</value>
                  </value>
                </value>
                <value type="list" key="indices">
                  <value type="object" struct-name="db.mysql.Index" id="idx_posts_primary">
                    <value type="string" key="name">PRIMARY</value>
                    <value type="string" key="indexType">PRIMARY</value>
                    <value type="list" key="columns">
                      <value type="object" struct-name="db.mysql.IndexColumn">
                        <value type="string" key="referencedColumn">col_post_id</value>
                      </value>
                    </value>
                  </value>
                </value>
                <value type="list" key="foreignKeys">
                  <value type="object" struct-name="db.mysql.ForeignKey" id="fk_posts_user">
                    <value type="string" key="name">fk_posts_user_id</value>
                    <value type="string" key="referencedTable">table_users</value>
                    <value type="list" key="columns">
                      <value type="string">col_post_user_id</value>
                    </value>
                    <value type="list" key="referencedColumns">
                      <value type="string">col_user_id</value>
                    </value>
                  </value>
                </value>
              </value>

            </value>
          </value>
        </value>
      </value>
    </value>
  </value>
</data>`;

console.log('📦 Creating sample .mwb file...');

// Create temporary directory
const tempDir = './temp_mwb';
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// Write the XML file
fs.writeFileSync(path.join(tempDir, 'document.mwb.xml'), sampleXML);

// Create a ZIP file (this mimics the .mwb structure)
try {
  execSync(`cd ${tempDir} && zip -r ../samples/sample.mwb document.mwb.xml`, { stdio: 'inherit' });
  console.log('✅ Sample .mwb file created at ./samples/sample.mwb');
} catch (error) {
  console.log('⚠️  ZIP command not available, creating XML file instead...');
  fs.writeFileSync('./samples/sample.xml', sampleXML);
  console.log('✅ Sample XML file created at ./samples/sample.xml');
}

// Clean up
if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true });
}

console.log('🚀 Ready to test! Run: npm start');

