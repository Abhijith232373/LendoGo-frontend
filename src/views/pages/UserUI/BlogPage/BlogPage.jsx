import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import ScrollReveal from '../../../components/ScrollReveal/ScrollReveal';
import ParallaxShapes from '../../../components/ParallaxShapes/ParallaxShapes';
import './BlogPage.css';

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedPost, setSelectedPost] = useState(null);
  const [blogs, setBlogs] = useState([]);

  const categories = [
    'All',
    'Loan Basics',
    'Interest & EMI Guides',
    'Eligibility & CIBIL Help',
    'Our Process & Security',
    'Smart Borrowing & Wellness'
  ];

  // Default seed posts
  const defaultBlogs = [
    {
      id: 1,
      title: 'How Lenders Verify Your Income Without Salary Slips',
      category: 'Loan Basics',
      image: '/src/assets/personal_loan_visual.png',
      summary: 'Modern lenders use automated bank statement analysis, GST/Tax filings, and AI-driven data verification tools to verify income streams, allowing self-employed individuals to qualify for credit without traditional salary slips. This guide covers how these digital validations work.',
      description: 'Securing credit without salary slips was once impossible. Today, digital verification technology allows lenders to assess creditworthiness using bank statement analyzers, business turnover audits, tax returns, and digital transaction history. By analyzing your cash flow directly, automated scoring engines can approve personal or business capital in real time. Self-employed borrowers can optimize their chances by maintaining clean transaction records and avoiding excessive bounce penalties.',
      date: '02 Jun 2026',
      author: 'LendoGo Finance Desk'
    },
    {
      id: 2,
      title: 'Why We Panic During Financial Emergencies — Smarter Ways to Handle Them',
      category: 'Smart Borrowing & Wellness',
      image: '/src/assets/blog_featured.png',
      summary: 'Financial panic leads to rash decisions like borrowing from unregulated loan sharks. Learn how structured planning, emergency reserves, and low-interest line of credit options keep you secure and calm during cash crunches.',
      description: 'Emergency expenses arise without warning, triggering immediate stress. When panic sets in, consumers often turn to predatory lenders offering instant payouts with hidden interest traps. The smart approach involves establishing a personal line of credit, automating a small emergency savings reserve, and comparing flexible loans before signing. LendoGo provides pre-approved limits that act as a safety net, protecting your credit score from last-minute desperation.',
      date: '04 Jun 2026',
      author: 'LendoGo Wellness Board'
    },
    {
      id: 3,
      title: 'Understanding Flat Rate vs. Reducing Rate of Interest on Loans',
      category: 'Interest & EMI Guides',
      image: '/src/assets/loan_illustration.png',
      summary: 'Choosing between flat rate and reducing balance interest can drastically affect your overall payout. We explain the core mathematical differences to prevent you from overpaying on credit cards and personal contracts.',
      description: 'Understanding interest calculation metrics is crucial to smart borrowing. A flat rate applies interest to the full principal throughout the loan term, meaning you pay interest on money you have already paid back. A reducing balance rate calculates interest only on the remaining outstanding principal. Always check the Effective Annualized Rate (APR) before signing, as flat rates are often deceptively marketed as lower than reducing rates.',
      date: '06 Jun 2026',
      author: 'LendoGo Analytics'
    }
  ];

  // Sync with localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('lendogo_blog_posts');
    if (stored) {
      setBlogs(JSON.parse(stored));
    } else {
      localStorage.setItem('lendogo_blog_posts', JSON.stringify(defaultBlogs));
      setBlogs(defaultBlogs);
    }
  }, []);

  // Filter posts based on Category and Search Query
  const filteredPosts = blogs.filter((post) => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="blog-page-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
      <Navbar />

      {/* Dynamic ambient moving shapes background */}
      <ParallaxShapes preset="side-decor" />

      {/* HERO HEADER */}
      <section className="blog-hero" style={{ position: 'relative', zIndex: 2 }}>
        <ScrollReveal variant="fade-up">
          <div className="blog-hero-container">
            {/* <span className="blog-page-badge">LENDOGO PUBLICATIONS 📚</span> */}
            <h1 className="blog-hero-title">
              Blogs & <span className="text-gradient">Financial Guides</span>
            </h1>
            <p className="blog-hero-desc">
              Search expert borrower guides, interest calculators, and CIBIL optimization tools built by industry professionals.
            </p>

            {/* Search Controls */}
            <div className="search-bar-wrap">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search finance guides, terms, categories..."
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

      {/* CATEGORY BAR */}
      <section className="blog-categories" style={{ position: 'relative', zIndex: 2 }}>
        <ScrollReveal variant="fade-up" delay={0.05}>
          <div className="categories-container">
            <div className="categories-scroll-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory(cat);
                    setSelectedPost(null); // Clear selected article on category change
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* DUAL WORKSPACE LAYOUT (Cards Grid + Sticky Reading Drawer) */}
      <section className="blog-content" style={{ position: 'relative', zIndex: 2 }}>
        <div className="blog-container">
          <div className={`blog-workspace-layout ${selectedPost ? 'has-selected-post' : ''}`}>
            
            {/* Left Column: Listings Side */}
            <div className="blog-listings-side">
              {filteredPosts.length > 0 ? (
                <div className="articles-grid">
                  {filteredPosts.map((post, index) => (
                    <ScrollReveal 
                      key={post.id} 
                      variant="fade-up" 
                      delay={(index % 3) * 0.06}
                    >
                      <article 
                        className={`post-card ${selectedPost && selectedPost.id === post.id ? 'active' : ''}`}
                        onClick={() => setSelectedPost(post)}
                      >
                        <div className="post-card-thumb-wrap">
                          <img 
                            src={post.image} 
                            alt="" 
                            className="post-card-thumb" 
                            onError={(e) => { e.target.src = '/src/assets/blog_featured.png'; }}
                          />
                          <span className="post-category-tag">{post.category}</span>
                        </div>
                        <div className="post-card-body">
                          <div className="post-meta">
                            <span>{post.date}</span>
                          </div>
                          <h3 className="post-card-title">{post.title}</h3>
                          <p className="post-card-summary">{post.summary}</p>
                          <div className="post-card-footer">
                            <span className="author-name">By {post.author}</span>
                            <button 
                              className="read-now-btn" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPost(post);
                              }}
                            >
                              <span>Read Now</span>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
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
                    <p>We couldn't find any guides matching "{searchQuery}". Try another category filter or keyword.</p>
                    <button
                      className="reset-btn"
                      onClick={() => {
                        setSearchQuery('');
                        setActiveCategory('All');
                        setSelectedPost(null);
                      }}
                    >
                      Clear Filters
                    </button>
                  </div>
                </ScrollReveal>
              )}
            </div>

            {/* Right Column: Sticky Article Reading Drawer */}
            {selectedPost && (
              <div className="blog-reading-drawer animate-slide-in-right">
                <div className="drawer-header">
                  <span className="drawer-category-badge">{selectedPost.category}</span>
                  <button className="btn-close-drawer" onClick={() => setSelectedPost(null)} aria-label="Close article">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                
                <div className="drawer-body">
                  <img 
                    src={selectedPost.image} 
                    alt="" 
                    className="drawer-article-img" 
                    onError={(e) => { e.target.src = '/src/assets/blog_featured.png'; }}
                  />
                  <div className="drawer-article-meta">
                    <span>{selectedPost.date}</span>
                    <span className="meta-divider">•</span>
                    <span className="drawer-author-text">By {selectedPost.author}</span>
                  </div>
                  
                  <h2 className="drawer-article-title">{selectedPost.title}</h2>
                  
                  <blockquote className="drawer-article-summary-block">
                    {selectedPost.summary}
                  </blockquote>
                  
                  <div className="drawer-article-content">
                    {selectedPost.description.split('\n\n').map((para, idx) => (
                      <p key={idx}>{para}</p>
                    ))}
                  </div>
                </div>

                <div className="drawer-footer">
                  <button className="btn-back-to-grid" onClick={() => setSelectedPost(null)}>
                    Back to Articles
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>



      <Footer />
    </div>
  );
};

export default BlogPage;
