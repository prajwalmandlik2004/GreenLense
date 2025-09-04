import React, { useEffect } from 'react';
import { X, Calendar, MapPin, Share, Download, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageDoc } from '../types/image';
import clsx from 'clsx';
import { Trash2 } from 'lucide-react';
import { Edit, Save, X as XIcon } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface ImageLightboxProps {
  image: ImageDoc | null;
  onClose: () => void;
  onDelete?: (imageId: string) => void;
  onEdit?: (imageId: string, updates: Partial<ImageDoc>) => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({ image, onClose, onDelete, onEdit }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (image) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [image, onClose]);

  const formatDate = (timestamp: string | number | Date) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDelete = async () => {
    if (!image || !onDelete) return;

    const confirmed = window.confirm('Are you sure you want to delete this photo? This action cannot be undone.');
    if (!confirmed) return;

    try {
      onClose();
      await onDelete(image.id);
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete the image. Please try again.');
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    description: '',
    location: '',
    category: 'flowers' as ImageDoc['category']
  });

  useEffect(() => {
    if (image) {
      setEditData({
        name: image.name,
        description: image.description,
        location: image.location || '',
        category: image.category
      });
    }
  }, [image]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing && image) {
      setEditData({
        name: image.name,
        description: image.description,
        location: image.location || '',
        category: image.category
      });
    }
  };

  const handleSaveEdit = async () => {
    if (!image || !onEdit) return;

    try {
      await onEdit(image.id, editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating image:', error);
      alert('Failed to update image. Please try again.');
    }
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

  const handleShare = async () => {
    if (!image) return;

    const shareData = {
      title: `${image.name} - GreenLens Gallery`,
      text: image.description,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDownload = () => {
    if (!image) return;

    const link = document.createElement('a');
    link.href = image.url;
    link.download = `${image.name}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      {image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.4, type: "spring", damping: 25 }}
            className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50/50">
              <div className="flex items-center space-x-4">
                <span className={clsx(
                  'inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full border',
                  getCategoryInfo(image.category).color
                )}>
                  <span className="mr-1">{getCategoryInfo(image.category).emoji}</span>
                  {image.category}
                </span>
                {/* <h3 className="font-bold text-gray-800 text-lg">{image.name}</h3> */}
              </div>

              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare}
                  className="p-3 text-gray-500 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200"
                  title="Share"
                >
                  <Share className="w-5 h-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDownload}
                  className="p-3 text-gray-500 hover:text-green-600 rounded-xl hover:bg-green-50 transition-all duration-200"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleEditToggle}
                  className="p-3 text-gray-500 hover:text-purple-600 rounded-xl hover:bg-purple-50 transition-all duration-200"
                  title="Edit"
                >
                  <Edit className="w-5 h-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDelete}
                  className="p-3 text-gray-500 hover:text-red-600 rounded-xl hover:bg-red-50 transition-all duration-200"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-3 text-gray-500 hover:text-red-600 rounded-xl hover:bg-red-50 transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)]">
              {/* Image */}
              <div className="lg:flex-1 relative">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-64 sm:h-80 lg:h-full object-cover"
                />

                {/* Like Button Overlay */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200"
                >
                  <Heart className="w-6 h-6 text-gray-600 hover:text-red-500 transition-colors" />
                </motion.button>
              </div>

              {/* Details Panel */}
              <div className="lg:w-96 p-6 lg:p-8 space-y-6 overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                          <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                          <textarea
                            value={editData.description}
                            onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                          <select
                            value={editData.category}
                            onChange={(e) => setEditData(prev => ({ ...prev, category: e.target.value as ImageDoc['category'] }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          >
                            <option value="flowers">🌸 Flowers</option>
                            <option value="nature">🌲 Nature</option>
                            <option value="crops">🌾 Crops</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                          <input
                            type="text"
                            value={editData.location}
                            onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="Enter location"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <h4 className="font-bold text-gray-800 text-lg">Name</h4>
                        <p className="text-gray-600 leading-relaxed text-base">
                          {image.name}
                        </p>
                        <h4 className="font-bold text-gray-800 mt-4 text-lg">Description</h4>
                        <p className="text-gray-600 leading-relaxed text-base">
                          {image.description}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center text-gray-600">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mr-3">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">Date Captured</div>
                        <div className="text-sm">{formatDate(image.created_at)}</div>
                      </div>
                    </div>

                    {(image.location || isEditing) && !isEditing && (
                      <div className="flex items-center text-gray-600">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mr-3">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">Location</div>
                          <div className="text-sm">{image.location}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}

                {isEditing && (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-200"
                    >
                      <Save className="w-5 h-5 mr-2" />
                      Save
                    </button>
                    <button
                      onClick={handleEditToggle}
                      className="flex-1 flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
                    >
                      <XIcon className="w-5 h-5 mr-2" />
                      Cancel
                    </button>
                  </div>
                )}

                <div className="space-y-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleShare}
                    className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Share className="w-5 h-5 mr-2" />
                    Share This Photo
                  </button>

                  <button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center px-6 py-3 border-2 border-green-600 text-green-600 font-semibold rounded-xl hover:bg-green-50 transition-all duration-200"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Image
                  </button>

                  {/* <button
                    onClick={handleDelete}
                    className="w-full flex items-center justify-center px-6 py-3 border-2 border-red-600 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-all duration-200"
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Delete Photo
                  </button> */}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageLightbox;