# SchemaFlow 🔄

**Convert MySQL Database Schema to draw.io (.drawio) format**

SchemaFlow is a simple Node.js application that connects directly to your MySQL database, fetches the complete schema information, and converts it into draw.io-compatible XML format, allowing you to view and edit your database schemas in diagrams.net.

## Features ✨

- 🔗 **Direct Database Connection**: Connects to live MySQL databases using DATABASE_URL
- 📊 **Complete Schema Extraction**: Fetches tables, columns, data types, constraints, and relationships
- 🎨 **Professional ERD Generation**: Creates properly formatted .drawio XML files
- 🔗 **Relationship Visualization**: Automatically draws foreign key relationships between tables
- 🎯 **Smart Positioning**: Arranges tables in a clean grid layout
- 🔑 **Key Highlighting**: Visual indicators for primary keys and foreign keys
- 🧪 **Test Mode**: Includes sample data for testing without database connection
- 🚀 **Simple Usage**: Just run `npm start` with DATABASE_URL configuration

## Quick Start 🚀

### Prerequisites
- Node.js 14.0.0 or higher
- MySQL database access (or use test mode)

### Installation

1. **Clone and setup:**
   ```bash
   git clone <repository-url>
   cd Workbench2Draw
   npm install
   ```

2. **Configure database connection:**
   ```bash
   # Edit .env file
   DATABASE_URL="mysql://username:password@host:port/database"
   
   # Or use test mode (default)
   TEST_MODE=true
   ```

3. **Run the conversion:**
   ```bash
   npm start
   ```

4. **Open in draw.io:**
   - Go to [app.diagrams.net](https://app.diagrams.net)
   - Click "Open Existing Diagram"
   - Select the generated file: `./output/database-schema.drawio`

## Project Structure 📁

```
SchemaFlow/
├── index.js                      # Main application entry point
├── config.js                     # Configuration (database, styling)
├── .env                          # Environment variables (DATABASE_URL, etc.)
├── package.json                  # Node.js dependencies and scripts
├── src/
│   ├── mysqlSchemaFetcher.js     # MySQL database schema fetcher
│   ├── drawioGenerator.js        # Draw.io XML generator
│   └── sampleDatabaseGenerator.js # Sample data generator for testing
├── output/                       # Generated .drawio files
└── test/
    └── test.js                  # Test suite
```

## Configuration ⚙️

### Environment Variables (.env file)

```bash
# Database connection string
DATABASE_URL="mysql://username:password@host:port/database"

# Test mode - set to true to use sample data instead of real database
TEST_MODE=true

# Output file path
OUTPUT_FILE="./output/database-schema.drawio"
```

### Visual Styling (config.js)

```javascript
DRAWIO_CONFIG: {
  TABLE_WIDTH: 200,
  TABLE_HEIGHT: 30,
  GRID_SPACING: 250,
  // Colors for different elements
  TABLE_HEADER_COLOR: '#d5e8d4',
  PRIMARY_KEY_COLOR: '#fff2cc',
  FOREIGN_KEY_COLOR: '#f8cecc'
}
```

## How It Works 🔧

1. **Connection**: Connects to your MySQL database using the provided DATABASE_URL
2. **Schema Extraction**: Queries INFORMATION_SCHEMA to fetch tables, columns, constraints, and relationships
3. **Data Processing**: Processes the raw schema data into a structured format
4. **XML Generation**: Converts the schema into draw.io's mxGraph XML format
5. **Visualization**: Tables are positioned in a grid layout with relationship lines drawn between them

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
