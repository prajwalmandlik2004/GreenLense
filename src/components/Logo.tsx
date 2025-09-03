import React from 'react';
import { Leaf, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

const Logo: React.FC = () => {
  return (
    <motion.div 
      className="flex items-center space-x-3"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        <motion.div 
          className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg"
          whileHover={{ rotate: 5 }}
          transition={{ duration: 0.3 }}
        >
          <Leaf className="w-6 h-6 text-white" />
        </motion.div>
        <motion.div 
          className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center shadow-md"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          <Camera className="w-3 h-3 text-white" />
        </motion.div>
      </div>
      <div className="flex flex-col">
        <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          GreenLens
        </span>
        <span className="text-xs text-gray-500 font-medium -mt-1">
          Farmer's Gallery
        </span>
      </div>
    </motion.div>
  );
};

export default Logo;