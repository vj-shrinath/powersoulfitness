import { drizzle as drizzleD1 } from 'drizzle-orm/d1';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

export type DbInstance = ReturnType<typeof drizzle<typeof schema>>;

export async function getDb(): Promise<DbInstance | null> {
  // 1. Try Cloudflare D1 (Production)
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const { env } = await getCloudflareContext({ async: true });
    
    if (env && (env as any).DB) {
      // @ts-ignore - D1Database is compatible
      return drizzleD1((env as any).DB, { schema }) as unknown as DbInstance;
    }
  } catch (e) {
    console.warn('Cloudflare context not found, falling back...');
  }

  // 2. Try Local SQLite (Development)
  try {
    const url = process.env.DATABASE_URL || 'file:local.db';
    // We only use the 'file:' URL if we are NOT on Cloudflare
    // Cloudflare workers don't support 'file:' protocol
    if (!url.startsWith('file:') || typeof edgeRuntime === 'undefined') {
      const client = createClient({ url });
      return drizzle(client, { schema });
    }
  } catch (e) {
    console.error('Local database initialization failed:', e);
  }

  return null;
}
