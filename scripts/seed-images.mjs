// scripts/seed-images.mjs
// ─────────────────────────────────────────────────────────────────────────────
// Local-only seeding script — uploads images from public/images/ to Supabase.
// Run with:  node scripts/seed-images.mjs
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Load .env.local manually ─────────────────────────────────────────────────
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const imageMimeTypes = {
  '.gif': 'image/gif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

async function seed() {
  const imagesDir = path.join(__dirname, '..', 'public', 'images');

  if (!fs.existsSync(imagesDir)) {
    console.error('❌ Images directory not found at:', imagesDir);
    process.exit(1);
  }

  const files = fs.readdirSync(imagesDir);
  const uploadedUrls = {};
  const heroSliderUrls = [];

  console.log(`📂 Found ${files.length} files in public/images/`);

  for (const file of files) {
    const filePath = path.join(imagesDir, file);
    const stat = fs.statSync(filePath);

    if (!stat.isFile() || !/\.(jpg|jpeg|png|gif|webp)$/i.test(file)) continue;

    const fileBuffer = fs.readFileSync(filePath);
    const sanitizedName = file.replace(/\s+/g, '_').toLowerCase();
    const fileName = `seeded/${sanitizedName}`;
    const mimeType = imageMimeTypes[path.extname(file).toLowerCase()] ?? 'image/jpeg';

    const { error } = await supabase.storage
      .from('assets')
      .upload(fileName, fileBuffer, { contentType: mimeType, upsert: true });

    if (error) {
      console.error(`  ❌ Failed to upload ${file}:`, error.message);
      continue;
    }

    const { data: publicUrlData } = supabase.storage.from('assets').getPublicUrl(fileName);
    uploadedUrls[file] = publicUrlData.publicUrl;
    console.log(`  ✅ Uploaded: ${file}`);

    if (
      file.toLowerCase().includes('gym-girl-scaled') ||
      file.toLowerCase().includes('fitness image 2')
    ) {
      heroSliderUrls.push(publicUrlData.publicUrl);
    }
  }

  // ── Update CMS content keys ────────────────────────────────────────────────
  if (heroSliderUrls.length > 0) {
    await supabase.from('content').upsert({ key: 'home_hero_slider_images', value: JSON.stringify(heroSliderUrls), type: 'text' });
    console.log('✅ Updated home_hero_slider_images');
  }

  if (uploadedUrls['gym-girl-scaled.jpg']) {
    await supabase.from('content').upsert({ key: 'home_hero_bg1', value: uploadedUrls['gym-girl-scaled.jpg'], type: 'image' });
    console.log('✅ Updated home_hero_bg1');
  }
  if (uploadedUrls['fitness image 2.jpg']) {
    await supabase.from('content').upsert({ key: 'home_hero_bg2', value: uploadedUrls['fitness image 2.jpg'], type: 'image' });
    console.log('✅ Updated home_hero_bg2');
  }
  if (uploadedUrls['conquer.jpg']) {
    const url = uploadedUrls['conquer.jpg'];
    for (const key of ['about_hero_bg', 'contact_hero_bg', 'services_hero_bg', 'home_about_img']) {
      await supabase.from('content').upsert({ key, value: url, type: 'image' });
    }
    console.log('✅ Updated conquer.jpg content keys');
  }

  console.log('\n🎉 Seeding complete!');
}

seed().catch((err) => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});
