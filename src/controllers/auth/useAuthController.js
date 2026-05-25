import { useState } from 'react';
import { UserModel } from '../../models/UserModel';

/**
 * Controller to handle authentication logic (Sign in, Sign up)
 */
export const useAuthController = () => {
  const [user, setUser] = useState(new UserModel({}));
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
    setUser(new UserModel({}));
  };

  return {
    user,
    loading,
    error,
    signIn,
    signOut
  };
};
