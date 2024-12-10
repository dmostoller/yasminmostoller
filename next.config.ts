// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
    minimumCacheTTL: 60,
    formats: ['image/webp'],
  },
  // Optional: Add Swiper optimization
  transpilePackages: ['swiper'],
};

module.exports = nextConfig;
