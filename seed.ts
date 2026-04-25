import { db } from './src/db';
import { users, contents } from './src/db/schema';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('Seeding database...');
  const passwordHash = await bcrypt.hash('admin123', 10);
  
  await db.insert(users).values({
    username: 'admin',
    passwordHash,
  }).onConflictDoNothing();

  await db.insert(contents).values([
    { key: 'home_title', value: 'Discover Your Inner Strength' },
    { key: 'home_subtitle', value: 'Join Power Soul Fitness and unleash your ultimate potential today.' },
    { key: 'hero_image', value: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop', type: 'image' }
  ]).onConflictDoNothing();
  
  console.log('Database seeded!');
}

seed().catch(console.error);
