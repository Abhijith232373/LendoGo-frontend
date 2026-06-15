import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthController } from '../controllers/auth/useAuthController';

export const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user } = useAuthController();

  if (!user || !user.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && user.role !== 'admin' && user.email !== 'admin@gmail.com') {
    return <Navigate to="/home" replace />;
  }

  return children;
};
