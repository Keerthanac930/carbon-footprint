import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Dashboard Pages
import DashboardHome from './components/Dashboard/DashboardHome.jsx';
import CalculatorPage from './components/Dashboard/CalculatorPage';
import ResultsPage from './components/Dashboard/ResultsPage';
import NewsFeed from './components/Dashboard/NewsFeed';
import Rewards from './components/Dashboard/Rewards';
import OCRScanner from './components/Dashboard/OCRScanner';
import Chatbot from './components/Dashboard/Chatbot';
import GlobalStats from './components/Dashboard/GlobalStats';
import Goals from './components/Dashboard/Goals';
import Community from './components/Dashboard/Community';
import DigitalAvatar from './components/Dashboard/DigitalAvatar';
import Marketplace from './components/Dashboard/Marketplace';
import VoiceAssistantPage from './components/Dashboard/VoiceAssistant';
import AdminPanel from './components/Dashboard/AdminPanel';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes - Clean gradient backgrounds */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Dashboard Routes - Video background in layout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard Home */}
            <Route index element={<DashboardHome />} />
            
            {/* Core Features */}
            <Route path="calculator" element={<CalculatorPage />} />
            <Route path="results" element={<ResultsPage />} />
            <Route path="news" element={<NewsFeed />} />
            
            {/* Gamification & Progress */}
            <Route path="rewards" element={<Rewards />} />
            <Route path="goals" element={<Goals />} />
            
            {/* Tools */}
            <Route path="ocr" element={<OCRScanner />} />
            <Route path="chat" element={<Chatbot />} />
            <Route path="voice" element={<VoiceAssistantPage />} />
            
            {/* Analytics & Community */}
            <Route path="insights" element={<GlobalStats />} />
            <Route path="community" element={<Community />} />
            
            {/* Advanced Features */}
            <Route path="avatar" element={<DigitalAvatar />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="admin" element={<AdminPanel />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Legacy Routes Redirect */}
          <Route path="/signin" element={<Navigate to="/login" replace />} />
          <Route path="/signup" element={<Navigate to="/register" replace />} />
          <Route path="/calculator" element={<Navigate to="/dashboard/calculator" replace />} />
          
          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
