'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { GripVertical, Eye, EyeOff, Settings2, Plus, ArrowUp, ArrowDown, Layout } from 'lucide-react'
import Switch from '@/components/admin/Switch'

type Section = {
  id: string
  name: string
  enabled: boolean
  order: number
}

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchSections()
  }, [])

  const fetchSections = async () => {
    const { data, error } = await supabase
      .from('sections')
      .select('*')
      .order('order')
    
    if (data) setSections(data)
    setLoading(false)
  }

  const toggleSection = async (id: string, current: boolean) => {
    setUpdating(id)
    const { error } = await supabase
      .from('sections')
      .update({ enabled: !current })
      .eq('id', id)
    
    if (!error) {
      setSections(sections.map(s => s.id === id ? { ...s, enabled: !current } : s))
    }
    setUpdating(null)
  }

  const moveSection = async (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex < 0 || targetIndex >= newSections.length) return

    // Swap items locally
    const temp = newSections[index]
    newSections[index] = newSections[targetIndex]
    newSections[targetIndex] = temp

    // Update order numbers
    const updated = newSections.map((s, i) => ({ ...s, order: i }))
    setSections(updated)

    // Update in DB
    for (const item of updated) {
      await supabase.from('sections').update({ order: item.order }).eq('id', item.id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
            <Layout className="text-primary" size={28} />
            Section Builder
          </h1>
          <p className="text-text-grey text-sm">Organize and toggle visibility of homepage sections.</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus size={18} />
          <span>Add Section</span>
        </button>
      </div>

      <div className="glass border border-glass-border overflow-hidden rounded-2xl">
        <div className="bg-white/5 px-6 py-4 border-b border-glass-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white uppercase tracking-wider">Homepage Structure</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${sections.filter(s => s.enabled).length > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
              {sections.filter(s => s.enabled).length} Active
            </span>
          </div>
          <span className="text-xs text-text-grey">Reorder using arrows</span>
        </div>
        <div className="divide-y divide-glass-border">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center text-text-grey">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p>Loading sections...</p>
            </div>
          ) : sections.length === 0 ? (
            <div className="p-20 text-center text-text-grey">No sections found.</div>
          ) : (
            sections.map((section, index) => (
              <div key={section.id} className={`flex items-center gap-4 p-6 transition-all duration-300 ${!section.enabled ? 'bg-black/20 grayscale' : 'hover:bg-white/[0.02]'}`}>
                <div className="text-text-grey">
                  <GripVertical size={20} className="opacity-30" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className={`text-lg font-bold transition-colors ${section.enabled ? 'text-white' : 'text-text-grey'}`}>
                      {section.name}
                    </h3>
                    {!section.enabled && <span className="text-[10px] uppercase font-bold text-red-500/60 tracking-widest border border-red-500/20 px-1.5 py-0.5 rounded">Hidden</span>}
                  </div>
                  <p className="text-xs text-text-grey font-mono mt-0.5 opacity-50">ID: {section.id}</p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center bg-black/30 border border-glass-border rounded-lg p-1">
                    <button 
                      onClick={() => moveSection(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 text-text-grey hover:text-primary disabled:opacity-10 transition-all hover:bg-white/5 rounded-md"
                      title="Move Up"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <div className="w-px h-4 bg-glass-border mx-1" />
                    <button 
                      onClick={() => moveSection(index, 'down')}
                      disabled={index === sections.length - 1}
                      className="p-1.5 text-text-grey hover:text-primary disabled:opacity-10 transition-all hover:bg-white/5 rounded-md"
                      title="Move Down"
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 pr-2">
                    <span className={`text-xs font-medium transition-colors ${section.enabled ? 'text-green-500' : 'text-text-grey'}`}>
                      {section.enabled ? 'Active' : 'Inactive'}
                    </span>
                    <Switch 
                      checked={section.enabled} 
                      onChange={() => toggleSection(section.id, section.enabled)}
                      disabled={updating === section.id}
                    />
                  </div>

                  <button className="p-2.5 bg-white/5 border border-glass-border rounded-lg text-text-grey hover:text-white hover:bg-white/10 transition-all">
                    <Settings2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
