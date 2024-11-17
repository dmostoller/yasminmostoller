// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
    // Optional: Add image optimization settings
    minimumCacheTTL: 60,
    formats: ['image/webp'],
  },
  // Optional: Add Swiper optimization
  transpilePackages: ['swiper'],
};

module.exports = nextConfig;
