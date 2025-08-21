import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname, '..'),
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    restoreMocks: true,
    clearMocks: true,
    mockReset: true,
    css: true,
    testTimeout: 10000,
    include: [
      'src/**/*.test.{ts,tsx}',
      'test/**/*.test.{ts,tsx,js}',
      'test/unit/**/*.test.{ts,tsx}',
      'test/components/**/*.test.{ts,tsx}',
      'test/integration/**/*.test.{ts,tsx}'
    ],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/test/e2e/**',
      '**/e2e/**'
    ],
    
    // Enhanced test isolation
    isolate: true,
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        useAtomics: true
      }
    },
    
    // Reporter configuration for enterprise testing
    reporters: ['verbose', 'junit', 'html'],
    outputFile: {
      junit: './test-results/junit.xml',
      html: './test-results/index.html'
    },
    
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html', 'clover'],
      reportsDirectory: './coverage',
      thresholds: {
        statements: 90,
        branches: 80,
        functions: 85,
        lines: 90
      },
      exclude: [
        'test/**',
        '**/*.test.{ts,tsx,js}',
        '**/*.config.{ts,js}',
        '**/dist/**',
        '**/e2e/**',
        '**/examples/**',
        '**/scripts/**',
        '**/tools/**'
      ],
      include: [
        'src/**/*.{ts,tsx}'
      ]
    },
    
    // Performance and reliability settings
    retry: 2,
    bail: 0,
    maxConcurrency: 5
  },
  resolve: {
    alias: {
      '@shared': resolve(process.cwd(), 'src/shared'),
      '@': resolve(process.cwd(), 'src'),
      '@components': resolve(process.cwd(), 'src/components'),
      '@utils': resolve(process.cwd(), 'src/utils'),
      '@stores': resolve(process.cwd(), 'src/stores'),
      'test': resolve(process.cwd(), 'test')
    }
  }
})
