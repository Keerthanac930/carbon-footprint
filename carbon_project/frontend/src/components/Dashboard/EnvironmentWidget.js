import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiWind, FiDroplet, FiSun, FiThermometer } from 'react-icons/fi';

const EnvironmentWidget = () => {
  const [data, setData] = useState({
    aqi: 85,
    temp: 28,
    humidity: 65,
    renewable: 23
  });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Live Environmental Data</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-3">
          <FiWind className="text-blue-500" size={24} />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">AQI</p>
            <p className="text-lg font-bold text-gray-800 dark:text-white">{data.aqi}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <FiThermometer className="text-red-500" size={24} />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Temp</p>
            <p className="text-lg font-bold text-gray-800 dark:text-white">{data.temp}°C</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <FiDroplet className="text-cyan-500" size={24} />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Humidity</p>
            <p className="text-lg font-bold text-gray-800 dark:text-white">{data.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <FiSun className="text-yellow-500" size={24} />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Renewable</p>
            <p className="text-lg font-bold text-gray-800 dark:text-white">{data.renewable}%</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EnvironmentWidget;

