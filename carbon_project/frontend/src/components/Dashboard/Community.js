import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers } from 'react-icons/fi';

const Community = () => {
  const leaderboard = [
    { rank: 1, name: 'Priya Sharma', emissions: 1.2, reduction: 45 },
    { rank: 2, name: 'Rahul Kumar', emissions: 1.5, reduction: 38 },
    { rank: 3, name: 'Anita Patel', emissions: 1.7, reduction: 32 },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center space-x-4">
          <FiUsers size={48} />
          <div>
            <h1 className="text-3xl font-bold mb-1">Community Leaderboard 🏆</h1>
            <p className="text-green-50">Compete with others to reduce emissions</p>
          </div>
        </div>
      </motion.div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Top Eco Champions</h2>
        <div className="space-y-4">
          {leaderboard.map((user, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-xl">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 flex items-center justify-center rounded-full font-bold text-white ${idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : 'bg-orange-600'}`}>
                  {user.rank}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-white">{user.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user.emissions}t CO₂/year</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-600 font-bold">{user.reduction}% ↓</p>
                <p className="text-xs text-gray-500">reduction</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;

