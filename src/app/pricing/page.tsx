'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const router = useRouter();

  const handlePlanSelect = () => {
    // Take them to auth page where they can login and purchase
    router.push('/auth?tab=register');
  };

  return (
    <div style={{ background: 'var(--bg-cream)', paddingBottom: '80px' }}>
      
      {/* Header Banner */}
      <section className="section-padding" style={{ textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="highlight-bg" style={{ fontSize: '13px', fontWeight: 'bold' }}>TRANSPARENT PRICING</span>
          <h1 style={{ fontSize: '44px', marginTop: '16px', marginBottom: '20px', fontFamily: 'Outfit' }}>
            Choose the Perfect <span style={{ color: 'var(--primary)' }}>Promotion Plan</span>
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            From individual authors releasing their first novel to publishers promoting large catalogs. Select a plan to start advertising today. Cancel or upgrade at any time.
          </p>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="container">
        <div className="grid-3" style={{ alignItems: 'stretch' }}>
          
          {/* Basic/Starter Plan */}
          <div style={{ 
            background: 'var(--bg-white)', 
            border: '1px solid var(--border-light)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '32px 24px', 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)',
            transition: 'var(--transition)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-light)'}
          >
            <div>
              <h3 style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--text-dark)' }}>Starter</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '24px' }}>For new authors experimenting with promotion.</p>
              
              <div style={{ marginBottom: '28px' }}>
                <span style={{ fontSize: '36px', fontWeight: '800', color: 'var(--text-dark)' }}>$19</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}> / 25 days</span>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: '2.0', marginBottom: '32px' }}>
                <li><span style={{ color: '#38a169', marginRight: '6px', fontWeight: 'bold' }}>✓</span> Promote up to 2 books</li>
                <li><span style={{ color: '#38a169', marginRight: '6px', fontWeight: 'bold' }}>✓</span> Show Cover & Summary</li>
                <li><span style={{ color: '#38a169', marginRight: '6px', fontWeight: 'bold' }}>✓</span> Provide 2 Retailer Links</li>
                <li><span style={{ color: '#38a169', marginRight: '6px', fontWeight: 'bold' }}>✓</span> Standard catalog ranking</li>
                <li><span style={{ color: '#e53e3e', marginRight: '6px', fontWeight: 'bold' }}>✗</span> Sample Chapter Viewer</li>
                <li><span style={{ color: '#e53e3e', marginRight: '6px', fontWeight: 'bold' }}>✗</span> Book Trailer Embed</li>
              </ul>
            </div>

            <button onClick={handlePlanSelect} className="btn btn-secondary" style={{ width: '100%', borderRadius: '100px' }}>
              Subscribe Now
            </button>
          </div>

          {/* Professional Plan */}
          <div style={{ 
            background: 'var(--bg-white)', 
            border: '1px solid var(--border-light)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '32px 24px', 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)',
            transition: 'var(--transition)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-light)'}
          >
            <div>
              <h3 style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--text-dark)' }}>Professional</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '24px' }}>For active authors releasing regular books.</p>
              
              <div style={{ marginBottom: '28px' }}>
                <span style={{ fontSize: '36px', fontWeight: '800', color: 'var(--text-dark)' }}>$39</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}> / 2 months</span>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: '2.0', marginBottom: '32px' }}>
                <li><span style={{ color: '#38a169', marginRight: '6px', fontWeight: 'bold' }}>✓</span> Promote up to 10 books</li>
                <li><span style={{ color: '#38a169', marginRight: '6px', fontWeight: 'bold' }}>✓</span> Priority Catalog Ranking</li>
                <li><span style={{ color: '#38a169', marginRight: '6px', fontWeight: 'bold' }}>✓</span> Provide 5 Retailer Links</li>
                <li><span style={{ color: '#38a169', marginRight: '6px', fontWeight: 'bold' }}>✓</span> Priority email response</li>
                <li><span style={{ color: '#e53e3e', marginRight: '6px', fontWeight: 'bold' }}>✗</span> Sample Chapter Viewer</li>
                <li><span style={{ color: '#e53e3e', marginRight: '6px', fontWeight: 'bold' }}>✗</span> Book Trailer Embed</li>
              </ul>
            </div>

            <button onClick={handlePlanSelect} className="btn btn-secondary" style={{ width: '100%', borderRadius: '100px' }}>
              Subscribe Now
            </button>
          </div>

          {/* Premium Plan (Most Popular Highlighted) */}
          <div style={{ 
            background: 'var(--bg-white)', 
            border: '2px solid var(--primary)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '32px 24px', 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-lg)',
            position: 'relative',
            transform: 'scale(1.03)',
            zIndex: 1
          }}>
            <span style={{ 
              position: 'absolute', 
              top: '-12px', 
              left: '50%', 
              transform: 'translateX(-50%)', 
              background: 'var(--primary)', 
              color: 'white', 
              fontSize: '10px', 
              fontWeight: 'bold', 
              padding: '4px 12px', 
              borderRadius: '100px',
              textTransform: 'uppercase'
            }}>
              Most Popular
            </span>
            
            <div>
              <h3 style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--text-dark)' }}>Premium</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '24px' }}>For authors looking for maximum engagement.</p>
              
              <div style={{ marginBottom: '28px' }}>
                <span style={{ fontSize: '36px', fontWeight: '800', color: 'var(--primary)' }}>$49</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}> / 3 months</span>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, fontSize: '13px', color: 'var(--text-dark)', lineHeight: '2.0', marginBottom: '32px', opacity: 0.9 }}>
                <li><span style={{ color: '#38a169', marginRight: '6px', fontWeight: 'bold' }}>✓</span> Promote Unlimited Books</li>
                <li><span style={{ color: '#38a169', marginRight: '6px', fontWeight: 'bold' }}>✓</span> Homepage Featured spots</li>
                <li><span style={{ color: '#38a169', marginRight: '6px', fontWeight: 'bold' }}>✓</span> Sample Chapter Upload</li>
                <li><span style={{ color: '#38a169', marginRight: '6px', fontWeight: 'bold' }}>✓</span> Book Trailer Embeds</li>
                <li><span style={{ color: '#38a169', marginRight: '6px', fontWeight: 'bold' }}>✓</span> Dedicated author profiles</li>
                <li><span style={{ color: '#38a169', marginRight: '6px', fontWeight: 'bold' }}>✓</span> 24/7 Email/Chat Support</li>
              </ul>
            </div>

            <button onClick={handlePlanSelect} className="btn btn-primary" style={{ width: '100%', borderRadius: '100px', boxShadow: 'none' }}>
              Subscribe Now
            </button>
          </div>

        </div>
      </section>

      {/* Info FAQ Reroute */}
      <div className="container" style={{ textAlign: 'center', marginTop: '60px' }}>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Have questions about billing, plans, or campaigns? Check our <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => router.push('/about')}>FAQ Section</span> or <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => router.push('/contact')}>Contact Support</span>.
        </p>
      </div>

    </div>
  );
}
