// lib/cloudinary.ts (frontend-only)

// Interfaces
export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  created_at: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// Upload function (browser safe)
export const uploadToCloudinary = async (
  file: File,
  folder: string = 'greenlens',
  onProgress?: (progress: UploadProgress) => void
): Promise<CloudinaryUploadResult> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration missing. Please check your environment variables.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', folder);
  formData.append('quality', 'auto');
  formData.append('fetch_format', 'auto');

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress({
          loaded: event.loaded,
          total: event.total,
          percentage: Math.round((event.loaded / event.total) * 100)
        });
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        try {
          const result = JSON.parse(xhr.responseText);
          resolve(result);
        } catch (error) {
          reject(new Error('Failed to parse upload response'));
        }
      } else {
        reject(new Error(`Upload failed with status: ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'));
    });

    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
    xhr.send(formData);
  });
};

// Optimized URL helper
export const getOptimizedImageUrl = (
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    crop?: 'fill' | 'fit' | 'scale' | 'crop';
  } = {}
): string => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill'
  } = options;

  let transformations: string[] = [];

  if (width || height) {
    const dimensions = [
      width && `w_${width}`,
      height && `h_${height}`,
      `c_${crop}`
    ].filter(Boolean).join(',');
    transformations.push(dimensions);
  }

  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);

  const transformString = transformations.join('/');

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}/${publicId}`;
};

// Stub for deletion (requires backend)
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  console.log('Delete request for:', publicId);
  // TODO: Move deletion logic to your backend
};
