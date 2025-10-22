import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiTarget, FiPlus, FiCheck } from 'react-icons/fi';

const Goals = () => {
  const [goals, setGoals] = useState([
    { id: 1, title: 'Reduce by 10% in 3 months', target: 10, current: 7, deadline: '2024-12-31' },
    { id: 2, title: 'Go carbon neutral', target: 100, current: 25, deadline: '2025-06-30' }
  ]);

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
          <button className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center space-x-2">
            <FiPlus /> <span>Add Goal</span>
          </button>
        </div>
      </motion.div>

      <div className="space-y-4">
        {goals.map((goal, idx) => (
          <motion.div key={goal.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">{goal.title}</h3>
              <span className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full">Due: {goal.deadline}</span>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Progress</span>
                <span className="font-semibold text-gray-800 dark:text-white">{goal.current}% / {goal.target}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div className="bg-gradient-to-r from-green-500 to-blue-600 h-3 rounded-full transition-all duration-500" style={{ width: `${(goal.current / goal.target) * 100}%` }}></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Goals;

