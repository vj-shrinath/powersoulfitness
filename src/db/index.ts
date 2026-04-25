import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { drizzle as drizzleD1 } from 'drizzle-orm/d1';
import * as schema from './schema';

export const runtime = 'edge';

// This function will return the correct database instance based on the environment
export const getDb = () => {
  // 1. Check for Cloudflare D1 Binding (Production)
  // @ts-ignore
  const runtimeEnv = process.env.DB;
  if (runtimeEnv) {
    return drizzleD1(runtimeEnv as any, { schema });
  }

  // 2. Fallback for Local Development or Build Phase
  const url = process.env.DATABASE_URL || 'file:local.db';

  // If we are in the Edge Runtime (like during Cloudflare Build) but have no remote URL,
  // we must avoid using 'file:' as it's not supported.
  // @ts-ignore
  const isEdge = typeof EdgeRuntime !== 'undefined';
  
  if (isEdge && url.startsWith('file:')) {
    // Return a dummy client that won't crash the build process
    // This allows the Next.js build to finish even if it can't connect to a real DB yet
    const dummyClient = createClient({ url: 'https://example.com' });
    return drizzle(dummyClient, { schema });
  }

  const client = createClient({ url });
  return drizzle(client, { schema });
};

// Export a default db instance
export const db = getDb();
