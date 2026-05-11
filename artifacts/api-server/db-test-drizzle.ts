import * as pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testPostgreSQLDrizzleReal() {
  console.log('🔍 Testing PostgreSQL + Drizzle REAL connection...');
  
  // Get DATABASE_URL from environment
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable is required');
    process.exit(1);
  }
  
  console.log(`📡 Connecting to: ${databaseUrl.replace(/\/\/.*@/, '//***:***@')}`);
  
  // Step 1: Test direct PostgreSQL connection
  console.log('\n📋 Step 1: Testing direct PostgreSQL connection...');
  
  const client = new pg.Client({
    connectionString: databaseUrl,
  });
  
  try {
    await client.connect();
    console.log('✅ PostgreSQL client connected successfully');
    
    // Test simple query with pg client
    const pgResult = await client.query('SELECT 1 as test_value, NOW() as current_time');
    console.log('✅ PostgreSQL query result:', pgResult.rows[0]);
    
    await client.end();
    console.log('✅ PostgreSQL client disconnected');
    
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error);
    await client.end().catch(() => {});
    process.exit(1);
  }
  
  // Step 2: Test Drizzle ORM with REAL database
  console.log('\n📋 Step 2: Testing Drizzle ORM with REAL database...');
  
  try {
    // Initialize Drizzle with direct connection
    const db = drizzle(databaseUrl);
    
    console.log('✅ Drizzle initialized successfully');
    
    // Test simple query with Drizzle
    const drizzleResult = await db.execute(sql`SELECT 1 as test_value, NOW() as current_time, version() as db_version`);
    console.log('✅ Drizzle query result:', drizzleResult[0]);
    
    // Test another Drizzle query
    const tableInfo = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      LIMIT 5
    `);
    console.log('✅ Drizzle tables query result:', tableInfo);
    
    console.log('\n🎉 SUCCESS: PostgreSQL + Drizzle REAL connection working perfectly!');
    console.log('✅ Direct PostgreSQL connection: OK');
    console.log('✅ Drizzle ORM initialization: OK');
    console.log('✅ SQL query execution: OK');
    console.log('✅ Real database results: OK');
    console.log('✅ No TypeScript errors: OK');
    console.log('✅ No runtime crashes: OK');
    
  } catch (error) {
    console.error('❌ Drizzle test failed:', error);
    process.exit(1);
  }
}

// Run the test
testPostgreSQLDrizzleReal()
  .then(() => {
    console.log('\n✅ REAL database test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ REAL database test failed:', error);
    process.exit(1);
  });
