import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Check for required environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env file');
  process.exit(1);
}

// Initialize Supabase client with service key (for admin operations)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Read the schema file
const schemaPath = path.resolve(__dirname, '../src/config/schema.sql');
const schemaSql = fs.readFileSync(schemaPath, 'utf8');

// Split SQL into separate statements
const statements = schemaSql
  .split(';')
  .map(statement => statement.trim())
  .filter(statement => statement.length > 0);

async function applySchema() {
  console.log('Applying schema to Supabase...');
  
  // Execute each statement separately
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    try {
      console.log(`Executing statement ${i + 1}/${statements.length}`);
      const { error } = await supabase.rpc('pgexecute', { command: statement });
      
      if (error) {
        console.error(`Error executing statement ${i + 1}: ${error.message}`);
        // Continue despite errors to try other statements
      }
    } catch (err) {
      console.error(`Exception on statement ${i + 1}: ${err.message}`);
    }
  }
  
  console.log('Schema application completed. Check for any errors above.');
}

applySchema().catch(err => {
  console.error('Failed to apply schema:', err);
  process.exit(1);
});
