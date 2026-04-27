'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Search, X, Check, Image as ImageIcon, Upload, Plus } from 'lucide-react'

type ImagePickerProps = {
  onSelect: (url: string) => void
  onClose: () => void
}

export default function ImagePicker({ onSelect, onClose }: ImagePickerProps) {
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
  const supabase = createClient()

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    const { data, error } = await supabase
      .storage
      .from('assets')
      .list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'desc' },
      })
    
    if (data) setImages(data)
    setLoading(false)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    
    setUploading(true)
    const file = e.target.files[0]
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('assets')
      .upload(filePath, file)

    if (uploadError) {
      alert('Error uploading image: ' + uploadError.message)
      setUploading(false)
    } else {
      const url = getUrl(fileName)
      onSelect(url) // Automatically select the newly uploaded image
    }
  }

  const filteredImages = images.filter(img => 
    img.name.toLowerCase().includes(search.toLowerCase())
  )

  const getUrl = (name: string) => {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/${name}`
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-10">
      <div className="bg-dark-alt border border-glass-border rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-glass-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <ImageIcon size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Select Image</h3>
              <p className="text-xs text-text-grey">Choose from library or upload new</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className={`btn btn-primary flex items-center gap-2 px-4 py-2 text-sm cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
              {uploading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <Plus size={16} />
              )}
              <span>{uploading ? 'Uploading...' : 'Upload New'}</span>
              <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} accept="image/*" />
            </label>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full text-text-grey hover:text-white transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-glass-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-grey" size={18} />
            <input 
              type="text" 
              placeholder="Search images..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/30 border border-glass-border rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-text-grey">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p>Loading your gallery...</p>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-20 glass border-dashed border-2 border-glass-border rounded-2xl text-text-grey">
              No images found.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredImages.map((img) => (
                <button
                  key={img.name}
                  onClick={() => onSelect(getUrl(img.name))}
                  className="group relative aspect-square rounded-xl overflow-hidden bg-black/40 border border-glass-border hover:border-primary transition-all text-left"
                >
                  <img 
                    src={getUrl(img.name)} 
                    alt={img.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-primary text-white p-2 rounded-full shadow-lg">
                      <Check size={20} />
                    </div>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-[10px] text-white truncate font-mono">{img.name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-glass-border bg-black/20 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-xl border border-glass-border text-white hover:bg-white/5 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
