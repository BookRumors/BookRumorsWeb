'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppState } from '@/context/StateContext';
import { Book } from '@/mockData';

export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { books, reviews, addReview, incrementBookView, incrementBookClick, currentUser, authors } = useAppState();

  const id = params.id as string;
  const book = books.find(b => b.id === id);
  const author = authors?.find(a => a.id === book?.authorId);

  // States
  const [showSample, setShowSample] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [redirectModal, setRedirectModal] = useState(false);
  
  // Review form states
  const [reviewerName, setReviewerName] = useState('');
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');

  // Increment views on load
  useEffect(() => {
    if (book) {
      incrementBookView(book.id);
    }
  }, [id]);

  if (!book) {
    return (
      <div className="section-padding" style={{ textAlign: 'center', minHeight: '60vh' }}>
        <div className="container">
          <h2>Book Not Found</h2>
          <p style={{ margin: '16px 0' }}>The requested book listing does not exist or has been removed.</p>
          <button className="btn btn-primary" onClick={() => router.push('/catalog')}>Back to Catalog</button>
        </div>
      </div>
    );
  }

  const bookReviews = reviews.filter(r => r.bookId === book.id);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !commentInput) {
      alert('Please fill out your name and review comment.');
      return;
    }
    addReview(book.id, ratingInput, commentInput, reviewerName);
    setReviewerName('');
    setCommentInput('');
    alert('Thank you! Your review has been added.');
  };

  const handleStoreClick = (url: string) => {
    incrementBookClick(book.id);
    window.open(url, '_blank');
  };

  return (
    <div style={{ background: 'var(--bg-cream)', paddingBottom: '60px' }}>
      <div className="container" style={{ paddingTop: '40px' }}>
        
        {/* Navigation Breadcrumbs */}
        <div style={{ marginBottom: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/')}>Home</span> /{' '}
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/catalog')}>Catalog</span> /{' '}
          <span style={{ color: 'var(--text-dark)', fontWeight: 'bold' }}>{book.title}</span>
        </div>

        {/* 1. BOOK CORE DETAILS CARD */}
        <div style={{ 
          background: 'var(--bg-white)', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--border-light)', 
          padding: '40px',
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          gap: '48px',
          marginBottom: '40px'
        }}>
          
          {/* Left Column: Cover & Action buttons */}
          <div>
            <div style={{ 
              borderRadius: 'var(--radius-md)', 
              overflow: 'hidden', 
              boxShadow: '0 20px 45px rgba(0,0,0,0.15)',
              marginBottom: '24px',
              border: '1px solid var(--border-light)',
              aspectRatio: '3/4'
            }}>
              <img src={book.coverUrl} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
            </div>

            {/* Read Sample & Video Trailer Action Triggers */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {book.sampleChapter && (
                <button className="btn btn-secondary" style={{ width: '100%', borderRadius: '8px' }} onClick={() => setShowSample(true)}>
                  📖 Read Sample Chapter
                </button>
              )}
              {book.trailerUrl && (
                <button className="btn btn-secondary" style={{ width: '100%', borderRadius: '8px' }} onClick={() => setShowTrailer(true)}>
                  🎬 Watch Book Trailer
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Descriptions & Retailers */}
          <div>
            {/* Title, Subtitle, Genre */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px', marginBottom: '20px' }}>
              <div>
                <span className="book-card-genre" style={{ fontSize: '13px' }}>{book.genre}</span>
                <h2 style={{ fontSize: '36px', marginTop: '6px', marginBottom: '6px', fontFamily: 'Outfit' }}>{book.title}</h2>
                {book.subtitle && <p style={{ fontSize: '16px', color: 'var(--text-muted)' }}>{book.subtitle}</p>}
                
                <p style={{ marginTop: '8px', fontSize: '15px' }}>
                  By <strong style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={() => router.push(`/catalog?search=${encodeURIComponent(book.authorName)}`)}>{book.authorName}</strong>
                </p>
              </div>

              {/* Rating Bubble */}
              <div style={{ background: 'var(--primary-light)', padding: '12px 20px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary)', display: 'block' }}>
                  {book.rating.toFixed(1)}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  ★ Average
                </span>
              </div>
            </div>

            {/* Book Metadata Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px', marginBottom: '24px', background: 'var(--bg-cream)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', fontSize: '13px' }}>
              {book.publisher && (
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Publisher</span>
                  <strong>{book.publisher}</strong>
                </div>
              )}
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Publish Date</span>
                <strong>{book.publishDate}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>ISBN</span>
                <strong>{book.isbn}</strong>
              </div>
              {book.language && (
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Language</span>
                  <strong>{book.language}</strong>
                </div>
              )}
              {currentUser?.role === 'admin' && (
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Popularity</span>
                  <strong>{book.views} profile views</strong>
                </div>
              )}
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Price</span>
                <strong style={{ color: 'var(--primary)' }}>{book.price === 0 ? 'FREE promotion' : `$${book.price.toFixed(2)}`}</strong>
              </div>
            </div>

            {/* Description Summary */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '12px', fontFamily: 'Outfit' }}>Synopsis Summary</h3>
              <p style={{ color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '15px', whiteSpace: 'pre-line', marginBottom: '24px' }}>
                {book.summary}
              </p>
            </div>

            {/* About the Author Section */}
            {author && (
              <div style={{ 
                background: 'var(--bg-cream)', 
                borderRadius: 'var(--radius-md)', 
                border: '1px solid var(--border-light)', 
                padding: '24px', 
                marginBottom: '32px' 
              }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '12px' }}>
                  <img 
                    src={author.profileImage} 
                    alt={author.name} 
                    style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} 
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 style={{ fontSize: '18px', margin: 0, fontFamily: 'Outfit', color: 'var(--primary)' }}>About the Author</h3>
                    <h4 style={{ fontSize: '14px', margin: '2px 0 0 0', fontWeight: 'bold', color: 'var(--text-dark)' }}>{author.name}</h4>
                  </div>
                </div>
                <p style={{ color: 'var(--text-dark)', lineHeight: '1.6', fontSize: '14px', margin: 0 }}>
                  {author.bio}
                </p>
              </div>
            )}

            {/* Purchase buttons trigger */}
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
              <h4 style={{ fontSize: '16px', marginBottom: '16px', fontFamily: 'Outfit', color: 'var(--text-dark)' }}>
                🛒 Purchase book from authorized online retailers:
              </h4>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {book.purchaseLinks.amazon && (
                  <button 
                    onClick={() => handleStoreClick(book.purchaseLinks.amazon!)}
                    className="btn btn-primary" 
                    style={{ borderRadius: '8px', fontSize: '13px', background: '#FF9900', color: '#000', boxShadow: 'none' }}
                  >
                    Buy on Amazon
                  </button>
                )}
                {book.purchaseLinks.appleBooks && (
                  <button 
                    onClick={() => handleStoreClick(book.purchaseLinks.appleBooks!)}
                    className="btn btn-primary" 
                    style={{ borderRadius: '8px', fontSize: '13px', background: '#FC3C5C', boxShadow: 'none' }}
                  >
                    Apple Books
                  </button>
                )}
                {book.purchaseLinks.barnesNoble && (
                  <button 
                    onClick={() => handleStoreClick(book.purchaseLinks.barnesNoble!)}
                    className="btn btn-primary" 
                    style={{ borderRadius: '8px', fontSize: '13px', background: '#004B23', boxShadow: 'none' }}
                  >
                    Barnes & Noble
                  </button>
                )}
                {book.purchaseLinks.kobo && (
                  <button 
                    onClick={() => handleStoreClick(book.purchaseLinks.kobo!)}
                    className="btn btn-primary" 
                    style={{ borderRadius: '8px', fontSize: '13px', background: '#007BF5', boxShadow: 'none' }}
                  >
                    Kobo Store
                  </button>
                )}
                {book.purchaseLinks.publisherSite && (
                  <button 
                    onClick={() => handleStoreClick(book.purchaseLinks.publisherSite!)}
                    className="btn btn-outline" 
                    style={{ borderRadius: '8px', fontSize: '13px' }}
                  >
                    Official Site
                  </button>
                )}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '8px' }}>
                * Readers are redirected directly to external marketplaces to purchase.
              </span>
            </div>

          </div>
        </div>

        {/* 2. REVIEWS SECTION */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '48px', alignItems: 'flex-start' }}>
          
          {/* Reviews List */}
          <div style={{ background: 'var(--bg-white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', padding: '32px' }}>
            <h3 style={{ fontSize: '22px', marginBottom: '24px', fontFamily: 'Outfit' }}>
              Customer Reviews ({bookReviews.length})
            </h3>

            {bookReviews.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {bookReviews.map(rev => (
                  <div key={rev.id} style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <strong>{rev.userName}</strong>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{rev.date}</span>
                    </div>
                    {/* Stars */}
                    <div style={{ color: '#FFB800', marginBottom: '8px', fontSize: '13px' }}>
                      {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                    </div>
                    <p style={{ color: 'var(--text-dark)', fontSize: '14px', lineHeight: '1.5' }}>{rev.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '40px 0' }}>
                No reviews yet. Be the first to share your thoughts about this book!
              </p>
            )}
          </div>

          {/* Add Review Form */}
          <div style={{ background: 'var(--bg-white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', padding: '32px' }}>
            <h3 style={{ fontSize: '22px', marginBottom: '24px', fontFamily: 'Outfit' }}>Write a Review</h3>

            <form onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Rating</label>
                <select
                  value={ratingInput}
                  onChange={(e) => setRatingInput(parseInt(e.target.value))}
                  className="form-select"
                >
                  <option value="5">5 Stars (Excellent)</option>
                  <option value="4">4 Stars (Good)</option>
                  <option value="3">3 Stars (Average)</option>
                  <option value="2">2 Stars (Poor)</option>
                  <option value="1">1 Star (Very Bad)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Comment / Opinion</label>
                <textarea
                  rows={4}
                  placeholder="Share your thoughts on the story, characters, or subject matter..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="form-textarea"
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', borderRadius: '8px' }}>
                Submit Review
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* SAMPLE CHAPTER DRAWER MODAL */}
      {showSample && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px', padding: '32px' }}>
            <button className="modal-close" onClick={() => setShowSample(false)}>×</button>
            <h3 style={{ fontSize: '22px', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', fontFamily: 'Outfit' }}>
              Sample Text: {book.title}
            </h3>
            
            <div style={{ 
              maxHeight: '400px', 
              overflowY: 'auto', 
              padding: '16px', 
              background: 'var(--bg-cream)', 
              borderRadius: '8px',
              fontFamily: 'Georgia, serif',
              lineHeight: '1.8',
              fontSize: '15px',
              color: '#333',
              whiteSpace: 'pre-line'
            }}>
              {book.sampleChapter || 'No sample chapter content available for this book.'}
            </div>

            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '20px', textAlign: 'center' }}>
              📖 Sample text provided by the author. Copyrighted material.
            </p>
          </div>
        </div>
      )}

      {/* TRAILER POPUP MODAL */}
      {showTrailer && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '700px', padding: '0', overflow: 'hidden' }}>
            <div style={{ background: 'black', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
              <span style={{ fontWeight: 'bold' }}>{book.title} - Official Book Trailer</span>
              <button 
                onClick={() => setShowTrailer(false)}
                style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
            
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
              <iframe
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                src={book.trailerUrl}
                title={`${book.title} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div style={{ padding: '16px', background: 'var(--bg-white)', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
              🎬 Video hosted on third-party video networks.
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
