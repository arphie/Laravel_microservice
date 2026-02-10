import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 1. Setup Proxies to talk to Laravel Services
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: 'http://auth_service:8000/api/:path*',
      },
      {
        source: '/api/gateway/:path*',
        destination: 'http://gateway_service:8000/api/:path*',
      },
      {
        source: '/api/ip/:path*',
        destination: 'http://ip_management_service:8000/api/:path*',
      },
    ];
  }
};

export default nextConfig;