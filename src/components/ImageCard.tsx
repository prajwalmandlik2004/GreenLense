import React from 'react';
import { Calendar, MapPin, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { ImageDoc } from '../types/image';
import clsx from 'clsx';

interface ImageCardProps {
  image: ImageDoc;
  onClick: () => void;
  className?: string;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onClick, className }) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'flowers':
        return { color: 'bg-pink-100 text-pink-700 border-pink-200', emoji: '🌸' };
      case 'nature':
        return { color: 'bg-green-100 text-green-700 border-green-200', emoji: '🌲' };
      case 'crops':
        return { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', emoji: '🌾' };
      default:
        return { color: 'bg-gray-100 text-gray-700 border-gray-200', emoji: '📷' };
    }
  };

  const categoryInfo = getCategoryInfo(image.category);

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        'bg-white rounded-3xl shadow-lg overflow-hidden cursor-pointer group border border-gray-100',
        'hover:shadow-2xl transition-all duration-300',
        className
      )}
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={image.url}
          alt={image.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* View Button */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
            <Eye className="w-5 h-5 text-gray-700" />
          </div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className={clsx(
            'inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-sm',
            categoryInfo.color
          )}>
            <span className="mr-1">{categoryInfo.emoji}</span>
            {image.category}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-gray-800 line-clamp-1 group-hover:text-green-600 transition-colors">
            {image.name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {image.description}
          </p>
        </div>
        
        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(image.createdAt)}</span>
          </div>
          {image.location && (
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span className="truncate max-w-20">{image.location}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ImageCard;