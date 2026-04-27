'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Plus, Trash2, Smartphone, Monitor, Link as LinkIcon, Power, Upload, X } from 'lucide-react'

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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [newBannerType, setNewBannerType] = useState<'vertical' | 'horizontal'>('horizontal')
  const [newBannerLink, setNewBannerLink] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setUploading(true)
    
    try {
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `banners/${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(fileName, selectedFile)

      if (uploadError) throw uploadError

      const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/${fileName}`

      const { error: insertError } = await supabase
        .from('banners')
        .insert([
          { 
            type: newBannerType, 
            image_url: imageUrl, 
            link: newBannerLink, 
            active: true 
          }
        ])

      if (insertError) throw insertError

      setIsModalOpen(false)
      setSelectedFile(null)
      setPreviewUrl(null)
      setNewBannerLink('')
      fetchBanners()
    } catch (error: any) {
      console.error('Error:', error)
      alert('Failed to upload banner: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Announcement Banners</h1>
          <p className="text-text-grey text-sm">Control the banners shown on mobile and desktop.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center gap-2"
        >
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

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass w-full max-w-lg overflow-hidden border border-glass-border">
            <div className="flex items-center justify-between p-6 border-b border-glass-border">
              <h3 className="text-xl font-bold text-white">Upload New Banner</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-text-grey hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Type Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-grey">Banner Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setNewBannerType('horizontal')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${newBannerType === 'horizontal' ? 'bg-primary/20 border-primary text-white' : 'bg-white/5 border-glass-border text-text-grey hover:bg-white/10'}`}
                  >
                    <Monitor size={18} />
                    <span>Desktop</span>
                  </button>
                  <button
                    onClick={() => setNewBannerType('vertical')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${newBannerType === 'vertical' ? 'bg-accent/20 border-accent text-white' : 'bg-white/5 border-glass-border text-text-grey hover:bg-white/10'}`}
                  >
                    <Smartphone size={18} />
                    <span>Mobile</span>
                  </button>
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-grey">Banner Image</label>
                {previewUrl ? (
                  <div className={`relative rounded-lg overflow-hidden bg-black/40 border border-glass-border group ${newBannerType === 'vertical' ? 'aspect-[9/16] max-h-[300px] mx-auto' : 'aspect-[21/9]'}`}>
                    <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                    <button 
                      onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-glass-border bg-white/5 hover:bg-white/10 transition-all cursor-pointer ${newBannerType === 'vertical' ? 'aspect-[9/16] max-h-[300px] mx-auto' : 'aspect-[21/9]'}`}>
                    <Upload className="text-text-grey mb-2" size={32} />
                    <span className="text-sm text-text-grey">Click to upload banner image</span>
                    <span className="text-[10px] text-text-grey/60 mt-1">Recommended: 1920x600 (Desktop) or 1080x1920 (Mobile)</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                )}
              </div>

              {/* Link Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-grey">Target Link (Optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-grey">
                    <LinkIcon size={16} />
                  </div>
                  <input
                    type="text"
                    value={newBannerLink}
                    onChange={(e) => setNewBannerLink(e.target.value)}
                    placeholder="https://powersoulfitness.com/join"
                    className="w-full bg-white/5 border border-glass-border rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-text-grey/40 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 bg-white/5 border-t border-glass-border flex gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-glass-border text-white hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || !selectedFile}
                className="flex-[2] btn btn-primary flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    <span>Upload Banner</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
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
          <button 
            onClick={onDelete}
            className="p-2 rounded-full backdrop-blur-md bg-red-500/20 text-white hover:bg-red-500 transition-all border border-red-500/20"
          >
            <Trash2 size={18} />
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
      </div>
    </div>
  )
}
