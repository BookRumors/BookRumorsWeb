'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppState } from '@/context/StateContext';
import { auth, googleProvider } from '@/firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { supabase } from '@/supabase';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { syncFirebaseUser } = useAppState();

  // URL Tab overrides
  const urlTab = searchParams.get('tab') || 'login';

  // Role Tab State: 'reader' | 'author'
  const [role, setRole] = useState<'reader' | 'author'>('reader');
  
  // Auth Form mode state (for reader/author): 'login' | 'register'
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Shared form fields
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Author-only registration fields
  const [regBio, setRegBio] = useState('');
  const [regImage, setRegImage] = useState('');



  // Auto-switch tabs based on URL params
  useEffect(() => {
    if (urlTab === 'register') {
      setMode('register');
      setRole('author'); // Default CTA is for Authors
    } else if (urlTab === 'login') {
      setMode('login');
    }
  }, [urlTab]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email) {
      setErrorMsg('Email address is required.');
      return;
    }

    if (mode === 'login') {
      // Login flow
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Secure Admin check: only if email is shubhk0121@gmail.com is role 'admin'
        let finalRole: 'reader' | 'author' | 'admin' = role;
        if (email.toLowerCase() === 'shubhk0121@gmail.com') {
          finalRole = 'admin';
        }

        const res = syncFirebaseUser(finalRole, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        });

        if (res.success) {
          if (finalRole === 'admin') {
            router.push('/admin');
          } else if (finalRole === 'author') {
            router.push('/dashboard');
          } else {
            router.push('/catalog');
          }
        } else {
          setErrorMsg(res.error || 'Login synchronization failed.');
        }
      } catch (error: any) {
        console.error('Login error:', error);
        
        // If credentials fail, check if the email address exists in the database
        try {
          const { data: authorData } = await supabase.from('br_authors').select('id').eq('email', email.toLowerCase());
          const { data: readerData } = await supabase.from('br_readers').select('id').eq('email', email.toLowerCase());
          const isRegistered = (authorData && authorData.length > 0) || (readerData && readerData.length > 0);
          const isAdmin = email.toLowerCase() === 'shubhk0121@gmail.com';
          
          if (!isRegistered && !isAdmin) {
            setErrorMsg('Account not found. Redirecting to registration page...');
            setTimeout(() => {
              setMode('register');
              setErrorMsg('');
            }, 1800);
            return;
          }
        } catch (dbErr) {
          console.error('DB account check failed:', dbErr);
        }

        if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          setErrorMsg('Invalid email or password credentials.');
        } else {
          setErrorMsg(error.message || 'An error occurred during sign-in.');
        }
      }
    } else {
      // Registration flow
      if (role === 'reader') {
        if (!name) {
          setErrorMsg('Name is required for registration.');
          return;
        }
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;

          // Update display name
          await updateProfile(user, { displayName: name });

          const res = syncFirebaseUser('reader', {
            uid: user.uid,
            displayName: name,
            email: user.email,
            photoURL: user.photoURL
          });

          if (res.success) {
            alert(`Welcome ${name}! Reader account registered successfully.`);
            router.push('/catalog');
          } else {
            setErrorMsg(res.error || 'Reader registration sync failed.');
          }
        } catch (error: any) {
          console.error('Reader registration error:', error);
          if (error.code === 'auth/email-already-in-use') {
            setErrorMsg('This email address is already registered.');
          } else {
            setErrorMsg(error.message || 'Failed to create reader account.');
          }
        }
      } else if (role === 'author') {
        if (!name || !password) {
          setErrorMsg('Name and password are required for authors.');
          return;
        }
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;

          // Update display name and save photoURL/bio sync
          await updateProfile(user, { 
            displayName: name,
            photoURL: regImage || null
          });

          const res = syncFirebaseUser('author', {
            uid: user.uid,
            displayName: name,
            email: user.email,
            photoURL: regImage || null
          }, {
            bio: regBio,
            profileImage: regImage
          });

          if (res.success) {
            alert(`Welcome ${name}! Author profile registered successfully.`);
            router.push('/dashboard');
          } else {
            setErrorMsg(res.error || 'Author registration sync failed.');
          }
        } catch (error: any) {
          console.error('Author registration error:', error);
          if (error.code === 'auth/email-already-in-use') {
            setErrorMsg('This email address is already registered.');
          } else {
            setErrorMsg(error.message || 'Failed to create author account.');
          }
        }
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const res = syncFirebaseUser(role as 'reader' | 'author', {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      });

      if (res.success) {
        if (role === 'author') {
          router.push('/dashboard');
        } else {
          router.push('/catalog');
        }
      } else {
        setErrorMsg(res.error || 'Google login failed.');
      }
    } catch (error: any) {
      console.error('Google Auth Error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Sign-in cancelled before completion.');
      } else if (error.code === 'auth/popup-blocked') {
        setErrorMsg('Pop-up blocker is enabled. Please allow pop-ups for Google login.');
      } else {
        setErrorMsg(error.message || 'An error occurred during Google authentication.');
      }
    }
  };

  return (
    <div style={{ background: 'var(--bg-cream)', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
      
      <div style={{ 
        background: 'var(--bg-white)', 
        border: '1px solid var(--border-light)', 
        borderRadius: 'var(--radius-lg)', 
        boxShadow: 'var(--shadow-lg)',
        maxWidth: '480px',
        width: '100%',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Toggle tabs at top */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-cream)' }}>
          <button
            onClick={() => { setRole('reader'); setMode('login'); setErrorMsg(''); }}
            style={{ 
              flex: 1, 
              padding: '16px', 
              border: 'none', 
              background: role === 'reader' ? 'var(--bg-white)' : 'transparent',
              color: role === 'reader' ? 'var(--primary)' : 'var(--text-muted)',
              fontFamily: 'Outfit',
              fontWeight: 'bold',
              fontSize: '15px',
              cursor: 'pointer',
              borderBottom: role === 'reader' ? '3px solid var(--primary)' : 'none'
            }}
          >
            Reader Access
          </button>
          <button
            onClick={() => { setRole('author'); setMode('login'); setErrorMsg(''); }}
            style={{ 
              flex: 1, 
              padding: '16px', 
              border: 'none', 
              background: role === 'author' ? 'var(--bg-white)' : 'transparent',
              color: role === 'author' ? 'var(--primary)' : 'var(--text-muted)',
              fontFamily: 'Outfit',
              fontWeight: 'bold',
              fontSize: '15px',
              cursor: 'pointer',
              borderBottom: role === 'author' ? '3px solid var(--primary)' : 'none'
            }}
          >
            Author & Publisher
          </button>
        </div>

        {/* Content body */}
        <div style={{ padding: '32px' }}>
          
          {/* Inner form sub-header (Login vs Register toggle) */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', fontSize: '14px', borderBottom: '1px dashed var(--border-light)', paddingBottom: '12px' }}>
            <span 
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              style={{ 
                cursor: 'pointer', 
                color: mode === 'login' ? 'var(--text-dark)' : 'var(--text-muted)', 
                fontWeight: mode === 'login' ? 'bold' : 'normal' 
              }}
            >
              Sign In
            </span>
            <span 
              onClick={() => { setMode('register'); setErrorMsg(''); }}
              style={{ 
                cursor: 'pointer', 
                color: mode === 'register' ? 'var(--text-dark)' : 'var(--text-muted)', 
                fontWeight: mode === 'register' ? 'bold' : 'normal' 
              }}
            >
              Register Account
            </span>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
            {role === 'reader' && (mode === 'login' ? 'Access your bookmarked bookshelf and write reviews.' : 'Join to save favorites, review books, and get updates.')}
            {role === 'author' && (mode === 'login' ? 'Sign in to access your publishing workspace.' : 'Register as a creator to publish, edit, and sponsor your books.')}
          </p>
          
          {errorMsg && (
            <div style={{ background: '#FFF0F2', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' }}>
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleAuthSubmit}>
            {/* Headers */}
            <h3 style={{ fontSize: '22px', marginBottom: '8px', fontFamily: 'Outfit' }}>
              {mode === 'login' ? 'Welcome Back!' : 'Create New Account'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>
              {role === 'reader' && (mode === 'login' ? 'Access your bookmarked bookshelf and write reviews.' : 'Join to save favorites, review books, and get updates.')}
              {role === 'author' && (mode === 'login' ? 'Access listing settings and marketing campaigns.' : 'Sign up to showcase your books to global retailers.')}
            </p>

            {/* Inputs: Name (For Register mode) */}
            {mode === 'register' && (
              <div className="form-group">
                <label>{role === 'reader' ? 'Username / Screen Name *' : 'Pen Name / Creator Name *'}</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            )}

            {/* Inputs: Email (All modes) */}
            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>

            {/* Inputs: Password (Required for all sign-ins) */}
            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>

            {/* Author-only registration fields */}
            {role === 'author' && mode === 'register' && (
              <>
                <div className="form-group">
                  <label>Brief Bio Summary</label>
                  <textarea
                    rows={3}
                    placeholder="Short professional writer bio..."
                    value={regBio}
                    onChange={(e) => setRegBio(e.target.value)}
                    className="form-textarea"
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Author Photo URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={regImage}
                    onChange={(e) => setRegImage(e.target.value)}
                    className="form-input"
                  />
                </div>
              </>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', borderRadius: '8px', marginTop: '12px' }}>
              {mode === 'login' ? 'Sign In' : 'Register Account'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: 'var(--text-muted)', fontSize: '12px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }}></div>
              <span style={{ padding: '0 12px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }}></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                background: 'var(--bg-white)',
                color: 'var(--text-dark)',
                fontFamily: 'Outfit',
                fontWeight: 'bold',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'var(--transition)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-cream)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--bg-white)';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84c-.21 1.12-.84 2.07-1.79 2.7v2.24h2.9c1.69-1.55 2.69-3.85 2.69-6.57z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.23l-2.9-2.24c-.8.54-1.84.87-3.06.87-2.35 0-4.34-1.58-5.05-3.71H.95v2.3C2.43 15.89 5.5 18 9 18z"/>
                <path fill="#FBBC05" d="M3.95 10.69A5.4 5.4 0 0 1 3.6 9c0-.59.1-1.17.29-1.69V5.01H.95A8.99 8.99 0 0 0 0 9c0 1.45.35 2.82.95 4.01l3-2.32z"/>
                <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.47.89 11.43 0 9 0 5.5 0 2.43 2.11.95 5.01l3 2.32C4.66 5.17 6.65 3.58 9 3.58z"/>
              </svg>
              {mode === 'login' ? 'Continue with Google' : 'Sign up with Google'}
            </button>
          </form>

          {/* Footer area */}
          <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-light)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span>BookRumors Marketing System</span>
            <span>Secure Enterprise Login</span>
          </div>

        </div>
      </div>
      
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading Authentication...</p>
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}
