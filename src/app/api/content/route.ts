import { NextResponse } from 'next/server';

export async function GET() {
  // Simplified backend response
  const content = {
    home_title: { value: 'Unleash Your Inner Power', type: 'text' },
    home_subtitle: { value: 'Join Power Soul Fitness and experience the ultimate transformation in strength, mind, and spirit.', type: 'text' },
    hero_image: { value: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop', type: 'image' },
  };
  
  return NextResponse.json({ success: true, data: content });
}

export async function PUT() {
  // Placeholder for when we re-enable the DB
  return NextResponse.json({ success: true, message: 'Backend reset mode: changes not saved' });
}
