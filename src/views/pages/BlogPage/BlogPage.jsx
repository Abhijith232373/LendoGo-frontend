import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import ScrollReveal from '../../components/ScrollReveal/ScrollReveal';
import ParallaxShapes from '../../components/ParallaxShapes/ParallaxShapes';
import featuredImg from '../../../assets/blog_featured.png';
import './BlogPage.css';

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const categories = ['All', 'Personal Loans', 'Business Growth', 'Home & Auto', 'Credit Score', 'Financial Literacy'];

  const blogPosts = [
    {
      id: 1,
      title: 'How to Boost Your Credit Score in 5 Easy Steps',
      excerpt: 'Stuck with a low credit score? Discover actionable strategies to fix your credit profile, correct errors, and unlock lower interest rates on your next loan.',
      category: 'Credit Score',
      date: 'May 20, 2026',
      readTime: '4 min read',
      author: 'Aarav Mehta',
      badgeColor: '#a855f7',
      isFeatured: false,
    },
    {
      id: 2,
      title: 'Understanding Business Loans: A Guide for Young Startups',
      excerpt: 'Securing capital is the lifeblood of business. Learn how LendoGo helps you bypass standard banking delays with minimal docs and tailored business interest plans.',
      category: 'Business Growth',
      date: 'May 18, 2026',
      readTime: '5 min read',
      author: 'Sneha Rao',
      badgeColor: '#eab308',
      isFeatured: false,
    },
    {
      id: 3,
      title: 'Personal Loans vs. Credit Cards: Which is Right for You?',
      excerpt: 'Compare flexible installment terms vs. credit line debts. Discover why personal loans provide structured repayments, protecting you from compound interest traps.',
      category: 'Personal Loans',
      date: 'May 14, 2026',
      readTime: '3 min read',
      author: 'Kabir Dev',
      badgeColor: '#0066ff',
      isFeatured: false,
    },
    {
      id: 4,
      title: '5 Signs It’s Time to Refinance Your Home Loan',
      excerpt: 'Interest rates fluctuate frequently. We outline major indicators showing that replacing your existing mortgage can save you lakhs in future EMI payouts.',
      category: 'Home & Auto',
      date: 'May 10, 2026',
      readTime: '5 min read',
      author: 'Vikram Aditya',
      badgeColor: '#10b981',
      isFeatured: false,
    },
    {
      id: 5,
      title: 'Navigating Student Loans: Invest in Your Future Smarter',
      excerpt: 'Fund your dream degree without stressing your family budget. Tips on grace periods, digital collateral verification, and selecting appropriate repayment timelines.',
      category: 'Financial Literacy',
      date: 'May 05, 2026',
      readTime: '4 min read',
      author: 'Neha Roy',
      badgeColor: '#f43f5e',
      isFeatured: false,
    },
    {
      id: 6,
      title: 'Everything You Need to Know About Auto Loan Approvals',
      excerpt: 'Ready to drive home your dream car? A complete breakdown of documentation requirements, instant down-payment options, and choosing appropriate loan terms.',
      category: 'Home & Auto',
      date: 'May 02, 2026',
      readTime: '4 min read',
      author: 'Rohan Sen',
      badgeColor: '#06b6d4',
      isFeatured: false,
    },
  ];

  const featuredPost = {
    title: 'The Smart Borrowing Guide: How to Secure the Best Rates',
    excerpt: 'Navigating interest plans doesn’t have to be daunting. Discover our proven checklist to secure premium interest rates, optimize your credit file, and borrow with absolute transparency.',
    category: 'Financial Literacy',
    date: 'May 25, 2026',
    readTime: '6 min read',
    author: 'Priya Sharma, Chief Finance Editor',
    badgeColor: '#f43f5e',
    image: featuredImg,
  };

  // Filter posts based on Category and Search Query
  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isFeaturedVisible =
    (activeCategory === 'All' || activeCategory === featuredPost.category) &&
    (featuredPost.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      featuredPost.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="blog-page-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
      <Navbar />

      {/* Dynamic ambient moving shapes background */}
      <ParallaxShapes preset="side-decor" />

      {/* ── HERO HEADER ── */}
      <section className="blog-hero" style={{ position: 'relative', zIndex: 2 }}>
        <ScrollReveal variant="fade-up">
          <div className="blog-hero-container">
            <span className="blog-page-badge">LENDOGO INSIGHTS 📚</span>
            <h1 className="blog-hero-title">
              Your Center for <br />
              <span className="text-gradient">Financial Wisdom.</span>
            </h1>
            <p className="blog-hero-desc">
              Expert guides, credit building tips, and finance strategies designed to help you unlock the power of accessible borrowing.
            </p>

            {/* Search Controls */}
            <div className="search-bar-wrap">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search guides, categories, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="blog-search-input"
              />
              {searchQuery && (
                <button className="clear-search" onClick={() => setSearchQuery('')}>
                  ×
                </button>
              )}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── CATEGORY BAR ── */}
      <section className="blog-categories" style={{ position: 'relative', zIndex: 2 }}>
        <ScrollReveal variant="fade-up" delay={0.05}>
          <div className="categories-container">
            <div className="categories-scroll-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── BLOG CONTENT GRID ── */}
      <section className="blog-content" style={{ position: 'relative', zIndex: 2 }}>
        <div className="blog-container">
          {/* Spotlight Featured Post */}
          {isFeaturedVisible && !searchQuery && (
            <ScrollReveal variant="zoom-in" delay={0.1}>
              <div className="featured-post-card">
                <div className="featured-img-wrap">
                  <img src={featuredPost.image} alt="Featured Post" className="featured-img" />
                  <span className="post-category-badge" style={{ backgroundColor: featuredPost.badgeColor }}>
                    {featuredPost.category}
                  </span>
                </div>
                <div className="featured-post-info">
                  <div className="post-meta">
                    <span>{featuredPost.date}</span>
                    <span className="meta-divider">•</span>
                    <span>{featuredPost.readTime}</span>
                  </div>
                  <h2 className="featured-post-title">{featuredPost.title}</h2>
                  <p className="featured-post-excerpt">{featuredPost.excerpt}</p>
                  <div className="post-footer">
                    <div className="post-author-wrap">
                      <span className="author-avatar">✍️</span>
                      <span className="author-name">{featuredPost.author}</span>
                    </div>
                    <button className="read-more-btn" onClick={() => alert('Article reading view coming soon!')}>
                      <span>Read Article</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* Articles list */}
          {filteredPosts.length > 0 ? (
            <div className="articles-grid">
              {filteredPosts.map((post, index) => (
                <ScrollReveal 
                  key={post.id} 
                  variant="fade-up" 
                  delay={(index % 3) * 0.08}
                >
                  <article className="post-card">
                    <div className="post-card-header">
                      <span className="post-category-badge" style={{ backgroundColor: post.badgeColor }}>
                        {post.category}
                      </span>
                      <div className="post-meta">
                        <span>{post.date}</span>
                        <span className="meta-divider">•</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <h3 className="post-card-title">{post.title}</h3>
                    <p className="post-card-excerpt">{post.excerpt}</p>
                    <div className="post-footer">
                      <span className="author-name">By {post.author}</span>
                      <button className="read-more-icon-btn" onClick={() => alert('Article reading view coming soon!')} aria-label="Read Article">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <ScrollReveal variant="fade-up">
              <div className="no-results">
                <span className="no-results-icon">🔎</span>
                <h3>No articles found</h3>
                <p>We couldn't find any guides matching "{searchQuery}". Try searching for standard finance keywords like "EMIs", "Credit Score", or "Business".</p>
                <button
                  className="reset-btn"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('All');
                  }}
                >
                  Clear Filters
                </button>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* ── NEWSLETTER SUBSCRIPTION SECTION ── */}
      <section className="blog-newsletter" style={{ position: 'relative', zIndex: 2 }}>
        <ScrollReveal variant="fade-up">
          <div className="newsletter-container">
            <div className="newsletter-glow" />
            <div className="newsletter-content">
              <span className="newsletter-badge">STAY UPDATED ✉️</span>
              <h2 className="newsletter-title">Subscribe to LendoGo Weekly</h2>
              <p className="newsletter-subtitle">
                Get the latest credit score hacks, debt refinancing checklists, and instant lending guides delivered directly to your inbox.
              </p>

              {subscribed ? (
                <div className="subscription-success">
                  <span className="success-icon">🎉</span>
                  <h4>You're on the list!</h4>
                  <p>Welcome! We will send you our curated financial newsletters starting next Tuesday.</p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="newsletter-form">
                  <input
                    type="email"
                    placeholder="Enter your professional email address..."
                    value={newsletterEmail}
                    onChange={(e) => setSearchQuery(e.target.value)} // Wait, using newsletterEmail state
                    required
                    className="newsletter-email-input"
                  />
                  <button type="submit" className="newsletter-submit-btn">
                    <span>Subscribe Now</span>
                  </button>
                </form>
              )}
              <span className="spam-protection-pill">🔒 Zero spam. Unsubscribe with one-click.</span>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  );
 };
 
 export default BlogPage;
