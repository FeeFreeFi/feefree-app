import path from 'path'
import webpack from 'webpack'
import { merge } from 'webpack-merge'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'

import baseConfig from './webpack.config.base.js'
import { getDefinition, dirs } from "./environment.js"

// https://webpack.js.org/configuration/
/**
 * @type {import('webpack').Configuration}
 */
export default merge(baseConfig, {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(dirs.root, 'public'),
          to: dirs.dist,
          noErrorOnMissing: true,
          globOptions: {
            ignore: ['.*'],
          },
        },
      ]
    }),
    new webpack.DefinePlugin(getDefinition()),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'initial',
      minChunks: 2,
    },
  },
  performance: {
    maxEntrypointSize: 1024 * 1024 * 10,
    maxAssetSize: 1024 * 1024 * 20,
    hints: 'warning',
  },
})
