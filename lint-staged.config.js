/**
 * @type {import('lint-staged').Configuration}
 */
export default {
  '*.{ts,js}': 'eslint --fix',
}
