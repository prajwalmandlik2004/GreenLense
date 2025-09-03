# GreenLens - Farmer's Gallery

A beautiful, mobile-first React website showcasing curated collections of flowers, nature, and farm life photography with modern UI and camera integration.

## 🌟 Features

- 📱 **Mobile-first design** with responsive layouts and touch-optimized interface
- 🖼️ **Three gallery categories**: Flowers, Nature, and Crops with advanced filtering
- 📸 **Camera integration** - Take photos directly from your mobile browser
- ☁️ **Cloudinary integration** for optimized image storage and delivery
- 🎠 **Beautiful sliders** with Swiper carousels and smooth animations
- 🔍 **Advanced search and filtering** with real-time results
- 🎨 **Modern UI** with gradients, glass morphism, and micro-interactions
- ⚡ **Fast performance** with optimized loading and lazy loading
- 🔒 **Form validation** with React Hook Form and Zod
- 📊 **Supabase backend** for metadata storage

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod validation
- **Animation**: Framer Motion
- **Carousels**: Swiper
- **Image Storage**: Cloudinary
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- Cloudinary account (free tier available)
- Supabase project

### 1. Clone and Install

```bash
git clone <your-repo>
cd greenlens-gallery
npm install
```

### 2. Set up Cloudinary

1. **Create a Cloudinary account**:
   - Go to [cloudinary.com](https://cloudinary.com) and sign up for free
   - You get 25GB storage and 25GB bandwidth per month on the free plan

2. **Get your credentials**:
   - Go to your [Cloudinary Dashboard](https://cloudinary.com/console)
   - Copy your **Cloud Name**, **API Key**, and **API Secret**

3. **Create an Upload Preset**:
   - Go to Settings → Upload → Upload presets
   - Click "Add upload preset"
   - Set **Signing Mode** to "Unsigned" (important!)
   - Set **Folder** to "greenlens" (optional)
   - Enable **Auto-optimize quality** and **Auto-select format**
   - Save and copy the **Preset Name**

### 3. Set up Supabase

1. **Create a Supabase project**:
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Wait for the database to be ready

2. **Create the images table**:
   ```sql
   CREATE TABLE images (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     url TEXT NOT NULL,
     name TEXT NOT NULL,
     description TEXT NOT NULL,
     category TEXT NOT NULL CHECK (category IN ('flowers', 'nature', 'crops')),
     location TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     cloudinary_public_id TEXT NOT NULL
   );

   -- Create index for better performance
   CREATE INDEX idx_images_category_created_at ON images(category, created_at DESC);
   CREATE INDEX idx_images_created_at ON images(created_at DESC);
   ```

3. **Get your credentials**:
   - Go to Settings → API
   - Copy your **Project URL** and **anon public** key

### 4. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME="your-cloud-name"
VITE_CLOUDINARY_API_KEY="your-api-key"
VITE_CLOUDINARY_API_SECRET="your-api-secret"
VITE_CLOUDINARY_UPLOAD_PRESET="your-upload-preset-name"

# Supabase Configuration
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
```

### 5. Start Development Server

```bash
npm run dev
```

The app will automatically seed default images on first load if your database is empty.

## 📱 Camera Features

The app includes advanced camera functionality:

- **Direct Camera Access**: Open mobile camera directly from the website
- **High Quality Capture**: Captures at optimal resolution (up to 1920x1080)
- **Environment Camera**: Automatically uses back camera on mobile devices
- **Real-time Preview**: See exactly what you're capturing
- **Instant Upload**: Captured photos are immediately available for upload

### Camera Permissions

On first use, browsers will ask for camera permissions:
- **Chrome/Safari**: Click "Allow" when prompted
- **Firefox**: Click "Allow" and optionally "Remember this decision"
- **Mobile browsers**: May require HTTPS in production

## 🎨 Design Features

- **Modern Gradient UI**: Beautiful gradients and glass morphism effects
- **Responsive Design**: Perfect on all devices (320px to 4K+)
- **Smooth Animations**: Framer Motion powered transitions
- **Touch Optimized**: Large tap targets and gesture support
- **Accessibility**: Keyboard navigation and screen reader support
- **Dark Mode Ready**: Prepared for future dark theme implementation

## 📊 Database Schema

### Images Table (Supabase)

```typescript
interface ImageDoc {
  id: string;                    // UUID primary key
  url: string;                   // Cloudinary optimized URL
  name: string;                  // Image title
  description: string;           // 10-200 characters
  category: 'flowers' | 'nature' | 'crops';
  location?: string;             // Optional location
  created_at: string;            // ISO timestamp
  cloudinary_public_id: string;  // Cloudinary public ID for management
}
```

## 🔧 Cloudinary Configuration

### Upload Preset Settings

For optimal performance, configure your upload preset with:

```json
{
  "unsigned": true,
  "folder": "greenlens",
  "auto_tagging": 0.7,
  "quality": "auto",
  "fetch_format": "auto",
  "allowed_formats": ["jpg", "png", "webp", "heic"],
  "max_file_size": 15728640,
  "transformation": [
    {
      "quality": "auto",
      "fetch_format": "auto"
    }
  ]
}
```

### Image Transformations

The app automatically applies optimizations:
- **Auto Quality**: Reduces file size while maintaining visual quality
- **Auto Format**: Serves WebP to supported browsers, fallback to JPEG
- **Responsive Images**: Multiple sizes generated for different screen sizes
- **Smart Compression**: AI-powered compression for optimal loading

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel/Netlify

1. Connect your repository
2. Set environment variables in the deployment platform
3. Deploy - the app will work immediately!

### Environment Variables for Production

Make sure to set these in your deployment platform:
- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_API_KEY`
- `VITE_CLOUDINARY_API_SECRET`
- `VITE_CLOUDINARY_UPLOAD_PRESET`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 🔒 Security Notes

- **Upload Preset**: Use unsigned presets for client-side uploads
- **API Secret**: Keep your Cloudinary API secret secure (only use server-side)
- **Supabase RLS**: Enable Row Level Security for production use
- **HTTPS**: Camera features require HTTPS in production

## 📈 Performance Optimizations

- **Lazy Loading**: Images load as they enter viewport
- **Optimized Delivery**: Cloudinary CDN with global edge locations
- **Smart Caching**: Browser and CDN caching for faster subsequent loads
- **Progressive Enhancement**: App works without JavaScript for basic viewing
- **Mobile Optimization**: Reduced bundle size and optimized for mobile networks

## 🤝 Contributing

This is a farmer's gallery project. Feel free to fork and adapt for your agricultural photography needs!

## 📄 License

MIT License - see LICENSE file for details.

---

**Happy Farming! 🌱📸**