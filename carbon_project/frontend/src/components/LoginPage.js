import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiUser, FiLock, FiEye, FiEyeOff, FiZap, FiArrowRight, FiGlobe } from 'react-icons/fi';
import CarbonFootprintAPI from '../services/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('session_token');
    if (token) {
      navigate('/dashboard');
    }
    
    // Trigger animation on mount
    setIsVisible(true);
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const api = new CarbonFootprintAPI();
      
      // Login/Register user
      const response = await api.login({
        email: formData.email,
        name: formData.name,
        password: formData.password
      });

      if (response.session_token) {
        // Store session token and user info
        localStorage.setItem('session_token', response.session_token);
        localStorage.setItem('user_info', JSON.stringify(response.user));
        localStorage.setItem('login_time', new Date().toISOString());
        
        setSuccess('Login successful! Redirecting...');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      // Handle different error types
      let errorMsg = 'Login failed. Please check your credentials.';
      if (error.message) {
        errorMsg = error.message;
      } else if (typeof error === 'string') {
        errorMsg = error;
      } else if (error.detail) {
        errorMsg = error.detail;
      }
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymousAccess = () => {
    navigate('/calculator');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Energy Icons */}
        <div className="absolute top-1/4 left-1/4 animate-float">
          <FiZap className="text-eco-green-400/30 text-4xl" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float" style={{ animationDelay: '2s' }}>
          <FiZap className="text-eco-green-300/40 text-3xl" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 animate-float" style={{ animationDelay: '4s' }}>
          <FiZap className="text-eco-green-500/25 text-5xl" />
        </div>
        <div className="absolute bottom-1/3 right-1/3 animate-float" style={{ animationDelay: '1s' }}>
          <FiZap className="text-eco-green-400/35 text-2xl" />
        </div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/6 left-1/6 w-96 h-96 bg-gradient-to-r from-eco-green-500/10 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/6 right-1/6 w-80 h-80 bg-gradient-to-r from-transparent to-eco-green-400/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div 
          className={`w-full max-w-md transform transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
          }`}
        >
          {/* Login Card */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
            {/* Card Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-eco-green-500 to-transparent"></div>
            </div>
            
            {/* Header */}
            <div className="relative z-10 text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-eco-green-500 to-eco-green-600 rounded-2xl mb-4 shadow-lg">
                <FiGlobe className="text-white text-2xl" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Carbon Footprint</h1>
              <p className="text-gray-600 text-sm">Track your environmental impact with precision</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-slide-up">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 animate-slide-up">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                    <p className="text-green-700 text-sm font-medium">{success}</p>
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-gray-700 block">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400 text-lg" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-eco-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-500"
                    required
                  />
                </div>
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-semibold text-gray-700 block">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400 text-lg" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-eco-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-500"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-gray-700 block">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400 text-lg" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-eco-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-500"
                    required
                    minLength="8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                  </button>
                </div>
                
                {/* Password Validation */}
                {formData.password && formData.password.length < 8 && (
                  <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg animate-slide-up">
                    <p className="text-amber-700 text-xs font-medium flex items-center">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></div>
                      Password must be at least 8 characters long
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !formData.password || formData.password.length < 8}
                className="w-full bg-gradient-to-r from-eco-green-500 to-eco-green-600 text-white py-3 px-6 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl hover:from-eco-green-600 hover:to-eco-green-700 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Login / Register</span>
                    <FiArrowRight className="text-lg" />
                  </>
                )}
              </button>
            </form>

            {/* Anonymous Access Link */}
            <div className="relative z-10 mt-6 text-center">
              <button
                onClick={handleAnonymousAccess}
                className="text-gray-500 hover:text-eco-green-600 text-sm font-medium transition-colors duration-200 hover:underline"
              >
                Continue without login (Anonymous)
              </button>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-eco-green-400/20 to-transparent rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-tr from-eco-green-500/15 to-transparent rounded-full blur-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;