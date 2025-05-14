import type { NextConfig } from "next";
const withNextIntl = require('next-intl/plugin')();

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["storage.example.com", "picsum.photos"],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default withNextIntl(nextConfig);
