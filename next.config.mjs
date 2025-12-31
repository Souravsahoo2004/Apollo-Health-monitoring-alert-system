/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kindhearted-basilisk-313.convex.cloud',
        port: '',
        pathname: '/api/storage/**',
      },
    ],
  },
};

export default nextConfig;
