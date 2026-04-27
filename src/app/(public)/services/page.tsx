'use client';
export const runtime = "edge";

import { useEffect, useState } from 'react';

export default function ServicesPage() {
  const [cmsData, setCmsData] = useState<any>(null);
  const [contentMap, setContentMap] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        setCmsData(data);
        const map = data?.content?.reduce((acc: any, item: any) => {
          acc[item.key] = item.value;
          return acc;
        }, {}) || {};
        setContentMap(map);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-dark text-white">Loading Services...</div>;

  const services = cmsData?.services || [];

  return (
    <>
      {/* Hero Section */}
      <section
        style={{
          height: '60vh',
          minHeight: '400px',
          backgroundImage: `linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.85)), url("${contentMap.services_hero_bg || '/images/conquer.jpg'}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '120px',
        }}
      >
        <div className="container" style={{ textAlign: 'center' }}>
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '3px',
              marginBottom: '1rem',
              color: '#fff',
            }}
          >
            Our{' '}
            <span style={{ color: 'var(--primary)', textShadow: '0 0 30px rgba(168,98,237,0.6)' }}>
              Services
            </span>
          </h1>
          <p style={{ color: '#ccc', fontSize: '1.15rem', maxWidth: '620px', margin: '0 auto' }}>
            {contentMap.services_hero_subtitle || "Power Soul Fitness is the premier fitness destination in Lonar. World-class equipment, expert coaching, and a community that pushes you to be your best."}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section style={{ backgroundColor: '#0a0a0a', padding: '80px 0' }}>
        <div className="container">
          <div className="reveal animate-up" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <p style={{ color: 'var(--primary)', fontWeight: 700, letterSpacing: '3px', fontSize: '0.85rem', marginBottom: '10px', textTransform: 'uppercase' }}>
              What We Offer
            </p>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, color: '#fff' }}>
              Best Fitness Services in{' '}
              <span style={{ color: 'var(--primary)' }}>Lonar</span>
            </h2>
            <div style={{ width: '60px', height: '4px', background: 'var(--primary)', margin: '20px auto 0', borderRadius: '2px', boxShadow: '0 0 12px rgba(168,98,237,0.6)' }} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service: any, index: number) => (
              <div
                key={service.id}
                className="reveal animate-up"
                style={{ animationDelay: `${(index % 3) * 0.12}s` }}
              >
                <div
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '16px',
                    padding: '32px 28px',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'default',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '16px',
                      fontSize: '7rem',
                      fontWeight: 900,
                      color: 'rgba(168,98,237,0.06)',
                      lineHeight: 1,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div
                    style={{
                      width: '58px',
                      height: '58px',
                      background: 'rgba(168,98,237,0.12)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '20px',
                      border: '1px solid rgba(168,98,237,0.25)',
                    }}
                  >
                    <i className={service.icon} style={{ fontSize: '1.4rem', color: 'var(--primary)' }} />
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                    <span style={{ color: 'var(--primary)' }}>{index + 1}. </span>
                    {service.title}
                  </h3>

                  <p style={{ color: '#999', fontSize: '0.92rem', lineHeight: 1.7 }}>
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, rgba(168,98,237,0.08) 50%, #0a0a0a 100%)',
          padding: '100px 0',
          textAlign: 'center',
        }}
      >
        <div className="container reveal animate-up">
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, color: '#fff', marginBottom: '20px' }}>
            {contentMap.services_cta_title || "Ready to Transform Your Life in Lonar?"}
          </h2>
          <p style={{ color: '#aaa', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto 40px' }}>
            {contentMap.services_cta_desc || "Join the biggest and most equipped fitness facility in the Lonar region. Our expert trainers and state-of-the-art services are waiting for you."}
          </p>
          <a
            href={`tel:${contentMap.contact_phone1 ? contentMap.contact_phone1.replace(/\s+/g, '') : '+919527958899'}`}
            className="btn btn-primary"
            style={{
              padding: '16px 44px',
              fontSize: '1rem',
              fontWeight: 700,
              borderRadius: '50px',
              boxShadow: '0 0 35px rgba(168,98,237,0.4)',
              letterSpacing: '1.5px',
            }}
          >
            <i className="fas fa-phone" style={{ marginRight: '10px' }} />
            Call Us Now
          </a>
        </div>
      </section>
    </>
  );
}
