import React from 'react';
import { Sprout, Heart, Camera, Users, Award, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Section from '../components/Section';

const About: React.FC = () => {
  const values = [
    {
      icon: Heart,
      title: 'Passion for Agriculture',
      description: 'We believe farming is both an art and a science, deserving to be celebrated and shared.',
    },
    {
      icon: Camera,
      title: 'Authentic Moments',
      description: 'Every image captures real moments from our daily work, not staged photography.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Built by farmers, for farmers, to connect and inspire agricultural communities.',
    },
  ];

  const achievements = [
    { icon: Camera, value: '1,000+', label: 'Photos Shared' },
    { icon: Users, value: '100+', label: 'Contributors' },
    { icon: Globe, value: '25+', label: 'Farm Locations' },
    { icon: Award, value: '4.9★', label: 'Community Rating' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 to-blue-50/30 pt-16 lg:pt-20">
      {/* Hero Section */}
      <Section className="pt-8 lg:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl"
          >
            <Sprout className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-gray-800">About</span>
            <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent"> GreenLens</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The story behind our farmer's gallery and the community that makes it special
          </p>
        </motion.div>

        {/* Main Story */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
                Born from the Fields
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                GreenLens was born from a simple observation: farming offers some of the most beautiful 
                and authentic views of nature, yet these moments often go unshared. As farmers, we witness 
                the daily magic of growth, the changing seasons, and the delicate balance of agricultural life.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                This gallery is our way of sharing those special moments – from the first bloom of spring 
                flowers to the golden wheat ready for harvest, from misty morning landscapes to the 
                satisfaction of a well-tended crop.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/upload"
                className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Camera className="w-5 h-5 mr-2" />
                Start Sharing
              </Link>
              <Link
                to="/flowers"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-green-600 text-green-600 font-semibold rounded-xl hover:bg-green-50 transition-all duration-200"
              >
                Explore Gallery
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-3xl p-8 text-center shadow-xl">
              <Camera className="w-16 h-16 text-green-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Captured with Care
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Every image in our collection is taken during our daily work, 
                offering an authentic glimpse into farm life and the natural beauty that surrounds us.
                No staged photos, just real moments from real farmers.
              </p>
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-green-600/20 to-green-400/20 rounded-3xl -z-10 blur-xl" />
          </motion.div>
        </div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Our <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">Values</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              What drives us to create and maintain this platform for the farming community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 text-center border border-gray-100"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-8 lg:p-12 text-center text-white relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 border border-white rounded-full" />
            <div className="absolute top-20 right-20 w-16 h-16 border border-white rounded-full" />
            <div className="absolute bottom-10 left-20 w-12 h-12 border border-white rounded-full" />
            <div className="absolute bottom-20 right-10 w-24 h-24 border border-white rounded-full" />
          </div>

          <div className="relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold mb-4"
            >
              Growing Together
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg sm:text-xl text-green-100 mb-12 max-w-2xl mx-auto"
            >
              Our community continues to grow, sharing the beauty and hard work of agricultural life
            </motion.p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <motion.div
                    key={achievement.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl sm:text-4xl font-bold mb-2">
                      {achievement.value}
                    </div>
                    <div className="text-green-100 font-medium">
                      {achievement.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </Section>
    </div>
  );
};

export default About;