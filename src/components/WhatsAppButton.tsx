'use client';

import React from 'react';

export default function WhatsAppButton() {
  const phoneNumber = '919527958899';
  const message = encodeURIComponent("Hi Power Soul Fitness Lonar! 🏋️ I'm interested in joining the gym. Can I get more details about memberships?");

  return (
    <a
      href={`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Power Soul Fitness on WhatsApp"
      style={{
        position: 'fixed',
        bottom: '105px',
        right: '30px',
        width: '62px',
        height: '62px',
        borderRadius: '50%',
        backgroundColor: '#25D366',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        zIndex: 9997,
        transition: 'all 0.3s ease',
        animation: 'waPulse 2s infinite',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.backgroundColor = '#128C7E';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.backgroundColor = '#25D366';
      }}
    >
      <i className="fab fa-whatsapp"></i>
      <style>{`
        @keyframes waPulse {
          0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(37, 211, 102, 0); }
          100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
        }
      `}</style>
    </a>
  );
}
