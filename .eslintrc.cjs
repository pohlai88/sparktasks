/**
 * ESLint v8 configuration (non-flat) — SparkTasks
 * - Prettier runs separately (no eslint-plugin-prettier)
 * - Tailwind class ordering handled by prettier-plugin-tailwindcss
 * - Type-aware TS via parserOptions.project
 */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
    jest: false,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  settings: {
    react: { version: 'detect' },
    'import/resolver': {
      typescript: { project: ['./tsconfig.json'] },
    },
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'jsx-a11y',
    'import',
    'unicorn',
    'tailwindcss',
    'unused-imports',
    'maps-token-guard',  // ← MAPS governance integration
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:unicorn/recommended',
    // Keep Prettier last to disable stylistic conflicts
    'prettier',
  ],
  rules: {
    // TS strictness
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/no-misused-promises': [
      'error',
      { checksVoidReturn: { attributes: false } },
    ],
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
    ],

    // Unused imports (faster signal than no-unused-vars)
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],

    // Configure TypeScript unused vars to use underscore pattern
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],

    // React
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    'react/self-closing-comp': 'warn',

    // Hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // A11y
    'jsx-a11y/anchor-is-valid': 'warn',

    // Imports
    'import/order': [
      'warn',
      {
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'import/no-unresolved': 'off', // TS handles this

    // Unicorn - adjusted for practicality
    'unicorn/filename-case': 'off',
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/prefer-optional-catch-binding': 'off',
    'unicorn/no-null': 'off',
    'unicorn/prefer-top-level-await': 'off',
    'unicorn/prefer-code-point': 'off', // charCodeAt is fine for ASCII
    'unicorn/no-array-callback-reference': 'off', // common pattern
    'unicorn/consistent-function-scoping': 'off', // allow inline functions
    'unicorn/prefer-query-selector': 'off', // getElementById is fine
    'unicorn/prefer-ternary': 'off', // if statements are often clearer
    'unicorn/no-useless-switch-case': 'off', // sometimes needed for clarity
    'unicorn/numeric-separators-style': 'off',
    'unicorn/switch-case-braces': 'off',
    'unicorn/no-negated-condition': 'off',
    'unicorn/no-empty-file': 'off',
    'unicorn/prefer-array-some': 'off',

    // Tailwind — let Prettier sort classes
    'tailwindcss/classnames-order': 'off',
    'tailwindcss/no-custom-classname': 'off',

    // ===== ANTI-DRIFT GOVERNANCE RULES =====
    // Block manual accessibility patterns
    'no-restricted-syntax': [
      'error',
      {
        selector: "JSXAttribute[name.name='aria-hidden'][value.value=true]",
        message: '🚫 Use <AccessibleIcon> wrapper instead of manual aria-hidden'
      },
      {
        selector: "Literal[value='sr-only']",
        message: '🚫 Use <VisuallyHidden> component instead of sr-only class'
      },
      {
        selector: "Property[key.name='aria-hidden'][value.value=true]",
        message: '🚫 Use <AccessibleIcon> wrapper instead of object aria-hidden'
      }
    ],

    // Block primitive bypassing
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@radix-ui/react-visually-hidden',
            message: '🚫 Import from @/components/primitives instead'
          },
          {
            name: '@radix-ui/react-slot',
            message: '🚫 Import from @/components/primitives instead'
          },
          {
            name: '@radix-ui/react-accessible-icon',
            message: '🚫 Import from @/components/primitives instead'
          },
          {
            name: '@radix-ui/react-direction',
            message: '🚫 Import from @/components/primitives instead'
          }
        ]
      }
    ],

    // ===== MAPS GOVERNANCE RULES =====
    // Enable MAPS token governance (start with warnings)
    'maps-token-guard/no-raw-tailwind-in-components': 'warn',
    'maps-token-guard/enforce-visually-hidden': 'warn',
    'maps-token-guard/no-hardcoded-z-index': 'warn',
    'maps-token-guard/require-dark-first': 'warn',
  },
  overrides: [
    {
      files: ['**/*.test.*', '**/*.spec.*', 'test/**/*.*'],
      env: { node: true },
      rules: {
        'no-unused-expressions': 'off',
      },
    },
    {
      // Config files: disable type-aware parsing for performance
      files: [
        '*.{js,cjs,mjs}',
        '*.config.*',
        'vite.config.ts',
        'vitest.config.ts',
        'playwright.config.ts',
        'postcss.config.js',
        'tailwind.config.js',
      ],
      parserOptions: { project: null },
      rules: {
        // Disable type-aware rules for config files
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/await-thenable': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
      },
    },
    {
      // Documentation files: disable type-aware parsing
      files: ['**/docs/**/*.{ts,tsx}'],
      parserOptions: { project: null },
      rules: {
        // Disable type-aware rules for docs
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/await-thenable': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
      },
    },
    {
      // Primitive components: allow direct Radix imports
      files: ['src/components/primitives/**/*.{ts,tsx}'],
      rules: {
        // Allow primitives to import directly from Radix UI
        'no-restricted-imports': 'off',
      },
    },
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    'coverage/',
    '.next/',
    '.turbo/',
    '.vscode/',
    '.husky/',
    '**/*.min.*',
    '**/*.d.ts',
    '.eslintcache',
    'test-results/',
    'e2e/playwright-report/',
    '.eslintrc.cjs', // Exclude this file from type checking
  ],
};
