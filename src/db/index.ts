import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// During the Cloudflare build phase, process.env.DB is not available.
// At runtime on Cloudflare, the D1 binding is injected via the Cloudflare env.
// OpenNext handles injecting the D1 binding at runtime automatically.
// For local dev, we fall back to a local SQLite file.

const url = process.env.DATABASE_URL || 'file:local.db';

const client = createClient({ url });
export const db = drizzle(client, { schema });
