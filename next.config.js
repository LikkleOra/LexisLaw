/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // Proxy API calls to Convex
      {
        source: '/api/query',
        destination: 'https://striped-meadowlark-10.convex.cloud/api/query',
      },
      {
        source: '/api/mutation',
        destination: 'https://striped-meadowlark-10.convex.cloud/api/mutation',
      },
    ];
  },
};

module.exports = nextConfig;
