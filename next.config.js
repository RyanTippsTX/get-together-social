/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ['avatars.githubusercontent.com', 'placeimg.com', 'titcmdqlpvlqjhcculma.supabase.co'],
  },
};

module.exports = nextConfig;
