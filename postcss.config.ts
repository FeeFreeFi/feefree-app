import postcssImport from 'postcss-import'
import postcssPresetEnv from 'postcss-preset-env'
import tailwindcss from 'tailwindcss'
import type { Config } from 'postcss-load-config'

const config: Config = {
  plugins: [
    postcssImport(),
    tailwindcss(),
    postcssPresetEnv(),
  ],
}

export default config
