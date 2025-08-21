/**
 * @fileoverview SSOT ESLint Configuration
 * Enhanced zero-overhead compliance for enterprise components
 */

const baseConfig = require('../.eslintrc.cjs');

module.exports = {
  ...baseConfig,

  overrides: [
    ...(baseConfig.overrides || []),

    // SSOT enforcement for all component files
    {
      files: ['src/components/**/*.{ts,tsx}', 'src/**/*.{ts,tsx}'],
      excludedFiles: ['src/design/**'],
      rules: {
        ...baseConfig.rules,

        // Zero-overhead SSOT compliance
        'no-restricted-globals': [
          'error',
          {
            name: 'console',
            message:
              'Use DESIGN_TOKENS.logging or logger utilities instead of direct console access',
          },
        ],

        // Token system compliance
        'no-restricted-syntax': [
          'error',
          {
            selector: 'Literal[value=/^#[0-9a-fA-F]{3,6}$/]',
            message: 'Use DESIGN_TOKENS.colors instead of hardcoded hex colors',
          },
        ],

        // Component structure validation
        '@typescript-eslint/consistent-type-imports': [
          'error',
          {
            prefer: 'type-imports',
            disallowTypeAnnotations: false,
          },
        ],

        // Enhanced a11y rules for SSOT compliance
        'jsx-a11y/no-aria-hidden-on-focusable': 'error',
        'jsx-a11y/prefer-tag-over-role': 'error',
      },
    },
  ],
};
