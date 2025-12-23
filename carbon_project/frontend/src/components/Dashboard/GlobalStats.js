import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { FiGlobe, FiTrendingUp, FiRefreshCw } from 'react-icons/fi';
import localStorageService from '../../services/localStorageService';

const GlobalStats = () => {
  const [userStats, setUserStats] = useState({
    average: 0,
    min: 0,
    max: 0,
    total: 0,
  });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    try {
      const calculations = localStorageService.getAllCalculations();
      setHistory(calculations);
      
      if (calculations.length > 0) {
        const emissions = calculations.map(calc => 
          calc.predictedEmissions || (calc.predicted_emissions ? calc.predicted_emissions / 1000 : 0) || 0
        );
        
        const total = emissions.reduce((sum, val) => sum + val, 0);
        const average = total / emissions.length;
        const min = Math.min(...emissions);
        const max = Math.max(...emissions);
        
        setUserStats({
          average: average,
          min: min,
          max: max,
          total: calculations.length,
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Global comparison data
  const comparisonData = [
    { country: 'You', emissions: userStats.average || 0, color: '#4CAF50' },
    { country: 'India Avg', emissions: 1.9, color: '#2196F3' },
    { country: 'World Avg', emissions: 4.7, color: '#FF9800' },
    { country: 'USA', emissions: 16.2, color: '#F44336' },
    { country: 'China', emissions: 7.4, color: '#9C27B0' },
    { country: 'EU', emissions: 6.8, color: '#00BCD4' },
  ].filter(item => item.emissions > 0);

  // Line chart data for user's emission trends
  const trendData = history.slice(0, 10).map((calc, index) => ({
    name: `Calc ${index + 1}`,
    emissions: calc.predictedEmissions || (calc.predicted_emissions ? calc.predicted_emissions / 1000 : 0) || 0,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <FiGlobe size={48} />
            <div>
              <h1 className="text-3xl font-bold mb-1">Insights & Analytics 🌍</h1>
              <p className="text-indigo-50">Compare emissions worldwide and track your progress</p>
            </div>
          </div>
          <button
            onClick={loadStats}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
            title="Refresh data"
          >
            <FiRefreshCw size={24} />
          </button>
        </div>
      </motion.div>

      {/* User Statistics Cards */}
      {userStats.total > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Average</p>
            <p className="text-3xl font-bold text-green-600">{userStats.average.toFixed(2)}t</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Min</p>
            <p className="text-3xl font-bold text-blue-600">{userStats.min.toFixed(2)}t</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Max</p>
            <p className="text-3xl font-bold text-orange-600">{userStats.max.toFixed(2)}t</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Calculations</p>
            <p className="text-3xl font-bold text-purple-600">{userStats.total}</p>
          </motion.div>
        </div>
      )}

      {/* Trend Chart */}
      {trendData.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Emission Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Tonnes CO₂', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Line type="monotone" dataKey="emissions" stroke="#4CAF50" strokeWidth={3} dot={{ fill: '#4CAF50', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Global Comparison Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Global Comparison (tonnes/year)</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="country" />
            <YAxis label={{ value: 'Tonnes CO₂', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="emissions" radius={[8, 8, 0, 0]}>
              {comparisonData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white">
          <h3 className="text-xl font-bold mb-2">🇮🇳 India Average</h3>
          <p className="text-4xl font-bold mb-2">1.9 t/year</p>
          <p className="text-blue-100">Per capita CO₂ emissions</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white">
          <h3 className="text-xl font-bold mb-2">🌏 World Average</h3>
          <p className="text-4xl font-bold mb-2">4.7 t/year</p>
          <p className="text-orange-100">Global average emissions</p>
        </motion.div>
      </div>
    </div>
  );
};

export default GlobalStats;

