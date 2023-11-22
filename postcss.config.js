/** @type {import('postcss-load-config').Config} */
const config = {
  syntax: "postcss-scss",
  plugins: [
    require("postcss-import"),
    require("autoprefixer"),
    require("postcss-nested"),
    require("cssnano"),
  ],
};

module.exports = config;
