'use client';

import React, { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      subject: 'general',
      message: ''
    });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div style={{ background: 'var(--bg-cream)', paddingBottom: '80px', flex: 1, display: 'flex', flexDirection: 'column' }}>
      
      {/* Header Banner */}
      <section className="section-padding" style={{ textAlign: 'center', paddingBottom: '40px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="highlight-bg" style={{ fontSize: '13px', fontWeight: 'bold' }}>GET IN TOUCH</span>
          <h1 style={{ fontSize: '44px', marginTop: '16px', marginBottom: '20px', fontFamily: 'Outfit' }}>
            We'd Love to <span style={{ color: 'var(--primary)' }}>Hear From You</span>
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Have questions about promoting your book, purchasing advertising tiers, or discovering bookstore links? Send us a message, and our support team will respond within 24 hours.
          </p>
        </div>
      </section>

      {/* Grid container */}
      <section className="container" style={{ flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '48px', alignItems: 'stretch' }}>
          
          {/* Form Card */}
          <div style={{ 
            background: 'var(--bg-white)', 
            border: '1px solid var(--border-light)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '40px',
            boxShadow: 'var(--shadow-md)'
          }}>
            <h3 style={{ fontSize: '22px', marginBottom: '20px', fontFamily: 'Outfit' }}>Send a Message</h3>
            
            {submitted && (
              <div style={{ background: '#e6fffa', border: '1px solid #319795', color: '#234e52', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', fontWeight: 'bold' }}>
                ✓ Thank you! Your message has been received. Our support desk will reply shortly.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    placeholder="jane@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Inquiry Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="form-select"
                >
                  <option value="general">General Inquiry</option>
                  <option value="partnership">Author / Publisher Partnership</option>
                  <option value="billing">Ad Subscriptions & Billing</option>
                  <option value="feedback">Reader Feedback & Suggestions</option>
                </select>
              </div>

              <div className="form-group">
                <label>Message details *</label>
                <textarea
                  rows={5}
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="form-textarea"
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', borderRadius: '8px', padding: '12px' }}>
                Submit Message
              </button>
            </form>
          </div>

          {/* Contact Details Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Roster Channels */}
            <div style={{ 
              background: 'var(--bg-white)', 
              border: '1px solid var(--border-light)', 
              borderRadius: 'var(--radius-md)', 
              padding: '32px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <h4 style={{ fontSize: '18px', marginBottom: '20px', fontFamily: 'Outfit' }}>Direct Roster Channels</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
                <div>
                  <span style={{ color: 'var(--primary)', fontWeight: 'bold', display: 'block' }}>General Support Support:</span>
                  <a href="mailto:support@bookrumors.com" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>support@bookrumors.com</a>
                </div>
                <div>
                  <span style={{ color: 'var(--primary)', fontWeight: 'bold', display: 'block' }}>Business Partnerships:</span>
                  <a href="mailto:partnerships@bookrumors.com" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>partnerships@bookrumors.com</a>
                </div>
                <div>
                  <span style={{ color: 'var(--primary)', fontWeight: 'bold', display: 'block' }}>Invoicing Queries:</span>
                  <a href="mailto:billing@bookrumors.com" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>billing@bookrumors.com</a>
                </div>
              </div>
            </div>

            {/* Office details */}
            <div style={{ 
              background: 'var(--bg-white)', 
              border: '1px solid var(--border-light)', 
              borderRadius: 'var(--radius-md)', 
              padding: '32px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <h4 style={{ fontSize: '18px', marginBottom: '16px', fontFamily: 'Outfit' }}>Helpdesk Hours</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.6' }}>
                Our marketing team and ticket systems operate Monday through Friday from 9:00 AM to 6:00 PM (EST). 
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.6', marginTop: '8px' }}>
                For Premium and Enterprise plan holders, support channels remain available 24/7.
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
