import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': resolve(__dirname, 'src/shared'),
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@stores': resolve(__dirname, 'src/stores')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    emptyOutDir: true, // Clean dist/ to avoid stale files
    assetsDir: 'assets' // Corral static assets under one subfolder
  },
  esbuild: {
    target: 'es2020',
    loader: 'tsx',
    include: [
      /src\/.*\.[tj]sx?$/
    ]
  },
  server: {
    port: 3000,
    host: true, // Allow LAN access for mobile testing
    hmr: { 
      host: '0.0.0.0' // Prevent HMR issues over LAN
    }
  },
  preview: {
    port: 4173,
    host: true // Production build preview with LAN access
    // Future: Add proxy config for prod-like API calls
    // proxy: {
    //   '/api': {
    //     target: 'https://api.sparktasks.com',
    //     changeOrigin: true
    //   }
    // }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'zustand', 'lucide-react'] // Faster dev server cold starts
  }
})
