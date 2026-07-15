'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAppState } from '@/context/StateContext';
import { Book } from '@/mockData';

function CatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { books, categories, currentUser } = useAppState();

  // Search parameters from URL
  const urlSearch = searchParams.get('search') || '';
  const urlCategory = searchParams.get('category') || '';
  const urlYears = searchParams.get('years') || '';
  const urlFavorites = searchParams.get('favorites') || '';
  const urlFilter = searchParams.get('filter') || '';

  // Local state filters
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [priceLimit, setPriceLimit] = useState(30);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  
  // Bookmark state (favorites)
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(urlFavorites === 'true');

  // Redirection Modal state
  const [redirectBook, setRedirectBook] = useState<Book | null>(null);

  // Load favorites from localstorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const favs = localStorage.getItem('br_favorites');
      if (favs) setFavorites(JSON.parse(favs));
    }
  }, []);

  // Update states if URL parameters change
  useEffect(() => {
    setSearchQuery(urlSearch);
    setSelectedCategory(urlCategory);
    setShowOnlyFavorites(urlFavorites === 'true');
    if (urlFilter === 'featured') {
      setSortBy('rating');
    } else if (urlFilter === 'new') {
      setSortBy('newest');
    } else if (urlFilter === 'trending') {
      setSortBy('popular');
    }
  }, [urlSearch, urlCategory, urlYears, urlFavorites, urlFilter]);

  const toggleFavorite = (e: React.MouseEvent, bookId: string) => {
    e.preventDefault();
    e.stopPropagation();
    let updated;
    if (favorites.includes(bookId)) {
      updated = favorites.filter(id => id !== bookId);
    } else {
      updated = [...favorites, bookId];
    }
    setFavorites(updated);
    localStorage.setItem('br_favorites', JSON.stringify(updated));
  };

  const handleBuyNow = (e: React.MouseEvent, book: Book) => {
    e.preventDefault();
    e.stopPropagation();
    setRedirectBook(book);
  };

  // Filter and Sort Books
  const filteredBooks = books
    .filter(book => book.status === 'approved') // Only show approved books
    .filter(book => {
      // Search text filter
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        book.title.toLowerCase().includes(q) ||
        book.authorName.toLowerCase().includes(q) ||
        (book.subtitle && book.subtitle.toLowerCase().includes(q)) ||
        book.isbn.includes(q) ||
        book.keywords.some(k => k.toLowerCase().includes(q))
      );
    })
    .filter(book => {
      // Category filter
      if (!selectedCategory) return true;
      return book.genre.toLowerCase() === selectedCategory.toLowerCase();
    })
    .filter(book => {
      // Price limit filter
      return book.price <= priceLimit;
    })
    .filter(book => {
      // Language filter
      if (!selectedLanguage) return true;
      return book.language.toLowerCase() === selectedLanguage.toLowerCase();
    })
    .filter(book => {
      // Favorites filter
      if (!showOnlyFavorites) return true;
      return favorites.includes(book.id);
    })
    .sort((a, b) => {
      // Sort functions
      if (sortBy === 'popular') return b.views - a.views;
      if (sortBy === 'newest') return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="section-padding" style={{ background: 'var(--bg-cream)', minHeight: '100vh' }}>
      <div className="container">
        
        {/* Title banner */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '36px', fontFamily: 'Outfit' }}>
            {showOnlyFavorites ? 'Your Saved' : 'Discover'} <span style={{ color: 'var(--primary)' }}>{showOnlyFavorites ? 'Books ❤️' : 'BookRumors Catalog'}</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            {showOnlyFavorites 
              ? 'Browse books you have bookmarked for future reading.' 
              : 'Search, filter, and review published works across international genres.'
            }
          </p>
        </div>

        {/* Catalog layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px', alignItems: 'flex-start' }}>
          
          {/* Filters Sidebar */}
          <aside style={{ 
            background: 'var(--bg-white)', 
            border: '1px solid var(--border-light)', 
            borderRadius: 'var(--radius-md)', 
            padding: '24px',
            position: 'sticky',
            top: '100px'
          }}>
            <h3 style={{ fontSize: '18px', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>Filters</h3>

            {/* Keyword Search */}
            <div className="form-group">
              <label>Search Keyword</label>
              <input
                type="text"
                placeholder="Title, author, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
              />
            </div>

            {/* Category Choose */}
            <div className="form-group">
              <label>Genre Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-select"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Price range */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ margin: 0 }}>Max Price</label>
                <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>${priceLimit.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="0.5"
                value={priceLimit}
                onChange={(e) => setPriceLimit(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary)' }}
              />
            </div>

            {/* Language filter */}
            <div className="form-group">
              <label>Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="form-select"
              >
                <option value="">All Languages</option>
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
              </select>
            </div>

            {/* Reset Filters */}
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                setPriceLimit(30);
                setSelectedLanguage('');
                setShowOnlyFavorites(false);
              }}
              className="btn btn-secondary" 
              style={{ width: '100%', borderRadius: '8px', fontSize: '13px', marginTop: '10px' }}
            >
              Reset All Filters
            </button>
          </aside>

          {/* Book Catalog Results */}
          <div>
            {/* Sorting & count */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              background: 'var(--bg-white)', 
              padding: '16px 24px', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--border-light)',
              marginBottom: '24px'
            }}>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                Showing <strong>{filteredBooks.length}</strong> books
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-select"
                  style={{ width: 'auto', padding: '6px 12px', fontSize: '13px', background: 'var(--bg-cream)', border: '1px solid var(--border-light)' }}
                >
                  <option value="popular">Popularity</option>
                  <option value="newest">Recently Added</option>
                  <option value="rating">Top Rated</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Book Cards Grid */}
            {filteredBooks.length > 0 ? (
              <div className="grid-3">
                {filteredBooks.map(book => (
                  <div key={book.id} onClick={() => router.push(`/book/${book.id}`)} style={{ cursor: 'pointer' }}>
                    <div className="book-card" style={{ height: '100%' }}>
                      
                      {/* Favorite Button */}
                      <button
                        onClick={(e) => toggleFavorite(e, book.id)}
                        style={{
                          position: 'absolute',
                          top: '24px',
                          right: '24px',
                          background: 'white',
                          border: 'none',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          zIndex: 10
                        }}
                      >
                        {favorites.includes(book.id) ? '❤️' : '🤍'}
                      </button>

                      <div className="book-card-img-wrapper">
                        <Image src={book.coverUrl} className="book-card-img" alt={book.title} width={240} height={320} style={{ objectFit: 'contain' }} />
                      </div>
                      
                      <div className="book-card-info">
                        <span className="book-card-genre" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <span>{book.genre}</span>
                        </span>
                        <h4 className="book-card-title">{book.title}</h4>
                        <p className="book-card-author">{book.authorName}</p>
                        
                        {/* Rating */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', margin: '-4px 0 12px 0' }}>
                          <span style={{ color: '#FFB800' }}>★</span>
                          <span style={{ fontWeight: 'bold' }}>{book.rating.toFixed(1)}</span>
                          {currentUser?.role === 'admin' && <span style={{ color: 'var(--text-muted)' }}>({book.views} views)</span>}
                        </div>

                        <div className="book-card-footer">
                          <span className="book-card-price">
                            {book.price === 0 ? 'FREE' : `$${book.price.toFixed(2)}`}
                          </span>
                          <button onClick={(e) => handleBuyNow(e, book)} className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '12px', borderRadius: '6px' }}>
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ background: 'var(--bg-white)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '60px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                <h3>No Books Found Matching Your Filters</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>
                  Try resetting the sidebar filters or searching with a different keyword.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* RETAILER REDIRECTION MODAL */}
      {redirectBook && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px', padding: '32px' }}>
            <button className="modal-close" onClick={() => setRedirectBook(null)}>×</button>
            
            <h3 style={{ fontSize: '22px', marginBottom: '12px' }}>Select Retailer Bookstore</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
              You are being redirected to purchase <strong>{redirectBook.title}</strong> by {redirectBook.authorName}. BookRumors does not process payments or handle shipping.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {redirectBook.purchaseLinks.amazon && (
                <a 
                  href={redirectBook.purchaseLinks.amazon} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ justifyContent: 'space-between', padding: '14px 20px', borderRadius: '12px' }}
                >
                  <span>Amazon Store</span>
                  <span>➔</span>
                </a>
              )}
              {redirectBook.purchaseLinks.appleBooks && (
                <a 
                  href={redirectBook.purchaseLinks.appleBooks} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ justifyContent: 'space-between', padding: '14px 20px', borderRadius: '12px' }}
                >
                  <span>Apple Books</span>
                  <span>➔</span>
                </a>
              )}
              {redirectBook.purchaseLinks.barnesNoble && (
                <a 
                  href={redirectBook.purchaseLinks.barnesNoble} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ justifyContent: 'space-between', padding: '14px 20px', borderRadius: '12px' }}
                >
                  <span>Barnes & Noble</span>
                  <span>➔</span>
                </a>
              )}
              {redirectBook.purchaseLinks.kobo && (
                <a 
                  href={redirectBook.purchaseLinks.kobo} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ justifyContent: 'space-between', padding: '14px 20px', borderRadius: '12px' }}
                >
                  <span>Kobo Bookstore</span>
                  <span>➔</span>
                </a>
              )}
              {redirectBook.purchaseLinks.publisherSite && (
                <a 
                  href={redirectBook.purchaseLinks.publisherSite} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ justifyContent: 'space-between', padding: '14px 20px', borderRadius: '12px' }}
                >
                  <span>Publisher Official Site</span>
                  <span>➔</span>
                </a>
              )}
            </div>

            <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '24px' }}>
              🔒 Secured link. Click to open vendor in a new tab.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading catalog...</p>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
