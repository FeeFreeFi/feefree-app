import { merge } from 'webpack-merge'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import { EsbuildPlugin } from 'esbuild-loader'

import baseConfig from './webpack.config.base.js'
import { dirs } from './environment.js'

const APP_DEBUG = process.env.APP_DEBUG === 'true'

const chunksConfig = {
  viem: [
    'viem',
    'abitype',
    'isows',
    'ws',
    '@noble/curves',
    '@noble/hashes',
    '@adraffy/ens-normalize',
    '@scure/bip32',
    '@scure/bip39',
  ],
  naiveui: [
    'naive-ui',
    '@css-render/plugin-bem',
    '@css-render/vue3-ssr',
    '@types/katex',
    '@types/lodash',
    '@types/lodash-es',
    'async-validator',
    'css-render',
    'csstype',
    'date-fns',
    'date-fns-tz',
    'evtd',
    'highlight.js',
    // 'lodash-es',
    'seemly',
    'treemate',
    'vdirs',
    'vooks',
    'vueuc',

    '@emotion/hash',
    '@juggle/resize-observer',
  ],
}

const chunks = Object.fromEntries(Object.entries(chunksConfig).map(([name, deps]) => {
  const seperator = '[\\/]'
  const items = deps.map(it => it.replace('/', seperator))
  const reg = new RegExp(`${seperator}node_modules${seperator}(${items.join('|')})`)

  const chunk = {
    name,
    test: module => reg.test(module.resource),
  }

  return [name, chunk]
}))

// https://webpack.js.org/configuration/

/**
 * @type {import('webpack').Configuration}
 */
const prodConfig = {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: dirs.public,
          to: dirs.dist,
          noErrorOnMissing: true,
          globOptions: {
            dot: true,
            ignore: ['**/.*'],
          },
        },
      ],
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new EsbuildPlugin({
        target: 'esnext',
        css: true,
        drop: APP_DEBUG ? [] : ['console', 'debugger'],
        legalComments: 'none',
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,

      cacheGroups: {
        naiveui: {
          ...chunks.naiveui,
          reuseExistingChunk: true,
          chunks: 'all',
          minChunks: 1,
          enforce: true,
          priority: 20,
        },
        viem: {
          ...chunks.viem,
          reuseExistingChunk: true,
          chunks: 'all',
          minChunks: 1,
          enforce: true,
          priority: 10,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          reuseExistingChunk: true,
          chunks: 'all',
          minChunks: 1,
          enforce: true,
          priority: -20,
        },
      },
    },
  },
  performance: {
    maxEntrypointSize: 1024 * 1024 * 4,
    maxAssetSize: 1024 * 1024 * 8,
    hints: 'warning',
  },
}

export default merge(baseConfig, prodConfig)
