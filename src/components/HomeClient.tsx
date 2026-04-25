'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

type ServiceItem = {
  id: string;
  title: string;
  desc: string;
  color: string;
  icon?: string;
  img?: string;
};

export default function Home() {

  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPowerSlide, setCurrentPowerSlide] = useState(0);
  const [isPowerPaused, setIsPowerPaused] = useState(false);

  const heroImages = [
    '/images/gym-girl-scaled.jpg',
    '/images/fitness image 2.jpg'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  useEffect(() => {
    if (isPowerPaused) return;
    
    // Only run slider logic on mobile devices (check via window width to avoid unnecessary re-renders, but CSS handles desktop view)
    // We let the interval run anyway, it won't affect desktop because CSS overrides transform to 'none'
    const timer = setInterval(() => {
      setCurrentPowerSlide((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPowerPaused]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1
    };
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

  const initialServices: ServiceItem[] = [
    {
      id: '01',
      title: 'Body Building',
      desc: 'Specialized hypertrophy programs tailored to your unique physique goals with expert guidance.',
      color: 'var(--primary)',
      icon: 'fas fa-dumbbell'
    },
    {
      id: '02',
      title: 'Modern Equipment',
      desc: 'Train with state-of-the-art machines and premium free weights area designed for maximum safety.',
      color: 'var(--accent)',
      icon: 'fas fa-cogs'
    },
    {
      id: '03',
      title: 'Self Defense',
      desc: 'Confidence-building self defense classes for ladies and kids, taught by certified experts.',
      icon: 'fas fa-user-shield',
      color: 'var(--primary)'
    }
  ];



  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero" style={{ 
        position: 'relative',
        height: '100vh', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        paddingTop: '100px',
        overflow: 'hidden'
      }}>
        {/* Cinematic Background Slider */}
        {heroImages.map((src, index) => (
          <div 
            key={src}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(10,10,10,0.9)), url("${src}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: currentSlide === index ? 1 : 0,
              transform: currentSlide === index ? 'scale(1.08)' : 'scale(1)',
              transition: 'opacity 1.5s ease-in-out, transform 6s ease-out',
              zIndex: 1
            }}
          />
        ))}

        {/* Hero Content */}
        <div className="container" style={{ position: 'relative', zIndex: 2, animation: 'fadeInUp 1.2s ease-out' }}>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--accent)', marginBottom: '10px', textShadow: '2px 2px 4px rgba(0,0,0,0.5)', letterSpacing: '4px', textTransform: 'uppercase' }}>Keep Your Body</h2>
          <h1 style={{ fontSize: '6rem', marginBottom: '30px', fontWeight: '900', letterSpacing: '2px', lineHeight: '1.1' }}><span className="fire-text">FIT & STRONG</span></h1>
          <p style={{ maxWidth: '700px', margin: '0 auto 40px', fontSize: '1.3rem', color: 'rgba(255,255,255,0.9)', lineHeight: '1.6' }}>
            Recognize your super powers with us. Build strength like superman and lift weight like thor's hammer. Join the most premium fitness destination in Lonar.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <a href="tel:9527958899" className="btn btn-primary glow-btn" style={{ padding: '15px 40px', fontSize: '1.1rem' }}>Start Training Now</a>
            <a href="#about" className="btn btn-outline" style={{ padding: '15px 40px', fontSize: '1.1rem', borderColor: 'var(--accent)', color: 'var(--accent)' }}>Explore Gym</a>
          </div>
        </div>

        {/* Modern Slider Indicators */}
        <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '12px', zIndex: 2 }}>
          {heroImages.map((_, index) => (
            <div 
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                width: currentSlide === index ? '45px' : '15px',
                height: '5px',
                background: currentSlide === index ? 'var(--primary)' : 'rgba(255,255,255,0.3)',
                borderRadius: '10px',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                boxShadow: currentSlide === index ? '0 0 12px var(--primary)' : 'none'
              }}
            />
          ))}
        </div>
      </section>



      {/* About Section */}
      <section id="about" className="welcome bg-dark-alt reveal animate-up">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '80px', alignItems: 'center' }}>
          <div className="welcome-image">
            <div style={{ position: 'relative' }}>
              <img 
                src="/images/conquer.jpg" 
                alt="Welcome" 
                style={{ borderRadius: '12px', position: 'relative', zIndex: 2, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
              />
              <div style={{ position: 'absolute', top: '-30px', left: '-30px', width: '100%', height: '100%', border: '4px solid var(--accent)', borderRadius: '12px', zIndex: 1 }}></div>

            </div>
          </div>
          <div className="welcome-content">
            <h2 style={{ fontSize: '3rem', marginBottom: '25px', lineHeight: '1.2' }}>Transform Your <span className="text-primary">Soul</span> & <span className="text-accent">Body</span></h2>
            <p style={{ color: 'var(--text-grey)', marginBottom: '35px', fontSize: '1.15rem', lineHeight: '1.8' }}>
              We are team POWER SOUL, providing the best guidance for fitness, nutrition, and wellness. 
              Our mission is to give our youth a new addiction of fitness, rather than bad habits. We believe in creating a community where everyone feels like a superhero.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <div className="glass reveal animate-left" style={{ padding: '30px', borderLeft: '5px solid var(--primary)' }}>
                <h4 style={{ color: 'var(--primary)', marginBottom: '15px', fontSize: '1.3rem' }}>Body Power</h4>
                <p style={{ fontSize: '1rem', color: 'var(--text-grey)' }}>Build immense strength with our tailored hypertrophy programs.</p>
              </div>
              <div className="glass reveal animate-right" style={{ padding: '30px', borderLeft: '5px solid var(--accent)' }}>
                <h4 style={{ color: 'var(--accent)', marginBottom: '15px', fontSize: '1.3rem' }}>Soul Peace</h4>
                <p style={{ fontSize: '1rem', color: 'var(--text-grey)' }}>Master your mind while mastering your body in a focused environment.</p>
              </div>
            </div>
            <a href="tel:9527958899" className="btn btn-primary" style={{ marginTop: '50px', padding: '15px 40px' }}>Get Started Today</a>
          </div>
        </div>
      </section>

      {/* Super Powers Section */}
      <section className="super-powers reveal animate-up">
        <div className="container">
          <div className="section-title">
            <h2 className="gradient-text">Unleash Your Super Powers</h2>
            <p style={{ color: 'var(--text-grey)' }}>Every member has a unique power. We help you find yours.</p>
          </div>
          <div className="power-slider-container">
            <div 
              className="power-slider-wrapper"
              style={{ transform: `translateX(-${currentPowerSlide * 100}%)` }}
            >
              <div className="power-slide">
                <div className="power-card glass reveal animate-up" style={{ overflow: 'hidden', transition: 'var(--transition)' }}>
                  <div className="power-img-wrapper">
                    <img src="/images/superman.jpeg" alt="Superman" className="hover-zoom power-img" />
                  </div>
                  <div style={{ padding: '30px' }}>
                    <h3 style={{ color: 'var(--primary)', fontSize: '1.8rem' }}>Superman Strength</h3>
                    <p style={{ color: 'var(--text-grey)', marginTop: '12px', fontSize: '1.1rem' }}>Push your physical limits and build the physique of a champion.</p>
                  </div>
                </div>
              </div>
              
              <div className="power-slide">
                <div className="power-card glass reveal animate-up" style={{ overflow: 'hidden', transition: 'var(--transition)', transitionDelay: '0.2s' }}>
                  <div className="power-img-wrapper">
                    <img src="/images/thor.jpg" alt="Thor" className="hover-zoom power-img" />
                  </div>
                  <div style={{ padding: '30px' }}>
                    <h3 style={{ color: 'var(--accent)', fontSize: '1.8rem' }}>Thor's Hammer</h3>
                    <p style={{ color: 'var(--text-grey)', marginTop: '12px', fontSize: '1.1rem' }}>Master the heavy lifts and feel the thunder in every workout.</p>
                  </div>
                </div>
              </div>
              
              <div className="power-slide">
                <div className="power-card glass reveal animate-up" style={{ overflow: 'hidden', transition: 'var(--transition)', transitionDelay: '0.4s' }}>
                  <div className="power-img-wrapper">
                    <img src="/images/supergirl.jpeg" alt="Supergirl" className="hover-zoom power-img" />
                  </div>
                  <div style={{ padding: '30px' }}>
                    <h3 style={{ color: 'var(--primary)', fontSize: '1.8rem' }}>Supergirl Energy</h3>
                    <p style={{ color: 'var(--text-grey)', marginTop: '12px', fontSize: '1.1rem' }}>Every woman has hidden strength. Join our community and unleash it.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="power-slider-controls">
              {[0, 1, 2].map((index) => (
                <div 
                  key={index}
                  className={`power-dot ${currentPowerSlide === index ? 'active' : ''}`}
                  onClick={() => setCurrentPowerSlide(index)}
                />
              ))}
              <button 
                className="power-pause-btn" 
                onClick={() => setIsPowerPaused(!isPowerPaused)}
                title={isPowerPaused ? "Play" : "Pause"}
              >
                <i className={`fas ${isPowerPaused ? 'fa-play' : 'fa-pause'}`}></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services bg-dark-alt reveal animate-up">
        <div className="container">
          <div className="section-title">
            <h2 className="gradient-text">Our Premium Services</h2>
            <p style={{ color: 'var(--text-grey)', marginTop: '10px' }}>We offer a wide range of services to help you achieve your fitness goals.</p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '30px',
            marginBottom: '50px'
          }}>
            {initialServices.map((service, index) => (
              <div 
                key={service.id} 
                className="service-card glass reveal animate-up" 
                style={{ 
                  padding: '50px 30px', 
                  textAlign: 'center', 
                  borderTop: `6px solid ${service.color}`,
                  animationDelay: `${(index % 3) * 0.2}s`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <div style={{ 
                  width: '120px', 
                  height: '120px', 
                  margin: '0 auto 25px', 
                  border: `2px solid ${service.color}`, 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: 'rgba(255,255,255,0.05)',
                  boxShadow: `0 0 20px ${service.color}33`
                }}>
                  {service.img ? (
                    <img src={service.img} alt={service.title} style={{ borderRadius: '50%', width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <i className={`${service.icon} fa-3x`} style={{ color: service.color }}></i>
                  )}
                </div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>{service.id}. {service.title}</h3>
                <p style={{ color: 'var(--text-grey)', fontSize: '1.05rem', lineHeight: '1.6', flex: 1 }}>{service.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link 
              href="/services"
              className="btn btn-primary"
              style={{ padding: '12px 40px', fontSize: '1.1rem' }}
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="amenities reveal animate-up" style={{ backgroundColor: 'var(--bg-dark)', padding: '100px 0' }}>
        <div className="container">
          <div className="section-title">
            <h2 className="gradient-text" style={{ fontSize: '3.5rem', textTransform: 'lowercase', marginBottom: '60px' }}>amenities</h2>
          </div>
          
          {/* Main Amenity */}
          <div className="glass reveal animate-up" style={{ padding: '60px 20px', textAlign: 'center', marginBottom: '30px', borderTop: '4px solid var(--primary)', backgroundColor: 'rgba(255,255,255,0.03)' }}>
            <i className="fas fa-snowflake fa-5x" style={{ color: 'var(--primary)', marginBottom: '30px' }}></i>
            <h3 style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '1.2rem', backgroundColor: 'rgba(0,0,0,0.7)', padding: '15px', display: 'inline-block', width: '100%', maxWidth: '600px', border: '1px solid rgba(255,255,255,0.1)' }}>Air Conditioned Gym</h3>
          </div>

          {/* Other Amenities */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '30px' }}>
            {[
              { icon: 'fas fa-wifi', title: 'WIFI' },
              { icon: 'fas fa-video', title: 'CCTV' },
              { icon: 'fas fa-music', title: 'MUSIC' },
              { icon: 'fas fa-lock', title: 'LOCKERS' },
              { icon: 'fas fa-hot-tub', title: 'STEAM BATH' },
              { icon: 'fas fa-shower', title: 'SHOWER' },
              { icon: 'fas fa-door-closed', title: 'CHANGING ROOM' },
              { icon: 'fas fa-dumbbell', title: 'ADVANCE EQUIPMENTS' },
            ].map((item, index) => (
              <div key={index} className="glass reveal animate-up" style={{ padding: '40px 20px', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.03)', transitionDelay: `${(index % 4) * 0.1}s`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <i className={`${item.icon} fa-3x`} style={{ marginBottom: '25px', color: 'var(--text-light)' }}></i>
                <h4 style={{ textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px', backgroundColor: 'rgba(0,0,0,0.7)', padding: '12px 5px', width: '100%', margin: '0', border: '1px solid rgba(255,255,255,0.1)' }}>{item.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Schedules Section */}
      <section className="schedules reveal animate-up">
        <div className="container">
          <div className="section-title">
            <h2 className="gradient-text">Elite Training Schedules</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            <div className="schedule-card glass reveal animate-up" style={{ padding: '50px 30px', textAlign: 'center', position: 'relative' }}>
              <i className="fas fa-dumbbell fa-4x" style={{ color: 'var(--primary)', marginBottom: '25px' }}></i>
              <h4 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Gym Hours</h4>
              <p style={{ color: 'var(--text-grey)', fontSize: '1.1rem' }}>Monday - Saturday</p>
              <div style={{ background: 'var(--primary)', padding: '15px', borderRadius: '10px', marginTop: '20px', display: 'inline-block' }}>
                <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'white' }}>6AM - 9AM | 5PM - 9PM</span>
              </div>
            </div>
            <div className="schedule-card glass reveal animate-up" style={{ padding: '50px 30px', textAlign: 'center', position: 'relative', transitionDelay: '0.2s' }}>
              <i className="fas fa-leaf fa-4x" style={{ color: 'var(--accent)', marginBottom: '25px' }}></i>
              <h4 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Yoga Classes</h4>
              <p style={{ color: 'var(--text-grey)', fontSize: '1.1rem' }}>Monday - Saturday</p>
              <div style={{ background: 'var(--accent)', padding: '15px', borderRadius: '10px', marginTop: '20px', display: 'inline-block' }}>
                <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'white' }}>5AM - 7AM</span>
              </div>
            </div>
            <div className="schedule-card glass reveal animate-up" style={{ padding: '50px 30px', textAlign: 'center', position: 'relative', transitionDelay: '0.4s' }}>
              <i className="fas fa-calendar-day fa-4x" style={{ color: 'var(--text-grey)', marginBottom: '25px' }}></i>
              <h4 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Sunday</h4>
              <p style={{ color: 'var(--text-grey)', fontSize: '1.1rem' }}>Weekly Rest Day</p>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '10px', marginTop: '20px', display: 'inline-block', width: '100%', maxWidth: '200px' }}>
                <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--accent)' }}>CLOSED</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
