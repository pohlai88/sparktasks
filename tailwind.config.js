/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🎨 SPARKTASKS BRAND PALETTE (Enterprise-grade color system)
        primary: {
          50: '#eff6ff',   // lightest tint
          100: '#dbeafe',  // light tint
          200: '#bfdbfe',  // medium-light tint
          300: '#93c5fd',  // medium tint
          400: '#60a5fa',  // medium-dark tint
          500: '#3b82f6',  // base primary (brand blue)
          600: '#2563eb',  // primary action (buttons, links)
          700: '#1d4ed8',  // primary hover
          800: '#1e40af',  // primary pressed
          900: '#1e3a8a',  // darkest shade
          950: '#172554',  // ultra dark
        },
        secondary: {
          50: '#f8fafc',   // lightest neutral
          100: '#f1f5f9',  // light neutral
          200: '#e2e8f0',  // medium-light neutral
          300: '#cbd5e1',  // medium neutral
          400: '#94a3b8',  // medium-dark neutral
          500: '#64748b',  // base secondary (slate)
          600: '#475569',  // secondary action
          700: '#334155',  // secondary hover
          800: '#1e293b',  // secondary pressed
          900: '#0f172a',  // darkest neutral
          950: '#020617',  // ultra dark neutral
        },
        // 🚀 ACCENT & SUCCESS COLORS (Semantic brand extension)
        accent: {
          50: '#f0f9ff',
          100: '#e0f2fe', 
          500: '#06b6d4',  // brand accent (cyan)
          600: '#0891b2',
          700: '#0e7490',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',  // brand success (green)
          600: '#16a34a',
          700: '#15803d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',  // brand warning (amber)
          600: '#d97706',
          700: '#b45309',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',  // brand error (red)
          600: '#dc2626',
          700: '#b91c1c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    require('tailwind-scrollbar')({ nocompatible: true }),
    require('tailwindcss-animate'),
  ],
}
