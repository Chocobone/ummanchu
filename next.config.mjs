// next.config.mjs
import path from 'node:path'; // ← 꼭 import
// __dirname 대신 process.cwd() 사용 (ESM에서 안전)
const projectRoot = process.cwd();

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // tsconfig의 "@/..."를 webpack에도 동일하게 매핑
    config.resolve.alias['@'] = path.resolve(projectRoot, 'src');
    return config;
  },
};

export default nextConfig;