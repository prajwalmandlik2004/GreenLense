import { supabase } from './supabase';
import { uploadToCloudinary, getOptimizedImageUrl } from './cloudinary';
import { ImageDoc, CategoryType, UploadProgress } from '../types/image';

const IMAGES_TABLE = 'images';

export interface ListImagesOptions {
  category?: CategoryType;
  search?: string;
  limit?: number;
}

export const addImage = async (imageData: Omit<ImageDoc, 'id'>): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from(IMAGES_TABLE)
      .insert([imageData])
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error adding image:', error);
    throw new Error('Failed to save image metadata');
  }
};

export const listImages = async (options: ListImagesOptions = {}): Promise<ImageDoc[]> => {
  try {
    const { category, search, limit: queryLimit = 50 } = options;

    let query = supabase
      .from(IMAGES_TABLE)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(queryLimit);

    if (category) {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error listing images:', error);
    return [];
  }
};

export const uploadImage = async (
  file: File,
  metadata: Omit<ImageDoc, 'id' | 'url' | 'cloudinary_public_id' | 'created_at'>,
  onProgress?: (progress: UploadProgress) => void
): Promise<ImageDoc> => {
  try {
    // Upload to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(
      file,
      `greenlens/${metadata.category}`,
      (progress) => {
        if (onProgress) {
          onProgress({
            filename: file.name,
            progress: progress.percentage,
            status: 'uploading'
          });
        }
      }
    );

    // Create optimized URL
    const optimizedUrl = getOptimizedImageUrl(cloudinaryResult.public_id, {
      width: 1200,
      quality: 'auto',
      format: 'auto'
    });

    // Save metadata to Supabase
    const imageDoc: Omit<ImageDoc, 'id'> = {
      ...metadata,
      url: optimizedUrl,
      cloudinary_public_id: cloudinaryResult.public_id,
      created_at: new Date().toISOString(),
    };

    const docId = await addImage(imageDoc);

    return {
      id: docId,
      ...imageDoc,
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Failed to upload image');
  }
};

// Seed default images if database is empty
export const seedDefaults = async (): Promise<void> => {
  try {
    const { data: existingImages } = await supabase
      .from(IMAGES_TABLE)
      .select('id')
      .limit(1);

    if (existingImages && existingImages.length > 0) {
      return; // Already has data
    }

    const defaultImages: Omit<ImageDoc, 'id'>[] = [
      {
        url: 'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?auto=compress&cs=tinysrgb&w=800',
        name: 'Pink Garden Rose',
        description: 'Beautiful pink rose blooming in the morning light with dewdrops on petals',
        category: 'flowers',
        location: 'Home Garden',
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
        cloudinary_public_id: 'seed/flowers/pink-rose'
      },
      {
        url: 'https://images.pexels.com/photos/1408221/pexels-photo-1408221.jpeg?auto=compress&cs=tinysrgb&w=800',
        name: 'Sunflower Field',
        description: 'Vibrant sunflowers reaching toward the sky on a perfect summer day',
        category: 'flowers',
        location: 'North Field',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        cloudinary_public_id: 'seed/flowers/sunflower-field'
      },
      {
        url: 'https://images.pexels.com/photos/842711/pexels-photo-842711.jpeg?auto=compress&cs=tinysrgb&w=800',
        name: 'Wild Daisies',
        description: 'Cheerful white daisies scattered across the meadow like nature\'s confetti',
        category: 'flowers',
        location: 'Meadow',
        created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
        cloudinary_public_id: 'seed/flowers/wild-daisies'
      },
      {
        url: 'https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg?auto=compress&cs=tinysrgb&w=800',
        name: 'Mountain Dawn',
        description: 'Misty mountains catching the first light of dawn in golden hues',
        category: 'nature',
        location: 'Valley View',
        created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
        cloudinary_public_id: 'seed/nature/mountain-dawn'
      },
      {
        url: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800',
        name: 'Forest Path',
        description: 'Peaceful woodland trail leading through ancient trees and dappled sunlight',
        category: 'nature',
        location: 'Back Woods',
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        cloudinary_public_id: 'seed/nature/forest-path'
      },
      {
        url: 'https://images.pexels.com/photos/33109/fall-autumn-red-season.jpg?auto=compress&cs=tinysrgb&w=800',
        name: 'Autumn Trees',
        description: 'Brilliant fall foliage painting the landscape in warm reds and oranges',
        category: 'nature',
        location: 'East Grove',
        created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
        cloudinary_public_id: 'seed/nature/autumn-trees'
      },
      {
        url: 'https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg?auto=compress&cs=tinysrgb&w=800',
        name: 'Wheat Harvest',
        description: 'Golden wheat ready for harvest, swaying gently in the evening breeze',
        category: 'crops',
        location: 'Main Field',
        created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
        cloudinary_public_id: 'seed/crops/wheat-harvest'
      },
      {
        url: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=800',
        name: 'Tomato Vines',
        description: 'Ripe red tomatoes hanging heavy on healthy green vines in the greenhouse',
        category: 'crops',
        location: 'Greenhouse 2',
        created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
        cloudinary_public_id: 'seed/crops/tomato-vines'
      },
      {
        url: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=800',
        name: 'Corn Field',
        description: 'Tall corn stalks creating green corridors under the summer sun',
        category: 'crops',
        location: 'South Field',
        created_at: new Date(Date.now() - 86400000 * 9).toISOString(),
        cloudinary_public_id: 'seed/crops/corn-field'
      }
    ];

    // Add all default images to Supabase
    for (const imageData of defaultImages) {
      await addImage(imageData);
    }

    console.log('Default images seeded successfully');
  } catch (error) {
    console.error('Error seeding defaults:', error);
  }
};