const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  js.configs.recommended, 
  {
    files: ['**/*.js'], 
    languageOptions: {
      globals: {
        ...globals.node, 
      },
      parserOptions: {
        ecmaVersion: 12, 
        sourceType: 'script', 
      },
    },
    rules: {
      'indent': ['error', 2], 
    },
  },
];
