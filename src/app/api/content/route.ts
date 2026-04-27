import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({
      content: [],
      banners: [],
      sections: [],
      services: []
    })
  }

  const supabase = await createClient()
  
  const [content, banners, sections, services] = await Promise.all([
    supabase.from('content').select('*'),
    supabase.from('banners').select('*').eq('active', true),
    supabase.from('sections').select('*').order('order'),
    supabase.from('services').select('*').order('order')
  ])

  return NextResponse.json({
    content: content.data || [],
    banners: banners.data || [],
    sections: sections.data || [],
    services: services.data || []
  })
}
