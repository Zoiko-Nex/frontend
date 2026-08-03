import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async rewrites() {
    return [
      {
        source: '/api/:service/:path*',
        destination: 'https://:service.api.zoikonex.com/:path*',
      },
      {
        source: '/superadmin',
        destination: '/Super-admin',
      },
    ];
  },
};

export default nextConfig;
