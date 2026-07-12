'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppState } from '../context/StateContext';

export const Footer: React.FC = () => {
  const { subscribeNewsletter } = useAppState();
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const res = subscribeNewsletter(email);
    setMsg(res.message);
    setIsSuccess(res.success);
    if (res.success) {
      setEmail('');
    }
    setTimeout(() => setMsg(''), 4000);
  };

  return (
    <footer className="no-print" style={{ background: 'var(--bg-white)', borderTop: '1px solid var(--border-light)', padding: '60px 0 30px 0', marginTop: 'auto' }}>
      <div className="container">
        
        {/* Newsletter Subscription Banner */}
        <div style={{ maxWidth: '600px', margin: '0 auto 48px auto', textAlign: 'center' }}>
          <h3 style={{ fontSize: '20px', fontFamily: 'Outfit', marginBottom: '8px' }}>Subscribe To Our Newsletter</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
            Receive updates on monthly featured authors, book promotions, and trending releases!
          </p>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', border: '1px solid var(--border-light)', borderRadius: '100px', padding: '6px', background: 'var(--bg-cream)', maxWidth: '450px', margin: '0 auto' }}>
            <input
              type="email"
              placeholder="Enter Your Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ flex: 1, border: 'none', background: 'transparent', padding: '0 16px', fontSize: '14px', outline: 'none', color: 'var(--text-dark)' }}
              required
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '8px 24px', fontSize: '13px', borderRadius: '100px' }}
            >
              Subscribe
            </button>
          </form>
          {msg && (
            <p style={{ marginTop: '12px', fontSize: '13px', color: isSuccess ? 'green' : 'var(--primary)', fontWeight: '600' }}>
              {msg}
            </p>
          )}
        </div>

        {/* Brand & Footer Nav */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', borderTop: '1px solid var(--border-light)', paddingTop: '40px' }}>
          <Link href="/" style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'Outfit', letterSpacing: '-0.5px' }}>
            BOOK<span style={{ color: 'var(--primary)' }}>RUMORS</span>
          </Link>

          <div style={{ display: 'flex', gap: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
            <Link href="/">Home</Link>
            <Link href="/catalog">Discover</Link>
            <Link href="/auth">Register</Link>
            <Link href="/auth">Sign In</Link>
            <Link href="/admin">Administration</Link>
          </div>

          {/* Socials */}
          <div style={{ display: 'flex', gap: '16px' }}>
            {['f', 't', 'i', 'y'].map((s, idx) => {
              const icons = ['📘', '🐦', '📸', '📺'];
              const labels = ['Facebook', 'Twitter', 'Instagram', 'YouTube'];
              return (
                <a
                  key={idx}
                  href="#"
                  aria-label={labels[idx]}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    transition: 'var(--transition)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--primary)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--primary-light)';
                    e.currentTarget.style.color = 'var(--primary)';
                  }}
                >
                  {icons[idx]}
                </a>
              );
            })}
          </div>

          {/* Copyright */}
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '16px' }}>
            © {new Date().getFullYear()} BookRumors Ltd. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};
export default Footer;
