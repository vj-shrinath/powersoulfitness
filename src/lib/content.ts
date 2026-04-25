import { db } from '@/db';
import { contents } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';

export async function getDynamicContent(keys: string[]) {
  if (!keys || keys.length === 0) return {};
  
  const results = await db.select().from(contents).where(inArray(contents.key, keys));
  
  const contentMap = results.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);
  
  return contentMap;
}

export async function getAllDynamicContent() {
  const results = await db.select().from(contents);
  const contentMap = results.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);
  
  return contentMap;
}
