import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [process.env.V_CAR_IMAGES || ''],
    unoptimized: false,
  },
};

export default nextConfig;
