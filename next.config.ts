import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'web.archive.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'powersoulfitness.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'demo.bosathemes.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
