'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AboutUsClient() {
  const [cmsData, setCmsData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // Fetch CMS Content
  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        // Convert array of content into a key-value map for easy access
        const contentMap = data?.content?.reduce((acc: any, item: any) => {
          acc[item.key] = item.value;
          return acc;
        }, {}) || {};
        setCmsData({ ...contentMap, _sections: data.sections });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const isSectionEnabled = (name: string) => {
    if (!cmsData?._sections) return true;
    const section = cmsData._sections.find((s: any) => s.name.toLowerCase() === name.toLowerCase());
    return section ? section.enabled : true;
  };

  // Initialize ScrollReveal
  useEffect(() => {
    if (loading) return;
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
  }, [loading]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-dark text-white">Loading About Us...</div>;

  return (
    <div className="about-page">
      {/* Page Header */}
      <section className="page-header relative" style={{ 
        height: '40vh',
        minHeight: '350px',
        background: `linear-gradient(rgba(0,0,0,0.8), rgba(10,10,10,1)), url("${cmsData.about_hero_bg || '/images/conquer.jpg'}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}>
        <div className="container px-4 reveal animate-up" style={{ marginTop: '100px' }}>
          <h1 className="gradient-text font-black" style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '2px', lineHeight: '1.1' }}>About Us</h1>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', color: 'var(--text-grey)', fontSize: '1.1rem' }}>
            <Link href="/" className="hover-primary">Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--primary)' }}>About Us</span>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      {isSectionEnabled('mission') && (
        <section className="mission-vision reveal animate-up py-10 md:py-20" style={{ backgroundColor: 'var(--bg-dark)' }}>
          <div className="container px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Our Mission */}
              <div className="glass reveal animate-left p-6 md:p-12" style={{ borderTop: '4px solid var(--primary)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <i className="fas fa-bullseye fa-3x" style={{ color: 'var(--primary)', marginBottom: '20px' }}></i>
                <h2 style={{ fontSize: '2.2rem', marginBottom: '20px' }}>Our Mission</h2>
                <p style={{ color: 'var(--text-grey)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '20px' }}>
                  {cmsData.about_mission_p1 || "We are Team POWER SOUL, your ultimate guide for fitness, nutrition, and the wellness of life."}
                </p>
                <p style={{ color: 'var(--text-grey)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '20px' }}>
                  {cmsData.about_mission_p2 || "Our mission is to make our clients fit not only physically but mentally as well—that's why we call it a POWER SOUL. We strive to give our youth a new addiction to fitness, steering them away from bad habits."}
                </p>
                <p style={{ color: 'var(--text-grey)', fontSize: '1.1rem', lineHeight: '1.8' }}>
                  {cmsData.about_mission_p3 || "In today's life, everyone is going through some problems, anxiety, and tension. We may not be able to solve all of them, but we definitely can give you the strength to face them."}
                </p>
              </div>

              {/* Our Vision */}
              <div className="glass reveal animate-right p-6 md:p-12" style={{ borderTop: '4px solid var(--accent)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <i className="fas fa-eye fa-3x" style={{ color: 'var(--accent)', marginBottom: '20px' }}></i>
                <h2 style={{ fontSize: '2.2rem', marginBottom: '20px' }}>Our Vision</h2>
                <p style={{ color: 'var(--text-grey)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '20px' }}>
                  {cmsData.about_vision_p1 || "To make our clients live a healthy and happy life by providing them the absolute best service."}
                </p>
                <p style={{ color: 'var(--text-grey)', fontSize: '1.1rem', lineHeight: '1.8' }}>
                  {cmsData.about_vision_p2 || "We aim to transform people by cultivating good habits of wellness and fitness. By spreading awareness of a healthy lifestyle, we help our community avoid bad addictions and live their best lives."}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Founder & Team Section */}
      {isSectionEnabled('team') && (
        <section className="team-section reveal animate-up py-10 md:py-20" style={{ backgroundColor: 'var(--bg-dark-alt)' }}>
          <div className="container px-4">
            <div className="section-title text-center" style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h2 className="gradient-text" style={{ fontSize: 'clamp(2rem, 8vw, 3rem)' }}>Power Soul Fitness <span style={{ color: 'var(--text-light)' }}>LONAR</span></h2>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-12 justify-center">
              {/* Image */}
              <div className="glass reveal animate-left" style={{ padding: '15px', maxWidth: '350px', width: '100%', borderRadius: '12px' }}>
                <img 
                  src={cmsData.about_founder_image || "https://powersoulfitness.com/wp-content/uploads/2021/12/shiv-mapari-768x1097.jpeg"}
                  alt="Founder of Power Soul Fitness Lonar - Shiv Mapari" 
                  style={{ width: '100%', borderRadius: '8px', display: 'block' }} 
                />
              </div>

              {/* Details */}
              <div className="reveal animate-right" style={{ maxWidth: '600px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '2.5rem', marginBottom: '10px', color: 'var(--primary)' }}>A project by</h3>
                <h2 style={{ fontSize: '3.5rem', textTransform: 'uppercase', marginBottom: '15px', letterSpacing: '2px' }}>
                  {cmsData.about_founder_name || "Mr. Shiv Mapari"}
                </h2>
                <p style={{ color: 'var(--accent)', fontSize: '1.3rem', marginBottom: '40px', fontStyle: 'italic' }}>
                  {cmsData.about_founder_role || "(Govt. Certified Nutritionist and Fitness Coach)"}
                </p>

              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
