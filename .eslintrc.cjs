/**
 * ESLint Configuration - Normal Yet Powerful
 * 
 * MAPS4 Goals: Token discipline in UI, practical rules everywhere else
 * Scope: Strict in UI components, practical in business logic
 */

module.exports = {
  root: true,
  env: { 
    browser: true, 
    es2020: true, 
    node: true 
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    // For type-aware rules (optional - uncomment if you want stricter TS checking)
    // project: ['./tsconfig.eslint.json'],
  },
  settings: { 
    react: { version: 'detect' },
    'import/resolver': {
      typescript: { project: ['./tsconfig.json'] },
    },
    tailwindcss: {
      callees: ['cn', 'clsx', 'classnames', 'tw'],
      config: 'tailwind.config.js',
      cssFiles: ['src/**/*.css', 'src/**/*.scss'],
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    // Uncomment for stricter type checking (adds ~2-3s to CI)
    // 'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:tailwindcss/recommended',
    'plugin:unicorn/recommended',
  ],
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'jsx-a11y',
    'import',
    'tailwindcss',
    'unused-imports',
    'unicorn',
  ],
  rules: {
    // ===== TypeScript Rules =====
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    'prefer-const': 'error',
    
    // ===== Import Hygiene =====
    'import/no-unresolved': 'error',
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: [
        '**/*.test.*', '**/*.spec.*',
        '**/vite.config.*', '**/vitest.config.*', '**/*.config.*', '**/*.setup.*'
      ],
    }],
    'import/order': ['warn', {
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'newlines-between': 'always',
      alphabetize: { order: 'asc', caseInsensitive: true },
    }],
    'unused-imports/no-unused-imports': 'error',
    
    // ===== React Rules =====
    'react/react-in-jsx-scope': 'off',
    'react/jsx-key': 'error',
    'react/jsx-no-duplicate-props': 'error',
    'react/jsx-no-undef': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // ===== Accessibility =====
    'jsx-a11y/alt-text': 'warn',
    'jsx-a11y/anchor-is-valid': 'warn',
    'jsx-a11y/click-events-have-key-events': 'warn',
    
    // ===== Code Quality =====
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    
    // ===== Tailwind =====
    'tailwindcss/no-custom-classname': 'off', // Allow custom classes
    'tailwindcss/no-contradicting-classname': 'error',
    
    // ===== Unicorn =====
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/prefer-optional-catch-binding': 'off',
    'unicorn/no-null': 'off',
    'unicorn/prefer-top-level-await': 'off',
    'unicorn/filename-case': 'off', // Too strict for refactoring
    
    // ===== Code Quality =====
    'complexity': 'warn',
  },
  
  overrides: [
    // ===== UI Components - MAPS4 Strict Rules =====
    {
      files: [
        'src/components/ui-enhanced/**/*.{tsx,jsx}',
        'src/components/primitives/**/*.{tsx,jsx}',
        'src/design/**/*.{ts,tsx}',
      ],
      rules: {
        // MAPS4: Strict token governance in UI (simplified for Phase 3)
        'no-restricted-syntax': 'off', // Temporarily disabled for configuration harmonization
        
        // Strict Tailwind rules in UI
        'tailwindcss/no-custom-classname': 'error',
        'tailwindcss/no-contradicting-classname': 'error',
      },
    },
    
    // ===== Railway Components - MAPS4 Light Rules =====
    {
      files: [
        'src/components/railway/**/*.{tsx,jsx}',
        'src/components/features-enhanced/**/*.{tsx,jsx}',
        'src/components/data-enhanced/**/*.{tsx,jsx}',
      ],
      rules: {
        // MAPS4: Light enforcement in business logic (simplified for Phase 3)
        'no-restricted-syntax': 'off', // Temporarily disabled for configuration harmonization
        
        // Allow more flexibility in business components
        'tailwindcss/no-custom-classname': 'warn',
      },
    },
    
    // ===== Test Files =====
    {
      files: ['**/*.{test,spec}.{js,ts,jsx,tsx}'],
      env: {
        node: true,
        es2020: true,
        jest: true, // Vitest is compatible with Jest globals
      },
      rules: {
        'no-console': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
    
    // ===== Configuration Files =====
    {
      files: [
        '**/*.config.{js,ts}',
        '**/*.config.*.{js,ts}',
        'vite.config.ts',
        'vitest.config.ts',
        'playwright.config.ts',
        'tailwind.config.js',
        'postcss.config.js',
      ],
      parserOptions: { project: null },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'no-console': 'off',
        'import/no-extraneous-dependencies': 'off',
      },
    },
    
    // ===== Scripts =====
    {
      files: ['scripts/**/*.{js,ts}'],
      rules: {
        'no-console': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
  
  ignorePatterns: [
    // Build artifacts
    'node_modules/',
    'dist/',
    'build/',
    'coverage/',
    
    // Development artifacts
    '.next/',
    '.turbo/',
    '.vscode/',
    '.husky/',
    
    // Generated files
    '**/*.min.*',
    '**/*.d.ts',
    '.eslintcache',
    
    // Test results
    'test-results/',
    'e2e/playwright-report/',
    
    // Test files - exclude from production linting
    'vitest/',
    '**/*.test.*',
    '**/*.spec.*',
    'e2e/',
    'tests/',
    
    // Temporary files
    '*.tmp',
    '*.temp',
  ],
};
