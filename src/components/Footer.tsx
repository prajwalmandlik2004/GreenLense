import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Heart, Camera, Leaf, MapPin, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from './Logo';

const Footer: React.FC = () => {
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/flowers', label: 'Flowers' },
    { path: '/nature', label: 'Nature' },
    { path: '/crops', label: 'Crops' },
    { path: '/upload', label: 'Upload' },
    { path: '/about', label: 'About' },
  ];

  const stats = [
    { label: 'Photos Shared', value: '500+', icon: Camera },
    { label: 'Happy Farmers', value: '50+', icon: Leaf },
    { label: 'Locations', value: '25+', icon: MapPin },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-50 to-green-50/30 border-t border-gray-200/50">
      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-8 mb-12"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-gray-600">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo and Description */}
          <div className="lg:col-span-2 space-y-6">
            <Logo />
            <p className="text-gray-600 leading-relaxed max-w-md">
              A farmer's perspective on the beauty of flowers, landscapes, and farm life. 
              Sharing authentic moments captured from our daily work in the fields, 
              celebrating the connection between agriculture and natural beauty.
            </p>
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
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-gray-600 hover:text-green-600 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1 h-1 bg-green-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Get in Touch
            </h3>
            <div className="space-y-3">
              <a
                href="mailto:hello@greenlens.farm"
                className="flex items-center text-gray-600 hover:text-green-600 transition-colors duration-200 group"
              >
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-3 group-hover:bg-green-200 transition-colors">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium">Email Us</div>
                  <div className="text-sm">hello@greenlens.farm</div>
                </div>
              </a>
              <a
                href="tel:+1234567890"
                className="flex items-center text-gray-600 hover:text-green-600 transition-colors duration-200 group"
              >
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-3 group-hover:bg-green-200 transition-colors">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium">Call Us</div>
                  <div className="text-sm">(123) 456-7890</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200/50">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} GreenLens. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <Link to="/privacy" className="hover:text-green-600 transition-colors">
                  Privacy Policy
                </Link>
                <span>•</span>
                <Link to="/terms" className="hover:text-green-600 transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
            <motion.p 
              className="text-gray-500 text-sm flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Built with <Heart className="w-4 h-4 mx-1 text-red-500" /> by farmers, for farmers
            </motion.p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;