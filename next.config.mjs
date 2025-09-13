// next.config.mjs
import path from 'node:path'; // ← 꼭 import
// __dirname 대신 process.cwd() 사용 (ESM에서 안전)
const projectRoot = process.cwd();

/** @type {import('next').NextConfig} */
const nextConfig = {
   images: {
    // 둘 중 편한 방식으로 하나만 쓰면 됨
    // 1) domains
    domains: ['webrefactor.s3.ap-northeast-2.amazonaws.com'],

    // 2) remotePatterns (더 정교)
    // remotePatterns: [
    //   { protocol: 'https', hostname: 'webrefactor.s3.ap-northeast-2.amazonaws.com' },
    // ],
  },
  webpack(config) {
    // tsconfig의 "@/..."를 webpack에도 동일하게 매핑
    config.resolve.alias['@'] = path.resolve(projectRoot, 'src');
    return config;
  },
};

export default nextConfig;