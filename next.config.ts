import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "res.cloudinary.com",
      "images.unsplash.com",
      "play-lh.googleusercontent.com",
    ],
  },
  experimental: {
    // nodeMiddleware: true,
    staleTimes: {
      dynamic: 30,
    },
  },
};

export default nextConfig;
