import { getDb } from '@/db';
import { contents } from '@/db/schema';
import { inArray } from 'drizzle-orm';

const FALLBACK_CONTENT: Record<string, string> = {
  home_title: 'Power Soul Fitness',
  home_subtitle: 'Elevate Your Strength. Transform Your Life.',
  hero_image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop',
};

export async function getDynamicContent(keys: string[]) {
  try {
    const db = await getDb();
    if (!db) return FALLBACK_CONTENT;

    const results = await db.select().from(contents).where(inArray(contents.key, keys));
    const contentMap = results.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    // Merge with fallbacks for any missing keys
    return { ...FALLBACK_CONTENT, ...contentMap };
  } catch (error) {
    console.error('getDynamicContent failed:', error);
    return FALLBACK_CONTENT;
  }
}

export async function getAllDynamicContent() {
  try {
    const db = await getDb();
    if (!db) return FALLBACK_CONTENT;

    const results = await db.select().from(contents);
    return results.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
  } catch (error) {
    console.error('getAllDynamicContent failed:', error);
    return FALLBACK_CONTENT;
  }
}
