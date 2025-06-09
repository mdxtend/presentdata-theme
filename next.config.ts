import type { NextConfig } from "next";
import { withContentlayer } from 'next-contentlayer';

const nextConfig: NextConfig = {
  basePath: "",
  distDir: '.build',
  output: 'export',
  trailingSlash: true,
  devIndicators: false,
  reactStrictMode: true,
  images: { unoptimized: true },
};

export default withContentlayer(nextConfig);