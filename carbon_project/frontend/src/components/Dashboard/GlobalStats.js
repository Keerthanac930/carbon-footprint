import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiGlobe, FiTrendingUp } from 'react-icons/fi';

const GlobalStats = () => {
  const data = [
    { country: 'World Avg', emissions: 4.7, color: '#FF9800' },
    { country: 'India Avg', emissions: 1.9, color: '#2196F3' },
    { country: 'USA', emissions: 16.2, color: '#F44336' },
    { country: 'China', emissions: 7.4, color: '#9C27B0' },
    { country: 'EU', emissions: 6.8, color: '#4CAF50' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center space-x-4">
          <FiGlobe size={48} />
          <div>
            <h1 className="text-3xl font-bold mb-1">Global CO₂ Statistics 🌍</h1>
            <p className="text-indigo-50">Compare emissions worldwide</p>
          </div>
        </div>
      </motion.div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Per Capita Emissions (tonnes/year)</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="country" />
            <YAxis label={{ value: 'Tonnes CO₂', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="emissions" fill="#4CAF50" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <motion.rect key={index} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: index * 0.1 }} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

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

