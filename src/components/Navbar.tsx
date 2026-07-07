'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppState } from '../context/StateContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useAppState();

  const [navSearch, setNavSearch] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<'discover' | 'categories' | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTriggerMouseEnter = (dropdown: 'discover' | 'categories') => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(dropdown);
  };

  const handleTriggerMouseLeave = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 1500); // 1.5 seconds delay to allow transition across gap space
  };

  const handleContentMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleContentMouseLeave = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(null); // Close instantly when mouse leaves dropdown content
  };

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const handleNavSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearch.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch('');
    }
  };

  return (
    <header className="navbar no-print" style={{ boxShadow: 'var(--shadow-sm)' }}>
      <div className="container nav-container">
        {/* Logo */}
        <Link href="/" className="logo">
          BOOK<span style={{ color: 'var(--primary)' }}>RUMORS</span>
        </Link>

        {/* Navigation Links */}
        <nav>
          <ul className="nav-links" style={{ alignItems: 'center' }}>
            {/* Discover Books Dropdown */}
            <li 
              className="nav-dropdown"
              onMouseEnter={() => handleTriggerMouseEnter('discover')}
              onMouseLeave={handleTriggerMouseLeave}
            >
              <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Discover Books <span style={{ fontSize: '10px' }}>▼</span>
              </span>
              <div 
                className={`nav-dropdown-content ${activeDropdown === 'discover' ? 'show-dropdown' : ''}`}
                onMouseEnter={handleContentMouseEnter}
                onMouseLeave={handleContentMouseLeave}
              >
                <Link href="/catalog">Browse all books</Link>
                <Link href="/catalog?filter=featured">Featured books</Link>
                <Link href="/catalog?filter=new">New releases</Link>
                <Link href="/catalog?filter=trending">Trending books</Link>
              </div>
            </li>

            {/* Categories Dropdown */}
            <li 
              className="nav-dropdown"
              onMouseEnter={() => handleTriggerMouseEnter('categories')}
              onMouseLeave={handleTriggerMouseLeave}
            >
              <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Categories <span style={{ fontSize: '10px' }}>▼</span>
              </span>
              <div 
                className={`nav-dropdown-content ${activeDropdown === 'categories' ? 'show-dropdown' : ''}`}
                onMouseEnter={handleContentMouseEnter}
                onMouseLeave={handleContentMouseLeave}
              >
                <Link href="/catalog?category=fiction">Fiction</Link>
                <Link href="/catalog?category=romantic">Romance</Link>
                <Link href="/catalog?category=fiction">Fantasy</Link>
                <Link href="/catalog?category=business">Business</Link>
                <Link href="/catalog?category=self-help">Self-help</Link>
                <Link href="/catalog?category=biography">Biography</Link>
                <Link href="/catalog?category=fiction">Technology</Link>
              </div>
            </li>

            {/* For Authors */}
            <li>
              <Link href="/authors-info" className={pathname === '/authors-info' ? 'active' : ''}>
                For Authors
              </Link>
            </li>

            {/* Pricing */}
            <li>
              <Link href="/pricing" className={pathname === '/pricing' ? 'active' : ''}>
                Pricing
              </Link>
            </li>

            {/* About */}
            <li>
              <Link href="/about" className={pathname === '/about' ? 'active' : ''}>
                About
              </Link>
            </li>

            {/* Contact */}
            <li>
              <Link href="/contact" className={pathname === '/contact' ? 'active' : ''}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Auth Action / Profile */}
        <div className="nav-actions">
          {/* Mini Search Widget */}
          <form onSubmit={handleNavSearchSubmit} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            background: 'var(--bg-cream)', 
            borderRadius: '100px', 
            border: '1px solid var(--border-light)', 
            padding: '4px 10px', 
            maxWidth: '180px' 
          }}>
            <input
              type="text"
              placeholder="Search..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              style={{ border: 'none', background: 'transparent', width: '110px', fontSize: '12px', outline: 'none' }}
            />
            <button type="submit" style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '12px', padding: 0 }}>🔍</button>
          </form>

          {/* Bookmark shortcut */}
          <Link href="/catalog?favorites=true" title="Saved Books" style={{ fontSize: '18px', color: 'var(--text-dark)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            ❤️
          </Link>
          
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ textAlign: 'right', fontSize: '12px' }}>
                <span style={{ display: 'block', fontWeight: 'bold', color: 'var(--text-dark)' }}>{currentUser.name}</span>
                <span style={{ color: 'var(--primary)', fontWeight: '600', textTransform: 'capitalize' }}>
                  {currentUser.role}
                </span>
              </div>
              <button 
                onClick={() => { logout(); router.push('/'); }} 
                className="btn btn-secondary" 
                style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '8px' }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link 
                href="/auth?tab=login" 
                className="btn btn-secondary"
                style={{ padding: '6px 14px', borderRadius: '100px', fontSize: '12px' }}
              >
                Sign In
              </Link>
              <Link 
                href="/auth?tab=register" 
                className="btn btn-primary" 
                style={{ padding: '6px 16px', borderRadius: '100px', fontSize: '12px' }}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
export default Navbar;
