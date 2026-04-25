import { NextResponse } from 'next/server';
import { db } from '@/db';
import { contents } from '@/db/schema';
import { verifyAuth } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allContents = await db.select().from(contents);
    const contentMap = allContents.reduce((acc, curr) => {
      acc[curr.key] = { value: curr.value, type: curr.type };
      return acc;
    }, {} as Record<string, { value: string; type: string }>);
    
    return NextResponse.json({ success: true, data: contentMap });
  } catch (error) {
    console.error('Failed to fetch contents:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { key, value, type } = await request.json();
    
    if (!key || !value) {
      return NextResponse.json({ error: 'Key and value are required' }, { status: 400 });
    }

    await db.insert(contents).values({ key, value, type: type || 'text' })
      .onConflictDoUpdate({
        target: contents.key,
        set: { value, type: type || 'text' }
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update content:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
