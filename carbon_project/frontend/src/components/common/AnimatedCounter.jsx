import React, { useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

/**
 * Animated Counter Component
 * Animates from 0 to target value
 */
export const AnimatedCounter = ({ 
  value, 
  decimalPlaces = 2, 
  suffix = '', 
  className = '',
  duration = 1500 
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const spring = useSpring(0, { stiffness: 50, damping: 30 });
  const display = useTransform(spring, (current) => {
    return current.toFixed(decimalPlaces);
  });

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    const unsubscribe = display.onChange((latest) => {
      setDisplayValue(parseFloat(latest));
    });
    return () => unsubscribe();
  }, [display]);

  return (
    <motion.span className={className}>
      {displayValue.toFixed(decimalPlaces)}{suffix}
    </motion.span>
  );
};

