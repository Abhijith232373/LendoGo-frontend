import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthController } from '../../../controllers/auth/useAuthController';
import './ChatWidget.css';
import askCredyAvatar from '../../../assets/ask_credy_avatar.webp';

const ChatWidget = () => {
  const { user } = useAuthController();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const chatBodyRef = useRef(null);

  // Initialize and load chat history when user changes or logs in
  useEffect(() => {
    if (user && user.isAuthenticated && user.id) {
      const storageKey = `lendogo_user_chat_messages_${user.id}`;
      const savedMessages = localStorage.getItem(storageKey);
      if (savedMessages) {
        try {
          setMessages(JSON.parse(savedMessages));
        } catch (e) {
          console.error("Error parsing saved chat messages:", e);
          initializeDefaultChat();
        }
      } else {
        initializeDefaultChat();
      }
    } else {
      setMessages([]);
      setIsOpen(false);
    }
  }, [user]);

  // Scroll to bottom whenever messages or typing state changes
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  const initializeDefaultChat = () => {
    const defaultMsgs = [
      {
        id: 'msg-init-1',
        sender: 'credy',
        text: 'Hello! I am Credy, your virtual assistant.',
        timestamp: new Date().toISOString()
      },
      {
        id: 'msg-init-2',
        sender: 'credy',
        text: 'How can I help you today? You can ask me about your loan applications, repayment status, or check interest rates!',
        timestamp: new Date().toISOString()
      }
    ];
    setMessages(defaultMsgs);
    if (user && user.id) {
      localStorage.setItem(`lendogo_user_chat_messages_${user.id}`, JSON.stringify(defaultMsgs));
    }
  };

  // Only render if user is authenticated/logged in, and is NOT on an admin page/role
  if (!user || !user.isAuthenticated || user.role === 'admin' || location.pathname.startsWith('/admin')) {
    return null;
  }

  const handleOpenChat = () => {
    setIsClosing(false);
    setIsOpen(true);
  };

  const handleCloseChat = () => {
    setIsClosing(true);
    // Wait for the slideOut animation to complete before unmounting/hiding
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 490); // Matches the CSS transition duration
  };

  const saveMessages = (updatedMsgs) => {
    setMessages(updatedMsgs);
    localStorage.setItem(`lendogo_user_chat_messages_${user.id}`, JSON.stringify(updatedMsgs));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: inputValue,
      timestamp: new Date().toISOString()
    };

    const updatedMsgs = [...messages, userMsg];
    saveMessages(updatedMsgs);
    const queryText = inputValue.toLowerCase().trim();
    setInputValue('');

    // Only trigger greeting response for basic greetings
    const isGreeting = ['hi', 'hello', 'hey', 'hy'].some(g => queryText.includes(g));
    if (isGreeting) {
      simulateCredyResponse(updatedMsgs);
    }
  };

  const simulateCredyResponse = (currentMsgs) => {
    setIsTyping(true);

    setTimeout(() => {
      const replyText = `Hello, ${user.name || 'User'}! I hope you are having a wonderful day. How can I assist you today?`;

      const credyReply = {
        id: `msg-credy-${Date.now()}`,
        sender: 'credy',
        text: replyText,
        timestamp: new Date().toISOString()
      };

      setIsTyping(false);
      saveMessages([...currentMsgs, credyReply]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Action Button (FAB) */}
      {!isOpen && (
        <button 
          className="credy-chat-fab" 
          onClick={handleOpenChat}
          title="Ask Credy Support"
          aria-label="Ask Credy Support"
        >
          <img src={askCredyAvatar} alt="Credy Avatar" className="credy-chat-fab-img" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`credy-chat-window ${isClosing ? 'closing' : ''}`}>
          {/* Header */}
          <div className="credy-chat-header">
            <h3 className="credy-chat-title">Ask Credy</h3>
            <p className="credy-chat-subtitle">How can I help you today?</p>
            
            <div className="credy-chat-header-avatar">
              <img src={askCredyAvatar} alt="Credy Avatar" />
            </div>

            <button 
              type="button" 
              className="credy-chat-close-btn" 
              onClick={handleCloseChat}
              aria-label="Close Chat Window"
            >
              &times;
            </button>
          </div>

          {/* Messages Body */}
          <div className="credy-chat-body" ref={chatBodyRef}>
            {messages.map((msg) => (
              <div key={msg.id} className={`credy-msg-row ${msg.sender}`}>
                <div className="credy-msg-bubble">
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="credy-msg-row credy">
                <div className="credy-typing-bubble">
                  <span className="credy-typing-dot"></span>
                  <span className="credy-typing-dot"></span>
                  <span className="credy-typing-dot"></span>
                </div>
              </div>
            )}
          </div>

          {/* Footer Input Bar */}
          <form className="credy-chat-footer" onSubmit={handleSendMessage}>
            <div className="credy-chat-input-wrapper">
              <input 
                type="text" 
                className="credy-chat-input" 
                placeholder="Type your message.." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                maxLength={500}
              />
              <button 
                type="submit" 
                className="credy-chat-send-btn" 
                disabled={!inputValue.trim()}
                title="Send Message"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
