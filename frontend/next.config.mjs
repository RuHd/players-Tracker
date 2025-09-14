// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'steamcharts.com',
        pathname: '/**', // permite todas as imagens
      },

      {
        protocol: 'https',
        hostname: 'steamcdn-a.akamaihd.net',
        port: '',
        pathname: '/steam/apps/**',
      },
      {
        protocol: 'https',
        hostname: 'https://store.steampowered.com',
        port: '',
        pathname: '/api/**',
      },
      {
        protocol: 'https',
        hostname: 'playerstracker-backend.onrender.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
