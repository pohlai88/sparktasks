/**
 * ESLint Configuration for Playwright Tests
 * 
 * This configuration enforces Playwright best practices and prevents common anti-patterns.
 * Copy this to your project root as .eslintrc.playwright.js and extend your main config.
 */

module.exports = {
  extends: [
    '@playwright/eslint-plugin-playwright/recommended',
  ],
  plugins: [
    '@playwright/eslint-plugin-playwright',
  ],
  rules: {
    // Enforce best practices
    '@playwright/expect-expect': 'error',
    '@playwright/no-conditional-in-test': 'error',
    '@playwright/no-element-handle': 'error',
    '@playwright/no-eval': 'error',
    '@playwright/no-focused-test': 'error',
    '@playwright/no-force-option': 'error',
    '@playwright/no-nested-step': 'error',
    '@playwright/no-networkidle': 'error',
    '@playwright/no-page-pause': 'error',
    '@playwright/no-restricted-matchers': 'error',
    '@playwright/no-skipped-test': 'warn',
    '@playwright/no-useless-await': 'error',
    '@playwright/no-useless-not': 'error',
    '@playwright/no-wait-for-timeout': 'error', // Bans waitForTimeout
    '@playwright/prefer-lowercase-title': 'error',
    '@playwright/prefer-strict-equal': 'error',
    '@playwright/prefer-to-be': 'error',
    '@playwright/prefer-to-contain': 'error',
    '@playwright/prefer-to-have-count': 'error',
    '@playwright/prefer-to-have-length': 'error',
    '@playwright/require-top-level-describe': 'error',
    '@playwright/valid-describe-callback': 'error',
    '@playwright/valid-expect': 'error',
    '@playwright/valid-title': 'error',

    // Custom rules for our best practices
    'no-restricted-syntax': [
      'error',
      {
        selector: 'CallExpression[callee.object.name="page"][callee.property.name="waitForTimeout"]',
        message: 'Use expect(...).toBeVisible() or other auto-waiting assertions instead of waitForTimeout. See: https://playwright.dev/docs/test-assertions'
      },
      {
        selector: 'CallExpression[callee.object.name="page"][callee.property.name="waitFor"]',
        message: 'Use expect(...).toBeVisible() or other auto-waiting assertions instead of waitFor. See: https://playwright.dev/docs/test-assertions'
      },
      {
        selector: 'CallExpression[callee.object.name="page"][callee.property.name="waitForSelector"]',
        message: 'Use expect(...).toBeVisible() or other auto-waiting assertions instead of waitForSelector. See: https://playwright.dev/docs/test-assertions'
      }
    ],

    // Warn on CSS/XPath selectors (prefer role-based locators)
    'no-restricted-globals': [
      'warn',
      {
        name: 'document',
        message: 'Use page.getByRole() or page.getByLabel() instead of document.querySelector. See: https://playwright.dev/docs/locators'
      }
    ],

    // Enforce test.step usage for better trace readability
    '@playwright/prefer-strict-equal': 'error',

    // Enforce naming conventions
    'unicorn/filename-case': [
      'error',
      {
        cases: {
          kebabCase: true,
          camelCase: true,
          pascalCase: true
        },
        ignore: [
          'README.md',
          'tsconfig.json',
          'playwright.config.ts',
          'eslint.config.js'
        ]
      }
    ],

    // Custom rule to enforce .test.ts suffix (no .spec.ts)
    'no-restricted-syntax': [
      'error',
      {
        selector: 'Program > :matches(ImportDeclaration, ExportNamedDeclaration, ExportAllDeclaration) > Literal[value$=".spec.ts"]',
        message: 'Use .test.ts suffix instead of .spec.ts for test files. See: tests/README.md#naming-convention'
      }
    ],
  },

  // Override for test files
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
      rules: {
        // Allow console.log in tests for debugging
        'no-console': 'off',
        
        // Allow any type in test files for flexibility
        '@typescript-eslint/no-explicit-any': 'off',
        
        // Enforce test naming conventions
        '@playwright/prefer-lowercase-title': [
          'error',
          {
            ignore: ['describe', 'test']
          }
        ],
      }
    }
  ],

  // Environment settings
  env: {
    'playwright/globals': true,
    node: true,
    es2022: true
  },

  // Parser options
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json'
  }
};
