import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const standalone = process.env.NEXT_STANDALONE === "1";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output para otimização do Docker
  ...(standalone ? { output: "standalone" } : {}),

  // Evita o Next inferir a raiz do workspace incorretamente quando há múltiplos lockfiles
  turbopack: {
    root: __dirname,
  },

  // Image optimization configuration
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 31536000, // 1 year for optimized images
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  async headers() {
    return [
      {
        source: "/Autovend IA - Logo Horizontal sem fundo.png",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/Autovend IA - Logo Horizontal cor branca sem fundo.png",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/Autovend IA - Logo Vertical sem fundo.png",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/Autovend IA - Logo Vertical cor branca sem fundo.png",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/Autovend IA - Simbolo sem fundo.png",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  experimental: {
    turbopackUseSystemTlsCerts: true,
  },

  // Performance optimizations
  compress: true, // Enable gzip/brotli compression
  poweredByHeader: false, // Remove X-Powered-By header
  reactStrictMode: true, // Help identify re-renders and side effects
};

export default nextConfig;

