import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiActivity, FiDownload, FiBarChart2 } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AdminPanel = () => {
  const stats = [
    { label: 'Total Users', value: '1,245', icon: FiUsers, color: 'from-blue-400 to-blue-600' },
    { label: 'Calculations Today', value: '342', icon: FiActivity, color: 'from-green-400 to-green-600' },
    { label: 'Total CO₂ Tracked', value: '5,432t', icon: FiBarChart2, color: 'from-purple-400 to-purple-600' },
  ];

  const userData = [
    { month: 'Jan', users: 200 },
    { month: 'Feb', users: 350 },
    { month: 'Mar', users: 520 },
    { month: 'Apr', users: 780 },
    { month: 'May', users: 1000 },
    { month: 'Jun', users: 1245 },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard 👨‍💼</h1>
        <p className="text-gray-300">Platform analytics and user management</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                <IconComponent className="text-white" size={24} />
              </div>
              <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-1">{stat.label}</h3>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">User Growth</h2>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            <FiDownload size={18} />
            <span>Export Data</span>
          </button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={userData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="users" fill="#4CAF50" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminPanel;

