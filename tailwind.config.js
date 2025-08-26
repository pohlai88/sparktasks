/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // Enable dark mode support
  theme: {
    extend: {
      // 🌙 MAPS v2.2 Enhanced Dark-First Foundation with WCAG AAA Compliance
      colors: {
        // CSS Custom Properties Integration
        background: {
          DEFAULT: 'rgb(var(--background) / <alpha-value>)',
          elevated: 'rgb(var(--background-elevated) / <alpha-value>)',
          panel: 'rgb(var(--background-panel) / <alpha-value>)',
          overlay: 'rgb(var(--background-overlay) / <alpha-value>)',
        },

        foreground: {
          DEFAULT: 'rgb(var(--foreground) / <alpha-value>)',
          muted: 'rgb(var(--foreground-muted) / <alpha-value>)',
          subtle: 'rgb(var(--foreground-subtle) / <alpha-value>)',
          disabled: 'rgb(var(--foreground-disabled) / <alpha-value>)',
        },

        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
          'foreground-muted': 'rgb(var(--accent-foreground-muted) / <alpha-value>)',
          hover: 'rgb(var(--accent-hover) / <alpha-value>)',
          pressed: 'rgb(var(--accent-pressed) / <alpha-value>)',
          secondary: 'rgb(var(--accent-secondary) / <alpha-value>)',
          'secondary-foreground': 'rgb(var(--accent-secondary-foreground) / <alpha-value>)',
          'secondary-hover': 'rgb(var(--accent-secondary-hover) / <alpha-value>)',
          'solid-aaa': 'rgb(var(--accent-solid-aaa) / <alpha-value>)',
        },

        border: {
          DEFAULT: 'rgb(var(--border) / <alpha-value>)',
          strong: 'rgb(var(--border-strong) / <alpha-value>)',
          subtle: 'rgb(var(--border-subtle) / <alpha-value>)',
          accent: 'rgb(var(--border-accent) / <alpha-value>)',
        },

        // Enhanced semantic colors
        success: {
          DEFAULT: 'rgb(var(--success) / <alpha-value>)',
          foreground: 'rgb(var(--success-foreground) / <alpha-value>)',
          'solid-aaa': 'rgb(var(--success-solid-aaa) / <alpha-value>)',
        },
        warning: {
          DEFAULT: 'rgb(var(--warning) / <alpha-value>)',
          foreground: 'rgb(var(--warning-foreground) / <alpha-value>)',
        },
        error: {
          DEFAULT: 'rgb(var(--error) / <alpha-value>)',
          foreground: 'rgb(var(--error-foreground) / <alpha-value>)',
          'solid-aaa': 'rgb(var(--error-solid-aaa) / <alpha-value>)',
        },

        // Card and surface colors
        card: {
          DEFAULT: 'rgb(var(--card) / <alpha-value>)',
          elevated: 'rgb(var(--card-elevated) / <alpha-value>)',
          foreground: 'rgb(var(--card-foreground) / <alpha-value>)',
        },

        // Input colors
        input: {
          DEFAULT: 'rgb(var(--input) / <alpha-value>)',
          border: 'rgb(var(--input-border) / <alpha-value>)',
          foreground: 'rgb(var(--input-foreground) / <alpha-value>)',
          placeholder: 'rgb(var(--input-placeholder) / <alpha-value>)',
        },

        // Muted colors
        muted: {
          DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
          foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
        },

        // Primary brand colors
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
          hover: 'rgb(var(--primary-hover) / <alpha-value>)',
        },

        // Secondary brand colors
        secondary: {
          DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
          foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)',
          hover: 'rgb(var(--secondary-hover) / <alpha-value>)',
        },

        // Destructive colors
        destructive: {
          DEFAULT: 'rgb(var(--destructive) / <alpha-value>)',
          foreground: 'rgb(var(--destructive-foreground) / <alpha-value>)',
        },

        // Ring colors for focus
        ring: {
          DEFAULT: 'rgb(var(--ring) / <alpha-value>)',
          offset: 'rgb(var(--ring-offset) / <alpha-value>)',
        },
      },

      // ✅ Wire Tailwind's actual ring + outline system to your tokens
      ringColor: {
        DEFAULT: 'rgb(var(--ring) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        error: 'rgb(var(--error) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
      },
      ringOffsetColor: {
        DEFAULT: 'rgb(var(--ring-offset) / <alpha-value>)',
        background: 'rgb(var(--background) / <alpha-value>)',
      },
      ringWidth: {
        DEFAULT: '2px', // AAA-friendly default (standardized)
        0: '0px',
        1: '1px',
        2: '2px',
        3: '3px',
        4: '4px',
      },
      ringOffsetWidth: {
        DEFAULT: '2px',
        0: '0px',
        1: '1px',
        2: '2px',
        3: '3px',
        4: '4px',
      },
      outlineColor: {
        DEFAULT: 'rgb(var(--ring) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        error: 'rgb(var(--error) / <alpha-value>)',
      },
      outlineOffset: {
        0: '0px',
        1: '1px',
        2: '2px',
        3: '3px',
        4: '4px',
      },

      // ✍ Apple-inspired Typography (matches MAPS v2.2)
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },

      // ✅ SaaS-friendly container defaults
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1rem',
          md: '2rem',
          lg: '2rem',
          xl: '3rem',
          '2xl': '4rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1400px',
        },
      },

      // 📏 8pt Grid Spacing (MAPS v2.2 systematic spacing)
      spacing: {
        '1.5': '0.375rem', // 6px
        '2.5': '0.625rem', // 10px
        '3.5': '0.875rem', // 14px
        '4.5': '1.125rem', // 18px
        '5.5': '1.375rem', // 22px
        '6.5': '1.625rem', // 26px
        '7.5': '1.875rem', // 30px
        18: '4.5rem',      // 72px
        88: '22rem',       // 352px
      },

      // ☁ Enhanced Apple-inspired Elevations with CSS Custom Properties
      boxShadow: {
        'elevation-low': 'var(--shadow-elevation-low)',
        'elevation-medium': 'var(--shadow-elevation-medium)',
        'elevation-high': 'var(--shadow-elevation-high)',
        'glass': 'var(--shadow-glass)',

        // Legacy shadows for compatibility
        'elevation-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.2)',
        'elevation-md': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
        'elevation-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
        'elevation-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',

        // Apple vibrancy effects
        'glow-accent': '0 0 20px rgb(var(--accent) / 0.3)',
        'glow-secondary': '0 0 20px rgb(var(--accent-secondary) / 0.3)',
      },

      // 🔄 Apple-style border radius
      borderRadius: {
        'xs': '0.125rem',  // 2px
        'sm': '0.25rem',   // 4px
        'md': '0.375rem',  // 6px
        'lg': '0.5rem',    // 8px
        'xl': '0.75rem',   // 12px
        '2xl': '1rem',     // 16px
        '3xl': '1.5rem',   // 24px
        'full': '9999px',
      },

      // 🌊 Backdrop blur for vibrancy & liquid glass
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '40px',
        // Liquid glass material system
        'glass-sm': '6px',
        'glass': '12px',
        'glass-lg': '18px',
      },

      // 🪟 Liquid glass backdrop effects
      backdropSaturate: {
        'glass': '135%',
      },

      // 📱 Apple-style animations
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-out',
      },

      // 🌈 Z-Index Orchestrator - Fortune-500 tokenic layers
      zIndex: {
        surface: '0',
        overlay: '100',
        popover: '1100',    // Popover below modal (contextual only)
        modal: '1300',      // Modal above popover (blocking interactions)
        toast: '1400',      // Toast above modal (system notifications)
        tooltip: '1500',    // Tooltip highest (informational overlay)
      },

      // 🎭 Motion Presets - Exact tokenic durations and easings
      transitionDuration: {
        0: '0ms',
        100: '100ms',
        120: '120ms',
        160: '160ms',
        180: '180ms',
        200: '200ms',
        220: '220ms',
        600: '600ms',
      },
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.2, 0, 0.2, 1)',
        entrance: 'cubic-bezier(0, 0, 0.2, 1)',
        exit: 'cubic-bezier(0.4, 0, 1, 1)',
        spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-4px)' },
          '60%': { transform: 'translateY(-2px)' },
        },
      },
    },
  },

  // ✅ Keep token-driven dynamic classes from being purged
  safelist: [
    { pattern: /(bg|text|border|ring)-(background|foreground|muted|primary|secondary|accent|success|warning|error|card|destructive)(?:-[a-z]+)?/ },
    { pattern: /ring-(accent|error|success|warning)/ },
    { pattern: /outline-(accent|error|success|warning)/ },
    { pattern: /shadow-(elevation|glass|glow)/ },
    { pattern: /backdrop-blur-(xs|sm|md|lg|xl|2xl|3xl|glass|glass-sm|glass-lg)/ },
    { pattern: /backdrop-saturate-glass/ },
    { pattern: /z-(surface|overlay|popover|modal|toast|tooltip)/ },  // Z-Index Orchestrator tokens
    { pattern: /duration-(0|100|120|160|180|200|220|600)/ },  // Motion duration tokens
    { pattern: /ease-(standard|entrance|exit|spring)/ },  // Motion easing tokens
    // Liquid glass utilities
    'glass',
    'glass-sm',
    'glass-lg',
    'scrim',
    'no-transparency',
    // Focus variants
    'focus-visible:ring',
    'focus-visible:ring-accent',
    'focus-visible:ring-error',
    'focus-visible:ring-success',
    'focus-visible:ring-warning',
    'focus-visible:outline-accent',
    'focus-visible:outline-error',
    'focus-visible:outline-success',
    'focus-visible:outline-warning',
  ],

  plugins: [
    // Enhanced interaction variants for Apple-calm touch/pointer behavior
    function({ addVariant }) {
      // Pointer devices (mouse/trackpad): combine with :hover safely
      addVariant('pointer', '@media (hover: hover) and (pointer: fine)');

      // Coarse pointers (touch-first): great for :active-only behaviors
      addVariant('coarse', '@media (hover: none) and (pointer: coarse)');

      // Data attribute variants for testing and conditional styling
      addVariant('aaa', '&[data-aaa="true"]');
      addVariant('no-transparency', '.no-transparency &');
      addVariant('supports-backdrop', '@supports (backdrop-filter: blur(0))');
    },
  ],
};
