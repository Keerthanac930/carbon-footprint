import React from 'react';
import { motion } from 'framer-motion';

const DigitalAvatar = () => {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2">Your Digital Twin 👤</h1>
        <p className="text-pink-50">Visual representation of your lifestyle impact</p>
      </motion.div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 shadow-lg text-center">
        <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }} className="w-64 h-64 mx-auto bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
          <span className="text-9xl">🌱</span>
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-6">Eco-Friendly Avatar</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Your avatar evolves as you reduce emissions!</p>
      </div>
    </div>
  );
};

export default DigitalAvatar;

