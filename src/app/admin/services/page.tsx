'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Plus, Trash2, Save, MoveUp, MoveDown, Info } from 'lucide-react'

type Service = {
  id: string
  title: string
  description: string
  icon: string
  order: number
}

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    const { data, error } = await supabase.from('services').select('*').order('order')
    if (data) setServices(data)
    setLoading(false)
  }

  const handleUpdate = async (id: string, updates: Partial<Service>) => {
    setSaving(id)
    const { error } = await supabase.from('services').update(updates).eq('id', id)
    if (!error) {
      setServices(services.map(s => s.id === id ? { ...s, ...updates } : s))
    }
    setSaving(null)
  }

  const addService = async () => {
    const newService = {
      title: 'New Service',
      description: 'Service description...',
      icon: 'fas fa-dumbbell',
      order: services.length
    }
    const { data, error } = await supabase.from('services').insert(newService).select()
    if (data) setServices([...services, data[0]])
  }

  const deleteService = async (id: string) => {
    if (!confirm('Are you sure?')) return
    const { error } = await supabase.from('services').delete().eq('id', id)
    if (!error) setServices(services.filter(s => s.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Service Management</h1>
          <p className="text-text-grey text-sm">Manage the services offered on the public services page.</p>
        </div>
        <button onClick={addService} className="btn btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Service
        </button>
      </div>

      <div className="grid gap-4">
        {loading ? <div className="text-center py-20 text-text-grey">Loading services...</div> : 
          services.map((service, index) => (
            <div key={service.id} className="glass p-6 border border-glass-border">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center text-primary border border-primary/20">
                      <i className={service.icon}></i>
                    </div>
                    <span className="text-xs text-text-grey font-mono">ID: {service.id.slice(0,8)}</span>
                  </div>
                  <input 
                    className="w-full bg-black/30 border border-glass-border rounded px-3 py-2 text-white mb-2"
                    value={service.icon}
                    onChange={(e) => handleUpdate(service.id, { icon: e.target.value })}
                    placeholder="FontAwesome Class"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => deleteService(service.id)} className="text-red-500 text-xs flex items-center gap-1 hover:underline">
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <input 
                    className="w-full bg-black/30 border border-glass-border rounded px-4 py-2 text-xl font-bold text-white focus:border-primary outline-none"
                    value={service.title}
                    onChange={(e) => setServices(services.map(s => s.id === service.id ? { ...s, title: e.target.value } : s))}
                    onBlur={(e) => handleUpdate(service.id, { title: e.target.value })}
                  />
                  <textarea 
                    className="w-full bg-black/30 border border-glass-border rounded px-4 py-2 text-text-grey h-24 focus:border-primary outline-none"
                    value={service.description}
                    onChange={(e) => setServices(services.map(s => s.id === service.id ? { ...s, description: e.target.value } : s))}
                    onBlur={(e) => handleUpdate(service.id, { description: e.target.value })}
                  />
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}
