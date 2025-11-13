import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTarget, FiPlus, FiCheck, FiTrash2, FiX } from 'react-icons/fi';
import CarbonFootprintAPI from '../../services/api';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    goal_type: 'emission_reduction',
    reduction_percentage: '',
    target_emissions: '',
    target_date: '',
    description: ''
  });

  const api = new CarbonFootprintAPI();

  useEffect(() => {
    loadGoals();
    
    // Test backend connection on mount
    const testConnection = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/ping`);
        if (response.ok) {
          console.log('✅ Backend connection successful');
        } else {
          console.warn('⚠️ Backend returned error:', response.status);
        }
      } catch (error) {
        console.error('❌ Backend connection failed:', error);
        // Don't show alert in production, just log
        if (window.location.hostname === 'localhost') {
          alert('Warning: Cannot connect to backend server. Please ensure the backend is running on port 8000.');
        }
      }
    };
    
    testConnection();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const goalsData = await api.getGoals();
      
      // Calculate progress for each goal
      const goalsWithProgress = await Promise.all(
        goalsData.map(async (goal) => {
          try {
            const progress = await api.getGoalProgress(goal.id);
            return { ...goal, progress };
          } catch (error) {
            console.warn(`Failed to get progress for goal ${goal.id}:`, error);
            return { ...goal, progress: null };
          }
        })
      );
      
      setGoals(goalsWithProgress);
    } catch (error) {
      console.error('Error loading goals:', error);
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    try {
      // Validate form data
      if (!formData.target_date) {
        alert('Please select a target date');
        return;
      }

      if (formData.goal_type === 'emission_reduction' && !formData.reduction_percentage) {
        alert('Please enter a reduction percentage');
        return;
      }

      if (formData.goal_type === 'specific_target' && !formData.target_emissions) {
        alert('Please enter a target emissions value');
        return;
      }

      const goalData = {
        goal_type: formData.goal_type,
        target_date: formData.target_date,
        description: formData.description || null,
        ...(formData.goal_type === 'emission_reduction' && formData.reduction_percentage 
          ? { reduction_percentage: parseFloat(formData.reduction_percentage) }
          : {}),
        ...(formData.goal_type === 'specific_target' && formData.target_emissions
          ? { target_emissions: parseFloat(formData.target_emissions) }
          : {})
      };

      console.log('Submitting goal data:', goalData);
      await api.createGoal(goalData);
      
      // Reset form and close
      setShowAddForm(false);
      setFormData({
        goal_type: 'emission_reduction',
        reduction_percentage: '',
        target_emissions: '',
        target_date: '',
        description: ''
      });
      
      // Reload goals
      await loadGoals();
    } catch (error) {
      console.error('Error creating goal:', error);
      alert('Failed to create goal: ' + (error.message || 'Unknown error'));
    }
  };

  const handleMarkAchieved = async (goalId) => {
    try {
      await api.markGoalAchieved(goalId);
      loadGoals();
    } catch (error) {
      alert('Failed to mark goal as achieved: ' + error.message);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) {
      return;
    }
    try {
      await api.deleteGoal(goalId);
      loadGoals();
    } catch (error) {
      alert('Failed to delete goal: ' + error.message);
    }
  };

  const formatGoalTitle = (goal) => {
    if (goal.goal_type === 'emission_reduction') {
      return `Reduce emissions by ${goal.reduction_percentage}%`;
    } else if (goal.goal_type === 'carbon_neutral') {
      return 'Go Carbon Neutral';
    } else if (goal.goal_type === 'specific_target') {
      return `Reach ${goal.target_emissions} kg CO2/year`;
    }
    return goal.description || 'Eco Goal';
  };

  const calculateProgress = (goal) => {
    if (!goal.progress) return 0;
    
    if (goal.goal_type === 'emission_reduction') {
      return goal.progress.current_reduction_percentage || 0;
    } else if (goal.goal_type === 'carbon_neutral') {
      return goal.progress.current_emissions ? 
        Math.max(0, 100 - (goal.progress.current_emissions / (goal.progress.baseline_emissions || 1) * 100)) : 0;
    } else if (goal.goal_type === 'specific_target') {
      const target = goal.target_emissions || 0;
      const current = goal.progress.current_emissions || 0;
      return target > 0 ? Math.min(100, (1 - (current / target)) * 100) : 0;
    }
    return 0;
  };

  const getTargetValue = (goal) => {
    if (goal.goal_type === 'emission_reduction') {
      return goal.reduction_percentage || 0;
    } else if (goal.goal_type === 'carbon_neutral') {
      return 100;
    } else if (goal.goal_type === 'specific_target') {
      return goal.target_emissions || 0;
    }
    return 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <FiTarget size={48} />
            <div>
              <h1 className="text-3xl font-bold mb-1">My Eco Goals 🎯</h1>
              <p className="text-red-50">Track your emission reduction targets</p>
            </div>
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center space-x-2 transition-all"
          >
            <FiPlus /> <span>Add Goal</span>
          </button>
        </div>
      </motion.div>

      {showAddForm && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Create New Goal</h2>
            <button 
              onClick={() => setShowAddForm(false)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <FiX size={24} />
            </button>
          </div>
          <form onSubmit={handleCreateGoal} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Goal Type
              </label>
              <select
                value={formData.goal_type}
                onChange={(e) => setFormData({ ...formData, goal_type: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                required
              >
                <option value="emission_reduction">Reduce Emissions by Percentage</option>
                <option value="carbon_neutral">Go Carbon Neutral</option>
                <option value="specific_target">Reach Specific Target</option>
              </select>
            </div>

            {formData.goal_type === 'emission_reduction' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Reduction Percentage
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.reduction_percentage}
                  onChange={(e) => setFormData({ ...formData, reduction_percentage: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  placeholder="e.g., 10"
                  required
                />
              </div>
            )}

            {formData.goal_type === 'specific_target' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Target Emissions (kg CO2/year)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.target_emissions}
                  onChange={(e) => setFormData({ ...formData, target_emissions: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  placeholder="e.g., 5000"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Target Date
              </label>
              <input
                type="date"
                value={formData.target_date}
                onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                rows="3"
                placeholder="Add a description for your goal..."
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
              >
                Create Goal
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="space-y-4">
        {goals.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center shadow-lg"
          >
            <FiTarget size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No Goals Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Create your first eco goal to start tracking your progress!</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
            >
              <FiPlus className="inline mr-2" /> Create Your First Goal
            </button>
          </motion.div>
        ) : (
          goals.map((goal, idx) => {
            const progress = calculateProgress(goal);
            const target = getTargetValue(goal);
            const isAchieved = goal.is_achieved;
            
            return (
              <motion.div 
                key={goal.id} 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: idx * 0.1 }} 
                className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg ${isAchieved ? 'border-2 border-green-500' : ''}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{formatGoalTitle(goal)}</h3>
                    {isAchieved && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full text-sm flex items-center">
                        <FiCheck className="mr-1" /> Achieved
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                      Due: {new Date(goal.target_date).toLocaleDateString()}
                    </span>
                    {!isAchieved && (
                      <button
                        onClick={() => handleMarkAchieved(goal.id)}
                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors"
                        title="Mark as achieved"
                      >
                        <FiCheck size={20} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                      title="Delete goal"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </div>
                
                {goal.description && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{goal.description}</p>
                )}
                
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="font-semibold text-gray-800 dark:text-white">
                      {progress.toFixed(1)}% / {goal.goal_type === 'emission_reduction' ? `${target}%` : goal.goal_type === 'carbon_neutral' ? '100%' : `${target} kg`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${isAchieved ? 'bg-green-500' : 'bg-gradient-to-r from-green-500 to-blue-600'}`}
                      style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Goals;

