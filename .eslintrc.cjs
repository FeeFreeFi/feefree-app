// https://eslint.org/docs/latest/

module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  extends: [
    'standard',
    'plugin:vue/vue3-recommended',
    "prettier",
  ],
  plugins: ['html', 'vue'],
  ignorePatterns: [
    'node_modules'
  ],
  rules: {
    "import/no-extraneous-dependencies": [
      "error",
      { devDependencies: true },
    ],
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "vue/attributes-order": "off",
    "vue/no-v-html": "off",
    'vue/multi-word-component-names': 'off',
    "vue/order-in-components": 'off',
  },
}
