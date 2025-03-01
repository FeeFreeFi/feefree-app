/**
 * @type {import('lint-staged').Configuration}
 */
const config = {
  '*.{ts,js}': 'eslint --fix',
}

export default config
