import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthController } from '../controllers/auth/useAuthController';

export const PublicRoute = ({ children }) => {
  const { user } = useAuthController();

  if (user && user.isAuthenticated) {
    if (user.role === 'admin' || user.email === 'admin@gmail.com') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/home" replace />;
  }

  return children;
};
