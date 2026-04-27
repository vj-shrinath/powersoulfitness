'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Upload, Trash2, Search, Image as ImageIcon, Copy, Check } from 'lucide-react'

export default function ImagesPage() {
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    
    setUploading(true)
    const file = e.target.files[0]
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('assets')
      .upload(filePath, file)

    if (uploadError) {
      alert('Error uploading image!')
    } else {
      fetchImages()
    }
    setUploading(false)
  }

  const deleteImage = async (name: string) => {
    if (!confirm('Are you sure?')) return
    const { error } = await supabase.storage.from('assets').remove([name])
    if (!error) {
      setImages(images.filter(img => img.name !== name))
    }
  }

  const copyUrl = (name: string) => {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/${name}`
    navigator.clipboard.writeText(url)
    setCopied(name)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Image Gallery</h1>
          <p className="text-text-grey text-sm">Upload and manage images stored in Supabase R2/Storage.</p>
        </div>
        <label className="btn btn-primary flex items-center gap-2 cursor-pointer">
          <Upload size={18} />
          <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
          <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} accept="image/*" />
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-text-grey">Loading assets...</div>
        ) : images.length === 0 ? (
          <div className="col-span-full py-20 glass border-dashed border-2 text-center text-text-grey">
            No images uploaded yet.
          </div>
        ) : (
          images.map((img) => (
            <div key={img.name} className="glass group border border-glass-border overflow-hidden">
              <div className="aspect-square relative bg-black/40">
                <img 
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/${img.name}`} 
                  alt={img.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button 
                    onClick={() => copyUrl(img.name)}
                    className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
                    title="Copy URL"
                  >
                    {copied === img.name ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                  </button>
                  <button 
                    onClick={() => deleteImage(img.name)}
                    className="p-2.5 bg-red-500/20 hover:bg-red-500/40 rounded-full text-white transition-all"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="p-3 bg-white/5">
                <p className="text-xs text-text-grey truncate font-mono">{img.name}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
