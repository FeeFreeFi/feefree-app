/**
 * @type {import('lint-staged').Configuration}
 */
const config = {
  '**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx,vue}': 'oxlint',
}

export default config
