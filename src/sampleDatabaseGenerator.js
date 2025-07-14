/**
 * Sample Database Generator - Creates sample schema data for testing
 * This simulates what would be fetched from a real MySQL database
 */
class SampleDatabaseGenerator {
  
  /**
   * Generate sample schema data that mimics a real database
   * @returns {Object} Sample schema data
   */
  generateSampleSchema() {
    return {
      schemaName: 'amc_cpa_db',
      tables: [
        {
          id: 'table_users',
          name: 'users',
          comment: 'User accounts and authentication',
          engine: 'InnoDB',
          rowCount: 1250,
          columns: [
            {
              id: 'col_users_id',
              name: 'id',
              dataType: 'INT',
              fullType: 'int(11)',
              nullable: false,
              defaultValue: null,
              autoIncrement: true,
              comment: 'Primary key',
              maxLength: null,
              numericPrecision: 10,
              numericScale: 0,
              position: 1
            },
            {
              id: 'col_users_email',
              name: 'email',
              dataType: 'VARCHAR',
              fullType: 'varchar(255)',
              nullable: false,
              defaultValue: null,
              autoIncrement: false,
              comment: 'User email address',
              maxLength: 255,
              numericPrecision: null,
              numericScale: null,
              position: 2
            },
            {
              id: 'col_users_first_name',
              name: 'first_name',
              dataType: 'VARCHAR',
              fullType: 'varchar(100)',
              nullable: false,
              defaultValue: null,
              autoIncrement: false,
              comment: 'User first name',
              maxLength: 100,
              numericPrecision: null,
              numericScale: null,
              position: 3
            },
            {
              id: 'col_users_last_name',
              name: 'last_name',
              dataType: 'VARCHAR',
              fullType: 'varchar(100)',
              nullable: false,
              defaultValue: null,
              autoIncrement: false,
              comment: 'User last name',
              maxLength: 100,
              numericPrecision: null,
              numericScale: null,
              position: 4
            },
            {
              id: 'col_users_created_at',
              name: 'created_at',
              dataType: 'TIMESTAMP',
              fullType: 'timestamp',
              nullable: false,
              defaultValue: 'CURRENT_TIMESTAMP',
              autoIncrement: false,
              comment: 'Account creation timestamp',
              maxLength: null,
              numericPrecision: null,
              numericScale: null,
              position: 5
            },
            {
              id: 'col_users_updated_at',
              name: 'updated_at',
              dataType: 'TIMESTAMP',
              fullType: 'timestamp',
              nullable: true,
              defaultValue: null,
              autoIncrement: false,
              comment: 'Last update timestamp',
              maxLength: null,
              numericPrecision: null,
              numericScale: null,
              position: 6
            }
          ],
          primaryKeys: ['id'],
          foreignKeys: []
        },
        {
          id: 'table_companies',
          name: 'companies',
          comment: 'Company information',
          engine: 'InnoDB',
          rowCount: 450,
          columns: [
            {
              id: 'col_companies_id',
              name: 'id',
              dataType: 'INT',
              fullType: 'int(11)',
              nullable: false,
              defaultValue: null,
              autoIncrement: true,
              comment: 'Primary key',
              maxLength: null,
              numericPrecision: 10,
              numericScale: 0,
              position: 1
            },
            {
              id: 'col_companies_name',
              name: 'name',
              dataType: 'VARCHAR',
              fullType: 'varchar(200)',
              nullable: false,
              defaultValue: null,
              autoIncrement: false,
              comment: 'Company name',
              maxLength: 200,
              numericPrecision: null,
              numericScale: null,
              position: 2
            },
            {
              id: 'col_companies_tax_id',
              name: 'tax_id',
              dataType: 'VARCHAR',
              fullType: 'varchar(50)',
              nullable: true,
              defaultValue: null,
              autoIncrement: false,
              comment: 'Tax identification number',
              maxLength: 50,
              numericPrecision: null,
              numericScale: null,
              position: 3
            },
            {
              id: 'col_companies_address',
              name: 'address',
              dataType: 'TEXT',
              fullType: 'text',
              nullable: true,
              defaultValue: null,
              autoIncrement: false,
              comment: 'Company address',
              maxLength: 65535,
              numericPrecision: null,
              numericScale: null,
              position: 4
            },
            {
              id: 'col_companies_created_at',
              name: 'created_at',
              dataType: 'TIMESTAMP',
              fullType: 'timestamp',
              nullable: false,
              defaultValue: 'CURRENT_TIMESTAMP',
              autoIncrement: false,
              comment: 'Record creation timestamp',
              maxLength: null,
              numericPrecision: null,
              numericScale: null,
              position: 5
            }
          ],
          primaryKeys: ['id'],
          foreignKeys: []
        },
        {
          id: 'table_user_companies',
          name: 'user_companies',
          comment: 'User-Company relationship mapping',
          engine: 'InnoDB',
          rowCount: 2100,
          columns: [
            {
              id: 'col_user_companies_id',
              name: 'id',
              dataType: 'INT',
              fullType: 'int(11)',
              nullable: false,
              defaultValue: null,
              autoIncrement: true,
              comment: 'Primary key',
              maxLength: null,
              numericPrecision: 10,
              numericScale: 0,
              position: 1
            },
            {
              id: 'col_user_companies_user_id',
              name: 'user_id',
              dataType: 'INT',
              fullType: 'int(11)',
              nullable: false,
              defaultValue: null,
              autoIncrement: false,
              comment: 'Foreign key to users table',
              maxLength: null,
              numericPrecision: 10,
              numericScale: 0,
              position: 2
            },
            {
              id: 'col_user_companies_company_id',
              name: 'company_id',
              dataType: 'INT',
              fullType: 'int(11)',
              nullable: false,
              defaultValue: null,
              autoIncrement: false,
              comment: 'Foreign key to companies table',
              maxLength: null,
              numericPrecision: 10,
              numericScale: 0,
              position: 3
            },
            {
              id: 'col_user_companies_role',
              name: 'role',
              dataType: 'ENUM',
              fullType: "enum('admin','user','viewer')",
              nullable: false,
              defaultValue: 'user',
              autoIncrement: false,
              comment: 'User role in the company',
              maxLength: null,
              numericPrecision: null,
              numericScale: null,
              position: 4
            },
            {
              id: 'col_user_companies_created_at',
              name: 'created_at',
              dataType: 'TIMESTAMP',
              fullType: 'timestamp',
              nullable: false,
              defaultValue: 'CURRENT_TIMESTAMP',
              autoIncrement: false,
              comment: 'Relationship creation timestamp',
              maxLength: null,
              numericPrecision: null,
              numericScale: null,
              position: 5
            }
          ],
          primaryKeys: ['id'],
          foreignKeys: [
            {
              id: 'fk_user_companies_user_id',
              name: 'fk_user_companies_user_id',
              columnName: 'user_id',
              referencedTable: 'users',
              referencedColumn: 'id',
              updateRule: 'CASCADE',
              deleteRule: 'CASCADE'
            },
            {
              id: 'fk_user_companies_company_id',
              name: 'fk_user_companies_company_id',
              columnName: 'company_id',
              referencedTable: 'companies',
              referencedColumn: 'id',
              updateRule: 'CASCADE',
              deleteRule: 'CASCADE'
            }
          ]
        },
        {
          id: 'table_financial_reports',
          name: 'financial_reports',
          comment: 'Financial reports and documents',
          engine: 'InnoDB',
          rowCount: 3200,
          columns: [
            {
              id: 'col_financial_reports_id',
              name: 'id',
              dataType: 'INT',
              fullType: 'int(11)',
              nullable: false,
              defaultValue: null,
              autoIncrement: true,
              comment: 'Primary key',
              maxLength: null,
              numericPrecision: 10,
              numericScale: 0,
              position: 1
            },
            {
              id: 'col_financial_reports_company_id',
              name: 'company_id',
              dataType: 'INT',
              fullType: 'int(11)',
              nullable: false,
              defaultValue: null,
              autoIncrement: false,
              comment: 'Foreign key to companies table',
              maxLength: null,
              numericPrecision: 10,
              numericScale: 0,
              position: 2
            },
            {
              id: 'col_financial_reports_report_type',
              name: 'report_type',
              dataType: 'ENUM',
              fullType: "enum('balance_sheet','income_statement','cash_flow','tax_return')",
              nullable: false,
              defaultValue: null,
              autoIncrement: false,
              comment: 'Type of financial report',
              maxLength: null,
              numericPrecision: null,
              numericScale: null,
              position: 3
            },
            {
              id: 'col_financial_reports_period_start',
              name: 'period_start',
              dataType: 'DATE',
              fullType: 'date',
              nullable: false,
              defaultValue: null,
              autoIncrement: false,
              comment: 'Report period start date',
              maxLength: null,
              numericPrecision: null,
              numericScale: null,
              position: 4
            },
            {
              id: 'col_financial_reports_period_end',
              name: 'period_end',
              dataType: 'DATE',
              fullType: 'date',
              nullable: false,
              defaultValue: null,
              autoIncrement: false,
              comment: 'Report period end date',
              maxLength: null,
              numericPrecision: null,
              numericScale: null,
              position: 5
            },
            {
              id: 'col_financial_reports_total_amount',
              name: 'total_amount',
              dataType: 'DECIMAL',
              fullType: 'decimal(15,2)',
              nullable: true,
              defaultValue: null,
              autoIncrement: false,
              comment: 'Total amount in the report',
              maxLength: null,
              numericPrecision: 15,
              numericScale: 2,
              position: 6
            },
            {
              id: 'col_financial_reports_status',
              name: 'status',
              dataType: 'ENUM',
              fullType: "enum('draft','submitted','approved','rejected')",
              nullable: false,
              defaultValue: 'draft',
              autoIncrement: false,
              comment: 'Report status',
              maxLength: null,
              numericPrecision: null,
              numericScale: null,
              position: 7
            },
            {
              id: 'col_financial_reports_created_by',
              name: 'created_by',
              dataType: 'INT',
              fullType: 'int(11)',
              nullable: false,
              defaultValue: null,
              autoIncrement: false,
              comment: 'User who created the report',
              maxLength: null,
              numericPrecision: 10,
              numericScale: 0,
              position: 8
            },
            {
              id: 'col_financial_reports_created_at',
              name: 'created_at',
              dataType: 'TIMESTAMP',
              fullType: 'timestamp',
              nullable: false,
              defaultValue: 'CURRENT_TIMESTAMP',
              autoIncrement: false,
              comment: 'Report creation timestamp',
              maxLength: null,
              numericPrecision: null,
              numericScale: null,
              position: 9
            }
          ],
          primaryKeys: ['id'],
          foreignKeys: [
            {
              id: 'fk_financial_reports_company_id',
              name: 'fk_financial_reports_company_id',
              columnName: 'company_id',
              referencedTable: 'companies',
              referencedColumn: 'id',
              updateRule: 'CASCADE',
              deleteRule: 'CASCADE'
            },
            {
              id: 'fk_financial_reports_created_by',
              name: 'fk_financial_reports_created_by',
              columnName: 'created_by',
              referencedTable: 'users',
              referencedColumn: 'id',
              updateRule: 'CASCADE',
              deleteRule: 'SET NULL'
            }
          ]
        }
      ],
      relationships: [
        {
          id: 'rel_fk_user_companies_user_id',
          fromTable: 'table_user_companies',
          toTable: 'table_users',
          fromTableName: 'user_companies',
          toTableName: 'users',
          fromColumn: 'user_id',
          toColumn: 'id',
          constraintName: 'fk_user_companies_user_id',
          type: 'foreign_key',
          updateRule: 'CASCADE',
          deleteRule: 'CASCADE'
        },
        {
          id: 'rel_fk_user_companies_company_id',
          fromTable: 'table_user_companies',
          toTable: 'table_companies',
          fromTableName: 'user_companies',
          toTableName: 'companies',
          fromColumn: 'company_id',
          toColumn: 'id',
          constraintName: 'fk_user_companies_company_id',
          type: 'foreign_key',
          updateRule: 'CASCADE',
          deleteRule: 'CASCADE'
        },
        {
          id: 'rel_fk_financial_reports_company_id',
          fromTable: 'table_financial_reports',
          toTable: 'table_companies',
          fromTableName: 'financial_reports',
          toTableName: 'companies',
          fromColumn: 'company_id',
          toColumn: 'id',
          constraintName: 'fk_financial_reports_company_id',
          type: 'foreign_key',
          updateRule: 'CASCADE',
          deleteRule: 'CASCADE'
        },
        {
          id: 'rel_fk_financial_reports_created_by',
          fromTable: 'table_financial_reports',
          toTable: 'table_users',
          fromTableName: 'financial_reports',
          toTableName: 'users',
          fromColumn: 'created_by',
          toColumn: 'id',
          constraintName: 'fk_financial_reports_created_by',
          type: 'foreign_key',
          updateRule: 'CASCADE',
          deleteRule: 'SET NULL'
        }
      ]
    };
  }
}

module.exports = SampleDatabaseGenerator;

