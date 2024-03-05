/**
 * Base webpack config used across other specific configs
 */

import path from 'path';
import webpack from 'webpack';
export default {
  externals: [],

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      }
    ]
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    alias: {
      client: path.resolve(__dirname, 'app/')
    },
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [path.join(__dirname, '../app'), path.join(__dirname, '../desktop'), 'node_modules']
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production'
    }),
    new webpack.IgnorePlugin({ resourceRegExp: /^\.\/wordlists\/(?!english)/, contextRegExp: /bip39\/src$/ }),
  ]
};

