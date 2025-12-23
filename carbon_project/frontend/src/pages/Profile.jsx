import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Moon, Sun, Trash2, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import localStorageService from '../services/localStorageService';
import { ErrorHandler } from '../utils/errorHandler';

const Profile = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || user?.email?.split('@')[0] || '',
    email: user?.email || '',
    phone: '',
    location: '',
  });

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || user.email?.split('@')[0] || '',
        email: user.email || '',
        phone: '',
        location: '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    // TODO: Implement save functionality with API
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      location: '',
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-8 text-white shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-green-50 text-lg">Manage your account information</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Personal Information</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all shadow-md"
            >
              <Edit2 size={18} />
              <span>Edit</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all shadow-md"
              >
                <Save size={18} />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-all shadow-md"
              >
                <X size={18} />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <User className="text-white" size={64} />
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                <Edit2 size={18} className="text-gray-700 dark:text-white" />
              </button>
            )}
          </div>
        </div>

        {/* Profile Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <User size={16} />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Mail size={16} />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Phone size={16} />
              <span>Phone Number</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Enter phone number"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          {/* Location */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MapPin size={16} />
              <span>Location</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Enter location"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </motion.div>

      {/* Settings Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h2>
        
        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-xl mb-4">
          <div className="flex items-center space-x-3">
            {isDarkMode ? <Moon size={24} className="text-gray-600 dark:text-gray-300" /> : <Sun size={24} className="text-gray-600 dark:text-gray-300" />}
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Dark Mode</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Toggle between light and dark theme</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              isDarkMode ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                isDarkMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Reset Data */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-xl mb-4">
          <div className="flex items-center space-x-3">
            <Trash2 size={24} className="text-red-600" />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Reset All Data</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Clear all calculations and progress</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (window.confirm('Are you sure? This will delete all your calculations and progress.')) {
                localStorageService.clearAll();
                ErrorHandler.showSuccess('All data cleared');
                window.location.reload();
              }
            }}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Logout */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-xl">
          <div className="flex items-center space-x-3">
            <LogOut size={24} className="text-gray-600 dark:text-gray-300" />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Logout</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sign out of your account</p>
            </div>
          </div>
          <button
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </motion.div>

      {/* Account Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Account Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <Calendar className="mx-auto mb-2 text-green-600" size={32} />
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Calculations</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{localStorageService.getCalculationsCount()}</p>
          </div>
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <User className="mx-auto mb-2 text-blue-600" size={32} />
            <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
            </p>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <Mail className="mx-auto mb-2 text-purple-600" size={32} />
            <p className="text-sm text-gray-600 dark:text-gray-400">Email Status</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">Verified</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;

