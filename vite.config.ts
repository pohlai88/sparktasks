import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react({
      // Explicitly include files from all directories
      include: [
        '**/*.{js,jsx,ts,tsx}', // All JS/TS files anywhere
        'src/**/*.{js,jsx,ts,tsx}',
        'app/**/*.{js,jsx,ts,tsx}',
        'pages/**/*.{js,jsx,ts,tsx}',
        'components/**/*.{js,jsx,ts,tsx}'
      ],
      exclude: ['node_modules', 'dist']
    })
  ],
  resolve: {
    alias: {
      '@shared': resolve(__dirname, 'src/shared'),
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@stores': resolve(__dirname, 'src/stores'),
      // Add aliases for app and pages folders
      '@app': resolve(__dirname, 'app'),
      '@pages': resolve(__dirname, 'pages')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    emptyOutDir: true, // Clean dist/ to avoid stale files
    assetsDir: 'assets', // Corral static assets under one subfolder
    
    // 📦 Container Bundle Optimization
    rollupOptions: {
      output: {
        // 🎯 Strategic chunk splitting for container components
        manualChunks: {
          // React ecosystem - separate chunk for better caching
          'react-vendor': ['react', 'react-dom'],
          
          // Radix UI primitives - group by usage patterns
          'radix-interactive': [
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-dialog', 
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-context-menu',
            '@radix-ui/react-hover-card',
            '@radix-ui/react-popover'
          ],
          'radix-form': [
            '@radix-ui/react-checkbox',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-switch',
            '@radix-ui/react-select',
            '@radix-ui/react-slider'
          ],
          'radix-layout': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-tabs',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-separator',
            '@radix-ui/react-aspect-ratio'
          ],
          'radix-utilities': [
            '@radix-ui/react-slot',
            '@radix-ui/react-accessible-icon',
            '@radix-ui/react-visually-hidden',
            '@radix-ui/react-direction'
          ],
          
          // UI library chunks - split by component type
          'ui-containers': [
            './src/components/ui-enhanced/Accordion',
            './src/components/ui-enhanced/ScrollArea',
            './src/components/ui-enhanced/Tabs',
            './src/components/ui-enhanced/Collapsible'
          ],
          'ui-interactive': [
            './src/components/ui-enhanced/Button',
            './src/components/ui-enhanced/Dialog',
            './src/components/ui-enhanced/AlertDialog',
            './src/components/ui-enhanced/DropdownMenu'
          ],
          'ui-form': [
            './src/components/ui-enhanced/Input',
            './src/components/ui-enhanced/Checkbox',
            './src/components/ui-enhanced/RadioGroup',
            './src/components/ui-enhanced/Switch',
            './src/components/ui-enhanced/Select'
          ],
          
          // Utility libraries
          'utils': ['zustand', 'clsx', 'tailwind-merge'],
          'icons': ['lucide-react']
        },
        
        // 🏗️ Optimized chunk naming for better caching
        chunkFileNames: (chunkInfo) => {
          const name = chunkInfo.name
          
          // Container components get special naming
          if (name?.includes('containers')) {
            return 'containers/[name]-[hash].js'
          }
          if (name?.includes('radix')) {
            return 'primitives/[name]-[hash].js'
          }
          if (name?.includes('ui-')) {
            return 'components/[name]-[hash].js'
          }
          
          return 'chunks/[name]-[hash].js'
        },
        
        // 📏 Asset optimization
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || ''
          
          if (name.endsWith('.css')) {
            return 'styles/[name]-[hash].[ext]'
          }
          if (name.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) {
            return 'images/[name]-[hash].[ext]'  
          }
          if (name.match(/\.(woff|woff2|eot|ttf|otf)$/)) {
            return 'fonts/[name]-[hash].[ext]'
          }
          
          return 'assets/[name]-[hash].[ext]'
        }
      },
      
      // 🎯 External dependencies for better caching
      external: (_id) => {
        // Keep these external if using CDN strategy
        return false // Currently bundle everything for simplicity
      }
    },
    
    // 📊 Bundle size limits and warnings
    chunkSizeWarningLimit: 500, // Warn for chunks >500KB
    reportCompressedSize: true,
    
    // ⚡ Build performance optimization  
    minify: 'esbuild', // Faster than terser for dev builds
    target: 'es2020'
  },
  esbuild: {
    target: 'es2020',
    loader: 'tsx',
    include: [
      /src\/.*\.[tj]sx?$/
    ],
    // 🗜️ Production optimizations
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    legalComments: 'none'
  },
  server: {
    port: 3000,
    host: true, // Allow LAN access for mobile testing
    hmr: {
      host: 'localhost' // Fix HMR WebSocket connection issues
    },
    fs: {
      allow: ['..'] // Allow accessing parent directories
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
    include: [
      'react', 
      'react-dom', 
      'zustand', 
      'lucide-react',
      // 🎯 Pre-bundle Radix primitives for faster dev startup
      '@radix-ui/react-slot',
      '@radix-ui/react-accessible-icon',
      '@radix-ui/react-visually-hidden'
    ],
    // 🚫 Exclude container components from pre-bundling for better tree-shaking
    exclude: ['@/components/ui-enhanced']
  }
})
