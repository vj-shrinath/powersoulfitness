'use client';

import { useEffect, useState } from 'react';

export default function ContactClient() {
  const [formData, setFormData] = useState({ name: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
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
        setCmsData(contentMap);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('active'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Build a WhatsApp message from form data
    const msg = encodeURIComponent(
      `Hi! 🙋 I'm ${formData.name}.\nPhone: ${formData.phone}\nSubject: ${formData.subject}\nMessage: ${formData.message}`
    );
    // Use dynamic phone number if available, else default
    const phone = cmsData.contact_phone1 ? cmsData.contact_phone1.replace(/\s+/g, '') : '+919527958899';
    window.open(`https://api.whatsapp.com/send?phone=${phone.replace('+', '')}&text=${msg}`, '_blank');
    setSubmitted(true);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-dark text-white">Loading Contact...</div>;

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 18px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    fontFamily: 'inherit',
    marginTop: '6px',
  };

  const labelStyle: React.CSSProperties = {
    color: '#aaa',
    fontSize: '0.85rem',
    fontWeight: 600,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '2px',
  };

  const contactCards = [
    {
      icon: 'fas fa-map-marker-alt',
      title: 'Our Location',
      lines: [cmsData.contact_address1 || 'Opposite Limbi Lake,', cmsData.contact_address2 || 'Loni Road, Lonar'],
      link: 'https://maps.google.com/maps?q=power+soul+fitness+lonar',
      linkText: 'Get Directions',
      color: 'var(--primary)',
    },
    {
      icon: 'fas fa-phone-volume',
      title: 'Call Us',
      lines: [cmsData.contact_phone1 || '+91 9527958899', cmsData.contact_phone2 || '+91 8308068899'],
      link: `tel:${cmsData.contact_phone1 ? cmsData.contact_phone1.replace(/\s+/g, '') : '+919527958899'}`,
      linkText: 'Call Now',
      color: 'var(--accent)',
    },
    {
      icon: 'fas fa-envelope',
      title: 'Email Us',
      lines: [cmsData.contact_email || 'powersoulfitness@gmail.com'],
      link: `mailto:${cmsData.contact_email || 'powersoulfitness@gmail.com'}`,
      linkText: 'Send Email',
      color: 'var(--primary)',
    },
    {
      icon: 'fab fa-whatsapp',
      title: 'WhatsApp',
      lines: ['Chat with us instantly', 'Quick responses guaranteed!'],
      link: `https://api.whatsapp.com/send?phone=${cmsData.contact_phone1 ? cmsData.contact_phone1.replace(/\D/g, '') : '919527958899'}&text=Hii%F0%9F%99%8B,%20I%20want%20more%20information%20about%20Power%20Soul%20Fitness!`,
      linkText: 'WhatsApp Now',
      color: '#25D366',
    },
  ];

  return (
    <>
      {/* Hero */}
      <section
        style={{
          height: '55vh',
          minHeight: '380px',
          backgroundImage: `linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.88)), url("${cmsData.contact_hero_bg || '/images/conquer.jpg'}")`,
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
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '1rem' }}>
            Get In{' '}
            <span style={{ color: 'var(--primary)', textShadow: '0 0 30px rgba(168,98,237,0.6)' }}>Touch</span>
          </h1>
          <p style={{ color: '#ccc', fontSize: '1.15rem', maxWidth: '560px', margin: '0 auto' }}>
            {cmsData.contact_hero_subtitle || "Feel free to reach out. We're always here to help you start your fitness journey in Lonar."}
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section style={{ backgroundColor: '#0a0a0a', padding: '80px 0 40px' }}>
        <div className="container px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactCards.map((card, i) => (
              <div
                key={i}
                className="reveal animate-up"
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                <a
                  href={card.link}
                  target={card.link.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '16px',
                    padding: '32px 24px',
                    textAlign: 'center',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    height: '100%',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-6px)';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = card.color;
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 20px 40px ${card.color}22`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.07)';
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
                  }}
                >
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: `${card.color}18`, border: `1px solid ${card.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <i className={card.icon} style={{ fontSize: '1.6rem', color: card.color }} />
                  </div>
                  <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>{card.title}</h3>
                  {card.lines.map((line, li) => (
                    <p key={li} style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: 1.6 }}>{line}</p>
                  ))}
                  <span style={{ display: 'inline-block', marginTop: '16px', color: card.color, fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
                    {card.linkText} →
                  </span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section style={{ backgroundColor: '#0a0a0a', padding: '40px 0 100px' }}>
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

            {/* Contact Form */}
            <div className="reveal animate-up">
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '40px 36px' }}>
                <p style={{ color: 'var(--primary)', fontWeight: 700, letterSpacing: '3px', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '8px' }}>Send a Message</p>
                <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 800, marginBottom: '30px' }}>
                  Contact <span style={{ color: 'var(--primary)' }}>Information</span>
                </h2>

                {submitted ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <i className="fab fa-whatsapp" style={{ fontSize: '4rem', color: '#25D366', marginBottom: '20px', display: 'block' }} />
                    <h3 style={{ color: '#fff', marginBottom: '12px' }}>Redirected to WhatsApp!</h3>
                    <p style={{ color: '#aaa' }}>Your message was pre-filled. Just hit send on WhatsApp.</p>
                    <button onClick={() => setSubmitted(false)} style={{ marginTop: '20px', background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: '#aaa', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                      Send Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <label style={labelStyle}>Your Name *</label>
                      <input
                        type="text" required placeholder="e.g. Rahul Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={inputStyle}
                        onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'var(--primary)'; }}
                        onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Your Phone *</label>
                      <input
                        type="tel" required placeholder="+91 XXXXX XXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        style={inputStyle}
                        onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'var(--primary)'; }}
                        onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Subject *</label>
                      <input
                        type="text" required placeholder="e.g. Membership Enquiry"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        style={inputStyle}
                        onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'var(--primary)'; }}
                        onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Your Message</label>
                      <textarea
                        rows={4} placeholder="Tell us what you need..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        style={{ ...inputStyle, resize: 'vertical' }}
                        onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = 'var(--primary)'; }}
                        onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '16px', fontSize: '1rem', fontWeight: 700, borderRadius: '10px', letterSpacing: '1px', boxShadow: '0 0 30px rgba(168,98,237,0.3)', border: 'none', cursor: 'pointer' }}
                    >
                      <i className="fab fa-whatsapp" style={{ marginRight: '10px' }} />
                      Send via WhatsApp
                    </button>
                    <p style={{ color: '#666', fontSize: '0.8rem', textAlign: 'center' }}>Your message will be pre-filled in WhatsApp for quick sending.</p>
                  </form>
                )}
              </div>
            </div>

            {/* Map + Tagline */}
            <div className="reveal animate-up" style={{ animationDelay: '0.15s', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '32px 28px' }}>
                <p style={{ color: 'var(--primary)', fontWeight: 700, letterSpacing: '3px', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '8px' }}>Find Us Here</p>
                <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 800, marginBottom: '20px' }}>
                  Don&apos;t Hesitate To{' '}
                  <span style={{ color: 'var(--primary)' }}>Visit Us</span>
                </h2>
                <p style={{ color: '#888', marginBottom: '24px', lineHeight: 1.7, fontSize: '0.95rem' }}>
                  {cmsData.contact_visit_desc || "We're located in the heart of Lonar, right opposite Limbi Lake on Loni Road. Come visit us and take your first step toward a stronger, healthier you!"}
                </p>
                {/* Google Map Embed */}
                <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <iframe
                    src="https://maps.google.com/maps?q=power+soul+fitness+lonar&t=m&z=15&output=embed&iwloc=near"
                    width="100%"
                    height="300"
                    style={{ border: 0, display: 'block' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Power Soul Fitness Lonar Location"
                  />
                </div>
              </div>

              {/* Quick Links */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <a
                  href={`tel:${cmsData.contact_phone1 ? cmsData.contact_phone1.replace(/\s+/g, '') : '+919527958899'}`}
                  style={{ background: 'rgba(168,98,237,0.1)', border: '1px solid rgba(168,98,237,0.25)', borderRadius: '12px', padding: '20px', textAlign: 'center', textDecoration: 'none', transition: 'all 0.3s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(168,98,237,0.2)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(168,98,237,0.1)'; }}
                >
                  <i className="fas fa-phone" style={{ color: 'var(--primary)', fontSize: '1.5rem', display: 'block', marginBottom: '8px' }} />
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem' }}>{cmsData.contact_phone1 || '9527958899'}</span>
                </a>
                <a
                  href={`https://api.whatsapp.com/send?phone=${cmsData.contact_phone1 ? cmsData.contact_phone1.replace(/\D/g, '') : '919527958899'}&text=Hi!%20I%20want%20more%20info%20about%20Power%20Soul%20Fitness!`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.25)', borderRadius: '12px', padding: '20px', textAlign: 'center', textDecoration: 'none', transition: 'all 0.3s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(37,211,102,0.2)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(37,211,102,0.1)'; }}
                >
                  <i className="fab fa-whatsapp" style={{ color: '#25D366', fontSize: '1.5rem', display: 'block', marginBottom: '8px' }} />
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem' }}>WhatsApp Now</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
