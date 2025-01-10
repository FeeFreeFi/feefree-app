import antfu from '@antfu/eslint-config'

export default antfu(
  {
    stylistic: {
      semi: false,
      quotes: 'single',
    },
    formatters: {
      css: true,
      html: true,
      markdown: true,
    },
    ignores: [
      'dist/**/*',
      'src/vendors/**/*',
    ],
  },
  {
    files: ['**/*.vue'],
    rules: {
      'vue/block-order': ['error', { order: [['script', 'template'], 'style'] }],
      'vue/singleline-html-element-content-newline': ['off'],
    },
  },
  {
    rules: {
      'node/prefer-global/process': ['error', 'always'],

      'no-console': ['off'],
      'regexp/prefer-range': ['off'],

      'antfu/top-level-function': ['off'],

      'perfectionist/sort-imports': ['off'],
      'perfectionist/sort-named-imports': ['off'],

      'jsonc/sort-keys': ['off'],

      'style/quotes': ['warn'],
      'style/comma-dangle': ['warn', 'always-multiline'],
      'style/arrow-parens': ['warn', 'as-needed'],
      'style/brace-style': ['warn', '1tbs', { allowSingleLine: false }],
      'style/quote-props': ['warn', 'as-needed', { keywords: false, unnecessary: false }],
    },
  },
)
