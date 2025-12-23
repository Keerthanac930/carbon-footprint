import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiEye, FiRefreshCw, FiCalendar, FiTrendingUp } from 'react-icons/fi';
import localStorageService from '../../services/localStorageService';
import { ErrorHandler } from '../../utils/errorHandler';

const HistoryPage = () => {
  const navigate = useNavigate();
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCalculation, setSelectedCalculation] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const history = localStorageService.getAllCalculations();
      setCalculations(history);
    } catch (error) {
      console.error('Error loading history:', error);
      ErrorHandler.showError('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this calculation?')) {
      try {
        localStorageService.deleteCalculation(id);
        setCalculations(prev => prev.filter(calc => calc.id !== id));
        ErrorHandler.showSuccess('Calculation deleted');
      } catch (error) {
        ErrorHandler.showError('Failed to delete calculation');
      }
    }
  };

  const handleViewDetails = (calculation) => {
    setSelectedCalculation(calculation);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (calculations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="w-32 h-32 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-6">
          <FiCalendar className="text-gray-400" size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          No Calculations Yet
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
          Start tracking your carbon footprint by calculating your emissions
        </p>
        <button
          onClick={() => navigate('/dashboard/calculator')}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
        >
          Calculate Now
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-8 text-white shadow-xl"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Calculation History</h1>
            <p className="text-green-50">Track your carbon footprint over time</p>
          </div>
          <button
            onClick={loadHistory}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
            title="Refresh"
          >
            <FiRefreshCw size={24} />
          </button>
        </div>
      </motion.div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Calculations</p>
          <p className="text-3xl font-bold text-green-600">{calculations.length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Average Emissions</p>
          <p className="text-3xl font-bold text-blue-600">
            {calculations.length > 0
              ? (calculations.reduce((sum, calc) => sum + (calc.predictedEmissions || 0), 0) / calculations.length).toFixed(2)
              : '0.00'}t
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Latest</p>
          <p className="text-3xl font-bold text-purple-600">
            {calculations.length > 0 ? (calculations[0].predictedEmissions || 0).toFixed(2) : '0.00'}t
          </p>
        </motion.div>
      </div>

      {/* Calculations List */}
      <div className="space-y-4">
        <AnimatePresence>
          {calculations.map((calculation, index) => {
            const emissions = calculation.predictedEmissions || 0;
            const severityColor = emissions < 2.0 ? 'green' : emissions < 4.0 ? 'yellow' : 'red';
            
            return (
              <motion.div
                key={calculation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                      severityColor === 'green' ? 'bg-green-100 dark:bg-green-900' :
                      severityColor === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900' :
                      'bg-red-100 dark:bg-red-900'
                    }`}>
                      <FiTrendingUp className={
                        severityColor === 'green' ? 'text-green-600' :
                        severityColor === 'yellow' ? 'text-yellow-600' :
                        'text-red-600'
                      } size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <p className={`text-3xl font-bold ${
                          severityColor === 'green' ? 'text-green-600' :
                          severityColor === 'yellow' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {emissions.toFixed(2)}t
                        </p>
                        <span className="text-sm text-gray-600 dark:text-gray-400">CO₂/year</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <FiCalendar size={14} />
                        <span>{formatDate(calculation.createdAt || calculation.calculation_date)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewDetails(calculation)}
                      className="p-3 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                      title="View Details"
                    >
                      <FiEye size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(calculation.id)}
                      className="p-3 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-xl hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Detail Modal */}
      {selectedCalculation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Calculation Details</h2>
              <button
                onClick={() => setSelectedCalculation(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Emissions</p>
                <p className="text-3xl font-bold text-green-600">
                  {(selectedCalculation.predictedEmissions || 0).toFixed(2)} tonnes CO₂/year
                </p>
              </div>
              
              {selectedCalculation.breakdown && (
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Breakdown</p>
                  <div className="space-y-2">
                    {Object.entries(selectedCalculation.breakdown).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                        <span className="text-gray-800 dark:text-white capitalize">{key.replace('_', ' ')}</span>
                        <span className="font-semibold text-gray-800 dark:text-white">{parseFloat(value).toFixed(2)}t</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedCalculation.recommendations && selectedCalculation.recommendations.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Recommendations</p>
                  <div className="space-y-2">
                    {selectedCalculation.recommendations.map((rec, index) => (
                      <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                        <p className="font-semibold text-gray-800 dark:text-white">{rec.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{rec.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  localStorage.setItem('carbonFootprintResults', JSON.stringify(selectedCalculation));
                  navigate('/dashboard/results');
                }}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
              >
                View Full Results
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;

