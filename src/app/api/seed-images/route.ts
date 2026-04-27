import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs'; // Requires Node.js runtime for fs/path — local dev only

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
  // Block this route in production — it reads from the local filesystem
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This route is only available in development.' },
      { status: 403 }
    );
  }

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
        // Use file name (sanitized) as the key — avoids timestamp collisions on fast loops
        const sanitizedName = file.replace(/\s+/g, '_').toLowerCase();
        const fileName = `seeded/${sanitizedName}`;
        const mimeType = imageMimeTypes[path.extname(file).toLowerCase()] || 'image/jpeg';

        const { error } = await supabase.storage
          .from('assets')
          .upload(fileName, fileBuffer, {
            contentType: mimeType,
            upsert: true, // Overwrite if already seeded
          });

        if (error) {
          console.error(`Error uploading ${file}:`, error.message);
          continue;
        }

        const { data: publicUrlData } = supabase.storage.from('assets').getPublicUrl(fileName);
        const publicUrl = publicUrlData.publicUrl;

        uploadedUrls[file] = publicUrl;

        // Collect hero slider images
        if (
          file.toLowerCase().includes('gym-girl-scaled') ||
          file.toLowerCase().includes('fitness image 2')
        ) {
          heroSliderUrls.push(publicUrl);
        }
      }
    }

    // Insert or update the hero slider JSON key
    if (heroSliderUrls.length > 0) {
      await supabase.from('content').upsert({
        key: 'home_hero_slider_images',
        value: JSON.stringify(heroSliderUrls),
        type: 'text',
      });
    }

    // Map specific files to CMS content keys
    if (uploadedUrls['gym-girl-scaled.jpg']) {
      await supabase.from('content').upsert({ key: 'home_hero_bg1', value: uploadedUrls['gym-girl-scaled.jpg'], type: 'image' });
    }
    if (uploadedUrls['fitness image 2.jpg']) {
      await supabase.from('content').upsert({ key: 'home_hero_bg2', value: uploadedUrls['fitness image 2.jpg'], type: 'image' });
    }
    if (uploadedUrls['conquer.jpg']) {
      const conquerUrl = uploadedUrls['conquer.jpg'];
      await supabase.from('content').upsert({ key: 'about_hero_bg', value: conquerUrl, type: 'image' });
      await supabase.from('content').upsert({ key: 'contact_hero_bg', value: conquerUrl, type: 'image' });
      await supabase.from('content').upsert({ key: 'services_hero_bg', value: conquerUrl, type: 'image' });
      await supabase.from('content').upsert({ key: 'home_about_img', value: conquerUrl, type: 'image' });
    }

    return NextResponse.json({ success: true, uploadedUrls, heroSliderUrls });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
