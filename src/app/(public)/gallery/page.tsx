import { createClient } from '@/lib/supabase-server';
import Image from 'next/image';

export const revalidate = 0;
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export const metadata = {
  title: 'Gallery | Power Soul Fitness',
  description: 'Glimpses of Power Soul Fitness Gym - Equipment, Facilities and Transformations.',
};

export default async function GalleryPage() {
  const supabase = await createClient();
  
  // Debug: List root to see folders
  const { data: rootFiles } = await supabase.storage.from('assets').list();
  console.log('Bucket Root:', rootFiles?.map(f => f.name));

  // Fetch images from 'gallery' folder
  const { data: files, error } = await supabase.storage
    .from('assets')
    .list('gallery', { sortBy: { column: 'created_at', order: 'desc' } });

  const images = (files || [])
    .filter(f => f.name !== '.emptyFolderPlaceholder' && !f.name.startsWith('.'))
    .map(f => {
      const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(`gallery/${f.name}`);
      return {
        name: f.name,
        url: publicUrl
      };
    });

  return (
    <div className="pt-32 pb-20 min-h-screen bg-[#050505] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-accent/10 rounded-full blur-[100px]" />
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center mb-24">
          <div className="inline-block px-4 py-1.5 mb-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="text-accent text-xs font-bold tracking-[0.3em] uppercase">Visual Excellence</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-black mb-10 tracking-tighter mt-12">
            <span className="text-white">GYM</span> <span className="gradient-text">GALLERY</span>
          </h1>
          <p className="text-text-grey max-w-2xl mx-auto text-lg leading-relaxed px-4">
            Step into the arena where transformations happen. Explore our elite equipment, 
            premium facilities, and the energy of Power Soul Fitness.
          </p>
        </div>

        {images.length === 0 ? (
          <div className="text-center py-32 bg-white/[0.02] backdrop-blur-xl rounded-[2rem] border border-white/5 shadow-2xl">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-text-grey" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-white text-2xl font-bold mb-2">Gallery is evolving</h3>
            <p className="text-text-grey">Our team is capturing new moments. Check back soon!</p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {images.map((img, index) => (
              <div 
                key={img.name} 
                className="break-inside-avoid group relative rounded-[2rem] overflow-hidden bg-[#111] border border-white/10 hover:border-primary/30 transition-all duration-700 shadow-2xl mb-8"
              >
                {/* Image */}
                <img
                  src={img.url}
                  alt={`Gym Gallery ${index + 1}`}
                  className="w-full h-auto transition-all duration-1000 group-hover:scale-105 group-hover:brightness-110"
                  loading="lazy"
                />
                
                {/* Glass Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-8">
                  <div className="translate-y-10 group-hover:translate-y-0 transition-all duration-700 delay-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-[2px] w-8 bg-primary"></div>
                      <span className="text-primary text-xs font-black uppercase tracking-widest">Premium Zone</span>
                    </div>
                    <h3 className="text-white text-2xl font-bold tracking-tight mb-1">Power Soul Fitness</h3>
                    <p className="text-white/60 text-sm font-medium uppercase tracking-tighter">Established 2024</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-20 text-center">
          <p className="text-text-grey text-sm font-bold uppercase tracking-[0.2em] mb-8">Ready to start your journey?</p>
          <a href="/contact" className="btn btn-primary px-12 py-5 rounded-full text-lg shadow-[0_20px_50px_rgba(168,98,237,0.3)] hover:shadow-[0_30px_60px_rgba(168,98,237,0.5)] transform hover:-translate-y-2 transition-all duration-500">
            Join The Club
          </a>
        </div>
      </div>
    </div>
  );
}
