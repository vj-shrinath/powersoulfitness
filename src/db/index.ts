import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { drizzle as drizzleD1 } from 'drizzle-orm/d1';
import * as schema from './schema';

// This function will return the correct database instance based on the environment
export const getDb = () => {
  // Check if we are running in a Cloudflare environment with D1 binding
  // @ts-ignore
  const runtimeEnv = process.env.DB;
  
  if (runtimeEnv) {
    return drizzleD1(runtimeEnv as any, { schema });
  }
  
  // Fallback to local SQLite for development
  const client = createClient({
    url: process.env.DATABASE_URL || 'file:local.db',
  });
  
  return drizzle(client, { schema });
};

// Export a default db instance for easy use
export const db = getDb();
