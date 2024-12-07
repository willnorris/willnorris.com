/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "postcss-import": {},
    "tailwindcss/nesting": {},
    tailwindcss: {},
    autoprefixer: {},
  },
};

if (process.env.HUGO_ENVIRONMENT === "production") {
  config.plugins["cssnano"] = {};
}

export default config;
