import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService, { getAccessToken } from '../services/auth.service.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setTokenState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and verify authentication session on mount
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const storedUser = authService.getStoredUser();
        const activeToken = getAccessToken();

        if (storedUser) {
          if (isMounted) {
            setUser(storedUser);
            if (activeToken) setTokenState(activeToken);
          }

          // Try silent token refresh in background to confirm valid session
          try {
            const freshToken = await authService.refreshToken();
            if (freshToken && isMounted) {
              setTokenState(freshToken);
            }
          } catch {
            // If offline demo user is stored, preserve demo session
            if (storedUser.mode?.includes('Mock')) {
              // keep user
            } else {
              // unverified session
            }
          }
        }
      } catch (err) {
        console.warn('Initial session hydration completed with status:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initializeAuth();

    // Catch 401 authorization revocation events from axios interceptors
    const handleUnauthorized = () => {
      if (isMounted) {
        setUser(null);
        setTokenState(null);
      }
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      isMounted = false;
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = useCallback(async (username, password) => {
    setIsLoading(true);
    try {
      const { user: loggedInUser, token } = await authService.login({
        username,
        password,
      });
      setUser(loggedInUser);
      setTokenState(token);
      return loggedInUser;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setTokenState(null);
      setIsLoading(false);
    }
  }, []);

  const isAuthenticated = Boolean(user);

  const value = {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
