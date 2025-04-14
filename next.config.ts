/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/StudyGeniusAI', // Replace with your repository name
  images: {
    unoptimized: true,
  },
  distDir: 'out',
}

module.exports = nextConfig;
