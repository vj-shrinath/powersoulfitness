import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Fetch images from 'gallery' folder
    const { data: files, error: listError } = await supabase.storage
      .from('assets')
      .list('gallery', { sortBy: { column: 'created_at', order: 'desc' }, limit: 20 });

    if (listError) throw listError;

    const images = (files || [])
      .filter(f => f.name !== '.emptyFolderPlaceholder' && !f.name.startsWith('.'))
      .map(f => {
        const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(`gallery/${f.name}`);
        return {
          name: f.name,
          url: publicUrl
        };
      });

    return NextResponse.json({ images });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ images: [], error: String(error) }, { status: 500 });
  }
}
