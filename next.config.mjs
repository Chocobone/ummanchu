import path from "node:path";
const projectRoot = process.cwd();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ssil.khu.ac.kr" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" }
    ]
  },

  webpack(config) {
    config.resolve.alias["@"] = path.resolve(projectRoot, "src");

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
      worker_threads: false
    };

    return config;
  },

  experimental: {
    
  }
};

export default nextConfig;
