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
    
    // Mocking an API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!email || !password) {
          const err = 'Email and password are required.';
          setError(err);
          setLoading(false);
          reject(err);
          return;
        }

        // Mock success
        const loggedInUser = new UserModel({
          id: '123',
          email,
          name: 'LendoGO User',
          isAuthenticated: true,
        });
        
        setUser(loggedInUser);
        setLoading(false);
        resolve(loggedInUser);
      }, 1000); // 1 second delay
    });
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
