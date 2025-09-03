import React from 'react';
import { Flower, TreePine, Wheat } from 'lucide-react';
import { motion } from 'framer-motion';
import { CategoryType } from '../types/image';
import clsx from 'clsx';

interface CategoryTabsProps {
  activeCategory: CategoryType | 'all';
  onCategoryChange: (category: CategoryType | 'all') => void;
  counts?: Record<CategoryType | 'all', number>;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ 
  activeCategory, 
  onCategoryChange, 
  counts 
}) => {
  const tabs = [
    { id: 'all' as const, label: 'All', icon: null },
    { id: 'flowers' as const, label: 'Flowers', icon: Flower },
    { id: 'nature' as const, label: 'Nature', icon: TreePine },
    { id: 'crops' as const, label: 'Crops', icon: Wheat },
  ];

  return (
    <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-xl">
      {tabs.map((tab) => {
        const isActive = activeCategory === tab.id;
        const Icon = tab.icon;
        const count = counts?.[tab.id];

        return (
          <button
            key={tab.id}
            onClick={() => onCategoryChange(tab.id)}
            className={clsx(
              'relative flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all',
              'focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
              isActive
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 bg-white rounded-lg shadow-sm"
                transition={{ duration: 0.2 }}
              />
            )}
            <div className="relative flex items-center space-x-2">
              {Icon && <Icon className="w-4 h-4" />}
              <span>{tab.label}</span>
              {count !== undefined && (
                <span className={clsx(
                  'text-xs px-2 py-0.5 rounded-full',
                  isActive ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-600'
                )}>
                  {count}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryTabs;