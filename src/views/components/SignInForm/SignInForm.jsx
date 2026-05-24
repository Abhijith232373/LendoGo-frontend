import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignInForm.css';

const SignInForm = ({ onSignIn, loading, error }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignIn(email, password);
  };

  return (
    <div className="signin-container">
      <div className="badge">
        <span className="badge-text">Instant Personal Loans Starting at Just 14%</span>
      </div>
      
      <h1 className="welcome-title">Welcome to LendoGO</h1>
      <p className="welcome-subtitle">Sign in to your account and manage your loans effortlessly.</p>
      
      <form className="signin-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <input 
            type="email" 
            placeholder="Enter your email address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
        </div>
        
        <div className="input-group">
          <input 
            type="password" 
            placeholder="Enter your password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button 
          type="submit" 
          className="btn-submit"
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      
      <div className="signup-link">
        <span>New to LendoGO? </span>
        <button
          type="button"
          className="create-account-btn"
          onClick={() => navigate('/signup')}
        >
          Create an account
        </button>
      </div>
    </div>
  );
};

export default SignInForm;
