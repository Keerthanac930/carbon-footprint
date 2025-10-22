import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiTrendingUp, FiTrendingDown, FiActivity, FiTarget,
  FiAward, FiCalendar, FiZap, FiLeaf
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import CarbonFootprintAPI from '../../services/api';

const DashboardHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCalculations: 0,
    thisMonthEmissions: 0,
    lastMonthEmissions: 0,
    activeDays: 0,
    badges: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const api = new CarbonFootprintAPI();
      // Load carbon footprint history
      const history = await api.getCarbonFootprintHistory();
      
      if (history) {
        setStats({
          totalCalculations: history.length || 0,
          thisMonthEmissions: calculateThisMonthEmissions(history),
          lastMonthEmissions: calculateLastMonthEmissions(history),
          activeDays: calculateActiveDays(history),
          badges: 3, // Placeholder
        });
        setRecentActivity(history.slice(0, 5));
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateThisMonthEmissions = (history) => {
    const now = new Date();
    const thisMonth = history.filter(item => {
      const date = new Date(item.calculation_date);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });
    return thisMonth.reduce((sum, item) => sum + (item.total_emissions || 0), 0).toFixed(2);
  };

  const calculateLastMonthEmissions = (history) => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
    const filtered = history.filter(item => {
      const date = new Date(item.calculation_date);
      return date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear();
    });
    return filtered.reduce((sum, item) => sum + (item.total_emissions || 0), 0).toFixed(2);
  };

  const calculateActiveDays = (history) => {
    const uniqueDates = new Set(history.map(item => 
      new Date(item.calculation_date).toDateString()
    ));
    return uniqueDates.size;
  };

  const emissionTrend = ((stats.thisMonthEmissions - stats.lastMonthEmissions) / (stats.lastMonthEmissions || 1) * 100).toFixed(1);
  const trendPositive = emissionTrend > 0;

  const statCards = [
    {
      title: 'This Month Emissions',
      value: `${stats.thisMonthEmissions} kg`,
      icon: FiActivity,
      color: 'from-blue-400 to-blue-600',
      trend: emissionTrend,
      trendPositive,
    },
    {
      title: 'Total Calculations',
      value: stats.totalCalculations,
      icon: FiTrendingUp,
      color: 'from-green-400 to-green-600',
    },
    {
      title: 'Active Days',
      value: stats.activeDays,
      icon: FiCalendar,
      color: 'from-purple-400 to-purple-600',
    },
    {
      title: 'Eco Badges',
      value: stats.badges,
      icon: FiAward,
      color: 'from-yellow-400 to-yellow-600',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-8 text-white shadow-xl"
      >
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name || 'User'}! 🌍
        </h1>
        <p className="text-green-50 text-lg">
          Track your carbon footprint and make a difference in the world
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="text-white" size={24} />
                </div>
                {card.trend !== undefined && (
                  <div className={`flex items-center space-x-1 text-sm font-semibold ${
                    card.trendPositive ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {card.trendPositive ? <FiTrendingUp size={16} /> : <FiTrendingDown size={16} />}
                    <span>{Math.abs(card.trend)}%</span>
                  </div>
                )}
              </div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
                {card.title}
              </h3>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">
                {card.value}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/dashboard/calculator')}
            className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <FiZap size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Calculate Footprint</h3>
              <p className="text-sm text-green-50">Start new calculation</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/dashboard/goals')}
            className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <FiTarget size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Set Goals</h3>
              <p className="text-sm text-blue-50">Track your progress</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/dashboard/insights')}
            className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <FiLeaf size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">View Insights</h3>
              <p className="text-sm text-purple-50">Analyze your impact</p>
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Recent Activity
        </h2>
        {recentActivity.length > 0 ? (
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <FiActivity className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">
                      Carbon Calculation
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(activity.calculation_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-800 dark:text-white">
                    {activity.total_emissions} kg
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    CO₂ emissions
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FiActivity className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No activity yet. Start your first calculation!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard/calculator')}
              className="px-6 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-shadow"
            >
              Calculate Now
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DashboardHome;

