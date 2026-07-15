'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/context/StateContext';

export default function AdminPage() {
  const router = useRouter();
  const {
    currentUser,
    authors,
    books,
    categories,
    transactions,
    notifications,
    newsletters,
    newsletterSubscribers,
    approveAuthor,
    rejectAuthor,
    approveBook,
    rejectBook,
    addCategory,
    updateCategory,
    deleteCategory,
    sendNewsletter
  } = useAppState();

  // Route security check
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/auth');
    }
  }, [currentUser]);

  // Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'authors' | 'books' | 'categories' | 'newsletters'>('overview');

  // Local Category Editing states
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('📖');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');
  const [editingCatIcon, setEditingCatIcon] = useState('');

  // Local Book Editing states
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [editBookTitle, setEditBookTitle] = useState('');
  const [editBookGenre, setEditBookGenre] = useState('');
  const [editBookPrice, setEditBookPrice] = useState(0);
  const [editBookSummary, setEditBookSummary] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectingBookId, setRejectingBookId] = useState<string | null>(null);

  // Local Newsletter states
  const [newsSubject, setNewsSubject] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsMsg, setNewsMsg] = useState('');

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Redirecting to secure area...</p>
      </div>
    );
  }

  // Filter calculations
  const pendingAuthors = authors.filter(a => a.verificationStatus === 'pending');
  const pendingBooks = books.filter(b => b.status === 'pending');
  const totalRevenue = transactions.reduce((sum, tx) => tx.status === 'success' ? sum + tx.amount : sum, 0);

  // Category Action handlers
  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    addCategory(newCatName, newCatIcon);
    setNewCatName('');
    setNewCatIcon('📖');
    alert('Category created successfully!');
  };

  const handleStartEditCategory = (id: string, name: string, icon: string) => {
    setEditingCatId(id);
    setEditingCatName(name);
    setEditingCatIcon(icon);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCatId || !editingCatName) return;
    updateCategory(editingCatId, editingCatName, editingCatIcon);
    setEditingCatId(null);
    setEditingCatName('');
    setEditingCatIcon('');
    alert('Category updated.');
  };

  // Book edit before approval handlers
  const handleStartEditBook = (book: any) => {
    setEditingBookId(book.id);
    setEditBookTitle(book.title);
    setEditBookGenre(book.genre);
    setEditBookPrice(book.price);
    setEditBookSummary(book.summary);
  };

  const handleSaveBookDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBookId) return;
    
    // Find book to get original details
    const orig = books.find(b => b.id === editingBookId);
    if (orig) {
      books.map(b => b.id === editingBookId ? Object.assign(b, {
        title: editBookTitle,
        genre: editBookGenre,
        price: editBookPrice,
        summary: editBookSummary
      }) : b);
    }

    setEditingBookId(null);
    alert('Book details updated. You can now approve it.');
  };

  // Newsletter handler
  const handleSendNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsSubject || !newsContent) {
      alert('Please fill out Subject and Content.');
      return;
    }

    sendNewsletter(newsSubject, newsContent);
    setNewsSubject('');
    setNewsContent('');
    setNewsMsg(`Newsletter dispatched successfully to all ${newsletterSubscribers.length} subscribers!`);
    setTimeout(() => setNewsMsg(''), 4000);
  };

  return (
    <div style={{ background: 'var(--bg-cream)', paddingBottom: '60px', flex: 1 }}>
      <div className="container" style={{ paddingTop: '40px' }}>
        
        {/* Admin Header */}
        <div style={{ background: 'var(--bg-white)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '28px', fontFamily: 'Outfit' }}>Administration Console</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
              BookRumors General Management Panel • Status: <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Secured</span>
            </p>
          </div>
          <div style={{ background: '#0F1D36', color: 'white', padding: '12px 20px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold', display: 'block' }}>System Role:</span>
            <strong style={{ color: '#3399FF', fontSize: '15px' }}>ROOT ADMINISTRATOR</strong>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="dashboard-layout">
          
          {/* Sidebar */}
          <aside className="dashboard-sidebar">
            <button className={`dashboard-nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              📊 System Overview
            </button>
            <button className={`dashboard-nav-item ${activeTab === 'authors' ? 'active' : ''}`} onClick={() => setActiveTab('authors')}>
              👤 Verify Authors ({pendingAuthors.length})
            </button>
            <button className={`dashboard-nav-item ${activeTab === 'books' ? 'active' : ''}`} onClick={() => setActiveTab('books')}>
              📖 Review Books ({pendingBooks.length})
            </button>
            <button className={`dashboard-nav-item ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>
              🏷️ Category Manager ({categories.length})
            </button>
            <button className={`dashboard-nav-item ${activeTab === 'newsletters' ? 'active' : ''}`} onClick={() => setActiveTab('newsletters')}>
              ✉️ Newsletter Center ({newsletterSubscribers.length} subs)
            </button>
          </aside>

          {/* Main Workspace */}
          <main className="dashboard-content">
            
            {/* TAB 1: SYSTEM OVERVIEW */}
            {activeTab === 'overview' && (
              <div>
                <h3 style={{ fontSize: '22px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', marginBottom: '24px', fontFamily: 'Outfit' }}>
                  System Statistics
                </h3>

                {/* Dashboard Matrix */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
                  <div style={{ background: 'var(--bg-cream)', border: '1px solid var(--border-light)', padding: '20px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Registered Authors</span>
                    <h4 style={{ fontSize: '28px', color: 'var(--text-dark)', marginTop: '8px' }}>{authors.length}</h4>
                  </div>
                  <div style={{ background: 'var(--bg-cream)', border: '1px solid var(--border-light)', padding: '20px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Listed Books</span>
                    <h4 style={{ fontSize: '28px', color: 'var(--text-dark)', marginTop: '8px' }}>{books.length}</h4>
                  </div>
                  <div style={{ background: 'var(--bg-cream)', border: '1px solid var(--border-light)', padding: '20px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Newsletter Subscribers</span>
                    <h4 style={{ fontSize: '28px', color: 'var(--primary)', marginTop: '8px' }}>{newsletterSubscribers.length}</h4>
                  </div>
                  <div style={{ background: 'var(--bg-cream)', border: '1px solid var(--border-light)', padding: '20px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Marketing Revenue</span>
                    <h4 style={{ fontSize: '28px', color: 'green', marginTop: '8px' }}>${totalRevenue.toFixed(2)}</h4>
                  </div>
                </div>

                {/* Recent transaction log */}
                <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', padding: '24px' }}>
                  <h4 style={{ fontSize: '16px', marginBottom: '16px' }}>Recent Subscriptions Roster</h4>
                  
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-light)', textAlign: 'left' }}>
                        <th style={{ padding: '8px' }}>Invoice</th>
                        <th style={{ padding: '8px' }}>Author</th>
                        <th style={{ padding: '8px' }}>Plan</th>
                        <th style={{ padding: '8px' }}>Payment Method</th>
                        <th style={{ padding: '8px', textAlign: 'right' }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.slice(0, 5).map(tx => (
                        <tr key={tx.id} style={{ borderBottom: '1px solid var(--bg-cream)' }}>
                          <td style={{ padding: '8px', fontWeight: 'bold' }}>{tx.invoiceNumber}</td>
                          <td style={{ padding: '8px' }}>{tx.authorName}</td>
                          <td style={{ padding: '8px' }}>{tx.planName}</td>
                          <td style={{ padding: '8px' }}>{tx.paymentMethod}</td>
                          <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold', color: 'var(--primary)' }}>
                            ${tx.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: AUTHOR VERIFICATION */}
            {activeTab === 'authors' && (
              <div>
                <h3 style={{ fontSize: '22px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', marginBottom: '24px', fontFamily: 'Outfit' }}>
                  Author Registration Approval
                </h3>

                {pendingAuthors.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {pendingAuthors.map(auth => (
                      <div 
                        key={auth.id}
                        style={{ 
                          display: 'grid', 
                          gridTemplateColumns: '80px 1fr auto', 
                          gap: '20px', 
                          border: '1px solid var(--border-light)', 
                          padding: '20px', 
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--bg-white)',
                          alignItems: 'center'
                        }}
                      >
                        {auth.profileImage === 'placeholder' || !auth.profileImage ? (
                          <div style={{ 
                            width: '80px', 
                            height: '80px', 
                            borderRadius: '50%', 
                            background: 'var(--primary-light)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            border: '2px solid var(--primary)',
                            color: 'var(--primary)',
                            fontSize: '32px',
                            fontWeight: 'bold'
                          }}>
                            {auth.name.charAt(0)}
                          </div>
                        ) : (
                          <img 
                            src={auth.profileImage} 
                            alt={auth.name} 
                            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%', border: '2px solid var(--border-light)' }} 
                          />
                        )}
                        
                        <div>
                          <h4 style={{ fontSize: '18px', margin: '0 0 4px 0' }}>{auth.name}</h4>
                          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                            Email: {auth.email} • Registered: {auth.joinDate}
                          </p>
                          <p style={{ fontSize: '13px', color: 'var(--text-dark)', fontStyle: 'italic', lineHeight: '1.4' }}>
                            "{auth.bio || 'No bio provided.'}"
                          </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <button 
                            onClick={() => { approveAuthor(auth.id); alert(`Author "${auth.name}" has been approved!`); }}
                            className="btn btn-primary" 
                            style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '6px' }}
                          >
                            Approve Creator
                          </button>
                          <button 
                            onClick={() => { if(confirm('Reject this author registration?')) rejectAuthor(auth.id); }}
                            className="btn btn-outline" 
                            style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '6px' }}
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '40px 0', textAlign: 'center', border: '1px dashed var(--border-light)', borderRadius: '8px' }}>
                    <span style={{ fontSize: '32px' }}>👤</span>
                    <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '14px' }}>
                      No pending author registrations require validation.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: BOOK VERIFICATION */}
            {activeTab === 'books' && (
              <div>
                <h3 style={{ fontSize: '22px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', marginBottom: '24px', fontFamily: 'Outfit' }}>
                  Review Book Submissions
                </h3>

                {pendingBooks.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {pendingBooks.map(book => {
                      const isEditing = editingBookId === book.id;
                      
                      return (
                        <div 
                          key={book.id}
                          style={{ 
                            display: 'grid', 
                            gridTemplateColumns: '100px 1fr auto', 
                            gap: '24px', 
                            border: '1px solid var(--border-light)', 
                            padding: '24px', 
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--bg-white)',
                            alignItems: 'flex-start'
                          }}
                        >
                          <img src={book.coverUrl} alt={book.title} style={{ width: '100px', height: '140px', objectFit: 'contain', borderRadius: '6px', border: '1px solid var(--border-light)' }} referrerPolicy="no-referrer" />
                          
                          <div>
                            {isEditing ? (
                              <form onSubmit={handleSaveBookDetails} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div className="form-group" style={{ margin: 0 }}>
                                  <label>Edit Title</label>
                                  <input type="text" value={editBookTitle} onChange={(e) => setEditBookTitle(e.target.value)} className="form-input" />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                  <div className="form-group" style={{ margin: 0 }}>
                                    <label>Edit Genre</label>
                                    <select value={editBookGenre} onChange={(e) => setEditBookGenre(e.target.value)} className="form-select">
                                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                  </div>
                                  <div className="form-group" style={{ margin: 0 }}>
                                    <label>Edit Price ($)</label>
                                    <input type="number" step="0.01" value={editBookPrice} onChange={(e) => setEditBookPrice(parseFloat(e.target.value) || 0)} className="form-input" />
                                  </div>
                                </div>
                                <div className="form-group" style={{ margin: 0 }}>
                                  <label>Edit Summary</label>
                                  <textarea rows={3} value={editBookSummary} onChange={(e) => setEditBookSummary(e.target.value)} className="form-textarea" />
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button type="submit" className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '4px' }}>Save Changes</button>
                                  <button type="button" onClick={() => setEditingBookId(null)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '4px' }}>Cancel</button>
                                </div>
                              </form>
                            ) : (
                              <div>
                                <h4 style={{ fontSize: '18px', margin: '0 0 6px 0' }}>{book.title}</h4>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                  By {book.authorName} • ISBN: {book.isbn} • Price: ${book.price.toFixed(2)} • Genre: {book.genre}
                                </p>
                                <p style={{ fontSize: '13px', color: 'var(--text-dark)', lineHeight: '1.5' }}>
                                  {book.summary.substring(0, 180)}...
                                </p>
                                <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '12px' }}>
                                  <strong>Purchase Links: </strong>
                                  {Object.entries(book.purchaseLinks).filter(([k,v]) => v).map(([k,v]) => (
                                    <span key={k} style={{ background: 'var(--bg-cream)', padding: '2px 8px', borderRadius: '4px' }}>{k}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignSelf: 'center' }}>
                            {!isEditing && (
                              <>
                                <button 
                                  onClick={() => { approveBook(book.id); alert('Book approved! Listing is now active on the catalog.'); }}
                                  className="btn btn-primary" 
                                  style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '6px' }}
                                >
                                  Approve & Live
                                </button>
                                <button 
                                  onClick={() => handleStartEditBook(book)}
                                  className="btn btn-secondary" 
                                  style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '6px' }}
                                >
                                  Modify Info
                                </button>
                                <button 
                                  onClick={() => setRejectingBookId(book.id)}
                                  className="btn btn-outline" 
                                  style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '6px' }}
                                >
                                  Reject...
                                </button>
                              </>
                            )}
                          </div>

                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ padding: '40px 0', textAlign: 'center', border: '1px dashed var(--border-light)', borderRadius: '8px' }}>
                    <span style={{ fontSize: '32px' }}>📚</span>
                    <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '14px' }}>
                      No book submissions require verification.
                    </p>
                  </div>
                )}

                {/* REJECTION REASON MODAL POPUP */}
                {rejectingBookId && (
                  <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '400px', padding: '32px' }}>
                      <h4 style={{ marginBottom: '12px' }}>Reason for Rejection</h4>
                      
                      <div className="form-group">
                        <textarea
                          rows={3}
                          placeholder="e.g. Cover image resolution too low / Missing purchase links..."
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className="form-textarea"
                          required
                        ></textarea>
                      </div>

                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="btn btn-secondary" onClick={() => { setRejectingBookId(null); setRejectionReason(''); }}>
                          Cancel
                        </button>
                        <button 
                          className="btn btn-primary" 
                          onClick={() => {
                            if(!rejectionReason) return;
                            rejectBook(rejectingBookId, rejectionReason);
                            setRejectingBookId(null);
                            setRejectionReason('');
                            alert('Book submission rejected. Author notified.');
                          }}
                        >
                          Send Rejection
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Live Books Stats Section */}
                <h3 style={{ fontSize: '22px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', marginTop: '48px', marginBottom: '24px', fontFamily: 'Outfit' }}>
                  Live Book Performance Statistics
                </h3>

                <div style={{ background: 'var(--bg-white)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', padding: '24px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-light)', textAlign: 'left' }}>
                        <th style={{ padding: '12px 8px' }}>Cover</th>
                        <th style={{ padding: '12px 8px' }}>Book Title</th>
                        <th style={{ padding: '12px 8px' }}>Author</th>
                        <th style={{ padding: '12px 8px' }}>Price</th>
                        <th style={{ padding: '12px 8px', textAlign: 'center' }}>Views</th>
                        <th style={{ padding: '12px 8px', textAlign: 'center' }}>Clicks</th>
                        <th style={{ padding: '12px 8px', textAlign: 'center' }}>CTR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {books.filter(b => b.status === 'approved').map(book => {
                        const views = book.views || 0;
                        const clicks = book.purchaseClicks || 0;
                        const ctr = views > 0 ? `${((clicks / views) * 100).toFixed(1)}%` : '0.0%';
                        
                        return (
                          <tr key={book.id} style={{ borderBottom: '1px solid var(--bg-cream)' }}>
                            <td style={{ padding: '8px' }}>
                              <img src={book.coverUrl} alt="" style={{ width: '35px', height: '48px', objectFit: 'contain', borderRadius: '2px' }} referrerPolicy="no-referrer" />
                            </td>
                            <td style={{ padding: '8px', fontWeight: 'bold' }}>{book.title}</td>
                            <td style={{ padding: '8px' }}>{book.authorName}</td>
                            <td style={{ padding: '8px' }}>${book.price.toFixed(2)}</td>
                            <td style={{ padding: '8px', textAlign: 'center', fontWeight: '500' }}>{views}</td>
                            <td style={{ padding: '8px', textAlign: 'center', fontWeight: '500', color: 'var(--primary)' }}>{clicks}</td>
                            <td style={{ padding: '8px', textAlign: 'center', fontWeight: 'bold', color: 'green' }}>{ctr}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* TAB 4: CATEGORY MANAGER */}
            {activeTab === 'categories' && (
              <div>
                <h3 style={{ fontSize: '22px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', marginBottom: '24px', fontFamily: 'Outfit' }}>
                  Manage Predefined Categories
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }}>
                  
                  {/* Listing & Editing */}
                  <div>
                    <h4 style={{ fontSize: '16px', marginBottom: '16px' }}>Active System Genres</h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {categories.map(cat => {
                        const isCatEditing = editingCatId === cat.id;

                        return (
                          <div 
                            key={cat.id}
                            style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center', 
                              background: 'var(--bg-white)', 
                              padding: '12px 16px', 
                              border: '1px solid var(--border-light)', 
                              borderRadius: '8px' 
                            }}
                          >
                            {isCatEditing ? (
                              <form onSubmit={handleSaveCategory} style={{ display: 'flex', gap: '8px', flex: 1, marginRight: '16px' }}>
                                <input type="text" value={editingCatIcon} onChange={(e) => setEditingCatIcon(e.target.value)} className="form-input" style={{ width: '50px', padding: '6px', textAlign: 'center' }} />
                                <input type="text" value={editingCatName} onChange={(e) => setEditingCatName(e.target.value)} className="form-input" style={{ padding: '6px' }} />
                                <button type="submit" className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '4px' }}>Save</button>
                                <button type="button" onClick={() => setEditingCatId(null)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '4px' }}>X</button>
                              </form>
                            ) : (
                              <div style={{ fontSize: '15px' }}>
                                <span style={{ marginRight: '8px' }}>{cat.icon}</span>
                                <strong>{cat.name}</strong>
                              </div>
                            )}

                            {!isCatEditing && (
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button 
                                  onClick={() => handleStartEditCategory(cat.id, cat.name, cat.icon)}
                                  className="btn btn-secondary" 
                                  style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '4px' }}
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => { if(confirm('Delete category?')) deleteCategory(cat.id); }}
                                  className="btn btn-outline" 
                                  style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '4px', color: 'var(--primary)', borderColor: 'var(--primary)' }}
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Add New Category */}
                  <div style={{ background: 'var(--bg-white)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', padding: '24px' }}>
                    <h4 style={{ fontSize: '16px', marginBottom: '16px' }}>Create New Category</h4>
                    
                    <form onSubmit={handleAddCategorySubmit}>
                      <div className="form-group">
                        <label>Category Label</label>
                        <input
                          type="text"
                          placeholder="e.g. Science Fiction"
                          value={newCatName}
                          onChange={(e) => setNewCatName(e.target.value)}
                          className="form-input"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Emoji Representation</label>
                        <input
                          type="text"
                          value={newCatIcon}
                          onChange={(e) => setNewCatIcon(e.target.value)}
                          className="form-input"
                          style={{ maxWidth: '80px', textAlign: 'center' }}
                          required
                        />
                      </div>
                      <button type="submit" className="btn btn-primary" style={{ width: '100%', borderRadius: '8px' }}>
                        Add Category
                      </button>
                    </form>
                  </div>

                </div>
              </div>
            )}

            {/* TAB 5: NEWSLETTERS */}
            {activeTab === 'newsletters' && (
              <div>
                <h3 style={{ fontSize: '22px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', marginBottom: '24px', fontFamily: 'Outfit' }}>
                  Newsletter Mailer Dashboard
                </h3>

                {newsMsg && (
                  <div style={{ background: '#e6fffa', border: '1px solid #319795', color: '#234e52', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', fontWeight: 'bold' }}>
                    ✓ {newsMsg}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px', alignItems: 'flex-start' }}>
                  
                  {/* Mailer Form */}
                  <div style={{ background: 'var(--bg-white)', border: '1px solid var(--border-light)', padding: '24px', borderRadius: 'var(--radius-sm)' }}>
                    <h4 style={{ fontSize: '16px', marginBottom: '16px' }}>Draft Marketing Update</h4>
                    
                    <form onSubmit={handleSendNewsletter}>
                      <div className="form-group">
                        <label>Email Subject Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Discover this week's trending novels on BookRumors!"
                          value={newsSubject}
                          onChange={(e) => setNewsSubject(e.target.value)}
                          className="form-input"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Email Markdown Content Body</label>
                        <textarea
                          rows={6}
                          placeholder="Write the newsletter announcement message details here..."
                          value={newsContent}
                          onChange={(e) => setNewsContent(e.target.value)}
                          className="form-textarea"
                          required
                        ></textarea>
                      </div>

                      <button type="submit" className="btn btn-primary" style={{ width: '100%', borderRadius: '8px' }}>
                        🚀 Distribute to Roster ({newsletterSubscribers.length} subs)
                      </button>
                    </form>
                  </div>

                  {/* Subscribers & past logs */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Subs list */}
                    <div style={{ background: 'var(--bg-white)', border: '1px solid var(--border-light)', padding: '20px', borderRadius: 'var(--radius-sm)' }}>
                      <h4 style={{ fontSize: '15px', marginBottom: '12px' }}>Active Email Roster</h4>
                      <div style={{ maxHeight: '150px', overflowY: 'auto', background: 'var(--bg-cream)', padding: '12px', borderRadius: '6px', fontSize: '13px' }}>
                        {newsletterSubscribers.map((email, idx) => (
                          <div key={idx} style={{ padding: '4px 0', borderBottom: '1px solid #eee' }}>
                            ✉️ {email}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Past Logs */}
                    <div style={{ background: 'var(--bg-white)', border: '1px solid var(--border-light)', padding: '20px', borderRadius: 'var(--radius-sm)' }}>
                      <h4 style={{ fontSize: '15px', marginBottom: '12px' }}>Past Dispatch Logs</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto' }}>
                        {newsletters.map(news => (
                          <div key={news.id} style={{ fontSize: '12px', borderBottom: '1px solid #f0f0f0', paddingBottom: '8px' }}>
                            <strong style={{ display: 'block', fontSize: '13px' }}>{news.subject}</strong>
                            <span style={{ color: 'var(--text-muted)' }}>Sent: {news.dateSent} • Sent to: {news.subscribersCount} subs</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </main>
        </div>

      </div>
    </div>
  );
}
