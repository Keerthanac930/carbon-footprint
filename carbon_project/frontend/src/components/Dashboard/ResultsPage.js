import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  FiTrendingDown, FiTrendingUp, FiAlertCircle,
  FiCheckCircle, FiTarget, FiActivity, FiClock, FiArrowLeft
} from 'react-icons/fi';
import CarbonFootprintAPI from '../../services/api';

const ResultsPage = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadResults();
    loadHistory();
  }, []);

  const loadResults = () => {
    try {
      const savedResults = localStorage.getItem('carbonFootprintResults');
      if (savedResults) {
        const parsedResults = JSON.parse(savedResults);
        setResults(parsedResults);
      }
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const api = new CarbonFootprintAPI();
      const historyData = await api.getCarbonFootprintHistory();
      if (historyData && Array.isArray(historyData)) {
        setHistory(historyData);
      }
    } catch (error) {
      console.error('Error loading history:', error);
      // Fallback to localStorage if API fails
      try {
        const localHistory = JSON.parse(localStorage.getItem('carbonFootprintHistory') || '[]');
        setHistory(localHistory);
      } catch (e) {
        console.error('Error loading local history:', e);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <FiAlertCircle className="text-gray-400 mb-4" size={64} />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          No Results Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Calculate your carbon footprint to see results
        </p>
        <button
          onClick={() => navigate('/dashboard/calculator')}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
        >
          Start Calculation
        </button>
      </div>
    );
  }

  // Calculate category breakdown - check multiple possible field names
  const totalEmissions = results.predicted_emissions || results.annual_emissions || results.total_emissions || 0;
  
  // Use breakdown from API if available, otherwise use estimated percentages
  // Note: All values are in kg CO2/year from the API, we convert to tonnes for display
  let categoryData;
  if (results.breakdown && Object.keys(results.breakdown).length > 0) {
    // Use actual breakdown from API (values are in kg, convert to tonnes for display)
    // Ensure values are numbers and properly converted
    const breakdown = results.breakdown;
    categoryData = [
      { 
        name: 'Transport', 
        value: parseFloat((breakdown.transportation || 0) / 1000), 
        rawValue: parseFloat(breakdown.transportation || 0),
        displayValue: parseFloat((breakdown.transportation || 0) / 1000).toFixed(2),
        color: '#FF6384' 
      },
      { 
        name: 'Home Energy', 
        value: parseFloat((breakdown.electricity || 0) / 1000), 
        rawValue: parseFloat(breakdown.electricity || 0),
        displayValue: parseFloat((breakdown.electricity || 0) / 1000).toFixed(2),
        color: '#36A2EB' 
      },
      { 
        name: 'Heating', 
        value: parseFloat((breakdown.heating || 0) / 1000), 
        rawValue: parseFloat(breakdown.heating || 0),
        displayValue: parseFloat((breakdown.heating || 0) / 1000).toFixed(2),
        color: '#FF9800' 
      },
      { 
        name: 'Waste', 
        value: parseFloat((breakdown.waste || 0) / 1000), 
        rawValue: parseFloat(breakdown.waste || 0),
        displayValue: parseFloat((breakdown.waste || 0) / 1000).toFixed(2),
        color: '#4BC0C0' 
      },
      { 
        name: 'Lifestyle', 
        value: parseFloat((breakdown.lifestyle || 0) / 1000), 
        rawValue: parseFloat(breakdown.lifestyle || 0),
        displayValue: parseFloat((breakdown.lifestyle || 0) / 1000).toFixed(2),
        color: '#9C27B0' 
      },
      { 
        name: 'Other', 
        value: parseFloat((breakdown.other || 0) / 1000), 
        rawValue: parseFloat(breakdown.other || 0),
        displayValue: parseFloat((breakdown.other || 0) / 1000).toFixed(2),
        color: '#607D8B' 
      },
    ].filter(item => item.value > 0.01); // Only show categories > 0.01 tonnes
  } else {
    // Fallback to estimated percentages (totalEmissions is in kg, convert to tonnes)
    categoryData = [
      { 
        name: 'Transport', 
        value: parseFloat(totalEmissions * 0.35 / 1000), 
        displayValue: (totalEmissions * 0.35 / 1000).toFixed(2),
        color: '#FF6384' 
      },
      { 
        name: 'Home Energy', 
        value: parseFloat(totalEmissions * 0.30 / 1000), 
        displayValue: (totalEmissions * 0.30 / 1000).toFixed(2),
        color: '#36A2EB' 
      },
      { 
        name: 'Food', 
        value: parseFloat(totalEmissions * 0.20 / 1000), 
        displayValue: (totalEmissions * 0.20 / 1000).toFixed(2),
        color: '#FFCE56' 
      },
      { 
        name: 'Waste', 
        value: parseFloat(totalEmissions * 0.15 / 1000), 
        displayValue: (totalEmissions * 0.15 / 1000).toFixed(2),
        color: '#4BC0C0' 
      },
    ];
  }

  // Comparison data
  const comparisonData = [
    { name: 'Your Footprint', value: (totalEmissions / 1000).toFixed(2), color: '#4CAF50' },
    { name: 'India Avg', value: 1.9, color: '#2196F3' },
    { name: 'Global Avg', value: 4.7, color: '#FF9800' },
  ];

  const isAboveIndiaAvg = (totalEmissions / 1000) > 1.9;
  const isAboveGlobalAvg = (totalEmissions / 1000) > 4.7;

  // Recommendations based on emissions
  const recommendations = [
    {
      icon: FiTrendingDown,
      title: 'Reduce Transport Emissions',
      description: 'Consider carpooling, public transport, or cycling for short distances',
      impact: 'High',
      color: 'from-red-400 to-red-600'
    },
    {
      icon: FiActivity,
      title: 'Energy Efficiency',
      description: 'Switch to LED bulbs and energy-efficient appliances',
      impact: 'Medium',
      color: 'from-yellow-400 to-yellow-600'
    },
    {
      icon: FiCheckCircle,
      title: 'Plant-Based Diet',
      description: 'Reduce meat consumption and opt for local, seasonal produce',
      impact: 'High',
      color: 'from-green-400 to-green-600'
    },
    {
      icon: FiTarget,
      title: 'Waste Management',
      description: 'Practice composting and increase recycling efforts',
      impact: 'Medium',
      color: 'from-blue-400 to-blue-600'
    },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header with Back Button and Total Emissions */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-8 text-white shadow-2xl"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Go back to dashboard"
              >
                <FiArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  Your Carbon Footprint Results
                </h1>
                <p className="text-green-50 text-lg">
                  Analysis completed on {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-6xl font-bold mb-2">
              {(totalEmissions / 1000).toFixed(2)}
            </div>
            <div className="text-2xl text-green-50">
              tonnes CO₂/year
            </div>
          </div>
        </div>
        
        {/* History Toggle Button */}
        <div className="mt-4 flex items-center space-x-4">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            <FiClock size={18} />
            <span>{showHistory ? 'Hide' : 'Show'} History ({history.length})</span>
          </button>
        </div>
      </motion.div>

      {/* History Section */}
      {showHistory && history.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Calculation History
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Total Emissions</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                      {new Date(entry.calculation_date || entry.date || entry.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                      {((entry.total_emissions || entry.predicted_emissions || entry.footprint || 0) / 1000).toFixed(2)} tonnes
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {showHistory && history.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 text-center"
        >
          <FiClock className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No History Yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You haven't made any calculations yet. Start tracking your carbon footprint!
          </p>
          <button
            onClick={() => navigate('/dashboard/calculator')}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
          >
            Calculate Now
          </button>
        </motion.div>
      )}

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg ${
            isAboveGlobalAvg ? 'border-2 border-red-500' : isAboveIndiaAvg ? 'border-2 border-yellow-500' : 'border-2 border-green-500'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              vs India Average
            </h3>
            {isAboveIndiaAvg ? (
              <FiTrendingUp className="text-red-500" size={24} />
            ) : (
              <FiTrendingDown className="text-green-500" size={24} />
            )}
          </div>
          <div className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            {isAboveIndiaAvg ? '+' : '-'}{Math.abs((totalEmissions / 1000) - 1.9).toFixed(2)} t
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            India average: 1.9 tonnes/year
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg ${
            isAboveGlobalAvg ? 'border-2 border-red-500' : 'border-2 border-green-500'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              vs Global Average
            </h3>
            {isAboveGlobalAvg ? (
              <FiTrendingUp className="text-red-500" size={24} />
            ) : (
              <FiTrendingDown className="text-green-500" size={24} />
            )}
          </div>
          <div className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            {isAboveGlobalAvg ? '+' : '-'}{Math.abs((totalEmissions / 1000) - 4.7).toFixed(2)} t
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Global average: 4.7 tonnes/year
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border-2 border-purple-500"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Confidence Score
            </h3>
            <FiCheckCircle className="text-purple-500" size={24} />
          </div>
          <div className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            {((results.confidence_score || 0.85) * 100).toFixed(0)}%
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Prediction accuracy
          </p>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Category Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} tonnes`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {categoryData.map((category, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {category.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {category.displayValue || category.value} tonnes
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Comparison Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Global Comparison
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Tonnes CO₂/year', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {comparisonData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Personalized Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec, index) => {
            const Icon = rec.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${rec.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      {rec.title}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      rec.impact === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {rec.impact} Impact
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {rec.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard/calculator')}
          className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
        >
          Calculate Again
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard/goals')}
          className="px-8 py-4 bg-white dark:bg-slate-800 text-gray-800 dark:text-white border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
        >
          Set Reduction Goals
        </motion.button>
      </div>
    </div>
  );
};

export default ResultsPage;

