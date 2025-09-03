import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import { MapPin, Calendar } from 'lucide-react';
import { ImageDoc } from '../types/image';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

interface HeroSliderProps {
  images: ImageDoc[];
  height?: string;
  showPagination?: boolean;
  showNavigation?: boolean;
  autoplay?: boolean;
  effect?: 'slide' | 'fade';
}

const HeroSlider: React.FC<HeroSliderProps> = ({
  images,
  height = 'h-64 sm:h-80 lg:h-96',
  showPagination = true,
  showNavigation = true,
  autoplay = true,
  effect = 'slide',
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (!mounted || images.length === 0) {
    return (
      <div className={`${height} bg-gradient-to-br from-gray-100 to-green-50 rounded-3xl animate-pulse flex items-center justify-center shadow-lg`}>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-200 rounded-2xl animate-pulse mx-auto" />
          <p className="text-gray-500 font-medium">Loading images...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative group"
    >
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        loop={images.length > 1}
        effect={effect}
        autoplay={autoplay ? {
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        } : false}
        pagination={showPagination ? {
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !w-3 !h-3 !bg-white/70 !opacity-70',
          bulletActiveClass: 'swiper-pagination-bullet-active !bg-white !opacity-100 !scale-125',
        } : false}
        navigation={showNavigation && images.length > 1 ? {
          nextEl: '.hero-swiper-button-next',
          prevEl: '.hero-swiper-button-prev',
        } : false}
        className={`${height} rounded-3xl overflow-hidden shadow-2xl`}
      >
        {images.map((image, index) => (
          <SwiperSlide key={image.id}>
            <div className="relative w-full h-full">
              <img
                src={image.url}
                alt={image.name}
                className="w-full h-full object-cover"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
              
              {/* Enhanced Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Content Overlay */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white"
              >
                <div className="max-w-2xl">
                  <motion.h3 
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    {image.name}
                  </motion.h3>
                  
                  <motion.p 
                    className="text-sm sm:text-base lg:text-lg opacity-90 line-clamp-2 leading-relaxed mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                  >
                    {image.description}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                    className="flex items-center space-x-4 text-xs sm:text-sm opacity-80"
                  >
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(image.createdAt)}</span>
                    </div>
                    {image.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{image.location}</span>
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </SwiperSlide>
        ))}

        {/* Enhanced Custom Navigation */}
        {showNavigation && images.length > 1 && (
          <>
            <div className="hero-swiper-button-prev absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <div className="hero-swiper-button-next absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </>
        )}
      </Swiper>

      {/* Custom pagination styles */}
      <style jsx>{`
        .swiper-pagination {
          bottom: 1.5rem !important;
        }
        .swiper-pagination-bullet {
          margin: 0 6px !important;
          transition: all 0.3s ease !important;
        }
      `}</style>
    </motion.div>
  );
};

export default HeroSlider;