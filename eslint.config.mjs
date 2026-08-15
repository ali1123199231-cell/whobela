import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // The React Native app, which has its own config. Next's rules actively
    // misfire here: RN's <Image> takes no alt text, and require() is how it
    // resolves static assets.
    "mobile/**",
    "android/**",
  ]),
]);

export default eslintConfig;
