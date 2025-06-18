import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Skip ESLint checks on `next build` to prevent build failures due to non-critical lint errors (e.g. in generated files)
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
