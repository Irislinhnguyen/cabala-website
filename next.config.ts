import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/moodle/image/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/api/moodle/image/**',
      },
      {
        protocol: 'https',
        hostname: 'learn.cabala.com.vn',
        pathname: '/webservice/pluginfile.php/**',
      },
    ],
    unoptimized: true, // Disable optimization for proxy images to avoid issues
  },
};

export default nextConfig;
