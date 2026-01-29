import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "rickandmortyapi.com" },
      { hostname: "raw.githubusercontent.com" },
      { hostname: "www.superherodb.com" },
      { hostname: "vignette.wikia.nocookie.net" },
      { hostname: "starwars-visualguide.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
