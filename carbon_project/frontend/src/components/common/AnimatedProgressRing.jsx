import React from 'react';
import { motion } from 'framer-motion';

/**
 * Animated Circular Progress Ring
 * Shows progress with severity colors
 */
export const AnimatedProgressRing = ({
  value, // 0.0 to 1.0
  maxValue = 10.0,
  size = 120,
  strokeWidth = 12,
  label,
  subtitle,
  className = '',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(value / maxValue, 0), 1);
  const offset = circumference - (progress * circumference);

  // Get color based on value
  const getColor = (val) => {
    const actualValue = val * maxValue;
    if (actualValue < 2.0) return '#10B981'; // Green
    if (actualValue < 4.0) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  const color = getColor(value);

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(0, 0, 0, 0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: 'easeOut' }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label && (
          <span className="text-2xl font-bold" style={{ color }}>
            {label}
          </span>
        )}
        {subtitle && (
          <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

