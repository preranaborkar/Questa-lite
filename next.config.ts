/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@prisma/client', 'bcryptjs']
  , eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig