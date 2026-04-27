'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Save, Plus, Trash2, Search, Filter, X } from 'lucide-react'

type ContentItem = {
  id: string
  key: string
  value: string
  type: 'text' | 'image' | 'html'
}

export default function ContentPage() {
  const [content, setContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<string>('All')
  
  // Modal State
  const [showModal, setShowModal] = useState(false)
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')
  const [newType, setNewType] = useState<'text' | 'image' | 'html'>('text')

  const supabase = createClient()

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .order('key')
    
    if (data) setContent(data)
    setLoading(false)
  }

  const handleUpdate = async (id: string, value: string) => {
    setSaving(id)
    const { error } = await supabase
      .from('content')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('id', id)
    
    if (!error) {
      setContent(content.map(c => c.id === id ? { ...c, value } : c))
    }
    setSaving(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content key?')) return
    
    const { error } = await supabase
      .from('content')
      .delete()
      .eq('id', id)
      
    if (!error) {
      setContent(content.filter(c => c.id !== id))
    }
  }

  const handleAddKey = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newKey || !newValue) return

    const { data, error } = await supabase
      .from('content')
      .insert([{ key: newKey.toLowerCase(), value: newValue, type: newType }])
      .select()
      
    if (data && data.length > 0) {
      setContent([...content, data[0]].sort((a, b) => a.key.localeCompare(b.key)))
      setShowModal(false)
      setNewKey('')
      setNewValue('')
      setNewType('text')
    } else if (error) {
      alert('Error adding key. It might already exist!')
    }
  }

  // Derive pages from the first part of the key (e.g., "home_title" -> "home")
  const pages = ['All', ...Array.from(new Set(content.map(c => c.key.split('_')[0].toLowerCase())))]

  const filteredContent = content.filter(c => {
    const matchesSearch = c.key.toLowerCase().includes(search.toLowerCase()) || c.value.toLowerCase().includes(search.toLowerCase())
    const matchesTab = activeTab === 'All' || c.key.split('_')[0].toLowerCase() === activeTab
    return matchesSearch && matchesTab
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Content Management</h1>
          <p className="text-text-grey text-sm">Manage all the text and dynamic strings on your website.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center gap-2 px-6 py-2.5 self-start"
        >
          <Plus size={18} />
          <span>Add New Key</span>
        </button>
      </div>

      <div className="bg-white/5 border border-glass-border rounded-xl p-4 space-y-4">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-grey" size={18} />
            <input 
              type="text" 
              placeholder="Search keys or content..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/30 border border-glass-border rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-all"
            />
          </div>
          <button className="p-2.5 bg-white/5 border border-glass-border rounded-lg text-text-grey hover:text-white hover:bg-white/10 transition-all">
            <Filter size={18} />
          </button>
        </div>
        
        {/* Page Wise Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {pages.map(page => (
            <button
              key={page}
              onClick={() => setActiveTab(page)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap capitalize ${
                activeTab === page 
                  ? 'bg-primary text-white' 
                  : 'bg-white/5 text-text-grey hover:bg-white/10 hover:text-white'
              }`}
            >
              {page === 'All' ? 'All Content' : `${page} Page`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-20 text-text-grey">Loading content...</div>
        ) : filteredContent.length === 0 ? (
          <div className="text-center py-20 glass border-dashed border-2 border-glass-border text-text-grey">
            No content keys found for this page/search.
          </div>
        ) : (
          filteredContent.map((item) => (
            <div key={item.id} className="glass p-6 border border-glass-border group transition-all hover:border-primary/30">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {item.type}
                    </span>
                    <span className="text-xs text-text-grey font-mono truncate">{item.id}</span>
                  </div>
                  <h3 className="text-lg font-mono font-bold text-white mb-2 break-all">{item.key}</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-xs text-red-500/60 hover:text-red-500 transition-colors flex items-center gap-1"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  {item.type === 'text' || item.type === 'html' ? (
                    <textarea 
                      className="w-full bg-black/50 border border-glass-border rounded-xl p-4 text-white focus:outline-none focus:border-primary transition-all min-h-[120px] resize-y"
                      value={item.value}
                      onChange={(e) => {
                        const newValue = e.target.value
                        setContent(content.map(c => c.id === item.id ? { ...c, value: newValue } : c))
                      }}
                      onBlur={(e) => handleUpdate(item.id, e.target.value)}
                    />
                  ) : item.type === 'image' ? (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="w-24 h-24 rounded-lg bg-black/50 border border-glass-border overflow-hidden shrink-0">
                        <img src={item.value || 'https://via.placeholder.com/150'} alt={item.key} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <input 
                          type="text"
                          placeholder="Image URL"
                          className="w-full bg-black/50 border border-glass-border rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary transition-all"
                          value={item.value}
                          onChange={(e) => setContent(content.map(c => c.id === item.id ? { ...c, value: e.target.value } : c))}
                          onBlur={(e) => handleUpdate(item.id, e.target.value)}
                        />
                        <p className="text-xs text-text-grey">Or manage images in the Images tab and paste the URL here.</p>
                      </div>
                    </div>
                  ) : null}
                  <div className="flex justify-end">
                    <button 
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        saving === item.id ? 'bg-primary/50 text-white animate-pulse' : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                      }`}
                      onClick={() => handleUpdate(item.id, item.value)}
                    >
                      <Save size={16} />
                      {saving === item.id ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add New Key Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-dark-alt border border-glass-border rounded-2xl w-full max-w-md overflow-hidden animate-up">
            <div className="flex items-center justify-between p-6 border-b border-glass-border">
              <h3 className="text-xl font-bold text-white">Add Content Key</h3>
              <button onClick={() => setShowModal(false)} className="text-text-grey hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddKey} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-grey mb-1">Key Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. home_hero_title"
                  className="w-full bg-black/50 border border-glass-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-all font-mono text-sm"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                />
                <p className="text-xs text-text-grey mt-1">Tip: Prefix with page name (e.g. "about_title") to organize page-wise.</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-grey mb-1">Content Type</label>
                <select 
                  className="w-full bg-black/50 border border-glass-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-all"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                >
                  <option value="text">Plain Text</option>
                  <option value="html">HTML snippet</option>
                  <option value="image">Image URL</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-grey mb-1">Value</label>
                {newType === 'text' || newType === 'html' ? (
                  <textarea 
                    required
                    rows={4}
                    className="w-full bg-black/50 border border-glass-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-all resize-y"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                  />
                ) : (
                  <input 
                    type="url" 
                    required
                    placeholder="https://..."
                    className="w-full bg-black/50 border border-glass-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-all"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                  />
                )}
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-glass-border text-white hover:bg-white/5 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 btn-primary py-2.5 rounded-xl font-medium"
                >
                  Add Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
