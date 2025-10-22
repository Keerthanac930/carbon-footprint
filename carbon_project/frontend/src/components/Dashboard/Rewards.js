import React from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiTrendingUp, FiZap, FiTarget } from 'react-icons/fi';

const Rewards = () => {
  const badges = [
    { name: 'Eco Starter', icon: '🌱', level: 1, earned: true, color: 'from-green-400 to-green-600' },
    { name: 'Green Hero', icon: '🦸', level: 2, earned: true, color: 'from-blue-400 to-blue-600' },
    { name: 'Carbon Warrior', icon: '⚔️', level: 3, earned: false, color: 'from-purple-400 to-purple-600' },
    { name: 'Planet Saver', icon: '🌍', level: 4, earned: false, color: 'from-yellow-400 to-yellow-600' },
    { name: 'Eco Champion', icon: '👑', level: 5, earned: false, color: 'from-red-400 to-red-600' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2">Your Eco Rewards 🏆</h1>
        <p className="text-yellow-50">Earn badges and level up by reducing your carbon footprint!</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <FiZap className="text-yellow-500 mb-2" size={32} />
          <h3 className="text-3xl font-bold text-gray-800 dark:text-white">245</h3>
          <p className="text-gray-600 dark:text-gray-400">Total Points</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <FiTrendingUp className="text-green-500 mb-2" size={32} />
          <h3 className="text-3xl font-bold text-gray-800 dark:text-white">7</h3>
          <p className="text-gray-600 dark:text-gray-400">Day Streak</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <FiAward className="text-blue-500 mb-2" size={32} />
          <h3 className="text-3xl font-bold text-gray-800 dark:text-white">2</h3>
          <p className="text-gray-600 dark:text-gray-400">Badges Earned</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <FiTarget className="text-purple-500 mb-2" size={32} />
          <h3 className="text-3xl font-bold text-gray-800 dark:text-white">Level 2</h3>
          <p className="text-gray-600 dark:text-gray-400">Current Level</p>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Your Badges</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {badges.map((badge, index) => (
            <motion.div key={index} whileHover={{ scale: 1.05 }} className={`p-6 rounded-2xl text-center ${badge.earned ? `bg-gradient-to-br ${badge.color}` : 'bg-gray-200 dark:bg-gray-700 opacity-50'}`}>
              <div className="text-5xl mb-3">{badge.icon}</div>
              <h4 className={`font-bold mb-1 ${badge.earned ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}>{badge.name}</h4>
              <p className={`text-sm ${badge.earned ? 'text-white' : 'text-gray-500'}`}>Level {badge.level}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Rewards;

