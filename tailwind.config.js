/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    // Exclude node_modules and test files for better performance
    '!./src/**/*.{test,spec}.{js,ts,jsx,tsx}',
    '!./node_modules/**/*',
  ],
  darkMode: 'class', // Enable dark mode support - MAPS4 Cosmic System
  theme: {
    extend: {
      // Named transforms to eliminate bracketed utilities in components
      scale: {
        98: '0.98', // replacement for scale-[0.98]
      },
      // 🌌 MAPS4 Deep Space Canvas Cosmic Innovation with WCAG AAA Compliance
      colors: {
        // CSS Custom Properties Integration - MAPS4 Cosmic System (COMPLETE)
        background: {
          DEFAULT: 'rgb(var(--deep-space) / <alpha-value>)',
          elevated: 'rgb(var(--cosmic-void) / <alpha-value>)',
          panel: 'rgb(var(--stellar-surface) / <alpha-value>)',
          overlay: 'rgb(var(--cosmic-overlay) / <alpha-value>)',
        },

        foreground: {
          DEFAULT: 'rgb(var(--cosmic-light) / <alpha-value>)',
          muted: 'rgb(var(--stellar-muted) / <alpha-value>)',
          subtle: 'rgb(var(--cosmic-subtle) / <alpha-value>)',
          disabled: 'rgb(var(--cosmic-disabled) / <alpha-value>)',
        },

        // MAPS4 Cosmic Accent System (COMPLETE)
        accent: {
          DEFAULT: 'rgb(var(--aurora-accent) / <alpha-value>)',
          foreground: 'rgb(var(--cosmic-dark) / <alpha-value>)',
          'foreground-muted': 'rgb(var(--cosmic-accent-muted) / <alpha-value>)',
          hover: 'rgb(var(--cosmic-primary-hover) / <alpha-value>)',
          pressed: 'rgb(var(--cosmic-accent-pressed) / <alpha-value>)',
          secondary: 'rgb(var(--cosmic-cyan) / <alpha-value>)',
          'secondary-foreground': 'rgb(var(--cosmic-dark) / <alpha-value>)',
          'secondary-hover': 'rgb(var(--cosmic-secondary-hover) / <alpha-value>)',
          'solid-aaa': 'rgb(var(--cosmic-accent-solid) / <alpha-value>)',
        },

        border: {
          DEFAULT: 'rgb(var(--cosmic-border) / <alpha-value>)',
          strong: 'rgb(var(--cosmic-border-strong) / <alpha-value>)',
          subtle: 'rgb(var(--cosmic-border-subtle) / <alpha-value>)',
          accent: 'rgb(var(--aurora-accent) / <alpha-value>)',
        },

        // MAPS4 Enhanced semantic colors (COMPLETE)
        success: {
          DEFAULT: 'rgb(var(--cosmic-success) / <alpha-value>)',
          foreground: 'rgb(var(--cosmic-dark) / <alpha-value>)',
          'solid-aaa': 'rgb(var(--cosmic-success-solid) / <alpha-value>)',
        },
        warning: {
          DEFAULT: 'rgb(var(--cosmic-warning) / <alpha-value>)',
          foreground: 'rgb(var(--cosmic-dark) / <alpha-value>)',
        },
        error: {
          DEFAULT: 'rgb(var(--cosmic-danger) / <alpha-value>)',
          foreground: 'rgb(var(--cosmic-dark) / <alpha-value>)',
          'solid-aaa': 'rgb(var(--cosmic-danger-solid) / <alpha-value>)',
        },

        // Card and surface colors (COMPLETE)
        card: {
          DEFAULT: 'rgb(var(--stellar-surface) / <alpha-value>)',
          elevated: 'rgb(var(--cosmic-void) / <alpha-value>)',
          foreground: 'rgb(var(--cosmic-light) / <alpha-value>)',
        },

        // Input colors (COMPLETE MAPS4)
        input: {
          DEFAULT: 'rgb(var(--cosmic-input) / <alpha-value>)',
          border: 'rgb(var(--cosmic-input-border) / <alpha-value>)',
          foreground: 'rgb(var(--cosmic-light) / <alpha-value>)',
          placeholder: 'rgb(var(--cosmic-input-placeholder) / <alpha-value>)',
        },

        // Muted colors (COMPLETE MAPS4)
        muted: {
          DEFAULT: 'rgb(var(--cosmic-muted) / <alpha-value>)',
          foreground: 'rgb(var(--stellar-muted) / <alpha-value>)',
        },

        // MAPS4 Primary brand colors (Aurora Accent) - COMPLETE
        primary: {
          DEFAULT: 'rgb(var(--aurora-accent) / <alpha-value>)',
          foreground: 'rgb(var(--cosmic-dark) / <alpha-value>)',
          hover: 'rgb(var(--cosmic-primary-hover) / <alpha-value>)',
        },

        // MAPS4 Secondary brand colors (Cosmic Cyan) - COMPLETE
        secondary: {
          DEFAULT: 'rgb(var(--cosmic-cyan) / <alpha-value>)',
          foreground: 'rgb(var(--cosmic-dark) / <alpha-value>)',
          hover: 'rgb(var(--cosmic-secondary-hover) / <alpha-value>)',
        },

        // Destructive colors (COMPLETE MAPS4)
        destructive: {
          DEFAULT: 'rgb(var(--cosmic-danger) / <alpha-value>)',
          foreground: 'rgb(var(--cosmic-dark) / <alpha-value>)',
        },

        // Ring colors for focus (COMPLETE MAPS4)
        ring: {
          DEFAULT: 'rgb(var(--aurora-accent) / <alpha-value>)',
          offset: 'rgb(var(--cosmic-ring-offset) / <alpha-value>)',
        },

        // MAPS4 Cosmic Color System - Direct Access (COMPLETE)
        'aurora-accent': 'rgb(var(--aurora-accent) / <alpha-value>)',
        'cosmic-cyan': 'rgb(var(--cosmic-cyan) / <alpha-value>)',
        'cosmic-primary': 'rgb(var(--cosmic-primary) / <alpha-value>)',
        'cosmic-primary-hover': 'rgb(var(--cosmic-primary-hover) / <alpha-value>)',
        'cosmic-secondary': 'rgb(var(--cosmic-secondary) / <alpha-value>)',
        'cosmic-secondary-hover': 'rgb(var(--cosmic-secondary-hover) / <alpha-value>)',
        'deep-space': 'rgb(var(--deep-space) / <alpha-value>)',
        'cosmic-void': 'rgb(var(--cosmic-void) / <alpha-value>)',
        'stellar-surface': 'rgb(var(--stellar-surface) / <alpha-value>)',
        'nebula-accent': 'rgb(var(--nebula-accent) / <alpha-value>)',
        'cosmic-light': 'rgb(var(--cosmic-light) / <alpha-value>)',
        'stellar-muted': 'rgb(var(--stellar-muted) / <alpha-value>)',
        'cosmic-success': 'rgb(var(--cosmic-success) / <alpha-value>)',
        'cosmic-warning': 'rgb(var(--cosmic-warning) / <alpha-value>)',
        'cosmic-danger': 'rgb(var(--cosmic-danger) / <alpha-value>)',
        'cosmic-info': 'rgb(var(--cosmic-info) / <alpha-value>)',
        'cosmic-dark': 'rgb(var(--cosmic-dark) / <alpha-value>)',
        // Additional MAPS4 Cosmic System Variables
        'cosmic-overlay': 'rgb(var(--cosmic-overlay) / <alpha-value>)',
        'cosmic-subtle': 'rgb(var(--cosmic-subtle) / <alpha-value>)',
        'cosmic-disabled': 'rgb(var(--cosmic-disabled) / <alpha-value>)',
        'cosmic-accent-muted': 'rgb(var(--cosmic-accent-muted) / <alpha-value>)',
        'cosmic-accent-pressed': 'rgb(var(--cosmic-accent-pressed) / <alpha-value>)',
        'cosmic-accent-solid': 'rgb(var(--cosmic-accent-solid) / <alpha-value>)',
        'cosmic-border': 'rgb(var(--cosmic-border) / <alpha-value>)',
        'cosmic-border-strong': 'rgb(var(--cosmic-border-strong) / <alpha-value>)',
        'cosmic-border-subtle': 'rgb(var(--cosmic-border-subtle) / <alpha-value>)',
        'cosmic-success-solid': 'rgb(var(--cosmic-success-solid) / <alpha-value>)',
        'cosmic-danger-solid': 'rgb(var(--cosmic-danger-solid) / <alpha-value>)',
        'cosmic-input': 'rgb(var(--cosmic-input) / <alpha-value>)',
        'cosmic-input-border': 'rgb(var(--cosmic-input-border) / <alpha-value>)',
        'cosmic-input-placeholder': 'rgb(var(--cosmic-input-placeholder) / <alpha-value>)',
        'cosmic-muted': 'rgb(var(--cosmic-muted) / <alpha-value>)',
        'cosmic-ring-offset': 'rgb(var(--cosmic-ring-offset) / <alpha-value>)',
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
        'glow-accent': '0 0 20px rgb(var(--aurora-accent) / 0.3)',
        'glow-secondary': '0 0 20px rgb(var(--cosmic-cyan) / 0.3)',
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

  // ✅ Keep token-driven dynamic classes from being purged - MAPS4 Cosmic System
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
    // MAPS4 Cosmic Color System - Direct Access (COMPLETE)
    { pattern: /(bg|text|border|ring)-(aurora-accent|cosmic-cyan|cosmic-primary|cosmic-primary-hover|cosmic-secondary|cosmic-secondary-hover|deep-space|cosmic-void|stellar-surface|nebula-accent|cosmic-light|stellar-muted|cosmic-success|cosmic-warning|cosmic-danger|cosmic-info|cosmic-dark|cosmic-overlay|cosmic-subtle|cosmic-disabled|cosmic-accent-muted|cosmic-accent-pressed|cosmic-accent-solid|cosmic-border|cosmic-border-strong|cosmic-border-subtle|cosmic-success-solid|cosmic-danger-solid|cosmic-input|cosmic-input-border|cosmic-input-placeholder|cosmic-muted|cosmic-ring-offset)/ },
    
    // 🚀 COMPREHENSIVE TOKEN COVERAGE - All critical utilities
    // Transform patterns
    { pattern: /(scale|rotate|translate|skew)-(0|50|75|90|95|100|105|110|125|150|200|1|2|3|6|12|45|90|180|270|360|1\/2|1\/3|2\/3|1\/4|3\/4|full|px|0\.5|1\.5|2\.5|3\.5|auto|none)/ },
    { pattern: /(scale|rotate|translate|skew)-(x|y)-(0|50|75|90|95|100|105|110|125|150|200|1|2|3|6|12|45|90|180|270|360|1\/2|1\/3|2\/3|1\/4|3\/4|full|px|0\.5|1\.5|2\.5|3\.5|auto|none)/ },
    // Ensure named active scale cannot be purged
    { pattern: /(hover:|active:|focus:)?scale-(95|98|100|105)/ },
    
    // Filter patterns
    { pattern: /(blur|brightness|contrast|grayscale|hue-rotate|invert|saturate|sepia)-(none|sm|md|lg|xl|2xl|3xl|0|50|75|90|95|100|105|110|125|150|200|15|30|60|90|180)/ },
    { pattern: /drop-shadow-(none|sm|md|lg|xl|2xl)/ },
    
    // Animation patterns
    { pattern: /animate-(none|spin|ping|pulse|bounce|fade-in|slide-up|scale-in|bounce-gentle)/ },
    { pattern: /(duration|delay)-(0|75|100|120|150|160|180|200|220|300|500|600|700|1000)/ },
    { pattern: /ease-(linear|in|out|in-out|standard|entrance|exit|spring)/ },
    
    // Positioning patterns
    { pattern: /(top|right|bottom|left|inset)-(0|auto|1|2|3|4|5|6|8|10|12|16|20|24|32|40|48|56|64|1\/2|1\/3|2\/3|1\/4|3\/4|full|px|0\.5|1\.5|2\.5|3\.5)/ },
    { pattern: /-(top|right|bottom|left|inset)-(1|2|3|4|5|6|8|10|12|16|20|24|32|40|48|56|64|1\/2|1\/3|2\/3|1\/4|3\/4|full)/ },
    

    
    // Comprehensive fractional sizing
    { pattern: /(w|h)-(1\/2|1\/3|2\/3|1\/4|2\/4|3\/4|1\/5|2\/5|3\/5|4\/5|1\/6|2\/6|3\/6|4\/6|5\/6|1\/12|2\/12|3\/12|4\/12|5\/12|6\/12|7\/12|8\/12|9\/12|10\/12|11\/12)$/ },
    
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
