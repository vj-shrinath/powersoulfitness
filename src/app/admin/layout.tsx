'use client'

import { useState } from 'react'
import Sidebar from '@/components/admin/Sidebar'
import Header from '@/components/admin/Header'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-dark text-white relative overflow-hidden">
      {/* Ambient Animated Background */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] mix-blend-screen pointer-events-none animate-pulse" style={{ animationDuration: '7s' }} />
      <div className="fixed inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
      
      <div className="flex w-full z-10 relative">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        <div className={`
          fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300
          ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
        `} onClick={() => setMobileMenuOpen(false)}></div>
        
        <div className={`
          fixed inset-y-0 left-0 z-50 transform lg:hidden transition-transform duration-300
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar onNavClick={() => setMobileMenuOpen(false)} />
        </div>

        <div className="flex-1 flex flex-col min-w-0 border-l border-glass-border shadow-[-20px_0_40px_rgba(0,0,0,0.5)]">
          <Header onMenuClick={() => setMobileMenuOpen(true)} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 relative">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
