import globals from "globals"
import eslint from '@eslint/js'
import tslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'

export default tslint.config(
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        process: true,
      },
    },
  },
  eslint.configs.recommended,
  tslint.configs.strict,
  {
    files: ['*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tslint.parser,
        extraFileExtensions: [".vue"],
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  {
    ignores: [
      "src/vendors",
    ],
  },
)
