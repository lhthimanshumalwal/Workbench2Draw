const config = require('../config');

class DrawioGenerator {
  constructor() {
    this.cellId = 1;
    this.config = config.DRAWIO_CONFIG;
  }

  /**
   * Generate draw.io XML from schema data
   * @param {Object} schemaData - Parsed schema data
   * @returns {string} Draw.io XML content
   */
  generateDrawioXML(schemaData) {
    console.log('🎨 Generating draw.io XML...');
    
    const tables = schemaData.tables || [];
    const relationships = schemaData.relationships || [];
    
    // Calculate positions for tables
    const tablePositions = this.calculateTablePositions(tables);
    
    // Generate XML structure
    const xml = this.buildDrawioXML(tables, relationships, tablePositions, schemaData.schemaName);
    
    console.log(`✅ Generated draw.io XML with ${tables.length} tables and ${relationships.length} relationships`);
    return xml;
  }

  /**
   * Calculate positions for tables in a grid layout
   * @param {Array} tables - Array of table objects
   * @returns {Object} Object mapping table IDs to positions
   */
  calculateTablePositions(tables) {
    const positions = {};
    const cols = Math.ceil(Math.sqrt(tables.length));
    
    tables.forEach((table, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      
      positions[table.id] = {
        x: col * this.config.GRID_SPACING + 50,
        y: row * this.config.GRID_SPACING + 50,
        width: this.config.TABLE_WIDTH,
        height: this.calculateTableHeight(table)
      };
    });
    
    return positions;
  }

  /**
   * Calculate table height based on number of columns
   * @param {Object} table - Table object
   * @returns {number} Table height
   */
  calculateTableHeight(table) {
    const headerHeight = this.config.TABLE_HEIGHT;
    const columnHeight = table.columns.length * this.config.COLUMN_HEIGHT;
    return headerHeight + columnHeight + 10; // 10px padding
  }

  /**
   * Build complete draw.io XML structure
   * @param {Array} tables - Array of table objects
   * @param {Array} relationships - Array of relationship objects
   * @param {Object} positions - Table positions
   * @param {string} schemaName - Schema name
   * @returns {string} Complete XML
   */
  buildDrawioXML(tables, relationships, positions, schemaName) {
    const cells = [];
    
    // Add root cell
    cells.push(this.createRootCell());
    
    // Add default parent cell
    cells.push(this.createDefaultParentCell());
    
    // Add table cells
    tables.forEach(table => {
      const position = positions[table.id];
      const tableCells = this.createTableCells(table, position);
      cells.push(...tableCells);
    });
    
    // Add relationship cells
    relationships.forEach(relationship => {
      const relationshipCell = this.createRelationshipCell(relationship, positions);
      if (relationshipCell) {
        cells.push(relationshipCell);
      }
    });
    
    // Build complete XML
    return this.wrapInDrawioStructure(cells, schemaName);
  }

  /**
   * Create root cell
   * @returns {string} Root cell XML
   */
  createRootCell() {
    return `<mxCell id="0"/>`;
  }

  /**
   * Create default parent cell
   * @returns {string} Default parent cell XML
   */
  createDefaultParentCell() {
    return `<mxCell id="1" parent="0"/>`;
  }

  /**
   * Create table cells (header + columns)
   * @param {Object} table - Table object
   * @param {Object} position - Position object
   * @returns {Array} Array of cell XML strings
   */
  createTableCells(table, position) {
    const cells = [];
    const tableId = this.getNextCellId();
    
    // Table header cell
    const headerCell = this.createTableHeaderCell(table, position, tableId);
    cells.push(headerCell);
    
    // Column cells
    table.columns.forEach((column, index) => {
      const columnCell = this.createColumnCell(column, table, position, index, tableId);
      cells.push(columnCell);
    });
    
    return cells;
  }

  /**
   * Create table header cell
   * @param {Object} table - Table object
   * @param {Object} position - Position object
   * @param {string} tableId - Table cell ID
   * @returns {string} Header cell XML
   */
  createTableHeaderCell(table, position, tableId) {
    const style = `swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=${this.config.TABLE_HEIGHT};horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;fillColor=${this.config.TABLE_HEADER_COLOR};strokeColor=${this.config.TABLE_BORDER_COLOR};`;
    
    return `<mxCell id="${tableId}" value="${this.escapeXML(table.name)}" style="${style}" vertex="1" parent="1">
      <mxGeometry x="${position.x}" y="${position.y}" width="${position.width}" height="${position.height}" as="geometry"/>
    </mxCell>`;
  }

  /**
   * Create column cell
   * @param {Object} column - Column object
   * @param {Object} table - Table object
   * @param {Object} position - Position object
   * @param {number} index - Column index
   * @param {string} parentId - Parent table cell ID
   * @returns {string} Column cell XML
   */
  createColumnCell(column, table, position, index, parentId) {
    const cellId = this.getNextCellId();
    const isPrimaryKey = table.primaryKeys.includes(column.name);
    const isForeignKey = table.foreignKeys.some(fk => 
      fk.columnName === column.name
    );
    
    // Determine column styling
    let fillColor = this.config.COLUMN_COLOR;
    let prefix = '';
    
    if (isPrimaryKey) {
      fillColor = this.config.PRIMARY_KEY_COLOR;
      prefix = '🔑 ';
    } else if (isForeignKey) {
      fillColor = this.config.FOREIGN_KEY_COLOR;
      prefix = '🔗 ';
    }
    
    const nullable = column.nullable ? '' : ' NOT NULL';
    const autoInc = column.autoIncrement ? ' AUTO_INCREMENT' : '';
    
    // Use fullType if available, otherwise construct from dataType
    let dataType;
    if (column.fullType) {
      dataType = column.fullType.toUpperCase();
    } else if (column.maxLength) {
      dataType = `${column.dataType}(${column.maxLength})`;
    } else if (column.numericPrecision && column.numericScale) {
      dataType = `${column.dataType}(${column.numericPrecision},${column.numericScale})`;
    } else if (column.numericPrecision) {
      dataType = `${column.dataType}(${column.numericPrecision})`;
    } else {
      dataType = column.dataType;
    }
    
    const columnText = `${prefix}${column.name}: ${dataType}${nullable}${autoInc}`;
    
    const style = `text;strokeColor=none;fillColor=${fillColor};align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;`;
    
    return `<mxCell id="${cellId}" value="${this.escapeXML(columnText)}" style="${style}" vertex="1" parent="${parentId}">
      <mxGeometry y="${this.config.TABLE_HEIGHT + (index * this.config.COLUMN_HEIGHT)}" width="${position.width}" height="${this.config.COLUMN_HEIGHT}" as="geometry"/>
    </mxCell>`;
  }

  /**
   * Create relationship cell (connection line)
   * @param {Object} relationship - Relationship object
   * @param {Object} positions - Table positions
   * @returns {string|null} Relationship cell XML or null if tables not found
   */
  createRelationshipCell(relationship, positions) {
    const fromPos = positions[relationship.fromTable];
    const toPos = positions[relationship.toTable];
    
    if (!fromPos || !toPos) {
      console.warn(`⚠️ Could not find positions for relationship: ${relationship.name}`);
      return null;
    }
    
    const cellId = this.getNextCellId();
    
    // Calculate connection points
    const sourceX = fromPos.x + fromPos.width;
    const sourceY = fromPos.y + (fromPos.height / 2);
    const targetX = toPos.x;
    const targetY = toPos.y + (toPos.height / 2);
    
    const style = `edgeStyle=entityRelationEdgeStyle;fontSize=12;html=1;endArrow=ERzeroToMany;startArrow=ERone;strokeWidth=2;`;
    
    return `<mxCell id="${cellId}" value="${this.escapeXML(relationship.name || 'FK')}" style="${style}" edge="1" parent="1" source="${relationship.fromTable}" target="${relationship.toTable}">
      <mxGeometry width="100" height="100" relative="1" as="geometry">
        <mxPoint x="${sourceX}" y="${sourceY}" as="sourcePoint"/>
        <mxPoint x="${targetX}" y="${targetY}" as="targetPoint"/>
      </mxGeometry>
    </mxCell>`;
  }

  /**
   * Wrap cells in complete draw.io XML structure
   * @param {Array} cells - Array of cell XML strings
   * @param {string} schemaName - Schema name
   * @returns {string} Complete draw.io XML
   */
  wrapInDrawioStructure(cells, schemaName) {
    const cellsXML = cells.join('\n    ');
    
    return `<mxfile host="app.diagrams.net" modified="${new Date().toISOString()}" agent="SchemaFlow" version="1.0.0" etag="schemaflow" type="device">
  <diagram id="schema-diagram" name="${this.escapeXML(schemaName)}">
    <mxGraphModel dx="1422" dy="794" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="${this.config.CANVAS_WIDTH}" pageHeight="${this.config.CANVAS_HEIGHT}" math="0" shadow="0">
      <root>
        ${cellsXML}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;
  }

  /**
   * Get next unique cell ID
   * @returns {string} Cell ID
   */
  getNextCellId() {
    return `cell-${this.cellId++}`;
  }

  /**
   * Escape XML special characters
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeXML(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}

module.exports = DrawioGenerator;
