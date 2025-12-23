/**
 * Theme Configuration
 * Modern eco-friendly color palette matching mobile app
 */

export const theme = {
  // Primary Colors
  primaryGreen: '#10B981', // Emerald
  secondaryTeal: '#14B8A6', // Teal
  accentBlue: '#06B6D4', // Cyan
  darkGreen: '#059669',
  lightGreen: '#34D399',
  
  // Status Colors
  successGreen: '#10B981',
  warningYellow: '#F59E0B',
  errorRed: '#EF4444',
  infoBlue: '#3B82F6',
  
  // Dark Theme Colors
  darkSurface: '#1F2937',
  darkSurfaceVariant: '#374151',
  darkBackground: '#111827',
  darkOnSurface: '#F9FAFB',
  
  // Light Theme Colors
  lightSurface: '#FFFFFF',
  lightSurfaceVariant: '#F3F4F6',
  lightBackground: '#F9FAFB',
  lightOnSurface: '#111827',
  
  // Gradients
  ecoGradient: 'linear-gradient(135deg, #10B981 0%, #14B8A6 50%, #06B6D4 100%)',
  darkEcoGradient: 'linear-gradient(135deg, #059669 0%, #0891B2 50%, #0284C7 100%)',
  
  // Typography
  fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  
  // Spacing
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
  },
  
  // Border Radius
  borderRadius: {
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  
  // Get severity color based on CO2 value
  getSeverityColor: (emissionsTons, isDark = false) => {
    if (emissionsTons < 2.0) return theme.successGreen;
    if (emissionsTons < 4.0) return theme.warningYellow;
    return theme.errorRed;
  },
};

export default theme;

