import React, { createContext, useContext, useState, useEffect } from 'react';
import CarbonFootprintAPI from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is already logged in on app start
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('session_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const api = new CarbonFootprintAPI();
      const userData = await api.getCurrentUser();
      
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('session_token');
        localStorage.removeItem('user_info');
        localStorage.removeItem('login_time');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid token
      localStorage.removeItem('session_token');
      localStorage.removeItem('user_info');
      localStorage.removeItem('login_time');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      setError('');
      
      const api = new CarbonFootprintAPI();
      const response = await api.login(credentials);

      if (response.session_token) {
        // Store session data
        localStorage.setItem('session_token', response.session_token);
        localStorage.setItem('user_info', JSON.stringify(response.user));
        localStorage.setItem('login_time', new Date().toISOString());
        
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true, user: response.user };
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'Login failed. Please check your connection and try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      setError('');
      
      const api = new CarbonFootprintAPI();
      const response = await api.register(userData);

      if (response) {
        // Registration successful - don't auto-login, just return success
        return { 
          success: true, 
          message: 'Registration successful! Please login with your credentials.',
          user: response 
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.message || 'Registration failed. Please check your connection and try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const api = new CarbonFootprintAPI();
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem('session_token');
      localStorage.removeItem('user_info');
      localStorage.removeItem('login_time');
      
      setUser(null);
      setIsAuthenticated(false);
      setError('');
    }
  };

  const clearError = () => {
    setError('');
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
