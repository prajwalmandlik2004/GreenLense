import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Upload, Flower, TreePine, Wheat, ArrowRight, Star, Users, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { listImages, seedDefaults } from '../lib/db';
import { ImageDoc } from '../types/image';
import HeroSlider from '../components/HeroSlider';
import Section from '../components/Section';

const Home: React.FC = () => {
  const [featuredImages, setFeaturedImages] = useState<ImageDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedImages = async () => {
      try {
        await seedDefaults();
        const images = await listImages({ limit: 8 });
        setFeaturedImages(images);
      } catch (error) {
        console.error('Error loading featured images:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedImages();
  }, []);

  const features = [
    {
      icon: Flower,
      title: 'Beautiful Flowers',
      description: 'Discover vibrant blooms and delicate petals from our gardens and wild meadows',
      link: '/flowers',
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600',
    },
    {
      icon: TreePine,
      title: 'Natural Landscapes',
      description: 'Explore serene forests, mountains, and countryside views captured during our work',
      link: '/nature',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      icon: Wheat,
      title: 'Farm Life & Crops',
      description: 'See the fruits of our labor and the agricultural cycle through the seasons',
      link: '/crops',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
  ];

  const stats = [
    { icon: ImageIcon, value: '500+', label: 'Photos Shared' },
    { icon: Users, value: '50+', label: 'Contributors' },
    { icon: Star, value: '4.9', label: 'Community Rating' },
  ];

  return (
    <div className="min-h-screen bg-white pt-16 lg:pt-20">
      {/* Hero Section */}
      <Section className="pt-8 lg:pt-16 pb-16 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 text-center lg:text-left"
          >
            <div className="space-y-6">
              <motion.h1 
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  A Farmer's
                </span>
                <br />
                <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                  Perspective
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Capturing the beauty of flowers, fields, and forests through the eyes of 
                someone who works the land every day. Share your agricultural moments with our community.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                to="/flowers"
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-2xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <Camera className="w-5 h-5 mr-2" />
                Explore Gallery
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/upload"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-green-600 text-green-600 font-semibold rounded-2xl hover:bg-green-50 transition-all duration-300 backdrop-blur-sm"
              >
                <Upload className="w-5 h-5 mr-2" />
                Share Photos
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex justify-center lg:justify-start space-x-8 pt-8"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <Icon className="w-4 h-4 text-green-600" />
                      <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                    </div>
                    <span className="text-sm text-gray-600">{stat.label}</span>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {!loading && featuredImages.length > 0 ? (
              <div className="relative">
                <HeroSlider images={featuredImages} height="h-80 sm:h-96 lg:h-[500px]" />
                <div className="absolute -inset-4 bg-gradient-to-r from-green-600/20 to-green-400/20 rounded-3xl -z-10 blur-xl" />
              </div>
            ) : (
              <div className="h-80 sm:h-96 lg:h-[500px] bg-gradient-to-br from-gray-100 to-green-50 rounded-3xl animate-pulse flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-200 rounded-2xl animate-pulse mx-auto" />
                  <p className="text-gray-500 font-medium">Loading featured images...</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </Section>

      {/* Features Section */}
      <Section className="bg-gradient-to-br from-gray-50 to-green-50/30 py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            What You'll <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">Discover</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Each gallery tells a unique story of our daily life on the farm, 
            from sunrise to sunset, through every season
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Link
                  to={feature.link}
                  className={`block ${feature.bgColor} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50 backdrop-blur-sm h-full`}
                >
                  <div className="text-center space-y-6">
                    <motion.div 
                      className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-3xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon className="w-10 h-10 text-white" />
                    </motion.div>
                    
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-center text-green-600 font-semibold group-hover:translate-x-2 transition-transform">
                      Explore Collection
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* Call to Action */}
      <Section className="py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-8 lg:p-16 text-center overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 border border-white rounded-full" />
            <div className="absolute top-20 right-20 w-16 h-16 border border-white rounded-full" />
            <div className="absolute bottom-10 left-20 w-12 h-12 border border-white rounded-full" />
            <div className="absolute bottom-20 right-10 w-24 h-24 border border-white rounded-full" />
          </div>

          <div className="relative z-10 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                Ready to Share Your Story?
              </h3>
              <p className="text-lg sm:text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
                Join our growing community of farmers and nature lovers. Upload your photos 
                and become part of our beautiful collection of agricultural and natural beauty.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link
                to="/upload"
                className="group inline-flex items-center px-8 py-4 bg-white text-green-600 font-bold rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <Upload className="w-6 h-6 mr-3" />
                Upload Your Photos
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/flowers"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-2xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                <Camera className="w-6 h-6 mr-3" />
                Browse Gallery
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-green-100 text-sm"
            >
              ✨ Mobile camera supported • No account required • Free forever
            </motion.div>
          </div>
        </motion.div>
      </Section>

      {/* Featured Images Preview */}
      {!loading && featuredImages.length > 0 && (
        <Section className="bg-gradient-to-br from-gray-50 to-green-50/30 py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              Recent <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">Captures</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Fresh from the field - our latest additions to the gallery
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6"
          >
            {featuredImages.slice(0, 8).map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h4 className="font-semibold text-sm mb-1 line-clamp-1">{image.name}</h4>
                  <p className="text-xs opacity-90 line-clamp-2">{image.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/flowers"
              className="inline-flex items-center px-6 py-3 text-green-600 font-semibold hover:text-green-700 transition-colors group"
            >
              View All Photos
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </Section>
      )}
    </div>
  );
};

export default Home;