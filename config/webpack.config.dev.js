import { merge } from 'webpack-merge'

import baseConfig from './webpack.config.base.js'

// https://webpack.js.org/configuration/

/**
 * @type {import('webpack-dev-server').Configuration}
 */
const devServer = {
  port: process.env.PORT,
  hot: true,
  client: {
    logging: 'warn',
    overlay: false,
  },
  historyApiFallback: true,
  proxy: [
    {
      context: ['/api'],
      target: process.env.API_BASE,
    },
  ]
}

/**
 * @type {import('webpack').Configuration}
 */
const devConfig = {
  mode: 'development',
  devtool: 'eval-source-map',
  performance: {
    hints: false,
  },
  devServer,
}

export default merge(baseConfig, devConfig)
