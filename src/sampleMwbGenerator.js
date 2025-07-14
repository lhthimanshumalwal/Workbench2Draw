const fs = require('fs');
const path = require('path');
const yauzl = require('yauzl');

/**
 * Sample MWB Generator - Creates a sample .mwb file for testing
 * This is a simplified version that creates the basic XML structure
 */
class SampleMwbGenerator {
  
  /**
   * Generate a sample MWB XML content
   * @returns {string} Sample MWB XML content
   */
  generateSampleXML() {
    return `<?xml version="1.0" encoding="UTF-8"?>
<data version="1.0">
  <value type="object" struct-name="workbench.Document" id="BEE3982F-55A1-482A-9A39-9EF580E982E8" struct-checksum="0x1148f9f3">
    <value type="object" struct-name="workbench.physical.Model" id="28F4C6A8-8B8A-4E5A-B7A5-8C5F4E2A9B3D" struct-checksum="0x4e71b96e">
      <value type="object" struct-name="db.mysql.Catalog" id="catalog1" struct-checksum="0x3efd71cc">
        <value type="string" key="name">mydb</value>
        <value type="list" key="schemata">
          <value type="object" struct-name="db.mysql.Schema" id="schema1" struct-checksum="0x9e2c8fee">
            <value type="string" key="name">sample_schema</value>
            <value type="list" key="tables">
              
              <!-- Users Table -->
              <value type="object" struct-name="db.mysql.Table" id="table_users" struct-checksum="0x72e6031d">
                <value type="string" key="name">users</value>
                <value type="list" key="columns">
                  <value type="object" struct-name="db.mysql.Column" id="col_user_id" struct-checksum="0x3e2a8f9c">
                    <value type="string" key="name">id</value>
                    <value type="string" key="simpleType">INT</value>
                    <value type="string" key="length">11</value>
                    <value type="int" key="isNotNull">1</value>
                    <value type="int" key="autoIncrement">1</value>
                  </value>
                  <value type="object" struct-name="db.mysql.Column" id="col_username" struct-checksum="0x3e2a8f9d">
                    <value type="string" key="name">username</value>
                    <value type="string" key="simpleType">VARCHAR</value>
                    <value type="string" key="length">50</value>
                    <value type="int" key="isNotNull">1</value>
                  </value>
                  <value type="object" struct-name="db.mysql.Column" id="col_email" struct-checksum="0x3e2a8f9e">
                    <value type="string" key="name">email</value>
                    <value type="string" key="simpleType">VARCHAR</value>
                    <value type="string" key="length">100</value>
                    <value type="int" key="isNotNull">1</value>
                  </value>
                  <value type="object" struct-name="db.mysql.Column" id="col_created_at" struct-checksum="0x3e2a8f9f">
                    <value type="string" key="name">created_at</value>
                    <value type="string" key="simpleType">TIMESTAMP</value>
                    <value type="string" key="defaultValue">CURRENT_TIMESTAMP</value>
                  </value>
                </value>
                <value type="list" key="indices">
                  <value type="object" struct-name="db.mysql.Index" id="idx_users_primary" struct-checksum="0x81560c95">
                    <value type="string" key="name">PRIMARY</value>
                    <value type="string" key="indexType">PRIMARY</value>
                    <value type="list" key="columns">
                      <value type="object" struct-name="db.mysql.IndexColumn" id="idx_col_user_id" struct-checksum="0x83aacc34">
                        <value type="string" key="referencedColumn">col_user_id</value>
                      </value>
                    </value>
                  </value>
                </value>
              </value>

              <!-- Posts Table -->
              <value type="object" struct-name="db.mysql.Table" id="table_posts" struct-checksum="0x72e6031e">
                <value type="string" key="name">posts</value>
                <value type="list" key="columns">
                  <value type="object" struct-name="db.mysql.Column" id="col_post_id" struct-checksum="0x3e2a8fa0">
                    <value type="string" key="name">id</value>
                    <value type="string" key="simpleType">INT</value>
                    <value type="string" key="length">11</value>
                    <value type="int" key="isNotNull">1</value>
                    <value type="int" key="autoIncrement">1</value>
                  </value>
                  <value type="object" struct-name="db.mysql.Column" id="col_post_user_id" struct-checksum="0x3e2a8fa1">
                    <value type="string" key="name">user_id</value>
                    <value type="string" key="simpleType">INT</value>
                    <value type="string" key="length">11</value>
                    <value type="int" key="isNotNull">1</value>
                  </value>
                  <value type="object" struct-name="db.mysql.Column" id="col_title" struct-checksum="0x3e2a8fa2">
                    <value type="string" key="name">title</value>
                    <value type="string" key="simpleType">VARCHAR</value>
                    <value type="string" key="length">200</value>
                    <value type="int" key="isNotNull">1</value>
                  </value>
                  <value type="object" struct-name="db.mysql.Column" id="col_content" struct-checksum="0x3e2a8fa3">
                    <value type="string" key="name">content</value>
                    <value type="string" key="simpleType">TEXT</value>
                  </value>
                  <value type="object" struct-name="db.mysql.Column" id="col_post_created_at" struct-checksum="0x3e2a8fa4">
                    <value type="string" key="name">created_at</value>
                    <value type="string" key="simpleType">TIMESTAMP</value>
                    <value type="string" key="defaultValue">CURRENT_TIMESTAMP</value>
                  </value>
                </value>
                <value type="list" key="indices">
                  <value type="object" struct-name="db.mysql.Index" id="idx_posts_primary" struct-checksum="0x81560c96">
                    <value type="string" key="name">PRIMARY</value>
                    <value type="string" key="indexType">PRIMARY</value>
                    <value type="list" key="columns">
                      <value type="object" struct-name="db.mysql.IndexColumn" id="idx_col_post_id" struct-checksum="0x83aacc35">
                        <value type="string" key="referencedColumn">col_post_id</value>
                      </value>
                    </value>
                  </value>
                </value>
                <value type="list" key="foreignKeys">
                  <value type="object" struct-name="db.mysql.ForeignKey" id="fk_posts_user" struct-checksum="0x7c9302a5">
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

              <!-- Comments Table -->
              <value type="object" struct-name="db.mysql.Table" id="table_comments" struct-checksum="0x72e6031f">
                <value type="string" key="name">comments</value>
                <value type="list" key="columns">
                  <value type="object" struct-name="db.mysql.Column" id="col_comment_id" struct-checksum="0x3e2a8fa5">
                    <value type="string" key="name">id</value>
                    <value type="string" key="simpleType">INT</value>
                    <value type="string" key="length">11</value>
                    <value type="int" key="isNotNull">1</value>
                    <value type="int" key="autoIncrement">1</value>
                  </value>
                  <value type="object" struct-name="db.mysql.Column" id="col_comment_post_id" struct-checksum="0x3e2a8fa6">
                    <value type="string" key="name">post_id</value>
                    <value type="string" key="simpleType">INT</value>
                    <value type="string" key="length">11</value>
                    <value type="int" key="isNotNull">1</value>
                  </value>
                  <value type="object" struct-name="db.mysql.Column" id="col_comment_user_id" struct-checksum="0x3e2a8fa7">
                    <value type="string" key="name">user_id</value>
                    <value type="string" key="simpleType">INT</value>
                    <value type="string" key="length">11</value>
                    <value type="int" key="isNotNull">1</value>
                  </value>
                  <value type="object" struct-name="db.mysql.Column" id="col_comment_text" struct-checksum="0x3e2a8fa8">
                    <value type="string" key="name">comment_text</value>
                    <value type="string" key="simpleType">TEXT</value>
                    <value type="int" key="isNotNull">1</value>
                  </value>
                  <value type="object" struct-name="db.mysql.Column" id="col_comment_created_at" struct-checksum="0x3e2a8fa9">
                    <value type="string" key="name">created_at</value>
                    <value type="string" key="simpleType">TIMESTAMP</value>
                    <value type="string" key="defaultValue">CURRENT_TIMESTAMP</value>
                  </value>
                </value>
                <value type="list" key="indices">
                  <value type="object" struct-name="db.mysql.Index" id="idx_comments_primary" struct-checksum="0x81560c97">
                    <value type="string" key="name">PRIMARY</value>
                    <value type="string" key="indexType">PRIMARY</value>
                    <value type="list" key="columns">
                      <value type="object" struct-name="db.mysql.IndexColumn" id="idx_col_comment_id" struct-checksum="0x83aacc36">
                        <value type="string" key="referencedColumn">col_comment_id</value>
                      </value>
                    </value>
                  </value>
                </value>
                <value type="list" key="foreignKeys">
                  <value type="object" struct-name="db.mysql.ForeignKey" id="fk_comments_post" struct-checksum="0x7c9302a6">
                    <value type="string" key="name">fk_comments_post_id</value>
                    <value type="string" key="referencedTable">table_posts</value>
                    <value type="list" key="columns">
                      <value type="string">col_comment_post_id</value>
                    </value>
                    <value type="list" key="referencedColumns">
                      <value type="string">col_post_id</value>
                    </value>
                  </value>
                  <value type="object" struct-name="db.mysql.ForeignKey" id="fk_comments_user" struct-checksum="0x7c9302a7">
                    <value type="string" key="name">fk_comments_user_id</value>
                    <value type="string" key="referencedTable">table_users</value>
                    <value type="list" key="columns">
                      <value type="string">col_comment_user_id</value>
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
  }

  /**
   * Create a sample .mwb file for testing
   * Note: This creates a simplified version. Real .mwb files are more complex ZIP archives
   * @param {string} outputPath - Path where to save the sample file
   */
  async createSampleMwbFile(outputPath) {
    const xmlContent = this.generateSampleXML();
    
    // For simplicity, we'll create a text file with the XML content
    // In a real scenario, this would be compressed into a ZIP archive
    fs.writeFileSync(outputPath.replace('.mwb', '.xml'), xmlContent, 'utf8');
    
    console.log(`📝 Sample XML created at: ${outputPath.replace('.mwb', '.xml')}`);
    console.log('Note: This is a simplified XML version. For testing with real .mwb files,');
    console.log('please use an actual MySQL Workbench exported file.');
  }
}

module.exports = SampleMwbGenerator;

