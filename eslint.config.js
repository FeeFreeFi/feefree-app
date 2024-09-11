import globals from "globals"
import pluginJs from "@eslint/js"
import pluginVue from 'eslint-plugin-vue'
import pluginJsdoc from 'eslint-plugin-jsdoc'

/**
 * @type {import('eslint').Linter.Config[]}
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
  pluginJsdoc.configs['flat/recommended'],
  {
    rules: {
      "jsdoc/require-param-description": "off",
      "jsdoc/require-returns-description": "off",
      "jsdoc/require-returns": "off",
    }
  },
  {
    ignores: ["src/vendors/*"],
  },
]
