import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const GuestRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center text-cyan-400">
        <div className="w-12 h-12 rounded-full border-2 border-t-cyan-400 border-r-transparent border-b-cyan-500 border-l-transparent animate-spin mb-3" />
        <div className="text-xs tracking-widest uppercase font-mono text-cyan-400/80">
          INITIALIZING SECURITY GATEWAY...
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    // If user arrived with a redirect state, return them there, otherwise to /dashboard
    const origin = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={origin} replace />;
  }

  return children;
};

export default GuestRoute;
