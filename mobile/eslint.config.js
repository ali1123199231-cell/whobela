// The React Native app lints with Expo's config, not the web app's. The root
// config ignores this directory: Next's rules misfire here, since RN's <Image>
// has no alt text and require() is how static assets resolve.
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  { ignores: ["dist/*", "android/*", "ios/*", ".expo/*"] },
]);
