import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiHome, FiEdit, FiFileText, FiCamera, FiMessageCircle,
  FiTarget, FiAward, FiUsers, FiTrendingUp, FiShoppingCart,
  FiLogOut, FiMenu, FiX, FiUser, FiSun, FiMoon, FiBarChart2, FiArrowLeft
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const menuItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/dashboard/calculator', icon: FiEdit, label: 'Calculator' },
    { path: '/dashboard/results', icon: FiBarChart2, label: 'Results' },
    { path: '/dashboard/news', icon: FiFileText, label: 'News Feed' },
    { path: '/dashboard/rewards', icon: FiAward, label: 'Rewards' },
    { path: '/dashboard/goals', icon: FiTarget, label: 'Goals' },
    { path: '/dashboard/ocr', icon: FiCamera, label: 'Bill Scanner' },
    { path: '/dashboard/chat', icon: FiMessageCircle, label: 'Chatbot' },
    { path: '/dashboard/insights', icon: FiTrendingUp, label: 'Insights' },
    { path: '/dashboard/community', icon: FiUsers, label: 'Community' },
    { path: '/dashboard/marketplace', icon: FiShoppingCart, label: 'Marketplace' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  // Check if we're on the dashboard home page
  const isDashboardHome = location.pathname === '/dashboard';

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      
      {/* LEFT SIDEBAR - Navigation - Hidden on Dashboard Home */}
      {!isDashboardHome && (
        <>
          <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static w-64 h-screen bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xl z-50 transition-transform duration-300 flex flex-col`}>
            
            {/* Logo Section */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <Link to="/dashboard" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-md">
                    <span className="text-2xl">🌱</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">EcoTracker</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Carbon Dashboard</p>
                  </div>
                </Link>
                <button 
                  onClick={() => setSidebarOpen(false)} 
                  className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>

            {/* Navigation Menu - Scrollable */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      active
                        ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-md'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Section - Fixed at Bottom */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-sm">
                  <FiUser className="text-white" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {user?.name || user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email || 'Loading...'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm"
              >
                <FiLogOut size={16} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </aside>

          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div 
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            />
          )}
        </>
      )}

      {/* RIGHT CONTENT AREA */}
      <div className="flex-1 flex flex-col min-h-screen">
        
        {/* Top Header - Sticky - Hidden on Dashboard Home */}
        {!isDashboardHome && (
          <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-6 py-4">
              
              {/* Left: Back Button + Menu + Title */}
              <div className="flex items-center space-x-4">
                {/* Back Button */}
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title="Go back"
                >
                  <FiArrowLeft size={20} />
                </button>
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors lg:hidden"
                >
                  <FiMenu size={24} />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Carbon Footprint Intelligence
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                    Track and reduce your environmental impact
                  </p>
                </div>
              </div>

              {/* Right: Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>
            </div>
          </header>
        )}

        {/* Main Scrollable Content */}
        <main className={`flex-1 overflow-y-auto ${isDashboardHome ? '' : 'p-6'}`}>
          <div className={isDashboardHome ? '' : 'max-w-7xl mx-auto'}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
