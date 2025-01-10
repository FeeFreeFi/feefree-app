import path from 'node:path'
import webpack from 'webpack'
import { VueLoaderPlugin } from 'vue-loader'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ESLintPlugin from 'eslint-webpack-plugin'
import formatter from 'eslint-formatter-friendly'
import AutoImport from 'unplugin-auto-import/webpack'
import Components from 'unplugin-vue-components/webpack'
import UnpluginIcons from 'unplugin-icons/webpack'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import UnpluginIconsResolver from 'unplugin-icons/resolver'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'

import { getDefinition, dirs, appMeta } from './environment.js'

const isProduction = process.env.NODE_ENV === 'production'

const customIconNamespace = 'ff'

// https://webpack.js.org/configuration/
/**
 * @type {import('webpack').Configuration}
 */
export default {
  entry: {
    index: path.join(dirs.src, 'index.ts'),
  },
  output: {
    filename: '[name].[contenthash:8].js',
    path: dirs.dist,
    publicPath: '/',
  },
  resolve: {
    alias: {
      '@': dirs.src,
    },
    extensions: ['.ts', '.js', '.vue', '.json', '.css', '.scss'],
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              sourceMap: true,
              compilerOptions: {
                whitespace: 'preserve',
              },
              extractCSS: isProduction,
            },
          },
        ],
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/],
            },
          },
        ],
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.scss$/,
        exclude: /\.module\.scss$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              additionalData: '@use "@/assets/styles/variables.module.scss" as *;',
            },
          },
        ],
      },
      {
        test: /\.module\.scss$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              modules: {
                mode: 'local',
              },
            },
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.(png|jpe?g|svg)(\?.*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
        generator: {
          filename: 'images/[name].[contenthash:8][ext]',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset/resource',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
        generator: {
          filename: 'fonts/[name].[contenthash:8][ext]',
        },
      },
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.DefinePlugin(getDefinition(!isProduction)),
    new ESLintPlugin({
      configType: 'flat',
      extensions: ['ts', 'js', 'vue'],
      formatter,
    }),
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: path.resolve(dirs.src, 'types/auto-imports.d.ts'),
    }),
    Components({
      dts: 'src/types/components.d.ts',
      resolvers: [
        UnpluginIconsResolver({
          customCollections: [customIconNamespace],
        }),
        NaiveUiResolver(),
      ],
    }),
    UnpluginIcons({
      customCollections: {
        [customIconNamespace]: FileSystemIconLoader(path.resolve(dirs.src, 'assets/icons')),
      },
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: isProduction ? '[name].[contenthash:8].css' : '[name].css',
      chunkFilename: isProduction ? '[id].[contenthash:8].css' : '[id].css',
    }),
    new HtmlWebpackPlugin({
      title: appMeta.productName,
      description: appMeta.description,
      filename: 'index.html',
      template: path.join(dirs.src, 'index.html'),
      minify: isProduction
        ? {
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeComments: true,
            minifyJS: true,
            minifyCSS: true,
          }
        : 'auto',
    }),
  ],
}
