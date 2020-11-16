/* eslint global-require: off */

const developmentEnvironments = ['development', 'test'];

const developmentPlugins = [
  require('babel-plugin-styled-components'),
  require('react-hot-loader/babel'),
  require('@babel/plugin-transform-runtime')
];

const productionPlugins = [
  require('babel-plugin-dev-expression'),
  // babel-preset-react-optimize
  require('@babel/plugin-transform-react-constant-elements'),
  require('@babel/plugin-transform-react-inline-elements')
];

module.exports = (api) => {
  // see docs about api at https://babeljs.io/docs/en/config-files#apicache

  const development = api.env(developmentEnvironments);

  return {
    presets: [
      // @babel/preset-env will automatically target our browserslist targets
      require('@babel/preset-env'),
      require('@babel/preset-typescript'),
      [require('@babel/preset-react'), { development }],
    ],
    plugins: [
      // Stage 1
      require('@babel/plugin-proposal-export-default-from'),
      [require('@babel/plugin-proposal-optional-chaining'), { loose: false }],

      // Stage 2
      require('@babel/plugin-proposal-export-namespace-from'),
      require('@babel/plugin-proposal-throw-expressions'),

      // Stage 3
      require('@babel/plugin-syntax-dynamic-import'),
      require('@babel/plugin-syntax-import-meta'),
      [require('@babel/plugin-proposal-class-properties'), { loose: true }],

      ...(development ? developmentPlugins : productionPlugins)
    ]
  };
};
