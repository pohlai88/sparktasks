/**
 * 🎨 ENHANCED DESIGN TOKENS - Constitutional Foundation
 * 
 * MAPS4 Deep Space Canvas Cosmic Innovation - Enhanced Design Tokens
 * Constitutional Structure: Maximum 2-level nesting for TypeScript compatibility
 * Governance: TOKEN_GOVERNANCE_SSOT.md compliance
 * 
 * ARCHITECTURE PRINCIPLES:
 * - ✅ 2-level nesting maximum (foundation.motionComponents)
 * - ✅ Semantic grouping by purpose (motion, color, layout, typography)
 * - ✅ TypeScript-friendly structure
 * - ✅ SSOT compliance with zero drift tolerance
 * - ✅ Scalable architecture for unlimited expansion
 * 
 * VERSION: 4.0.0
 * LAST UPDATED: 2025-01-27
 * GOVERNANCE: TOKEN_GOVERNANCE_SSOT.md
 */

import { z } from 'zod';

// ============================================================================
// CONSTITUTIONAL TOKEN STRUCTURE - Maximum 2 levels
// ============================================================================

export const ENHANCED_DESIGN_TOKENS = {
  // ============================================================================
  // FOUNDATION LAYER - Core design tokens
  // ============================================================================
  foundation: {
    // ============================================================================
    // MOTION TOKENS - Animation and transition patterns
    // ============================================================================
    
    // Component-specific motion presets
    motionComponents: {
      // Button interactions
      buttonHover: 'transition-all duration-200 ease-out',
      buttonActive: 'transition-all duration-150 ease-in',
      buttonFocus: 'transition-all duration-100 ease-out',
      
      // Card interactions
      cardHover: 'transition-all duration-300 ease-out',
      cardActive: 'transition-all duration-200 ease-in',
      cardFocus: 'transition-all duration-150 ease-out',
      
      // Badge interactions
      badgeHover: 'transition-all duration-200 ease-out',
      badgeActive: 'transition-all duration-150 ease-in',
      badgeFocus: 'transition-all duration-100 ease-out',
      
      // Form interactions
      inputFocus: 'transition-all duration-200 ease-out',
      inputBlur: 'transition-all duration-300 ease-in',
      inputError: 'transition-all duration-150 ease-out',
      formFieldFocus: 'transition-colors duration-200 ease-out',
      formFieldBlur: 'transition-colors duration-300 ease-in',
      formFieldError: 'transition-all duration-150 ease-out',
      
      // Navigation interactions
      navHover: 'transition-colors duration-200 ease-out',
      navActive: 'transition-colors duration-150 ease-in',
      navFocus: 'transition-colors duration-100 ease-out',
      menuHover: 'transition-all duration-200 ease-out',
      menuActive: 'transition-all duration-150 ease-in',
      menuFocus: 'transition-all duration-100 ease-out',
      
      // Modal interactions
      modalEnter: 'transition-all duration-300 ease-out',
      modalExit: 'transition-all duration-250 ease-in',
      modalOverlay: 'transition-opacity duration-200 ease-out',
      
      // Calendar interactions
      calendarHover: 'transition-all duration-200 ease-out',
      calendarActive: 'transition-all duration-150 ease-in',
      calendarFocus: 'transition-all duration-100 ease-out',
      
      // Tooltip interactions
      tooltipHover: 'transition-opacity duration-150 ease-out',
      tooltipShow: 'transition-opacity duration-200 ease-out',
      tooltipHide: 'transition-opacity duration-150 ease-in',
      
      // Dropdown interactions
      dropdownHover: 'transition-transform duration-200 ease-out',
      dropdownShow: 'transition-transform duration-250 ease-out',
      dropdownHide: 'transition-transform duration-200 ease-in',
      
      // Accordion interactions
      accordionHover: 'transition-colors duration-200 ease-out',
      accordionExpand: 'transition-all duration-300 ease-out',
      accordionCollapse: 'transition-all duration-250 ease-in',
    },

    // Legacy Tailwind-compatible patterns
    motionLegacy: {
      // Common transition patterns
      'transition-all-200': 'transition-all duration-200 ease-out',
      'transition-all-300': 'transition-all duration-300 ease-out',
      'transition-colors-200': 'transition-colors duration-200',
      'transition-colors-150': 'transition-colors duration-150',
      'transition-opacity-200': 'transition-opacity duration-200',
      'transition-transform-200': 'transition-transform duration-200 ease-out',
      'transition-transform-300': 'transition-transform duration-300 ease-out',
      
      // Duration presets
      'duration-75': 'duration-75',
      'duration-100': 'duration-100',
      'duration-150': 'duration-150',
      'duration-200': 'duration-200',
      'duration-250': 'duration-250',
      'duration-300': 'duration-300',
      'duration-350': 'duration-350',
      'duration-400': 'duration-400',
      'duration-500': 'duration-500',
      'duration-600': 'duration-600',
      'duration-700': 'duration-700',
      
      // Easing presets
      'ease-linear': 'ease-linear',
      'ease-in': 'ease-in',
      'ease-out': 'ease-out',
      'ease-in-out': 'ease-in-out',
      
      // Motion reduction tokens
      'motion-reduce-none': 'motion-reduce:transition-none motion-reduce:animate-none',
      'motion-reduce-slow': 'motion-reduce:duration-1000 motion-reduce:ease-linear',
      'motion-reduce-minimal': 'motion-reduce:duration-500 motion-reduce:ease-out',
      'motion-reduce-duration-0': 'motion-reduce:duration-0',
      'motion-reduce-animate-none': 'motion-reduce:animate-none',
    },

    // Semantic motion patterns
    motionPatterns: {
      // Fast interactions (150-200ms)
      fadeInFast: 'transition-opacity duration-150 ease-out',
      fadeOutFast: 'transition-opacity duration-150 ease-in',
      slideInFast: 'transition-transform duration-200 ease-out',
      slideOutFast: 'transition-transform duration-200 ease-in',
      scaleInFast: 'transition-transform duration-200 ease-out',
      scaleOutFast: 'transition-transform duration-200 ease-in',
      
      // Standard interactions (200-300ms)
      fadeInStandard: 'transition-opacity duration-200 ease-out',
      fadeOutStandard: 'transition-opacity duration-200 ease-in',
      slideInStandard: 'transition-transform duration-250 ease-out',
      slideOutStandard: 'transition-transform duration-250 ease-in',
      scaleInStandard: 'transition-transform duration-250 ease-out',
      scaleOutStandard: 'transition-transform duration-250 ease-in',
      
      // Smooth interactions (300-500ms)
      fadeInSmooth: 'transition-opacity duration-300 ease-out',
      fadeOutSmooth: 'transition-opacity duration-300 ease-in',
      slideInSmooth: 'transition-transform duration-350 ease-out',
      slideOutSmooth: 'transition-transform duration-350 ease-in',
      scaleInSmooth: 'transition-transform duration-350 ease-out',
      scaleOutSmooth: 'transition-transform duration-350 ease-in',
      
      // Emphasis interactions (500ms+)
      fadeInEmphasis: 'transition-opacity duration-500 ease-out',
      fadeOutEmphasis: 'transition-opacity duration-500 ease-in',
      slideInEmphasis: 'transition-transform duration-600 ease-out',
      slideOutEmphasis: 'transition-transform duration-600 ease-in',
    },

    // Accessibility-first motion variants
    motionAccessibility: {
      // Motion-safe variants (when user prefers motion)
      motionSafeFadeIn: 'motion-safe:transition-opacity motion-safe:duration-200 motion-safe:ease-out',
      motionSafeSlideIn: 'motion-safe:transition-transform motion-safe:duration-250 motion-safe:ease-out',
      motionSafeScaleIn: 'motion-safe:transition-transform motion-safe:duration-250 motion-safe:ease-out',
      
      // Motion-reduce variants (when user prefers reduced motion)
      motionReduceNone: 'motion-reduce:transition-none motion-reduce:animate-none',
      motionReduceSlow: 'motion-reduce:duration-1000 motion-reduce:ease-linear',
      motionReduceMinimal: 'motion-reduce:duration-500 motion-reduce:ease-out',
      
      // High contrast motion variants
      highContrastFadeIn: 'contrast-more:transition-opacity contrast-more:duration-200',
      highContrastSlideIn: 'contrast-more:transition-transform contrast-more:duration-250',
    },

    // Core transition primitives
    motionTransition: {
      all: 'transition-all',
      none: 'transition-none',
      colors: 'transition-colors',
      opacity: 'transition-opacity',
      transform: 'transition-transform',
      shadow: 'transition-shadow',
      background: 'transition-background-color',
      border: 'transition-border-color',
    },

         // ============================================================================
    // COLOR TOKENS - MAPS4 Cosmic Color System
    // ============================================================================
    
    // Surface colors for backgrounds and containers
    color: {
      surface: {
        canvas: 'bg-deep-space',
        elevated: 'bg-cosmic-void',
        panel: 'bg-stellar-surface',
        overlay: 'bg-cosmic-overlay',
        translucent: 'bg-stellar-surface/80',
        scrim: 'bg-deep-space/60',
        card: 'bg-cosmic-void',
        sidebar: 'bg-stellar-surface',
        header: 'bg-cosmic-void',
        footer: 'bg-stellar-surface',
        modal: 'bg-cosmic-void',
        tooltip: 'bg-cosmic-void',
        popover: 'bg-cosmic-void',
        dropdown: 'bg-cosmic-void',
        toast: 'bg-cosmic-void',
        badge: 'bg-aurora-accent',
        chip: 'bg-stellar-surface',
      },

      // Content colors for text and foreground elements
      content: {
        primary: 'text-cosmic-light',
        secondary: 'text-stellar-muted',
        tertiary: 'text-cosmic-subtle',
        disabled: 'text-cosmic-disabled',
        inverse: 'text-deep-space',
        muted: 'text-stellar-muted',
        placeholder: 'text-cosmic-subtle',
        link: 'text-aurora-accent',
        code: 'text-cosmic-light',
        success: 'text-cosmic-success',
        warning: 'text-cosmic-warning',
        error: 'text-cosmic-danger',
        info: 'text-cosmic-info',
      },

      // Aurora Accent System for interactive elements
      brand: {
        primary: {
          bg: 'bg-aurora-accent',
          fg: 'text-cosmic-dark',
          border: 'border-aurora-accent',
          hover: 'hover:bg-cosmic-primary-hover',
          pressed: 'active:bg-aurora-accent/90',
        },
        secondary: {
          bg: 'bg-cosmic-cyan',
          fg: 'text-cosmic-dark',
          border: 'border-cosmic-cyan',
          hover: 'hover:bg-cosmic-secondary-hover',
          pressed: 'active:bg-cosmic-cyan/90',
        },
        accent: {
          bg: 'bg-aurora-accent',
          fg: 'text-cosmic-dark',
          border: 'border-aurora-accent',
          hover: 'hover:bg-cosmic-primary-hover',
          pressed: 'active:bg-cosmic-accent-pressed',
        },
      },

      // Semantic feedback colors with cosmic harmony
      feedback: {
        success: {
          bg: 'bg-cosmic-success',
          fg: 'text-cosmic-dark',
          border: 'border-cosmic-success',
          solid: 'bg-cosmic-success-solid',
          subtle: 'bg-cosmic-success/10',
          muted: 'text-cosmic-success',
        },
        warning: {
          bg: 'bg-cosmic-warning',
          fg: 'text-cosmic-dark',
          border: 'border-cosmic-warning',
          solid: 'bg-cosmic-warning-solid',
          subtle: 'bg-cosmic-warning/10',
          muted: 'text-cosmic-warning',
        },
        error: {
          bg: 'bg-cosmic-danger',
          fg: 'text-cosmic-dark',
          border: 'border-cosmic-danger',
          solid: 'bg-cosmic-danger-solid',
          subtle: 'bg-cosmic-danger/10',
          muted: 'text-cosmic-danger',
        },
        info: {
          bg: 'bg-cosmic-info',
          fg: 'text-cosmic-dark',
          border: 'border-cosmic-info',
          solid: 'bg-cosmic-info-solid',
          subtle: 'bg-cosmic-info/10',
          muted: 'text-cosmic-info',
        },
      },

      // Border colors
      border: {
        default: 'border-cosmic-border',
        muted: 'border-cosmic-border-muted',
        subtle: 'border-cosmic-border-subtle',
        strong: 'border-cosmic-border-strong',
        aurora: 'border-aurora-accent',
        cosmic: 'border-cosmic-cyan',
        success: 'border-cosmic-success',
        warning: 'border-cosmic-warning',
        error: 'border-cosmic-danger',
        info: 'border-cosmic-info',
        'cosmic-border-30': 'border-cosmic-border/30',
      },
    },

        // ============================================================================
    // TYPOGRAPHY TOKENS - MAPS4 Cosmic Typography System
    // ============================================================================
    
    typography: {
      // Display text for cosmic impact
      display: {
        large: 'text-4xl font-bold',
        medium: 'text-3xl font-bold',
        small: 'text-2xl font-semibold',
        hero: 'text-6xl font-bold',
        jumbo: 'text-8xl font-bold',
      },

      // Semantic heading hierarchy
      heading: {
        h1: 'text-3xl font-semibold',
        h2: 'text-2xl font-semibold',
        h3: 'text-xl font-semibold',
        h4: 'text-lg font-medium',
        h5: 'text-base font-medium',
        h6: 'text-sm font-medium',
      },

      // Body text for readable content
      body: {
        large: 'text-lg font-normal',
        medium: 'text-base font-normal',
        small: 'text-sm font-normal',
        tiny: 'text-xs font-normal',
      },

      // Specialized text patterns
      label: 'text-sm font-medium',
      caption: 'text-xs font-normal',
      overline: 'text-xs font-medium uppercase tracking-wider',
      link: 'text-sm font-medium underline',
      button: 'text-sm font-medium',
      code: 'text-sm font-mono',
      quote: 'text-lg font-normal italic',
    },

        // ============================================================================
    // LAYOUT TOKENS - MAPS4 Cosmic Layout System
    // ============================================================================
    
    layout: {
      // Text alignment patterns
      alignment: {
        center: 'text-center',
        left: 'text-left',
        right: 'text-right',
        justify: 'text-justify',
        start: 'text-start',
        end: 'text-end',
      },

      // Grid system for cosmic layout structure
      grid: {
        columns: {
          1: 'grid-cols-1',
          2: 'grid-cols-2',
          3: 'grid-cols-3',
          4: 'grid-cols-4',
          5: 'grid-cols-5',
          6: 'grid-cols-6',
          7: 'grid-cols-7',
          8: 'grid-cols-8',
          9: 'grid-cols-9',
          10: 'grid-cols-10',
          11: 'grid-cols-11',
          12: 'grid-cols-12',
          auto: 'grid-cols-auto',
          none: 'grid-cols-none',
        },
        gap: {
          none: 'gap-0',
          xs: 'gap-1',
          sm: 'gap-2',
          md: 'gap-4',
          lg: 'gap-6',
          xl: 'gap-8',
          '2xl': 'gap-12',
          '3xl': 'gap-16',
          '4xl': 'gap-20',
        },
        responsive: {
          '1-2': 'grid-cols-1 md:grid-cols-2',
          '1-3': 'grid-cols-1 md:grid-cols-3',
          '1-4': 'grid-cols-1 md:grid-cols-4',
          '1-2-3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
          '1-2-4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
          '1-3-6': 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6',
          '2-4-8': 'grid-cols-2 md:grid-cols-4 lg:grid-cols-8',
        },
      },

      // Flexbox system for cosmic flexible layouts
      flex: {
        direction: {
          row: 'flex-row',
          col: 'flex-col',
          'row-reverse': 'flex-row-reverse',
          'col-reverse': 'flex-col-reverse',
        },
        alignment: {
          center: 'items-center justify-center',
          start: 'items-start justify-start',
          end: 'items-end justify-end',
          between: 'items-center justify-between',
          around: 'items-center justify-around',
          evenly: 'items-center justify-evenly',
          stretch: 'items-stretch',
        },
        items: {
          center: 'items-center',
          start: 'items-start',
          end: 'items-end',
          stretch: 'items-stretch',
          baseline: 'items-baseline',
        },
        justify: {
          center: 'justify-center',
          start: 'justify-start',
          end: 'justify-end',
          between: 'justify-between',
          around: 'justify-around',
          evenly: 'justify-evenly',
        },
        wrap: {
          wrap: 'flex-wrap',
          'wrap-reverse': 'flex-wrap-reverse',
          nowrap: 'flex-nowrap',
        },
      },

      // Spacing patterns for cosmic content separation
      spacing: {
        stack: {
          none: 'space-y-0',
          xs: 'space-y-1',
          sm: 'space-y-2',
          md: 'space-y-4',
          lg: 'space-y-6',
          xl: 'space-y-8',
          '2xl': 'space-y-12',
          '3xl': 'space-y-16',
          '4xl': 'space-y-20',
        },
        cluster: {
          none: 'space-x-0',
          xs: 'space-x-1',
          sm: 'space-x-2',
          md: 'space-x-4',
          lg: 'space-x-6',
          xl: 'space-x-8',
          '2xl': 'space-x-12',
          '3xl': 'space-x-16',
          '4xl': 'space-x-20',
        },
        responsive: {
          'xs-md': 'space-y-1 md:space-y-4',
          'sm-lg': 'space-y-2 md:space-y-6',
          'md-xl': 'space-y-4 md:space-y-8',
          'lg-2xl': 'space-y-6 md:space-y-12',
        },
      },

      // Display patterns for cosmic visibility control
      display: {
        block: 'block',
        inline: 'inline',
        inlineBlock: 'inline-block',
        flex: 'flex',
        grid: 'grid',
        hidden: 'hidden',
        visible: 'visible',
      },

      // Position patterns for cosmic positioning system
      position: {
        relative: 'relative',
        absolute: 'absolute',
        fixed: 'fixed',
        sticky: 'sticky',
        static: 'static',
      },

      // Overflow patterns for cosmic content containment
      overflow: {
        hidden: 'overflow-hidden',
        auto: 'overflow-auto',
        scroll: 'overflow-scroll',
        visible: 'overflow-visible',
        clip: 'overflow-clip',
      },

      // Width tokens for cosmic container sizing
      width: {
        full: 'w-full',
        auto: 'w-auto',
        screen: 'w-screen',
        'max-7xl': 'max-w-7xl',
        'max-6xl': 'max-w-6xl',
        'max-5xl': 'max-w-5xl',
        'max-4xl': 'max-w-4xl',
        'max-3xl': 'max-w-3xl',
        'max-2xl': 'max-w-2xl',
        'max-xl': 'max-w-xl',
        'max-lg': 'max-w-lg',
        'max-md': 'max-w-md',
        'max-sm': 'max-w-sm',
        'max-xs': 'max-w-xs',
        'min-content': 'min-w-min',
        'max-content': 'max-w-max',
        'fit-content': 'w-fit',
      },

      // Height tokens for cosmic container sizing
      height: {
        full: 'h-full',
        auto: 'h-auto',
        screen: 'h-screen',
        'min-screen': 'min-h-screen',
        'max-content': 'max-h-max',
        'min-content': 'min-h-min',
        'fit-content': 'h-fit',
      },

      // Padding tokens for cosmic content breathing
      padding: {
        0: 'p-0',
        1: 'p-1',
        2: 'p-2',
        3: 'p-3',
        4: 'p-4',
        5: 'p-5',
        6: 'p-6',
        8: 'p-8',
        10: 'p-10',
        12: 'p-12',
        16: 'p-16',
        20: 'p-20',
        24: 'p-24',
        32: 'p-32',
        40: 'p-40',
        48: 'p-48',
        56: 'p-56',
        64: 'p-64',
      },

      // Margin tokens for cosmic content separation
      margin: {
        0: 'm-0',
        1: 'm-1',
        2: 'm-2',
        3: 'm-3',
        4: 'm-4',
        5: 'm-5',
        6: 'm-6',
        8: 'm-8',
        10: 'm-10',
        12: 'm-12',
        16: 'm-16',
        20: 'm-20',
        24: 'm-24',
        32: 'm-32',
        40: 'm-40',
        48: 'm-48',
        56: 'm-56',
        64: 'm-64',
        'x-auto': 'mx-auto',
        'y-auto': 'my-auto',
        't-auto': 'mt-auto',
        'b-auto': 'mb-auto',
        'l-auto': 'ml-auto',
        'r-auto': 'mr-auto',
      },

      // Border tokens for cosmic boundary definition
      border: {
        width: {
          none: 'border-0',
          default: 'border',
          thin: 'border-2',
          thick: 'border-4',
          'extra-thick': 'border-8',
        },
        radius: {
          none: 'rounded-none',
          sm: 'rounded-sm',
          default: 'rounded',
          md: 'rounded-md',
          lg: 'rounded-lg',
          xl: 'rounded-xl',
          '2xl': 'rounded-2xl',
          '3xl': 'rounded-3xl',
          full: 'rounded-full',
        },
        style: {
          solid: 'border-solid',
          dashed: 'border-dashed',
          dotted: 'border-dotted',
          double: 'border-double',
          none: 'border-none',
        },
        collapse: 'border-collapse',
      },

      // Background tokens for cosmic surface definition
      background: {
        transparent: 'bg-transparent',
        current: 'bg-current',
        inherit: 'bg-inherit',
        initial: 'bg-initial',
        revert: 'bg-revert',
        'revert-layer': 'bg-revert-layer',
        unset: 'bg-unset',
      },

      // Flexbox utility tokens
      flexbox: {
        grow: {
          0: 'flex-grow-0',
          1: 'flex-grow',
        },
        basis: {
          0: 'flex-basis-0',
          auto: 'flex-basis-auto',
          full: 'flex-basis-full',
        },
        shrink: {
          0: 'flex-shrink-0',
          1: 'flex-shrink',
        },
      },
    },

        // ============================================================================
    // ELEVATION TOKENS - MAPS4 Cosmic Depth System
    // ============================================================================
    
    elevation: {
      none: 'shadow-none',
      sm: 'shadow-sm',
      default: 'shadow',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl',
      '2xl': 'shadow-2xl',
      inner: 'shadow-inner',
      'cosmic-glow': 'shadow-cosmic-glow',
      'aurora-glow': 'shadow-aurora-glow',
    },

    // ============================================================================
    // Z-INDEX TOKENS - MAPS4 Cosmic Layer System
    // ============================================================================
    
    zIndex: {
      auto: 'z-auto',
      0: 'z-0',
      10: 'z-10',
      20: 'z-20',
      30: 'z-30',
      40: 'z-40',
      50: 'z-50',
      max: 'z-max',
      dropdown: 'z-50',
      sticky: 'z-40',
      fixed: 'z-50',
      modal: 'z-50',
      popover: 'z-50',
      tooltip: 'z-50',
      toast: 'z-50',
    },

    // ============================================================================
    // BACKDROP TOKENS - MAPS4 Liquid Glass Materials
    // ============================================================================
    
    backdrop: {
      blur: {
        none: 'backdrop-blur-none',
        sm: 'backdrop-blur-sm',
        default: 'backdrop-blur',
        md: 'backdrop-blur-md',
        lg: 'backdrop-blur-lg',
        xl: 'backdrop-blur-xl',
        '2xl': 'backdrop-blur-2xl',
        '3xl': 'backdrop-blur-3xl',
      },
      saturate: {
        0: 'backdrop-saturate-0',
        50: 'backdrop-saturate-50',
        100: 'backdrop-saturate-100',
        150: 'backdrop-saturate-150',
        200: 'backdrop-saturate-200',
      },
      brightness: {
        0: 'backdrop-brightness-0',
        50: 'backdrop-brightness-50',
        75: 'backdrop-brightness-75',
        90: 'backdrop-brightness-90',
        95: 'backdrop-brightness-95',
        100: 'backdrop-brightness-100',
        105: 'backdrop-brightness-105',
        110: 'backdrop-brightness-110',
        125: 'backdrop-brightness-125',
        150: 'backdrop-brightness-150',
        200: 'backdrop-brightness-200',
      },
      contrast: {
        0: 'backdrop-contrast-0',
        50: 'backdrop-contrast-50',
        75: 'backdrop-contrast-75',
        100: 'backdrop-contrast-100',
        125: 'backdrop-contrast-125',
        150: 'backdrop-contrast-150',
        200: 'backdrop-contrast-200',
      },
    },
  },

    // ============================================================================
  // RECIPES LAYER - Pre-built layout combinations
  // ============================================================================
  
  recipes: {
    layout: {
      // Centered content layout with cosmic aesthetics
      center: 'flex items-center justify-center text-center',
      
      // Stack layout with cosmic spacing
      stack: {
        base: 'flex flex-col',
        spacing: {
          none: 'space-y-0',
          xs: 'space-y-1',
          sm: 'space-y-2',
          md: 'space-y-4',
          lg: 'space-y-6',
          xl: 'space-y-8',
          '2xl': 'space-y-12',
        },
      },
      
      // Cluster layout with cosmic spacing
      cluster: {
        base: 'flex items-center',
        spacing: {
          none: 'space-x-0',
          xs: 'space-x-1',
          sm: 'space-x-2',
          md: 'space-x-4',
          lg: 'space-x-6',
          xl: 'space-x-8',
          '2xl': 'space-x-12',
        },
      },
      
      // Grid layout with cosmic responsiveness
      grid: {
        base: 'grid',
        responsive: {
          '1-2': 'grid-cols-1 md:grid-cols-2',
          '1-3': 'grid-cols-1 md:grid-cols-3',
          '1-2-3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
          '1-2-4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
          '2-4-8': 'grid-cols-2 md:grid-cols-4 lg:grid-cols-8',
        },
        gap: {
          none: 'gap-0',
          xs: 'gap-1',
          sm: 'gap-2',
          md: 'gap-4',
          lg: 'gap-6',
          xl: 'gap-8',
          '2xl': 'gap-12',
        },
      },
      
      // Panel layout with cosmic aesthetics
      panel: {
        base: 'rounded-lg border border-cosmic-border bg-cosmic-void p-6',
        elevated: 'shadow-md',
        interactive: 'hover:shadow-lg transition-shadow duration-normal',
        glass: 'backdrop-blur-md backdrop-saturate-150 bg-cosmic-void/80 border-cosmic-border/30',
      },
      
      // Card layout with cosmic aesthetics
      card: {
        base: 'rounded-xl border border-cosmic-border bg-cosmic-void p-6',
        elevated: 'shadow-lg',
        interactive: 'hover:shadow-xl transition-shadow duration-300',
        glass: 'backdrop-blur-lg backdrop-saturate-150 bg-cosmic-void/60 border-cosmic-border/20',
      },
      
      // Form layout with cosmic aesthetics
      form: {
        base: 'space-y-6',
        field: 'space-y-2',
        group: 'space-y-4',
        section: 'space-y-8',
      },
      
      // Navigation layout with cosmic aesthetics
      navigation: {
        base: 'flex items-center space-x-6',
        vertical: 'flex flex-col space-y-4',
        horizontal: 'flex items-center space-x-4',
        mobile: 'flex flex-col space-y-2',
      },
    },
    
    // Motion recipes for common patterns
    motion: {
      // Button motion patterns
      button: {
        base: 'transition-all duration-200 ease-out',
        hover: 'hover:scale-105 hover:shadow-lg',
        active: 'active:scale-95',
        focus: 'focus:ring-2 focus:ring-aurora-accent focus:ring-offset-2',
      },
      
      // Card motion patterns
      card: {
        base: 'transition-all duration-300 ease-out',
        hover: 'hover:scale-105 hover:shadow-xl',
        active: 'active:scale-98',
        focus: 'focus:ring-2 focus:ring-aurora-accent focus:ring-offset-2',
      },
      
      // Modal motion patterns
      modal: {
        enter: 'transition-all duration-300 ease-out',
        exit: 'transition-all duration-200 ease-in',
        overlay: 'transition-opacity duration-200 ease-out',
      },
      
      // Tooltip motion patterns
      tooltip: {
        enter: 'transition-opacity duration-150 ease-out',
        exit: 'transition-opacity duration-100 ease-in',
      },
    },
    
    // Color recipes for common patterns
    color: {
      // Interactive element colors
      interactive: {
        primary: 'bg-aurora-accent text-cosmic-dark hover:bg-cosmic-primary-hover',
        secondary: 'bg-cosmic-cyan text-cosmic-dark hover:bg-cosmic-secondary-hover',
        ghost: 'bg-transparent text-cosmic-light hover:bg-cosmic-void',
        outline: 'border border-cosmic-border bg-transparent hover:bg-cosmic-void',
      },
      
      // Status colors
      status: {
        success: 'bg-cosmic-success text-cosmic-dark',
        warning: 'bg-cosmic-warning text-cosmic-dark',
        error: 'bg-cosmic-danger text-cosmic-dark',
        info: 'bg-cosmic-info text-cosmic-dark',
      },
    },
  },

    // ============================================================================
  // META LAYER - Token system metadata
  // ============================================================================
  
  meta: {
    version: '4.0.0',
    name: 'MAPS4 Deep Space Canvas Cosmic Innovation - Enhanced Design Tokens',
    description: 'MAPS4 cosmic CSS variable-based token system with constitutional governance and dynamic registry support',
    lastUpdated: '2025-01-27',
    governance: 'TOKEN_GOVERNANCE_SSOT.md',
    architecture: 'Constitutional 2-level nesting maximum',
    compliance: '100% SSOT, Anti-drift enforced',
  },
};

// ============================================================================
// TYPE DEFINITIONS - Constitutional TypeScript Support
// ============================================================================

/**
 * Type definitions for enhanced type safety
 */
export type DesignTokens = typeof ENHANCED_DESIGN_TOKENS;

// Foundation layer types
export type ColorTokens = DesignTokens['foundation']['color'];
export type TypographyTokens = DesignTokens['foundation']['typography'];
export type SpacingTokens = DesignTokens['foundation']['layout']['spacing'];
export type ZIndexTokens = DesignTokens['foundation']['zIndex'];
export type MotionTokens = DesignTokens['foundation'];
export type LayoutTokens = DesignTokens['foundation']['layout'];
export type ElevationTokens = DesignTokens['foundation']['elevation'];
export type BackdropTokens = DesignTokens['foundation']['backdrop'];

// Motion-specific types
export type MotionComponentsTokens = DesignTokens['foundation']['motionComponents'];
export type MotionLegacyTokens = DesignTokens['foundation']['motionLegacy'];
export type MotionPatternsTokens = DesignTokens['foundation']['motionPatterns'];
export type MotionAccessibilityTokens = DesignTokens['foundation']['motionAccessibility'];
export type MotionTransitionTokens = DesignTokens['foundation']['motionTransition'];

// Recipe types
export type LayoutRecipes = DesignTokens['recipes']['layout'];
export type MotionRecipes = DesignTokens['recipes']['motion'];
export type ColorRecipes = DesignTokens['recipes']['color'];

// ============================================================================
// ZOD SCHEMA - Runtime validation
// ============================================================================

/**
 * Zod schema for runtime validation
 */
export const DesignTokensSchema = z.object({
  meta: z.object({
    version: z.string(),
    name: z.string(),
    description: z.string(),
    lastUpdated: z.string(),
    governance: z.string(),
    architecture: z.string(),
    compliance: z.string(),
  }),
  foundation: z.object({
    // Motion validation
    motionComponents: z.record(z.string()),
    motionLegacy: z.record(z.string()),
    motionPatterns: z.record(z.string()),
    motionAccessibility: z.record(z.string()),
    motionTransition: z.record(z.string()),
    
    // Color validation
    color: z.object({
      surface: z.record(z.string()),
      content: z.record(z.string()),
      brand: z.object({
        primary: z.record(z.string()),
        secondary: z.record(z.string()),
        accent: z.record(z.string()),
      }),
      feedback: z.object({
        success: z.record(z.string()),
        warning: z.record(z.string()),
        error: z.record(z.string()),
        info: z.record(z.string()),
      }),
      border: z.record(z.string()),
    }),
    
    // Typography validation
    typography: z.object({
      display: z.record(z.string()),
      heading: z.record(z.string()),
      body: z.record(z.string()),
      label: z.string(),
      caption: z.string(),
      overline: z.string(),
      link: z.string(),
      button: z.string(),
      code: z.string(),
      quote: z.string(),
    }),
    
    // Layout validation
    layout: z.object({
      alignment: z.record(z.string()),
      grid: z.object({
        columns: z.record(z.string()),
        gap: z.record(z.string()),
        responsive: z.record(z.string()),
      }),
      flex: z.object({
        direction: z.record(z.string()),
        alignment: z.record(z.string()),
        items: z.record(z.string()),
        justify: z.record(z.string()),
        wrap: z.record(z.string()),
      }),
      spacing: z.object({
        stack: z.record(z.string()),
        cluster: z.record(z.string()),
        responsive: z.record(z.string()),
      }),
      display: z.record(z.string()),
      position: z.record(z.string()),
      overflow: z.record(z.string()),
      width: z.record(z.string()),
      height: z.record(z.string()),
      padding: z.record(z.string()),
      margin: z.record(z.string()),
      border: z.object({
        width: z.record(z.string()),
        radius: z.record(z.string()),
        style: z.record(z.string()),
        collapse: z.string(),
      }),
      background: z.record(z.string()),
      flexbox: z.object({
        grow: z.record(z.string()),
        basis: z.record(z.string()),
        shrink: z.record(z.string()),
      }),
    }),
    
    // Elevation validation
    elevation: z.record(z.string()),
    
    // Z-index validation
    zIndex: z.record(z.string()),
    
    // Backdrop validation
    backdrop: z.object({
      blur: z.record(z.string()),
      saturate: z.record(z.string()),
      brightness: z.record(z.string()),
      contrast: z.record(z.string()),
    }),
  }),
  
  // Recipes validation
  recipes: z.object({
    layout: z.object({
      center: z.string(),
      stack: z.object({
        base: z.string(),
        spacing: z.record(z.string()),
      }),
      cluster: z.object({
        base: z.string(),
        spacing: z.record(z.string()),
      }),
      grid: z.object({
        base: z.string(),
        responsive: z.record(z.string()),
        gap: z.record(z.string()),
      }),
      panel: z.object({
        base: z.string(),
        elevated: z.string(),
        interactive: z.string(),
        glass: z.string(),
      }),
      card: z.object({
        base: z.string(),
        elevated: z.string(),
        interactive: z.string(),
        glass: z.string(),
      }),
      form: z.object({
        base: z.string(),
        field: z.string(),
        group: z.string(),
        section: z.string(),
      }),
      navigation: z.object({
        base: z.string(),
        vertical: z.string(),
        horizontal: z.string(),
        mobile: z.string(),
      }),
    }),
    motion: z.object({
      button: z.object({
        base: z.string(),
        hover: z.string(),
        active: z.string(),
        focus: z.string(),
      }),
      card: z.object({
        base: z.string(),
        hover: z.string(),
        active: z.string(),
        focus: z.string(),
      }),
      modal: z.object({
        enter: z.string(),
        exit: z.string(),
        overlay: z.string(),
      }),
      tooltip: z.object({
        enter: z.string(),
        exit: z.string(),
      }),
    }),
    color: z.object({
      interactive: z.object({
        primary: z.string(),
        secondary: z.string(),
        ghost: z.string(),
        outline: z.string(),
      }),
      status: z.object({
        success: z.string(),
        warning: z.string(),
        error: z.string(),
        info: z.string(),
      }),
    }),
  }),
});

// ============================================================================
// UTILITY FUNCTIONS - Constitutional Token Access
// ============================================================================

/**
 * Utility functions for common token access patterns
 */
export const getMotionToken = (key: keyof MotionComponentsTokens) => {
  return ENHANCED_DESIGN_TOKENS.foundation.motionComponents[key];
};

export const getColorToken = (category: keyof ColorTokens, key: string) => {
  return ENHANCED_DESIGN_TOKENS.foundation.color[category][key];
};

export const getLayoutToken = (category: keyof LayoutTokens, key: string) => {
  return ENHANCED_DESIGN_TOKENS.foundation.layout[category][key];
};

export const getTypographyToken = (category: keyof TypographyTokens, key: string) => {
  return ENHANCED_DESIGN_TOKENS.foundation.typography[category][key];
};

export const getElevationToken = (key: keyof ElevationTokens) => {
  return ENHANCED_DESIGN_TOKENS.foundation.elevation[key];
};

export const getZIndexToken = (key: keyof ZIndexTokens) => {
  return ENHANCED_DESIGN_TOKENS.foundation.zIndex[key];
};

export const getBackdropToken = (category: keyof BackdropTokens, key: string) => {
  return ENHANCED_DESIGN_TOKENS.foundation.backdrop[category][key];
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default ENHANCED_DESIGN_TOKENS;
