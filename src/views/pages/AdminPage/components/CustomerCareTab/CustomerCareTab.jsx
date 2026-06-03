import React, { useState, useEffect, useRef } from 'react';
import './CustomerCareTab.css';

const calculateChatDuration = (startStr) => {
  if (!startStr) return '5 mins';
  try {
    const today = new Date();
    const parts = startStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!parts) return '5 mins';
    let hours = parseInt(parts[1], 10);
    const minutes = parseInt(parts[2], 10);
    const isPM = parts[3].toUpperCase() === 'PM';
    if (isPM && hours < 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;
    
    const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, 0);
    const diffMs = today - startDate;
    if (diffMs < 0) return '5 mins'; 
    const diffMins = Math.round(diffMs / 60000);
    if (diffMins < 1) return '1 min';
    if (diffMins > 60) {
      const hrs = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hrs} hr${hrs > 1 ? 's' : ''} ${mins} min${mins !== 1 ? 's' : ''}`;
    }
    return `${diffMins} mins`;
  } catch (err) {
    return '5 mins';
  }
};

const CustomerCareTab = ({ consultations, handleResolveTicket, chats, setChats, showOnly }) => {
  // Chat States
  const [selectedChatId, setSelectedChatId] = useState('CHT-882');
  const [chatSearch, setChatSearch] = useState('');
  const [chatFilter, setChatFilter] = useState('Active'); // 'Active' or 'Resolved'
  const [replyInput, setReplyInput] = useState('');
  const [viewingHistoryChat, setViewingHistoryChat] = useState(null);

  const messagesEndRef = useRef(null);

  // Auto scroll to bottom of active chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChatId, chats]);

  // Due Date Reminders state
  const [reminders, setReminders] = useState([
    { id: 'REM-301', name: 'Rohan Sharma', email: 'rohan.s@gmail.com', phone: '98765 43210', loanAmount: '₹3,50,000', dueDate: '06/05/2026', daysRemaining: 6, status: 'Pending Alert' },
    { id: 'REM-402', name: 'Divya Iyer', email: 'divya.iyer@outlook.com', phone: '94471 23456', loanAmount: '₹1,50,000', dueDate: '06/07/2026', daysRemaining: 8, status: 'Reminded' },
    { id: 'REM-105', name: 'Vikram Seth', email: 'vikram.seth@yahoo.com', phone: '90012 34567', loanAmount: '₹5,00,000', dueDate: '06/02/2026', daysRemaining: 3, status: 'Pending Alert' }
  ]);

  // Overdue Collections state
  const [overdues, setOverdues] = useState([
    { id: 'OVD-909', name: 'Anoop Pillai', phone: '95671 88990', originalDue: '₹12,500', penaltyDue: '₹14,200', penaltyDays: 14, creditImpact: '-45 pts', status: 'Needs Action' },
    { id: 'OVD-203', name: 'Sneha George', phone: '98440 22334', originalDue: '₹8,400', penaltyDue: '₹9,850', penaltyDays: 22, creditImpact: '-60 pts', status: 'Needs Action' },
    { id: 'OVD-107', name: 'Rajesh Varma', phone: '97441 00331', originalDue: '₹22,000', penaltyDue: '₹24,900', penaltyDays: 8, creditImpact: '-30 pts', status: 'Warning Sent' }
  ]);

  const [consultFilter, setConsultFilter] = useState('Pending'); // 'Pending' or 'Called'
  const [confirmCallUser, setConfirmCallUser] = useState(null); // { id, name, phone }

  const handleResolveChat = (id, client) => {
    const now = new Date();
    const endTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChats(prev => prev.map(c => {
      if (c.id === id) {
        const dur = calculateChatDuration(c.startTime);
        return { 
          ...c, 
          status: 'Resolved', 
          lastMsg: 'Thread closed by support agent.',
          endTime: endTimeStr,
          duration: dur,
          messages: [...(c.messages || []), { sender: 'credy', text: 'Thread closed by support agent.', time: 'Just now' }]
        };
      }
      return c;
    }));
    alert(`Chat thread ${id} for ${client} has been marked as Resolved.`);
  };

  const handleSendReminder = (id, name, phone) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, status: 'Reminded' } : r));
    alert(`Upcoming payment reminder successfully dispatched to ${name} (${phone}) via SMS & Email!`);
  };

  const handleNotifyOverdue = (id, name, original, penalty, impact) => {
    setOverdues(prev => prev.map(o => o.id === id ? { ...o, status: 'Warning Sent' } : o));
    alert(
      `SYSTEM ALERT: COLLATERAL WARNING DISPATCHED\n\nRecipient: ${name}\nOriginal Due: ${original}\nOverdue Repay Amount (Inc. Penalty): ${penalty}\nCredit Score Impact: ${impact}\n\nCandidate notified of immediate credit score penalty and penalty fee hikes.`
    );
  };

  // 1. FREE CONSULTATION PANEL
  const renderConsultations = () => {
    const filteredConsultations = consultations.filter(ticket => ticket.status === consultFilter);

    return (
      <div style={{ width: '100%' }}>
        <div className="section-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2>Free Consultations Inquiries</h2>
            <p>Connect with prospective borrowers who requested assistance from the Consultation forms.</p>
          </div>
          <div className="consult-filter-group" style={{ display: 'flex', gap: '8px' }}>
            <button 
              className={`btn-action-outline ${consultFilter === 'Pending' ? 'active' : ''}`}
              onClick={() => setConsultFilter('Pending')}
              style={{
                backgroundColor: consultFilter === 'Pending' ? 'var(--primary)' : 'transparent',
                color: consultFilter === 'Pending' ? '#ffffff' : 'var(--admin-text)',
                border: '1px solid var(--admin-border)',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '0.82rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Pending
            </button>
            <button 
              className={`btn-action-outline ${consultFilter === 'Called' ? 'active' : ''}`}
              onClick={() => setConsultFilter('Called')}
              style={{
                backgroundColor: consultFilter === 'Called' ? 'var(--primary)' : 'transparent',
                color: consultFilter === 'Called' ? '#ffffff' : 'var(--admin-text)',
                border: '1px solid var(--admin-border)',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '0.82rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Called
            </button>
          </div>
        </div>

        <div className="table-responsive-admin">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredConsultations.length > 0 ? (
                filteredConsultations.map(ticket => (
                  <tr key={ticket.id}>
                    <td><strong>CNS-{String(ticket.id).padStart(3, '0')}</strong></td>
                    <td>{ticket.name}</td>
                    <td>{ticket.email}</td>
                    <td>{ticket.phone}</td>
                    <td>{ticket.date}</td>
                    <td>
                      <span className={`status-tag ${ticket.status === 'Called' ? 'active' : 'suspended'}`} style={{
                        backgroundColor: ticket.status === 'Called' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(217, 119, 6, 0.1)',
                        color: ticket.status === 'Called' ? '#10b981' : '#d97706',
                        border: ticket.status === 'Called' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(217, 119, 6, 0.2)'
                      }}>
                        {ticket.status}
                      </span>
                    </td>
                    <td>
                      {ticket.status === 'Pending' ? (
                        <button 
                          className="btn-action-status activate"
                          style={{
                            width: '88px',
                            height: '32px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0',
                            cursor: 'pointer'
                          }}
                          onClick={() => setConfirmCallUser({ id: ticket.id, name: ticket.name, phone: ticket.phone })}
                        >
                          Call Now
                        </button>
                      ) : (
                        <span className="contact-check" style={{ color: '#10b981', fontWeight: '700', fontSize: '0.82rem' }}>✓ Called</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: 'var(--admin-text-light)' }}>
                    No {consultFilter.toLowerCase()} consultations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ─── CONFIRM CALL DIALOG MODAL ─── */}
        {confirmCallUser && (
          <div className="recharge-modal-backdrop" onClick={() => setConfirmCallUser(null)}>
            <div className="recharge-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px', textAlign: 'center', padding: '36px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📞</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', color: 'var(--admin-text)' }}>Confirm Outbound Call</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--admin-text-light)', marginBottom: '28px', lineHeight: '1.45' }}>
                Are you sure you want to place a call to <strong>{confirmCallUser.name}</strong> at <strong>{confirmCallUser.phone}</strong>?
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className="recharge-btn-cancel" 
                  onClick={() => setConfirmCallUser(null)}
                >
                  Cancel
                </button>
                <button 
                  className="recharge-btn-submit"
                  onClick={() => {
                    handleResolveTicket(confirmCallUser.id, confirmCallUser.name);
                    setConfirmCallUser(null);
                  }}
                >
                  Confirm & Call
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 2. CHAT SUPPORT PANEL
  const renderChatSupport = () => {
    // 1. Filter chats by Active vs Resolved and Search Query (client name/email)
    const filteredChats = (chats || []).filter(c => {
      const matchesFilter = c.status === chatFilter;
      const matchesSearch = c.client.toLowerCase().includes(chatSearch.toLowerCase()) || 
                            c.email.toLowerCase().includes(chatSearch.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    // 2. Get currently selected active chat
    const activeChat = (chats || []).find(c => c.id === selectedChatId && c.status === 'Active');

    // 3. Handle sending reply message
    const handleSendReply = (e) => {
      e.preventDefault();
      if (!replyInput.trim() || !activeChat) return;

      const newMsg = {
        sender: 'credy', // Admin/Credy reply
        text: replyInput,
        time: 'Just now'
      };

      const updatedMessages = [...(activeChat.messages || []), newMsg];

      setChats(prev => prev.map(c => {
        if (c.id === activeChat.id) {
          return {
            ...c,
            lastMsg: replyInput,
            date: 'Just now',
            messages: updatedMessages
          };
        }
        return c;
      }));

      const sentText = replyInput;
      setReplyInput('');

      // Simulated reply back from the user after 1.5s to keep the interface lively and functional!
      const userMessageText = sentText.toLowerCase();
      setTimeout(() => {
        let simulatedReply = "";
        if (userMessageText.includes("hello") || userMessageText.includes("hi") || userMessageText.includes("hey") || userMessageText.includes("hy")) {
          simulatedReply = "Thank you for joining the chat! Can you help me check my loan eligibility status?";
        } else if (userMessageText.includes("loan") || userMessageText.includes("eligibility") || userMessageText.includes("amount") || userMessageText.includes("lakhs")) {
          simulatedReply = "Awesome. I have uploaded my PAN Card and bank statement. Could you please review and expedite it?";
        } else if (userMessageText.includes("kyc") || userMessageText.includes("document") || userMessageText.includes("upload")) {
          simulatedReply = "Done, I see the verification is pending. Let me know if you need any other documents.";
        } else {
          simulatedReply = "Understood. Thank you for your support, I will wait for further updates.";
        }

        // Only append if the chat is still active and exists
        setChats(prev => prev.map(c => {
          if (c.id === activeChat.id && c.status === 'Active') {
            const currentMsgs = c.messages || [];
            // Only add if the admin was indeed the last sender (avoiding duplicate triggers)
            if (currentMsgs.length > 0 && currentMsgs[currentMsgs.length - 1].sender === 'credy') {
              return {
                ...c,
                lastMsg: simulatedReply,
                date: 'Just now',
                messages: [...currentMsgs, { sender: 'user', text: simulatedReply, time: 'Just now' }]
              };
            }
          }
          return c;
        }));
      }, 1500);
    };

    // 4. Handle exporting the chat log
    const handleExportChat = (chat) => {
      if (!chat) return;
      const messagesText = (chat.messages || []).map(m => {
        const senderLabel = m.sender === 'user' ? chat.client : 'Support Agent (Credy)';
        return `[${m.time || 'N/A'}] ${senderLabel}: ${m.text}`;
      }).join('\n');
      
      const fileContent = `==================================================
LENDOGO CUSTOMER CARE CHAT EXPORT
==================================================
Thread ID:     ${chat.id}
Client Name:   ${chat.client}
Email Contact: ${chat.email}
Chat Status:   ${chat.status}
Started At:    ${chat.startTime || 'N/A'}
Resolved At:   ${chat.endTime || 'N/A'}
Chat Duration: ${chat.duration || 'N/A'}
==================================================

Chat History:
--------------------------------------------------
${messagesText}
--------------------------------------------------
Exported on:   ${new Date().toLocaleString()}
==================================================`;

      const blob = new Blob([fileContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `LendoGo_ChatLog_${chat.id}_${chat.client.replace(/\s+/g, '_')}.txt`;
      link.click();
      URL.revokeObjectURL(url);
    };

    return (
      <div style={{ width: '100%' }}>
        <div className="section-header-row">
          <h2>Customer Support Chat Console</h2>
        </div>

        {/* Tab toggles: Active vs Resolved (History Report) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '20px' }}>
          <div className="admin-chat-tab-toggle" style={{ width: '380px' }}>
            <button 
              className={`admin-chat-tab-btn ${chatFilter === 'Active' ? 'active' : ''}`}
              onClick={() => {
                setChatFilter('Active');
                const firstActive = (chats || []).find(c => c.status === 'Active');
                if (firstActive) setSelectedChatId(firstActive.id);
              }}
            >
              Active Chats
            </button>
            <button 
              className={`admin-chat-tab-btn ${chatFilter === 'Resolved' ? 'active' : ''}`}
              onClick={() => {
                setChatFilter('Resolved');
              }}
            >
              Chat History (Resolved)
            </button>
          </div>

          {/* Search bar */}
          <div className="admin-chat-search" style={{ width: '280px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--admin-text-light)' }}>
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input 
              type="text" 
              className="admin-chat-search-input" 
              placeholder="Search borrower or email..." 
              value={chatSearch}
              onChange={(e) => setChatSearch(e.target.value)}
            />
          </div>
        </div>

        {chatFilter === 'Active' ? (
          /* ACTIVE CHATS: Split layout sidebar + messages pane */
          <div className="admin-chat-layout animate-fade-in">
            <div className="admin-chat-sidebar" style={{ borderTop: 'none' }}>
              <div className="admin-chat-threads-list">
                {filteredChats.length > 0 ? (
                  filteredChats.map(c => {
                    const lastMsgObj = c.messages && c.messages.length > 0 ? c.messages[c.messages.length - 1] : null;
                    const isNewPending = c.status === 'Active' && lastMsgObj && lastMsgObj.sender === 'user';
                    
                    return (
                      <div 
                        key={c.id} 
                        className={`admin-chat-thread-card ${selectedChatId === c.id ? 'active' : ''}`}
                        onClick={() => setSelectedChatId(c.id)}
                      >
                        <img 
                          src={c.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80'} 
                          alt={c.client} 
                          className="admin-chat-thread-avatar"
                        />
                        <div className="admin-chat-thread-info">
                          <div className="admin-chat-thread-top">
                            <span className="admin-chat-thread-name">{c.client}</span>
                            <span className="admin-chat-thread-time">{c.date}</span>
                          </div>
                          <span className="admin-chat-thread-msg" style={{ fontWeight: isNewPending ? '800' : 'normal', color: isNewPending ? 'var(--admin-text)' : 'var(--admin-text-light)' }}>
                            {c.lastMsg}
                          </span>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                            <span className="admin-chat-thread-status active-tag">
                              {c.status}
                            </span>
                            {isNewPending && (
                              <span className="admin-chat-thread-badge">New</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ textAlign: 'center', padding: '24px', color: 'var(--admin-text-light)', fontSize: '0.8rem' }}>
                    No active chats found.
                  </div>
                )}
              </div>
            </div>

            <div className="admin-chat-main">
              {activeChat ? (
                <>
                  {/* Chat Header */}
                  <div className="admin-chat-header">
                    <div className="admin-chat-header-user">
                      <img 
                        src={activeChat.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80'} 
                        alt={activeChat.client} 
                        className="admin-chat-header-avatar"
                      />
                      <div className="admin-chat-header-details">
                        <div className="admin-chat-header-name">{activeChat.client}</div>
                        <div className="admin-chat-header-email">{activeChat.email}</div>
                      </div>
                    </div>

                    <div className="admin-chat-header-actions">
                      <button 
                        className="admin-chat-btn-end" 
                        onClick={() => handleResolveChat(activeChat.id, activeChat.client)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <line x1="9" y1="9" x2="15" y2="15"/>
                          <line x1="15" y1="9" x2="9" y2="15"/>
                        </svg>
                        End Session
                      </button>
                    </div>
                  </div>

                  {/* Messages List Area */}
                  <div className="admin-chat-messages-area">
                    {(activeChat.messages || []).map((m, idx) => (
                      <div key={idx} className={`admin-chat-msg-row ${m.sender === 'user' ? 'user' : 'admin'}`}>
                        <div className="admin-chat-msg-bubble">
                          <div style={{ wordBreak: 'break-word' }}>{m.text}</div>
                          <span className="admin-chat-msg-meta">{m.time || 'Just now'}</span>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Chat Footer Input */}
                  <div className="admin-chat-footer">
                    <form onSubmit={handleSendReply} className="admin-chat-input-wrapper">
                      <input 
                        type="text" 
                        className="admin-chat-input" 
                        placeholder={`Reply to ${activeChat.client}...`}
                        value={replyInput}
                        onChange={(e) => setReplyInput(e.target.value)}
                      />
                      <button type="submit" className="admin-chat-btn-send">
                        Send
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="admin-chat-placeholder animate-fade-in">
                  <span className="admin-chat-placeholder-icon">💬</span>
                  <h3>No Active Chat Selected</h3>
                  <p>Select a borrower support thread from the left list to start responding.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* CHAT HISTORY (RESOLVED): Beautiful table listing details */
          <div className="admin-history-table-container">
            <table className="admin-history-table">
              <thead>
                <tr>
                  <th>Borrower</th>
                  <th>Email Address</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Chat Duration</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredChats.length > 0 ? (
                  filteredChats.map(chat => (
                    <tr key={chat.id}>
                      <td>
                        <div className="admin-history-user-cell">
                          <img 
                            src={chat.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80'} 
                            alt={chat.client} 
                            className="admin-history-avatar"
                          />
                          <div>
                            <strong style={{ color: 'var(--admin-text)', display: 'block' }}>{chat.client}</strong>
                            <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-light)' }}>ID: {chat.id}</span>
                          </div>
                        </div>
                      </td>
                      <td>{chat.email}</td>
                      <td>{chat.startTime || 'N/A'}</td>
                      <td>{chat.endTime || chat.date || 'N/A'}</td>
                      <td>
                        <span className="admin-history-duration-badge">
                          {chat.duration || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button 
                            className="btn-history-view"
                            onClick={() => setViewingHistoryChat(chat)}
                          >
                            Chat History
                          </button>
                          <button 
                            className="btn-action-outline btn-history-export"
                            onClick={() => handleExportChat(chat)}
                            title="Export conversation history"
                            style={{
                              padding: '8px 12px',
                              fontSize: '0.8rem',
                              fontWeight: '700',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              height: '34px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              border: '1.5px solid var(--admin-border)',
                              backgroundColor: 'var(--admin-input)',
                              color: 'var(--admin-text)'
                            }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                              <polyline points="7 10 12 15 17 10"/>
                              <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Export
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '36px', color: 'var(--admin-text-light)' }}>
                      No resolved chat history records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* VIEWING CHAT HISTORY DIALOG / MODAL (WITH EXPORT) */}
        {viewingHistoryChat && (
          <div className="admin-chat-modal-overlay" onClick={() => setViewingHistoryChat(null)}>
            <div className="admin-chat-modal-content" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="admin-chat-header">
                <div className="admin-chat-header-user">
                  <img 
                    src={viewingHistoryChat.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80'} 
                    alt={viewingHistoryChat.client} 
                    className="admin-chat-header-avatar"
                  />
                  <div className="admin-chat-header-details">
                    <div className="admin-chat-header-name">{viewingHistoryChat.client}</div>
                    <div className="admin-chat-header-email">{viewingHistoryChat.email}</div>
                  </div>
                </div>
                <button 
                  className="admin-chat-btn-export" 
                  onClick={() => handleExportChat(viewingHistoryChat)}
                  title="Export conversation history"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Export Log
                </button>
              </div>

              {/* Modal Info Summary */}
              <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--admin-border)', backgroundColor: 'var(--admin-sidebar)', display: 'flex', gap: '20px', fontSize: '0.82rem' }}>
                <div><span style={{ color: 'var(--admin-text)', opacity: 0.75, marginRight: '4px' }}>Started:</span> <strong style={{ color: 'var(--admin-text)' }}>{viewingHistoryChat.startTime || 'N/A'}</strong></div>
                <div><span style={{ color: 'var(--admin-text)', opacity: 0.75, marginRight: '4px' }}>Ended:</span> <strong style={{ color: 'var(--admin-text)' }}>{viewingHistoryChat.endTime || viewingHistoryChat.date || 'N/A'}</strong></div>
                <div><span style={{ color: 'var(--admin-text)', opacity: 0.75, marginRight: '4px' }}>Duration:</span> <strong style={{ color: 'var(--admin-text)' }}>{viewingHistoryChat.duration || 'N/A'}</strong></div>
              </div>

              {/* Modal Messages */}
              <div className="admin-chat-messages-area" style={{ flex: 1, backgroundColor: 'var(--admin-bg)' }}>
                {(viewingHistoryChat.messages || []).map((m, idx) => (
                  <div key={idx} className={`admin-chat-msg-row ${m.sender === 'user' ? 'user' : 'admin'}`}>
                    <div className="admin-chat-msg-bubble">
                      <div style={{ wordBreak: 'break-word' }}>{m.text}</div>
                      <span className="admin-chat-msg-meta">{m.time || 'Just now'}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="admin-chat-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  className="btn-action-outline" 
                  onClick={() => setViewingHistoryChat(null)}
                  style={{ cursor: 'pointer', padding: '10px 18px', borderRadius: '10px', fontSize: '0.85rem' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 3. DUE DATE REMINDERS PANEL
  const renderDueReminders = () => (
    <div style={{ width: '100%' }}>
      <div className="section-header-row">
        <h2>Upcoming Due Date Reminders</h2>
        <p>Proactively alert customer profiles regarding upcoming EMI deadlines to avoid penalty fee assessments.</p>
      </div>

      <div className="table-responsive-admin">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Reminder ID</th>
              <th>Customer Name</th>
              <th>Contact Phone</th>
              <th>Loan Amount</th>
              <th>EMI Due Date</th>
              <th>Days Left</th>
              <th>Alert Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reminders.map(rem => (
              <tr key={rem.id}>
                <td><strong>{rem.id}</strong></td>
                <td>{rem.name}</td>
                <td>{rem.phone}</td>
                <td><strong>{rem.loanAmount}</strong></td>
                <td>{rem.dueDate}</td>
                <td>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '6px', 
                    fontSize: '0.75rem', 
                    fontWeight: '700',
                    backgroundColor: rem.daysRemaining <= 3 ? 'rgba(217, 119, 6, 0.1)' : 'var(--admin-input)',
                    color: rem.daysRemaining <= 3 ? '#d97706' : 'var(--admin-text)',
                    border: rem.daysRemaining <= 3 ? '1px solid rgba(217, 119, 6, 0.2)' : '1px solid var(--admin-border)'
                  }}>
                    {rem.daysRemaining} days left
                  </span>
                </td>
                <td>
                  <span className={`status-tag ${rem.status === 'Reminded' ? 'active' : 'suspended'}`}>
                    {rem.status}
                  </span>
                </td>
                <td>
                  {rem.status === 'Pending Alert' ? (
                    <button 
                      className="btn-action-primary"
                      onClick={() => handleSendReminder(rem.id, rem.name, rem.phone)}
                      style={{ 
                        padding: '6px 12px', 
                        fontSize: '0.8rem', 
                        borderRadius: '6px',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        border: 'none',
                        boxShadow: '0 2px 6px rgba(245,158,11,0.2)'
                      }}
                    >
                      Call / Send Reminder
                    </button>
                  ) : (
                    <span style={{ color: '#10b981', fontSize: '0.82rem', fontWeight: '700' }}>✓ Notification Sent</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 4. OVERDUE & COLLECTIONS PANEL
  const renderOverdueCollections = () => (
    <div style={{ width: '100%' }}>
      <div className="section-header-row" style={{ borderLeft: '4px solid #ef4444', paddingLeft: '15px' }}>
        <h2>Overdue & Collections Directory</h2>
        <p style={{ color: '#ef4444', fontWeight: '600' }}>
          Critical warning zone: Accounts listed here have defaulted on their due date. Penalty rates will automatically increase repay totals and reduce credit bureau scores by the specified impact.
        </p>
      </div>

      <div className="table-responsive-admin">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Defaulted Client</th>
              <th>Phone Number</th>
              <th>Original EMI Due</th>
              <th>Increased Repay Total</th>
              <th>Credit Score Impact</th>
              <th>Overdue Days</th>
              <th>Action Needed</th>
            </tr>
          </thead>
          <tbody>
            {overdues.map(ovd => (
              <tr key={ovd.id}>
                <td><strong style={{ color: '#ef4444' }}>{ovd.id}</strong></td>
                <td><strong>{ovd.name}</strong></td>
                <td>{ovd.phone}</td>
                <td>{ovd.originalDue}</td>
                <td>
                  <strong style={{ color: '#ef4444' }}>{ovd.penaltyDue}</strong>
                  <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-light)' }}>Includes 15% late penalty</div>
                </td>
                <td>
                  <span style={{ 
                    padding: '3px 8px', 
                    borderRadius: '4px', 
                    fontSize: '0.75rem', 
                    fontWeight: '800',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    border: '1px solid rgba(239, 68, 68, 0.2)'
                  }}>
                    {ovd.creditImpact} Bureau Impact
                  </span>
                </td>
                <td>
                  <strong style={{ color: '#ef4444' }}>{ovd.penaltyDays} Days Overdue</strong>
                </td>
                <td>
                  {ovd.status === 'Needs Action' ? (
                    <button 
                      className="btn-action-secondary"
                      onClick={() => handleNotifyOverdue(ovd.id, ovd.name, ovd.originalDue, ovd.penaltyDue, ovd.creditImpact)}
                      style={{ 
                        padding: '6px 12px', 
                        fontSize: '0.8rem', 
                        borderRadius: '6px',
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        color: '#fff',
                        border: 'none',
                        boxShadow: '0 2px 6px rgba(239,68,68,0.2)'
                      }}
                    >
                      Notify Penalty & Call
                    </button>
                  ) : (
                    <span style={{ color: '#ef4444', fontSize: '0.82rem', fontWeight: '700' }}>Final Warning Sent</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="tab-pane-container animate-fade-in">
      {/* Dynamic Sub-tab views based on selection */}
      {(!showOnly || showOnly === 'consultation') && renderConsultations()}
      {showOnly === 'chat' && renderChatSupport()}
      {showOnly === 'reminders' && renderDueReminders()}
      {showOnly === 'collections' && renderOverdueCollections()}
    </div>
  );
};

export default CustomerCareTab;
