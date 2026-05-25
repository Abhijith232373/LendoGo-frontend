import React, { createContext, useContext, useState } from 'react';
import { UserModel } from '../../models/UserModel';

const AuthContext = createContext(null);

/**
 * Global authentication state provider.
 * Keeps user session persistent across page reloads via localStorage.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('lendogo_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.isAuthenticated) {
          return new UserModel(parsed);
        }
      } catch (e) {
        console.error("Error parsing saved user from localStorage:", e);
      }
    }
    return new UserModel({});
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signIn = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const rawText = await response.text();
      let data = {};
      try {
        data = JSON.parse(rawText);
      } catch {
        console.error("Non-JSON response from login server:", rawText);
        const errMsg = `Server error (${response.status})`;
        setError(errMsg);
        throw new Error(errMsg);
      }

      if (response.ok) {
        const loggedInUser = new UserModel({
          id: data.id || 'unknown',
          email: data.email || email,
          name: data.name || 'LendoGO User',
          isAuthenticated: true,
        });
        
        localStorage.setItem('lendogo_user', JSON.stringify(loggedInUser));
        setUser(loggedInUser);
        return loggedInUser;
      } else {
        const errMsg = data.error || 'Invalid email or password';
        setError(errMsg);
        throw new Error(errMsg);
      }
    } catch (err) {
      const errMsg = err.message === 'Failed to fetch' || err.message.includes('network')
        ? 'Could not connect to the authentication server. Please check if the backend is running.'
        : err.message || 'An error occurred during sign in.';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem('lendogo_user');
    setUser(new UserModel({}));
  };

  /**
   * Helper function for the registration page to automatically sign in
   * the user on client-side right after setting a password.
   */
  const loginUserLocally = (userData) => {
    const loggedInUser = new UserModel({
      id: userData.id || 'unknown',
      email: userData.email,
      name: userData.name || 'LendoGO User',
      isAuthenticated: true,
    });
    localStorage.setItem('lendogo_user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  };

  // 👇 Use React.createElement to prevent JSX syntax errors in pure JS files
  return React.createElement(
    AuthContext.Provider,
    { value: { user, loading, error, signIn, signOut, loginUserLocally, setUser } },
    children
  );
};

/**
 * Custom hook to consume the global authentication state
 */
export const useAuthController = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthController must be used within an AuthProvider');
  }
  return context;
};
