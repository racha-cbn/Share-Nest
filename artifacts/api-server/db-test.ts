import * as pg from 'pg';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testPostgreSQLConnection() {
  console.log('🔍 Testing PostgreSQL connection...');

  // Get DATABASE_URL from environment
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable is required');
    process.exit(1);
  }

  console.log(`📡 Connecting to: ${databaseUrl.replace(/\/\/.*@/, '//***:***@')}`);

  // Test direct PostgreSQL connection
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

    // Test another query
    const versionResult = await client.query('SELECT version()');
    console.log('✅ PostgreSQL version:', versionResult.rows[0].version?.substring(0, 50) + '...');

    await client.end();
    console.log('✅ PostgreSQL client disconnected');

    console.log('\n🎉 SUCCESS: PostgreSQL connection working perfectly!');
    console.log('✅ Direct PostgreSQL connection: OK');
    console.log('✅ SQL query execution: OK');
    console.log('✅ Connection cleanup: OK');

  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error);
    await client.end().catch(() => { });
    process.exit(1);
  }
}

// Run the test
testPostgreSQLConnection()
  .then(() => {
    console.log('\n✅ Test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  });
