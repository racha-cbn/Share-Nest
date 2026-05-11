import { db } from './config/database';

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Simple test query
    const result = await db.execute('SELECT 1 as test');
    console.log('Database test result:', result);
    
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testDatabase();
}
