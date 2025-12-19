import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output para otimização do Docker
  output: 'standalone',
};

export default nextConfig;
