/* 
 * Basic ESLint Configuration for MAPS4 Development
 * 
 * GOAL: Essential code quality without blocking refactoring
 * - Basic TypeScript and React rules
 * - Essential code quality standards
 * - No overly aggressive MAPS4 enforcement
 */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'jsx-a11y',
    'import',
    'unicorn',
    'tailwindcss',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:unicorn/recommended',
    'plugin:tailwindcss/recommended',
    'prettier',
  ],
  settings: {
    react: { version: 'detect' },
    'import/resolver': {
      typescript: { project: ['./tsconfig.json'] },
    },
    tailwindcss: {
      callees: ['cn', 'clsx', 'classnames'],
      config: 'tailwind.config.js',
      cssFiles: ['src/**/*.css', 'src/**/*.scss'],
    },
  },
  env: { 
    es2022: true, 
    browser: true, 
    node: true 
  },
  rules: {
    /* ===== Essential Code Quality ===== */
    
    /* TypeScript */
    '@typescript-eslint/no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_', 
      varsIgnorePattern: '^_' 
    }],
    '@typescript-eslint/no-explicit-any': 'warn',
    'prefer-const': 'warn',
    
    /* React */
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    'react/jsx-key': 'error',
    'react/jsx-no-duplicate-props': 'error',
    'react/jsx-no-undef': 'error',
    
    /* React Hooks */
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    /* Accessibility */
    'jsx-a11y/alt-text': 'warn',
    'jsx-a11y/anchor-is-valid': 'warn',
    
    /* Imports */
    'import/order': ['warn', {
      'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'newlines-between': 'always',
      'alphabetize': { order: 'asc', caseInsensitive: true }
    }],
    'import/no-unresolved': 'off', // TypeScript handles this
    
    /* General */
    'no-console': 'warn',
    'no-debugger': 'error',
    'prefer-const': 'warn',
    'no-var': 'error',
    
    /* Tailwind */
    'tailwindcss/no-arbitrary-value': 'warn',
    'tailwindcss/no-contradicting-classname': 'error',
    
    /* Unicorn - Relaxed */
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/prefer-optional-catch-binding': 'off',
    'unicorn/no-null': 'off',
    'unicorn/prefer-top-level-await': 'off',
    'unicorn/filename-case': 'off', // Too strict for refactoring
  },

  overrides: [
    /* ===== Test Files (Relaxed Rules) ===== */
    {
      files: ['**/*.test.*', '**/*.spec.*'],
      rules: {
        'no-console': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },

    /* ===== Configuration Files (Relaxed Rules) ===== */
    {
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
        '@typescript-eslint/no-var-requires': 'off',
        'no-console': 'off',
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
  ],
};
