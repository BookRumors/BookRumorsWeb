'use client';

import React, { useState } from 'react';

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: 'Does BookRumors sell books directly?',
    a: 'No. BookRumors is a book promotion and author marketing platform. We do not sell books, process payments, manage inventory, or ship products. Instead, we display comprehensive book profiles and redirect readers directly to approved online retailers (like Amazon, Apple Books, Kobo, and Barnes & Noble) to complete their purchases.'
  },
  {
    q: 'How do authors promote their books?',
    a: 'Authors simply register for a BookRumors Creator Account, verify their email address, and select a promotion plan. Once subscribed, authors can upload their book covers, synopses, sample chapter previews, video trailers, and purchase links. After administrator verification, the book goes live instantly.'
  },
  {
    q: 'What is the purpose of Reader accounts?',
    a: 'Readers do not need accounts to search or explore the book catalog. However, creating a Reader account allows you to bookmark your favorite books (saved to a personal bookshelf), submit star-ratings and written reviews on book profiles, and opt-in to our weekly newsletter updates.'
  },
  {
    q: 'What payment gateways do you support for subscriptions?',
    a: 'We integrate with simulated high-fidelity Stripe and Razorpay checkout portals. You can select either gateway, input credit card details, complete simulated SMS bank OTP checks, and immediately unlock listing campaigns.'
  },
  {
    q: 'Can I cancel or upgrade my author subscription?',
    a: 'Yes, subscription plans are billed monthly and can be upgraded, downgraded, or cancelled at any time directly through the "Subscription Tiers" tab in the Author Dashboard. Invoices for all historic transactions remain available to download.'
  }
];

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div style={{ background: 'var(--bg-cream)', paddingBottom: '80px' }}>
      
      {/* Header Banner */}
      <section className="section-padding" style={{ background: 'linear-gradient(135deg, #FFF0F2 0%, #FFE6E9 100%)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="highlight-bg" style={{ fontSize: '13px', fontWeight: 'bold' }}>ABOUT US</span>
          <h1 style={{ fontSize: '44px', marginTop: '16px', marginBottom: '20px', fontFamily: 'Outfit' }}>
            Connecting Authors & <span style={{ color: 'var(--primary)' }}>Aesthetic Readers</span>
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            BookRumors is a dedicated promotional hub. We simplify book marketing for independent creators while building a premium, visually engaging discovery experience for readers.
          </p>
        </div>
      </section>

      {/* Story & Mission */}
      <section className="section-padding">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '48px', alignItems: 'center' }}>
            {/* Story Visual */}
            <div style={{ 
              borderRadius: 'var(--radius-lg)', 
              overflow: 'hidden', 
              boxShadow: 'var(--shadow-lg)',
              aspectRatio: '4/3',
              border: '4px solid var(--bg-white)'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=400" 
                alt="Library shelf" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Story copy */}
            <div>
              <h2 style={{ fontSize: '32px', fontFamily: 'Outfit', marginBottom: '20px' }}>Our Story</h2>
              <p style={{ color: 'var(--text-dark)', fontSize: '15px', lineHeight: '1.7', marginBottom: '16px' }}>
                BookRumors was founded with a clear vision: independent authors spend months writing beautiful books, yet struggling with complicated marketing tools and platform algorithms.
              </p>
              <p style={{ color: 'var(--text-dark)', fontSize: '15px', lineHeight: '1.7', marginBottom: '24px' }}>
                We built BookRumors to serve as a clean, highly visual promotional catalog. We focus entirely on beautiful presentations, detailed dashboard click-analytics, and smooth retailer redirects.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
                <div>
                  <h4 style={{ color: 'var(--primary)', marginBottom: '8px' }}>Our Mission</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                    To democratize book marketing by offering simple, transparent, and beautiful listing campaigns for creators of all levels.
                  </p>
                </div>
                <div>
                  <h4 style={{ color: 'var(--primary)', marginBottom: '8px' }}>Our Vision</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                    To become the primary launchpad for newly released literature and a trusted aesthetic library for readers worldwide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Flow */}
      <section className="section-padding" style={{ background: 'var(--bg-white)', borderRadius: 'var(--radius-xl)' }}>
        <div className="container">
          <h2 style={{ fontSize: '32px', fontFamily: 'Outfit', textAlign: 'center', marginBottom: '48px' }}>How BookRumors Works</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
            
            {/* For Readers Flow */}
            <div style={{ background: 'var(--bg-cream)', padding: '32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '20px', color: 'var(--primary)', marginBottom: '20px', fontFamily: 'Outfit' }}>📖 For Readers</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
                <div>
                  <strong>1. Search & Filter:</strong> Use our smart discovery sidebar to search keywords or filter by print formats vs audiobooks.
                </div>
                <div>
                  <strong>2. Preview synopses:</strong> Review ratings, read sample chapters, or watch trailer videos inside overlay drawers.
                </div>
                <div>
                  <strong>3. Click & Purchase:</strong> Click to select a retailer (like Amazon or Apple). We redirect you directly to complete the order.
                </div>
              </div>
            </div>

            {/* For Authors Flow */}
            <div style={{ background: 'var(--bg-cream)', padding: '32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '20px', color: 'var(--text-dark)', marginBottom: '20px', fontFamily: 'Outfit' }}>✍️ For Authors</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
                <div>
                  <strong>1. Register & Verify:</strong> Create an account, verify your email inbox code, and get approved by administrators.
                </div>
                <div>
                  <strong>2. Choose Promotion Plan:</strong> Subscribe to Starter/Pro/Premium tiers using Stripe or Razorpay mock card portals.
                </div>
                <div>
                  <strong>3. List Books & Track:</strong> Add cover images, summaries, and store links. Monitor click analytics directly on your dashboard.
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="section-padding">
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ fontSize: '32px', fontFamily: 'Outfit', textAlign: 'center', marginBottom: '40px' }}>
            Frequently Asked <span style={{ color: 'var(--primary)' }}>Questions</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  style={{ 
                    background: 'var(--bg-white)', 
                    border: '1px solid var(--border-light)', 
                    borderRadius: 'var(--radius-md)', 
                    overflow: 'hidden',
                    transition: 'var(--transition)'
                  }}
                >
                  {/* Question Accordion header */}
                  <button
                    onClick={() => toggleFaq(idx)}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      border: 'none',
                      background: 'transparent',
                      textAlign: 'left',
                      fontFamily: 'Outfit',
                      fontWeight: '600',
                      fontSize: '16px',
                      color: 'var(--text-dark)',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span>{faq.q}</span>
                    <span style={{ color: 'var(--primary)', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'var(--transition)' }}>
                      ▼
                    </span>
                  </button>

                  {/* Answer Accordion panel */}
                  {isOpen && (
                    <div style={{ 
                      padding: '0 24px 20px 24px', 
                      fontSize: '14px', 
                      color: 'var(--text-muted)', 
                      lineHeight: '1.6',
                      borderTop: '1px dashed var(--border-light)',
                      paddingTop: '16px',
                      animation: 'faqSlide 0.2s ease-out'
                    }}>
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes faqSlide {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </div>
  );
}
