import HomeClient from '@/components/HomeClient';
import { getDynamicContent } from '@/lib/content';

export const revalidate = 0; // Or you can use specific revalidate times

export default async function HomePage() {
  const content = await getDynamicContent(['home_title', 'home_subtitle', 'hero_image']);
  
  return <HomeClient content={content} />;
}
