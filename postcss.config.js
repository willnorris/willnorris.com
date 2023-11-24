/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [
    require("postcss-import"),
    require("autoprefixer"),
    require("postcss-nested"),
  ],
};

if (process.env.HUGO_ENVIRONMENT === "production") {
  config.plugins.push(require("cssnano"));
}

module.exports = config;
