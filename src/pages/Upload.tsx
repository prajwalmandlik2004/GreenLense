import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { ImageDoc } from '../types/image';
import Section from '../components/Section';
import UploadForm from '../components/UploadForm';

const Upload: React.FC = () => {
  const navigate = useNavigate();
  const [uploadedImages, setUploadedImages] = useState<ImageDoc[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleUploadComplete = (image: ImageDoc) => {
    setUploadedImages(prev => [image, ...prev]);
    setShowSuccess(true);
    
    // Auto-hide success message and navigate
    setTimeout(() => {
      setShowSuccess(false);
      setTimeout(() => {
        navigate(`/${image.category}`);
      }, 500);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30 pt-16 lg:pt-20">
      <Section
        title="Share Your Agricultural Story"
        lead="Upload your beautiful images of flowers, nature, and farm life to inspire our community of farmers and nature lovers"
        className="pt-8 lg:pt-16 pb-16 lg:pb-24"
      >
        <div className="max-w-4xl mx-auto">
          <UploadForm onUploadComplete={handleUploadComplete} />
          
          {/* Success Message */}
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3"
            >
              <CheckCircle className="w-6 h-6" />
              <span className="font-semibold">Image uploaded successfully!</span>
            </motion.div>
          )}
          
          {/* Recent Uploads */}
          {uploadedImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-12 bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Successfully Uploaded! 🎉
                </h3>
                <p className="text-gray-600">
                  Your images have been added to the gallery and are now live
                </p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {uploadedImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="relative group aspect-square rounded-2xl overflow-hidden shadow-lg"
                  >
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h4 className="font-semibold text-sm line-clamp-1">{image.name}</h4>
                      <p className="text-xs opacity-90 line-clamp-1">{image.category}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => navigate(`/${uploadedImages[0]?.category || 'flowers'}`)}
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  View in Gallery
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </Section>
    </div>
  );
};

export default Upload;