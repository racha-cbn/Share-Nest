import { db } from '@workspace/db';
import { env } from './env';
import { sql } from 'drizzle-orm';

// Re-export the properly typed database instance from lib/db
export { db };

export async function testConnection(): Promise<boolean> {
  try {
    await db.execute(sql`SELECT 1`);
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}
