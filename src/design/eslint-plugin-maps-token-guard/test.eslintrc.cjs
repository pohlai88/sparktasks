module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['maps-token-guard'],
  rules: {
    // Enable only MAPS governance rules for testing - minimal config
    'maps-token-guard/no-raw-tailwind-in-components': 'error',
    'maps-token-guard/no-inline-style-hardcoded': 'error',
    'maps-token-guard/enforce-visually-hidden': 'error',
    'maps-token-guard/no-hardcoded-z-index': 'error',
    'maps-token-guard/require-dark-first': 'error',
    'maps-token-guard/enforce-token-imports': 'error',

    // Disable problematic rules not related to MAPS
    'react/prop-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
