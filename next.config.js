/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['via.placeholder.com', 'images.unsplash.com', 'picsum.photos'],
    formats: ['image/webp', 'image/avif'],
  },
  // Configure CORS for API routes
  async headers() {
    return [
      {
        // Apply these headers to all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
  // Environment variables that should be exposed to the client
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    NEXT_PUBLIC_BOT_USERNAME: process.env.NEXT_PUBLIC_BOT_USERNAME,
    NEXT_PUBLIC_CHANNEL_ID: process.env.CHANNEL_CHAT_ID,
    NEXT_PUBLIC_CHANNEL_INVITE_LINK: process.env.CHANNEL_INVITE_LINK,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
  },
  // Configure for Vercel deployment
  trailingSlash: false,
  poweredByHeader: false,
};

module.exports = nextConfig;