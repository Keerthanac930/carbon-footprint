import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAward, FiTrendingUp, FiZap, FiTarget, FiStar } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const Rewards = () => {
  const { user } = useAuth();
  const [selectedBadge, setSelectedBadge] = useState(null);

  const badges = [
    { 
      name: 'Eco Starter', 
      icon: '🌱', 
      level: 1, 
      earned: true, 
      color: 'from-green-400 to-green-600',
      description: 'Completed your first carbon footprint calculation',
      earnedDate: 'Oct 20, 2024',
      points: 50
    },
    { 
      name: 'Green Hero', 
      icon: '🦸', 
      level: 2, 
      earned: true, 
      color: 'from-blue-400 to-blue-600',
      description: 'Reduced emissions by 10% in a month',
      earnedDate: 'Oct 21, 2024',
      points: 100
    },
    { 
      name: 'Carbon Warrior', 
      icon: '⚔️', 
      level: 3, 
      earned: false, 
      color: 'from-purple-400 to-purple-600',
      description: 'Complete 5 consecutive calculations',
      earnedDate: null,
      points: 150
    },
    { 
      name: 'Planet Saver', 
      icon: '🌍', 
      level: 4, 
      earned: false, 
      color: 'from-yellow-400 to-yellow-600',
      description: 'Achieve carbon neutrality for one month',
      earnedDate: null,
      points: 250
    },
    { 
      name: 'Eco Champion', 
      icon: '👑', 
      level: 5, 
      earned: false, 
      color: 'from-red-400 to-red-600',
      description: 'Reduce yearly emissions by 50%',
      earnedDate: null,
      points: 500
    },
    { 
      name: 'Recycling Master', 
      icon: '♻️', 
      level: 2, 
      earned: false, 
      color: 'from-teal-400 to-teal-600',
      description: 'Log 30 days of recycling activities',
      earnedDate: null,
      points: 120
    },
  ];

  const leaderboard = [
    { rank: 1, name: 'EcoWarrior2024', points: 2450, badge: '👑' },
    { rank: 2, name: 'GreenTiger', points: 2180, badge: '🦸' },
    { rank: 3, name: 'PlanetSaver', points: 1950, badge: '🌍' },
    { rank: 4, name: user?.name || 'You', points: 245, badge: '🌱', isCurrentUser: true },
    { rank: 5, name: 'NatureLover', points: 220, badge: '🌿' },
  ];

  const achievements = [
    { title: '7-Day Streak', description: 'Log in for 7 consecutive days', progress: 4, target: 7, icon: '🔥' },
    { title: 'Team Player', description: 'Share 5 tips with community', progress: 2, target: 5, icon: '🤝' },
    { title: 'News Reader', description: 'Read 10 environmental articles', progress: 6, target: 10, icon: '📰' },
    { title: 'Calculator Pro', description: 'Complete 20 calculations', progress: 8, target: 20, icon: '📊' },
  ];

  const totalPoints = badges.filter(b => b.earned).reduce((sum, b) => sum + b.points, 0);
  const currentLevel = Math.floor(totalPoints / 100) + 1;
  const nextLevelPoints = currentLevel * 100;
  const levelProgress = (totalPoints % 100) / 100 * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 opacity-10 text-9xl">🏆</div>
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Your Eco Rewards 🏆</h1>
          <p className="text-yellow-50 text-sm sm:text-base">Earn badges and level up by reducing your carbon footprint!</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="white-card-grid white-card-grid-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          className="white-card white-card-md"
        >
          <div className="white-card-icon-header">
            <div className="white-card-icon">
              <FiZap size={24} />
            </div>
            <div>
              <h3 className="white-card-title text-3xl">{totalPoints}</h3>
              <p className="white-card-subtitle">Total Points</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.05 }}
          className="white-card white-card-md"
        >
          <div className="white-card-icon-header">
            <div className="white-card-icon">
              <FiTrendingUp size={24} />
            </div>
            <div>
              <h3 className="white-card-title text-3xl">7</h3>
              <p className="white-card-subtitle">Day Streak 🔥</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          className="white-card white-card-md"
        >
          <div className="white-card-icon-header">
            <div className="white-card-icon">
              <FiAward size={24} />
            </div>
            <div>
              <h3 className="white-card-title text-3xl">
                {badges.filter(b => b.earned).length}
              </h3>
              <p className="white-card-subtitle">Badges Earned</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          className="white-card white-card-md"
        >
          <div className="white-card-icon-header">
            <div className="white-card-icon">
              <FiTarget size={24} />
            </div>
            <div>
              <h3 className="white-card-title text-3xl">Level {currentLevel}</h3>
              <p className="white-card-subtitle">Current Level</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Level Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="white-card white-card-lg"
      >
        <div className="white-card-icon-header">
          <div className="white-card-icon">
            <FiTarget size={24} />
          </div>
          <div>
            <h2 className="white-card-title text-xl">Level Progress</h2>
            <p className="white-card-subtitle">
              {totalPoints} / {nextLevelPoints} points
            </p>
          </div>
        </div>
        <div className="white-card-content">
          <div className="relative w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full"
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {100 - totalPoints % 100} points until Level {currentLevel + 1}
          </p>
        </div>
      </motion.div>

      {/* Badges Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="white-card white-card-lg"
      >
        <div className="white-card-icon-header">
          <div className="white-card-icon">
            <FiAward size={24} />
          </div>
          <div>
            <h2 className="white-card-title text-2xl">Your Badges</h2>
            <p className="white-card-subtitle">Earned achievements and progress</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {badges.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedBadge(badge)}
              className={`relative p-6 rounded-2xl text-center cursor-pointer transition-all ${
                badge.earned
                  ? `bg-gradient-to-br ${badge.color} shadow-lg`
                  : 'bg-gray-200 dark:bg-gray-700 opacity-50 grayscale'
              }`}
            >
              {badge.earned && (
                <div className="absolute top-2 right-2">
                  <FiStar className="text-yellow-300 fill-yellow-300" size={16} />
                </div>
              )}
              <div className="text-5xl mb-3">{badge.icon}</div>
              <h4 className={`font-bold text-sm mb-1 ${badge.earned ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                {badge.name}
              </h4>
              <p className={`text-xs ${badge.earned ? 'text-white opacity-90' : 'text-gray-500'}`}>
                Level {badge.level}
              </p>
              {badge.earned && (
                <div className="mt-2 text-xs text-white font-semibold">
                  +{badge.points} pts
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
          <FiTarget className="mr-2 text-blue-500" />
          Current Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + idx * 0.1 }}
              className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-600 rounded-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{achievement.icon}</span>
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-white">{achievement.title}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{achievement.description}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {achievement.progress}/{achievement.target}
                  </span>
                </div>
                <div className="relative w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                    transition={{ duration: 1, delay: 0.9 + idx * 0.1 }}
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
          <FiAward className="mr-2 text-yellow-500" />
          Global Leaderboard
        </h2>
        <div className="space-y-3">
          {leaderboard.map((entry, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + idx * 0.1 }}
              className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                entry.isCurrentUser
                  ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg'
                  : 'bg-gray-50 dark:bg-slate-700 hover:shadow-md'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`text-2xl font-bold ${
                  entry.rank === 1 ? 'text-yellow-400' :
                  entry.rank === 2 ? 'text-gray-400' :
                  entry.rank === 3 ? 'text-orange-400' :
                  entry.isCurrentUser ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  #{entry.rank}
                </div>
                <span className="text-3xl">{entry.badge}</span>
                <div>
                  <p className={`font-bold ${entry.isCurrentUser ? 'text-white' : 'text-gray-800 dark:text-white'}`}>
                    {entry.name}
                    {entry.isCurrentUser && <span className="ml-2 text-sm">(You)</span>}
                  </p>
                  <p className={`text-sm ${entry.isCurrentUser ? 'text-green-100' : 'text-gray-600 dark:text-gray-400'}`}>
                    {entry.points} points
                  </p>
                </div>
              </div>
              {entry.rank <= 3 && (
                <FiAward size={24} className={
                  entry.rank === 1 ? 'text-yellow-400' :
                  entry.rank === 2 ? 'text-gray-400' :
                  'text-orange-400'
                } />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBadge(null)}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`bg-gradient-to-br ${selectedBadge.color} rounded-2xl p-8 max-w-md w-full text-white shadow-2xl`}
            >
              <div className="text-center">
                <div className="text-8xl mb-4">{selectedBadge.icon}</div>
                <h3 className="text-3xl font-bold mb-2">{selectedBadge.name}</h3>
                <p className="text-sm opacity-90 mb-4">Level {selectedBadge.level} Badge</p>
                <p className="mb-6">{selectedBadge.description}</p>
                {selectedBadge.earned ? (
                  <div className="space-y-2">
                    <p className="text-sm">✅ Earned on {selectedBadge.earnedDate}</p>
                    <p className="text-2xl font-bold">+{selectedBadge.points} Points</p>
                  </div>
                ) : (
                  <p className="text-sm opacity-75">🔒 Keep working to unlock this badge!</p>
                )}
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="mt-6 px-6 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Rewards;
