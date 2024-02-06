module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'eslint:recommended',
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-console': 'off',
    'no-var': 'error',
    'arrow-parens': ['error', 'always'],
    'consistent-return': 'error',
    'linebreak-style': ['error', 'unix'],
    'no-unused-vars': 'error',
    'no-undef': 'error',
    indent: ['error', 2, { SwitchCase: 1 }],
  },
  ignorePatterns: ['**/*.spec.js'],
};
