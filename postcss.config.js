import postcssImport from 'postcss-import'
import postcssPresetEnv from 'postcss-preset-env'
import tailwindcss from 'tailwindcss'

// https://github.com/postcss/postcss#usage

/** @type {import('postcss-load-config').Config} */
export default {
  plugins: [
    postcssImport(),
    tailwindcss(),
    postcssPresetEnv({
      stage: 1,
    }),
  ],
}
