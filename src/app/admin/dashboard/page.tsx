'use client'

import { FileText, Image, Megaphone, Layers, TrendingUp, Settings, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const stats = [
  { name: 'Total Content Keys', value: '42', icon: FileText, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', shadow: 'shadow-primary/20' },
  { name: 'Images Hosted', value: '128', icon: Image, color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/20', shadow: 'shadow-accent/20' },
  { name: 'Active Banners', value: '2', icon: Megaphone, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', shadow: 'shadow-orange-500/20' },
  { name: 'Dynamic Sections', value: '8', icon: Layers, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', shadow: 'shadow-green-500/20' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-10 animate-up">
      <div className="relative">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 mb-3 tracking-tight">
          Welcome Back, <span className="text-primary">Admin</span>
        </h1>
        <p className="text-text-grey text-lg font-medium">Here is what is happening with your website content today.</p>
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-[80px] -z-10"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div 
            key={stat.name} 
            className={`relative overflow-hidden bg-black/40 backdrop-blur-xl p-6 rounded-2xl border ${stat.border} hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] hover:${stat.shadow} transition-all duration-300 group`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} rounded-full blur-[40px] -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500`}></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className={`p-3.5 rounded-xl ${stat.bg} border ${stat.border} shadow-inner`}>
                  <stat.icon className={`${stat.color} drop-shadow-[0_0_8px_currentColor]`} size={24} />
                </div>
                <div className="flex items-center gap-1 text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full border border-green-400/20">
                  <TrendingUp size={14} />
                  <span className="text-xs font-bold">+12%</span>
                </div>
              </div>
              <p className="text-text-grey text-sm font-semibold tracking-wider uppercase mb-1">{stat.name}</p>
              <h3 className="text-4xl font-black text-white tracking-tighter">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-glass-border relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"></div>
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <h3 className="text-2xl font-bold text-white tracking-tight">Recent Activity</h3>
            <button className="text-primary text-sm font-semibold hover:text-white transition-colors flex items-center gap-2">
              View All <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="space-y-6 relative z-10">
            {[
              { title: 'Updated Hero Title', desc: 'Modified the main landing page text for better SEO.', time: '2 hours ago', icon: FileText, color: 'text-primary' },
              { title: 'Uploaded New Banner', desc: 'Added "Summer Fitness Challenge" promotional banner.', time: '5 hours ago', icon: Image, color: 'text-accent' },
              { title: 'Changed Contact Info', desc: 'Updated the primary phone number on the contact page.', time: '1 day ago', icon: Settings, color: 'text-green-500' },
            ].map((activity, i) => (
              <div key={i} className="flex gap-5 items-start pb-6 border-b border-glass-border/50 last:border-0 last:pb-0 group">
                <div className={`w-12 h-12 rounded-2xl bg-white/5 border border-glass-border flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300 shadow-inner`}>
                  <activity.icon className={activity.color} size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-lg mb-0.5 group-hover:text-primary transition-colors">{activity.title}</p>
                  <p className="text-text-grey text-sm leading-relaxed">{activity.desc}</p>
                  <p className="text-xs text-text-grey/60 mt-2 font-mono uppercase tracking-widest">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-glass-border relative shadow-2xl">
          <h3 className="text-2xl font-bold text-white mb-8 tracking-tight">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-4">
            <Link href="/admin/banners" className="p-5 bg-white/5 border border-glass-border rounded-2xl hover:bg-white/10 hover:border-primary/50 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(168,98,237,0.15)] transition-all flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Megaphone className="text-primary group-hover:scale-110 transition-transform" size={24} />
              </div>
              <div>
                <p className="text-white font-bold text-base">New Banner</p>
                <p className="text-text-grey text-xs mt-0.5">Create an announcement</p>
              </div>
            </Link>

            <Link href="/admin/images" className="p-5 bg-white/5 border border-glass-border rounded-2xl hover:bg-white/10 hover:border-accent/50 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(221,153,51,0.15)] transition-all flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
                <Image className="text-accent group-hover:scale-110 transition-transform" size={24} />
              </div>
              <div>
                <p className="text-white font-bold text-base">Gym Gallery</p>
                <p className="text-text-grey text-xs mt-0.5">Manage public gallery images</p>
              </div>
            </Link>

            <Link href="/admin/content" className="p-5 bg-white/5 border border-glass-border rounded-2xl hover:bg-white/10 hover:border-green-500/50 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(34,197,94,0.15)] transition-all flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
                <FileText className="text-green-500 group-hover:scale-110 transition-transform" size={24} />
              </div>
              <div>
                <p className="text-white font-bold text-base">Edit Content</p>
                <p className="text-text-grey text-xs mt-0.5">Modify website text</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
