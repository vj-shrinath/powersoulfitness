import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="site-footer bg-dark-alt" style={{ padding: '80px 0 20px', borderTop: '2px solid var(--primary)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '60px' }}>
          <div className="footer-about">
            <h3 style={{ color: 'var(--primary)', marginBottom: '25px', fontSize: '1.5rem' }}>Power Soul <span style={{ color: 'var(--accent)' }}>Fitness</span></h3>
            <p style={{ color: 'var(--text-grey)', lineHeight: '1.8' }}>
              Power Soul Fitness is the <strong>best gym in Lonar, Maharashtra</strong>. We provide expert guidance for fitness, nutrition, and mental wellness. 
              Our mission is to help the Lonar community find their inner strength and achieve body transformation.
            </p>
            <div className="social-links" style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
              <a href="https://facebook.com/powersoulfitness" target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', background: 'var(--glass)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition)' }} className="social-icon">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://instagram.com/powersoulfitness" target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', background: 'var(--glass)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition)' }} className="social-icon">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://api.whatsapp.com/send?phone=919527958899" target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', background: 'var(--glass)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition)' }} className="social-icon">
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>
          <div className="footer-links">
            <h3 style={{ marginBottom: '25px', fontSize: '1.3rem' }}>Fitness in Lonar</h3>
            <ul style={{ color: 'var(--text-grey)' }}>
              <li style={{ marginBottom: '12px' }}><Link href="/" style={{ transition: 'var(--transition)' }} className="hover-primary">Home</Link></li>
              <li style={{ marginBottom: '12px' }}><Link href="/about-us" style={{ transition: 'var(--transition)' }} className="hover-primary">About Us</Link></li>
              <li style={{ marginBottom: '12px' }}><Link href="/services" style={{ transition: 'var(--transition)' }} className="hover-primary">Our Services</Link></li>
              <li style={{ marginBottom: '12px' }}><Link href="/contact" style={{ transition: 'var(--transition)' }} className="hover-primary">Contact Us</Link></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h3 style={{ marginBottom: '25px', fontSize: '1.3rem' }}>Contact Info</h3>
            <ul style={{ color: 'var(--text-grey)' }}>
              <li style={{ marginBottom: '15px', display: 'flex', gap: '15px' }}>
                <i className="fas fa-map-marker-alt" style={{ color: 'var(--accent)', marginTop: '5px' }}></i>
                <span>Opposite Limbi Lake, Loni Road, Lonar, Maharashtra 443302</span>
              </li>
              <li style={{ marginBottom: '15px', display: 'flex', gap: '15px' }}>
                <i className="fas fa-phone" style={{ color: 'var(--primary)', marginTop: '5px' }}></i>
                <a href="tel:+919527958899" style={{ color: 'inherit', textDecoration: 'none' }}>+91 9527958899</a>
              </li>
              <li style={{ marginBottom: '15px', display: 'flex', gap: '15px' }}>
                <i className="fas fa-envelope" style={{ color: 'var(--accent)', marginTop: '5px' }}></i>
                <a href="mailto:powersoulfitness@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>powersoulfitness@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom" style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '30px', textAlign: 'center', color: 'var(--text-grey)', fontSize: '0.9rem' }}>
          <p>
            Copyright © {new Date().getFullYear()} Power Soul Fitness. 
            Designed & Developed by <a href="https://vjshrinath.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover-primary" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: '600' }}>Vijay Shrinath</a>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
