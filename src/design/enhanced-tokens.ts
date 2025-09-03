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
    // Focus ring bundle to deduplicate focus-visible styling
    focus: {
      ringPrimary:
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aurora-accent focus-visible:ring-offset-2',
    },
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

    // Tailwind integration layer for components
    tailwind: {
      components: {
        badgeHover: 'transition-all duration-200 ease-out',
        badgeActive: 'transition-all duration-150 ease-in',
        badgeFocus: 'transition-all duration-100 ease-out',
        buttonHover: 'transition-all duration-200 ease-out',
        buttonActive: 'transition-all duration-150 ease-in',
        buttonFocus: 'transition-all duration-100 ease-out',
        cardHover: 'transition-all duration-300 ease-out',
        cardActive: 'transition-all duration-200 ease-in',
        cardFocus: 'transition-all duration-150 ease-out',
      },
      legacy: {
        'motion-reduce-none': 'motion-reduce:transition-none motion-reduce:animate-none',
        'motion-safe-fade': 'motion-safe:transition-opacity motion-safe:duration-200',
      },
      base: {
        'inline-flex': 'inline-flex',
        'items-center': 'items-center',
        'justify-center': 'justify-center',
        'rounded-full': 'rounded-full',
        'border': 'border',
        'font-medium': 'font-medium',
      },
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
        'aurora-accent': 'border-aurora-accent',
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
      // Display patterns - Cosmic visibility control
      display: {
        block: 'block',
        inline: 'inline',
        flex: 'flex',
        grid: 'grid',
        hidden: 'hidden',
        inlineBlock: 'inline-block',
        inlineFlex: 'inline-flex',
        inlineGrid: 'inline-grid',
        table: 'table',
        tableCell: 'table-cell',
        tableRow: 'table-row',
      },

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
            // Advanced grid patterns
        flow: {
          row: 'grid-flow-row',
          col: 'grid-flow-col',
          dense: 'grid-flow-dense',
        },
        autoCols: {
          auto: 'auto-cols-auto',
          min: 'auto-cols-min',
          max: 'auto-cols-max',
          fr: 'auto-cols-fr',
        },
        autoRows: {
          auto: 'auto-rows-auto',
          min: 'auto-rows-min',
          max: 'auto-rows-max',
          fr: 'auto-rows-fr',
        },
        span: {
          colFull: 'col-span-full',
          rowFull: 'row-span-full',
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
        // DELTA PACK: Advanced flexbox patterns
        grow: {
          initial: 'flex-initial',
          auto: 'flex-auto',
          none: 'flex-none',
        },
        content: {
          start: 'content-start',
          end: 'content-end',
          center: 'content-center',
          between: 'content-between',
          around: 'content-around',
          evenly: 'content-evenly',
        },
        self: {
          start: 'self-start',
          end: 'self-end',
          center: 'self-center',
          stretch: 'self-stretch',
          baseline: 'self-baseline',
        },
        place: {
          itemsStart: 'place-items-start',
          itemsEnd: 'place-items-end',
          itemsCenter: 'place-items-center',
          itemsStretch: 'place-items-stretch',
          itemsBaseline: 'place-items-baseline',
          selfStart: 'place-self-start',
          selfEnd: 'place-self-end',
          selfCenter: 'place-self-center',
          selfStretch: 'place-self-stretch',
          selfBaseline: 'place-self-baseline',
        },
      },

      // DELTA PACK: Object positioning and aspect ratios
      object: {
        cover: 'object-cover',
        contain: 'object-contain',
        fill: 'object-fill',
        none: 'object-none',
        scaleDown: 'object-scale-down',
      },

      aspect: {
        video: 'aspect-video',
        square: 'aspect-square',
        auto: 'aspect-auto',
      },

      // DELTA PACK: Overflow and overscroll patterns
      overflow: {
        hidden: 'overflow-hidden',
        auto: 'overflow-auto',
        scroll: 'overflow-scroll',
        visible: 'overflow-visible',
        clip: 'overflow-clip',
        // Directional overflow
        x: {
          auto: 'overflow-x-auto',
          hidden: 'overflow-x-hidden',
          scroll: 'overflow-x-scroll',
          visible: 'overflow-x-visible',
          clip: 'overflow-x-clip',
        },
        y: {
          auto: 'overflow-y-auto',
          hidden: 'overflow-y-hidden',
          scroll: 'overflow-y-scroll',
          visible: 'overflow-y-visible',
          clip: 'overflow-y-clip',
        },
      },

      overscroll: {
        auto: 'overscroll-auto',
        contain: 'overscroll-contain',
        none: 'overscroll-none',
        x: {
          auto: 'overscroll-x-auto',
          contain: 'overscroll-x-contain',
          none: 'overscroll-x-none',
        },
        y: {
          auto: 'overscroll-y-auto',
          contain: 'overscroll-y-contain',
          none: 'overscroll-y-none',
        },
      },

      // DELTA PACK: Text wrapping and selection
      whitespace: {
        normal: 'whitespace-normal',
        nowrap: 'whitespace-nowrap',
        pre: 'whitespace-pre',
        preLine: 'whitespace-pre-line',
        preWrap: 'whitespace-pre-wrap',
        breakSpaces: 'whitespace-break-spaces',
      },

      break: {
        normal: 'break-normal',
        words: 'break-words',
        all: 'break-all',
        keep: 'break-keep',
      },

      select: {
        none: 'select-none',
        text: 'select-text',
        all: 'select-all',
        auto: 'select-auto',
      },

      // DELTA PACK: Cursor and resize patterns
      cursor: {
        auto: 'cursor-auto',
        default: 'cursor-default',
        pointer: 'cursor-pointer',
        wait: 'cursor-wait',
        text: 'cursor-text',
        move: 'cursor-move',
        'not-allowed': 'cursor-not-allowed',
        help: 'cursor-help',
        progress: 'cursor-progress',
        crosshair: 'cursor-crosshair',
        'vertical-text': 'cursor-vertical-text',
        grab: 'cursor-grab',
        grabbing: 'cursor-grabbing',
      },

      resize: {
        none: 'resize-none',
        y: 'resize-y',
        x: 'resize-x',
        auto: 'resize-auto',
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

      // Position patterns for cosmic positioning system
      position: {
        relative: 'relative',
        absolute: 'absolute',
        fixed: 'fixed',
        sticky: 'sticky',
        static: 'static',
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
        // DELTA PACK: Fractional widths (minimal set)
        '1/2': 'w-1/2',
        '1/3': 'w-1/3',
        '2/3': 'w-2/3',
        '1/4': 'w-1/4',
        '3/4': 'w-3/4',
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
        // DELTA PACK: Fractional heights (minimal set)
        '1/2': 'h-1/2',
        '1/3': 'h-1/3',
        '2/3': 'h-2/3',
        '1/4': 'h-1/4',
        '3/4': 'h-3/4',
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
        top: {
          0: 'mt-0',
          1: 'mt-1',
          2: 'mt-2',
          3: 'mt-3',
          4: 'mt-4',
          5: 'mt-5',
          6: 'mt-6',
          8: 'mt-8',
          10: 'mt-10',
          12: 'mt-12',
          16: 'mt-16',
          20: 'mt-20',
          24: 'mt-24',
          32: 'mt-32',
          40: 'mt-40',
          48: 'mt-48',
          56: 'mt-56',
          64: 'mt-64',
        },
        bottom: {
          0: 'mb-0',
          1: 'mb-1',
          2: 'mb-2',
          3: 'mb-3',
          4: 'mb-4',
          5: 'mb-5',
          6: 'mb-6',
          8: 'mb-8',
          10: 'mb-10',
          12: 'mb-12',
          16: 'mb-16',
          20: 'mb-20',
          24: 'mb-24',
          32: 'mb-32',
          40: 'mb-40',
          48: 'mb-48',
          56: 'mb-56',
          64: 'mb-64',
        },
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
      // Divide tokens for borders between children
      divide: {
        y: 'divide-y',
        x: 'divide-x',
        none: 'divide-y-0',
        subtle: 'divide-border',
        strong: 'divide-cosmic-border-strong',
        subtleCosmic: 'divide-cosmic-border/30',
      },
    },

    // Icon size tokens (common sizes)
    icon: {
      size: {
        sm: 'size-4',
        md: 'size-5',
        lg: 'size-6',
      },
    },

    // Avatar size aliases (semantic class bundles)
    avatar: {
      size: {
        xs: 'h-6 w-6',
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
        '2xl': 'h-20 w-20',
        touch: 'h-11 w-11',
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
        135: 'backdrop-saturate-135',
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

    // ============================================================================
    // TRANSFORM TOKENS - MAPS4 Cosmic Transform System
    // ============================================================================
    
    transform: {
      // Scale transformations
      scale: {
        none: 'scale-0',
        '50': 'scale-50',
        '75': 'scale-75',
        '90': 'scale-90',
        '95': 'scale-95',
        '98': 'scale-98',
        '100': 'scale-100',
        '105': 'scale-105',
        '110': 'scale-110',
        '125': 'scale-125',
        '150': 'scale-150',
        '200': 'scale-200',
        'x-50': 'scale-x-50',
        'x-75': 'scale-x-75',
        'x-90': 'scale-x-90',
        'x-95': 'scale-x-95',
        'x-100': 'scale-x-100',
        'x-105': 'scale-x-105',
        'x-110': 'scale-x-110',
        'x-125': 'scale-x-125',
        'x-150': 'scale-x-150',
        'x-200': 'scale-x-200',
        'y-50': 'scale-y-50',
        'y-75': 'scale-y-75',
        'y-90': 'scale-y-90',
        'y-95': 'scale-y-95',
        'y-100': 'scale-y-100',
        'y-105': 'scale-y-105',
        'y-110': 'scale-y-110',
        'y-125': 'scale-y-125',
        'y-150': 'scale-y-150',
        'y-200': 'scale-y-200',
      },

      // Rotate transformations
      rotate: {
        none: 'rotate-0',
        '1': 'rotate-1',
        '2': 'rotate-2',
        '3': 'rotate-3',
        '6': 'rotate-6',
        '12': 'rotate-12',
        '45': 'rotate-45',
        '90': 'rotate-90',
        '180': 'rotate-180',
        '270': 'rotate-270',
        '360': 'rotate-360',
        '-1': '-rotate-1',
        '-2': '-rotate-2',
        '-3': '-rotate-3',
        '-6': '-rotate-6',
        '-12': '-rotate-12',
        '-45': '-rotate-45',
        '-90': '-rotate-90',
        '-180': '-rotate-180',
        '-270': '-rotate-270',
        '-360': '-rotate-360',
      },

      // Translate transformations
      translate: {
        'x-0': 'translate-x-0',
        'x-1': 'translate-x-1',
        'x-2': 'translate-x-2',
        'x-3': 'translate-x-3',
        'x-4': 'translate-x-4',
        'x-5': 'translate-x-5',
        'x-6': 'translate-x-6',
        'x-8': 'translate-x-8',
        'x-10': 'translate-x-10',
        'x-12': 'translate-x-12',
        'x-16': 'translate-x-16',
        'x-20': 'translate-x-20',
        'x-24': 'translate-x-24',
        'x-32': 'translate-x-32',
        'x-40': 'translate-x-40',
        'x-48': 'translate-x-48',
        'x-56': 'translate-x-56',
        'x-64': 'translate-x-64',
        'x-80': 'translate-x-80',
        'x-96': 'translate-x-96',
        'x-px': 'translate-x-px',
        'x-0.5': 'translate-x-0.5',
        'x-1.5': 'translate-x-1.5',
        'x-2.5': 'translate-x-2.5',
        'x-3.5': 'translate-x-3.5',
        'x-1/2': 'translate-x-1/2',
        'x-1/3': 'translate-x-1/3',
        'x-2/3': 'translate-x-2/3',
        'x-1/4': 'translate-x-1/4',
        'x-3/4': 'translate-x-3/4',
        'x-full': 'translate-x-full',
        'y-0': 'translate-y-0',
        'y-1': 'translate-y-1',
        'y-2': 'translate-y-2',
        'y-3': 'translate-y-3',
        'y-4': 'translate-y-4',
        'y-5': 'translate-y-5',
        'y-6': 'translate-y-6',
        'y-8': 'translate-y-8',
        'y-10': 'translate-y-10',
        'y-12': 'translate-y-12',
        'y-16': 'translate-y-16',
        'y-20': 'translate-y-20',
        'y-24': 'translate-y-24',
        'y-32': 'translate-y-32',
        'y-40': 'translate-y-40',
        'y-48': 'translate-y-48',
        'y-56': 'translate-y-56',
        'y-64': 'translate-y-64',
        'y-80': 'translate-y-80',
        'y-96': 'translate-y-96',
        'y-px': 'translate-y-px',
        'y-0.5': 'translate-y-0.5',
        'y-1.5': 'translate-y-1.5',
        'y-2.5': 'translate-y-2.5',
        'y-3.5': 'translate-y-3.5',
        'y-1/2': 'translate-y-1/2',
        'y-1/3': 'translate-y-1/3',
        'y-2/3': 'translate-y-2/3',
        'y-1/4': 'translate-y-1/4',
        'y-3/4': 'translate-y-3/4',
        'y-full': 'translate-y-full',
      },

      // Skew transformations
      skew: {
        'x-0': 'skew-x-0',
        'x-1': 'skew-x-1',
        'x-2': 'skew-x-2',
        'x-3': 'skew-x-3',
        'x-6': 'skew-x-6',
        'x-12': 'skew-x-12',
        'y-0': 'skew-y-0',
        'y-1': 'skew-y-1',
        'y-2': 'skew-y-2',
        'y-3': 'skew-y-3',
        'y-6': 'skew-y-6',
        'y-12': 'skew-y-12',
        '-x-1': '-skew-x-1',
        '-x-2': '-skew-x-2',
        '-x-3': '-skew-x-3',
        '-x-6': '-skew-x-6',
        '-x-12': '-skew-x-12',
        '-y-1': '-skew-y-1',
        '-y-2': '-skew-y-2',
        '-y-3': '-skew-y-3',
        '-y-6': '-skew-y-6',
        '-y-12': '-skew-y-12',
      },

      // Transform origin
      origin: {
        center: 'origin-center',
        top: 'origin-top',
        'top-right': 'origin-top-right',
        right: 'origin-right',
        'bottom-right': 'origin-bottom-right',
        bottom: 'origin-bottom',
        'bottom-left': 'origin-bottom-left',
        left: 'origin-left',
        'top-left': 'origin-top-left',
      },

      // Transform style
      style: {
        flat: 'transform-gpu',
        preserve: 'transform-none',
      },
    },

    // ============================================================================
    // FILTER TOKENS - MAPS4 Cosmic Filter System
    // ============================================================================
    
    filter: {
      // Blur filters
      blur: {
        none: 'blur-none',
        sm: 'blur-sm',
        default: 'blur',
        md: 'blur-md',
        lg: 'blur-lg',
        xl: 'blur-xl',
        '2xl': 'blur-2xl',
        '3xl': 'blur-3xl',
      },

      // Brightness filters
      brightness: {
        0: 'brightness-0',
        50: 'brightness-50',
        75: 'brightness-75',
        90: 'brightness-90',
        95: 'brightness-95',
        100: 'brightness-100',
        105: 'brightness-105',
        110: 'brightness-110',
        125: 'brightness-125',
        150: 'brightness-150',
        200: 'brightness-200',
      },

      // Contrast filters
      contrast: {
        0: 'contrast-0',
        50: 'contrast-50',
        75: 'contrast-75',
        100: 'contrast-100',
        125: 'contrast-125',
        150: 'contrast-150',
        200: 'contrast-200',
      },

      // Grayscale filters
      grayscale: {
        0: 'grayscale-0',
        default: 'grayscale',
      },

      // Hue rotate filters
      hueRotate: {
        0: 'hue-rotate-0',
        15: 'hue-rotate-15',
        30: 'hue-rotate-30',
        60: 'hue-rotate-60',
        90: 'hue-rotate-90',
        180: 'hue-rotate-180',
        '-15': '-hue-rotate-15',
        '-30': '-hue-rotate-30',
        '-60': '-hue-rotate-60',
        '-90': '-hue-rotate-90',
        '-180': '-hue-rotate-180',
      },

      // Invert filters
      invert: {
        0: 'invert-0',
        default: 'invert',
      },

      // Saturate filters
      saturate: {
        0: 'saturate-0',
        50: 'saturate-50',
        100: 'saturate-100',
        150: 'saturate-150',
        200: 'saturate-200',
      },

      // Sepia filters
      sepia: {
        0: 'sepia-0',
        default: 'sepia',
      },

      // Drop shadow filters
      dropShadow: {
        none: 'drop-shadow-none',
        sm: 'drop-shadow-sm',
        default: 'drop-shadow',
        md: 'drop-shadow-md',
        lg: 'drop-shadow-lg',
        xl: 'drop-shadow-xl',
        '2xl': 'drop-shadow-2xl',
      },
    },

    // ============================================================================
    // ANIMATION TOKENS - MAPS4 Cosmic Animation System
    // ============================================================================
    
    animation: {
      // Animation names
      name: {
        none: 'animate-none',
        spin: 'animate-spin',
        ping: 'animate-ping',
        pulse: 'animate-pulse',
        bounce: 'animate-bounce',
        'fade-in': 'animate-fade-in',
        'slide-up': 'animate-slide-up',
        'scale-in': 'animate-scale-in',
        'bounce-gentle': 'animate-bounce-gentle',
      },

      // Animation duration
      duration: {
        75: 'duration-75',
        100: 'duration-100',
        150: 'duration-150',
        200: 'duration-200',
        300: 'duration-300',
        500: 'duration-500',
        700: 'duration-700',
        1000: 'duration-1000',
        0: 'duration-0',
        120: 'duration-120',
        160: 'duration-160',
        180: 'duration-180',
        220: 'duration-220',
        600: 'duration-600',
      },

      // Animation timing function
      timing: {
        linear: 'ease-linear',
        in: 'ease-in',
        out: 'ease-out',
        'in-out': 'ease-in-out',
        standard: 'ease-standard',
        entrance: 'ease-entrance',
        exit: 'ease-exit',
        spring: 'ease-spring',
      },

      // Animation delay
      delay: {
        75: 'delay-75',
        100: 'delay-100',
        150: 'delay-150',
        200: 'delay-200',
        300: 'delay-300',
        500: 'delay-500',
        700: 'delay-700',
        1000: 'delay-1000',
        0: 'delay-0',
      },

      // Animation iteration count
      iteration: {
        1: 'animate-once',
        infinite: 'animate-infinite',
      },

      // Animation fill mode
      fill: {
        none: 'animate-fill-none',
        forwards: 'animate-fill-forwards',
        backwards: 'animate-fill-backwards',
        both: 'animate-fill-both',
      },
    },

    // ============================================================================
    // POSITIONING TOKENS - MAPS4 Cosmic Positioning System
    // ============================================================================
    
    positioning: {
      // Top positioning
      top: {
        0: 'top-0',
        auto: 'top-auto',
        '1': 'top-1',
        '2': 'top-2',
        '3': 'top-3',
        '4': 'top-4',
        '5': 'top-5',
        '6': 'top-6',
        '8': 'top-8',
        '10': 'top-10',
        '12': 'top-12',
        '16': 'top-16',
        '20': 'top-20',
        '24': 'top-24',
        '32': 'top-32',
        '40': 'top-40',
        '48': 'top-48',
        '56': 'top-56',
        '64': 'top-64',
        '1/2': 'top-1/2',
        '1/3': 'top-1/3',
        '2/3': 'top-2/3',
        '1/4': 'top-1/4',
        '3/4': 'top-3/4',
        full: 'top-full',
        '-1': '-top-1',
        '-2': '-top-2',
        '-3': '-top-3',
        '-4': '-top-4',
        '-5': '-top-5',
        '-6': '-top-6',
        '-8': '-top-8',
        '-10': '-top-10',
        '-12': '-top-12',
        '-16': '-top-16',
        '-20': '-top-20',
        '-24': '-top-24',
        '-32': '-top-32',
        '-40': '-top-40',
        '-48': '-top-48',
        '-56': '-top-56',
        '-64': '-top-64',
        '-1/2': '-top-1/2',
        '-1/3': '-top-1/3',
        '-2/3': '-top-2/3',
        '-1/4': '-top-1/4',
        '-3/4': '-top-3/4',
        '-full': '-top-full',
      },

      // Right positioning
      right: {
        0: 'right-0',
        auto: 'right-auto',
        '1': 'right-1',
        '2': 'right-2',
        '3': 'right-3',
        '4': 'right-4',
        '5': 'right-5',
        '6': 'right-6',
        '8': 'right-8',
        '10': 'right-10',
        '12': 'right-12',
        '16': 'right-16',
        '20': 'right-20',
        '24': 'right-24',
        '32': 'right-32',
        '40': 'right-40',
        '48': 'right-48',
        '56': 'right-56',
        '64': 'right-64',
        '1/2': 'right-1/2',
        '1/3': 'right-1/3',
        '2/3': 'right-2/3',
        '1/4': 'right-1/4',
        '3/4': 'right-3/4',
        full: 'right-full',
        '-1': '-right-1',
        '-2': '-right-2',
        '-3': '-right-3',
        '-4': '-right-4',
        '-5': '-right-5',
        '-6': '-right-6',
        '-8': '-right-8',
        '-10': '-right-10',
        '-12': '-right-12',
        '-16': '-right-16',
        '-20': '-right-20',
        '-24': '-right-24',
        '-32': '-right-32',
        '-40': '-right-40',
        '-48': '-right-48',
        '-56': '-right-56',
        '-64': '-right-64',
        '-1/2': '-right-1/2',
        '-1/3': '-right-1/3',
        '-2/3': '-right-2/3',
        '-1/4': '-right-1/4',
        '-3/4': '-right-3/4',
        '-full': '-right-full',
      },

      // Bottom positioning
      bottom: {
        0: 'bottom-0',
        auto: 'bottom-auto',
        '1': 'bottom-1',
        '2': 'bottom-2',
        '3': 'bottom-3',
        '4': 'bottom-4',
        '5': 'bottom-5',
        '6': 'bottom-6',
        '8': 'bottom-8',
        '10': 'bottom-10',
        '12': 'bottom-12',
        '16': 'bottom-16',
        '20': 'bottom-20',
        '24': 'bottom-24',
        '32': 'bottom-32',
        '40': 'bottom-40',
        '48': 'bottom-48',
        '56': 'bottom-56',
        '64': 'bottom-64',
        '1/2': 'bottom-1/2',
        '1/3': 'bottom-1/3',
        '2/3': 'bottom-2/3',
        '1/4': 'bottom-1/4',
        '3/4': 'bottom-3/4',
        full: 'bottom-full',
        '-1': '-bottom-1',
        '-2': '-bottom-2',
        '-3': '-bottom-3',
        '-4': '-bottom-4',
        '-5': '-bottom-5',
        '-6': '-bottom-6',
        '-8': '-bottom-8',
        '-10': '-bottom-10',
        '-12': '-bottom-12',
        '-16': '-bottom-16',
        '-20': '-bottom-20',
        '-24': '-bottom-24',
        '-32': '-bottom-32',
        '-40': '-bottom-40',
        '-48': '-bottom-48',
        '-56': '-bottom-56',
        '-64': '-bottom-64',
        '-1/2': '-bottom-1/2',
        '-1/3': '-bottom-1/3',
        '-2/3': '-bottom-2/3',
        '-1/4': '-bottom-1/4',
        '-3/4': '-bottom-3/4',
        '-full': '-bottom-full',
      },

      // Left positioning
      left: {
        0: 'left-0',
        auto: 'left-auto',
        '1': 'left-1',
        '2': 'left-2',
        '3': 'left-3',
        '4': 'left-4',
        '5': 'left-5',
        '6': 'left-6',
        '8': 'left-8',
        '10': 'left-10',
        '12': 'left-12',
        '16': 'left-16',
        '20': 'left-20',
        '24': 'left-24',
        '32': 'left-32',
        '40': 'left-40',
        '48': 'left-48',
        '56': 'left-56',
        '64': 'left-64',
        '1/2': 'left-1/2',
        '1/3': 'left-1/3',
        '2/3': 'left-2/3',
        '1/4': 'left-1/4',
        '3/4': 'left-3/4',
        full: 'left-full',
        '-1': '-left-1',
        '-2': '-left-2',
        '-3': '-left-3',
        '-4': '-left-4',
        '-5': '-left-5',
        '-6': '-left-6',
        '-8': '-left-8',
        '-10': '-left-10',
        '-12': '-left-12',
        '-16': '-left-16',
        '-20': '-left-20',
        '-24': '-left-24',
        '-32': '-left-32',
        '-40': '-left-40',
        '-48': '-left-48',
        '-56': '-left-56',
        '-64': '-left-64',
        '-1/2': '-left-1/2',
        '-1/3': '-left-1/3',
        '-2/3': '-left-2/3',
        '-1/4': '-left-1/4',
        '-3/4': '-left-3/4',
        '-full': '-left-full',
      },

      // Inset positioning
      inset: {
        0: 'inset-0',
        auto: 'inset-auto',
        '1': 'inset-1',
        '2': 'inset-2',
        '3': 'inset-3',
        '4': 'inset-4',
        '5': 'inset-5',
        '6': 'inset-6',
        '8': 'inset-8',
        '10': 'inset-10',
        '12': 'inset-12',
        '16': 'inset-16',
        '20': 'inset-20',
        '24': 'inset-24',
        '32': 'inset-32',
        '40': 'inset-40',
        '48': 'inset-48',
        '56': 'inset-56',
        '64': 'inset-64',
        '1/2': 'inset-1/2',
        '1/3': 'inset-1/3',
        '2/3': 'inset-2/3',
        '1/4': 'inset-1/4',
        '3/4': 'inset-3/4',
        full: 'inset-full',
        '-1': '-inset-1',
        '-2': '-inset-2',
        '-3': '-inset-3',
        '-4': '-inset-4',
        '-5': '-inset-5',
        '-6': '-inset-6',
        '-8': '-inset-8',
        '-10': '-inset-10',
        '-12': '-inset-12',
        '-16': '-inset-16',
        '-20': '-inset-20',
        '-24': '-inset-24',
        '-32': '-inset-32',
        '-40': '-inset-40',
        '-48': '-inset-48',
        '-56': '-inset-56',
        '-64': '-inset-64',
        '-1/2': '-inset-1/2',
        '-1/3': '-inset-1/3',
        '-2/3': '-inset-2/3',
        '-1/4': '-inset-1/4',
        '-3/4': '-inset-3/4',
        '-full': '-inset-full',
      },
    },

    // ============================================================================
    // INTERACTION TOKENS - MAPS4 Cosmic Interaction System
    // ============================================================================
    
    interaction: {
      // Group variants
      group: {
        hover: 'group-hover:',
        focus: 'group-focus:',
        active: 'group-active:',
        disabled: 'group-disabled:',
        checked: 'group-checked:',
        'focus-within': 'group-focus-within:',
        'focus-visible': 'group-focus-visible:',
        'peer-checked': 'peer-checked:',
        'peer-disabled': 'peer-disabled:',
        'peer-focus': 'peer-focus:',
        'peer-hover': 'peer-hover:',
        'peer-active': 'peer-active:',
        'peer-focus-within': 'peer-focus-within:',
        'peer-focus-visible': 'peer-focus-visible:',
      },

      // Data attribute variants
      data: {
        'state-checked': 'data-[state=checked]:',
        'state-unchecked': 'data-[state=unchecked]:',
        'state-open': 'data-[state=open]:',
        'state-closed': 'data-[state=closed]:',
        'state-on': 'data-[state=on]:',
        'state-off': 'data-[state=off]:',
        'state-visible': 'data-[state=visible]:',
        'state-hidden': 'data-[state=hidden]:',
        'state-active': 'data-[state=active]:',
        'state-inactive': 'data-[state=inactive]:',
      },

      // Print variants
      print: {
        block: 'print:block',
        inline: 'print:inline',
        inlineBlock: 'print:inline-block',
        flex: 'print:flex',
        grid: 'print:grid',
        hidden: 'print:hidden',
        visible: 'print:visible',
      },

      // Orientation variants
      orientation: {
        portrait: 'portrait:',
        landscape: 'landscape:',
      },

      // Motion variants
      motion: {
        safe: 'motion-safe:',
        reduce: 'motion-reduce:',
      },

      // Contrast variants
      contrast: {
        more: 'contrast-more:',
        less: 'contrast-less:',
      },

      // Forced colors variants
      forcedColors: {
        active: 'forced-colors:',
      },

      // Supports variants
      supports: {
        backdrop: '@supports (backdrop-filter: blur(0))',
        grid: '@supports (display: grid)',
        flexbox: '@supports (display: flex)',
      },
    },

    // ============================================================================
    // CONTAINER QUERY TOKENS - MAPS4 Cosmic Container System
    // ============================================================================
    
    container: {
      // Container type
      type: {
        inline: 'container-type-inline',
        size: 'container-type-size',
        normal: 'container-type-normal',
      },

      // Container queries
      query: {
        sm: '@container (min-width: 640px)',
        md: '@container (min-width: 768px)',
        lg: '@container (min-width: 1024px)',
        xl: '@container (min-width: 1280px)',
        '2xl': '@container (min-width: 1536px)',
      },
    },

    // ============================================================================
    // COMPREHENSIVE FRACTIONAL SIZING - MAPS4 Cosmic Sizing System
    // ============================================================================
    
    fractional: {
      // Width fractions
      width: {
        '1/2': 'w-1/2',
        '1/3': 'w-1/3',
        '2/3': 'w-2/3',
        '1/4': 'w-1/4',
        '2/4': 'w-2/4',
        '3/4': 'w-3/4',
        '1/5': 'w-1/5',
        '2/5': 'w-2/5',
        '3/5': 'w-3/5',
        '4/5': 'w-4/5',
        '1/6': 'w-1/6',
        '2/6': 'w-2/6',
        '3/6': 'w-3/6',
        '4/6': 'w-4/6',
        '5/6': 'w-5/6',
        '1/12': 'w-1/12',
        '2/12': 'w-2/12',
        '3/12': 'w-3/12',
        '4/12': 'w-4/12',
        '5/12': 'w-5/12',
        '6/12': 'w-6/12',
        '7/12': 'w-7/12',
        '8/12': 'w-8/12',
        '9/12': 'w-9/12',
        '10/12': 'w-10/12',
        '11/12': 'w-11/12',
      },

      // Height fractions
      height: {
        '1/2': 'h-1/2',
        '1/3': 'h-1/3',
        '2/3': 'h-2/3',
        '1/4': 'h-1/4',
        '2/4': 'h-2/4',
        '3/4': 'h-3/4',
        '1/5': 'h-1/5',
        '2/5': 'h-2/5',
        '3/5': 'h-3/5',
        '4/5': 'h-4/5',
        '1/6': 'h-1/6',
        '2/6': 'h-2/6',
        '3/6': 'h-3/6',
        '4/6': 'h-4/6',
        '5/6': 'h-5/6',
        '1/12': 'h-1/12',
        '2/12': 'h-2/12',
        '3/12': 'h-3/12',
        '4/12': 'h-4/12',
        '5/12': 'h-5/12',
        '6/12': 'h-6/12',
        '7/12': 'h-7/12',
        '8/12': 'h-8/12',
        '9/12': 'h-9/12',
        '10/12': 'h-10/12',
        '11/12': 'h-11/12',
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
    // Component recipes (accordion baseline)
    accordion: {
      root: 'w-full',
      trigger: 'flex w-full items-center justify-between text-left',
      content: '',
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

// DELTA PACK: New token types
export type GridTokens = DesignTokens['foundation']['layout']['grid'];
export type FlexTokens = DesignTokens['foundation']['layout']['flex'];
export type ObjectTokens = DesignTokens['foundation']['layout']['object'];
export type AspectTokens = DesignTokens['foundation']['layout']['aspect'];
export type OverflowTokens = DesignTokens['foundation']['layout']['overflow'];
export type OverscrollTokens = DesignTokens['foundation']['layout']['overscroll'];
export type WhitespaceTokens = DesignTokens['foundation']['layout']['whitespace'];
export type BreakTokens = DesignTokens['foundation']['layout']['break'];
export type SelectTokens = DesignTokens['foundation']['layout']['select'];
export type CursorTokens = DesignTokens['foundation']['layout']['cursor'];
export type ResizeTokens = DesignTokens['foundation']['layout']['resize'];

// Motion-specific types
export type MotionComponentsTokens = DesignTokens['foundation']['motionComponents'];
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
      display: z.record(z.string()),
      alignment: z.record(z.string()),
      grid: z.object({
        columns: z.record(z.string()),
        gap: z.record(z.string()),
        responsive: z.record(z.string()),
        // Advanced grid patterns
        flow: z.record(z.string()),
        autoCols: z.record(z.string()),
        autoRows: z.record(z.string()),
        span: z.record(z.string()),
      }),
      flex: z.object({
        direction: z.record(z.string()),
        alignment: z.record(z.string()),
        items: z.record(z.string()),
        justify: z.record(z.string()),
        wrap: z.record(z.string()),
        // Advanced flexbox patterns
        grow: z.record(z.string()),
        content: z.record(z.string()),
        self: z.record(z.string()),
        place: z.record(z.string()),
      }),
      // Object positioning and aspect ratios
      object: z.record(z.string()),
      aspect: z.record(z.string()),
      // Overflow and overscroll patterns
      overflow: z.object({
        hidden: z.string(),
        auto: z.string(),
        scroll: z.string(),
        visible: z.string(),
        clip: z.string(),
        x: z.record(z.string()),
        y: z.record(z.string()),
      }),
      overscroll: z.object({
        auto: z.string(),
        contain: z.string(),
        none: z.string(),
        x: z.record(z.string()),
        y: z.record(z.string()),
      }),
      // Text wrapping and selection
      whitespace: z.record(z.string()),
      break: z.record(z.string()),
      select: z.record(z.string()),
      // Cursor and resize patterns
      cursor: z.record(z.string()),
      resize: z.record(z.string()),
      spacing: z.object({
        stack: z.record(z.string()),
        cluster: z.record(z.string()),
        responsive: z.record(z.string()),
      }),
      position: z.record(z.string()),
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
    
    // Transform validation
    transform: z.object({
      scale: z.record(z.string()),
      rotate: z.record(z.string()),
      translate: z.record(z.string()),
      skew: z.record(z.string()),
      origin: z.record(z.string()),
      style: z.record(z.string()),
    }),
    
    // Filter validation
    filter: z.object({
      blur: z.record(z.string()),
      brightness: z.record(z.string()),
      contrast: z.record(z.string()),
      grayscale: z.record(z.string()),
      hueRotate: z.record(z.string()),
      invert: z.record(z.string()),
      saturate: z.record(z.string()),
      sepia: z.record(z.string()),
      dropShadow: z.record(z.string()),
    }),
    
    // Animation validation
    animation: z.object({
      name: z.record(z.string()),
      duration: z.record(z.string()),
      timing: z.record(z.string()),
      delay: z.record(z.string()),
      iteration: z.record(z.string()),
      fill: z.record(z.string()),
    }),
    
    // Positioning validation
    positioning: z.object({
      top: z.record(z.string()),
      right: z.record(z.string()),
      bottom: z.record(z.string()),
      left: z.record(z.string()),
      inset: z.record(z.string()),
    }),
    
    // Interaction validation
    interaction: z.object({
      group: z.record(z.string()),
      data: z.record(z.string()),
      print: z.record(z.string()),
      orientation: z.record(z.string()),
      motion: z.record(z.string()),
      contrast: z.record(z.string()),
      forcedColors: z.record(z.string()),
      supports: z.record(z.string()),
    }),
    
    // Container validation
    container: z.object({
      type: z.record(z.string()),
      query: z.record(z.string()),
    }),
    
    // Fractional validation
    fractional: z.object({
      width: z.record(z.string()),
      height: z.record(z.string()),
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
  const categoryObj = ENHANCED_DESIGN_TOKENS.foundation.color[category];
  return (categoryObj as Record<string, string>)[key];
};

export const getLayoutToken = (category: keyof LayoutTokens, key: string) => {
  const categoryObj = ENHANCED_DESIGN_TOKENS.foundation.layout[category];
  return (categoryObj as Record<string, string>)[key];
};

export const getTypographyToken = (category: keyof TypographyTokens, key: string) => {
  const categoryObj = ENHANCED_DESIGN_TOKENS.foundation.typography[category];
  return (categoryObj as Record<string, string>)[key];
};

export const getElevationToken = (key: keyof ElevationTokens) => {
  return ENHANCED_DESIGN_TOKENS.foundation.elevation[key];
};

export const getZIndexToken = (key: keyof ZIndexTokens) => {
  return ENHANCED_DESIGN_TOKENS.foundation.zIndex[key];
};

export const getBackdropToken = (category: keyof BackdropTokens, key: string) => {
  const categoryObj = ENHANCED_DESIGN_TOKENS.foundation.backdrop[category];
  return (categoryObj as Record<string, string>)[key];
};

// ---------------------------------------------------------------------------
// Minimal SSOT-compatible helpers (class-returning)
// ---------------------------------------------------------------------------

// Named z-index layers backed by Tailwind theme.extend.zIndex
export type ZIndexNamedLayer = 'surface' | 'overlay' | 'popover' | 'modal' | 'toast' | 'tooltip';
export const getZIndexClass = (name: ZIndexNamedLayer): `z-${ZIndexNamedLayer}` => `z-${name}`;

// Motion helpers mapped to existing token maps
export const getMotionPattern = (
  pattern: keyof typeof ENHANCED_DESIGN_TOKENS.foundation.motionPatterns
) => ENHANCED_DESIGN_TOKENS.foundation.motionPatterns[pattern];

export const getComponentMotion = (
  component: keyof typeof ENHANCED_DESIGN_TOKENS.foundation.motionComponents
) => ENHANCED_DESIGN_TOKENS.foundation.motionComponents[component];

export const getMotionPreset = (
  preset: keyof typeof ENHANCED_DESIGN_TOKENS.foundation.motionTransition
) => ENHANCED_DESIGN_TOKENS.foundation.motionTransition[preset];

// Tailwind reduced motion variant helper (returns variant prefix)
export const getReducedMotionVariant = (preferSafe: boolean = true) =>
  preferSafe ? 'motion-safe' : 'motion-reduce';

// ---------------------------------------------------------------------------
// Back-compat motion helpers (to replace legacy motion-utils imports)
// ---------------------------------------------------------------------------

export type AdaptiveMotionOptions = {
  respectReducedMotion?: boolean;
  respectHighContrast?: boolean;
};

export function prefersReducedMotion(): boolean {
  if (typeof globalThis === 'undefined' || !globalThis.matchMedia) return false;
  return globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function getAdaptiveMotionClasses(
  pattern: keyof typeof ENHANCED_DESIGN_TOKENS.foundation.motionPatterns |
    keyof typeof ENHANCED_DESIGN_TOKENS.foundation.motionComponents,
  options: AdaptiveMotionOptions = {}
): string {
  const { respectReducedMotion = true } = options;

  if (respectReducedMotion && prefersReducedMotion()) {
    return ENHANCED_DESIGN_TOKENS.foundation.motionAccessibility.motionReduceNone;
  }

  const patterns = ENHANCED_DESIGN_TOKENS.foundation.motionPatterns as Record<string, string>;
  const components = ENHANCED_DESIGN_TOKENS.foundation.motionComponents as Record<string, string>;

  if (pattern in patterns) {
    const cls = patterns[pattern as string];
    if (cls) return cls;
  }
  if (pattern in components) {
    const cls = components[pattern as string];
    if (cls) return cls;
  }

  return ENHANCED_DESIGN_TOKENS.foundation.motionTransition.all;
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default ENHANCED_DESIGN_TOKENS;
