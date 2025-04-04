import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Auth
      {
        source: '/:path*',
        destination: 'http://127.0.0.1:9099/:path*',
      },
      // Data Connect
      {
        source: '/v1beta/projects/:path*',
        destination: 'http://127.0.0.1:9399/v1beta/projects/:path*'
      }
    ];
  },
};

export default nextConfig;
