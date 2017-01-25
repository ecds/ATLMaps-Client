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
      'ember-suave/no-const-outside-module-scope': ['off'],
      'quotes': [2, 'single', 'avoid-escape'],
      'indent': [2, 4],
      'no-use-before-define': [2, 'nofunc'],
      'prefer-rest-params': 0,
      'import/no-unresolved': 0,
      'no-underscore-dangle': 0,
    //   'comma-dangle': ['error', 'never'],
      'space-before-function-paren': ['error', 'never'],
      'camelcase': 0
  }
};
