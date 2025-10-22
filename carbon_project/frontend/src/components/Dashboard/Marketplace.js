import React from 'react';
import { motion } from 'framer-motion';
import { FiShoppingCart } from 'react-icons/fi';

const Marketplace = () => {
  const projects = [
    { name: 'Tree Planting India', offset: '5 tonnes', cost: '₹2,500', img: '🌳' },
    { name: 'Solar Energy Project', offset: '10 tonnes', cost: '₹5,000', img: '☀️' },
    { name: 'Ocean Cleanup', offset: '8 tonnes', cost: '₹4,000', img: '🌊' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center space-x-4">
          <FiShoppingCart size={48} />
          <div>
            <h1 className="text-3xl font-bold mb-1">Carbon Offset Marketplace 🛒</h1>
            <p className="text-emerald-50">Support eco-projects and offset your emissions</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((project, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} whileHover={{ y: -5 }} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow">
            <div className="text-center mb-4">
              <div className="text-6xl mb-3">{project.img}</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{project.name}</h3>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Offset:</span>
                <span className="font-bold text-green-600">{project.offset}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Cost:</span>
                <span className="font-bold text-gray-800 dark:text-white">{project.cost}</span>
              </div>
            </div>
            <button className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow">
              Purchase Offset
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;

