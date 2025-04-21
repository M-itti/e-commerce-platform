const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        ecmaVersion: 12,
        sourceType: 'commonjs',
      },
    },
    rules: {
      'indent': ['error', 2],
    },
  },
];
