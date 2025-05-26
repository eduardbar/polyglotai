import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimizaciones para Vercel
  serverExternalPackages: ['d3'],
  
  // Configuración de imágenes para Vercel
  images: {
    domains: [],
    unoptimized: false,
  },

  // Variables de entorno públicas
  env: {
    NEXT_PUBLIC_APP_NAME: 'PolyglotAI',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },

  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },

  // Redirecciones
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // Configuración de build
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
