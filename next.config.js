/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sf-maas-uat-prod.oss-cn-shanghai.aliyuncs.com',
        port: '',
        pathname: '/outputs/**',
      },
    ],
  }
}

module.exports = nextConfig