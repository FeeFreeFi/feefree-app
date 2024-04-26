import { merge } from 'webpack-merge'

import baseConfig from './webpack.config.base.js'

// https://webpack.js.org/configuration/
/**
 * @type {import('webpack').Configuration}
 */
export default merge(baseConfig, {
  mode: 'development',
  devtool: 'eval-source-map',
  performance: {
    hints: false,
  },
  devServer: {
    port: process.env.PORT,
    hot: true,
    client: {
      logging: 'warn',
      overlay: false,
    },
    historyApiFallback: true,
  },
})
