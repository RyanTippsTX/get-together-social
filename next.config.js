/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['avatars.githubusercontent.com', 'placeimg.com'], // temp dev use only
  },
};

module.exports = nextConfig;
