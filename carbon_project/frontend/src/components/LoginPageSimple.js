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
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #0f172a 0%, #14532d 50%, #064e3b 100%)',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Animated Background Elements */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {/* Floating Energy Icons */}
        <div style={{
          position: 'absolute',
          top: '25%',
          left: '25%',
          animation: 'float 6s ease-in-out infinite',
          color: 'rgba(76, 175, 80, 0.3)',
          fontSize: '2rem'
        }}>
          <FiZap />
        </div>
        <div style={{
          position: 'absolute',
          top: '33%',
          right: '25%',
          animation: 'float 6s ease-in-out infinite 2s',
          color: 'rgba(76, 175, 80, 0.4)',
          fontSize: '1.5rem'
        }}>
          <FiZap />
        </div>
        <div style={{
          position: 'absolute',
          bottom: '25%',
          left: '33%',
          animation: 'float 6s ease-in-out infinite 4s',
          color: 'rgba(76, 175, 80, 0.25)',
          fontSize: '2.5rem'
        }}>
          <FiZap />
        </div>
        <div style={{
          position: 'absolute',
          bottom: '33%',
          right: '33%',
          animation: 'float 6s ease-in-out infinite 1s',
          color: 'rgba(76, 175, 80, 0.35)',
          fontSize: '1.25rem'
        }}>
          <FiZap />
        </div>
        
        {/* Gradient Orbs */}
        <div style={{
          position: 'absolute',
          top: '16%',
          left: '16%',
          width: '24rem',
          height: '24rem',
          background: 'linear-gradient(to right, rgba(76, 175, 80, 0.1), transparent)',
          borderRadius: '50%',
          filter: 'blur(3rem)',
          animation: 'pulse 3s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '16%',
          right: '16%',
          width: '20rem',
          height: '20rem',
          background: 'linear-gradient(to right, transparent, rgba(76, 175, 80, 0.15))',
          borderRadius: '50%',
          filter: 'blur(3rem)',
          animation: 'pulse 3s ease-in-out infinite 1.5s'
        }}></div>
      </div>

      {/* Main Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '1rem'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '28rem',
          transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(2rem) scale(0.95)',
          opacity: isVisible ? 1 : 0,
          transition: 'all 0.7s ease-out'
        }}>
          {/* Login Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '1.5rem',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '2rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Card Background Pattern */}
            <div style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.05,
              background: 'linear-gradient(135deg, #4CAF50, transparent)'
            }}></div>
            
            {/* Header */}
            <div style={{
              position: 'relative',
              zIndex: 10,
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '4rem',
                height: '4rem',
                background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                borderRadius: '1rem',
                marginBottom: '1rem',
                boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
              }}>
                <FiGlobe style={{ color: 'white', fontSize: '1.5rem' }} />
              </div>
              <h1 style={{
                fontSize: '1.875rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '0.5rem',
                margin: 0
              }}>Carbon Footprint</h1>
              <p style={{
                color: '#6b7280',
                fontSize: '0.875rem',
                margin: 0
              }}>Track your environmental impact with precision</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{
              position: 'relative',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              {/* Error Message */}
              {error && (
                <div style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '0.75rem',
                  padding: '1rem',
                  animation: 'slideUp 0.3s ease-out'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '0.5rem',
                      height: '0.5rem',
                      background: '#ef4444',
                      borderRadius: '50%',
                      marginRight: '0.75rem'
                    }}></div>
                    <p style={{
                      color: '#b91c1c',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      margin: 0
                    }}>{error}</p>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '0.75rem',
                  padding: '1rem',
                  animation: 'slideUp 0.3s ease-out'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '0.5rem',
                      height: '0.5rem',
                      background: '#22c55e',
                      borderRadius: '50%',
                      marginRight: '0.75rem',
                      animation: 'pulse 1s ease-in-out infinite'
                    }}></div>
                    <p style={{
                      color: '#15803d',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      margin: 0
                    }}>{success}</p>
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label htmlFor="email" style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '1rem',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                    fontSize: '1.125rem',
                    pointerEvents: 'none'
                  }}>
                    <FiMail />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    style={{
                      width: '100%',
                      paddingLeft: '3rem',
                      paddingRight: '1rem',
                      paddingTop: '0.75rem',
                      paddingBottom: '0.75rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(4px)',
                      color: '#1f2937',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#4CAF50';
                      e.target.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  />
                </div>
              </div>

              {/* Name Field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label htmlFor="name" style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '1rem',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                    fontSize: '1.125rem',
                    pointerEvents: 'none'
                  }}>
                    <FiUser />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    style={{
                      width: '100%',
                      paddingLeft: '3rem',
                      paddingRight: '1rem',
                      paddingTop: '0.75rem',
                      paddingBottom: '0.75rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(4px)',
                      color: '#1f2937',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#4CAF50';
                      e.target.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label htmlFor="password" style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '1rem',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                    fontSize: '1.125rem',
                    pointerEvents: 'none'
                  }}>
                    <FiLock />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    style={{
                      width: '100%',
                      paddingLeft: '3rem',
                      paddingRight: '3rem',
                      paddingTop: '0.75rem',
                      paddingBottom: '0.75rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(4px)',
                      color: '#1f2937',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#4CAF50';
                      e.target.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                    minLength="8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: '1rem',
                      transform: 'translateY(-50%)',
                      color: '#9ca3af',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1.125rem',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#6b7280'}
                    onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                
                {/* Password Validation */}
                {formData.password && formData.password.length < 8 && (
                  <div style={{
                    marginTop: '0.5rem',
                    padding: '0.75rem',
                    background: '#fffbeb',
                    border: '1px solid #fed7aa',
                    borderRadius: '0.5rem',
                    animation: 'slideUp 0.3s ease-out'
                  }}>
                    <p style={{
                      color: '#d97706',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      margin: 0,
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <div style={{
                        width: '0.375rem',
                        height: '0.375rem',
                        background: '#f59e0b',
                        borderRadius: '50%',
                        marginRight: '0.5rem'
                      }}></div>
                      Password must be at least 8 characters long
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !formData.password || formData.password.length < 8}
                style={{
                  width: '100%',
                  background: isLoading || !formData.password || formData.password.length < 8 
                    ? 'linear-gradient(135deg, #9ca3af, #6b7280)' 
                    : 'linear-gradient(135deg, #4CAF50, #45a049)',
                  color: 'white',
                  paddingTop: '0.75rem',
                  paddingBottom: '0.75rem',
                  paddingLeft: '1.5rem',
                  paddingRight: '1.5rem',
                  borderRadius: '0.75rem',
                  fontWeight: '600',
                  fontSize: '1rem',
                  boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                  border: 'none',
                  cursor: isLoading || !formData.password || formData.password.length < 8 ? 'not-allowed' : 'pointer',
                  transform: 'translateY(0)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading && formData.password && formData.password.length >= 8) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(76, 175, 80, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
                }}
              >
                {isLoading ? (
                  <>
                    <div style={{
                      width: '1.25rem',
                      height: '1.25rem',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Login / Register</span>
                    <FiArrowRight style={{ fontSize: '1.125rem' }} />
                  </>
                )}
              </button>
            </form>

            {/* Anonymous Access Link */}
            <div style={{
              position: 'relative',
              zIndex: 10,
              marginTop: '1.5rem',
              textAlign: 'center'
            }}>
              <button
                onClick={handleAnonymousAccess}
                style={{
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#4CAF50';
                  e.target.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#6b7280';
                  e.target.style.textDecoration = 'none';
                }}
              >
                Continue without login (Anonymous)
              </button>
            </div>

            {/* Decorative Elements */}
            <div style={{
              position: 'absolute',
              top: '-1rem',
              right: '-1rem',
              width: '6rem',
              height: '6rem',
              background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.2), transparent)',
              borderRadius: '50%',
              filter: 'blur(1rem)'
            }}></div>
            <div style={{
              position: 'absolute',
              bottom: '-1rem',
              left: '-1rem',
              width: '5rem',
              height: '5rem',
              background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.15), transparent)',
              borderRadius: '50%',
              filter: 'blur(0.75rem)'
            }}></div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        input::placeholder {
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
