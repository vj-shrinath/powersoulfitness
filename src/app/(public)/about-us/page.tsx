'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function AboutUs() {
  // Initialize ScrollReveal
  useEffect(() => {
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);
    
    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-page">
      {/* Page Header */}
      <section className="page-header" style={{ 
        height: '60vh', 
        minHeight: '400px',
        background: 'linear-gradient(rgba(0,0,0,0.6), rgba(10,10,10,1)), url("/images/conquer.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        paddingTop: '80px',
      }}>
        <div className="container reveal animate-up">
          <h1 className="gradient-text" style={{ fontSize: '4.5rem', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '3px' }}>About Us</h1>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', color: 'var(--text-grey)', fontSize: '1.1rem' }}>
            <Link href="/" className="hover-primary">Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--primary)' }}>About Us</span>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="mission-vision reveal animate-up" style={{ padding: '100px 0', backgroundColor: 'var(--bg-dark)' }}>
        <div className="container">
          <div className="row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
            {/* Our Mission */}
            <div className="glass reveal animate-left" style={{ padding: '50px', borderTop: '4px solid var(--primary)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <i className="fas fa-bullseye fa-3x" style={{ color: 'var(--primary)', marginBottom: '20px' }}></i>
              <h2 style={{ fontSize: '2.2rem', marginBottom: '20px' }}>Our Mission</h2>
              <p style={{ color: 'var(--text-grey)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '20px' }}>
                We are Team <strong>POWER SOUL</strong>, your ultimate guide for fitness, nutrition, and the wellness of life.
              </p>
              <p style={{ color: 'var(--text-grey)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '20px' }}>
                Our mission is to make our clients fit not only physically but mentally as well—that's why we call it a <strong>POWER SOUL</strong>. We strive to give our youth a new addiction to fitness, steering them away from bad habits.
              </p>
              <p style={{ color: 'var(--text-grey)', fontSize: '1.1rem', lineHeight: '1.8' }}>
                In today's life, everyone is going through some problems, anxiety, and tension. We may not be able to solve all of them, but we definitely can give you the strength to face them.
              </p>
            </div>

            {/* Our Vision */}
            <div className="glass reveal animate-right" style={{ padding: '50px', borderTop: '4px solid var(--accent)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <i className="fas fa-eye fa-3x" style={{ color: 'var(--accent)', marginBottom: '20px' }}></i>
              <h2 style={{ fontSize: '2.2rem', marginBottom: '20px' }}>Our Vision</h2>
              <p style={{ color: 'var(--text-grey)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '20px' }}>
                To make our clients live a healthy and happy life by providing them the absolute best service.
              </p>
              <p style={{ color: 'var(--text-grey)', fontSize: '1.1rem', lineHeight: '1.8' }}>
                We aim to transform people by cultivating good habits of wellness and fitness. By spreading awareness of a healthy lifestyle, we help our community avoid bad addictions and live their best lives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder & Team Section */}
      <section className="team-section reveal animate-up" style={{ padding: '100px 0', backgroundColor: 'var(--bg-dark-alt)' }}>
        <div className="container">
          <div className="section-title text-center" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 className="gradient-text" style={{ fontSize: '3rem' }}>Power Soul Fitness <span style={{ color: 'var(--text-light)' }}>LONAR</span></h2>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '60px', justifyContent: 'center' }}>
            {/* Image */}
            <div className="glass reveal animate-left" style={{ padding: '15px', maxWidth: '400px', width: '100%', borderRadius: '12px' }}>
              <img 
                src="https://web.archive.org/web/20230322152101im_/https://powersoulfitness.com/wp-content/uploads/2021/12/shiv-mapari-768x1097.jpeg" 
                alt="Shiv Mapari" 
                style={{ width: '100%', borderRadius: '8px', display: 'block' }} 
              />
            </div>

            {/* Details */}
            <div className="reveal animate-right" style={{ maxWidth: '600px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '2.5rem', marginBottom: '10px', color: 'var(--primary)' }}>A project by</h3>
              <h2 style={{ fontSize: '3.5rem', textTransform: 'uppercase', marginBottom: '15px', letterSpacing: '2px' }}>Mr. Shiv Mapari</h2>
              <p style={{ color: 'var(--accent)', fontSize: '1.3rem', marginBottom: '40px', fontStyle: 'italic' }}>
                (Govt. Certified Nutritionist and Fitness Coach)
              </p>

              <div className="glass" style={{ padding: '40px', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <h3 style={{ fontSize: '2rem', marginBottom: '30px' }}>And Team</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center' }}>
                  <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '30px' }}>
                    <h4 style={{ color: '#ff3b3b', fontSize: '1.5rem', marginBottom: '5px' }}>SAISH HEALTH & FITNESS</h4>
                    <span style={{ color: 'var(--text-grey)' }}>(Pune)</span>
                  </div>
                  <div>
                    <h4 style={{ color: '#ff3b3b', fontSize: '1.5rem', marginBottom: '5px' }}>RIO Fitness</h4>
                    <span style={{ color: 'var(--text-grey)' }}>(Bangalore)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
