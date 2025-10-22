import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #14532d 50%, #064e3b 100%)'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '2rem',
          borderRadius: '1rem',
          textAlign: 'center',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            width: '2rem',
            height: '2rem',
            border: '3px solid rgba(76, 175, 80, 0.3)',
            borderTop: '3px solid #4CAF50',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#6b7280', margin: 0 }}>Loading...</p>
        </div>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;
