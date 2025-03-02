import tailwindcss from '@tailwindcss/postcss'
import type { Config } from 'postcss-load-config'

const config: Config = {
  plugins: [
    tailwindcss(),
  ],
}

export default config
