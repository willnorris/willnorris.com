/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [
    require("postcss-import"),
    require("tailwindcss/nesting"),
    require("tailwindcss"),
    require("autoprefixer"),
  ],
};

if (process.env.HUGO_ENVIRONMENT === "production") {
  config.plugins.push(require("cssnano"));
}

module.exports = config;
