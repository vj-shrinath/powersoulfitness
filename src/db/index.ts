import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// This is the "Remade" simplified DB index. 
// It returns a dummy client by default to prevent build errors.
const client = createClient({ url: 'file:local.db' });
export const db = drizzle(client, { schema });

export async function getDb() {
  return db;
}
