// src/components/LoadingSpinner.jsx
import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  // Animation variants for the outer circle
  const circleVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 2,
        ease: 'linear',
        repeat: Infinity,
      },
    },
  };

  // Animation variants for the inner dots
  const dotVariants = {
    animate: {
      scale: [1, 1.3, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatDelay: 0.2,
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <motion.div
        className="relative w-16 h-16"
        variants={circleVariants}
        animate="animate"
      >
        {/* Outer rotating circle */}
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="black"
            strokeWidth="4"
            strokeDasharray="60 100"
          />
        </svg>

        {/* Inner pulsing dots */}
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="absolute w-3 h-3 bg-gray-700 rounded-full"
            style={{
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) rotate(${index * 120}deg) translateY(-30px)`,
            }}
            variants={dotVariants}
            animate="animate"
            transition={{ delay: index * 0.2 }}
          />
        ))}
      </motion.div>
      <motion.p
        className="mt-4 text-gray-600 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Loading events...
      </motion.p>
    </div>
  );
};

export default LoadingSpinner;