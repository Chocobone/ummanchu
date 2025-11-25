// next.config.mjs
import path from "node:path";
const projectRoot = process.cwd();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["webrefactor.s3.ap-northeast-2.amazonaws.com"],
    remotePatterns: [
      { protocol: "https", hostname: "ssil.khu.ac.kr" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
    ],
  },

  // 🔥 핵심: FFmpeg WASM Worker 오류 해결
  webpack(config) {
    config.resolve.alias["@"] = path.resolve(projectRoot, "src");

    // ffmpeg worker path override
    config.resolve.alias["worker"] = false; // dynamic worker import 방지
    config.resolve.fallback = {
      ...config.resolve.fallback,
      worker_threads: false,
      fs: false,
      path: false,
      os: false,
    };

    return config;
  },

  // Turbopack Web Worker 에러 방지 (Next.js 15 필수)
  experimental: {
    workerThreads: false,
    serverComponentsExternalPackages: ["@ffmpeg/ffmpeg"],
  },
};

export default nextConfig;
