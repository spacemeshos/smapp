module.exports = {
  extends: 'erb',
  rules: {
    'class-methods-use-this': 0,
    'prettier/prettier': 'error',
    'no-debugger': 2,
    'no-console': 2,
    radix: 0,
    'func-names': ['error', 'never'],
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    ],
    'react/state-in-constructor': 0,
    'react/static-property-placement': 0,
    'react/jsx-props-no-spreading': 0,
    'max-len': [
      'error',
      {
        code: 180,
        ignoreUrls: true
      }
    ],
    'no-class-assign': 0,
    'no-else-return': 0,
    'no-underscore-dangle': 0,
    'no-unused-expressions': [
      2,
      {
        allowShortCircuit: true,
        allowTernary: true
      }
    ],
    'import/no-absolute-path': 0,
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'import/prefer-default-export': 1,
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 0,
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index']
      }
    ],
    'react/sort-comp': [
      2,
      {
        order: [
          'type-annotations',
          'defaultProps',
          'static-variables',
          'static-methods',
          'state',
          'constructor',
          'render',
          'lifecycle',
          '/^render.+$/',
          '/^get.+$/',
          '/^set.+$/',
          '/^on.+$/',
          '/^handle.+$/',
          'everything-else'
        ]
      }
    ],
    'react/forbid-prop-types': [
      2,
      {
        forbid: ['any']
      }
    ],
    'arrow-parens': 0,
    'react/jsx-curly-brace-presence': 0,
    'prefer-destructuring': 1,
    'jsx-a11y/anchor-is-valid': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'comma-dangle': 'off',
    'react/require-default-props': 0,
    'no-use-before-define': 'off',
    'react/no-array-index-key': 0,
    'no-loop-func': 0,
    '@typescript-eslint/no-loop-func': 0,
    'no-redeclare': 0,
    '@typescript-eslint/no-redeclare': 0,
    'no-shadow': 0,
    '@typescript-eslint/no-shadow': 0,
    '@typescript-eslint/no-throw-literal': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/no-unused-expressions': 0,
    'react/prop-types': 0
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./configs/webpack.config.eslint.js')
      }
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    }
  }
};
