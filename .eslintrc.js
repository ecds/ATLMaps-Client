module.exports = {
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  extends: [
      'airbnb-base',
      'plugin:ember-suave/recommended'
  ],
  env: {
    'browser': true
  },
  rules: {
      'indent': [2, 4],
      'comma-dangle': ['error', 'never'],
      'quotes': [2, 'single', 'avoid-escape'],
      'indent': [2, 4],
      'no-use-before-define': [2, 'nofunc'],
      'prefer-rest-params': 0,
      'import/no-unresolved': 0,
      'import/extensions': 0,
      'no-underscore-dangle': 0,
      'space-before-function-paren': ['error', 'never'],
      'camelcase': 0,
      'no-restricted-syntax': [0, 'ForInStatmens'],
      /*eslint new-cap: ["error", { "newIsCap": false }]*/

      // ember-suave
      'ember-suave/no-const-outside-module-scope': ['off'],
      'ember-suave/require-access-in-comments': ['off'],

  }
};
