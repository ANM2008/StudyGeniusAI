/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports
  basePath: '/StudyGeniusAI',  // Your repository name
  images: {
    unoptimized: true,
  },
  distDir: 'out_tmp',
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig;
