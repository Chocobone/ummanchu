'use client';

import { motion } from 'framer-motion';

const Loading = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-800">
      <motion.div
        className="w-16 h-16 border-4 border-t-transparent border-gray-800 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      />

      <motion.p
        className="mt-6 text-lg font-medium tracking-wider"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Loading...
      </motion.p>
    </div>
  );
};

export default Loading;