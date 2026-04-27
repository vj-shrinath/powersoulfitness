'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { GripVertical, Eye, EyeOff, Settings2, Plus, ArrowUp, ArrowDown } from 'lucide-react'

type Section = {
  id: string
  name: string
  enabled: boolean
  order: number
}

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
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
    const { error } = await supabase
      .from('sections')
      .update({ enabled: !current })
      .eq('id', id)
    
    if (!error) {
      setSections(sections.map(s => s.id === id ? { ...s, enabled: !current } : s))
    }
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

    // Update in DB (in a real app, use a RPC or multiple updates)
    for (const item of updated) {
      await supabase.from('sections').update({ order: item.order }).eq('id', item.id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Section Builder</h1>
          <p className="text-text-grey text-sm">Organize and toggle visibility of website sections.</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus size={18} />
          <span>Add Section</span>
        </button>
      </div>

      <div className="glass border border-glass-border overflow-hidden">
        <div className="bg-white/5 px-6 py-4 border-b border-glass-border flex items-center justify-between">
          <span className="text-sm font-bold text-text-grey uppercase tracking-wider">Structure</span>
          <span className="text-xs text-text-grey">Drag and drop to reorder (Coming Soon)</span>
        </div>
        <div className="divide-y divide-glass-border">
          {loading ? (
            <div className="p-20 text-center text-text-grey">Loading sections...</div>
          ) : (
            sections.map((section, index) => (
              <div key={section.id} className={`flex items-center gap-4 p-6 transition-colors hover:bg-white/[0.02] ${!section.enabled ? 'opacity-50' : ''}`}>
                <div className="text-text-grey hover:text-white cursor-grab active:cursor-grabbing">
                  <GripVertical size={20} />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg">{section.name}</h3>
                  <p className="text-xs text-text-grey font-mono">ID: {section.id}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => moveSection(index, 'up')}
                      disabled={index === 0}
                      className="p-2 text-text-grey hover:text-white disabled:opacity-20 transition-all"
                    >
                      <ArrowUp size={18} />
                    </button>
                    <button 
                      onClick={() => moveSection(index, 'down')}
                      disabled={index === sections.length - 1}
                      className="p-2 text-text-grey hover:text-white disabled:opacity-20 transition-all"
                    >
                      <ArrowDown size={18} />
                    </button>
                  </div>

                  <button 
                    onClick={() => toggleSection(section.id, section.enabled)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      section.enabled 
                        ? 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white' 
                        : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'
                    }`}
                  >
                    {section.enabled ? <Eye size={16} /> : <EyeOff size={16} />}
                    {section.enabled ? 'Visible' : 'Hidden'}
                  </button>

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
