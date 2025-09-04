import React, { useState, useMemo } from 'react';
import { Search, Filter, Grid, List, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageDoc, CategoryType } from '../types/image';
import ImageCard from './ImageCard';
import ImageLightbox from './ImageLightbox';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface ImageGridProps {
  images: ImageDoc[];
  showCategoryFilter?: boolean;
  onImageDelete?: (imageId: string) => void;
  onImageUpdate?: (imageId: string, updates: Partial<ImageDoc>) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, showCategoryFilter = false, onImageDelete, onImageUpdate }) => {
  const [selectedImage, setSelectedImage] = useState<ImageDoc | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const navigate = useNavigate();

  const handleDeleteImage = async (imageId: string) => {
    try {

      const { error } = await supabase
        .from('images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      toast.success('Image deleted successfully!');

      setSelectedImage(null);

      if (onImageDelete) {
        onImageDelete(imageId);
      } 
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image. Please try again.');
    }
  };

  const handleEditImage = async (imageId: string, updates: Partial<ImageDoc>) => {
    try {
      const { error } = await supabase
        .from('images')
        .update({
          name: updates.name,
          description: updates.description,
          category: updates.category,
          location: updates.location
        })
        .eq('id', imageId);

      if (error) throw error;

      toast.success('Data updated successfully!');

      setSelectedImage(prev => prev ? { ...prev, ...updates } : null);

      if (onImageUpdate) {
        onImageUpdate(imageId, updates);
      } 
      console.log('Image updated successfully');
    } catch (error) {
      console.error('Error updating image:', error);
      alert('Failed to update image. Please try again.');
    }
  };


  const filteredAndSortedImages = useMemo(() => {
    let filtered = images;

    if (showCategoryFilter && selectedCategory !== 'all') {
      filtered = filtered.filter(image => image.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(image =>
        image.name.toLowerCase().includes(query) ||
        image.description.toLowerCase().includes(query) ||
        (image.location && image.location.toLowerCase().includes(query))
      );
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  }, [images, selectedCategory, searchQuery, sortBy, showCategoryFilter]);

  return (
    <div className="space-y-8">
      {/* Enhanced Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
      >
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
          {/* Search */}
          <div className="flex-1 w-full lg:max-w-md">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search images, descriptions, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Category Filter */}
            {showCategoryFilter && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as CategoryType | 'all')}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 bg-white"
              >
                <option value="all">All Categories</option>
                <option value="flowers">🌸 Flowers</option>
                <option value="nature">🌲 Nature</option>
                <option value="crops">🌾 Crops</option>
              </select>
            )}

            {/* Sort */}
            <div className="flex items-center space-x-3">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">By Name</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={clsx(
                  'p-2 rounded-lg transition-all duration-200',
                  viewMode === 'grid' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500 hover:text-gray-700'
                )}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('masonry')}
                className={clsx(
                  'p-2 rounded-lg transition-all duration-200',
                  viewMode === 'masonry' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500 hover:text-gray-700'
                )}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-800">{filteredAndSortedImages.length}</span> of{' '}
            <span className="font-semibold text-gray-800">{images.length}</span> images
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Clear search
            </button>
          )}
        </div>
      </motion.div>

      {/* Image Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${searchQuery}-${selectedCategory}-${sortBy}-${viewMode}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className={clsx(
            'grid gap-6',
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          )}
        >
          {filteredAndSortedImages.map((image, index) => (
            <motion.div
              key={image.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <ImageCard
                image={image}
                onClick={() => setSelectedImage(image)}
                className="h-full"
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Empty State */}
      {filteredAndSortedImages.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center py-16 bg-white rounded-3xl shadow-lg border border-gray-100"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">No Images Found</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {searchQuery
              ? `No images match "${searchQuery}". Try adjusting your search terms.`
              : 'No images available in this category yet.'
            }
          </p>
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Clear Search
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          ) : (
            <button
              onClick={() => navigate('/upload')}
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Upload First Image
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          )}
        </motion.div>
      )}

      {/* Lightbox */}
      <ImageLightbox
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
        onDelete={handleDeleteImage}
        onEdit={handleEditImage}
      />
    </div>
  );
};

export default ImageGrid;