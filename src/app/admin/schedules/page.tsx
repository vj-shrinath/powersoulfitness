'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Save, Loader2, Clock, CalendarDays } from 'lucide-react'

type ScheduleKey = {
  key: string
  label: string
  value: string
  type: 'text'
}

const DEFAULT_SCHEDULES: Omit<ScheduleKey, 'value'>[] = [
  { key: 'schedule_gym_hours', label: 'Gym Hours (Mon-Sat)', type: 'text' },
  { key: 'schedule_sunday_status', label: 'Sunday Status', type: 'text' },
]

export default function SchedulesPage() {
  const [data, setData] = useState<ScheduleKey[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchSchedules()
  }, [])

  const fetchSchedules = async () => {
    const { data: contentData } = await supabase
      .from('content')
      .select('*')
      .in('key', DEFAULT_SCHEDULES.map(k => k.key))

    const merged = DEFAULT_SCHEDULES.map(def => {
      const existing = contentData?.find(c => c.key === def.key)
      return {
        ...def,
        value: existing?.value || (
          def.key === 'schedule_gym_hours' ? '5AM - 9AM | 5PM - 9PM' :
          def.key === 'schedule_sunday_status' ? 'CLOSED' : ''
        )
      } as ScheduleKey
    })

    setData(merged)
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    
    const upserts = data.map(item => ({
      key: item.key,
      value: item.value,
      type: item.type,
      updated_at: new Date().toISOString()
    }))

    const { error } = await supabase.from('content').upsert(upserts, { onConflict: 'key' })
    
    if (error) {
      alert('Error saving schedules: ' + error.message)
    } else {
      alert('Schedules updated successfully!')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
            <Clock className="text-primary" size={28} />
            Gym Schedules
          </h1>
          <p className="text-text-grey text-sm">Manage opening hours and Sunday status shown on the homepage.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary flex items-center gap-2 px-8"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="grid gap-6">
        <div className="glass p-8 space-y-8 border border-glass-border">
          <div className="grid gap-8">
            {data.map((item, index) => (
              <div key={item.key} className="space-y-4 p-6 bg-white/5 rounded-2xl border border-glass-border">
                <div className="flex items-center gap-3 mb-2">
                  {item.key.includes('gym') ? <Clock className="text-primary" size={20} /> : <CalendarDays className="text-accent" size={20} />}
                  <h3 className="text-lg font-bold text-white">{item.label}</h3>
                </div>
                <div className="relative">
                  <input 
                    type="text"
                    className="w-full bg-black/50 border border-glass-border rounded-xl px-4 py-4 text-white focus:outline-none focus:border-primary transition-all text-xl font-bold tracking-tight"
                    placeholder={item.key.includes('gym') ? 'e.g. 5AM - 9AM | 5PM - 9PM' : 'e.g. CLOSED'}
                    value={item.value}
                    onChange={(e) => setData(data.map(d => d.key === item.key ? { ...d, value: e.target.value } : d))}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] uppercase font-bold text-text-grey/40 tracking-widest">
                    Live Field
                  </div>
                </div>
                <p className="text-xs text-text-grey italic">This will appear directly in the schedule card on the home page.</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-6 border-l-4 border-accent/40 bg-accent/5">
          <p className="text-sm text-text-grey">
            <strong>Pro Tip:</strong> You can use symbols like <code>|</code> or <code>&</code> to separate morning and evening shifts. Sunday can be set to <code>OPEN</code> or <code>CLOSED</code> depending on your needs.
          </p>
        </div>
      </div>
    </div>
  )
}
