'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Book,
  Category,
  Author,
  Review,
  Subscription,
  Transaction,
  Notification,
  Newsletter,
  INITIAL_BOOKS,
  INITIAL_CATEGORIES,
  INITIAL_AUTHORS,
  INITIAL_REVIEWS,
  SUBSCRIPTION_PLANS,
  ADMIN_CREDENTIALS
} from '../mockData';
import { supabase } from '../supabase';

interface StateContextType {
  books: Book[];
  categories: Category[];
  authors: Author[];
  reviews: Review[];
  transactions: Transaction[];
  notifications: Notification[];
  newsletters: Newsletter[];
  newsletterSubscribers: string[];
  currentUser: { id: string; name: string; email: string; role: 'reader' | 'author' | 'admin' } | null;
  activePlan: string | null; // For the logged-in author: plan ID
  isLoading: boolean;
  
  // Auth Functions
  login: (email: string, pass: string) => { success: boolean; error?: string };
  syncFirebaseUser: (role: 'reader' | 'author' | 'admin', firebaseUser: { uid: string; displayName: string | null; email: string | null; photoURL: string | null }, authorProfile?: { bio: string; profileImage: string }) => { success: boolean; error?: string };
  logout: () => void;
  registerAuthor: (data: { name: string; email: string; bio: string; profileImage: string }) => { success: boolean; verificationCode: string };
  registerReader: (name: string, email: string) => { success: boolean; error?: string };
  verifyEmailCode: (email: string, code: string) => { success: boolean; error?: string };
  
  // Book Actions
  addBook: (book: Omit<Book, 'id' | 'authorId' | 'authorName' | 'rating' | 'views' | 'purchaseClicks' | 'status'>) => void;
  updateBook: (id: string, book: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  incrementBookView: (id: string) => void;
  incrementBookClick: (id: string) => void;
  addReview: (bookId: string, rating: number, comment: string, userName: string) => void;
  
  // Admin Actions
  approveAuthor: (id: string) => void;
  rejectAuthor: (id: string) => void;
  approveBook: (id: string) => void;
  rejectBook: (id: string, reason: string) => void;
  addCategory: (name: string, icon: string) => void;
  updateCategory: (id: string, name: string, icon: string) => void;
  deleteCategory: (id: string) => void;
  sendNewsletter: (subject: string, content: string) => void;
  
  // User Actions
  subscribeNewsletter: (email: string) => { success: boolean; message: string };
  processPayment: (planId: string, method: 'Stripe' | 'Razorpay' | 'PayPal', cardInfo: any) => Promise<boolean>;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

const DEFAULT_TRANSACTIONS: Transaction[] = [];

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: 'not-1',
    userId: 'author-jkrowling',
    title: 'Subscription Active',
    message: 'Your Elite Publisher Plan was successfully renewed.',
    date: '2026-06-01 10:31',
    read: false
  },
  {
    id: 'not-2',
    userId: 'admin',
    title: 'New Book Submission',
    message: 'Author J. K. Rowling uploaded a new draft: The 5 AM Club.',
    date: '2026-06-25 16:40',
    read: false
  }
];

const DEFAULT_NEWSLETTERS: Newsletter[] = [
  {
    id: 'news-1',
    subject: 'Summer Book Recommendations!',
    content: 'Discover our top picks for the hot summer months, including the trending bestseller The Midnight Library!',
    dateSent: '2026-06-10',
    subscribersCount: 3,
    clicksCount: 15,
    status: 'sent'
  }
];

const DEFAULT_SUBSCRIBERS = [
  'reader1@gmail.com', 'bookworm@yahoo.com', 'johndoe@outlook.com'
];

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<string[]>([]);
  const [readers, setReaders] = useState<{ id: string; name: string; email: string }[]>([]);
  const [currentUser, setCurrentUser] = useState<StateContextType['currentUser']>(null);
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load state from Supabase and seed if tables are empty
  useEffect(() => {
    const loadAndSeedData = async () => {
      try {
        setIsLoading(true);

        // 1. Categories
        let { data: catData, error: catError } = await supabase.from('br_categories').select('*');
        if (catError) console.error('Error fetching categories:', catError);
        if (!catData || catData.length === 0) {
          const categoriesToSeed = INITIAL_CATEGORIES.map(c => ({
            id: c.id,
            name: c.name,
            icon: c.icon,
            count: c.count || 0
          }));
          const { error: seedError } = await supabase.from('br_categories').insert(categoriesToSeed);
          if (seedError) console.error('Error seeding categories:', seedError);
          catData = INITIAL_CATEGORIES;
        }
        setCategories(catData || INITIAL_CATEGORIES);

        // 2. Authors
        let { data: authData, error: authError } = await supabase.from('br_authors').select('*');
        if (authError) console.error('Error fetching authors:', authError);
        if (!authData || authData.length === 0) {
          const authorsToSeed = INITIAL_AUTHORS.map(a => ({
            id: a.id,
            name: a.name,
            email: a.email,
            bio: a.bio || '',
            profileImage: a.profileImage || '',
            isVerified: a.isVerified || false,
            verificationStatus: a.verificationStatus || 'unverified',
            joinDate: a.joinDate || new Date().toISOString().split('T')[0]
          }));
          const { error: seedError } = await supabase.from('br_authors').insert(authorsToSeed);
          if (seedError) console.error('Error seeding authors:', seedError);
          authData = INITIAL_AUTHORS;
        }
        setAuthors(authData || INITIAL_AUTHORS);

        // 3. Books (Depends on Authors)
        let { data: bookData, error: bookError } = await supabase.from('br_books').select('*');
        if (bookError) console.error('Error fetching books:', bookError);
        if (!bookData || bookData.length === 0) {
          const booksToSeed = INITIAL_BOOKS.map(b => ({
            id: b.id,
            title: b.title,
            subtitle: b.subtitle || null,
            authorId: b.authorId,
            authorName: b.authorName,
            publisher: b.publisher,
            publishDate: b.publishDate,
            isbn: b.isbn,
            language: b.language,
            genre: b.genre,
            price: b.price || 0.0,
            originalPrice: b.originalPrice || null,
            summary: b.summary || '',
            coverUrl: b.coverUrl || '',
            galleryUrls: b.galleryUrls || [],
            purchaseLinks: b.purchaseLinks || {},
            keywords: b.keywords || [],
            targetAudience: b.targetAudience || null,
            sampleChapter: b.sampleChapter || null,
            trailerUrl: b.trailerUrl || null,
            rating: b.rating || 0.0,
            views: b.views || 0,
            purchaseClicks: b.purchaseClicks || 0,
            isFeatured: b.isFeatured || false,
            isTopBook: b.isTopBook || false,
            isNewAdded: b.isNewAdded || false,
            isTrending: b.isTrending || false,
            status: b.status || 'pending',
            rejectionReason: b.rejectionReason || null
          }));
          const { error: seedError } = await supabase.from('br_books').insert(booksToSeed);
          if (seedError) console.error('Error seeding books:', seedError);
          bookData = INITIAL_BOOKS;
        }
        setBooks(bookData || INITIAL_BOOKS);

        // 4. Reviews (Depends on Books)
        let { data: revData, error: revError } = await supabase.from('br_reviews').select('*');
        if (revError) console.error('Error fetching reviews:', revError);
        if (!revData || revData.length === 0) {
          const reviewsToSeed = INITIAL_REVIEWS.map(r => ({
            id: r.id,
            bookId: r.bookId,
            userName: r.userName,
            rating: r.rating || 0.0,
            comment: r.comment || '',
            date: r.date || new Date().toISOString().split('T')[0]
          }));
          const { error: seedError } = await supabase.from('br_reviews').insert(reviewsToSeed);
          if (seedError) console.error('Error seeding reviews:', seedError);
          revData = INITIAL_REVIEWS;
        }
        setReviews(revData || INITIAL_REVIEWS);

        // 5. Transactions
        let { data: txData, error: txError } = await supabase.from('br_transactions').select('*');
        if (txError) console.error('Error fetching transactions:', txError);
        if (!txData || txData.length === 0) {
          const transactionsToSeed = DEFAULT_TRANSACTIONS.map(t => ({
            id: t.id,
            authorId: t.authorId,
            authorName: t.authorName,
            planName: t.planName,
            amount: t.amount || 0.0,
            paymentMethod: t.paymentMethod,
            transactionId: t.transactionId,
            date: t.date,
            status: t.status || 'success',
            invoiceNumber: t.invoiceNumber
          }));
          const { error: seedError } = await supabase.from('br_transactions').insert(transactionsToSeed);
          if (seedError) console.error('Error seeding transactions:', seedError);
          txData = DEFAULT_TRANSACTIONS;
        }
        setTransactions(txData || DEFAULT_TRANSACTIONS);

        // 6. Notifications
        let { data: notData, error: notError } = await supabase.from('br_notifications').select('*');
        if (notError) console.error('Error fetching notifications:', notError);
        if (!notData || notData.length === 0) {
          const notificationsToSeed = DEFAULT_NOTIFICATIONS.map(n => ({
            id: n.id,
            userId: n.userId,
            title: n.title,
            message: n.message,
            date: n.date,
            read: n.read || false
          }));
          const { error: seedError } = await supabase.from('br_notifications').insert(notificationsToSeed);
          if (seedError) console.error('Error seeding notifications:', seedError);
          notData = DEFAULT_NOTIFICATIONS;
        }
        setNotifications(notData || DEFAULT_NOTIFICATIONS);

        // 7. Newsletters
        let { data: newsData, error: newsError } = await supabase.from('br_newsletters').select('*');
        if (newsError) console.error('Error fetching newsletters:', newsError);
        if (!newsData || newsData.length === 0) {
          const newslettersToSeed = DEFAULT_NEWSLETTERS.map(n => ({
            id: n.id,
            subject: n.subject,
            content: n.content,
            dateSent: n.dateSent,
            subscribersCount: n.subscribersCount || 0,
            clicksCount: n.clicksCount || 0,
            status: n.status || 'draft'
          }));
          const { error: seedError } = await supabase.from('br_newsletters').insert(newslettersToSeed);
          if (seedError) console.error('Error seeding newsletters:', seedError);
          newsData = DEFAULT_NEWSLETTERS;
        }
        setNewsletters(newsData || DEFAULT_NEWSLETTERS);

        // 8. Subscribers
        let { data: subData, error: subError } = await supabase.from('br_subscribers').select('email');
        if (subError) console.error('Error fetching subscribers:', subError);
        if (!subData || subData.length === 0) {
          const { error: seedError } = await supabase.from('br_subscribers').insert(DEFAULT_SUBSCRIBERS.map(email => ({ email })));
          if (seedError) console.error('Error seeding subscribers:', seedError);
          setNewsletterSubscribers(DEFAULT_SUBSCRIBERS);
        } else {
          setNewsletterSubscribers(subData.map(s => s.email));
        }

        // 9. Readers
        let { data: readerData, error: readerError } = await supabase.from('br_readers').select('*');
        if (readerError) console.error('Error fetching readers:', readerError);
        setReaders(readerData || []);

        // Load active session user and plan from localStorage (transient states)
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem('br_user');
          const storedPlan = localStorage.getItem('br_plan');
          if (storedUser) setCurrentUser(JSON.parse(storedUser));
          if (storedPlan) setActivePlan(storedPlan);
        }
      } catch (err) {
        console.error('Fatal loadAndSeedData error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAndSeedData();
  }, []);

  // Save session states to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      if (currentUser) {
        localStorage.setItem('br_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('br_user');
      }
      if (activePlan) {
        localStorage.setItem('br_plan', activePlan);
      } else {
        localStorage.removeItem('br_plan');
      }
    }
  }, [currentUser, activePlan, isLoading]);

  // Auth Operations
  const login = (email: string, pass: string) => {
    if (email === ADMIN_CREDENTIALS.email && pass === ADMIN_CREDENTIALS.password) {
      const adminUser = { id: 'admin', name: 'Administrator', email, role: 'admin' as const };
      setCurrentUser(adminUser);
      setActivePlan(null);
      return { success: true };
    }

    const author = authors.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (author) {
      if (author.verificationStatus === 'pending') {
        return { success: false, error: 'Email address not verified yet. Please complete verification.' };
      }
      if (author.verificationStatus === 'rejected') {
        return { success: false, error: 'Your account registration was rejected by the admin.' };
      }
      
      const authorUser = { id: author.id, name: author.name, email: author.email, role: 'author' as const };
      setCurrentUser(authorUser);
      
      // Restore active plan from database transactions
      if (author.id === 'author-jkrowling') {
        setActivePlan('plan-elite');
      } else if (author.id === 'author-jamesclear') {
        setActivePlan('plan-pro');
      } else {
        supabase.from('br_transactions')
          .select('planName')
          .eq('authorId', author.id)
          .eq('status', 'success')
          .order('date', { ascending: false })
          .limit(1)
          .then(({ data }) => {
            if (data && data.length > 0) {
              const name = data[0].planName;
              if (name.includes('Basic')) setActivePlan('plan-basic');
              else if (name.includes('Pro')) setActivePlan('plan-pro');
              else if (name.includes('Elite')) setActivePlan('plan-elite');
              else setActivePlan(null);
            } else {
              setActivePlan(null);
            }
          });
      }

      return { success: true };
    }

    return { success: false, error: 'Invalid email or password.' };
  };

  const logout = () => {
    setCurrentUser(null);
    setActivePlan(null);
  };

  const syncFirebaseUser = (
    role: 'reader' | 'author' | 'admin', 
    firebaseUser: { uid: string; displayName: string | null; email: string | null; photoURL: string | null },
    authorProfile?: { bio: string; profileImage: string }
  ) => {
    const email = firebaseUser.email || '';
    const name = firebaseUser.displayName || (role === 'reader' ? 'Verified Reader' : role === 'admin' ? 'Administrator' : 'Verified Author');

    if (!email) {
      return { success: false, error: 'Failed to retrieve email address from your authentication account.' };
    }

    if (role === 'admin') {
      const adminUser = { id: firebaseUser.uid, name: 'Administrator', email, role: 'admin' as const };
      setCurrentUser(adminUser);
      setActivePlan(null);
      return { success: true };
    }

    if (role === 'reader') {
      let reader = readers.find(r => r.email.toLowerCase() === email.toLowerCase());
      if (!reader) {
        reader = {
          id: firebaseUser.uid,
          name,
          email
        };
        setReaders(prev => [...prev, reader!]);
        
        supabase.from('br_readers').insert(reader).then(({ error }) => {
          if (error) console.error('Error inserting reader to Supabase:', error);
        });
      }
      
      const readerUser = { id: reader.id, name: reader.name, email: reader.email, role: 'reader' as const };
      setCurrentUser(readerUser);
      setActivePlan(null);
      return { success: true };
    } else {
      let author = authors.find(a => a.email.toLowerCase() === email.toLowerCase());
      if (!author) {
        author = {
          id: firebaseUser.uid,
          name,
          email,
          bio: authorProfile?.bio || 'Verified Creator registered via Authentication.',
          profileImage: authorProfile?.profileImage || firebaseUser.photoURL || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
          isVerified: true,
          verificationStatus: 'verified',
          joinDate: new Date().toISOString().split('T')[0]
        };
        setAuthors(prev => [...prev, author!]);

        supabase.from('br_authors').insert(author).then(({ error }) => {
          if (error) console.error('Error inserting author to Supabase:', error);
        });

        const newNot: Notification = {
          id: `not-${Date.now()}`,
          userId: 'admin',
          title: 'New Author Registered',
          message: `Author "${author.name}" registered and auto-verified via Authentication.`,
          date: new Date().toLocaleString(),
          read: false
        };
        setNotifications(prev => [newNot, ...prev]);

        supabase.from('br_notifications').insert(newNot).then(({ error }) => {
          if (error) console.error('Error inserting notification to Supabase:', error);
        });
      } else {
        if (author.verificationStatus === 'rejected') {
          return { success: false, error: 'Your account registration was rejected by the admin.' };
        }
        if (author.verificationStatus === 'pending') {
          setAuthors(prev => prev.map(a => a.id === author!.id ? { ...a, verificationStatus: 'verified', isVerified: true } : a));
          
          supabase.from('br_authors').update({ verificationStatus: 'verified', isVerified: true }).eq('id', author.id).then(({ error }) => {
            if (error) console.error('Error updating author status in Supabase:', error);
          });
        }
      }

      const authorUser = { id: author.id, name: author.name, email: author.email, role: 'author' as const };
      setCurrentUser(authorUser);
      
      // Restore active plan from database transactions
      if (author.id === 'author-jkrowling') {
        setActivePlan('plan-elite');
      } else if (author.id === 'author-jamesclear') {
        setActivePlan('plan-pro');
      } else {
        supabase.from('br_transactions')
          .select('planName')
          .eq('authorId', author.id)
          .eq('status', 'success')
          .order('date', { ascending: false })
          .limit(1)
          .then(({ data }) => {
            if (data && data.length > 0) {
              const name = data[0].planName;
              if (name.includes('Basic')) setActivePlan('plan-basic');
              else if (name.includes('Pro')) setActivePlan('plan-pro');
              else if (name.includes('Elite')) setActivePlan('plan-elite');
              else setActivePlan(null);
            } else {
              setActivePlan(null);
            }
          });
      }
      return { success: true };
    }
  };

  const registerReader = (name: string, email: string) => {
    const exists = readers.some(r => r.email.toLowerCase() === email.toLowerCase()) || 
                   authors.some(a => a.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, error: 'Email already registered.' };
    }

    const newReader = {
      id: `reader-${Date.now()}`,
      name,
      email
    };
    setReaders(prev => [...prev, newReader]);

    supabase.from('br_readers').insert(newReader).then(({ error }) => {
      if (error) console.error('Error inserting reader to Supabase:', error);
    });

    return { success: true };
  };

  const registerAuthor = (data: { name: string; email: string; bio: string; profileImage: string }) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    sessionStorage.setItem('pending_verification', JSON.stringify({
      ...data,
      code
    }));

    return { success: true, verificationCode: code };
  };

  const verifyEmailCode = (email: string, code: string) => {
    const pendingStr = sessionStorage.getItem('pending_verification');
    if (!pendingStr) return { success: false, error: 'No registration session found.' };
    
    const pending = JSON.parse(pendingStr);
    if (pending.email.toLowerCase() !== email.toLowerCase() || pending.code !== code) {
      return { success: false, error: 'Incorrect verification code.' };
    }

    const newAuthor: Author = {
      id: `author-${Date.now()}`,
      name: pending.name,
      email: pending.email,
      bio: pending.bio,
      profileImage: pending.profileImage || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
      isVerified: false,
      verificationStatus: 'pending',
      joinDate: new Date().toISOString().split('T')[0]
    };

    setAuthors(prev => [...prev, newAuthor]);
    sessionStorage.removeItem('pending_verification');

    supabase.from('br_authors').insert(newAuthor).then(({ error }) => {
      if (error) console.error('Error inserting author to Supabase:', error);
    });

    const newNot: Notification = {
      id: `not-${Date.now()}`,
      userId: 'admin',
      title: 'New Author Awaiting Approval',
      message: `Author "${newAuthor.name}" has verified their email and is waiting for account activation.`,
      date: new Date().toLocaleString(),
      read: false
    };
    setNotifications(prev => [newNot, ...prev]);

    supabase.from('br_notifications').insert(newNot).then(({ error }) => {
      if (error) console.error('Error inserting notification to Supabase:', error);
    });

    return { success: true };
  };

  // Book Actions
  const addBook = (bookData: Omit<Book, 'id' | 'authorId' | 'authorName' | 'rating' | 'views' | 'purchaseClicks' | 'status'>) => {
    if (!currentUser || currentUser.role !== 'author') return;
    
    const newBook: Book = {
      ...bookData,
      id: `book-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      rating: 5.0,
      views: 0,
      purchaseClicks: 0,
      status: 'pending'
    };

    setBooks(prev => [newBook, ...prev]);

    supabase.from('br_books').insert(newBook).then(({ error }) => {
      if (error) console.error('Error inserting book to Supabase:', error);
    });

    const newNot: Notification = {
      id: `not-${Date.now()}`,
      userId: 'admin',
      title: 'New Book Pending Approval',
      message: `Author "${currentUser.name}" submitted a new book: "${newBook.title}".`,
      date: new Date().toLocaleString(),
      read: false
    };
    setNotifications(prev => [newNot, ...prev]);

    supabase.from('br_notifications').insert(newNot).then(({ error }) => {
      if (error) console.error('Error inserting notification to Supabase:', error);
    });
  };

  const updateBook = (id: string, bookData: Partial<Book>) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, ...bookData } : b));
    
    supabase.from('br_books').update(bookData).eq('id', id).then(({ error }) => {
      if (error) console.error('Error updating book in Supabase:', error);
    });
  };

  const deleteBook = (id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));

    supabase.from('br_books').delete().eq('id', id).then(({ error }) => {
      if (error) console.error('Error deleting book in Supabase:', error);
    });
  };

  const incrementBookView = (id: string) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, views: b.views + 1 } : b));
    
    const book = books.find(b => b.id === id);
    if (book) {
      supabase.from('br_books').update({ views: book.views + 1 }).eq('id', id).then(({ error }) => {
        if (error) console.error('Error updating views count in Supabase:', error);
      });
    }
  };

  const incrementBookClick = (id: string) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, purchaseClicks: b.purchaseClicks + 1 } : b));

    const book = books.find(b => b.id === id);
    if (book) {
      supabase.from('br_books').update({ purchaseClicks: book.purchaseClicks + 1 }).eq('id', id).then(({ error }) => {
        if (error) console.error('Error updating purchase clicks count in Supabase:', error);
      });
    }
  };

  const addReview = (bookId: string, rating: number, comment: string, userName: string) => {
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      bookId,
      userName,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0]
    };
    setReviews(prev => [newReview, ...prev]);

    supabase.from('br_reviews').insert(newReview).then(({ error }) => {
      if (error) console.error('Error inserting review to Supabase:', error);
    });

    const bookReviews = [newReview, ...reviews.filter(r => r.bookId === bookId)];
    const avgRating = Math.round((bookReviews.reduce((sum, r) => sum + r.rating, 0) / bookReviews.length) * 10) / 10;
    
    updateBook(bookId, { rating: avgRating });
  };

  // Admin Actions
  const approveAuthor = (id: string) => {
    setAuthors(prev => prev.map(a => a.id === id ? { ...a, verificationStatus: 'verified', isVerified: true } : a));
    
    supabase.from('br_authors').update({ verificationStatus: 'verified', isVerified: true }).eq('id', id).then(({ error }) => {
      if (error) console.error('Error approving author in Supabase:', error);
    });

    const authObj = authors.find(a => a.id === id);
    if (authObj) {
      const newNot: Notification = {
        id: `not-${Date.now()}`,
        userId: id,
        title: 'Account Activated!',
        message: 'Your author account registration has been approved. You can now subscribe and list books.',
        date: new Date().toLocaleString(),
        read: false
      };
      setNotifications(prev => [newNot, ...prev]);

      supabase.from('br_notifications').insert(newNot).then(({ error }) => {
        if (error) console.error('Error inserting notification to Supabase:', error);
      });
    }
  };

  const rejectAuthor = (id: string) => {
    setAuthors(prev => prev.map(a => a.id === id ? { ...a, verificationStatus: 'rejected', isVerified: false } : a));

    supabase.from('br_authors').update({ verificationStatus: 'rejected', isVerified: false }).eq('id', id).then(({ error }) => {
      if (error) console.error('Error rejecting author in Supabase:', error);
    });
  };

  const approveBook = (id: string) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, status: 'approved' } : b));

    supabase.from('br_books').update({ status: 'approved' }).eq('id', id).then(({ error }) => {
      if (error) console.error('Error approving book in Supabase:', error);
    });
    
    const book = books.find(b => b.id === id);
    if (book) {
      const newNot: Notification = {
        id: `not-${Date.now()}`,
        userId: book.authorId,
        title: 'Book Approved!',
        message: `Your book listing "${book.title}" has been approved and is now live.`,
        date: new Date().toLocaleString(),
        read: false
      };
      setNotifications(prev => [newNot, ...prev]);

      supabase.from('br_notifications').insert(newNot).then(({ error }) => {
        if (error) console.error('Error inserting notification to Supabase:', error);
      });
    }
  };

  const rejectBook = (id: string, reason: string) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, status: 'rejected', rejectionReason: reason } : b));

    supabase.from('br_books').update({ status: 'rejected', rejectionReason: reason }).eq('id', id).then(({ error }) => {
      if (error) console.error('Error rejecting book in Supabase:', error);
    });
    
    const book = books.find(b => b.id === id);
    if (book) {
      const newNot: Notification = {
        id: `not-${Date.now()}`,
        userId: book.authorId,
        title: 'Book Rejected',
        message: `Your book listing "${book.title}" was rejected. Reason: ${reason}`,
        date: new Date().toLocaleString(),
        read: false
      };
      setNotifications(prev => [newNot, ...prev]);

      supabase.from('br_notifications').insert(newNot).then(({ error }) => {
        if (error) console.error('Error inserting notification to Supabase:', error);
      });
    }
  };

  const addCategory = (name: string, icon: string) => {
    const newCat: Category = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      icon,
      count: 0
    };
    setCategories(prev => [...prev, newCat]);

    supabase.from('br_categories').insert(newCat).then(({ error }) => {
      if (error) console.error('Error inserting category to Supabase:', error);
    });
  };

  const updateCategory = (id: string, name: string, icon: string) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, name, icon } : c));

    supabase.from('br_categories').update({ name, icon }).eq('id', id).then(({ error }) => {
      if (error) console.error('Error updating category in Supabase:', error);
    });
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));

    supabase.from('br_categories').delete().eq('id', id).then(({ error }) => {
      if (error) console.error('Error deleting category in Supabase:', error);
    });
  };

  const subscribeNewsletter = (email: string) => {
    if (newsletterSubscribers.includes(email.toLowerCase())) {
      return { success: false, message: 'You are already subscribed to the newsletter!' };
    }
    setNewsletterSubscribers(prev => [...prev, email.toLowerCase()]);

    supabase.from('br_subscribers').insert({ email: email.toLowerCase() }).then(({ error }) => {
      if (error) console.error('Error inserting subscriber to Supabase:', error);
    });

    return { success: true, message: 'Thank you for subscribing to BookRumors newsletter!' };
  };

  const sendNewsletter = (subject: string, content: string) => {
    const newNews: Newsletter = {
      id: `news-${Date.now()}`,
      subject,
      content,
      dateSent: new Date().toISOString().split('T')[0],
      subscribersCount: newsletterSubscribers.length,
      clicksCount: 0,
      status: 'sent'
    };
    setNewsletters(prev => [newNews, ...prev]);

    supabase.from('br_newsletters').insert(newNews).then(({ error }) => {
      if (error) console.error('Error inserting newsletter to Supabase:', error);
    });
  };

  const processPayment = async (planId: string, method: 'Stripe' | 'Razorpay' | 'PayPal', cardInfo: any) => {
    if (!currentUser || currentUser.role !== 'author') return false;

    // Simulate Network Delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const selectedPlan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    if (!selectedPlan) return false;

    // Record Transaction
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      planName: selectedPlan.name,
      amount: selectedPlan.price,
      paymentMethod: method,
      transactionId: `${method === 'Stripe' ? 'ch' : method === 'Razorpay' ? 'pay' : 'tx'}_${Math.random().toString(36).substring(2, 20)}`,
      date: new Date().toLocaleString(),
      status: 'success',
      invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`
    };

    setTransactions(prev => [newTx, ...prev]);
    setActivePlan(planId);

    supabase.from('br_transactions').insert(newTx).then(({ error }) => {
      if (error) console.error('Error inserting transaction to Supabase:', error);
    });

    // Notify Author
    const authorNot: Notification = {
      id: `not-auth-${Date.now()}`,
      userId: currentUser.id,
      title: 'Payment Successful!',
      message: `Your payment of $${selectedPlan.price.toFixed(2)} for "${selectedPlan.name}" was processed successfully via ${method}.`,
      date: new Date().toLocaleString(),
      read: false
    };

    // Notify Admin
    const adminNot: Notification = {
      id: `not-adm-${Date.now()}`,
      userId: 'admin',
      title: 'New Subscription Purchase',
      message: `Author "${currentUser.name}" purchased plan "${selectedPlan.name}" ($${selectedPlan.price.toFixed(2)}).`,
      date: new Date().toLocaleString(),
      read: false
    };

    setNotifications(prev => [authorNot, adminNot, ...prev]);

    supabase.from('br_notifications').insert([authorNot, adminNot]).then(({ error }) => {
      if (error) console.error('Error inserting notifications to Supabase:', error);
    });

    return true;
  };

  return (
    <StateContext.Provider value={{
      books,
      categories,
      authors,
      reviews,
      transactions,
      notifications,
      newsletters,
      newsletterSubscribers,
      currentUser,
      activePlan,
      isLoading,
      login,
      syncFirebaseUser,
      logout,
      registerAuthor,
      registerReader,
      verifyEmailCode,
      addBook,
      updateBook,
      deleteBook,
      incrementBookView,
      incrementBookClick,
      addReview,
      approveAuthor,
      rejectAuthor,
      approveBook,
      rejectBook,
      addCategory,
      updateCategory,
      deleteCategory,
      subscribeNewsletter,
      sendNewsletter,
      processPayment
    }}>
      {children}
    </StateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within a StateProvider');
  }
  return context;
};
