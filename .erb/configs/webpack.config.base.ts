/**
 * Base webpack config used across other specific configs
 */

import webpack from 'webpack';
import SentryWebpackPlugin from '@sentry/webpack-plugin';
import webpackPaths from './webpack.paths';
import DotEnv from 'dotenv-webpack';
import { dependencies as externals } from '../../release/app/package.json';
import path from 'path';
console.log({PATH: path.resolve(__dirname, '../../node_modules/@sentry/utils/misc'), PATH2: path.resolve(__dirname, 'misc.js')})
const configuration: webpack.Configuration = {
  externals: [...Object.keys(externals || {})],

  stats: 'errors-only',

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            // Remove this line to enable type checking in webpack builds
            transpileOnly: true,
            compilerOptions: {
              module: 'esnext',
            },
          },
        },
      },
    ],
  },

  output: {
    path: webpackPaths.srcPath,
    // https://github.com/webpack/webpack/issues/1114
    library: {
      type: 'commonjs2',
    },
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    fallback: {
      stream: false,
    },
    /*fallback: {
      fs: false,
      tls: false,
      net: false,
      path: false,
      zlib: false,
      http: false,
      https: false,
      crypto: false,
      os: false,
      util: false,
      url: false,
      querystring: false,
    },*/
    // alias: {
    //   [path.resolve(__dirname, '../../node_modules/@sentry/utils/misc')]: path.resolve(__dirname, 'misc.js'),
    //   [path.resolve(__dirname, '../../node_modules/@sentry/core/node_modules/@sentry/utils/cjs/misc.js')]: path.resolve(__dirname, 'misc.js'),
    //   [path.resolve(__dirname, '../../node_modules/@sentry/utils/cjs/misc.js')]: path.resolve(__dirname, 'misc.js'),
    // },
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [webpackPaths.srcPath, 'node_modules'],
  },

  plugins: [
    new DotEnv({
      path: './.env',
      safe: true,
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
    new webpack.IgnorePlugin({
      contextRegExp: /^\.\/wordlists\/(?!english)/,
      resourceRegExp: /bip39\/src$/,
    }),
    // new webpack.NormalModuleReplacementPlugin(
    //   /misc\.[j|t]s+/,
    //   './misc.js'
    // )
  ].concat(
    process.env.SENTRY_AUTH_TOKEN
      ? [
        new SentryWebpackPlugin({
          include: '.',
          ignoreFile: '.sentrycliignore',
          ignore: ['node_modules', 'webpack.config.js'],
          release: `smashapp@${process.env.npm_package_version}`,
          org: 'spacemesh',
          project: 'smapp',
          authToken: process.env.SENTRY_AUTH_TOKEN,
        }),
      ]
      : []
  ),
};

export default configuration;
