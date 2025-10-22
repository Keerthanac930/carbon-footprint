import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import CarbonCalculator from './components/CarbonCalculator';
import Results from './components/Results';
import DigitalTwinDashboard from './components/DigitalTwinDashboard';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import LoginPage from './components/LoginPage';
import UserDashboard from './components/UserDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import FloatingElements from './components/FloatingElements';
import VoiceAssistant from './components/VoiceAssistant';
import { AuthProvider } from './contexts/AuthContext';
import { initScrollAnimations } from './utils/scrollAnimations';

// New Dashboard Layout Components
import DashboardLayout from './components/Dashboard/DashboardLayout';
import DashboardHome from './components/Dashboard/DashboardHome';
import ResultsPage from './components/Dashboard/ResultsPage';
import NewsFeed from './components/Dashboard/NewsFeed';
import Rewards from './components/Dashboard/Rewards';
import OCRScanner from './components/Dashboard/OCRScanner';
import Chatbot from './components/Dashboard/Chatbot';
import GlobalStats from './components/Dashboard/GlobalStats';
import Goals from './components/Dashboard/Goals';
import Community from './components/Dashboard/Community';
import DigitalAvatar from './components/Dashboard/DigitalAvatar';

const AppContainer = styled.div`
  min-height: 100vh;
  position: relative;
`;

function App() {
  useEffect(() => {
    // Initialize scroll animations when app loads
    initScrollAnimations();
  }, []);

  return (
    <AuthProvider>
      <AppContainer className="scroll-container">
        {/* Climate Change Video Background - YouTube Embed - Full Screen */}
        <iframe 
          className="nature-video-background"
          src="https://www.youtube.com/embed/NSAOrGb9orM?autoplay=1&mute=1&loop=1&playlist=NSAOrGb9orM&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&fs=1&disablekb=1&start=0&end=0"
          title="Climate Change Background Video"
          frameBorder="0"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            width: '100vw',
            height: '100vh',
            minWidth: '100vw',
            minHeight: '100vh',
            zIndex: -3,
            objectFit: 'cover',
            opacity: 0.8,
            filter: 'brightness(1.2) saturate(1.6) contrast(1.3) hue-rotate(15deg)',
            transform: 'translate(-50%, -50%) scale(1.1)',
            pointerEvents: 'none',
            border: 'none',
            outline: 'none'
          }}
        />
        
        {/* Fallback image if video doesn't load */}
        <img 
          src="https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
          alt="Climate change background - Nature fighting for survival" 
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            zIndex: -4,
            display: 'none' // Hidden by default, shown if iframe fails
          }}
        />
        
        {/* Overlay for better text readability */}
        <div className="nature-video-overlay"></div>
        
        <FloatingElements />
        <VoiceAssistant />
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/results" element={<Results />} />
            
            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              {/* Dashboard Home */}
              <Route index element={<DashboardHome />} />
              
              {/* Calculator */}
              <Route path="calculator" element={<CarbonCalculator />} />
              
              {/* Results Page */}
              <Route path="results" element={<ResultsPage />} />
              
              {/* News Feed (Phase 4) */}
              <Route path="news" element={<NewsFeed />} />
              
              {/* Gamification (Phase 5) */}
              <Route path="rewards" element={<Rewards />} />
              
              {/* OCR Scanner (Phase 7) */}
              <Route path="ocr" element={<OCRScanner />} />
              
              {/* AI Chatbot (Phase 8) */}
              <Route path="chat" element={<Chatbot />} />
              
              {/* Global Stats (Phase 9) */}
              <Route path="insights" element={<GlobalStats />} />
              
              {/* Goals (Phase 12) */}
              <Route path="goals" element={<Goals />} />
              
              {/* Community (Phase 13) */}
              <Route path="community" element={<Community />} />
              
              {/* Digital Avatar (Phase 6) */}
              <Route path="avatar" element={<DigitalAvatar />} />
              
              {/* Placeholder routes for future features */}
              <Route path="settings" element={<div className="p-6 text-center text-gray-500">Settings - Coming Soon</div>} />
            </Route>
            
            {/* Legacy Routes (for backward compatibility) */}
            <Route path="/calculator" element={<Navigate to="/dashboard/calculator" replace />} />
            <Route path="/carbon-footprint" element={<Navigate to="/dashboard/calculator" replace />} />
            <Route path="/digital-twin" element={
              <ProtectedRoute>
                <DigitalTwinDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AppContainer>
    </AuthProvider>
  );
}

export default App;
