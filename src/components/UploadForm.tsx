import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, Camera, X, Check, AlertCircle, Image as ImageIcon, Zap, Shield, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadImage } from '../lib/db';
import { ImageDoc, UploadProgress } from '../types/image';
import clsx from 'clsx';

const uploadSchema = z.object({
  name: z.string().min(1, 'Image name is required').max(100, 'Name too long'),
  description: z.string().min(1, 'Description must be at least 10 characters').max(200, 'Description too long'),
  category: z.enum(['flowers', 'nature', 'crops'], {
    required_error: 'Please select a category',
  }),
  location: z.string().optional(),
});

type UploadFormData = z.infer<typeof uploadSchema>;

interface UploadFormProps {
  onUploadComplete: (image: ImageDoc) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onUploadComplete }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
  });

  const watchedData = watch();

  // Enhanced camera functionality
  // const startCamera = async () => {
  //   setCameraError(null);
  //   try {
  //     // Check if camera is available
  //     if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
  //       throw new Error('Camera not supported on this device');
  //     }

  //     const stream = await navigator.mediaDevices.getUserMedia({
  //       video: { 
  //         facingMode: 'environment', // Use back camera on mobile
  //         width: { ideal: 1920, min: 640 },
  //         height: { ideal: 1080, min: 480 }
  //       }
  //     });

  //     setCameraStream(stream);
  //     setShowCamera(true);

  //     if (videoRef.current) {
  //       videoRef.current.srcObject = stream;
  //     }
  //   } catch (error) {
  //     console.error('Error accessing camera:', error);
  //     let errorMessage = 'Unable to access camera. ';

  //     if (error instanceof Error) {
  //       if (error.name === 'NotAllowedError') {
  //         errorMessage += 'Please allow camera permissions and try again.';
  //       } else if (error.name === 'NotFoundError') {
  //         errorMessage += 'No camera found on this device.';
  //       } else if (error.name === 'NotSupportedError') {
  //         errorMessage += 'Camera not supported on this browser.';
  //       } else {
  //         errorMessage += error.message;
  //       }
  //     }

  //     setCameraError(errorMessage);
  //   }
  // };

  // Update the startCamera function
  const startCamera = async () => {
    setCameraError(null);
    try {
      // Check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported on this device');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920, min: 640 },
          height: { ideal: 1080, min: 480 }
        }
      });

      setCameraStream(stream);
      setShowCamera(true);

      // Wait for next tick to ensure video element is rendered
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(err => {
            console.error('Error playing video:', err);
            setCameraError('Failed to start camera preview');
          });
        }
      }, 100);
    } catch (error) {
      console.error('Error accessing camera:', error);
      let errorMessage = 'Unable to access camera. ';

      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage += 'Please allow camera permissions and try again.';
        } else if (error.name === 'NotFoundError') {
          errorMessage += 'No camera found on this device.';
        } else if (error.name === 'NotSupportedError') {
          errorMessage += 'Camera not supported on this browser.';
        } else {
          errorMessage += error.message;
        }
      }

      setCameraError(errorMessage);
    }
  };


  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
    setCameraError(null);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob with high quality
    canvas.toBlob((blob) => {
      if (blob) {
        const timestamp = Date.now();
        const file = new File([blob], `camera-capture-${timestamp}.jpg`, {
          type: 'image/jpeg',
          lastModified: timestamp,
        });
        setSelectedFiles(prev => [...prev, file]);
        stopCamera();
      }
    }, 'image/jpeg', 0.95); // High quality
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'].includes(file.type);
      const isValidSize = file.size <= 15 * 1024 * 1024; // 15MB for Cloudinary
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      alert('Some files were skipped. Please use JPEG, PNG, WebP, or HEIC images under 15MB.');
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: UploadFormData) => {
    if (selectedFiles.length === 0) {
      alert('Please select at least one image to upload');
      return;
    }

    setIsUploading(true);
    const progressList: UploadProgress[] = selectedFiles.map(file => ({
      filename: file.name,
      progress: 0,
      status: 'uploading' as const,
    }));
    setUploadProgress(progressList);

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];

        try {
          const imageDoc = await uploadImage(
            file,
            {
              name: selectedFiles.length > 1 ? `${data.name} ${i + 1}` : data.name,
              description: data.description,
              category: data.category,
              location: data.location,
            },
            (progress) => {
              setUploadProgress(prev => prev.map((item, index) =>
                index === i ? { ...item, progress: progress.progress } : item
              ));
            }
          );

          setUploadProgress(prev => prev.map((item, index) =>
            index === i ? { ...item, status: 'success' as const, progress: 100 } : item
          ));

          onUploadComplete(imageDoc);
        } catch (error) {
          setUploadProgress(prev => prev.map((item, index) =>
            index === i ? {
              ...item,
              status: 'error' as const,
              error: error instanceof Error ? error.message : 'Upload failed'
            } : item
          ));
        }
      }

      const hasErrors = uploadProgress.some(item => item.status === 'error');
      if (!hasErrors) {
        reset();
        setSelectedFiles([]);
        setUploadProgress([]);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const isFormValid = watchedData.name && watchedData.description && watchedData.category;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10 border border-gray-100"
      >
        <div className="text-center mb-8">
          <motion.div
            className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <Upload className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Share Your View</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload beautiful images from your farm and fields to share with our community
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Image Name */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Image Name *
            </label>
            <input
              type="text"
              {...register('name')}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 text-lg"
              placeholder="Give your image a descriptive name"
            />
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-red-600 flex items-center"
              >
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.name.message}
              </motion.p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Description *
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 resize-none text-lg"
              placeholder="Describe what makes this image special (10-200 characters)"
            />
            <div className="flex justify-between items-center">
              {errors.description ? (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm text-red-600 flex items-center"
                >
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.description.message}
                </motion.p>
              ) : (
                <span className="text-sm text-gray-500">
                  Tell us what makes this moment special
                </span>
              )}
              <span className={`text-sm font-medium ${(watchedData.description?.length || 0) > 180 ? 'text-red-500' : 'text-gray-500'
                }`}>
                {watchedData.description?.length || 0}/200
              </span>
            </div>
          </div>

          {/* Category and Location Row */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Category *
              </label>
              <select
                {...register('category')}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 text-lg bg-white"
              >
                <option value="">Select a category</option>
                <option value="flowers">🌸 Flowers</option>
                <option value="nature">🌲 Nature</option>
                <option value="crops">🌾 Crops</option>
              </select>
              {errors.category && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm text-red-600 flex items-center"
                >
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.category.message}
                </motion.p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Location (Optional)
              </label>
              <input
                type="text"
                {...register('location')}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 text-lg"
                placeholder="e.g., North Field, Greenhouse"
              />
            </div>
          </div>

          {/* File Upload Section */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700">
              Images *
            </label>

            {/* Upload Options */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* File Upload */}
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  disabled={!isFormValid || isUploading}
                />
                <label
                  htmlFor="file-upload"
                  className={clsx(
                    'flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl transition-all duration-200 cursor-pointer group',
                    (!isFormValid || isUploading)
                      ? 'border-gray-300 bg-gray-50 cursor-not-allowed opacity-50'
                      : 'border-green-300 bg-green-50/50 hover:border-green-500 hover:bg-green-50'
                  )}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ImageIcon className={clsx(
                      'w-10 h-10 mb-3 transition-colors',
                      (!isFormValid || isUploading) ? 'text-gray-400' : 'text-green-600 group-hover:text-green-700'
                    )} />
                  </motion.div>
                  <span className="font-bold text-lg text-gray-700 mb-2">
                    Choose Files
                  </span>
                  <span className="text-sm text-gray-500 text-center px-4 leading-relaxed">
                    JPEG, PNG, WebP, HEIC up to 15MB
                  </span>
                  <span className="text-xs text-green-600 mt-1 font-medium">
                    Multiple files supported
                  </span>
                </label>
              </div>

              {/* Camera Capture */}
              <button
                type="button"
                onClick={startCamera}
                disabled={!isFormValid || isUploading}
                className={clsx(
                  'flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl transition-all duration-200 group',
                  (!isFormValid || isUploading)
                    ? 'border-gray-300 bg-gray-50 cursor-not-allowed opacity-50'
                    : 'border-blue-300 bg-blue-50/50 hover:border-blue-500 hover:bg-blue-50 cursor-pointer'
                )}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Camera className={clsx(
                    'w-10 h-10 mb-3 transition-colors',
                    (!isFormValid || isUploading) ? 'text-gray-400' : 'text-blue-600 group-hover:text-blue-700'
                  )} />
                </motion.div>
                <span className="font-bold text-lg text-gray-700 mb-2">
                  Take Photo
                </span>
                <span className="text-sm text-gray-500 text-center px-4 leading-relaxed">
                  Use your camera directly
                </span>
                <span className="text-xs text-blue-600 mt-1 font-medium flex items-center">
                  <Smartphone className="w-3 h-3 mr-1" />
                  Mobile optimized
                </span>
              </button>
            </div>

            {!isFormValid && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-amber-600 flex items-center justify-center bg-amber-50 p-4 rounded-xl border border-amber-200"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Please fill in the name, description, and category before selecting images
              </motion.p>
            )}

            {cameraError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4"
              >
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {cameraError}
                </p>
                <p className="text-xs text-red-500 mt-2">
                  Try using the file upload option instead, or check your browser permissions.
                </p>
              </motion.div>
            )}
          </div>

          {/* Enhanced Camera Modal */}
          <AnimatePresence>
            {showCamera && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-2 sm:p-4"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-6 w-full h-full sm:max-w-4xl sm:max-h-[95vh] sm:w-auto sm:h-auto overflow-hidden"
                >
                  <div className="flex justify-between items-center mb-3 sm:mb-6">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Camera className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800">Camera Capture</h3>
                        <p className="text-xs sm:text-sm text-gray-500">Position your subject and tap capture</p>
                      </div>
                    </div>
                    <button
                      onClick={stopCamera}
                      className="p-2 text-gray-500 hover:text-red-600 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <div className="relative bg-black rounded-xl sm:rounded-2xl overflow-hidden shadow-inner h-[calc(100vh-200px)] sm:h-[60vh] min-h-[400px]">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                        onLoadedMetadata={() => {
                          if (videoRef.current) {
                            videoRef.current.play().catch(console.error);
                          }
                        }}
                        onError={(e) => {
                          console.error('Video error:', e);
                          setCameraError('Camera preview failed to load');
                        }}
                      />

                      {/* Camera overlay guides */}
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-white/50 rounded-tl-lg" />
                        <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-white/50 rounded-tr-lg" />
                        <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-white/50 rounded-bl-lg" />
                        <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-white/50 rounded-br-lg" />
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <motion.button
                        type="button"
                        onClick={capturePhoto}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-full flex items-center justify-center text-white shadow-xl hover:shadow-2xl transition-all duration-200"
                      >
                        <Camera className="w-8 h-8 sm:w-10 sm:h-10" />
                      </motion.button>
                    </div>

                    <div className="text-center text-xs sm:text-sm text-gray-500 space-y-1">
                      <p>📱 Tip: Hold your phone steady and ensure good lighting</p>
                      <p>🔄 The back camera will be used automatically on mobile</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hidden canvas for photo capture */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Enhanced File Previews */}
          <AnimatePresence>
            {selectedFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-700 text-lg">
                    Selected Images ({selectedFiles.length})
                  </h4>
                  {!isUploading && (
                    <button
                      type="button"
                      onClick={() => setSelectedFiles([])}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {selectedFiles.map((file, index) => (
                    <motion.div
                      key={file.name + index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="relative group"
                    >
                      <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-md border-2 border-gray-200">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      {!isUploading && (
                        <motion.button
                          type="button"
                          onClick={() => removeFile(index)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      )}
                      <div className="mt-2 text-xs text-gray-500 truncate text-center px-1">
                        {file.name}
                      </div>
                      <div className="text-xs text-gray-400 text-center">
                        {(file.size / 1024 / 1024).toFixed(1)} MB
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upload Progress */}
          <AnimatePresence>
            {uploadProgress.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <h4 className="font-semibold text-gray-700 text-lg">Upload Progress</h4>
                <div className="space-y-3">
                  {uploadProgress.map((progress, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-gray-50 rounded-2xl p-4 border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700 truncate mr-2">
                          {progress.filename}
                        </span>
                        <div className="flex items-center space-x-2">
                          {progress.status === 'success' && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                            >
                              <Check className="w-4 h-4 text-white" />
                            </motion.div>
                          )}
                          {progress.status === 'error' && (
                            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                              <AlertCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                          <span className="text-sm font-semibold text-gray-600">
                            {Math.round(progress.progress)}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <motion.div
                          className={clsx(
                            'h-3 rounded-full transition-colors',
                            progress.status === 'success' ? 'bg-green-500' :
                              progress.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                          )}
                          initial={{ width: 0 }}
                          animate={{ width: `${progress.progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      {progress.error && (
                        <p className="text-sm text-red-600 mt-2 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {progress.error}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <motion.button
              type="submit"
              disabled={selectedFiles.length === 0 || !isFormValid || isUploading}
              whileHover={{ scale: isUploading ? 1 : 1.05 }}
              whileTap={{ scale: isUploading ? 1 : 0.95 }}
              className={clsx(
                'px-12 py-5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl min-w-[200px]',
                'focus:outline-none focus:ring-4 focus:ring-green-500/20',
                (selectedFiles.length === 0 || !isFormValid || isUploading)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 hover:shadow-2xl'
              )}
            >
              {isUploading ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                  Uploading {selectedFiles.length} Image{selectedFiles.length !== 1 ? 's' : ''}...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Upload className="w-6 h-6 mr-3" />
                  Upload {selectedFiles.length > 0 ? `${selectedFiles.length} ` : ''}Image{selectedFiles.length !== 1 ? 's' : ''}
                </div>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Enhanced Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-gradient-to-br from-blue-50 to-green-50 rounded-3xl p-6 sm:p-8 border border-blue-100"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Photography Tips</h3>
          <p className="text-gray-600">Capture stunning farm photos with these professional tips</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-white/50">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-lg">🌅</span>
            </div>
            <div className="font-semibold text-gray-700 mb-1">Golden Hour</div>
            <div className="text-gray-600">Best lighting 1 hour after sunrise or before sunset</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-white/50">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-lg">🔍</span>
            </div>
            <div className="font-semibold text-gray-700 mb-1">Get Close</div>
            <div className="text-gray-600">Fill the frame with your subject for maximum impact</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-white/50">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-lg">📖</span>
            </div>
            <div className="font-semibold text-gray-700 mb-1">Tell a Story</div>
            <div className="text-gray-600">Capture the moment and emotion behind the scene</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-white/50">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-lg">📱</span>
            </div>
            <div className="font-semibold text-gray-700 mb-1">Mobile Ready</div>
            <div className="text-gray-600">Use camera button for instant capture on mobile</div>
          </div>
        </div>
      </motion.div>

      {/* Cloudinary Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-gradient-to-br from-green-600 to-blue-600 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border border-white rounded-full" />
          <div className="absolute bottom-10 right-10 w-16 h-16 border border-white rounded-full" />
        </div>

        <div className="relative z-10 text-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Powered by Cloudinary</h3>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            Your images are automatically optimized, compressed, and delivered at lightning speed
          </p>

          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <Shield className="w-6 h-6 mx-auto mb-2" />
              <div className="font-semibold mb-1">Secure Storage</div>
              <div className="opacity-80">Enterprise-grade security</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <Zap className="w-6 h-6 mx-auto mb-2" />
              <div className="font-semibold mb-1">Auto Optimization</div>
              <div className="opacity-80">Smart compression & formats</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <ImageIcon className="w-6 h-6 mx-auto mb-2" />
              <div className="font-semibold mb-1">15MB Limit</div>
              <div className="opacity-80">High-quality uploads supported</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UploadForm;