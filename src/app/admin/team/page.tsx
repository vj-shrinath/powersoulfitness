'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Save, Loader2, Users } from 'lucide-react'

type TeamKey = {
  key: string
  label: string
  value: string
  type: 'text'
}

const DEFAULT_KEYS: Omit<TeamKey, 'value'>[] = [
  { key: 'about_team_title', label: 'Section Title', type: 'text' },
  { key: 'about_team_member1_name', label: 'Member 1 Name', type: 'text' },
  { key: 'about_team_member1_location', label: 'Member 1 Location', type: 'text' },
  { key: 'about_team_member2_name', label: 'Member 2 Name', type: 'text' },
  { key: 'about_team_member2_location', label: 'Member 2 Location', type: 'text' },
]

export default function TeamManagementPage() {
  const [data, setData] = useState<TeamKey[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchTeamData()
  }, [])

  const fetchTeamData = async () => {
    const { data: contentData } = await supabase
      .from('content')
      .select('*')
      .in('key', DEFAULT_KEYS.map(k => k.key))

    const merged = DEFAULT_KEYS.map(def => {
      const existing = contentData?.find(c => c.key === def.key)
      return {
        ...def,
        value: existing?.value || (
          def.key === 'about_team_title' ? 'And Team' :
          def.key === 'about_team_member1_name' ? 'SAISH HEALTH & FITNESS' :
          def.key === 'about_team_member1_location' ? '(Pune)' :
          def.key === 'about_team_member2_name' ? 'RIO Fitness' :
          def.key === 'about_team_member2_location' ? '(Bangalore)' : ''
        )
      } as TeamKey
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
      alert('Error saving team data: ' + error.message)
    } else {
      alert('Team data updated successfully!')
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
            <Users className="text-primary" size={28} />
            Team Management
          </h1>
          <p className="text-text-grey text-sm">Manage the "And Team" section shown on the About Us page.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary flex items-center gap-2 px-8"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
        </button>
      </div>

      <div className="grid gap-6">
        <div className="glass p-8 space-y-8 border border-glass-border">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white border-b border-glass-border pb-2">Main Heading</h3>
            {data.filter(k => k.key === 'about_team_title').map(item => (
              <div key={item.key}>
                <label className="block text-sm font-medium text-text-grey mb-2">{item.label}</label>
                <input 
                  type="text"
                  className="w-full bg-black/50 border border-glass-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all text-lg"
                  value={item.value}
                  onChange={(e) => setData(data.map(d => d.key === item.key ? { ...d, value: e.target.value } : d))}
                />
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Member 1 */}
            <div className="space-y-4 p-6 bg-white/5 rounded-2xl border border-glass-border">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-xs flex items-center justify-center">1</span>
                Team Member 1
              </h3>
              {data.filter(k => k.key.includes('member1')).map(item => (
                <div key={item.key}>
                  <label className="block text-xs font-medium text-text-grey uppercase tracking-wider mb-1.5">{item.label}</label>
                  <input 
                    type="text"
                    className="w-full bg-black/50 border border-glass-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-all"
                    value={item.value}
                    onChange={(e) => setData(data.map(d => d.key === item.key ? { ...d, value: e.target.value } : d))}
                  />
                </div>
              ))}
            </div>

            {/* Member 2 */}
            <div className="space-y-4 p-6 bg-white/5 rounded-2xl border border-glass-border">
              <h3 className="text-lg font-bold text-accent flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-accent/20 text-xs flex items-center justify-center">2</span>
                Team Member 2
              </h3>
              {data.filter(k => k.key.includes('member2')).map(item => (
                <div key={item.key}>
                  <label className="block text-xs font-medium text-text-grey uppercase tracking-wider mb-1.5">{item.label}</label>
                  <input 
                    type="text"
                    className="w-full bg-black/50 border border-glass-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-all"
                    value={item.value}
                    onChange={(e) => setData(data.map(d => d.key === item.key ? { ...d, value: e.target.value } : d))}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="glass p-6 border-l-4 border-primary/40 bg-primary/5">
          <p className="text-sm text-text-grey">
            <strong>Note:</strong> These fields automatically create their own content keys if they don't exist. 
            Once you click <strong>Save All Changes</strong>, they will be live on the <a href="/about-us" target="_blank" className="text-primary hover:underline">About Us page</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
