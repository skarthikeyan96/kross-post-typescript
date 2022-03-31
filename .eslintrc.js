module.exports = {
  parserOptions: {
    ecmaVersion: 2020, 
    sourceType: 'module', 
    ecmaFeatures: {
      jsx: true 
    }
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  plugins: ['simple-import-sort'],
  settings: {
    react: {
      version: 'detect'
    }
  },
  extends: [
    'eslint:recommended',
    'next',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
    'plugin:sonarjs/recommended',
    'plugin:unicorn/recommended',
    'plugin:security/recommended',
    'plugin:react-hooks/recommended',   
  ],
  rules: {
    'no-console': 'error',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'simple-import-sort/imports': 'warn',
    'unicorn/filename-case': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'no-undef': 'off',
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/consistent-function-scoping': 'off',
    'react/no-children-prop' : 'warn',
    'react/no-unescaped-entities': 'warn',
    'sonarjs/no-duplicate-string': "warn",
    'sonarjs/cognitive-complexity': 'warn',
    'no-unused-vars': 'warn'
  }
};