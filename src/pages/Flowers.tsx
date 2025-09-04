import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flower, Sparkles } from 'lucide-react';
import { listImages } from '../lib/db';
import { ImageDoc } from '../types/image';
import Section from '../components/Section';
import HeroSlider from '../components/HeroSlider';
import ImageGrid from '../components/ImageGrid';

const Flowers: React.FC = () => {
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
        const flowerImages = await listImages({ category: 'flowers' });
        setImages(flowerImages);
      } catch (error) {
        console.error('Error loading flower images:', error);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-green-50 pt-16 lg:pt-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center bg-white rounded-3xl p-8 shadow-xl"
        >
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading flower gallery...</p>
        </motion.div>
      </div>
    );
  }

  const sliderImages = images.slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 to-green-50/30 pt-16 lg:pt-20">
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
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-3xl flex items-center justify-center shadow-lg"
            >
              <Flower className="w-8 h-8 text-white" />
            </motion.div>
            <Sparkles className="w-6 h-6 text-pink-500" />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
              Flower
            </span>
            <span className="text-gray-800"> Gallery</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Delicate blooms and vibrant colors from our gardens and wild meadows.
            Each flower tells a story of seasons, care, and natural beauty.
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
              effect="fade"
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

export default Flowers;