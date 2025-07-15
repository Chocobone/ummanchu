// .eslintrc.config.mjs 또는 eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// 여기서 next, next/core-web-vitals 를 넣기
const eslintConfig = [
  ...compat.extends("next", "next/core-web-vitals"),
  // 추가로 사용할 플러그인·룰도 이 배열에 넣기
];

export default eslintConfig;
