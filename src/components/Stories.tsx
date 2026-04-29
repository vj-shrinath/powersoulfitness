'use client';
import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface Story {
  name: string;
  url: string;
}

export default function Stories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [activeStoryIdx, setActiveStoryIdx] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const progressTimer = useRef<NodeJS.Timeout | null>(null);
  const STORY_DURATION = 5000; // 5 seconds per story
  const MAX_PHOTOS = 5;

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      // We'll use a public route or a direct fetch if available
      // For now, let's assume we can fetch via an API or use the same logic as Gallery page
      const res = await fetch('/api/gallery');
      const data = await res.json();
      if (data.images) {
        setStories(data.images.slice(0, MAX_PHOTOS));
      }
    } catch (e) {
      console.error('Error fetching stories:', e);
    }
  };

  useEffect(() => {
    if (activeStoryIdx !== null) {
      document.body.classList.add('story-active');
      setProgress(0);
      startProgress();
    } else {
      document.body.classList.remove('story-active');
      stopProgress();
    }
    return () => {
      document.body.classList.remove('story-active');
      stopProgress();
    };
  }, [activeStoryIdx]);

  const startProgress = () => {
    stopProgress();
    const startTime = Date.now();
    progressTimer.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / STORY_DURATION) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        nextStory();
      }
    }, 50);
  };

  const stopProgress = () => {
    if (progressTimer.current) {
      clearInterval(progressTimer.current);
      progressTimer.current = null;
    }
  };

  const nextStory = () => {
    if (activeStoryIdx === null) return;
    // We have stories.length + 1 total slides (last one is CTA)
    if (activeStoryIdx < stories.length) {
      setActiveStoryIdx(activeStoryIdx + 1);
    } else {
      setActiveStoryIdx(null);
    }
  };

  const prevStory = () => {
    if (activeStoryIdx === null) return;
    if (activeStoryIdx > 0) {
      setActiveStoryIdx(activeStoryIdx - 1);
    } else {
      setActiveStoryIdx(0);
    }
  };

  const pathname = usePathname();

  // If not on home page, don't show anything
  if (pathname !== '/') return null;

  // Show a loading placeholder circle immediately while stories are fetching
  // This makes it feel fast even if the API is slow
  if (stories.length === 0) {
    return (
      <div className="relative animate-pulse">
        <div className="flex flex-col items-center gap-1">
          <div className="p-[2px] rounded-full bg-white/10">
            <div className="p-[2px] rounded-full bg-black">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/5 border border-white/5 shadow-lg" />
            </div>
          </div>
          <div className="h-2 w-8 bg-white/10 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Single Story Trigger */}
      <button
        onClick={() => setActiveStoryIdx(0)}
        className="flex flex-col items-center gap-1 group transition-all duration-300 hover:scale-105"
      >
        <div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
          <div className="p-[2px] rounded-full bg-black">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border border-white/10 shadow-lg">
              <img 
                src={stories[0].url} 
                alt="Latest" 
                className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500" 
              />
            </div>
          </div>
        </div>
        <span className="text-[8px] sm:text-[10px] font-black text-white/90 tracking-widest uppercase">
          Stories
        </span>
      </button>

      {/* Full Screen Viewer (Same as before) */}
      {activeStoryIdx !== null && (
        <div 
          className="fixed inset-0 z-[10000] bg-black flex items-center justify-center p-0 sm:p-4 animate-in fade-in zoom-in duration-300"
          onClick={() => setActiveStoryIdx(null)}
        >
          <div 
            className="relative w-full h-full max-w-md bg-zinc-900 sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Progress Bars (Number of stories + 1 for CTA) */}
            <div className="absolute top-4 left-4 right-4 z-20 flex gap-1.5">
              {[...Array(stories.length + 1)].map((_, idx) => (
                <div key={idx} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white transition-all duration-75 ease-linear"
                    style={{ 
                      width: idx < activeStoryIdx ? '100%' : idx === activeStoryIdx ? `${progress}%` : '0%' 
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Header */}
            <div className="absolute top-8 left-4 right-4 z-20 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden bg-black">
                  <img src={stories[0].url} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-wide">POWER SOUL</h4>
                  <p className="text-[10px] text-white/60 uppercase tracking-widest">
                    {activeStoryIdx === stories.length ? 'Final Update' : `Story ${activeStoryIdx + 1}`}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setActiveStoryIdx(null)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative group bg-black flex items-center justify-center">
              {activeStoryIdx < stories.length ? (
                <img 
                  src={stories[activeStoryIdx].url} 
                  alt="Story content" 
                  className="w-full h-full object-contain"
                />
              ) : (
                /* 6th Slide: CTA */
                <div className="flex flex-col items-center justify-center text-center p-8 bg-gradient-to-b from-zinc-900 to-black w-full h-full">
                  <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-8 border border-primary/30 shadow-[0_0_50px_rgba(168,98,237,0.2)]">
                    <ChevronRight size={48} className="text-primary animate-pulse" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-4 tracking-tighter italic">CATCH ALL THE ACTION</h3>
                  <p className="text-text-grey text-lg mb-12 max-w-xs leading-relaxed">We've got way more to show you. Explore our full gallery of elite transformations and premium gear.</p>
                  <Link 
                    href="/gallery" 
                    className="px-10 py-5 bg-primary text-white font-black uppercase tracking-[0.2em] text-sm rounded-full hover:scale-105 transition-transform shadow-[0_20px_40px_rgba(168,98,237,0.3)]"
                    onClick={() => setActiveStoryIdx(null)}
                  >
                    Enter Gallery
                  </Link>
                </div>
              )}
              
              {/* Navigation Areas */}
              <div className="absolute inset-y-0 left-0 w-1/3 z-20 cursor-pointer" onClick={prevStory} />
              <div className="absolute inset-y-0 right-0 w-1/3 z-20 cursor-pointer" onClick={nextStory} />

              {/* Desktop Nav Arrows */}
              <button 
                onClick={prevStory}
                className="absolute left-[-60px] top-1/2 -translate-y-1/2 hidden lg:flex p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white border border-white/10"
              >
                <ChevronLeft size={32} />
              </button>
              <button 
                onClick={nextStory}
                className="absolute right-[-60px] top-1/2 -translate-y-1/2 hidden lg:flex p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white border border-white/10"
              >
                <ChevronRight size={32} />
              </button>
            </div>

            {/* Standard Footer for Photo Slides */}
            {activeStoryIdx < stories.length && (
              <div className="absolute bottom-10 left-4 right-4 z-20">
                <Link 
                  href="/gallery" 
                  className="w-full py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white font-black uppercase tracking-[0.2em] text-xs text-center block rounded-xl hover:bg-white/10 transition-all"
                  onClick={() => setActiveStoryIdx(null)}
                >
                  View Full Gallery
                </Link>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
