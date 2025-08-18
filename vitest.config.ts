import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts', './test/setup.jsdom.ts', './test/master-crypto-setup.ts'],
    testTimeout: 5000,
    include: [
      'src/**/*.test.{ts,tsx}',
      'test/**/*.test.{ts,js}'
    ],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/test/e2e/**'
    ],
    
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      thresholds: {
        statements: 90,
        branches: 80,
        functions: 85,
        lines: 90
      },
      exclude: [
        'test/**',
        '**/*.test.{ts,js}',
        '**/*.config.{ts,js}',
        '**/dist/**'
      ]
    }
  },
  resolve: {
    alias: {
      '@shared': resolve(process.cwd(), 'src/shared'),
      '@': resolve(process.cwd(), 'src'),
      '@components': resolve(process.cwd(), 'src/components'),
      '@utils': resolve(process.cwd(), 'src/utils'),
      '@stores': resolve(process.cwd(), 'src/stores')
    }
  }
})
