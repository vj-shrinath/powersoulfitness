'use client'

import { useState, useEffect } from 'react'

type Banner = {
  id: string
  type: 'vertical' | 'horizontal'
  image_url: string
  link?: string
}

export default function AnnouncementBanner({ banners }: { banners: Banner[] }) {
  const [isVisible, setIsVisible] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const currentBanner = banners.find(b => b.type === (isMobile ? 'vertical' : 'horizontal'))

  if (!isVisible || !currentBanner) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-500">
      <div className="relative max-w-4xl w-full glass border border-glass-border overflow-hidden shadow-2xl shadow-primary/20">
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-primary transition-all border border-white/20"
        >
          ✕
        </button>
        
        {currentBanner.link ? (
          <a href={currentBanner.link} target="_blank" rel="noopener noreferrer">
            <img 
              src={currentBanner.image_url} 
              alt="Announcement" 
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </a>
        ) : (
          <img 
            src={currentBanner.image_url} 
            alt="Announcement" 
            className="w-full h-auto max-h-[80vh] object-contain"
          />
        )}
      </div>
    </div>
  )
}
