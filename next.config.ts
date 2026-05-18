import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/fitness/:path*',
        destination: 'https://wedev-api.sky.pro/api/fitness/:path*',        
      },
    ];
  },
};

export default nextConfig;
