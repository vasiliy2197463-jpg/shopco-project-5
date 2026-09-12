/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: process.cwd(),
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [],
    unoptimized: true,
  },
  devIndicators: false,
};

export default nextConfig;
