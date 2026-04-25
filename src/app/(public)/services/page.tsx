'use client';

import { useEffect } from 'react';

const services = [
  {
    id: '01',
    title: 'Body Building',
    description: 'Special training programs for bodybuilding. Achieve your dream physique with top-tier equipment and expert guidance right here in Lonar.',
    icon: 'fas fa-dumbbell'
  },
  {
    id: '02',
    title: 'Self Defence',
    description: 'Special self-defense training programs for ladies in the Lonar region. Build confidence and learn crucial techniques to protect yourself.',
    icon: 'fas fa-user-shield'
  },
  {
    id: '03',
    title: 'Steam Bath',
    description: 'Relax and recover with our premium steam bath facility. Essential for good health of muscles and skin after a heavy workout in Lonar.',
    icon: 'fas fa-hot-tub'
  },
  {
    id: '04',
    title: 'Cardio',
    description: "Equipped with the best quality machines for your heart health. Burn calories and improve stamina at Lonar's most advanced cardio section.",
    icon: 'fas fa-heartbeat'
  },
  {
    id: '05',
    title: 'Crossfit',
    description: 'High-intensity functional movements designed to give you the best strength, speed, and conditioning. The ultimate Crossfit experience in Lonar.',
    icon: 'fas fa-running'
  },
  {
    id: '06',
    title: 'Strength Training',
    description: "The best training to improve muscles, strength, and endurance. Lift heavy and safe with Lonar's finest strength training setup.",
    icon: 'fas fa-weight-hanging'
  },
  {
    id: '07',
    title: 'Personal Training',
    description: "Get the best results with the guidance of certified and experienced fitness coaches. Your dedicated fitness partner in Lonar.",
    icon: 'fas fa-user-ninja'
  },
  {
    id: '08',
    title: 'Yoga',
    description: "Get good health and inner peace with certified and experienced yoga teachers. Find your zen at the most peaceful fitness center in Lonar.",
    icon: 'fas fa-om'
  },
  {
    id: '09',
    title: 'Diet Nutrition',
    description: "Get your personalized diet plans through the best certified nutritionists in Lonar. Fuel your body correctly for optimal results.",
    icon: 'fas fa-apple-alt'
  },
  {
    id: '10',
    title: 'Ladies Batch Management',
    description: "Special timing and training sessions exclusively for ladies according to their convenience. A safe and comfortable environment in Lonar.",
    icon: 'fas fa-female'
  }
];

export default function ServicesPage() {
  useEffect(() => {
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
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section
        style={{
          height: '60vh',
          minHeight: '400px',
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.85)), url("/images/conquer.jpg")',
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
            Power Soul Fitness is the premier fitness destination in{' '}
            <strong style={{ color: '#fff' }}>Lonar</strong>. World-class equipment, expert coaching, and a community that pushes you to be your best.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section style={{ backgroundColor: '#0a0a0a', padding: '80px 0' }}>
        <div className="container">
          {/* Section Heading */}
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

          {/* Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '28px',
            }}
          >
            {services.map((service, index) => (
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
                    transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)';
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(168,98,237,0.35)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 50px rgba(168,98,237,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                  }}
                >
                  {/* Background Number */}
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
                    {service.id}
                  </span>

                  {/* Icon */}
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

                  {/* Title */}
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                    <span style={{ color: 'var(--primary)' }}>{service.id}. </span>
                    {service.title}
                  </h3>

                  {/* Description */}
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
            Ready to Transform Your Life in{' '}
            <span style={{ color: 'var(--primary)' }}>Lonar?</span>
          </h2>
          <p style={{ color: '#aaa', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto 40px' }}>
            Join the biggest and most equipped fitness facility in the Lonar region. Our expert trainers and state-of-the-art services are waiting for you.
          </p>
          <a
            href="tel:+919527958899"
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
