// Configuration file for SchemaFlow
module.exports = {
  // Hardcoded file paths as requested
  INPUT_FILE: './samples/sample.xml', // Change to .mwb when you have a real MySQL Workbench file
  OUTPUT_FILE: './output/schema.drawio',
  
  // Draw.io styling configuration
  DRAWIO_CONFIG: {
    TABLE_WIDTH: 200,
    TABLE_HEIGHT: 30,
    COLUMN_HEIGHT: 20,
    GRID_SPACING: 250,
    CANVAS_WIDTH: 2000,
    CANVAS_HEIGHT: 1500,
    
    // Colors
    TABLE_HEADER_COLOR: '#d5e8d4',
    TABLE_BORDER_COLOR: '#82b366',
    COLUMN_COLOR: '#ffffff',
    FOREIGN_KEY_COLOR: '#f8cecc',
    PRIMARY_KEY_COLOR: '#fff2cc'
  },
  
  // MySQL Workbench XML parsing configuration
  MWB_CONFIG: {
    DOCUMENT_FILE: 'document.mwb.xml',
    CATALOG_XPATH: '//value[@struct-name="db.mysql.Catalog"]',
    SCHEMA_XPATH: '//value[@struct-name="db.mysql.Schema"]',
    TABLE_XPATH: '//value[@struct-name="db.mysql.Table"]',
    COLUMN_XPATH: '//value[@struct-name="db.mysql.Column"]'
  }
};
