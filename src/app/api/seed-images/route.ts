import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs'; // Use Node.js runtime to read local files

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const imageMimeTypes: Record<string, string> = {
  '.gif': 'image/gif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

export async function GET() {
  try {
    const imagesDir = path.join(process.cwd(), 'public', 'images');
    
    if (!fs.existsSync(imagesDir)) {
      return NextResponse.json({ error: 'Images directory not found' }, { status: 404 });
    }

    const files = fs.readdirSync(imagesDir);
    const uploadedUrls: Record<string, string> = {};
    const heroSliderUrls: string[] = [];

    for (const file of files) {
      const filePath = path.join(imagesDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isFile() && /\.(jpg|jpeg|png|gif|webp)$/i.test(file)) {
        const fileBuffer = fs.readFileSync(filePath);
        const fileName = `seeded/${Date.now()}_${file.replace(/\s+/g, '_')}`;
        const mimeType = imageMimeTypes[path.extname(file).toLowerCase()] || 'image/jpeg';

        const { data, error } = await supabase.storage
          .from('assets')
          .upload(fileName, fileBuffer, {
            contentType: mimeType,
            upsert: true,
          });

        if (error) {
          console.error(`Error uploading ${file}:`, error);
          continue;
        }

        const { data: publicUrlData } = supabase.storage.from('assets').getPublicUrl(fileName);
        const publicUrl = publicUrlData.publicUrl;
        
        uploadedUrls[file] = publicUrl;

        // If it looks like a hero image, add it to our array
        if (file.toLowerCase().includes('gym-girl-scaled') || file.toLowerCase().includes('fitness image 2')) {
          heroSliderUrls.push(publicUrl);
        }
      }
    }

    // Insert or update the new slider JSON key
    if (heroSliderUrls.length > 0) {
      await supabase.from('content').upsert({
        key: 'home_hero_slider_images',
        value: JSON.stringify(heroSliderUrls),
        type: 'text'
      });
    }

    // Also update any existing keys if necessary
    if (uploadedUrls['gym-girl-scaled.jpg']) {
      await supabase.from('content').upsert({ key: 'home_hero_bg1', value: uploadedUrls['gym-girl-scaled.jpg'], type: 'image' });
    }
    if (uploadedUrls['fitness image 2.jpg']) {
      await supabase.from('content').upsert({ key: 'home_hero_bg2', value: uploadedUrls['fitness image 2.jpg'], type: 'image' });
    }
    if (uploadedUrls['conquer.jpg']) {
      await supabase.from('content').upsert({ key: 'about_hero_bg', value: uploadedUrls['conquer.jpg'], type: 'image' });
      await supabase.from('content').upsert({ key: 'contact_hero_bg', value: uploadedUrls['conquer.jpg'], type: 'image' });
      await supabase.from('content').upsert({ key: 'services_hero_bg', value: uploadedUrls['conquer.jpg'], type: 'image' });
      await supabase.from('content').upsert({ key: 'home_about_img', value: uploadedUrls['conquer.jpg'], type: 'image' });
    }

    return NextResponse.json({ success: true, uploadedUrls, heroSliderUrls });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
