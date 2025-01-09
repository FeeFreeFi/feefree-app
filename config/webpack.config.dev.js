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
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
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
  cache: {
    type: "filesystem",
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
}

export default merge(baseConfig, devConfig)
