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
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:unicorn/recommended',
    'plugin:tailwindcss/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'jsx-a11y',
    'unused-imports',
    'import',
    'unicorn',
    'tailwindcss',
    'prettier',
  ],
  rules: {
    // Prettier formatting
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],

    // Hard blockers (must be 0)
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'no-fallthrough': 'off',
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
    'no-console': ['error', { allow: ['warn', 'error'] }],

    // Quality & auto-fix
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
    ],
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        alphabetize: { order: 'asc' },
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        pathGroups: [
          {
            pattern: '@/**',
            group: 'internal',
            position: 'before',
          },
        ],
      },
    ],
    'import/default': 'off', // React 18+ uses named exports
    'import/no-named-as-default-member': 'off', // React 18+ pattern

    // TypeScript rules
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',

    // React rules
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // Unicorn overrides (disable some overly strict rules)
    'unicorn/prefer-optional-catch-binding': 'off',
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/filename-case': 'off',
    'unicorn/no-null': 'off',
    'unicorn/prefer-top-level-await': 'off',
    'unicorn/prefer-code-point': 'off', // charCodeAt is fine for ASCII
    'unicorn/no-array-callback-reference': 'off', // common pattern
    'unicorn/consistent-function-scoping': 'off', // allow inline functions
    'unicorn/prefer-query-selector': 'off', // getElementById is fine
    'unicorn/prefer-ternary': 'off', // if statements are often clearer
    'unicorn/no-useless-switch-case': 'off', // sometimes needed for clarity

    // A11y (keep strict)
    'jsx-a11y/label-has-associated-control': ['error', { assert: 'either' }],

    // Code quality
    'no-debugger': 'error',
    'prefer-const': 'error',

    // Tailwind specific
    'tailwindcss/classnames-order': 'warn',
    'tailwindcss/no-custom-classname': 'off',

    // Design token enforcement
    'no-restricted-syntax': [
      'error',
      {
        selector: String.raw`JSXAttribute[name.name='className'] Literal[value=/\\b(m[trblxy]?-[0-9]+|p[trblxy]?-[0-9]+|gap-[0-9]+|w-\\d+|h-\\d+|size-\\d+|max-w-[^-\\s"]+|min-w-[^-\\s"]+|border-b)\\b/]`,
        message:
          'Use DESIGN_TOKENS.* (spacing/sizing/layout) instead of hardcoded Tailwind utility.',
      },
      {
        selector: String.raw`JSXAttribute[name.name='className'] Literal[value=/\\b(flex\\s+items-center\\s+justify-between)\\b/]`,
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
    {
      files: ['**/DescriptionList.tsx', '**/Well.tsx'],
      rules: {
        'jsx-a11y/no-noninteractive-element-interactions': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
        'jsx-a11y/no-static-element-interactions': 'off',
      },
    },
    // Enforce promises safety in production code (disabled for now - requires project setup)
    {
      files: ['src/**/*.{ts,tsx}'],
      rules: {
        // '@typescript-eslint/no-floating-promises': 'error', // TODO: Enable after project setup
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
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
  ignorePatterns: [
    'dist',
    'node_modules',
    '*.config.js',
    '*.config.ts',
    'coverage',
    '**/*.test.ts',
    '**/*.test.tsx',
    '**/*.spec.ts',
    '**/*.spec.tsx',
    '**/demo/**',
    '**/*Demo.tsx',
    '**/*Demo.ts',
  ],
};
