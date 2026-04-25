import HomeClient from '@/components/HomeClient';
import { getDynamicContent } from '@/lib/content';

export const revalidate = 0;

export default async function Home() {
  const content = await getDynamicContent(['home_title', 'home_subtitle', 'hero_image']);
  return <HomeClient content={content} />;
}
