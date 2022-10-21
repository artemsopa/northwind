module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'linebreak-style': 0,
    'lines-between-class-members': 0,
    'no-console': 0,
    'no-unused-vars': 0,
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'import/prefer-default-export': 0,
    'max-classes-per-file': 0,
    'max-len': 0,
    'no-promise-executor-return': 0,
    'consistent-return': 0,
    'no-shadow': 0,
    'no-return-await': 0,
    'no-param-reassign': 0,
    'no-restricted-syntax': 0,
    'class-methods-use-this': 0,
    'no-use-before-define': 0,
    'no-nested-ternary': 0,
    'object-curly-newline': 0,
  },
};
