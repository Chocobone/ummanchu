/** @type {import('next').NextConfig} */
const nextConfig = {};

export default {
  webpack(config) {
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  },
};