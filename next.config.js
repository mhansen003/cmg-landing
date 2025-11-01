/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cmgfi.com',
      },
      {
        protocol: 'https',
        hostname: 'intake.cmgfinancial.ai',
      },
      {
        protocol: 'https',
        hostname: 'trainbuilder.cmgfinancial.ai',
      },
    ],
  },
}

module.exports = nextConfig
