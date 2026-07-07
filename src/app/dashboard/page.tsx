'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/context/StateContext';
import { SUBSCRIPTION_PLANS, Book, Transaction } from '@/mockData';
import { CheckoutModal } from '@/components/CheckoutModal';
import { Invoice } from '@/components/Invoice';

export default function AuthorDashboard() {
  const router = useRouter();
  const {
    currentUser,
    activePlan,
    books,
    transactions,
    notifications,
    categories,
    addBook,
    updateBook,
    deleteBook
  } = useAppState();

  // Route security: check auth session
  useEffect(() => {
    if (!currentUser) {
      router.push('/auth');
    } else if (currentUser.role === 'admin') {
      router.push('/admin');
    }
  }, [currentUser]);

  // Tab State
  const [activeTab, setActiveTab] = useState<'books' | 'plans' | 'billing' | 'notifications'>('books');

  // Modal States
  const [checkoutPlanId, setCheckoutPlanId] = useState<string | null>(null);
  const [activeInvoice, setActiveInvoice] = useState<Transaction | null>(null);

  // Book CRUD states
  const [bookFormMode, setBookFormMode] = useState<'list' | 'add' | 'edit'>('list');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [bookForm, setBookForm] = useState({
    title: '',
    subtitle: '',
    publisher: '',
    publishDate: '',
    isbn: '',
    language: 'English',
    genre: 'Fiction',
    price: 0,
    summary: '',
    coverUrl: '',
    sampleChapter: '',
    trailerUrl: '',
    amazon: '',
    appleBooks: '',
    barnesNoble: '',
    kobo: '',
    publisherSite: ''
  });

  if (!currentUser || currentUser.role !== 'author') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Redirecting to authentication portal...</p>
      </div>
    );
  }

  // Filter lists for current author
  const authorBooks = books.filter(b => b.authorId === currentUser.id);
  const authorTx = transactions.filter(t => t.authorId === currentUser.id);
  const authorNotifications = notifications.filter(n => n.userId === currentUser.id);

  const activePlanDetails = SUBSCRIPTION_PLANS.find(p => p.id === activePlan);

  // CRUD handlers
  const handleOpenAdd = () => {
    // Validate subscription limit before uploading
    let maxBooks = 2; // Basic default
    if (activePlan === 'plan-pro') maxBooks = 10;
    if (activePlan === 'plan-elite') maxBooks = 999;

    if (authorBooks.length >= maxBooks) {
      alert(`Limit Reached! Your subscription plan allows a maximum of ${maxBooks} books. Please upgrade your subscription to upload more.`);
      return;
    }

    setBookForm({
      title: '',
      subtitle: '',
      publisher: '',
      publishDate: new Date().toISOString().split('T')[0],
      isbn: '',
      language: 'English',
      genre: categories[0]?.id || 'Fiction',
      price: 0,
      summary: '',
      coverUrl: '',
      sampleChapter: '',
      trailerUrl: '',
      amazon: '',
      appleBooks: '',
      barnesNoble: '',
      kobo: '',
      publisherSite: ''
    });
    setBookFormMode('add');
  };

  const handleOpenEdit = (book: Book) => {
    setBookForm({
      title: book.title,
      subtitle: book.subtitle || '',
      publisher: book.publisher,
      publishDate: book.publishDate,
      isbn: book.isbn,
      language: book.language,
      genre: book.genre,
      price: book.price,
      summary: book.summary,
      coverUrl: book.coverUrl,
      sampleChapter: book.sampleChapter || '',
      trailerUrl: book.trailerUrl || '',
      amazon: book.purchaseLinks.amazon || '',
      appleBooks: book.purchaseLinks.appleBooks || '',
      barnesNoble: book.purchaseLinks.barnesNoble || '',
      kobo: book.purchaseLinks.kobo || '',
      publisherSite: book.purchaseLinks.publisherSite || ''
    });
    setSelectedBookId(book.id);
    setBookFormMode('edit');
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookForm.title || !bookForm.publisher || !bookForm.isbn || !bookForm.coverUrl) {
      alert('Please fill out all required fields (Title, Publisher, ISBN, Cover Photo URL)');
      return;
    }

    const payload = {
      title: bookForm.title,
      subtitle: bookForm.subtitle,
      publisher: bookForm.publisher,
      publishDate: bookForm.publishDate,
      isbn: bookForm.isbn,
      language: bookForm.language,
      genre: bookForm.genre,
      price: Number(bookForm.price),
      summary: bookForm.summary,
      coverUrl: bookForm.coverUrl,
      sampleChapter: bookForm.sampleChapter,
      trailerUrl: bookForm.trailerUrl,
      purchaseLinks: {
        amazon: bookForm.amazon,
        appleBooks: bookForm.appleBooks,
        barnesNoble: bookForm.barnesNoble,
        kobo: bookForm.kobo,
        publisherSite: bookForm.publisherSite
      },
      keywords: bookForm.title.toLowerCase().split(/\s+/)
    };

    if (bookFormMode === 'add') {
      addBook(payload);
      alert('Book submitted successfully! Admin review pending.');
    } else if (bookFormMode === 'edit' && selectedBookId) {
      updateBook(selectedBookId, {
        ...payload,
        status: 'pending' // Send back for approval when edited
      });
      alert('Book updated successfully! Awaiting Admin review.');
    }

    setBookFormMode('list');
    setSelectedBookId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to permanently delete this book listing?')) {
      deleteBook(id);
      alert('Book listing removed.');
    }
  };

  return (
    <div style={{ background: 'var(--bg-cream)', paddingBottom: '60px', flex: 1 }}>
      <div className="container" style={{ paddingTop: '40px' }}>
        
        {/* Dashboard Header */}
        <div style={{ background: 'var(--bg-white)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '28px', fontFamily: 'Outfit' }}>Welcome, {currentUser.name}!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
              Author Portal • Member since 2026 • Status: <span style={{ color: 'green', fontWeight: 'bold' }}>Active</span>
            </p>
          </div>
          <div style={{ background: 'var(--primary-light)', padding: '12px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold', display: 'block' }}>Active Plan:</span>
            <strong style={{ color: 'var(--primary)', fontSize: '16px' }}>
              {activePlanDetails ? activePlanDetails.name : 'No Active Plan'}
            </strong>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="dashboard-layout">
          
          {/* Sidebar Navigation */}
          <aside className="dashboard-sidebar">
            <button className={`dashboard-nav-item ${activeTab === 'books' ? 'active' : ''}`} onClick={() => setActiveTab('books')}>
              📚 My Books ({authorBooks.length})
            </button>
            <button className={`dashboard-nav-item ${activeTab === 'plans' ? 'active' : ''}`} onClick={() => setActiveTab('plans')}>
              💳 Subscription Tiers
            </button>
            <button className={`dashboard-nav-item ${activeTab === 'billing' ? 'active' : ''}`} onClick={() => setActiveTab('billing')}>
              🧾 Invoices & Billing
            </button>
            <button className={`dashboard-nav-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
              🔔 Alerts & Messages ({authorNotifications.filter(n => !n.read).length})
            </button>
          </aside>

          {/* Tab Content Display */}
          <main className="dashboard-content">

            {/* TAB 2: MY BOOKS (CRUD PORTAL) */}
            {activeTab === 'books' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '22px', fontFamily: 'Outfit' }}>My Book Listings</h3>
                  {bookFormMode === 'list' && (
                    <button onClick={handleOpenAdd} className="btn btn-primary" style={{ padding: '8px 20px', borderRadius: '8px', fontSize: '13px' }}>
                      ＋ Upload New Book
                    </button>
                  )}
                </div>

                {/* LIST VIEW */}
                {bookFormMode === 'list' && (
                  <div>
                    {authorBooks.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {authorBooks.map(book => {
                          const statusColors = {
                            approved: { bg: '#e6fffa', text: '#234e52', label: 'Live / Approved' },
                            pending: { bg: '#feebc8', text: '#7b341e', label: 'Pending Review' },
                            rejected: { bg: '#fed7d7', text: '#742a2a', label: 'Rejected' }
                          };
                          const meta = statusColors[book.status];

                          return (
                            <div 
                              key={book.id} 
                              style={{ 
                                display: 'flex', 
                                gap: '20px', 
                                padding: '16px', 
                                border: '1px solid var(--border-light)', 
                                borderRadius: 'var(--radius-md)',
                                background: 'var(--bg-white)'
                              }}
                            >
                              <img src={book.coverUrl} alt={book.title} style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} referrerPolicy="no-referrer" />
                              
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <h4 style={{ fontSize: '16px', margin: 0 }}>{book.title}</h4>
                                  <span style={{ 
                                    background: meta.bg, 
                                    color: meta.text, 
                                    fontSize: '11px', 
                                    fontWeight: 'bold', 
                                    padding: '2px 8px', 
                                    borderRadius: '100px' 
                                  }}>
                                    {meta.label}
                                  </span>
                                </div>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                  ISBN: {book.isbn} • Price: ${book.price.toFixed(2)} • Genre: {book.genre}
                                </p>
                                {book.status === 'rejected' && book.rejectionReason && (
                                  <p style={{ fontSize: '12px', color: 'var(--primary)', marginTop: '6px', fontStyle: 'italic' }}>
                                    Rejection reason: "{book.rejectionReason}"
                                  </p>
                                )}
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px' }} onClick={() => handleOpenEdit(book)}>
                                  Edit
                                </button>
                                <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px', borderColor: 'var(--primary)', color: 'var(--primary)' }} onClick={() => handleDelete(book.id)}>
                                  Delete
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '60px 0', border: '1px dashed var(--border-light)', borderRadius: 'var(--radius-md)' }}>
                        <span style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}>📖</span>
                        <p style={{ color: 'var(--text-muted)' }}>You haven't uploaded any books yet.</p>
                        <button onClick={handleOpenAdd} className="btn btn-primary" style={{ padding: '8px 24px', borderRadius: '8px', fontSize: '13px', marginTop: '16px' }}>
                          Upload Your First Book
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* ADD / EDIT FORM VIEW */}
                {(bookFormMode === 'add' || bookFormMode === 'edit') && (
                  <form onSubmit={handleBookSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div className="form-group">
                        <label>Book Title *</label>
                        <input
                          type="text"
                          value={bookForm.title}
                          onChange={(e) => setBookForm(prev => ({ ...prev, title: e.target.value }))}
                          className="form-input"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Subtitle / Hook</label>
                        <input
                          type="text"
                          value={bookForm.subtitle}
                          onChange={(e) => setBookForm(prev => ({ ...prev, subtitle: e.target.value }))}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                      <div className="form-group">
                        <label>Publisher *</label>
                        <input
                          type="text"
                          value={bookForm.publisher}
                          onChange={(e) => setBookForm(prev => ({ ...prev, publisher: e.target.value }))}
                          className="form-input"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>ISBN Number *</label>
                        <input
                          type="text"
                          value={bookForm.isbn}
                          onChange={(e) => setBookForm(prev => ({ ...prev, isbn: e.target.value }))}
                          className="form-input"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Publish Date *</label>
                        <input
                          type="date"
                          value={bookForm.publishDate}
                          onChange={(e) => setBookForm(prev => ({ ...prev, publishDate: e.target.value }))}
                          className="form-input"
                          required
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                      <div className="form-group">
                        <label>Genre / Category</label>
                        <select
                          value={bookForm.genre}
                          onChange={(e) => setBookForm(prev => ({ ...prev, genre: e.target.value }))}
                          className="form-select"
                        >
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Language</label>
                        <select
                          value={bookForm.language}
                          onChange={(e) => setBookForm(prev => ({ ...prev, language: e.target.value }))}
                          className="form-select"
                        >
                          <option value="English">English</option>
                          <option value="Spanish">Spanish</option>
                          <option value="French">French</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Retail Price ($) *</label>
                        <input
                          type="number"
                          step="0.01"
                          value={bookForm.price}
                          onChange={(e) => setBookForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                          className="form-input"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Book Cover Photo URL *</label>
                      <input
                        type="url"
                        placeholder="https://unsplash.com/photos/..."
                        value={bookForm.coverUrl}
                        onChange={(e) => setBookForm(prev => ({ ...prev, coverUrl: e.target.value }))}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Complete Synopsis / Summary</label>
                      <textarea
                        rows={4}
                        placeholder="Provide an engaging description..."
                        value={bookForm.summary}
                        onChange={(e) => setBookForm(prev => ({ ...prev, summary: e.target.value }))}
                        className="form-textarea"
                      ></textarea>
                    </div>



                    {/* PREMIUM ASSETS (PRO/ELITE ONLY) */}
                    {(activePlan === 'plan-pro' || activePlan === 'plan-elite') && (
                      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px', marginTop: '20px' }}>
                        <h4 style={{ fontSize: '15px', color: 'var(--primary)', marginBottom: '16px' }}>✨ Premium Features (Unlocked by your Plan)</h4>
                        
                        <div className="form-group">
                          <label>Sample Chapter Content</label>
                          <textarea
                            rows={4}
                            placeholder="Paste the first chapter text for readers to preview..."
                            value={bookForm.sampleChapter}
                            onChange={(e) => setBookForm(prev => ({ ...prev, sampleChapter: e.target.value }))}
                            className="form-textarea"
                          ></textarea>
                        </div>

                        <div className="form-group">
                          <label>Book Trailer YouTube Embed Link</label>
                          <input
                            type="url"
                            placeholder="https://www.youtube.com/embed/..."
                            value={bookForm.trailerUrl}
                            onChange={(e) => setBookForm(prev => ({ ...prev, trailerUrl: e.target.value }))}
                            className="form-input"
                          />
                        </div>
                      </div>
                    )}

                    {/* RETAILER BADGES LINKS */}
                    <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px', marginTop: '20px' }}>
                      <h4 style={{ fontSize: '15px', marginBottom: '16px' }}>🔗 External Bookstore Purchase Links</h4>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                          <label>Amazon Link</label>
                          <input
                            type="url"
                            placeholder="https://amazon.com/..."
                            value={bookForm.amazon}
                            onChange={(e) => setBookForm(prev => ({ ...prev, amazon: e.target.value }))}
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label>Apple Books Link</label>
                          <input
                            type="url"
                            placeholder="https://books.apple.com/..."
                            value={bookForm.appleBooks}
                            onChange={(e) => setBookForm(prev => ({ ...prev, appleBooks: e.target.value }))}
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label>Barnes & Noble Link</label>
                          <input
                            type="url"
                            placeholder="https://barnesandnoble.com/..."
                            value={bookForm.barnesNoble}
                            onChange={(e) => setBookForm(prev => ({ ...prev, barnesNoble: e.target.value }))}
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label>Kobo Bookstore Link</label>
                          <input
                            type="url"
                            placeholder="https://kobo.com/..."
                            value={bookForm.kobo}
                            onChange={(e) => setBookForm(prev => ({ ...prev, kobo: e.target.value }))}
                            className="form-input"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit footer */}
                    <div style={{ display: 'flex', gap: '16px', marginTop: '24px', borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => { setBookFormMode('list'); setSelectedBookId(null); }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ minWidth: '150px' }}
                      >
                        {bookFormMode === 'add' ? 'Submit Listing' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB 3: SUBSCRIPTION PLANS */}
            {activeTab === 'plans' && (
              <div>
                <h3 style={{ fontSize: '22px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', marginBottom: '24px', fontFamily: 'Outfit' }}>
                  Marketing Subscriptions
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {SUBSCRIPTION_PLANS.map(plan => {
                    const isCurrent = activePlan === plan.id;
                    return (
                      <div 
                        key={plan.id}
                        style={{ 
                          border: isCurrent ? '2px solid var(--primary)' : '1px solid var(--border-light)', 
                          borderRadius: 'var(--radius-md)', 
                          padding: '24px',
                          background: isCurrent ? 'var(--primary-light)' : 'var(--bg-white)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <h4 style={{ fontSize: '18px', margin: 0 }}>{plan.name}</h4>
                            {isCurrent && (
                              <span style={{ background: 'var(--primary)', color: 'white', fontSize: '10px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '100px' }}>
                                Active Subscribed
                              </span>
                            )}
                          </div>
                          <p style={{ fontWeight: 'bold', fontSize: '20px', color: 'var(--primary)', margin: '8px 0' }}>
                            ${plan.price.toFixed(2)} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'normal' }}>/ {plan.duration}</span>
                          </p>

                          <ul style={{ paddingLeft: '16px', fontSize: '13px', color: 'var(--text-muted)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', maxWidth: '500px' }}>
                            {plan.features.map((f, idx) => (
                              <li key={idx}>{f}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          {isCurrent ? (
                            <button className="btn btn-outline" style={{ borderColor: 'var(--primary)', color: 'var(--primary)', background: 'transparent', cursor: 'default' }}>
                              Renewable (per {plan.duration})
                            </button>
                          ) : (
                            <button onClick={() => setCheckoutPlanId(plan.id)} className="btn btn-primary" style={{ borderRadius: '8px' }}>
                              Select Plan
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 4: PAYMENT HISTORY */}
            {activeTab === 'billing' && (
              <div>
                <h3 style={{ fontSize: '22px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', marginBottom: '24px', fontFamily: 'Outfit' }}>
                  Transaction History
                </h3>

                {authorTx.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-light)', textAlign: 'left' }}>
                        <th style={{ padding: '12px 8px' }}>Invoice No</th>
                        <th style={{ padding: '12px 8px' }}>Plan Purchased</th>
                        <th style={{ padding: '12px 8px' }}>Date</th>
                        <th style={{ padding: '12px 8px' }}>Amount</th>
                        <th style={{ padding: '12px 8px' }}>Method</th>
                        <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {authorTx.map(tx => (
                        <tr key={tx.id} style={{ borderBottom: '1px solid var(--bg-cream)' }}>
                          <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>{tx.invoiceNumber}</td>
                          <td style={{ padding: '12px 8px' }}>{tx.planName}</td>
                          <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>{tx.date}</td>
                          <td style={{ padding: '12px 8px', fontWeight: 'bold', color: 'var(--primary)' }}>${tx.amount.toFixed(2)}</td>
                          <td style={{ padding: '12px 8px' }}>{tx.paymentMethod}</td>
                          <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                            <button 
                              onClick={() => setActiveInvoice(tx)}
                              className="btn btn-secondary" 
                              style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '4px' }}
                            >
                              Open Invoice
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '40px 0' }}>
                    No payment history recorded yet. Choose a plan to subscribe.
                  </p>
                )}
              </div>
            )}

            {/* TAB 5: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div>
                <h3 style={{ fontSize: '22px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', marginBottom: '24px', fontFamily: 'Outfit' }}>
                  Account Notifications
                </h3>

                {authorNotifications.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {authorNotifications.map(n => (
                      <div 
                        key={n.id}
                        style={{ 
                          border: '1px solid var(--border-light)', 
                          borderRadius: 'var(--radius-sm)', 
                          padding: '16px',
                          background: n.read ? 'var(--bg-white)' : 'var(--primary-light)',
                          position: 'relative'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <strong style={{ fontSize: '15px' }}>{n.title}</strong>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{n.date}</span>
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--text-dark)' }}>{n.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '40px 0' }}>
                    No notifications in mailbox.
                  </p>
                )}
              </div>
            )}

          </main>
        </div>

      </div>

      {/* CHECKOUT MODAL OVERLAY */}
      {checkoutPlanId && (
        <CheckoutModal 
          planId={checkoutPlanId}
          onClose={() => { setCheckoutPlanId(null); setActiveTab('billing'); }}
        />
      )}

      {/* PRINTABLE INVOICE MODAL OVERLAY */}
      {activeInvoice && (
        <Invoice 
          transaction={activeInvoice}
          onClose={() => setActiveInvoice(null)}
        />
      )}

    </div>
  );
}
