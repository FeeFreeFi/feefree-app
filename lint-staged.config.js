const format = ['eslint --fix']

/**
 * @type {import('lint-staged').Config}
 */
export default {
  'src/**/*.{ts,js,vue}': format,
  'config/**/*.js': format,
  '*.config.js': format,
}
