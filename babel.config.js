module.exports = {
  presets: ["flow", "react-native", 'module:metro-react-native-babel-preset'],
  plugins: [
    ['@babel/plugin-transform-flow-strip-types'],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    [
      'module:babel-root-slash-import',
      {
        rootPathSuffix: 'src'
      }
    ],
    'transform-inline-environment-variables'
  ],
  resolve: {
    alias: {
      'react-native$': 'react-native-web'
    }
  }
};
