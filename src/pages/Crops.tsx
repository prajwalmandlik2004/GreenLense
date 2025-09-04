import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wheat, Tractor } from 'lucide-react';
import { listImages } from '../lib/db';
import { ImageDoc } from '../types/image';
import Section from '../components/Section';
import HeroSlider from '../components/HeroSlider';
import ImageGrid from '../components/ImageGrid';

const Crops: React.FC = () => {
  const [images, setImages] = useState<ImageDoc[]>([]);
  const [loading, setLoading] = useState(true);

  const handleImageDelete = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleImageUpdate = (imageId: string, updates: Partial<ImageDoc>) => {
    setImages(prev => prev.map(img =>
      img.id === imageId ? { ...img, ...updates } : img
    ));
  };

  useEffect(() => {
    const loadImages = async () => {
      try {
        const cropImages = await listImages({ category: 'crops' });
        setImages(cropImages);
      } catch (error) {
        console.error('Error loading crop images:', error);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-50 pt-16 lg:pt-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center bg-white rounded-3xl p-8 shadow-xl"
        >
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading crops gallery...</p>
        </motion.div>
      </div>
    );
  }

  const sliderImages = images.slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50/30 to-green-50/30 pt-16 lg:pt-20">
      {/* Hero Section */}
      <Section className="pt-8 lg:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-3 mb-6">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-lg"
            >
              <Wheat className="w-8 h-8 text-white" />
            </motion.div>
            <Tractor className="w-6 h-6 text-yellow-600" />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-yellow-600 to-orange-500 bg-clip-text text-transparent">
              Crops & Farm
            </span>
            <span className="text-gray-800"> Life</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The fruits of our labor and the beauty found in agricultural life.
            From golden wheat fields to thriving vegetable gardens, witness the cycle of growth and harvest.
          </p>
        </motion.div>

        {sliderImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-16"
          >
            <HeroSlider
              images={sliderImages}
              height="h-80 sm:h-96 lg:h-[500px]"
            />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <ImageGrid images={images} onImageDelete={handleImageDelete}
            onImageUpdate={handleImageUpdate} />
        </motion.div>
      </Section>
    </div>
  );
};

export default Crops;