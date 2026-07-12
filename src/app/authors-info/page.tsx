'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/context/StateContext';

export default function ForAuthorsPage() {
  const router = useRouter();
  const { currentUser } = useAppState();

  useEffect(() => {
    if (currentUser?.role === 'author') {
      router.replace('/dashboard');
    }
  }, [currentUser, router]);

  if (currentUser?.role === 'author') {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-cream)', paddingBottom: '60px' }}>
      
      {/* Hero Banner */}
      <section className="section-padding" style={{ background: 'linear-gradient(135deg, #FFF0F2 0%, #FFE6E9 100%)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="highlight-bg" style={{ fontSize: '13px', fontWeight: 'bold' }}>CREATOR HUB</span>
          <h1 style={{ fontSize: '48px', marginTop: '16px', marginBottom: '20px', fontFamily: 'Outfit', lineHeight: '1.2' }}>
            Boost Your Book's Visibility on <span style={{ color: 'var(--primary)' }}>BookRumors</span>
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '32px' }}>
            The ultimate marketing and promotion platform designed specifically for self-published authors and independent publishers. Connect with enthusiastic readers and boost your online bookstore sales.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <button onClick={() => router.push('/auth?tab=register')} className="btn btn-primary" style={{ padding: '12px 32px' }}>
              Create Creator Account ➔
            </button>
            <button onClick={() => router.push('/pricing')} className="btn btn-secondary" style={{ padding: '12px 32px' }}>
              View Promotion Plans
            </button>
          </div>
        </div>
      </section>

      {/* Why Advertise Section */}
      <section className="section-padding">
        <div className="container">
          <h2 style={{ fontSize: '32px', fontFamily: 'Outfit', textAlign: 'center', marginBottom: '48px' }}>
            Why Promote with <span style={{ color: 'var(--primary)' }}>BookRumors?</span>
          </h2>

          <div className="grid-3">
            <div style={{ background: 'var(--bg-white)', padding: '32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>🎯</div>
              <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Targeted Readership</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
                We attract thousands of active readers seeking new releases. Get your books shown directly to audience demographics searching by specific genres and keywords.
              </p>
            </div>

            <div style={{ background: 'var(--bg-white)', padding: '32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>🔗</div>
              <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Direct Retail Redirection</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
                All purchase clicks route readers straight to your Amazon, Apple, or Kobo retail listings. Readers buy directly from their favorite marketplaces with no intermediates.
              </p>
            </div>

            <div style={{ background: 'var(--bg-white)', padding: '32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>🎬</div>
              <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Interactive Promotion Tools</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
                Enrich your book listings with interactive content. Embed video book trailers, upload sample chapter previews, and highlight search listings to capture readers' attention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories / Testimonials */}
      <section className="section-padding">
        <div className="container">
          <h2 style={{ fontSize: '32px', fontFamily: 'Outfit', textAlign: 'center', marginBottom: '48px' }}>
            Success Stories from <span style={{ color: 'var(--primary)' }}>Our Authors</span>
          </h2>

          <div className="grid-2">
            <div style={{ background: 'var(--bg-white)', padding: '32px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
              <p style={{ fontStyle: 'italic', fontSize: '14px', color: 'var(--text-dark)', lineHeight: '1.6', marginBottom: '20px' }}>
                "Before listing on BookRumors, my thriller novel had very low views on Amazon. After upgrading to the Pro Author Plan, my retail clicks grew by 300%. The trailer and sample chapter features really made a huge difference!"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#F0DFE1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>✍️</div>
                <div>
                  <strong>Sarah Jenkins</strong>
                  <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)' }}>Mystery Author, writer of "Secret Forest"</span>
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-white)', padding: '32px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
              <p style={{ fontStyle: 'italic', fontSize: '14px', color: 'var(--text-dark)', lineHeight: '1.6', marginBottom: '20px' }}>
                "The Elite Publisher Plan has been an absolute game changer. We list all our new releases here and direct readers to retail stores. The redirect is clean, and the reader engagement rates are incredibly high. Direct reader relationships mean high conversion rates."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#F0DFE1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🏢</div>
                <div>
                  <strong>Marcus Vance</strong>
                  <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)' }}>Independent Publisher, Mirror House Press</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="section-padding" style={{ background: 'var(--bg-white)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
          <h2 style={{ fontSize: '32px', fontFamily: 'Outfit', marginBottom: '16px' }}>Ready to Promote Your Book?</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '32px' }}>
            Setup your account in minutes, verify your email, and list your first book draft. Choose the marketing plan that fits your launch goals.
          </p>
          <button onClick={() => router.push('/auth?tab=register')} className="btn btn-primary" style={{ padding: '12px 36px', borderRadius: '100px' }}>
            Get Started Now
          </button>
        </div>
      </section>

    </div>
  );
}
