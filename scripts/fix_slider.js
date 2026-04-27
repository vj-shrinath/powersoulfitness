import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fix() {
  const { data } = await supabase.from('content').select('value').eq('key', 'home_hero_slider_images').single();
  
  let images = [];
  if (data && data.value) {
    try {
       images = JSON.parse(data.value);
    } catch(e) {}
  }
  
  const defaults = ['/images/gym-girl-scaled.jpg', '/images/fitness image 2.jpg'];
  const newArray = [...new Set([...defaults, ...images])];
  
  await supabase.from('content').upsert({
    key: 'home_hero_slider_images',
    value: JSON.stringify(newArray),
    type: 'text'
  });
  
  console.log("Fixed!");
}

fix();
