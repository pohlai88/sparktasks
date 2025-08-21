module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:tailwindcss/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'jsx-a11y',
    'tailwindcss',
    'prettier',
  ],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'tailwindcss/classnames-order': 'warn',
    'tailwindcss/no-custom-classname': 'off',
    'no-console': 'warn',
    'no-debugger': 'error',
    'prefer-const': 'error',
    'no-restricted-syntax': [
      'error',
      {
        selector:
          'JSXAttribute[name.name=\'className\'] Literal[value=/\\\\b(m[trblxy]?-[0-9]+|p[trblxy]?-[0-9]+|gap-[0-9]+|w-\\\\d+|h-\\\\d+|size-\\\\d+|max-w-[^-\\\\s"]+|min-w-[^-\\\\s"]+|border-b)\\\\b/]',
        message:
          'Use DESIGN_TOKENS.* (spacing/sizing/layout) instead of hardcoded Tailwind utility.',
      },
      {
        selector:
          "JSXAttribute[name.name='className'] Literal[value=/\\\\b(flex\\\\s+items-center\\\\s+justify-between)\\\\b/]",
        message:
          'Use DESIGN_TOKENS.layout.patterns.spaceBetween instead of repeating the trio.',
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@/components/shared',
            message:
              'Import UI components from @/components/ui instead of shared',
          },
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['src/design/tokens.ts'],
      rules: {
        'no-restricted-syntax': 'off',
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
    tailwindcss: {
      config: './tailwind.config.js',
    },
  },
  overrides: [
    {
      files: ['**/DescriptionList.tsx', '**/Well.tsx'],
      rules: {
        'jsx-a11y/no-noninteractive-element-interactions': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
        'jsx-a11y/no-static-element-interactions': 'off',
      },
    },
  ],
  ignorePatterns: [
    'dist',
    'node_modules',
    '*.config.js',
    '*.config.ts',
    'coverage',
  ],
};
