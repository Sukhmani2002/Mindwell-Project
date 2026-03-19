import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center page-bg">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sage-300 border-t-sage-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-display text-sage-600 text-lg">Loading MindWell...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
