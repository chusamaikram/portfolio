import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import GuestRoute from './routes/GuestRoute.jsx';
import HomePage from './features/home/HomePage.jsx';
import LoginPage from './features/auth/LoginPage.jsx';
import AdminDashboard from './features/dashboard/AdminDashboard.jsx';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Portfolio Route */}
          <Route path="/" element={<HomePage />} />

          {/* Guest-only Login Gateway */}
          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />

          {/* Protected Admin Control Center */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global High-Tech Toaster */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#080e1e',
              border: '1px solid rgba(34, 211, 238, 0.3)',
              color: '#f8fafc',
              fontFamily: 'Inter, system-ui, sans-serif',
              boxShadow: '0 0 25px rgba(0, 0, 0, 0.6)',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
