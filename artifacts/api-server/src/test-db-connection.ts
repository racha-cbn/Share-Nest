import { db } from '@workspace/db';
import { sql } from 'drizzle-orm';

async function testDatabaseConnection() {
  console.log('🔍 Testing PostgreSQL + Drizzle connection...');
  
  try {
    // Test 1: Simple connection
    console.log('Test 1: Testing basic connection...');
    await db.execute(sql`SELECT 1`);
    console.log('✅ Basic connection successful');
    
    // Test 2: Get database info
    console.log('Test 2: Getting database info...');
    const result = await db.execute(sql`
      SELECT 
        version() as db_version,
        current_database() as database_name,
        current_user as current_user
    `);
    console.log('✅ Database info retrieved:', result);
    
    // Test 3: Test schema access
    console.log('Test 3: Testing schema access...');
    const schemaResult = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      LIMIT 5
    `);
    console.log('✅ Schema access successful:', schemaResult);
    
    console.log('🎉 All tests passed! PostgreSQL + Drizzle setup is working correctly.');
    return true;
    
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    return false;
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testDatabaseConnection()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

export { testDatabaseConnection };
