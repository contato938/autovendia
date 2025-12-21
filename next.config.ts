import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output para otimização do Docker
  output: 'standalone',
  experimental: {
    turbopackUseSystemTlsCerts: true,
  } as any,
};

export default nextConfig;
