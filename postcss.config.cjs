// https://github.com/postcss/postcss#usage

/**
 * @type {import('postcss-load-config').Config}
 */
module.exports = {
  plugins: [
    require('postcss-import'),
    require("postcss-preset-env"),
    require("autoprefixer"),
    require("tailwindcss"),
  ]
}
