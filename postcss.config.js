import postcssImport from "postcss-import"
import postcssPresetEnv from "postcss-preset-env"
import autoprefixer from "autoprefixer"
import tailwindcss from "tailwindcss"

// https://github.com/postcss/postcss#usage

/** @type {import('postcss-load-config').Config} */
export default {
  plugins: [
    postcssImport(),
    postcssPresetEnv(),
    autoprefixer(),
    tailwindcss(),
  ]
}
