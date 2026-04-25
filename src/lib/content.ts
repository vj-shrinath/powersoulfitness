// Hardcoded content for the "Remade" backend to guarantee stability
const CONTENT_DATABASE: Record<string, string> = {
  home_title: 'Unleash Your Inner Power',
  home_subtitle: 'Join Power Soul Fitness and experience the ultimate transformation in strength, mind, and spirit.',
  hero_image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop',
};

export async function getDynamicContent(keys: string[]) {
  // Simulating a fast DB fetch
  return keys.reduce((acc, key) => {
    acc[key] = CONTENT_DATABASE[key] || '';
    return acc;
  }, {} as Record<string, string>);
}

export async function getAllDynamicContent() {
  return { ...CONTENT_DATABASE };
}
