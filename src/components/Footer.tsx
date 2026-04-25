import React from 'react';

const Footer = () => {
  return (
    <footer className="site-footer bg-dark-alt" style={{ padding: '80px 0 20px', borderTop: '2px solid var(--primary)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '60px' }}>
          <div className="footer-about">
            <h3 style={{ color: 'var(--primary)', marginBottom: '25px', fontSize: '1.5rem' }}>Power Soul <span style={{ color: 'var(--accent)' }}>Fitness</span></h3>
            <p style={{ color: 'var(--text-grey)', lineHeight: '1.8' }}>
              We are team POWER SOUL, the best guidance for fitness, nutrition, and wellness of life. 
              Our mission is to make our clients fit not only physically but mentally also.
            </p>
            <div className="social-links" style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
              <a href="#" style={{ width: '40px', height: '40px', background: 'var(--glass)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition)' }} className="social-icon">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" style={{ width: '40px', height: '40px', background: 'var(--glass)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition)' }} className="social-icon">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" style={{ width: '40px', height: '40px', background: 'var(--glass)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition)' }} className="social-icon">
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>
          <div className="footer-links">
            <h3 style={{ marginBottom: '25px', fontSize: '1.3rem' }}>Quick Links</h3>
            <ul style={{ color: 'var(--text-grey)' }}>
              <li style={{ marginBottom: '12px' }}><a href="/" style={{ transition: 'var(--transition)' }} className="hover-primary">Home</a></li>
              <li style={{ marginBottom: '12px' }}><a href="#about" style={{ transition: 'var(--transition)' }} className="hover-primary">About Us</a></li>
              <li style={{ marginBottom: '12px' }}><a href="#services" style={{ transition: 'var(--transition)' }} className="hover-primary">Services</a></li>
              <li style={{ marginBottom: '12px' }}><a href="#contact" style={{ transition: 'var(--transition)' }} className="hover-primary">Contact</a></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h3 style={{ marginBottom: '25px', fontSize: '1.3rem' }}>Get In Touch</h3>
            <ul style={{ color: 'var(--text-grey)' }}>
              <li style={{ marginBottom: '15px', display: 'flex', gap: '15px' }}>
                <i className="fas fa-map-marker-alt" style={{ color: 'var(--accent)', marginTop: '5px' }}></i>
                <span>Opposite Limbi Lake, Loni Road, Lonar</span>
              </li>
              <li style={{ marginBottom: '15px', display: 'flex', gap: '15px' }}>
                <i className="fas fa-phone" style={{ color: 'var(--primary)', marginTop: '5px' }}></i>
                <span>+91 9527958899</span>
              </li>
              <li style={{ marginBottom: '15px', display: 'flex', gap: '15px' }}>
                <i className="fas fa-envelope" style={{ color: 'var(--accent)', marginTop: '5px' }}></i>
                <span>powersoulfitness@gmail.com</span>
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
