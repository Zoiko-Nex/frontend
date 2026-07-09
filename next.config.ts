import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:service/:path*',
        destination: 'https://:service.api.zoikonex.com/:path*',
      },
    ];
  },
};

export default nextConfig;
