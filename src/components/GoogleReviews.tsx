'use client';
import React from 'react';
import Script from 'next/script';

const GoogleReviews = () => {
  return (
    <section id="reviews" className="google-reviews reveal animate-up py-12 md:py-24" style={{ backgroundColor: 'var(--bg-dark-alt)' }}>
      <div className="container">
        <div className="section-title">
          <h2 className="gradient-text">Member Testimonials</h2>
          <p style={{ color: 'var(--text-grey)', marginTop: '10px' }}>Real reviews from our Google Business Profile</p>
        </div>
        
        <div 
          className="glass" 
          style={{ 
            padding: '20px', 
            minHeight: '500px', 
            backgroundColor: 'rgba(255,255,255,0.02)',
            overflow: 'hidden',
            borderRadius: '20px'
          }}
        >
          {/* SociableKIT Widget Container */}
          <div className="sk-ww-google-reviews" data-embed-id="25676574"></div>
          
          <Script 
            src="https://widgets.sociablekit.com/google-reviews/widget.js" 
            strategy="lazyOnload"
          />
        </div>
      </div>
      
      <style jsx global>{`
        /* Deep integration to make the widget feel native */
        .sk-ww-google-reviews {
          width: 100% !important;
          font-family: inherit !important;
        }
        
        /* Glassmorphism for individual review items */
        .sk_kl_google_reviews_list_item {
          background: rgba(255, 255, 255, 0.03) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          backdrop-filter: blur(12px) !important;
          border-radius: 15px !important;
          padding: 20px !important;
          margin-bottom: 15px !important;
          transition: transform 0.3s ease !important;
        }

        .sk_kl_google_reviews_list_item:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.05) !important;
          border-color: var(--primary) !important;
        }

        /* Typography & Colors */
        .sk_kl_google_reviews_list_item * {
          color: white !important;
        }

        .sk_kl_google_reviews_list_item .sk_kl_google_reviews_user_name {
          font-weight: 700 !important;
          color: var(--primary) !important;
        }

        .sk_kl_google_reviews_list_item .sk_kl_google_reviews_review_text {
          color: rgba(255,255,255,0.8) !important;
          line-height: 1.6 !important;
        }

        /* Hiding the widget's default powered-by link for a cleaner look */
        .sk-ww-google-reviews a[href*="sociablekit.com"] {
          display: none !important;
        }
      `}</style>
    </section>
  );
};

export default GoogleReviews;
