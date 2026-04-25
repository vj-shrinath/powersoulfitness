import { drizzle as drizzleD1 } from 'drizzle-orm/d1';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

export type DbInstance = ReturnType<typeof drizzle<typeof schema>>;

export async function getDb(): Promise<DbInstance> {
  // Production: use Cloudflare D1 via OpenNext's context
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const { env } = await getCloudflareContext({ async: true });
    if (env.DB) {
      // @ts-ignore - D1Database is compatible
      return drizzleD1(env.DB, { schema }) as unknown as DbInstance;
    }
  } catch {
    // Not running in Cloudflare context (local dev)
  }

  // Local development: use libsql with a local SQLite file
  const url = process.env.DATABASE_URL || 'file:local.db';
  const client = createClient({ url });
  return drizzle(client, { schema });
}
