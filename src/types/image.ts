export interface ImageDoc {
  id: string;
  url: string;
  name: string;
  description: string;
  category: 'flowers' | 'nature' | 'crops';
  location?: string;
  created_at: string;
  cloudinary_public_id: string;
}

export type CategoryType = ImageDoc['category'];

export interface UploadProgress {
  filename: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

export interface CloudinaryUploadOptions {
  folder?: string;
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  width?: number;
  height?: number;
}