import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        pathname: "/**",
      },
    ],
    // Allow WebP + AVIF for static images; GIF passes through unoptimized
    formats: ["image/webp", "image/avif"],
  },
};

export default nextConfig;
