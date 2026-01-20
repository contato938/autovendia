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
};

export default nextConfig;

