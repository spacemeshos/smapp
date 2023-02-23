/**
 * Webpack config for production electron main process
 */
import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import checkNodeEnv from './checkNodeEnv';
import baseConfig from './webpack.config.base';
import getSentryEnvs from './getSentryEnvs';

checkNodeEnv('production');

export default merge(baseConfig, {
  devtool: 'source-map',

  mode: 'production',

  target: 'electron-main',

  entry: {
    main: './desktop/main.dev.ts',
    preload: path.join(__dirname, 'preload.js'),
  },

  output: {
    path: path.join(__dirname, '../desktop'),
    filename: 'main.prod.js',
    sourceMapFilename: 'main.prod.js.map',
  },

  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        extractComments: false
      })
    ]
  },

  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode:
        process.env.OPEN_ANALYZER === 'true' ? 'server' : 'disabled',
      openAnalyzer: process.env.OPEN_ANALYZER === 'true'
    }),

    /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     */
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG_PROD: false,
      START_MINIMIZED: false,
      ...getSentryEnvs(),
    }),
  ],

  /**
   * Disables webpack processing of __dirname and __filename.
   * If you run the bundle in node.js it falls back to these values of node.js.
   * https://github.com/webpack/webpack/issues/2010
   */
  node: {
    __dirname: false,
    __filename: false
  }
});
