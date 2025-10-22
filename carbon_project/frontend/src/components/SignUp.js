import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiUser, FiLock, FiEye, FiEyeOff, FiArrowRight, FiGlobe } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const SignUp = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Trigger animation on mount
    setIsVisible(true);
    clearError();
  }, [clearError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation errors when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    clearError();
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.name) {
      errors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await register({
        email: formData.email,
        name: formData.name,
        password: formData.password
      });

      if (result.success) {
        // Show success message
        setSuccessMessage(result.message || 'Registration successful!');
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      }
      // Error is already displayed via the AuthContext error state
    } catch (error) {
      console.error('Registration error:', error);
      // Error is already handled by AuthContext and displayed in the form
    }
  };

  const handleSignInClick = () => {
    navigate('/signin');
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
          <FiGlobe />
        </div>
        <div style={{
          position: 'absolute',
          top: '33%',
          right: '25%',
          animation: 'float 6s ease-in-out infinite 2s',
          color: 'rgba(76, 175, 80, 0.4)',
          fontSize: '1.5rem'
        }}>
          <FiGlobe />
        </div>
        <div style={{
          position: 'absolute',
          bottom: '25%',
          left: '33%',
          animation: 'float 6s ease-in-out infinite 4s',
          color: 'rgba(76, 175, 80, 0.25)',
          fontSize: '2.5rem'
        }}>
          <FiGlobe />
        </div>
        <div style={{
          position: 'absolute',
          bottom: '33%',
          right: '33%',
          animation: 'float 6s ease-in-out infinite 1s',
          color: 'rgba(76, 175, 80, 0.35)',
          fontSize: '1.25rem'
        }}>
          <FiGlobe />
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
          {/* Sign Up Card */}
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
                <FiUser style={{ color: 'white', fontSize: '1.5rem' }} />
              </div>
              <h1 style={{
                fontSize: '1.875rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '0.5rem',
                margin: 0
              }}>Create Account</h1>
              <p style={{
                color: '#6b7280',
                fontSize: '0.875rem',
                margin: 0
              }}>Join us to track your carbon footprint</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{
              position: 'relative',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              {/* Success Message */}
              {successMessage && (
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
                    }}>{successMessage}</p>
                  </div>
                </div>
              )}

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
                      border: validationErrors.email ? '1px solid #ef4444' : '1px solid #e5e7eb',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(4px)',
                      color: '#1f2937',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = validationErrors.email ? '#ef4444' : '#4CAF50';
                      e.target.style.boxShadow = validationErrors.email ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : '0 0 0 3px rgba(76, 175, 80, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = validationErrors.email ? '#ef4444' : '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  />
                </div>
                {validationErrors.email && (
                  <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: 0 }}>
                    {validationErrors.email}
                  </p>
                )}
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
                      border: validationErrors.name ? '1px solid #ef4444' : '1px solid #e5e7eb',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(4px)',
                      color: '#1f2937',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = validationErrors.name ? '#ef4444' : '#4CAF50';
                      e.target.style.boxShadow = validationErrors.name ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : '0 0 0 3px rgba(76, 175, 80, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = validationErrors.name ? '#ef4444' : '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  />
                </div>
                {validationErrors.name && (
                  <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: 0 }}>
                    {validationErrors.name}
                  </p>
                )}
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
                      border: validationErrors.password ? '1px solid #ef4444' : '1px solid #e5e7eb',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(4px)',
                      color: '#1f2937',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = validationErrors.password ? '#ef4444' : '#4CAF50';
                      e.target.style.boxShadow = validationErrors.password ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : '0 0 0 3px rgba(76, 175, 80, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = validationErrors.password ? '#ef4444' : '#e5e7eb';
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
                {validationErrors.password && (
                  <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: 0 }}>
                    {validationErrors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label htmlFor="confirmPassword" style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Confirm Password
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
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    style={{
                      width: '100%',
                      paddingLeft: '3rem',
                      paddingRight: '3rem',
                      paddingTop: '0.75rem',
                      paddingBottom: '0.75rem',
                      border: validationErrors.confirmPassword ? '1px solid #ef4444' : '1px solid #e5e7eb',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(4px)',
                      color: '#1f2937',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = validationErrors.confirmPassword ? '#ef4444' : '#4CAF50';
                      e.target.style.boxShadow = validationErrors.confirmPassword ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : '0 0 0 3px rgba(76, 175, 80, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = validationErrors.confirmPassword ? '#ef4444' : '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: 0 }}>
                    {validationErrors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  background: isLoading 
                    ? 'linear-gradient(135deg, #9ca3af, #6b7280)' 
                    : 'linear-gradient(135deg, #4CAF50, #45a049)',
                  color: 'white',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                  paddingLeft: '1rem',
                  paddingRight: '1rem',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transform: 'translateY(0)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.375rem'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(76, 175, 80, 0.3)';
                }}
              >
                {isLoading ? (
                  <>
                    <div style={{
                      width: '1rem',
                      height: '1rem',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <FiArrowRight style={{ fontSize: '1rem' }} />
                  </>
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <div style={{
              position: 'relative',
              zIndex: 10,
              marginTop: '1.5rem',
              textAlign: 'center'
            }}>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>
                Already have an account?
              </p>
              <button
                onClick={handleSignInClick}
                style={{
                  color: '#4CAF50',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#45a049';
                  e.target.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#4CAF50';
                  e.target.style.textDecoration = 'none';
                }}
              >
                Sign In
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

export default SignUp;
