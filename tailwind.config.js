// https://tailwindcss.com/docs/configuration
// https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/config.full.js

import plugin from 'tailwindcss/plugin'
import animate from "tailwindcss-animate"

/**
 * @type {import('tailwindcss').Config}
 */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{html,js,vue}'],
  theme: {
    extend: {
      colors: {
        'primary': "var(--x-primary-color)",
        'info': "var(--x-info-color)",
        'success': "var(--x-success-color)",
        'warning': "var(--x-warning-color)",
        'error': "var(--x-error-color)",

        'bg-1': "var(--x-bg-color-1)",
        'bg-2': "var(--x-bg-color-2)",
        'bg-3': "var(--x-bg-color-3)",
        'bg-4': "var(--x-bg-color-4)",
        'bg-5': "var(--x-bg-color-5)",

        'grey-1': "var(--x-grey-color-1)",
        'grey-2': "var(--x-grey-color-2)",
        'grey-3': "var(--x-grey-color-3)",
        'grey-4': "var(--x-grey-color-4)",
        'grey-5': "var(--x-grey-color-5)",
        'grey-6': "var(--x-grey-color-6)",

        'body': "var(--x-body-color)",
        'main': "var(--x-main-color)",
        'background': "var(--x-background-color)",
        'block': "var(--x-block-color)",
        'divider': "var(--x-divider-color)",
        'pressed': "var(--x-pressed-color)",

        'color-base': "var(--x-text-color-base)",
        'color-1': "var(--x-text-color-1)",
        'color-2': "var(--x-text-color-2)",
        'color-3': "var(--x-text-color-3)",
        'color-bright': "var(--x-text-color-bright)",
      },
      boxShadow: {
        'x-1': "var(--x-box-shadow-1)",
        'x-2': "var(--x-box-shadow-2)",
      },
    }
  },
  plugins: [
    animate,
    plugin(({ addUtilities }) => {
      addUtilities({
        '.translate-center': {
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        },
        '.translate-x-center': {
          left: "50%",
          transform: "translateX(-50%)",
        },
        '.translate-y-center': {
          top: "50%",
          transform: "translateY(-50%)",
        },
        '.flex-center': {
          display: "flex",
          "justify-content": "center",
          "align-items": "center",
        },
        '.flex-x-center': {
          display: "flex",
          "flex-direction": "column",
          "justify-content": "center",
        },
        '.flex-y-center': {
          display: "flex",
          "align-items": "center",
        },
        '.flip-x': {
          transform: "scaleX(-1)",
        },
        '.flip-y': {
          transform: "scaleY(-1)",
        },
        '.flip-xy': {
          transform: "scale(-1)",
        },
        '.border-lr': {
          'border-left': "1px solid transparent",
          'border-right': "1px solid transparent",
        },
        '.border-tb': {
          'border-top': "1px solid transparent",
          'border-bottom': "1px solid transparent",
        },
        '.border-top': {
          'border-top': "1px solid transparent",
        },
        '.border-bottom': {
          'border-bottom': "1px solid transparent",
        },
        '.border-left': {
          'border-left': "1px solid transparent",
        },
        '.border-right': {
          'border-right': "1px solid transparent",
        },
        '.border-all': {
          'border': "1px solid transparent",
        },
      })
    }),
  ],
  corePlugins: {
    preflight: false
  },
}
