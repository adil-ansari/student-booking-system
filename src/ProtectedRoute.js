import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isUserAuthenticated, hasSjsuEmail } = useAuth();

  if (!isUserAuthenticated() || !hasSjsuEmail()) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
