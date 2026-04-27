'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, Mail } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking a link
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header 
      className="absolute top-0 left-0 w-full z-50 py-4"
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        
        {/* Logo */}
        <div className="relative z-50">
          <Link href="/" onClick={closeMenu}>
            <img 
              src="/images/logo.png" 
              alt="Power Soul Fitness" 
              style={{ width: 'auto', height: '60px', maxHeight: '60px', objectFit: 'contain' }}
              className="drop-shadow-2xl"
            />
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8 font-bold uppercase tracking-wider text-sm">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <Link href="/about-us" className="hover:text-primary transition-colors">About Us</Link>
          <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
          <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:block relative z-50">
          <a href="tel:9527958899" className="btn-primary px-6 py-2.5 rounded-md font-bold uppercase tracking-wider text-sm shadow-[0_0_20px_rgba(168,98,237,0.3)] hover:shadow-[0_0_30px_rgba(168,98,237,0.6)] transition-all">
            Join Now
          </a>
        </div>

        {/* Mobile Toggle Button */}
        <button 
          className="lg:hidden relative z-50 text-white p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={32} className="text-primary" /> : <Menu size={32} />}
        </button>

      </div>

      {/* Mobile Nav Overlay */}
      <div className={`
        fixed inset-0 bg-black/95 backdrop-blur-xl z-40 lg:hidden flex flex-col items-center justify-center transition-all duration-500
        ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
      `}>
        <nav className="flex flex-col items-center gap-8 font-bold uppercase tracking-widest text-2xl">
          <Link href="/" onClick={closeMenu} className="hover:text-primary transition-colors hover:scale-110">Home</Link>
          <Link href="/about-us" onClick={closeMenu} className="hover:text-primary transition-colors hover:scale-110">About Us</Link>
          <Link href="/services" onClick={closeMenu} className="hover:text-primary transition-colors hover:scale-110">Services</Link>
          <Link href="/contact" onClick={closeMenu} className="hover:text-primary transition-colors hover:scale-110">Contact</Link>
        </nav>
        
        <div className="mt-12 flex flex-col items-center gap-6">
          <a href="tel:9527958899" onClick={closeMenu} className="btn-primary px-10 py-4 rounded-full font-bold uppercase tracking-widest text-lg shadow-[0_0_30px_rgba(168,98,237,0.5)]">
            Join Now
          </a>
          
          <div className="flex gap-6 mt-4">
            <a href="tel:+919527958899" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
              <Phone size={20} />
            </a>
            <a href="mailto:powersoulfitness@gmail.com" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
              <Mail size={20} />
            </a>
            <a href="https://www.instagram.com/powersoulfitness" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
              <i className="fab fa-instagram text-xl"></i>
            </a>
            <a href="https://www.facebook.com/powersoulfitness" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
              <i className="fab fa-facebook text-xl"></i>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
