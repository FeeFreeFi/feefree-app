// https://tailwindcss.com/docs/configuration
// https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/config.full.js

import plugin from 'tailwindcss/plugin'
import animate from "tailwindcss-animate"

/**
 * @type {import('tailwindcss').Config}
 */
export default {
  // darkMode: 'class',
  content: ['./src/**/*.{html,js,vue}'],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(65, 245, 207)',
        success: 'rgb(65, 245, 109)',
        warning: 'rgb(245, 183, 65)',
        error: 'rgb(245, 65, 65)',
      },
      textColor: {
        basic: 'rgba(255, 255, 255, 1)',
        'basic-1': 'rgba(255, 255, 255, 0.7)',
        'basic-2': 'rgba(255, 255, 255, 0.5)',
        'basic-3': 'rgba(255, 255, 255, 0.3)',
        disabled: 'rgba(255, 255, 255, 0.1)',
      },
      backgroundColor: {
        body: 'rgb(4, 32, 39)',
        header: 'rgb(23, 25, 26)',
        container: 'rgb(61, 77, 74)',
        card: 'rgb(45, 57, 54)',
        'card-1': 'rgba(45, 57, 54, 0.6)',
        tab: 'rgb(31, 42, 39)',
        dialog: 'rgb(60, 77, 73)',
        section: 'rgb(24, 33, 30)',
        divider: 'rgb(75, 75, 81)',
        'divider-1': 'rgb(75, 96, 92)',
        box: 'rgba(34, 45, 42, 0.5)',
      },
      backgroundImage: {
        'primary-gradient': "linear-gradient(256deg, #E7E368 0%, #41F5CF 100%)",
        'primary-gradient-hover': "linear-gradient(256deg, #DFDA2D 0%, #35EDC6 100%)",
        'tab-gradient': "linear-gradient(270deg, rgba(61,77,74,0.5) 0%, #1C2423 100%)",
      },
      borderRadius: {
        20: '20px',
      },
    },
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
        '.margin-center': {
          left: "0",
          right: "0",
          top: "0",
          bottom: "0",
          margin: "auto",
        },
        '.margin-x-center': {
          left: "0",
          right: "0",
          "margin-left": "auto",
          "margin-right": "auto",
        },
        '.margin-y-center': {
          top: "0",
          bottom: "0",
          "margin-top": "auto",
          "margin-bottom": "auto",
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
      })
    }),
  ],
  corePlugins: {
    preflight: false
  },
}
