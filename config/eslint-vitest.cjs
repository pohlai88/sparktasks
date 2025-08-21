/**
 * @fileoverview Vitest ESLint Configuration
 * Pure Vitest environment without Jest contamination
 */

module.exports = {
  env: { jest: false },
  globals: {
    vi: 'readonly',
    expect: 'readonly',
    describe: 'readonly',
    it: 'readonly',
    test: 'readonly',
    beforeEach: 'readonly',
    afterEach: 'readonly',
    beforeAll: 'readonly',
    afterAll: 'readonly',
  },
  rules: {
    'no-restricted-globals': [
      'error',
      { name: 'jest', message: 'Do not use Jest APIs; use `vi` from Vitest.' },
    ],
  },
};
