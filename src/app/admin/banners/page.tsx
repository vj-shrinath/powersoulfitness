'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Plus, Trash2, Smartphone, Monitor, Link as LinkIcon, Power, Upload } from 'lucide-react'

type Banner = {
  id: string
  type: 'vertical' | 'horizontal'
  image_url: string
  link?: string
  active: boolean
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('type')
    
    if (data) setBanners(data)
    setLoading(false)
  }

  const toggleActive = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from('banners')
      .update({ active: !current })
      .eq('id', id)
    
    if (!error) {
      setBanners(banners.map(b => b.id === id ? { ...b, active: !current } : b))
    }
  }

  const deleteBanner = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return
    const { error } = await supabase.from('banners').delete().eq('id', id)
    if (!error) {
      setBanners(banners.filter(b => b.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Announcement Banners</h1>
          <p className="text-text-grey text-sm">Control the banners shown on mobile and desktop.</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus size={18} />
          <span>Upload Banner</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Desktop Banners (Horizontal) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-lg mb-4">
            <Monitor className="text-primary" size={20} />
            <h2>Desktop Banners (Horizontal)</h2>
          </div>
          <div className="grid gap-4">
            {banners.filter(b => b.type === 'horizontal').length === 0 ? (
              <div className="glass p-12 text-center text-text-grey border-dashed border-2">No horizontal banners.</div>
            ) : (
              banners.filter(b => b.type === 'horizontal').map(banner => (
                <BannerCard 
                  key={banner.id} 
                  banner={banner} 
                  onToggle={() => toggleActive(banner.id, banner.active)}
                  onDelete={() => deleteBanner(banner.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Mobile Banners (Vertical) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-lg mb-4">
            <Smartphone className="text-accent" size={20} />
            <h2>Mobile Banners (Vertical)</h2>
          </div>
          <div className="grid gap-4">
             {banners.filter(b => b.type === 'vertical').length === 0 ? (
              <div className="glass p-12 text-center text-text-grey border-dashed border-2">No vertical banners.</div>
            ) : (
              banners.filter(b => b.type === 'vertical').map(banner => (
                <BannerCard 
                  key={banner.id} 
                  banner={banner} 
                  onToggle={() => toggleActive(banner.id, banner.active)}
                  onDelete={() => deleteBanner(banner.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function BannerCard({ banner, onToggle, onDelete }: { banner: Banner, onToggle: () => void, onDelete: () => void }) {
  return (
    <div className={`glass overflow-hidden border transition-all ${banner.active ? 'border-primary/50 ring-1 ring-primary/20' : 'border-glass-border opacity-60'}`}>
      <div className={`aspect-[21/9] ${banner.type === 'vertical' ? 'aspect-[9/16] max-h-[400px]' : ''} relative bg-black/50`}>
        <img src={banner.image_url} alt="Banner" className="w-full h-full object-cover" />
        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            onClick={onToggle}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${banner.active ? 'bg-primary text-white' : 'bg-black/60 text-white hover:bg-black/80'}`}
          >
            <Power size={18} />
          </button>
        </div>
      </div>
      <div className="p-4 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-4">
          {banner.link && (
            <div className="flex items-center gap-1.5 text-xs text-text-grey bg-white/5 px-2 py-1 rounded border border-glass-border">
              <LinkIcon size={12} />
              <span className="truncate max-w-[150px]">{banner.link}</span>
            </div>
          )}
        </div>
        <button 
          onClick={onDelete}
          className="text-text-grey hover:text-red-500 transition-colors p-2"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  )
}
