import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, WifiOff } from 'lucide-react';

/**
 * Reusable Error Widget Component
 */
export const ErrorWidget = ({ message, onRetry, icon: Icon = AlertCircle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] p-8"
    >
      <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
        <Icon className="text-red-600 dark:text-red-400" size={48} />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        Oops!
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
        >
          <RefreshCw size={20} />
          Retry
        </button>
      )}
    </motion.div>
  );
};

/**
 * Network Error Widget
 */
export const NetworkErrorWidget = ({ onRetry }) => {
  return (
    <ErrorWidget
      message="Unable to connect to the server. Please check your internet connection and try again."
      onRetry={onRetry}
      icon={WifiOff}
    />
  );
};

/**
 * Empty State Widget
 */
export const EmptyStateWidget = ({ 
  title, 
  message, 
  icon: Icon, 
  actionLabel, 
  onAction 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] p-8"
    >
      {Icon && (
        <div className="w-32 h-32 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-6">
          <Icon className="text-gray-400" size={64} />
        </div>
      )}
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">
        {message}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
};

/**
 * Loading Widget
 */
export const LoadingWidget = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400 font-medium">{message}</p>
    </div>
  );
};

