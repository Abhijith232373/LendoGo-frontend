import React, { createContext, useContext, useState } from 'react';
import { UserModel } from '../../models/UserModel';
import { apiClient } from '../../utils/apiClient';

const AuthContext = createContext(null);

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
      const data = await apiClient('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      // 👇 FIX: Handle Go's nested "data" response
      const backendUser = data.data || data;

      const loggedInUser = new UserModel({
        id: backendUser.id || 'unknown',
        email: backendUser.email || email,
        name: backendUser.fullName || backendUser.name || 'LendoGO User', // Map Go's snake_case
        role: backendUser.role || 'user',              // Capture the role!
        permissions: backendUser.permissions || {},    // Capture permissions!
        isAuthenticated: true,
      });
      
      localStorage.setItem('lendogo_user', JSON.stringify(loggedInUser));
      if (data.token) {
        localStorage.setItem('lendogo_token', data.token);
      }
      setUser(loggedInUser);
      
      // 👇 FIX: Return the user so SignInForm can use it for routing
      return loggedInUser; 
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
    // Purge all cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
    });
    // Purge all localStorage keys to leave no trace of previous user data
    localStorage.clear();
    setUser(new UserModel({}));
  };

  const loginUserLocally = (userData) => {
    const loggedInUser = new UserModel({
      id: userData.id || 'unknown',
      email: userData.email,
      name: userData.name || userData.fullName || 'LendoGO User',
      role: userData.role || 'user',
      permissions: userData.permissions || {},
      isAuthenticated: true,
    });
    localStorage.setItem('lendogo_user', JSON.stringify(loggedInUser));
    if (userData.token) {
      localStorage.setItem('lendogo_token', userData.token);
    }
    setUser(loggedInUser);
  };

  return React.createElement(
    AuthContext.Provider,
    { value: { user, loading, error, signIn, signOut, loginUserLocally, setUser } },
    children
  );
};

export const useAuthController = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthController must be used within an AuthProvider');
  }
  return context;
};