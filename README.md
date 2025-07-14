# SchemaFlow 🔄

**Convert MySQL Workbench (.mwb) files to draw.io (.drawio) format**

SchemaFlow is a simple Node.js application that takes MySQL Workbench reverse-engineered schema files and converts them into draw.io-compatible XML format, allowing you to view and edit your database schemas in diagrams.net.

## Features ✨

- 📊 **Parse MySQL Workbench Files**: Extracts table structures, columns, and relationships from .mwb files
- 🎨 **Generate Draw.io Diagrams**: Creates properly formatted .drawio XML files
- 🔗 **Relationship Visualization**: Automatically draws foreign key relationships between tables
- 🎯 **Smart Positioning**: Arranges tables in a clean grid layout
- 🔑 **Key Highlighting**: Visual indicators for primary keys and foreign keys
- 🚀 **Simple Usage**: Just run `npm start` with hardcoded file paths

## Quick Start 🚀

### Prerequisites
- Node.js 14.0.0 or higher
- A MySQL Workbench .mwb file

### Installation

1. **Clone and setup:**
   ```bash
   git clone <repository-url>
   cd Workbench2Draw
   npm install
   ```

2. **Add your .mwb file:**
   - Place your MySQL Workbench file at: `./samples/sample.mwb`
   - Or update the path in `config.js`

3. **Run the conversion:**
   ```bash
   npm start
   ```

4. **Open in draw.io:**
   - Go to [app.diagrams.net](https://app.diagrams.net)
   - Click "Open Existing Diagram"
   - Select the generated file: `./output/schema.drawio`

## Project Structure 📁

```
SchemaFlow/
├── index.js                 # Main application entry point
├── config.js               # Configuration (file paths, styling)
├── package.json            # Node.js dependencies and scripts
├── src/
│   ├── mwbParser.js        # MySQL Workbench file parser
│   ├── drawioGenerator.js  # Draw.io XML generator
│   └── sampleMwbGenerator.js # Sample data generator for testing
├── samples/                # Input .mwb files go here
├── output/                 # Generated .drawio files
└── test/
    └── test.js            # Test suite
```

## Configuration ⚙️

Edit `config.js` to customize:

```javascript
module.exports = {
  // File paths
  INPUT_FILE: './samples/sample.mwb',
  OUTPUT_FILE: './output/schema.drawio',
  
  // Visual styling
  DRAWIO_CONFIG: {
    TABLE_WIDTH: 200,
    TABLE_HEIGHT: 30,
    GRID_SPACING: 250,
    // Colors for different elements
    TABLE_HEADER_COLOR: '#d5e8d4',
    PRIMARY_KEY_COLOR: '#fff2cc',
    FOREIGN_KEY_COLOR: '#f8cecc'
  }
};
```

## How It Works 🔧

1. **Extraction**: The .mwb file (a ZIP archive) is opened and `document.mwb.xml` is extracted
2. **Parsing**: XML is parsed to extract table definitions, columns, data types, and relationships
3. **Transformation**: Database schema is converted to draw.io's mxGraph XML format
4. **Generation**: Tables are positioned in a grid layout with relationship lines drawn between them

## Sample Output 📊

The generated draw.io diagram includes:

- **Tables** with proper names and styling
- **Columns** with data types and constraints
- **Primary Keys** highlighted in yellow (🔑)
- **Foreign Keys** highlighted in red (🔗)
- **Relationships** drawn as connecting lines between tables
- **Clean Layout** with automatic positioning

## Testing 🧪

Run the test suite:

```bash
npm test
```

This will:
- Generate sample XML data
- Test the conversion classes
- Verify configuration loading

## Supported Features ✅

- ✅ Table extraction with names and columns
- ✅ Column data types, lengths, and constraints
- ✅ Primary key identification and highlighting
- ✅ Foreign key relationships and visualization
- ✅ Automatic table positioning
- ✅ Draw.io compatible XML generation
- ✅ Error handling and logging

## Limitations ⚠️

- Currently supports basic MySQL Workbench schema elements
- Complex constraints and triggers are not yet supported
- Layout is grid-based (not relationship-optimized)
- Requires manual .mwb file placement

## Troubleshooting 🔧

### Common Issues:

1. **"Input file not found"**
   - Ensure your .mwb file is at `./samples/sample.mwb`
   - Or update the path in `config.js`

2. **"Failed to open MWB file"**
   - Verify the file is a valid MySQL Workbench export
   - Check file permissions

3. **"No tables found"**
   - Ensure your .mwb file contains table definitions
   - Check that the schema was properly reverse-engineered in MySQL Workbench

### Debug Mode:
The application provides detailed console output showing:
- Parsing progress
- Number of tables and relationships found
- Generated file location

## Contributing 🤝

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License 📄

MIT License - see LICENSE file for details

## Support 💬

For issues and questions:
1. Check the troubleshooting section above
2. Review the console output for error details
3. Open an issue with your .mwb file structure (if possible)

---

**Made with ❤️ for database developers who love visual schemas!**

