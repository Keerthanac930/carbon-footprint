import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, FiEdit, FiFileText, FiCamera, FiMessageCircle,
  FiTarget, FiAward, FiUsers, FiTrendingUp, FiSettings,
  FiLogOut, FiMenu, FiX, FiUser, FiBell, FiSun, FiMoon
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    // Load dark mode preference from localStorage
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard', color: '#4CAF50' },
    { path: '/dashboard/calculator', icon: FiEdit, label: 'Calculator', color: '#2196F3' },
    { path: '/dashboard/results', icon: FiTrendingUp, label: 'Results', color: '#9C27B0' },
    { path: '/dashboard/news', icon: FiFileText, label: 'News Feed', color: '#FF9800' },
    { path: '/dashboard/rewards', icon: FiAward, label: 'Rewards', color: '#FFD700' },
    { path: '/dashboard/goals', icon: FiTarget, label: 'My Goals', color: '#F44336' },
    { path: '/dashboard/ocr', icon: FiCamera, label: 'Bill Scanner', color: '#9C27B0' },
    { path: '/dashboard/chat', icon: FiMessageCircle, label: 'AI Chatbot', color: '#00BCD4' },
    { path: '/dashboard/insights', icon: FiTrendingUp, label: 'Global Stats', color: '#3F51B5' },
    { path: '/dashboard/community', icon: FiUsers, label: 'Community', color: '#8BC34A' },
    { path: '/dashboard/marketplace', icon: FiSettings, label: 'Marketplace', color: '#10B981' },
    { path: '/dashboard/admin', icon: FiSettings, label: 'Admin', color: '#607D8B' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50 dark:from-slate-900 dark:via-green-900 dark:to-blue-900 transition-colors duration-300">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-800 shadow-2xl z-50 overflow-y-auto"
          >
            {/* Logo Section */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl font-bold">🌱</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">Carbon</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Footprint</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FiX size={24} />
                </button>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <motion.button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      active
                        ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon size={20} style={{ color: active ? 'white' : item.color }} />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                );
              })}
            </nav>

            {/* User Section */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <FiUser className="text-white" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
              >
                <FiLogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        {/* Top Header */}
        <header className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left: Menu Button */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                <FiMenu size={24} />
              </button>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white hidden sm:block">
                Carbon Footprint Intelligence
              </h1>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
              </motion.button>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <FiBell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </motion.button>

              {/* User Avatar */}
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow">
                <FiUser className="text-white" size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area with Animation */}
        <main className="p-6 min-h-screen">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        />
      )}
    </div>
  );
};

export default DashboardLayout;

