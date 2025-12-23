/**
 * ====================================================================
 * ECOTRACKER DASHBOARD - CLEAN & ORGANIZED DESIGN
 * ====================================================================
 * 
 * A beautifully crafted, responsive dashboard featuring:
 * - Neat white cards with consistent styling
 * - Grid layout: 3 columns (large), 2 columns (medium), 1 column (mobile)
 * - Smooth hover effects and animations
 * - Eco-friendly color scheme (greens and blues)
 * - Professional top navbar with profile dropdown
 * - No clutter, perfect spacing
 * 
 * Author: EcoTracker Team
 * Last Updated: October 2025
 * ====================================================================
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Calculator,        // Carbon Calculator icon
  TrendingUp,        // Results & History icon
  Newspaper,         // News Feed icon
  MessageCircle,     // Chatbot icon
  BarChart3,         // Insights icon
  Users,             // Community icon
  ShoppingCart,      // Marketplace icon
  User,              // Profile icon
  LogOut,            // Logout icon
  ArrowRight,        // Button arrow icon
  Leaf,              // Sustainability icon
  Globe,             // Earth/Global icon
  ChevronDown        // Dropdown icon
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import CarbonFootprintAPI from '../../services/api';
import localStorageService from '../../services/localStorageService';

const DashboardHome = () => {
  // ==================== STATE MANAGEMENT ====================
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Dashboard statistics
  const [stats, setStats] = useState({
    totalCalculations: 0,
    thisMonthEmissions: 0,
    lastMonthEmissions: 0,
    activeDays: 0,
    badges: 0,
    latestEmissions: 0,
    totalPoints: 0,
    currentStreak: 0,
  });
  
  // Loading state for data fetching
  const [loading, setLoading] = useState(true);
  
  // Load progress from localStorage
  const [progress, setProgress] = useState(null);
  
  // Profile dropdown state
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  // Expanded card state - track which card is currently expanded
  const [expandedCard, setExpandedCard] = useState(null);

  // ==================== DATA LOADING ====================
  useEffect(() => {
    loadDashboardData();
  }, []);

  /**
   * Loads dashboard statistics from localStorage and API
   */
  const loadDashboardData = async () => {
    try {
      // Load from localStorage first (works offline)
      const localCalculations = localStorageService.getAllCalculations();
      const userProgress = localStorageService.getProgress();
      
      // Update streak on load
      localStorageService.updateStreak();
      const updatedProgress = localStorageService.getProgress();
      setProgress(updatedProgress);
      
      // Try to load from API (optional, doesn't block)
      let apiHistory = [];
      try {
        const api = new CarbonFootprintAPI();
        apiHistory = await api.getCarbonFootprintHistory();
      } catch (apiError) {
        console.log('API not available, using local data:', apiError);
      }
      
      // Combine local and API data, prefer local
      const allCalculations = localCalculations.length > 0 ? localCalculations : apiHistory;
      
      if (allCalculations && allCalculations.length > 0) {
        setStats({
          totalCalculations: allCalculations.length,
          thisMonthEmissions: calculateThisMonth(allCalculations),
          lastMonthEmissions: calculateLastMonth(allCalculations),
          activeDays: calculateActiveDays(allCalculations),
          badges: updatedProgress?.badges?.length || 0,
          latestEmissions: allCalculations[0]?.predictedEmissions || 0,
          totalPoints: updatedProgress?.points || 0,
          currentStreak: updatedProgress?.currentStreak || 0,
        });
      } else {
        // No calculations yet
        setStats({
          totalCalculations: 0,
          thisMonthEmissions: 0,
          lastMonthEmissions: 0,
          activeDays: 0,
          badges: updatedProgress?.badges?.length || 0,
          latestEmissions: 0,
          totalPoints: updatedProgress?.points || 0,
          currentStreak: updatedProgress?.currentStreak || 0,
        });
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Calculates total emissions for current month
   */
  const calculateThisMonth = (history) => {
    const now = new Date();
    return history
      .filter(item => {
        const itemDate = new Date(item.createdAt || item.calculation_date);
        return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum, item) => sum + (item.predictedEmissions || item.total_emissions || 0), 0)
      .toFixed(2);
  };

  /**
   * Calculates total emissions for last month
   */
  const calculateLastMonth = (history) => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
    return history
      .filter(item => {
        const itemDate = new Date(item.createdAt || item.calculation_date);
        return itemDate.getMonth() === lastMonth.getMonth() && itemDate.getFullYear() === lastMonth.getFullYear();
      })
      .reduce((sum, item) => sum + (item.predictedEmissions || item.total_emissions || 0), 0)
      .toFixed(2);
  };

  /**
   * Calculates number of unique active days
   */
  const calculateActiveDays = (history) => {
    const uniqueDates = new Set(
      history.map(item => new Date(item.createdAt || item.calculation_date).toDateString())
    );
    return uniqueDates.size;
  };

  /**
   * Handles user logout
   */
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  /**
   * Handles card expansion/collapse
   */
  const handleCardClick = (cardId) => {
    if (expandedCard === cardId) {
      // If already expanded, collapse it
      setExpandedCard(null);
    } else {
      // Expand this card
      setExpandedCard(cardId);
    }
  };

  // ==================== FEATURE CARDS CONFIGURATION ====================
  /**
   * All dashboard features with their properties
   * Each card includes: icon, title, description, route, and color scheme
   */
  const featureCards = [
    {
      id: 'calculator',
      title: 'Carbon Calculator',
      description: 'Calculate your carbon emissions from daily activities and lifestyle choices.',
      icon: Calculator,
      color: 'from-green-500 to-emerald-600',
      route: '/dashboard/calculator',
    },
    {
      id: 'results',
      title: 'Results & History',
      description: 'Track your emission history, view trends, and monitor your progress over time.',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-600',
      route: '/dashboard/results',
    },
    {
      id: 'news',
      title: 'News Feed',
      description: 'Stay updated with the latest climate news and sustainability insights.',
      icon: Newspaper,
      color: 'from-teal-500 to-green-600',
      route: '/dashboard/news',
    },
    {
      id: 'chatbot',
      title: 'Chatbot',
      description: 'Get personalized eco-friendly tips and instant answers to your questions.',
      icon: MessageCircle,
      color: 'from-indigo-500 to-blue-600',
      route: '/dashboard/chat',
    },
    {
      id: 'insights',
      title: 'Insights',
      description: 'Deep dive into your environmental impact with detailed analytics and reports.',
      icon: BarChart3,
      color: 'from-purple-500 to-indigo-600',
      route: '/dashboard/insights',
    },
    {
      id: 'community',
      title: 'Community',
      description: 'Connect with eco-conscious individuals and join the sustainability movement.',
      icon: Users,
      color: 'from-emerald-500 to-teal-600',
      route: '/dashboard/community',
    },
    {
      id: 'marketplace',
      title: 'Marketplace',
      description: 'Browse and purchase sustainable products and eco-friendly services.',
      icon: ShoppingCart,
      color: 'from-green-600 to-lime-600',
      route: '/dashboard/marketplace',
    },
    {
      id: 'profile',
      title: 'Profile Settings',
      description: 'Manage your account preferences, update personal information, and more.',
      icon: User,
      color: 'from-slate-500 to-gray-600',
      route: '/dashboard/profile',
    }
  ];

  // ==================== LOADING STATE ====================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // ==================== MAIN RENDER ====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
      
      {/* ==================== TOP NAVBAR ==================== */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            
            {/* Left: Logo (Hidden on small screens) */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
                <Globe className="text-white" size={20} />
              </div>
            </div>

            {/* Center: Dashboard Title */}
            <div className="flex-1 text-center md:flex-none">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                EcoTracker Dashboard 🌍
              </h1>
            </div>

            {/* Right: Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                <User size={18} />
                <span className="text-sm font-medium hidden sm:block">
                  {user?.name || user?.email?.split('@')[0] || 'User'}
                </span>
                <ChevronDown size={16} className={`hidden sm:block transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showProfileDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{user?.name || user?.email?.split('@')[0] || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email || 'Loading...'}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      navigate('/dashboard/profile');
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User size={16} />
                    <span>Profile Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Banner - CENTERED */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 bg-gradient-to-r from-green-500 via-blue-500 to-green-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl mx-auto text-center"
        >
          <div className="flex items-center justify-center space-x-3 mb-3">
            <Leaf size={32} className="flex-shrink-0" />
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">
                Welcome back, {user?.name || user?.email?.split('@')[0] || 'User'}!
              </h2>
              <p className="text-green-50 text-sm sm:text-base mt-1">
                Track, manage, and reduce your carbon footprint with powerful tools
              </p>
            </div>
          </div>
        </motion.div>

        {/* ==================== FEATURE CARDS GRID ==================== */}
        {/* 
          EXPANDABLE CARDS LAYOUT:
          - Each card is clickable and expands to show full content
          - Only one card can be expanded at a time
          - When expanded, card shows detailed content for that feature
          - Click again to collapse
        */}
        <div className="white-card-grid white-card-grid-3">
          {featureCards.map((card, index) => {
            const Icon = card.icon;
            const isExpanded = expandedCard === card.id;
            
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.1 * (index + 2), 
                  duration: 0.4,
                  ease: "easeOut"
                }}
                className="group w-full"
              >
                {/* 
                  EXPANDABLE WHITE CARD:
                  - Using new white card design system
                  - Consistent styling across all cards
                  - Hover effects and animations
                */}
                <div 
                  onClick={() => handleCardClick(card.id)}
                  className={`white-card white-card-lg cursor-pointer ${
                    isExpanded ? 'ring-2 ring-green-500' : ''
                  }`}
                >
                  
                  {!isExpanded ? (
                    /* COLLAPSED STATE - Show summary */
                    <div className="white-card-content text-center">
                      {/* Icon - Top Center */}
                      <div className="flex justify-center mb-4">
                        <div className={`white-card-icon group-hover:scale-110 transition-transform duration-300`}>
                          <Icon size={24} />
                        </div>
                      </div>

                      {/* Title - Bold and Prominent */}
                      <h3 className="white-card-title text-xl mb-3 group-hover:text-green-600 transition-colors duration-300">
                        {card.title}
                      </h3>

                      {/* Description - 1-2 Lines */}
                      <p className="text-sm mb-4 line-clamp-2">
                        {card.description}
                      </p>

                      {/* Click to expand hint */}
                      <div className="flex items-center justify-center gap-2 text-green-600 text-sm font-medium">
                        <span>Click to expand</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  ) : (
                    /* EXPANDED STATE - Show full feature content */
                    <div className="white-card-content">
                      {/* Header with icon and title */}
                      <div className="white-card-icon-header">
                        <div className="white-card-icon">
                          <Icon size={24} />
                        </div>
                        <div>
                          <h3 className="white-card-title text-xl">{card.title}</h3>
                          <p className="white-card-subtitle">Feature Details</p>
                        </div>
                      </div>

                      {/* Full description */}
                      <p className="text-sm leading-relaxed mb-4">
                        {card.description}
                      </p>

                      {/* Feature-specific content based on card type */}
                      {card.id === 'calculator' && (
                        <div className="space-y-3">
                          <h3>Calculate your carbon footprint by entering:</h3>
                          <ul className="space-y-1">
                            <li>• Transportation usage</li>
                            <li>• Energy consumption</li>
                            <li>• Food habits</li>
                            <li>• Shopping patterns</li>
                          </ul>
                          <div className="white-card-actions">
                            <button 
                              onClick={(e) => { e.stopPropagation(); navigate('/dashboard/calculator'); }}
                              className="white-card-button white-card-button-primary w-full"
                            >
                              Start Calculation
                            </button>
                          </div>
                        </div>
                      )}

                      {card.id === 'results' && (
                        <div className="space-y-3">
                          <h3>Track your environmental impact:</h3>
                          <ul className="space-y-1">
                            <li>• View calculation history</li>
                            <li>• Track emission trends</li>
                            <li>• Compare monthly data</li>
                            <li>• Export reports</li>
                          </ul>
                          <div className="white-card-actions">
                            <button 
                              onClick={(e) => { e.stopPropagation(); navigate('/dashboard/results'); }}
                              className="white-card-button white-card-button-primary w-full"
                            >
                              View Results
                            </button>
                          </div>
                        </div>
                      )}

                      {card.id === 'news' && (
                        <div className="space-y-3">
                          <h3>Stay informed about climate news:</h3>
                          <ul className="space-y-1">
                            <li>• Latest climate research</li>
                            <li>• Sustainability tips</li>
                            <li>• Environmental policies</li>
                            <li>• Global initiatives</li>
                          </ul>
                          <div className="white-card-actions">
                            <button 
                              onClick={(e) => { e.stopPropagation(); navigate('/dashboard/news'); }}
                              className="white-card-button white-card-button-primary w-full"
                            >
                              Read News
                            </button>
                          </div>
                        </div>
                      )}

                      {card.id === 'chatbot' && (
                        <div className="space-y-3">
                          <h3>Get instant eco-friendly advice:</h3>
                          <ul className="space-y-1">
                            <li>• Personalized tips</li>
                            <li>• Carbon reduction strategies</li>
                            <li>• Sustainability questions</li>
                            <li>• Environmental guidance</li>
                          </ul>
                          <div className="white-card-actions">
                            <button 
                              onClick={(e) => { e.stopPropagation(); navigate('/dashboard/chat'); }}
                              className="white-card-button white-card-button-primary w-full"
                            >
                              Chat Now
                            </button>
                          </div>
                        </div>
                      )}

                      {card.id === 'insights' && (
                        <div className="space-y-3">
                          <h3>Deep dive into your data:</h3>
                          <ul className="space-y-1">
                            <li>• Detailed analytics</li>
                            <li>• Environmental reports</li>
                            <li>• Impact comparisons</li>
                            <li>• Progress tracking</li>
                          </ul>
                          <div className="white-card-actions">
                            <button 
                              onClick={(e) => { e.stopPropagation(); navigate('/dashboard/insights'); }}
                              className="white-card-button white-card-button-primary w-full"
                            >
                              View Insights
                            </button>
                          </div>
                        </div>
                      )}

                      {card.id === 'community' && (
                        <div className="space-y-3">
                          <h3>Connect with eco-conscious people:</h3>
                          <ul className="space-y-1">
                            <li>• Join discussions</li>
                            <li>• Share achievements</li>
                            <li>• Get support</li>
                            <li>• Learn from others</li>
                          </ul>
                          <div className="white-card-actions">
                            <button 
                              onClick={(e) => { e.stopPropagation(); navigate('/dashboard/community'); }}
                              className="white-card-button white-card-button-primary w-full"
                            >
                              Join Community
                            </button>
                          </div>
                        </div>
                      )}

                      {card.id === 'marketplace' && (
                        <div className="space-y-3">
                          <h3>Shop sustainable products:</h3>
                          <ul className="space-y-1">
                            <li>• Eco-friendly products</li>
                            <li>• Sustainable services</li>
                            <li>• Green alternatives</li>
                            <li>• Carbon-neutral options</li>
                          </ul>
                          <div className="white-card-actions">
                            <button 
                              onClick={(e) => { e.stopPropagation(); navigate('/dashboard/marketplace'); }}
                              className="white-card-button white-card-button-primary w-full"
                            >
                              Browse Marketplace
                            </button>
                          </div>
                        </div>
                      )}

                      {card.id === 'profile' && (
                        <div className="space-y-3">
                          <h3>Manage your account:</h3>
                          <ul className="space-y-1">
                            <li>• Update personal info</li>
                            <li>• Change preferences</li>
                            <li>• View achievements</li>
                            <li>• Account settings</li>
                          </ul>
                          <div className="white-card-actions">
                            <button 
                              onClick={(e) => { e.stopPropagation(); navigate('/dashboard/profile'); }}
                              className="white-card-button white-card-button-primary w-full"
                            >
                              Manage Profile
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Collapse button */}
                      <div className="white-card-actions">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setExpandedCard(null); }}
                          className="white-card-button white-card-button-secondary"
                        >
                          Click to collapse ↑
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ==================== QUICK STATS SUMMARY - CENTERED ==================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 white-card white-card-lg mx-auto"
        >
          <div className="white-card-icon-header">
            <div className="white-card-icon">
              <BarChart3 size={24} />
            </div>
            <div>
              <h3 className="white-card-title text-xl">Quick Stats Overview</h3>
              <p className="white-card-subtitle">Your environmental impact at a glance</p>
            </div>
          </div>
          
          {/* Stats Grid - CENTERED */}
          <div className="white-card-stats">
            
            {/* This Month Emissions */}
            <div className="white-card-stat">
              <p className="white-card-stat-value text-green-600">
                {stats.thisMonthEmissions}
              </p>
              <p className="white-card-stat-label">
                kg CO₂ this month
              </p>
            </div>

            {/* Total Calculations */}
            <div className="white-card-stat">
              <p className="white-card-stat-value text-blue-600">
                {stats.totalCalculations}
              </p>
              <p className="white-card-stat-label">
                Total calculations
              </p>
            </div>

            {/* Active Days */}
            <div className="white-card-stat">
              <p className="white-card-stat-value text-purple-600">
                {stats.activeDays}
              </p>
              <p className="white-card-stat-label">
                Active days
              </p>
            </div>

            {/* Badges Earned */}
            <div className="white-card-stat">
              <p className="white-card-stat-value text-yellow-600">
                {stats.badges}
              </p>
              <p className="white-card-stat-label">
                Badges earned
              </p>
            </div>
          </div>
          
          {/* Additional Stats Row */}
          <div className="white-card-stats mt-4">
            {/* Latest Emissions */}
            <div className="white-card-stat">
              <p className="white-card-stat-value text-indigo-600">
                {stats.latestEmissions > 0 ? stats.latestEmissions.toFixed(2) : '0.00'}t
              </p>
              <p className="white-card-stat-label">
                Latest footprint
              </p>
            </div>

            {/* Total Points */}
            <div className="white-card-stat">
              <p className="white-card-stat-value text-purple-600">
                {stats.totalPoints}
              </p>
              <p className="white-card-stat-label">
                Total points
              </p>
            </div>

            {/* Current Streak */}
            <div className="white-card-stat">
              <p className="white-card-stat-value text-orange-600">
                {stats.currentStreak} 🔥
              </p>
              <p className="white-card-stat-label">
                Day streak
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer Spacing */}
        <div className="h-8"></div>
      </main>
    </div>
  );
};

export default DashboardHome;

