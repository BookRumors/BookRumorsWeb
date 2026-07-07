'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppState } from '../context/StateContext';
import { Book, INITIAL_AUTHORS } from '../mockData';

interface GenreCarouselProps {
  title: string;
  books: Book[];
  genreId: string;
  onBookClick: (id: string) => void;
  onBuyNow: (e: React.MouseEvent, book: Book) => void;
}

const GenreCarousel: React.FC<GenreCarouselProps> = ({ title, books, genreId, onBookClick, onBuyNow }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = 300 * 2; // scroll by about 2 cards
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (books.length === 0) return null;

  return (
    <div style={{ marginBottom: '56px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '26px', fontFamily: 'Outfit', fontWeight: 'bold' }}>{title}</h3>
        
        {/* Carousel buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => scroll('left')}
            style={{ 
              background: 'var(--bg-white)', 
              border: '1px solid var(--border-light)', 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)',
              fontSize: '14px',
              transition: 'var(--transition)'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.color = 'var(--text-dark)'; }}
          >
            ◀
          </button>
          <button 
            onClick={() => scroll('right')}
            style={{ 
              background: 'var(--bg-white)', 
              border: '1px solid var(--border-light)', 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)',
              fontSize: '14px',
              transition: 'var(--transition)'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.color = 'var(--text-dark)'; }}
          >
            ▶
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        style={{ 
          display: 'flex', 
          gap: '24px', 
          overflowX: 'auto', 
          scrollBehavior: 'smooth',
          paddingBottom: '16px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
        className="hide-scrollbar"
      >
        {books.map(book => (
          <div 
            key={book.id} 
            onClick={() => onBookClick(book.id)}
            style={{ 
              flexShrink: 0, 
              width: '230px',
              cursor: 'pointer'
            }}
          >
            <div className="book-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="book-card-img-wrapper">
                  <Image src={book.coverUrl} className="book-card-img" alt={book.title} width={240} height={320} style={{ objectFit: 'cover' }} />
                </div>
                <div className="book-card-info" style={{ padding: '16px 0 0 0' }}>
                  <span className="book-card-genre" style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '11px', textTransform: 'uppercase' }}>
                    {book.genre}
                  </span>
                  <h4 className="book-card-title" style={{ fontSize: '15px', margin: '4px 0', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {book.title}
                  </h4>
                  <p className="book-card-author" style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 12px 0' }}>
                    {book.authorName}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '12px', marginTop: '12px' }}>
                <span style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-dark)' }}>${book.price.toFixed(2)}</span>
                <button 
                  onClick={(e) => onBuyNow(e, book)} 
                  className="btn btn-primary" 
                  style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '6px' }}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function HomePage() {
  const router = useRouter();
  const { books, authors } = useAppState();

  // Left & Right index for Author Carousel collage
  const [leftIndex, setLeftIndex] = useState(0);
  const [rightIndex, setRightIndex] = useState(0);

  const activeAuthors = authors.length > 0 ? authors : INITIAL_AUTHORS;
  const leftAuthors = activeAuthors.filter((_, idx) => idx % 2 === 0);
  const rightAuthors = activeAuthors.filter((_, idx) => idx % 2 === 1);

  useEffect(() => {
    if (leftAuthors.length === 0 || rightAuthors.length === 0) return;
    const interval = setInterval(() => {
      setLeftIndex(prev => (prev + 1) % leftAuthors.length);
      setRightIndex(prev => (prev + 1) % rightAuthors.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [leftAuthors.length, rightAuthors.length]);

  const currentLeftAuthor = leftAuthors[leftIndex];
  const currentRightAuthor = rightAuthors[rightIndex];

  // Redirection Modal State
  const [redirectBook, setRedirectBook] = useState<Book | null>(null);

  // Group books by categories/roles
  const heroBooks = books.filter(b => ['book-1', 'book-2', 'book-3', 'book-4'].includes(b.id) && b.status === 'approved');
  const topBook = books.find(b => b.isTopBook && b.status === 'approved') || books[0];
  const rowlingBooks = books.filter(b => ['book-author-rowling-1', 'book-author-rowling-2', 'book-author-rowling-3'].includes(b.id) && b.status === 'approved');
  const featureBooks = books.filter(b => ['book-feat-1', 'book-feat-2', 'book-feat-3', 'book-5'].includes(b.id) && b.status === 'approved');

  // Filter books by major genres
  const fictionBooks = books.filter(b => b.genre.toLowerCase() === 'fiction' && b.status === 'approved');
  const romanceBooks = books.filter(b => b.genre.toLowerCase() === 'romantic' && b.status === 'approved');
  const businessBooks = books.filter(b => b.genre.toLowerCase() === 'business' && b.status === 'approved');
  const biographyBooks = books.filter(b => b.genre.toLowerCase() === 'biography' && b.status === 'approved');

  const handleBuyNow = (e: React.MouseEvent, book: Book) => {
    e.preventDefault();
    e.stopPropagation();
    setRedirectBook(book);
  };

  return (
    <div style={{ background: 'var(--bg-cream)', paddingBottom: '40px' }}>
      
      {/* 1. HERO SECTION */}
      <section className="section-padding" style={{ paddingBottom: '40px', position: 'relative', overflow: 'hidden' }}>
        {/* Background Decorative Shapes */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: '#FFF0F2', zIndex: 0 }}></div>
        <div style={{ position: 'absolute', bottom: '0', left: '-5%', width: '300px', height: '300px', borderRadius: '50%', background: '#FFF0F2', opacity: 0.5, zIndex: 0 }}></div>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '48px', alignItems: 'center' }}>
            
            {/* Hero Left Content */}
            <div>
              <h1 style={{ fontSize: '64px', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-1px' }}>
                Books <br />
                <span className="highlight-text" style={{ 
                  color: 'var(--primary)', 
                  borderBottom: '4px solid var(--primary-light-hover)',
                  paddingBottom: '4px'
                }}>For All</span>
              </h1>
              <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '36px', maxWidth: '450px', lineHeight: '1.6' }}>
                Discover your next favorite book from our extensive collection.
              </p>

              {/* Call to Action Buttons */}
              <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                <button 
                  onClick={() => router.push('/catalog')} 
                  className="btn btn-primary" 
                  style={{ padding: '12px 32px', borderRadius: '100px', fontSize: '15px' }}
                >
                  Explore Book Catalog ➔
                </button>
                <button 
                  onClick={() => router.push('/auth?tab=register')} 
                  className="btn btn-secondary" 
                  style={{ padding: '12px 32px', borderRadius: '100px', fontSize: '15px' }}
                >
                  Publish With Us
                </button>
              </div>

              {/* Horizontal Slider Books Preview */}
              <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '10px' }}>
                {heroBooks.map(book => (
                  <div 
                    key={book.id}
                    onClick={() => router.push(`/book/${book.id}`)}
                    style={{ 
                      display: 'flex', 
                      gap: '12px', 
                      background: 'var(--bg-white)', 
                      padding: '12px', 
                      borderRadius: 'var(--radius-sm)', 
                      border: '1px solid var(--border-light)', 
                      minWidth: '220px',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-light)'; }}
                  >
                    <Image src={book.coverUrl} alt={book.title} width={45} height={60} style={{ objectFit: 'cover', borderRadius: '4px' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-dark)', lineHeight: '1.2' }}>{book.title}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 4px 0' }}>{book.authorName}</span>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)' }}>${book.price.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Right Visuals (Collage of cycling authors) */}
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', position: 'relative' }}>
              {/* Floating symbols */}
              <div style={{ position: 'absolute', top: '20px', right: '40px', fontSize: '32px', color: 'var(--primary)', opacity: 0.6 }}>📦</div>
              <div style={{ position: 'absolute', bottom: '80px', left: '0px', fontSize: '40px', color: 'var(--primary)', transform: 'rotate(-15deg)', opacity: 0.5 }}>↗️</div>

              {/* Left Author (Arch shape overlay) */}
              <div style={{ 
                width: '180px', 
                height: '260px', 
                borderRadius: '100px 100px 0 0', 
                background: 'var(--primary-light)',
                border: '4px solid var(--bg-white)',
                boxShadow: 'var(--shadow-md)',
                overflow: 'hidden',
                alignSelf: 'flex-start',
                marginTop: '40px',
                position: 'relative'
              }}>
                {currentLeftAuthor && (
                  <div key={currentLeftAuthor.id} className="carousel-fade" style={{ width: '100%', height: '100%' }}>
                    <img 
                      src={currentLeftAuthor.profileImage} 
                      alt={currentLeftAuthor.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: '0',
                      left: '0',
                      right: '0',
                      background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.85))',
                      padding: '16px 12px 12px 12px',
                      color: '#fff',
                      textAlign: 'center'
                    }}>
                      <span style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', fontFamily: 'Outfit', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                        {currentLeftAuthor.name}
                      </span>
                      <span style={{ fontSize: '9px', color: '#ffc1cc', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px', fontWeight: '600' }}>
                        Featured Author
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Author (Beanbag circle overlay) */}
              <div style={{ 
                width: '220px', 
                height: '320px', 
                borderRadius: '150px 150px 50px 50px',
                background: '#FFE0E5',
                border: '4px solid var(--bg-white)',
                boxShadow: 'var(--shadow-lg)',
                overflow: 'hidden',
                position: 'relative'
              }}>
                {currentRightAuthor && (
                  <div key={currentRightAuthor.id} className="carousel-fade" style={{ width: '100%', height: '100%' }}>
                    <img 
                      src={currentRightAuthor.profileImage} 
                      alt={currentRightAuthor.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: '0',
                      left: '0',
                      right: '0',
                      background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.85))',
                      padding: '20px 16px 16px 16px',
                      color: '#fff',
                      textAlign: 'center'
                    }}>
                      <span style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', fontFamily: 'Outfit', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                        {currentRightAuthor.name}
                      </span>
                      <span style={{ fontSize: '9px', color: '#ffc1cc', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px', fontWeight: '600' }}>
                        Featured Author
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURES RIBBON */}
      <section className="features-ribbon">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon-wrapper">🔗</div>
              <span className="feature-title">Direct Retail Links</span>
            </div>

            <div className="feature-item">
              <div className="feature-icon-wrapper">📄</div>
              <span className="feature-title">Chapter Previews</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon-wrapper">🎬</div>
              <span className="feature-title">Video Trailers</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon-wrapper">🎯</div>
              <span className="feature-title">Targeted Clicks</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHAT WE DO (Marketing Hub Explainer) */}
      <section className="section-padding" style={{ background: 'var(--bg-white)', borderRadius: 'var(--radius-xl)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="highlight-bg" style={{ fontSize: '11px', fontWeight: 'bold' }}>HOW IT WORKS</span>
            <h2 style={{ fontSize: '36px', fontFamily: 'Outfit', marginTop: '12px' }}>
              What We Do at <span style={{ color: 'var(--primary)' }}>BookRumors</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '600px', margin: '12px auto 0 auto' }}>
              We are a dedicated showcase directory helping independent writers connect with audiences. We redirect readers directly to your preferred retailer stores.
            </p>
          </div>

          <div className="grid-3">
            <div style={{ background: 'var(--bg-cream)', padding: '32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>📖</div>
              <h3 style={{ fontSize: '18px', marginBottom: '12px', fontFamily: 'Outfit' }}>Discover & Preview</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
                Readers search our aesthetic library, filter by genre, and preview sample chapters or watch book trailers before making decisions.
              </p>
            </div>

            <div style={{ background: 'var(--bg-cream)', padding: '32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>🛒</div>
              <h3 style={{ fontSize: '18px', marginBottom: '12px', fontFamily: 'Outfit' }}>Retailer Redirection</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
                Once readers click "Buy Now", they choose their preferred retailer (Amazon, Kobo, Apple Books, B&N) to finalize the purchase.
              </p>
            </div>

            <div style={{ background: 'var(--bg-cream)', padding: '32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>🚀</div>
              <h3 style={{ fontSize: '18px', marginBottom: '12px', fontFamily: 'Outfit' }}>Direct Audience Reach</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
                Authors pay a flat subscription to host their book campaigns. Reach new audiences and drive active clicks directly to your store.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. GENRE BESTSELLERS SECTION */}
      <section className="section-padding">
        <div className="container">
          <GenreCarousel 
            title="Fiction Bestsellers" 
            books={fictionBooks} 
            genreId="fiction" 
            onBookClick={(id) => router.push(`/book/${id}`)} 
            onBuyNow={handleBuyNow} 
          />
          <GenreCarousel 
            title="Romance Reads" 
            books={romanceBooks} 
            genreId="romantic" 
            onBookClick={(id) => router.push(`/book/${id}`)} 
            onBuyNow={handleBuyNow} 
          />
          <GenreCarousel 
            title="Business & Strategy" 
            books={businessBooks} 
            genreId="business" 
            onBookClick={(id) => router.push(`/book/${id}`)} 
            onBuyNow={handleBuyNow} 
          />
          <GenreCarousel 
            title="Biography & Memoirs" 
            books={biographyBooks} 
            genreId="biography" 
            onBookClick={(id) => router.push(`/book/${id}`)} 
            onBuyNow={handleBuyNow} 
          />
        </div>
      </section>

      {/* 5. TOP BOOKS SPOTLIGHT (Win-Win Strategy) */}
      <section className="section-padding" style={{ background: 'var(--bg-white)' }}>
        <div className="container">
          <h2 style={{ fontSize: '32px', fontFamily: 'Outfit', marginBottom: '40px' }}>
            Top <span style={{ color: 'var(--primary)' }}>Books</span>
          </h2>

          {topBook && (
            <div 
              onClick={() => router.push(`/book/${topBook.id}`)}
              style={{ 
                display: 'grid', 
                gridTemplateColumns: '1.2fr 2fr', 
                gap: '48px', 
                alignItems: 'center',
                background: 'var(--bg-cream)',
                padding: '40px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-light)'; }}
            >
              {/* Book Cover Visual with 3D Effect */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ 
                  boxShadow: '20px 20px 40px rgba(0,0,0,0.15)', 
                  borderRadius: 'var(--radius-sm)', 
                  overflow: 'hidden',
                  maxWidth: '240px',
                  position: 'relative',
                  width: '240px',
                  height: '320px'
                }}>
                  <Image src={topBook.coverUrl} alt={topBook.title} fill style={{ objectFit: 'cover' }} priority />
                </div>
              </div>

              {/* Book Info */}
              <div>
                <span className="highlight-bg" style={{ fontSize: '12px', fontWeight: 'bold' }}>RECOMMENDED BY ADMIN</span>
                <h3 style={{ fontSize: '36px', marginTop: '16px', marginBottom: '8px' }}>{topBook.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
                  {topBook.subtitle}
                </p>
                <p style={{ fontSize: '15px', color: 'var(--text-dark)', lineHeight: '1.7', marginBottom: '24px', opacity: 0.9 }}>
                  {topBook.summary}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <span style={{ fontSize: '28px', fontWeight: '800', color: 'var(--primary)' }}>
                    ${topBook.price.toFixed(2)}
                  </span>
                  <button onClick={(e) => handleBuyNow(e, topBook)} className="btn btn-primary" style={{ padding: '12px 36px', borderRadius: '100px' }}>
                    Buy Now 🛒
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6. FIND MORE CATEGORY */}
      <section className="section-padding">
        <div className="container">
          <h2 style={{ fontSize: '32px', fontFamily: 'Outfit', marginBottom: '32px', textAlign: 'center' }}>
            Find More <span style={{ color: 'var(--primary)' }}>Category</span>
          </h2>

          <div className="grid-4">
            {[
              { id: 'biography', name: 'Biography', icon: '👤' },
              { id: 'business', name: 'Business', icon: '💼' },
              { id: 'romantic', name: 'Romantic', icon: '💖' },
              { id: 'cookbooks', name: 'Cookbooks', icon: '🍳' }
            ].map(cat => (
              <div 
                key={cat.id}
                onClick={() => router.push(`/catalog?category=${cat.id}`)}
                style={{ 
                  background: 'var(--bg-white)', 
                  padding: '24px', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--border-light)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.borderColor = 'var(--border-light)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{cat.icon}</div>
                <h4 style={{ fontSize: '16px' }}>{cat.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BEST-SELLING AUTHOR SHOWCASE (J.K. ROWLING) */}
      <section className="section-padding" style={{ background: 'var(--bg-white)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '60px', alignItems: 'center' }}>
            
            {/* Left side Rowling Books list */}
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7', marginBottom: '32px' }}>
                Are you a published author or independent publisher looking to advertise? List your work on BookRumors. Select an ad plan, gain immediate exposure to thousands of active bookworms, and track click-through engagement directly to your store page.
              </p>

              <div className="grid-3">
                {rowlingBooks.map(book => (
                  <div key={book.id} onClick={() => router.push(`/book/${book.id}`)} style={{ cursor: 'pointer' }}>
                    <div className="book-card" style={{ padding: '12px' }}>
                      <div className="book-card-img-wrapper" style={{ margin: '0 0 12px 0' }}>
                        <Image src={book.coverUrl} className="book-card-img" alt={book.title} width={240} height={320} style={{ objectFit: 'cover' }} />
                      </div>
                      <h4 style={{ fontSize: '14px', margin: '0 0 4px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.title}</h4>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)' }}>${book.price.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side Profile Highlight */}
            <div style={{ 
              background: '#FFF0F2', 
              borderRadius: 'var(--radius-xl)', 
              padding: '40px',
              textAlign: 'center',
              border: '1px solid var(--border-light)',
              position: 'relative'
            }}>
                <div style={{ 
                  width: '120px', 
                  height: '120px', 
                  borderRadius: '50%', 
                  overflow: 'hidden', 
                  margin: '0 auto 20px auto',
                  border: '4px solid var(--bg-white)',
                  boxShadow: 'var(--shadow-md)',
                  position: 'relative'
                }}>
                  <Image src="/authors/jkrowling.jpg" alt="Rowling" fill style={{ objectFit: 'cover' }} />
                </div>
              <h3 style={{ fontSize: '28px', color: 'var(--primary)', marginBottom: '8px' }}>J. K. Rowling</h3>
              <p style={{ fontWeight: 'bold', fontSize: '14px', color: 'var(--text-dark)', marginBottom: '16px' }}>Author Best Selling</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px', lineHeight: '1.6', marginBottom: '24px' }}>
                Categories: Books, Novels, Fiction, Audiobooks
              </p>
              <button onClick={() => router.push('/catalog?search=Rowling')} className="btn btn-primary" style={{ padding: '10px 28px', borderRadius: '100px' }}>
                See More ➔
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 8. FEATURE BOOKS SECTION */}
      <section className="section-padding">
        <div className="container">
          <h2 style={{ fontSize: '32px', fontFamily: 'Outfit', marginBottom: '40px', textAlign: 'center' }}>
            Feature <span style={{ color: 'var(--primary)' }}>Books</span>
          </h2>

          <div className="grid-4">
            {featureBooks.map(book => (
              <div key={book.id} onClick={() => router.push(`/book/${book.id}`)} style={{ cursor: 'pointer' }}>
                <div className="book-card">
                  <div className="book-card-img-wrapper">
                    <Image src={book.coverUrl} className="book-card-img" alt={book.title} width={240} height={320} style={{ objectFit: 'cover' }} />
                  </div>
                  <div className="book-card-info">
                    <span className="book-card-genre">{book.genre}</span>
                    <h4 className="book-card-title">{book.title}</h4>
                    <p className="book-card-author">{book.authorName}</p>
                    <div className="book-card-footer">
                      <span className="book-card-price">${book.price.toFixed(2)}</span>
                      <button onClick={(e) => handleBuyNow(e, book)} className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '11px', borderRadius: '6px' }}>
                        Buy Now 🛒
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
