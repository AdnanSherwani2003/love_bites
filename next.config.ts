import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Allow local images from the public directory — no remote domains needed
    remotePatterns: [],
  },
}

export default nextConfig
