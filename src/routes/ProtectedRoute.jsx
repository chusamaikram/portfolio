import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center text-cyan-400">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20 animate-ping" />
          <div className="w-16 h-16 rounded-full border-2 border-t-cyan-400 border-r-transparent border-b-cyan-500 border-l-transparent animate-spin" />
        </div>
        <div className="text-xs tracking-widest uppercase font-mono text-cyan-400/80">
          VERIFYING ACCESS CREDENTIALS...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Preserve attempted destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
