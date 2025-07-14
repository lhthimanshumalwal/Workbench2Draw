const yauzl = require('yauzl');
const xml2js = require('xml2js');
const fs = require('fs');
const path = require('path');

class MWBParser {
  constructor() {
    this.parser = new xml2js.Parser({
      explicitArray: false,
      mergeAttrs: true,
      ignoreAttrs: false
    });
  }

  /**
   * Parse MySQL Workbench .mwb file
   * @param {string} mwbFilePath - Path to the .mwb file
   * @returns {Promise<Object>} Parsed schema data
   */
  async parseMWBFile(mwbFilePath) {
    try {
      console.log(`📖 Parsing MWB file: ${mwbFilePath}`);
      
      let xmlContent;
      
      // Check if it's an XML file (for testing) or MWB file
      if (mwbFilePath.endsWith('.xml')) {
        console.log('📄 Reading XML file directly...');
        xmlContent = fs.readFileSync(mwbFilePath, 'utf8');
      } else {
        // Extract XML from MWB file (it's a ZIP archive)
        xmlContent = await this.extractXMLFromMWB(mwbFilePath);
      }
      
      // Parse XML content
      const parsedXML = await this.parseXML(xmlContent);
      
      // Extract schema information
      const schemaData = this.extractSchemaData(parsedXML);
      
      console.log(`✅ Successfully parsed ${schemaData.tables.length} tables`);
      return schemaData;
      
    } catch (error) {
      console.error('❌ Error parsing MWB file:', error.message);
      throw error;
    }
  }

  /**
   * Extract XML content from MWB file (ZIP archive)
   * @param {string} mwbFilePath - Path to MWB file
   * @returns {Promise<string>} XML content
   */
  extractXMLFromMWB(mwbFilePath) {
    return new Promise((resolve, reject) => {
      yauzl.open(mwbFilePath, { lazyEntries: true }, (err, zipfile) => {
        if (err) {
          reject(new Error(`Failed to open MWB file: ${err.message}`));
          return;
        }

        zipfile.readEntry();
        
        zipfile.on('entry', (entry) => {
          if (entry.fileName === 'document.mwb.xml') {
            zipfile.openReadStream(entry, (err, readStream) => {
              if (err) {
                reject(new Error(`Failed to read XML from MWB: ${err.message}`));
                return;
              }

              let xmlContent = '';
              readStream.on('data', (chunk) => {
                xmlContent += chunk.toString();
              });

              readStream.on('end', () => {
                resolve(xmlContent);
              });

              readStream.on('error', (err) => {
                reject(new Error(`Error reading XML stream: ${err.message}`));
              });
            });
          } else {
            zipfile.readEntry();
          }
        });

        zipfile.on('end', () => {
          reject(new Error('document.mwb.xml not found in MWB file'));
        });

        zipfile.on('error', (err) => {
          reject(new Error(`ZIP file error: ${err.message}`));
        });
      });
    });
  }

  /**
   * Parse XML content
   * @param {string} xmlContent - XML string
   * @returns {Promise<Object>} Parsed XML object
   */
  async parseXML(xmlContent) {
    try {
      return await this.parser.parseStringPromise(xmlContent);
    } catch (error) {
      throw new Error(`XML parsing failed: ${error.message}`);
    }
  }

  /**
   * Extract schema data from parsed XML
   * @param {Object} parsedXML - Parsed XML object
   * @returns {Object} Schema data with tables and relationships
   */
  extractSchemaData(parsedXML) {
    const schemaData = {
      tables: [],
      relationships: [],
      schemaName: 'Database Schema'
    };

    try {
      // Navigate through the MySQL Workbench XML structure
      const data = parsedXML.data;
      if (!data || !data.value) {
        throw new Error('Invalid MWB XML structure');
      }

      // Find the catalog
      const catalog = this.findValueByStructName(data.value, 'db.mysql.Catalog');
      if (!catalog) {
        throw new Error('No catalog found in MWB file');
      }

      // Find schemas within the catalog
      const schemas = this.findValuesByStructName(catalog, 'db.mysql.Schema');
      if (!schemas || schemas.length === 0) {
        throw new Error('No schemas found in MWB file');
      }

      // Process the first schema (assuming single schema)
      const schema = Array.isArray(schemas) ? schemas[0] : schemas;
      schemaData.schemaName = this.getValueByKey(schema, 'name') || 'Database Schema';

      // Extract tables
      const tables = this.findValuesByStructName(schema, 'db.mysql.Table');
      if (tables) {
        const tableArray = Array.isArray(tables) ? tables : [tables];
        schemaData.tables = tableArray.map(table => this.parseTable(table));
      }

      // Extract relationships (foreign keys)
      schemaData.relationships = this.extractRelationships(schemaData.tables);

      return schemaData;

    } catch (error) {
      throw new Error(`Schema extraction failed: ${error.message}`);
    }
  }

  /**
   * Parse individual table data
   * @param {Object} tableXML - Table XML object
   * @returns {Object} Table data
   */
  parseTable(tableXML) {
    const table = {
      id: this.getValueByKey(tableXML, 'id') || this.generateId(),
      name: this.getValueByKey(tableXML, 'name') || 'Unknown Table',
      columns: [],
      primaryKeys: [],
      foreignKeys: []
    };

    // Extract columns
    const columns = this.findValuesByStructName(tableXML, 'db.mysql.Column');
    if (columns) {
      const columnArray = Array.isArray(columns) ? columns : [columns];
      table.columns = columnArray.map(column => this.parseColumn(column));
    }

    // Extract primary keys
    const primaryKey = this.findValueByStructName(tableXML, 'db.mysql.Index');
    if (primaryKey && this.getValueByKey(primaryKey, 'indexType') === 'PRIMARY') {
      const pkColumns = this.findValuesByStructName(primaryKey, 'db.mysql.IndexColumn');
      if (pkColumns) {
        const pkArray = Array.isArray(pkColumns) ? pkColumns : [pkColumns];
        table.primaryKeys = pkArray.map(pk => this.getValueByKey(pk, 'referencedColumn'));
      }
    }

    // Extract foreign keys
    const foreignKeys = this.findValuesByStructName(tableXML, 'db.mysql.ForeignKey');
    if (foreignKeys) {
      const fkArray = Array.isArray(foreignKeys) ? foreignKeys : [foreignKeys];
      table.foreignKeys = fkArray.map(fk => this.parseForeignKey(fk));
    }

    return table;
  }

  /**
   * Parse individual column data
   * @param {Object} columnXML - Column XML object
   * @returns {Object} Column data
   */
  parseColumn(columnXML) {
    return {
      id: this.getValueByKey(columnXML, 'id') || this.generateId(),
      name: this.getValueByKey(columnXML, 'name') || 'unknown_column',
      dataType: this.getValueByKey(columnXML, 'simpleType') || 'VARCHAR',
      length: this.getValueByKey(columnXML, 'length') || '',
      nullable: this.getValueByKey(columnXML, 'isNotNull') !== '1',
      autoIncrement: this.getValueByKey(columnXML, 'autoIncrement') === '1',
      defaultValue: this.getValueByKey(columnXML, 'defaultValue') || ''
    };
  }

  /**
   * Parse foreign key data
   * @param {Object} fkXML - Foreign key XML object
   * @returns {Object} Foreign key data
   */
  parseForeignKey(fkXML) {
    return {
      id: this.getValueByKey(fkXML, 'id') || this.generateId(),
      name: this.getValueByKey(fkXML, 'name') || 'FK',
      referencedTable: this.getValueByKey(fkXML, 'referencedTable'),
      columns: this.getValueByKey(fkXML, 'columns') || [],
      referencedColumns: this.getValueByKey(fkXML, 'referencedColumns') || []
    };
  }

  /**
   * Extract relationships between tables
   * @param {Array} tables - Array of table objects
   * @returns {Array} Array of relationship objects
   */
  extractRelationships(tables) {
    const relationships = [];
    
    tables.forEach(table => {
      table.foreignKeys.forEach(fk => {
        if (fk.referencedTable) {
          relationships.push({
            id: this.generateId(),
            fromTable: table.id,
            toTable: fk.referencedTable,
            fromTableName: table.name,
            toTableName: this.findTableNameById(tables, fk.referencedTable),
            type: 'foreign_key',
            name: fk.name
          });
        }
      });
    });

    return relationships;
  }

  /**
   * Helper methods
   */
  findValueByStructName(obj, structName) {
    if (!obj) return null;
    
    if (Array.isArray(obj)) {
      for (const item of obj) {
        const result = this.findValueByStructName(item, structName);
        if (result) return result;
      }
    } else if (typeof obj === 'object') {
      if (obj['struct-name'] === structName) {
        return obj;
      }
      
      for (const key in obj) {
        const result = this.findValueByStructName(obj[key], structName);
        if (result) return result;
      }
    }
    
    return null;
  }

  findValuesByStructName(obj, structName) {
    const results = [];
    
    const search = (obj) => {
      if (!obj) return;
      
      if (Array.isArray(obj)) {
        obj.forEach(item => search(item));
      } else if (typeof obj === 'object') {
        if (obj['struct-name'] === structName) {
          results.push(obj);
        }
        
        Object.values(obj).forEach(value => search(value));
      }
    };
    
    search(obj);
    return results.length > 0 ? results : null;
  }

  getValueByKey(obj, key) {
    if (!obj || !obj.value) return null;
    
    const values = Array.isArray(obj.value) ? obj.value : [obj.value];
    const found = values.find(v => v.key === key);
    return found ? found._ : null;
  }

  findTableNameById(tables, id) {
    const table = tables.find(t => t.id === id);
    return table ? table.name : 'Unknown Table';
  }

  generateId() {
    return 'id_' + Math.random().toString(36).substr(2, 9);
  }
}

module.exports = MWBParser;
