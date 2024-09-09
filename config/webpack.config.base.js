import path from 'path'
import webpack from "webpack"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import HtmlWebpackPlugin from 'html-webpack-plugin'
import UnpluginIcons from 'unplugin-icons/webpack'
import UnpluginIconsResolver from 'unplugin-icons/resolver'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import { VueLoaderPlugin } from 'vue-loader'
import ESLintPlugin from 'eslint-webpack-plugin'
import formatter from 'eslint-formatter-friendly'
import Components from 'unplugin-vue-components/webpack'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

import { getDefinition, dirs, appMeta } from './environment.js'

const isProduction = process.env.NODE_ENV === 'production'

// https://webpack.js.org/configuration/
/**
 * @type {import('webpack').Configuration}
 */
export default {
  entry: {
    index: path.join(dirs.src, 'index.js'),
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
    extensions: ['.js', '.vue', '.json', '.css']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        resolve: {
          fullySpecified: false,
        },
        include: /node_modules/,
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        resolve: {
          fullySpecified: false,
        },
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: {
            sourceMap: true,
            compilerOptions: {
              whitespace: 'preserve',
            },
            extractCSS: isProduction,
          }
        }
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
            }
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
          }
        ]
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
            }
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10000,
          },
        },
        generator: {
          filename: 'images/[name].[contenthash:8][ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset/resource',
        parser: {
          dataUrlCondition: {
            maxSize: 10000,
          },
        },
        generator: {
          filename: 'fonts/[name].[contenthash:8][ext]'
        }
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin(getDefinition(!isProduction)),
    new ESLintPlugin({
      configType: "flat",
      extensions: ['js', 'vue'],
      formatter,
    }),
    Components({
      resolvers: [
        UnpluginIconsResolver({
          customCollections: ["ff"],
        }),
        NaiveUiResolver(),
      ],
    }),
    UnpluginIcons({
      customCollections: {
        ff: FileSystemIconLoader(path.resolve(dirs.src, "assets/icons")),
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
      minify: isProduction ? {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
        minifyJS: true,
        minifyCSS: true
      } : 'auto',
    }),
  ],
}
