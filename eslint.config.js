import globals from "globals"
import pluginJs from "@eslint/js"
import pluginVue from 'eslint-plugin-vue'

/**
 * @type {import('eslint').Linter.FlatConfig[]}
 */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        process: true,
      }
    }
  },
  pluginJs.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  {
    rules: {
      'vue/max-attributes-per-line': "off",
      'vue/singleline-html-element-content-newline': "off",
      'vue/multi-word-component-names': 'off',
      "vue/attributes-order": "off",
    },
  },
]
