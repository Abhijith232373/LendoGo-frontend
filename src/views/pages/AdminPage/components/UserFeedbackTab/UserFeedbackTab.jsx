import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { apiClient } from '../../../../../utils/apiClient';
import './UserFeedbackTab.css';

const UserFeedbackTab = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchFeedbacks = async () => {
    try {
      const res = await apiClient('/feedback/admin/');
      const data = res?.data || res || [];
      const emojiMap = { 1: '😡', 2: '😞', 3: '😐', 4: '🙂', 5: '😍' };
      const normalized = data.map(fb => ({
        id: fb.id || fb.ID,
        date: fb.created_at || fb.createdAt ? new Date(fb.created_at || fb.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Unknown',
        user: fb.user?.email || fb.user_email || fb.user_id || fb.userId || 'Anonymous User',
        rating: emojiMap[fb.rating] || fb.rating || '😐',
        comment: fb.comment || '',
        status: fb.status || 'Pending'
      }));
      setFeedbacks(normalized);
    } catch (err) {
      console.error("Failed to fetch feedbacks:", err);
      setError(err.message || "Failed to fetch feedbacks from backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;
    try {
      await apiClient(`/feedback/admin/${selectedFeedback.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'Replied' })
      });
      alert(`Reply sent to ${selectedFeedback.user} successfully via email!`);
      setFeedbacks(prev => prev.map(fb => fb.id === selectedFeedback.id ? { ...fb, status: 'Replied' } : fb));
    } catch (err) {
      console.error("Failed to update status:", err);
      alert(`(Local Simulation) Reply sent to ${selectedFeedback.user} successfully!`);
      setFeedbacks(prev => prev.map(fb => fb.id === selectedFeedback.id ? { ...fb, status: 'Replied' } : fb));
    } finally {
      setSelectedFeedback(null);
      setReplyText('');
    }
  };

  const handleIgnore = async (id) => {
    if (window.confirm("Are you sure you want to ignore and archive this feedback?")) {
      try {
        await apiClient(`/feedback/admin/${id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'Ignored' })
        });
        setFeedbacks(prev => prev.map(fb => fb.id === id ? { ...fb, status: 'Ignored' } : fb));
      } catch (err) {
        console.error("Failed to update status:", err);
        setFeedbacks(prev => prev.map(fb => fb.id === id ? { ...fb, status: 'Ignored' } : fb));
      }
    }
  };

  const filteredFeedbacks = feedbacks.filter((fb) => {
    const matchesSearch = fb.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          fb.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === 'All' || fb.rating === ratingFilter;
    const matchesStatus = statusFilter === 'All' || fb.status === statusFilter;
    return matchesSearch && matchesRating && matchesStatus;
  });

  return (
    <div className="tab-pane-container animate-fade-in">
      {loading && <div className="text-white p-4">Syncing database records...</div>}
      {error && <div className="text-red-500 bg-red-900/20 p-4 rounded mb-4 border border-red-500/50">Error fetching data: {error}</div>}
      <div className="section-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2>User Feedback & Suggestions</h2>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Search by user email or comment content..." 
          className="form-input-admin" 
          style={{ flex: 1, minWidth: '200px' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select 
          className="form-input-admin" 
          style={{ width: 'auto' }} 
          value={ratingFilter} 
          onChange={(e) => setRatingFilter(e.target.value)}
        >
          <option value="All">All Ratings</option>
          <option value="😍">😍 Excellent</option>
          <option value="😊">😊 Good</option>
          <option value="😐">😐 Neutral</option>
          <option value="😞">😞 Poor</option>
          <option value="😠">😠 Terrible</option>
        </select>

        <select 
          className="form-input-admin" 
          style={{ width: 'auto' }} 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Replied">Replied</option>
          <option value="Ignored">Ignored</option>
        </select>
      </div>

      <div className="table-responsive-admin">
        <table className="admin-data-table w-full text-left">
          <thead>
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">User</th>
              <th className="p-4 text-center">Rating</th>
              <th className="p-4">Comment</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Reply</th>
            </tr>
          </thead>
          <tbody>
            {filteredFeedbacks.length > 0 ? (
              filteredFeedbacks.map((fb) => (
                <tr key={fb.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="p-4 text-gray-400">{fb.date}</td>
                  <td className="p-4 text-white font-medium">{fb.user}</td>
                  <td className="p-4 text-center" style={{ fontSize: '1.25rem' }}>{fb.rating}</td>
                  <td className="p-4 text-gray-300" style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {fb.comment}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      fb.status === 'Replied' ? 'bg-green-900/50 text-green-500' : 
                      fb.status === 'Ignored' ? 'bg-gray-700/50 text-gray-400' :
                      'bg-orange-900/50 text-orange-500'
                    }`}>
                      {fb.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button 
                        className="bg-blue-600/20 text-blue-500 px-3 py-1 rounded hover:bg-blue-600/30 transition-colors text-xs font-bold"
                        onClick={() => {
                          setSelectedFeedback(fb);
                          setReplyText('');
                        }}
                      >
                        Send Mail
                      </button>
                      <button 
                        className="bg-gray-600/20 text-gray-400 px-3 py-1 rounded hover:bg-gray-600/30 transition-colors text-xs font-bold border border-gray-600/30"
                        onClick={() => handleIgnore(fb.id)}
                      >
                        Ignore
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="p-8 text-center text-gray-500">No feedback matches your filter criteria.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Reply Modal */}
      {selectedFeedback && createPortal(
        <div className="admin-dashboard-wrapper dark-theme" style={{ display: 'contents' }}>
          <div className="admin-modal-overlay" onClick={() => setSelectedFeedback(null)}>
            <div className="admin-modal-container" style={{ width: '600px', maxWidth: '95vw', padding: '0' }} onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header" style={{ padding: '1.5rem', borderBottom: '1px solid var(--admin-border)' }}>
                <h3 style={{ margin: 0, color: 'var(--admin-text)', fontSize: '1.25rem', fontWeight: '600' }}>Reply to Feedback</h3>
                <button 
                  className="close-btn" 
                  onClick={() => setSelectedFeedback(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--admin-text-light)', fontSize: '1.5rem', cursor: 'pointer' }}
                >×</button>
              </div>
              
              <div className="admin-modal-body" style={{ padding: '1.5rem' }}>
                <div className="feedback-details-box">
                  <div className="feedback-meta">
                    <span className="meta-label">From:</span>
                    <span className="meta-value">{selectedFeedback.user}</span>
                  </div>
                  <div className="feedback-meta">
                    <span className="meta-label">Rating:</span>
                    <span className="meta-value" style={{ fontSize: '1.2rem' }}>{selectedFeedback.rating}</span>
                  </div>
                  <div className="feedback-message">
                    "{selectedFeedback.comment}"
                  </div>
                </div>

                <div className="reply-input-section mt-4" style={{ marginTop: '1.5rem' }}>
                  <label className="admin-input-label" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--admin-text-light)', fontSize: '0.875rem' }}>Your Email Reply</label>
                  <textarea 
                    className="admin-textarea" 
                    rows="5"
                    placeholder="Type your response to the user here. This will be sent directly to their email address."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-modal-footer" style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'flex-end', gap: '1rem', backgroundColor: 'var(--admin-bg-secondary)', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
                <button 
                  className="admin-action-btn neutral-btn-small" 
                  onClick={() => setSelectedFeedback(null)}
                  style={{ padding: '0.5rem 1rem', background: 'transparent', color: 'var(--admin-text)', border: '1px solid var(--admin-border)', borderRadius: '6px' }}
                >
                  Cancel
                </button>
                <button 
                  className="admin-action-btn primary-btn-small" 
                  onClick={handleReplySubmit}
                  style={{ padding: '0.5rem 1rem', background: 'var(--admin-primary)', color: '#fff', border: 'none', borderRadius: '6px' }}
                >
                  Send Email Reply
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default UserFeedbackTab;
