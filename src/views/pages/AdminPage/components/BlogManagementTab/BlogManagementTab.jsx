import React, { useState, useEffect } from 'react';
import './BlogManagementTab.css';

const CATEGORIES = [
  'Loan Basics',
  'Interest & EMI Guides',
  'Eligibility & CIBIL Help',
  'Our Process & Security',
  'Smart Borrowing & Wellness'
];

const BlogManagementTab = ({ showToast }) => {
  const [blogs, setBlogs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null); // Used for both Create and Update
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  
  // Form values state
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState(CATEGORIES[0]);
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formSummary, setFormSummary] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDate, setFormDate] = useState('');

  // Initial Seed Data if localStorage is empty
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

  // Load blogs from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('lendogo_blog_posts');
    if (stored) {
      setBlogs(JSON.parse(stored));
    } else {
      localStorage.setItem('lendogo_blog_posts', JSON.stringify(defaultBlogs));
      setBlogs(defaultBlogs);
    }
  }, []);

  // Sync to localStorage whenever blogs change
  const saveBlogs = (updatedList) => {
    localStorage.setItem('lendogo_blog_posts', JSON.stringify(updatedList));
    setBlogs(updatedList);
  };

  // Word count utility for validation
  const getWordCount = (text) => {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  };

  const getTodayDateString = () => {
    return new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Trigger form opening for Create or Edit
  const openForm = (blog = null) => {
    if (blog) {
      // Edit mode
      setCurrentBlog(blog);
      setFormTitle(blog.title);
      setFormCategory(blog.category);
      setFormImageUrl(blog.image);
      setFormSummary(blog.summary);
      setFormDescription(blog.description);
      setFormDate(blog.date || getTodayDateString());
      setIsEditing(true);
    } else {
      // Create mode
      setCurrentBlog(null);
      setFormTitle('');
      setFormCategory(CATEGORIES[0]);
      setFormImageUrl('');
      setFormSummary('');
      setFormDescription('');
      setFormDate(getTodayDateString());
      setIsEditing(true);
    }
  };

  const closeForm = () => {
    setIsEditing(false);
    setCurrentBlog(null);
  };

  // Save changes (Create or Update)
  const handleSave = (e) => {
    e.preventDefault();

    // Validations
    if (!formTitle.trim()) {
      showToast('Title is required.', 'error');
      return;
    }

    const summaryWordCount = getWordCount(formSummary);
    if (summaryWordCount < 50 || summaryWordCount > 250) {
      showToast(`Summary must be between 50 and 250 words. Currently: ${summaryWordCount} words.`, 'error');
      return;
    }

    if (!formImageUrl.trim()) {
      showToast('Image URL is required.', 'error');
      return;
    }

    if (!formDescription.trim()) {
      showToast('Full description content is required.', 'error');
      return;
    }

    const dateVal = formDate.trim() || getTodayDateString();

    if (currentBlog) {
      // Update existing
      const updated = blogs.map((item) => {
        if (item.id === currentBlog.id) {
          return {
            ...item,
            title: formTitle,
            category: formCategory,
            image: formImageUrl,
            summary: formSummary,
            description: formDescription,
            date: dateVal
          };
        }
        return item;
      });
      saveBlogs(updated);
      showToast('Blog article updated successfully.', 'success');
    } else {
      // Create new
      const newPost = {
        id: Date.now(),
        title: formTitle,
        category: formCategory,
        image: formImageUrl,
        summary: formSummary,
        description: formDescription,
        date: dateVal,
        author: 'LendoGo Admin Team'
      };
      saveBlogs([newPost, ...blogs]);
      showToast('New blog article published successfully.', 'success');
    }

    closeForm();
  };

  // Delete article
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      const updated = blogs.filter((item) => item.id !== id);
      saveBlogs(updated);
      showToast('Blog article deleted successfully.', 'success');
    }
  };

  // Filter and Search logic
  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory = filterCategory === 'All' || blog.category === filterCategory;
    const matchesSearch = 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      blog.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="blog-admin-tab-container animate-fade-in">
      <div className="section-header-row">
        <div>
          <h2>Platform Publications & Blogs</h2>
        </div>
        {!isEditing && (
          <button className="btn-add-blog" onClick={() => openForm(null)}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Publish New Article
          </button>
        )}
      </div>

      {isEditing ? (
        /* Edit/Create Form Panel */
        <div className="blog-form-card animate-scale-up">
          <div className="form-card-header">
            <h3>{currentBlog ? 'Edit Blog Article' : 'Publish New Guide'}</h3>
            <button className="btn-close-form" onClick={closeForm}>×</button>
          </div>

          <form onSubmit={handleSave} className="blog-admin-form">
            <div className="form-grid-layout">
              {/* Left Column: Core metadata */}
              <div className="form-col-left">
                <div className="form-field-group">
                  <label className="form-label-styled">Article Title</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. How to Protect Your CIBIL Score From Decline"
                    className="form-input-styled"
                    required
                  />
                </div>

                <div className="form-field-group">
                  <label className="form-label-styled">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="form-input-styled"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-field-group">
                  <label className="form-label-styled">Image URL</label>
                  <input
                    type="text"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="e.g. /src/assets/personal_loan_visual.png or https://image-link.com/..."
                    className="form-input-styled"
                    required
                  />
                </div>

                <div className="form-field-group">
                  <label className="form-label-styled">Published Date</label>
                  <input
                    type="text"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    placeholder="e.g. 02 Jun 2026"
                    className="form-input-styled"
                    required
                  />
                </div>
              </div>

              {/* Right Column: Descriptions & Summaries */}
              <div className="form-col-right">
                <div className="form-field-group">
                  <div className="label-with-badge">
                    <label className="form-label-styled">Article Summary</label>
                    <span className={`word-count-badge ${getWordCount(formSummary) >= 50 && getWordCount(formSummary) <= 250 ? 'valid' : 'invalid'}`}>
                      {getWordCount(formSummary)} / 50-250 Words
                    </span>
                  </div>
                  <textarea
                    value={formSummary}
                    onChange={(e) => setFormSummary(e.target.value)}
                    placeholder="Write a clear summary of the article between 50 and 250 words to be displayed on the grid preview page."
                    rows="4"
                    className="form-textarea-styled"
                    required
                  />
                </div>

                <div className="form-field-group">
                  <label className="form-label-styled">Full Description Content</label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Enter the complete detailed article content here..."
                    rows="8"
                    className="form-textarea-styled"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-action-footer">
              <button type="button" className="btn-cancel-form" onClick={closeForm}>
                Discard Changes
              </button>
              <button type="submit" className="btn-submit-form">
                {currentBlog ? 'Update Article' : 'Publish Article'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Blog List Table View */
        <div className="blog-list-container">
          
          {/* Controls Bar */}
          <div className="blog-controls-header">
            <div className="search-input-wrapper">
              <span className="search-magnifier">🔍</span>
              <input
                type="text"
                placeholder="Search articles by title or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="blog-search-field"
              />
            </div>
            
            <div className="filter-select-wrapper">
              <span className="filter-label">Category Filter:</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="blog-category-select"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid or Table list of blogs */}
          {filteredBlogs.length > 0 ? (
            <div className="blogs-table-card">
              <table className="admin-blogs-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>#</th>
                    <th>Article Preview</th>
                    <th>Category</th>
                    <th>Summary (50-250 words)</th>
                    <th>Published Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBlogs.map((blog, index) => {
                    const words = getWordCount(blog.summary);
                    const isWordCountValid = words >= 50 && words <= 250;
                    return (
                      <tr key={blog.id}>
                        <td style={{ fontWeight: '700', color: 'var(--admin-text-light)' }}>
                          {index + 1}
                        </td>
                        <td>
                          <div className="table-article-info">
                            <img src={blog.image} alt="" className="table-article-thumb" onError={(e) => { e.target.src = '/src/assets/blog_featured.png'; }} />
                            <div className="table-article-meta">
                              <span className="table-article-title">{blog.title}</span>
                              <span className="table-article-author">By {blog.author}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="table-article-category-badge">
                            {blog.category}
                          </span>
                        </td>
                        <td>
                          <p className="table-article-summary-text">{blog.summary}</p>
                          <span className={`summary-word-indicator ${isWordCountValid ? 'ok' : 'warn'}`}>
                            {words} words
                          </span>
                        </td>
                        <td>{blog.date}</td>
                        <td>
                          <div className="table-action-buttons">
                            <button className="btn-table-edit" onClick={() => openForm(blog)} title="Edit Article">
                              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 20h9"/>
                                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
                              </svg>
                            </button>
                            <button className="btn-table-delete" onClick={() => handleDelete(blog.id)} title="Delete Article">
                              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                <line x1="10" y1="11" x2="10" y2="17"/>
                                <line x1="14" y1="11" x2="14" y2="17"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-blogs-found">
              <div className="no-blogs-icon">📑</div>
              <h4>No publications match your filter criteria</h4>
              <p>Try clearing your search query or choosing another category filter.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogManagementTab;
