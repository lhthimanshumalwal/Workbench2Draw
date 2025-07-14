# SchemaFlow Usage Guide 📖

## Quick Start Example

Here's how to use SchemaFlow to convert your MySQL Workbench schema to draw.io format:

### 1. Prepare Your Files

```bash
# Clone the repository
git clone <your-repo-url>
cd Workbench2Draw

# Install dependencies
npm install
```

### 2. Add Your Schema File

**Option A: Use a real .mwb file (Recommended)**
```bash
# Export your schema from MySQL Workbench as .mwb file
# Place it in the samples directory
cp /path/to/your/schema.mwb ./samples/sample.mwb

# Update config.js to use .mwb file
# Change INPUT_FILE to './samples/sample.mwb'
```

**Option B: Use the sample data (For testing)**
```bash
# Generate sample data
node create-sample.js

# This creates ./samples/sample.xml with sample tables
```

### 3. Run the Conversion

```bash
npm start
```

**Expected Output:**
```
🚀 SchemaFlow - MySQL Workbench to Draw.io Converter
============================================================
📁 Input file: ./samples/sample.xml
📁 Output file: ./output/schema.drawio

Step 1: Parsing MySQL Workbench file...
📖 Parsing MWB file: ./samples/sample.xml
📄 Reading XML file directly...
✅ Successfully parsed 2 tables

📊 Schema Information:
   Schema Name: blog_schema
   Tables: 2
   Relationships: 1

📋 Tables found:
   1. users (3 columns, 1 PK, 0 FK)
   2. posts (3 columns, 1 PK, 1 FK)

🔗 Relationships found:
   1. posts → users

Step 2: Generating draw.io XML...
🎨 Generating draw.io XML...
✅ Generated draw.io XML with 2 tables and 1 relationships

Step 3: Saving output file...
✅ Conversion completed successfully!
📄 Output saved to: ./output/schema.drawio
```

### 4. Open in Draw.io

1. Go to [app.diagrams.net](https://app.diagrams.net)
2. Click **"Open Existing Diagram"**
3. Select the file: `./output/schema.drawio`
4. Your database schema will appear as a visual diagram!

## What You'll See in Draw.io

The generated diagram includes:

- **📊 Tables**: Each table appears as a structured box with the table name as header
- **📝 Columns**: Listed with data types, lengths, and constraints
- **🔑 Primary Keys**: Highlighted in yellow with key icon
- **🔗 Foreign Keys**: Highlighted in red with link icon  
- **➡️ Relationships**: Lines connecting related tables
- **📐 Clean Layout**: Tables arranged in a grid for easy viewing

## Sample Schema Structure

The sample data creates a simple blog schema:

```
┌─────────────┐    ┌─────────────┐
│    users    │    │    posts    │
├─────────────┤    ├─────────────┤
│🔑 id        │◄───┤🔗 user_id   │
│  username   │    │🔑 id        │
│  email      │    │  title      │
└─────────────┘    └─────────────┘
```

## Customization Options

### File Paths
Edit `config.js`:
```javascript
INPUT_FILE: './samples/your-schema.mwb',
OUTPUT_FILE: './output/your-diagram.drawio',
```

### Visual Styling
```javascript
DRAWIO_CONFIG: {
  TABLE_WIDTH: 250,           // Make tables wider
  GRID_SPACING: 300,          // More space between tables
  TABLE_HEADER_COLOR: '#e1d5e7', // Purple headers
  PRIMARY_KEY_COLOR: '#d4edda',   // Green primary keys
}
```

## Troubleshooting

### Common Issues

**❌ "Input file not found"**
```bash
# Check if file exists
ls -la ./samples/

# Create sample data if needed
node create-sample.js
```

**❌ "No tables found"**
- Verify your .mwb file contains table definitions
- Check that you exported the schema correctly from MySQL Workbench
- Try with the sample data first: `node create-sample.js`

**❌ "Failed to open MWB file"**
- Ensure the file is a valid MySQL Workbench export
- Check file permissions: `chmod 644 ./samples/sample.mwb`

### Debug Mode

The application provides detailed logging. Look for:
- ✅ Success messages (green checkmarks)
- ⚠️ Warning messages (yellow triangles)  
- ❌ Error messages (red X marks)

## Advanced Usage

### Multiple Schemas
To convert multiple schemas:

```bash
# Update config.js for each schema
sed -i 's/sample1.mwb/sample2.mwb/' config.js
npm start

# Or create a batch script
for file in samples/*.mwb; do
  # Update config and run conversion
done
```

### Integration with CI/CD
```yaml
# .github/workflows/schema-docs.yml
name: Generate Schema Diagrams
on: [push]
jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm start
      - uses: actions/upload-artifact@v2
        with:
          name: schema-diagrams
          path: output/*.drawio
```

## Next Steps

1. **📝 Edit in Draw.io**: Open the generated file and customize colors, add notes, rearrange tables
2. **📤 Export**: Save as PNG, PDF, or other formats from draw.io
3. **📚 Documentation**: Include the diagrams in your project documentation
4. **🔄 Automation**: Set up automatic conversion when schema changes

---

**Happy diagramming! 🎨**

