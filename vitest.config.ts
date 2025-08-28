/**
 * Vitest Configuration - Fortune-500 Grade Testing Infrastructure
 *
 * Features:
 * - 100% coverage enforcement for production code
 * - Accessibility testing with jest-axe
 * - Console noise detection (fail on console.error/warn)
 * - Reduced motion support for animation tests
 * - Performance benchmarking
 * - Type-safe testing with strict TypeScript
 * - MSW integration for API components (opt-in)
 * - Enterprise-grade reporting and monitoring
 */

import path from 'node:path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [
      './tests/setup/test-setup.ts',
    ],
    restoreMocks: true,
    clearMocks: true,
    mockReset: true,
    css: true,
    testTimeout: 5000,  // Reduced for faster feedback

    // Fortune-500 Test Discovery
    include: [
      'tests/unit/**/*.{test,spec}.{ts,tsx}',
      'tests/components/**/*.{test,spec}.{ts,tsx}',
      'tests/integration/**/*.{test,spec}.{ts,tsx}'
    ],
          exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/coverage/**',
        '**/tests/e2e/**',
        '**/.{idea,git,cache,output,temp}/**',
        '**/stories/**',
        '**/tokens/**',
        '**/vitest/**'
      ],

    // Enterprise Test Isolation
    isolate: true,
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        useAtomics: true
      }
    },

    // Enterprise Reporting
    reporters: ['verbose', 'junit', 'html'],
    outputFile: {
      junit: './test-results/vitest-junit.xml',
      html: './test-results/vitest-report.html'
    },

    // Fortune-500 Coverage Requirements
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html', 'clover', 'json'],
      reportsDirectory: './coverage',

      // 100% Coverage Requirements
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
        // Per-folder thresholds
        'src/components': {
          statements: 100,
          branches: 100,
          functions: 100,
          lines: 100
        },
        'src/utils': {
          statements: 100,
          branches: 100,
          functions: 100,
          lines: 100
        },
        'src/lib': {
          statements: 100,
          branches: 100,
          functions: 100,
          lines: 100
        }
      },

      // Coverage Inclusion/Exclusion
      exclude: [
        'vitest/**',
        '**/*.test.{ts,tsx}',
        '**/*.config.{ts,js}',
        '**/dist/**',
        '**/e2e/**',
        '**/scripts/**',
        '**/tools/**',
        '**/stories/**',
        '**/tokens/**',
        '**/coverage/**',
        '**/*.stories.{ts,tsx}',
        '**/index.ts' // Export files
      ],
      include: [
        'src/components/**/*.{ts,tsx}',
        'src/utils/**/*.{ts,tsx}',
        'src/lib/**/*.{ts,tsx}',
        'src/hooks/**/*.{ts,tsx}',
        'src/stores/**/*.{ts,tsx}'
      ]
    },

    // Enterprise Performance & Reliability
    retry: 1,
    bail: 0,
    maxConcurrency: 5,
    slowTestThreshold: 800  // Surface accidental waits
  },

  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      "@/components": path.resolve(import.meta.dirname, "./src/components"),
      "@/design": path.resolve(import.meta.dirname, "./src/design"),
      "@/utils": path.resolve(import.meta.dirname, "./src/utils"),
      "@/": path.resolve(import.meta.dirname, "./src/")
    }
  },
})
