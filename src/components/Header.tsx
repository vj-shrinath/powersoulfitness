import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="site-header" style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 1000 }}>
      {/* Top Header */}
      <div className="top-header" style={{ background: 'rgba(0,0,0,0.5)', color: 'white', padding: '8px 0', fontSize: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="header-contact">
            <ul style={{ display: 'flex', gap: '20px' }}>
              <li>
                <a href="tel:+919527958899" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fas fa-phone text-primary"></i> +91 9527958899
                </a>
              </li>
              <li className="d-none d-md-block">
                <a href="mailto:powersoulfitness@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fas fa-envelope text-primary"></i> powersoulfitness@gmail.com
                </a>
              </li>
            </ul>
          </div>
          <div className="social-profile">
            <ul style={{ display: 'flex', gap: '15px' }}>
              <li><a href="https://www.facebook.com/powersoulfitness" target="_blank" rel="noopener noreferrer" className="hover-primary"><i className="fab fa-facebook"></i></a></li>
              <li><a href="https://www.instagram.com/powersoulfitness" target="_blank" rel="noopener noreferrer" className="hover-primary"><i className="fab fa-instagram"></i></a></li>
              <li><a href="https://api.whatsapp.com/send?phone=919527958899&text=Hii%F0%9F%99%8B,%20I%20want%20more%20information%20about%20Power%20Soul%20Fitness!" target="_blank" rel="noopener noreferrer" className="hover-primary"><i className="fab fa-whatsapp"></i></a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="main-header" style={{ padding: '20px 0', transition: 'var(--transition)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="logo">
            <Link href="/">
              <img 
                src="/images/logo.png" 
                alt="Power Soul Fitness" 
                style={{ height: '100px', filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' }}
              />
            </Link>
          </div>
          <nav className="nav-menu">
            <ul style={{ display: 'flex', gap: '40px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <li><Link href="/" className="hover-primary">Home</Link></li>
              <li><Link href="/about-us" className="hover-primary">About Us</Link></li>
              <li><Link href="/services" className="hover-primary">Services</Link></li>
              <li><Link href="/contact" className="hover-primary">Contact</Link></li>
            </ul>
          </nav>
          <div className="header-btn">
            <a href="tel:9527958899" className="btn btn-primary" style={{ boxShadow: '0 0 20px rgba(168, 98, 237, 0.3)' }}>Join Now</a>
          </div>
        </div>
      </div>
      
    </header>
  );
};

export default Header;
