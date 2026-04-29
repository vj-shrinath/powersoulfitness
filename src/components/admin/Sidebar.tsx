'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  Megaphone, 
  Layers, 
  Settings,
  LogOut,
  Clock
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { createClient } from '@/lib/supabase'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Content', href: '/admin/content', icon: FileText },
  { name: 'Services', href: '/admin/services', icon: Settings },
  { name: 'Gallery', href: '/admin/images', icon: ImageIcon },
  { name: 'Sliders', href: '/admin/sliders', icon: Layers },
  { name: 'Banners', href: '/admin/banners', icon: Megaphone },
  { name: 'Sections', href: '/admin/sections', icon: Settings },
  { name: 'Schedules', href: '/admin/schedules', icon: Clock },
]

export default function Sidebar({ onNavClick }: { onNavClick?: () => void }) {
  const pathname = usePathname()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  return (
    <aside className="w-72 bg-black/80 backdrop-blur-3xl flex flex-col h-screen sticky top-0 relative overflow-y-auto border-r border-glass-border">
      {/* Sidebar background glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="p-8 relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_15px_rgba(168,98,237,0.5)]">
            <span className="font-bold text-white text-sm">PS</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">
            PSF <span className="text-primary font-light">Admin</span>
          </h2>
        </div>
        <p className="text-xs text-text-grey font-mono uppercase tracking-widest pl-11">CMS Portal</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 relative z-10">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavClick}
              className={cn(
                "flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden",
                isActive 
                  ? "bg-white/10 text-white border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]" 
                  : "text-text-grey hover:bg-white/5 hover:text-white border border-transparent"
              )}
            >
              {/* Active Indicator Glow */}
              {isActive && (
                <div className="absolute left-0 top-0 w-1 h-full bg-primary shadow-[0_0_15px_var(--primary)]" />
              )}
              
              <item.icon size={20} className={cn(
                "transition-all duration-300",
                isActive ? "text-primary drop-shadow-[0_0_8px_rgba(168,98,237,0.8)] scale-110" : "text-text-grey group-hover:text-white group-hover:scale-110"
              )} />
              <span className={cn("font-semibold tracking-wide text-sm", isActive ? "text-white" : "text-text-grey")}>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-6 mt-auto relative z-10 border-t border-glass-border bg-black/40">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-5 py-3 w-full rounded-xl text-text-grey hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/30 border border-transparent transition-all duration-300 group"
        >
          <LogOut size={20} className="group-hover:scale-110 transition-transform" />
          <span className="font-semibold tracking-wide text-sm">Logout Session</span>
        </button>
      </div>
    </aside>
  )
}
