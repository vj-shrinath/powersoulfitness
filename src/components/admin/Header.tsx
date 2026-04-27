'use client'

import { Bell, Search, User, Sparkles, Menu } from 'lucide-react'

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="h-20 bg-transparent border-b border-glass-border flex items-center justify-between px-4 md:px-10 sticky top-0 z-10 backdrop-blur-md">
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger Menu */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-text-grey hover:text-white transition-colors"
        >
          <Menu size={24} />
        </button>

        <div className="hidden md:block relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-grey group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search CMS..." 
            className="bg-black/40 border border-glass-border rounded-2xl py-2.5 pl-12 pr-6 text-sm focus:outline-none focus:border-primary/50 focus:bg-black/60 focus:ring-4 focus:ring-primary/10 transition-all w-72 text-white shadow-inner"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-full text-xs font-mono text-primary/80">
          <Sparkles size={14} className="animate-pulse" />
          <span>EDGE RUNTIME ACTIVE</span>
        </div>

        <button className="w-10 h-10 rounded-full bg-white/5 border border-glass-border flex items-center justify-center text-text-grey hover:text-white hover:border-primary/50 hover:shadow-[0_0_15px_rgba(168,98,237,0.3)] transition-all relative">
          <Bell size={18} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-black animate-pulse"></span>
        </button>
        
        <div className="flex items-center gap-3 md:gap-4 pl-4 md:pl-6 border-l border-glass-border">
          <div className="hidden md:block text-right">
            <p className="text-sm font-bold text-white tracking-wide">PSF Admin</p>
            <p className="text-xs text-primary font-medium tracking-wider uppercase">Super Admin</p>
          </div>
          <div className="w-10 h-10 md:w-11 md:h-11 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(168,98,237,0.2)]">
            <User size={20} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          </div>
        </div>
      </div>
    </header>
  )
}
