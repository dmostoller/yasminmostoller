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
  transpilePackages: ['swiper'],
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Connection', value: 'keep-alive' },
          { key: 'Keep-Alive', value: 'timeout=60' },
        ],
      },
    ];
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
  },
};

module.exports = nextConfig;
