// https://babeljs.io/docs/configuration

import presetEnv from '@babel/preset-env'
import TransformRemoveConsole from 'babel-plugin-transform-remove-console'

const isDebug = process.env.APP_DEBUG !== 'true'
const isProduction = process.env.NODE_ENV !== 'production'

/** @type {import('@babel/core').TransformOptions} */
export default {
  presets: [
    [
      presetEnv,
    ],
  ],
  plugins: [
    isProduction && !isDebug ? TransformRemoveConsole : null,
  ].filter(it => !!it),
}
