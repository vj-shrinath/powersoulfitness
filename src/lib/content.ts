import { getDb } from '@/db';
import { contents } from '@/db/schema';
import { inArray } from 'drizzle-orm';

export async function getDynamicContent(keys: string[]) {
  if (!keys || keys.length === 0) return {};
  const db = await getDb();
  const results = await db.select().from(contents).where(inArray(contents.key, keys));
  return results.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);
}

export async function getAllDynamicContent() {
  const db = await getDb();
  const results = await db.select().from(contents);
  return results.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);
}
