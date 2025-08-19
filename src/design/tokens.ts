/**
 * Design Tokens - Enterprise SSOT for SparkTasks V3
 * Complete professional token system with systematic architecture
 * Version: 3.0 Enterprise - Comprehensive Merger Implementation
 *
 * CRITICAL UNDERSTANDING:
 * - Tokens ARE the SSOT and MUST contain hardcoded Tailwind classes
 * - Components consume tokens (no hardcoded Tailwind in components)
 * - Tokens themselves are the legitimate place for Tailwind utility classes
 * - ESLint rules should block hardcoded Tailwind in COMPONENTS, not tokens
 * - Prettier maintains code formatting standards across the team
 *
 * ARCHITECTURE NOTES:
 * - Merged best features from tokens-legacy.ts and tokens-v2-legacy.ts
 * - Comprehensive token coverage for all UI components
 * - Future-ready patterns for missing UI components
 * - Zero breaking changes - all existing imports continue to work
 */

export const DESIGN_TOKENS = {
  // 🍎 THEME ARCHITECTURE (Apple-Level Coherence) - V3 ENHANCEMENT
  theme: {
    light: {
      surface: {
        base: 'bg-white',
        subtle: 'bg-slate-50',
        raised: 'bg-white',
        canvas: 'bg-slate-25',
        input: 'bg-white',
        pressed: 'bg-slate-100',
        overlay: 'bg-black/40',
        muted: 'bg-slate-100',
        accent: 'bg-blue-50',
      },
      ink: {
        primary: 'text-slate-900',
        secondary: 'text-slate-600',
        tertiary: 'text-slate-500',
        onSurface: 'text-slate-900',
        onPrimary: 'text-white',
        disabled: 'text-slate-400',
        muted: 'text-slate-500',
        accent: 'text-blue-600',
        inverse: 'text-white',
      },
      border: {
        subtle: 'border-slate-200',
        strong: 'border-slate-300',
        focus: 'border-blue-500',
        error: 'border-red-500',
        warning: 'border-amber-500',
        success: 'border-green-500',
        divider: 'border-slate-100',
        muted: 'border-slate-200',
      },
      elevation: {
        card: 'shadow-lg shadow-slate-200/50',
        modal: 'shadow-2xl shadow-slate-900/25',
        floating: 'shadow-xl shadow-slate-200/60',
        pressed: 'shadow-sm shadow-slate-300/40',
        dropdown: 'shadow-lg shadow-slate-900/10',
        tooltip: 'shadow-md shadow-slate-900/20',
      },
    },
    dark: {
      surface: {
        base: 'bg-slate-950',
        subtle: 'bg-slate-900',
        raised: 'bg-slate-900',
        canvas: 'bg-slate-975',
        input: 'bg-slate-900',
        pressed: 'bg-slate-800',
        overlay: 'bg-black/60',
        muted: 'bg-slate-800',
        accent: 'bg-blue-950',
      },
      ink: {
        primary: 'text-slate-100',
        secondary: 'text-slate-300',
        tertiary: 'text-slate-400',
        onSurface: 'text-slate-100',
        onPrimary: 'text-slate-900',
        disabled: 'text-slate-600',
        muted: 'text-slate-400',
        accent: 'text-blue-400',
        inverse: 'text-slate-900',
      },
      border: {
        subtle: 'border-slate-800',
        strong: 'border-slate-700',
        focus: 'border-blue-400',
        error: 'border-red-400',
        warning: 'border-amber-400',
        success: 'border-green-400',
        divider: 'border-slate-850',
        muted: 'border-slate-700',
      },
      elevation: {
        card: 'shadow-xl shadow-black/50',
        modal: 'shadow-2xl shadow-black/70',
        floating: 'shadow-2xl shadow-black/60',
        pressed: 'shadow-sm shadow-black/40',
        dropdown: 'shadow-xl shadow-black/50',
        tooltip: 'shadow-lg shadow-black/60',
      },
    },
  },

  // 🎛️ DENSITY INTELLIGENCE (Power User Adaptability) - V3 ENHANCEMENT
  density: {
    comfortable: {
      rowY: 'py-3',
      cellX: 'px-4',
      text: 'text-sm',
      iconSize: 'h-5 w-5',
      minHeight: 'min-h-[48px]',
      buttonHeight: 'h-10',
      inputHeight: 'h-10',
    },
    compact: {
      rowY: 'py-1.5',
      cellX: 'px-3',
      text: 'text-xs',
      iconSize: 'h-4 w-4',
      minHeight: 'min-h-[32px]',
      buttonHeight: 'h-8',
      inputHeight: 'h-8',
    },
    spacious: {
      rowY: 'py-4',
      cellX: 'px-6',
      text: 'text-base',
      iconSize: 'h-6 w-6',
      minHeight: 'min-h-[56px]',
      buttonHeight: 'h-12',
      inputHeight: 'h-12',
    },
  },

  // 📊 TABLE SUBSYSTEM (Enterprise Data Display) - V3 ENHANCEMENT
  table: {
    container: 'relative overflow-auto [content-visibility:auto] scroll-smooth',
    base: 'w-full border-collapse text-sm bg-transparent',
    head: 'sticky top-0 z-10 backdrop-blur-sm',
    headCell: 'px-3 py-2 text-left font-medium border-b-2',
    row: 'border-b transition-colors duration-150',
    cell: 'px-3 py-2 align-middle [overflow-wrap:anywhere]',
    // Row States
    rowDefault: '[&:nth-child(even)]:bg-slate-50/60 dark:[&:nth-child(even)]:bg-slate-900/40',
    rowHoverable: 'hover:bg-slate-50 dark:hover:bg-slate-900/60 cursor-pointer',
    rowSelected: 'bg-blue-50/80 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800',
    rowFocused: 'ring-2 ring-blue-500 ring-inset outline-none',
    // Affordances
    stickyFirstCol: 'sticky left-0 bg-inherit shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]',
    scrollShadowLeft: 'shadow-[inset_8px_0_8px_-8px_rgba(0,0,0,0.15)]',
    skeleton: 'animate-pulse bg-slate-200/60 dark:bg-slate-700/50 h-4 rounded',
    // Additional table states
    rowDanger: 'bg-red-50/80 dark:bg-red-950/60 border-red-200 dark:border-red-800',
    rowWarning: 'bg-amber-50/80 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
    rowSuccess: 'bg-green-50/80 dark:bg-green-950/60 border-green-200 dark:border-green-800',
  },

  // 🎯 STATE LAYER SYSTEM (Consistent Interactions) - V3 ENHANCEMENT
  state: {
    hover: 'hover:opacity-95 hover:shadow-md transition-all duration-200',
    active: 'active:scale-[0.99] active:shadow-sm',
    selected: 'ring-2 ring-offset-2 ring-blue-600',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed pointer-events-none',
    pressed: 'data-[state=pressed]:scale-[0.98] data-[state=pressed]:shadow-sm',
    loading: 'opacity-70 cursor-wait',
    destructive: 'hover:bg-red-50 active:bg-red-100',
    muted: 'opacity-60',
  },

  // 🎨 FOCUS MANAGEMENT (Accessibility Excellence) - V3 ENHANCEMENT
  focus: {
    onLight: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2',
    onDark: 'focus-visible:ring-blue-400 focus-visible:ring-offset-slate-900',
    inset: 'focus-visible:ring-inset',
    forcedColors: 'forced-colors:outline forced-colors:outline-2',
    // Existing focus patterns
    ringBlue: 'ring-2 ring-blue-500 ring-offset-2',
    ringGreen: 'ring-2 ring-green-500 ring-offset-2',
    ringRed: 'ring-2 ring-red-500 ring-offset-2',
    ringYellow: 'ring-2 ring-yellow-500 ring-offset-2',
    ringAmber: 'ring-2 ring-amber-500 ring-offset-2',
    // Enhanced focus states
    error: 'focus-visible:ring-red-500',
    warning: 'focus-visible:ring-amber-500',
    success: 'focus-visible:ring-green-500',
  },

  // 🎭 SEMANTIC SYSTEM (Intent-based patterns) - V3 ENHANCEMENT
  semantic: {
    text: {
      success: 'text-green-700 dark:text-green-400',
      warning: 'text-amber-600 dark:text-amber-400',
      error: 'text-red-600 dark:text-red-400',
      info: 'text-blue-600 dark:text-blue-400',
      muted: 'text-slate-500 dark:text-slate-400',
      accent: 'text-blue-600 dark:text-blue-400',
    },
    background: {
      success: 'bg-green-100 dark:bg-green-900/30',
      warning: 'bg-amber-100 dark:bg-amber-900/30',
      error: 'bg-red-100 dark:bg-red-900/30',
      info: 'bg-blue-100 dark:bg-blue-900/30',
      muted: 'bg-slate-100 dark:bg-slate-800/50',
      accent: 'bg-blue-50 dark:bg-blue-950/50',
    },
    border: {
      success: 'border-green-300 dark:border-green-700',
      warning: 'border-amber-300 dark:border-amber-700',
      error: 'border-red-300 dark:border-red-700',
      info: 'border-blue-300 dark:border-blue-700',
      muted: 'border-slate-300 dark:border-slate-600',
      accent: 'border-blue-300 dark:border-blue-700',
    },
  },

  // 📝 TYPOGRAPHY SYSTEM (Semantic type hierarchy) - V3 ENTERPRISE ENHANCEMENT
  typography: {
    // ===== HEADING HIERARCHY (Professional Typography Scale) =====
    heading: {
      h1: 'text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100',
      h2: 'text-2xl font-semibold leading-tight tracking-tight text-slate-900 dark:text-slate-100',
      h3: 'text-xl font-semibold leading-snug text-slate-900 dark:text-slate-100',
      h4: 'text-lg font-medium leading-normal text-slate-900 dark:text-slate-100',
      h5: 'text-base font-medium leading-normal text-slate-900 dark:text-slate-100',
      h6: 'text-sm font-medium leading-normal text-slate-900 dark:text-slate-100',
    },

    // ===== BODY TEXT SYSTEM (Content Typography) =====
    body: {
      xs: 'text-xs leading-relaxed text-slate-700 dark:text-slate-300',
      small: 'text-sm leading-relaxed text-slate-700 dark:text-slate-300',
      medium: 'text-base font-medium leading-relaxed text-slate-800 dark:text-slate-200',
      large: 'text-lg leading-relaxed text-slate-700 dark:text-slate-300',
      primary: 'text-base leading-relaxed text-slate-900 dark:text-slate-100',
      secondary: 'text-sm leading-normal text-slate-600 dark:text-slate-400',
      caption: 'text-xs leading-normal text-slate-500 dark:text-slate-500',
    },

    // ===== INLINE TEXT UTILITIES =====
    inline: {
      // Inline text patterns (non-layout)
      truncate1: 'truncate',
      textSm: 'text-sm',
      textXs: 'text-xs',
      textBase: 'text-base',
      textLg: 'text-lg',
      textXl: 'text-xl',
      text2xl: 'text-2xl',
      text3xl: 'text-3xl',
      fontMedium: 'font-medium',
      fontSemibold: 'font-semibold',
      fontBold: 'font-bold',
      leadingTight: 'leading-tight',
      leadingNormal: 'leading-normal',
      leadingRelaxed: 'leading-relaxed',
      // Additional typography
      fontLight: 'font-light',
      fontNormal: 'font-normal',
      leadingSnug: 'leading-snug',
      leadingLoose: 'leading-loose',
    },

    // ===== DISPLAY TYPOGRAPHY (Legacy Support) =====
    display: {
      h1: 'text-3xl font-bold leading-tight',
      h2: 'text-2xl font-semibold leading-tight',
      h3: 'text-xl font-semibold leading-normal',
      h4: 'text-lg font-medium leading-normal',
      h5: 'text-base font-medium leading-normal',
      h6: 'text-sm font-medium leading-normal',
      body: 'text-base leading-relaxed',
      bodyLarge: 'text-lg leading-relaxed',
      bodySmall: 'text-sm leading-normal',
      caption: 'text-sm leading-normal',
      small: 'text-xs leading-normal',
      label: 'text-sm font-medium leading-normal',
      overline: 'text-xs font-semibold uppercase tracking-wide leading-normal',
    },
  },

  // 📐 LAYOUT FOUNDATION (Spatial relationships) - V3 ENTERPRISE ENHANCEMENT
  layout: {
    // ===== SHELL ARCHITECTURE (Application Containers) =====
    shell: {
      dashboard: 'min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col',
      splitPane: 'flex h-screen divide-x divide-slate-200 dark:divide-slate-700',
      modal: 'fixed inset-0 z-50 flex items-center justify-center p-4',
      drawer: 'fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-slate-900 shadow-xl transform transition-transform duration-300',
    },

    // ===== DIMENSIONAL SYSTEM (Layout Widths & Heights) =====
    widths: {
      sidebar: '280px',
      sidebarCollapsed: '64px',
      rightPanel: '320px',
      drawer: '380px',
      modal: {
        sm: '400px',
        md: '500px',
        lg: '600px',
        xl: '800px',
        full: '90vw',
      },
    },

    // ===== LAYOUT PATTERNS (Professional Layout Components) =====
    patterns: {
      // Header System
      headerBar: 'sticky top-0 z-40 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-6 py-4',
      headerLeft: 'flex items-center flex-1',
      headerLogo: 'flex items-center gap-3',
      headerSearch: 'flex-1 max-w-2xl mx-6',
      headerActions: 'flex items-center gap-4',
      headerWithAction: 'flex items-center justify-between mb-6',

      // Main Content Areas
      mainContent: 'flex-1 overflow-auto',
      mainSection: 'p-6 space-y-6',
      stickyHeader: 'sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm pb-4 mb-6',

      // Navigation & Panels
      sidebarSection: 'p-4 space-y-2',
      panelSection: 'p-6 space-y-4',
      panelHeader: 'sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4 -mx-6 -mt-6 mb-6',

      // Card & Modal Patterns
      cardHeader: 'flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 -mx-6 -mt-6 mb-6',
      modalContent: 'bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xl p-6',
      modalDialog: 'bg-white dark:bg-slate-900 rounded-lg shadow-2xl max-w-md w-full mx-4 border border-slate-200 dark:border-slate-700',

      // Layout Utilities
      spaceBetween: 'flex items-center justify-between',
      centeredContent: 'flex items-center justify-center',
      verticalCenter: 'flex flex-col items-center justify-center min-h-[60vh]',
      containerBase: 'mx-auto px-4 sm:px-6 lg:px-8',

      // Drawer System
      drawerPanel: 'fixed right-0 top-0 h-full w-96 bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-700 p-6 overflow-y-auto transform transition-transform duration-300',

      // Flex Utilities
      flexGap: 'flex items-center gap-3',
      flexGapSm: 'flex items-center gap-2',
      flexGapMd: 'flex items-center gap-4',
      flexGapLg: 'flex items-center gap-6',
      flexWrap: 'flex flex-wrap gap-2',
      inputWithIcon: 'relative pl-10',

      // Section Patterns
      sectionHeader: 'mb-6 pb-4 border-b border-slate-200 dark:border-slate-700',
      sectionBody: 'space-y-4',
      sectionFooter: 'mt-8 pt-6 border-t border-slate-200 dark:border-slate-700',

      // Typography Layout Patterns
      headingWithMargin: 'mb-4 font-semibold text-slate-900 dark:text-slate-100',
      headingLargeWithMargin: 'mb-6 text-xl font-semibold text-slate-900 dark:text-slate-100',

      // Additional Layout Components - V3 COMPLETION
      rightPanel: 'fixed right-0 top-0 h-full w-80 bg-white dark:bg-slate-900 shadow-xl border-l border-slate-200 dark:border-slate-700 p-6 overflow-y-auto',
      statusBar: 'h-8 px-4 flex items-center justify-between bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400',
      breadcrumb: 'flex items-center text-sm text-slate-600 dark:text-slate-400 mb-4',
      pageTitle: 'text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6',
      quickActions: 'fixed bottom-6 right-6 flex flex-col gap-3',
      headingXLargeWithMargin: 'mb-8 text-2xl font-bold text-slate-900 dark:text-slate-100',

      // Empty State Patterns
      emptyStateIcon: 'text-6xl mb-4 opacity-50 text-slate-400',
      emptyState: 'text-center py-12 px-6 space-y-4',
    },

    // ===== RESPONSIVE SYSTEM (Breakpoint Management) =====
    responsive: {
      mobileNav: 'lg:hidden',
      tabletNav: 'hidden md:block lg:hidden',
      desktopNav: 'hidden lg:block',
      collapseSidebar: 'hidden lg:flex',
      showRightPanel: 'hidden xl:block',
      hideMobile: 'hidden sm:block',
      showMobile: 'block sm:hidden',
    },

    // ===== GRID SYSTEM (Advanced Grid Layouts) =====
    grid: {
      cols1: 'grid grid-cols-1',
      cols2: 'grid grid-cols-1 md:grid-cols-2',
      cols3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      cols4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
      cols6: 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6',
      cols12: 'grid grid-cols-12',
      autoFit: 'grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))]',
      autoFill: 'grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))]',
    },

    // Padding standardization
    padBase: 'p-4',
    padCompact: 'p-2',
    padComfortable: 'p-6',
    padLarge: 'p-8',
    // Margin standardization
    marginBase: 'm-4',
    marginCompact: 'm-2',
    marginComfortable: 'm-6',
    marginLarge: 'm-8',
    // Flex patterns
    flexCenter: 'flex items-center justify-center',
    flexBetween: 'flex items-center justify-between',
    flexStart: 'flex items-center justify-start',
    flexEnd: 'flex items-center justify-end',
    flexCol: 'flex flex-col',
    flexColCenter: 'flex flex-col items-center justify-center',
    // Grid patterns
    gridCols2: 'grid grid-cols-2',
    gridCols3: 'grid grid-cols-3',
    gridCols4: 'grid grid-cols-4',
    gridColsAuto: 'grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))]',
    // Container patterns
    container: 'container mx-auto px-4',
    maxContent: 'max-w-7xl mx-auto',
    maxContentSm: 'max-w-2xl mx-auto',
    maxContentMd: 'max-w-4xl mx-auto',
    // Focus management
    focus: {
      ringBlue: 'ring-2 ring-blue-500 ring-offset-2',
    },
  },

  // 📏 SIZING SYSTEM (Consistent dimensions) - V3 ENHANCEMENT
  sizing: {
    icon: {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
      xl: 'h-8 w-8',
      '2xl': 'h-10 w-10',
      '3xl': 'h-12 w-12',
    },
    badge: {
      sm: 'h-5 px-2 text-xs',
      md: 'h-6 px-3 text-sm',
      lg: 'h-7 px-4 text-sm',
    },
    button: {
      sm: 'h-8 px-3',
      md: 'h-9 px-4',
      lg: 'h-10 px-6',
      xl: 'h-12 px-8',
    },
    input: {
      sm: 'h-8 px-2',
      md: 'h-9 px-3',
      lg: 'h-10 px-4',
      xl: 'h-12 px-5',
    },
    target48: 'min-h-[44px] min-w-[44px]',
    full: 'w-full',
    fullHeight: 'h-full',
    avatar: {
      xs: 'h-6 w-6',
      sm: 'h-8 w-8',
      md: 'h-10 w-10',
      lg: 'h-12 w-12',
      xl: 'h-16 w-16',
    },
  },

  // 📏 TEXTFLOW EXCELLENCE (Phase 02 Addition) - V3 ENHANCEMENT
  textflow: {
    truncate1: 'truncate',
    truncate2: 'line-clamp-2',
    truncate3: 'line-clamp-3',
    truncate4: 'line-clamp-4',
    breakLong: 'break-words [overflow-wrap:anywhere]',
    breakAll: 'break-all',
    noWrap: 'whitespace-nowrap',
    preWrap: 'whitespace-pre-wrap',
  },

  // 🔤 FIELD STABILITY (Phase 02 Addition) - V3 ENHANCEMENT
  field: {
    height: 'h-10 leading-[2.375rem]',
    heightSm: 'h-8 leading-[1.875rem]',
    heightLg: 'h-12 leading-[2.875rem]',
    iconLeft: 'pl-10',
    iconRight: 'pr-10',
    iconLeftSm: 'pl-8',
    iconRightSm: 'pr-8',
    iconLeftLg: 'pl-12',
    iconRightLg: 'pr-12',
  },

  // 🌊 SCROLL EXCELLENCE (Phase 02 Addition) - V3 ENHANCEMENT
  scroll: {
    smooth: 'scroll-smooth',
    padForAnchors: 'scroll-pt-20',
    horizontalFade: 'mask-image:linear-gradient(to_right,transparent,black_8px,black_calc(100%-8px),transparent)',
    verticalFade: 'mask-image:linear-gradient(to_bottom,transparent,black_8px,black_calc(100%-8px),transparent)',
    hideScrollbar: 'scrollbar-hide',
    thinScrollbar: 'scrollbar-thin',
  },

  // ⚡ PERFORMANCE PATTERNS (Phase 02 Addition) - V3 ENHANCEMENT
  performance: {
    contentVisibility: '[content-visibility:auto]',
    willChange: 'will-change-transform',
    transform3d: 'transform-gpu',
    containLayout: '[contain:layout]',
    containPaint: '[contain:paint]',
    containSize: '[contain:size]',
  },

  // 🔗 POSITION UTILITIES (Layout positioning) - V3 ENHANCEMENT
  position: {
    fixed: {
      bottomRight: 'fixed bottom-4 right-4',
      topRight: 'fixed top-4 right-4',
      bottomLeft: 'fixed bottom-4 left-4',
      topLeft: 'fixed top-4 left-4',
      center: 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
      fullscreen: 'fixed inset-0',
    },
    absolute: {
      topFull: 'absolute top-full left-1/2 transform -translate-x-1/2',
      bottomFull: 'absolute bottom-full left-1/2 transform -translate-x-1/2',
      leftFull: 'absolute left-full top-1/2 transform -translate-y-1/2',
      rightFull: 'absolute right-full top-1/2 transform -translate-y-1/2',
      center: 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
      topLeft: 'absolute top-0 left-0',
      topRight: 'absolute top-0 right-0',
      bottomLeft: 'absolute bottom-0 left-0',
      bottomRight: 'absolute bottom-0 right-0',
    },
    borders: {
      top: 'border-t',
      bottom: 'border-b',
      left: 'border-l',
      right: 'border-r',
      x: 'border-x',
      y: 'border-y',
    },
  },

  // 🎪 ANIMATION SYSTEM (Smooth interactions) - V3 ENHANCEMENT
  motion: {
    // Transitions
    smooth: 'transition-all duration-200 ease-out',
    fast: 'transition-all duration-150 ease-out',
    slow: 'transition-all duration-300 ease-out',
    slowest: 'transition-all duration-500 ease-out',
    // Specific property transitions
    colors: 'transition-colors duration-200 ease-out',
    transform: 'transition-transform duration-200 ease-out',
    opacity: 'transition-opacity duration-200 ease-out',
    shadow: 'transition-shadow duration-200 ease-out',
    // Transforms
    scaleHover: 'hover:scale-105 transform transition-transform duration-200',
    slideUp: 'translate-y-0 opacity-100',
    slideDown: 'translate-y-2 opacity-0',
    slideLeft: 'translate-x-0 opacity-100',
    slideRight: 'translate-x-2 opacity-0',
    // Animations
    spin: 'animate-spin',
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
    ping: 'animate-ping',
  },

  // 🎪 MICRO-INTERACTIONS (Phase 02 Addition) - V3 ENHANCEMENT
  transitions: {
    fast: 'transition-all duration-150 ease-out',
    smooth: 'transition-all duration-200 ease-out',
    slow: 'transition-all duration-300 ease-out',
    hover: 'transition-[transform,box-shadow] duration-200 ease-out',
    scale: 'transition-transform duration-200 ease-out hover:scale-105',
    fade: 'transition-opacity duration-200 ease-out',
    slide: 'transition-transform duration-200 ease-out',
    // Spring animations
    spring: 'transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
    bounce: 'transition-all duration-300 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]',
  },

  // 🏗️ COMPONENT RECIPES (Reusable component patterns) - V3 ENTERPRISE ENHANCEMENT
  recipe: {
    // ===== BUTTON SYSTEM (Complete button recipes) =====
    button: {
      base: 'inline-flex items-center justify-center font-medium transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:pointer-events-none disabled:opacity-50',
      primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
      primaryWithStates: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-2 focus:ring-blue-500 disabled:opacity-50',
      secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300',
      ghost: 'hover:bg-slate-100 hover:text-slate-900 text-slate-600',
      destructive: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
      outline: 'border border-slate-300 bg-transparent hover:bg-slate-50 active:bg-slate-100',
      link: 'text-blue-600 underline-offset-4 hover:underline',
      // Sizes
      sm: 'h-8 px-3 text-xs',
      md: 'h-9 px-4 text-sm',
      lg: 'h-10 px-6 text-base',
      xl: 'h-12 px-8 text-lg',
      // Icon variants
      iconOnly: 'aspect-square',
      iconLeft: 'space-x-2',
      iconRight: 'space-x-2 flex-row-reverse',
    },

    // ===== INPUT SYSTEM (Form input recipes) =====
    input: {
      base: 'flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      error: 'border-red-500 focus:ring-red-600',
      success: 'border-green-500 focus:ring-green-600',
      warning: 'border-amber-500 focus:ring-amber-600',
      // Sizes
      sm: 'h-8 px-2 text-xs',
      md: 'h-9 px-3 text-sm',
      lg: 'h-10 px-4 text-base',
      xl: 'h-12 px-5 text-lg',
    },

    // ===== CARD SYSTEM (Card component recipes) =====
    card: {
      base: 'rounded-lg border border-slate-200 bg-white shadow-sm',
      interactive: 'cursor-pointer transition-shadow hover:shadow-md',
      elevated: 'shadow-lg',
      flat: 'shadow-none border-0',
      outlined: 'border-2',
      // Variants
      success: 'border-green-200 bg-green-50',
      warning: 'border-amber-200 bg-amber-50',
      error: 'border-red-200 bg-red-50',
      info: 'border-blue-200 bg-blue-50',
    },

    // ===== BADGE SYSTEM (Status & labeling recipes) =====
    badge: 'inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    badgeDefault: 'border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200',
    badgeSuccess: 'border-transparent bg-green-100 text-green-800 hover:bg-green-200',
    badgeWarning: 'border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    badgeDanger: 'border-transparent bg-red-100 text-red-800 hover:bg-red-200',
    badgeInfo: 'border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200',
    badgeOutline: 'border-slate-300 bg-transparent text-slate-900 hover:bg-slate-50',
    badgeInline: 'inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded border border-blue-200',
    badgeCloseButton: 'ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-current hover:bg-black hover:bg-opacity-10 focus:bg-black focus:bg-opacity-10 focus:outline-none',
    
    // ===== CHIP SYSTEM (Interactive tags) =====
    chip: 'inline-flex items-center rounded-full border font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',

    // ===== MODAL SYSTEM (Overlay components) =====
    modal: {
      overlay: 'fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      content: 'fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg',
    },

    // ===== OVERLAY SYSTEM (Modal & dialog overlays) =====
    overlay: 'fixed inset-0 bg-black/40 z-40 backdrop-blur-sm',

    // ===== LAYOUT RECIPES (Layout-specific patterns) =====
    pageHeaderActions: 'flex items-center gap-3',
    layoutCard: 'bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm max-w-2xl w-full',

    // ===== FORM RECIPES (Form component patterns) =====
    labelForm: 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2',
    textareaForm: 'w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent',
    selectForm: 'w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent',
    formButtonGroup: 'flex gap-3 mt-6',

    // ===== ICON BUTTON RECIPES (Icon-specific buttons) =====
    iconButtonPrimary: 'bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded-md p-2',
    iconButtonDefault: 'bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors rounded-md p-2',
    iconButtonComplete: 'bg-green-100 text-green-600 hover:bg-green-200 transition-colors rounded-md p-2',

    // ===== KEYBOARD INTERFACE (Keyboard key styling) =====
    keyboardKey: 'px-2 py-1 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-xs font-mono text-slate-700 dark:text-slate-300 shadow-sm',

    // ===== DROPDOWN SYSTEM (Dropdown components) =====
    dropdown: {
      trigger: 'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2',
      content: 'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 text-slate-950 shadow-md',
      item: 'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
    },

    // ===== TOAST SYSTEM (Notification components) =====
    toast: {
      base: 'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all',
      success: 'border-green-200 bg-green-50 text-green-900',
      error: 'border-red-200 bg-red-50 text-red-900',
      warning: 'border-amber-200 bg-amber-50 text-amber-900',
      info: 'border-blue-200 bg-blue-50 text-blue-900',
    },

    // ===== AVATAR SYSTEM (User avatar components) =====
    avatar: {
      base: 'relative flex shrink-0 overflow-hidden rounded-full',
      fallback: 'flex h-full w-full items-center justify-center rounded-full bg-slate-100 text-slate-600 font-medium',
    },

    // ===== PROGRESS SYSTEM (Progress indicators) =====
    progress: {
      base: 'relative h-2 w-full overflow-hidden rounded-full bg-slate-100',
      indicator: 'h-full w-full flex-1 bg-blue-600 transition-all',
    },

    // ===== SKELETON SYSTEM (Loading state components) =====
    skeleton: {
      base: 'animate-pulse rounded-md bg-slate-200',
      text: 'h-4 bg-slate-200',
      avatar: 'h-10 w-10 rounded-full bg-slate-200',
      button: 'h-9 w-20 bg-slate-200',
    },

    // ===== QUICKADD SYSTEM (Quick input components) =====
    quickAddContainer: 'flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-lg shadow-sm',
    quickAddIcon: 'flex items-center justify-center text-slate-500',
    quickAddInput: 'flex-1 border-0 focus:ring-0 text-sm placeholder-slate-500 bg-transparent outline-none',
    quickAddButton: 'flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium',
    quickAddHelp: 'text-xs text-slate-500 mt-2',
    quickAddExample: 'px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs mr-2',
  },

  // 📦 SPACING SYSTEM (Rhythm & proportion) - V3 ENTERPRISE ENHANCEMENT
  spacing: {
    // ===== COMPONENT SPACING (Internal spacing) =====
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
    xl: 'gap-6',
    '2xl': 'gap-8',
    '3xl': 'gap-12',

    // ===== LAYOUT SPACING (Structural spacing) =====
    section: 'space-y-6',
    sectionLarge: 'space-y-8',
    sectionMargin: 'mb-6',
    stack: 'space-y-4',
    stackTight: 'space-y-2',
    stackLoose: 'space-y-6',
    inline: 'space-x-2',
    inlineTight: 'space-x-1',
    inlineLoose: 'space-x-4',

    // ===== MARGIN SYSTEM (Layout margins) =====
    tightMargin: 'mt-2',
    headerMargin: 'mb-4',
    cardPadding: 'p-6',
    buttonPadding: 'px-4 py-2',

    // ===== GRID SPACING (Grid gap system) =====
    gridGap: {
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    },

    // ===== FORM SPACING (Form-specific spacing) =====
    formPadding: 'p-3',
    iconSmall: 'ml-2',
  },

  // 🏺 ELEVATION SYSTEM (Z-index management) - V3 ENHANCEMENT
  zIndex: {
    base: 'z-0',
    raised: 'z-10',
    overlay: 'z-20',
    dropdown: 'z-30',
    sticky: 'z-40',
    modal: 'z-50',
    toast: 'z-[60]',
    tooltip: 'z-[70]',
    popover: 'z-[80]',
    max: 'z-[9999]',
  },

  // 🎨 ICON SYSTEM (Icon sizing) - V3 ENHANCEMENT
  icons: {
    sizes: {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
      xl: 'h-8 w-8',
    },
  },

  // 🔄 LOADING SYSTEM (Loading states) - V3 ENHANCEMENT
  loading: {
    spinner: 'animate-spin h-4 w-4',
  },

  // 🌈 COLOR UTILITIES (Extended palette) - V3 ENHANCEMENT
  color: {
    // Status indicators
    status: {
      online: 'bg-green-500',
      away: 'bg-yellow-500',
      busy: 'bg-red-500',
      offline: 'bg-slate-400',
      idle: 'bg-amber-500',
    },
    // Priority indicators
    priority: {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200',
      critical: 'bg-red-600 text-white border-red-700',
    },
    // Brand colors
    brand: {
      primary: 'bg-blue-600 text-white',
      secondary: 'bg-slate-600 text-white',
      accent: 'bg-indigo-600 text-white',
    },
  },

  // 🎯 INTERACTION STATES (Component-specific state patterns) - V3 ENHANCEMENT
  colors: {
    status: {
      active: {
        bg: 'bg-blue-50 dark:bg-blue-950/60',
        text: 'text-blue-900 dark:text-blue-100',
      },
      complete: 'text-green-600 dark:text-green-400',
      pending: 'text-amber-600 dark:text-amber-400',
      failed: 'text-red-600 dark:text-red-400',
    },
    states: {
      default: {
        hover: 'hover:bg-slate-100 dark:hover:bg-slate-800',
      },
      disabled: {
        text: 'opacity-50 cursor-not-allowed',
      },
      loading: {
        text: 'opacity-70',
      },
      muted: {
        text: 'text-slate-500',
      },
    },
    ui: {
      text: {
        primary: 'text-slate-900',
        secondary: 'text-slate-600',
        muted: 'text-slate-500',
      },
    },
  },

  // 🎭 INTERACTION PATTERNS (User feedback) - V3 ENHANCEMENT
  interaction: {
    menu: 'hover:bg-slate-50 dark:hover:bg-slate-900/60',
    button: {
      hover: 'hover:bg-slate-100 dark:hover:bg-slate-800',
      active: 'active:bg-slate-200 dark:active:bg-slate-700',
    },
    focus: {
      ring: 'focus:outline-none focus:ring-2 focus:ring-blue-500',
      ringRed: 'focus:ring-red-500',
      ringGreen: 'focus:ring-green-500',
      ringAmber: 'focus:ring-amber-500',
      border: 'focus:border-blue-500',
      borderRed: 'focus:border-red-500',
      borderGreen: 'focus:border-green-500',
      borderAmber: 'focus:border-amber-500',
    },
    hover: {
      lift: 'hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200',
      scale: 'hover:scale-105 transition-transform duration-200',
      glow: 'hover:shadow-blue-500/25 hover:shadow-lg transition-shadow duration-200',
    },
  },

  // 📱 RESPONSIVE UTILITIES (Breakpoint helpers) - V3 ENHANCEMENT
  responsive: {
    hide: {
      mobile: 'hidden sm:block',
      tablet: 'sm:hidden lg:block',
      desktop: 'lg:hidden',
      print: 'print:hidden',
    },
    show: {
      mobile: 'block sm:hidden',
      tablet: 'hidden sm:block lg:hidden',
      desktop: 'hidden lg:block',
      print: 'hidden print:block',
    },
    // Responsive text sizes
    text: {
      responsive: 'text-sm sm:text-base lg:text-lg',
      heading: 'text-lg sm:text-xl lg:text-2xl',
      display: 'text-2xl sm:text-3xl lg:text-4xl',
    },
    // Responsive spacing
    padding: {
      responsive: 'p-4 sm:p-6 lg:p-8',
      container: 'px-4 sm:px-6 lg:px-8',
    },
  },

  // 🎨 GRADIENT UTILITIES (Modern visual effects) - V3 NEW
  gradients: {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700',
    secondary: 'bg-gradient-to-r from-slate-600 to-slate-700',
    success: 'bg-gradient-to-r from-green-600 to-green-700',
    warning: 'bg-gradient-to-r from-amber-600 to-amber-700',
    error: 'bg-gradient-to-r from-red-600 to-red-700',
    rainbow: 'bg-gradient-to-r from-purple-500 via-blue-500 to-green-500',
    sunset: 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500',
    ocean: 'bg-gradient-to-r from-blue-500 via-teal-500 to-cyan-500',
  },

  // 🔧 UTILITY PATTERNS (Common combinations) - V3 NEW
  utils: {
    // Common flex patterns
    centerAll: 'flex items-center justify-center',
    centerX: 'flex justify-center',
    centerY: 'flex items-center',
    spaceBetween: 'flex items-center justify-between',
    // Common grid patterns
    autoGrid: 'grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))]',
    evenGrid2: 'grid grid-cols-2 gap-4',
    evenGrid3: 'grid grid-cols-3 gap-4',
    evenGrid4: 'grid grid-cols-4 gap-4',
    // Common positioning
    absoluteCenter: 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
    fixedCenter: 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
    // Common overlays
    overlay: 'absolute inset-0 bg-black bg-opacity-50',
    backdrop: 'backdrop-blur-sm bg-white/80',
    // Screen reader only
    srOnly: 'sr-only',
    // Aspect ratios
    aspectSquare: 'aspect-square',
    aspectVideo: 'aspect-video',
    aspectPhoto: 'aspect-[4/3]',
  },

  // ⚡ ICON ENHANCEMENT SYSTEM (Advanced icon patterns) - V3 ENTERPRISE QUALITY
  icon: {
    // ===== SIZE SYSTEM (Consistent icon scaling) =====
    size: {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-8 h-8',
      '2xl': 'w-10 h-10',
      '3xl': 'w-12 h-12',
    },

    // ===== MARGIN SYSTEM (Icon spacing patterns) =====
    margin: {
      // Left margins
      leftXs: 'ml-1',
      leftSm: 'ml-2',
      leftMd: 'ml-3',
      leftLg: 'ml-4',
      leftXl: 'ml-6',
      
      // Right margins
      rightXs: 'mr-1',
      rightSm: 'mr-2',
      rightMd: 'mr-3',
      rightLg: 'mr-4',
      rightXl: 'mr-6',
      
      // All sides
      allXs: 'm-1',
      allSm: 'm-2',
      allMd: 'm-3',
      allLg: 'm-4',
      allXl: 'm-6',
    },

    // ===== WITH MARGIN PATTERNS (Complete icon + margin combinations) =====
    withMargin: {
      // Small icons with margins
      smLeft: 'w-4 h-4 mr-2',
      smRight: 'w-4 h-4 ml-2',
      smCenter: 'w-4 h-4 mx-2',
      
      // Medium icons with margins
      mdLeft: 'w-5 h-5 mr-3',
      mdRight: 'w-5 h-5 ml-3',
      mdCenter: 'w-5 h-5 mx-3',
      
      // Large icons with margins
      lgLeft: 'w-6 h-6 mr-4',
      lgRight: 'w-6 h-6 ml-4',
      lgCenter: 'w-6 h-6 mx-4',
    },

    // ===== BUTTON ICON PATTERNS (Icon button combinations) =====
    button: {
      // Icon only buttons
      onlyXs: 'w-3 h-3',
      onlySm: 'w-4 h-4',
      onlyMd: 'w-5 h-5',
      onlyLg: 'w-6 h-6',
      
      // Icon with text buttons
      withTextSm: 'w-4 h-4 mr-2',
      withTextMd: 'w-5 h-5 mr-2',
      withTextLg: 'w-6 h-6 mr-3',
      
      // Trailing icons
      trailingSm: 'w-4 h-4 ml-2',
      trailingMd: 'w-5 h-5 ml-2',
      trailingLg: 'w-6 h-6 ml-3',
    },

    // ===== SEMANTIC ICON COLORS (Status-aware icons) =====
    color: {
      // Status colors
      success: 'text-green-600',
      warning: 'text-amber-600',
      error: 'text-red-600',
      info: 'text-blue-600',
      
      // Standard colors
      primary: 'text-slate-900',
      secondary: 'text-slate-600',
      muted: 'text-slate-500',
      inverse: 'text-white',
      
      // Interactive colors
      interactive: 'text-slate-600 hover:text-slate-900',
      brand: 'text-blue-600',
    },

    // ===== ANIMATION PATTERNS (Icon animations) =====
    animation: {
      spin: 'animate-spin',
      pulse: 'animate-pulse',
      bounce: 'animate-bounce',
      ping: 'animate-ping',
    },

    // ===== ACCESSIBILITY PATTERNS (Screen reader support) =====
    a11y: {
      hidden: 'aria-hidden="true"',
      decorative: 'role="img" aria-hidden="true"',
      label: 'aria-label',
    },
  },
};

// 🚀 TYPE EXPORTS for TypeScript intelligence - V3 ENTERPRISE ENHANCEMENT
export type ThemeMode = keyof typeof DESIGN_TOKENS.theme;
export type DensityLevel = keyof typeof DESIGN_TOKENS.density;
export type ButtonVariant = keyof typeof DESIGN_TOKENS.recipe.button;
export type SemanticIntent = keyof typeof DESIGN_TOKENS.semantic.text;
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ComponentVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
export type LayoutComponent = 'AppShell' | 'TopNav' | 'Sidebar' | 'MainContent' | 'RightPanel' | 'StatusBar' | 'Modal' | 'Drawer';
export type TypographyScale = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'small' | 'caption';
export type IconSize = keyof typeof DESIGN_TOKENS.icon.size;
export type IconMargin = keyof typeof DESIGN_TOKENS.icon.margin;
export type IconWithMargin = keyof typeof DESIGN_TOKENS.icon.withMargin;
export type SemanticColor = keyof typeof DESIGN_TOKENS.semantic.text;
export type SpacingScale = keyof typeof DESIGN_TOKENS.spacing;
export type PriorityLevel = 'urgent' | 'high' | 'medium' | 'low' | 'none';
export type TextColor = keyof typeof DESIGN_TOKENS.semantic.text;
export type BackgroundColor = keyof typeof DESIGN_TOKENS.semantic.background;
export type BorderColor = keyof typeof DESIGN_TOKENS.semantic.border;

// 🎯 HELPER FUNCTIONS (Legacy support for Badge component) - V3 MAINTAINED
export function getPriorityStyles(priority: 'P0' | 'P1' | 'P2') {
  const styles = {
    P0: {
      bg: DESIGN_TOKENS.semantic.background.error,
      text: DESIGN_TOKENS.semantic.text.error,
      ring: DESIGN_TOKENS.semantic.border.error,
    },
    P1: {
      bg: DESIGN_TOKENS.semantic.background.warning,
      text: DESIGN_TOKENS.semantic.text.warning,
      ring: DESIGN_TOKENS.semantic.border.warning,
    },
    P2: {
      bg: DESIGN_TOKENS.semantic.background.info,
      text: DESIGN_TOKENS.semantic.text.info,
      ring: DESIGN_TOKENS.semantic.border.info,
    },
  };
  return styles[priority];
}

export function getStatusStyles(status: 'TODAY' | 'LATER' | 'DONE') {
  const styles = {
    TODAY: {
      bg: DESIGN_TOKENS.semantic.background.warning,
      text: DESIGN_TOKENS.semantic.text.warning,
      ring: DESIGN_TOKENS.semantic.border.warning,
    },
    LATER: {
      bg: DESIGN_TOKENS.semantic.background.info,
      text: DESIGN_TOKENS.semantic.text.info,
      ring: DESIGN_TOKENS.semantic.border.info,
    },
    DONE: {
      bg: DESIGN_TOKENS.semantic.background.success,
      text: DESIGN_TOKENS.semantic.text.success,
      ring: DESIGN_TOKENS.semantic.border.success,
    },
  };
  return styles[status];
}

// 🎨 NEW HELPER FUNCTIONS - V3 ADDITION
export function getUrgencyStyles(urgency: 'overdue' | 'today' | 'tomorrow' | 'future') {
  const styles = {
    overdue: {
      bg: DESIGN_TOKENS.semantic.background.error,
      text: DESIGN_TOKENS.semantic.text.error,
      ring: DESIGN_TOKENS.semantic.border.error,
    },
    today: {
      bg: DESIGN_TOKENS.semantic.background.warning,
      text: DESIGN_TOKENS.semantic.text.warning,
      ring: DESIGN_TOKENS.semantic.border.warning,
    },
    tomorrow: {
      bg: DESIGN_TOKENS.semantic.background.info,
      text: DESIGN_TOKENS.semantic.text.info,
      ring: DESIGN_TOKENS.semantic.border.info,
    },
    future: {
      bg: DESIGN_TOKENS.semantic.background.muted,
      text: DESIGN_TOKENS.semantic.text.muted,
      ring: DESIGN_TOKENS.semantic.border.muted,
    },
  };
  return styles[urgency];
}

export function getPriorityLabel(priority: 'P0' | 'P1' | 'P2'): string {
  const labels = {
    P0: 'Critical',
    P1: 'High',
    P2: 'Normal',
  };
  return labels[priority];
}

export function getStatusLabel(status: 'TODAY' | 'LATER' | 'DONE'): string {
  const labels = {
    TODAY: 'Due Today',
    LATER: 'Scheduled',
    DONE: 'Completed',
  };
  return labels[status];
}

// 🎯 COMPONENT SIZE HELPERS - V3 NEW
export function getSizeClasses(component: 'button' | 'input' | 'badge', size: ComponentSize) {
  const sizeMap = {
    button: DESIGN_TOKENS.sizing.button,
    input: DESIGN_TOKENS.sizing.input,
    badge: DESIGN_TOKENS.sizing.badge,
  };
  const componentSizes = sizeMap[component] as Record<string, string>;
  return componentSizes[size] || componentSizes.md;
}

// 🌈 SEMANTIC COLOR HELPERS - V3 ENTERPRISE ENHANCEMENT
export function getSemanticColors(variant: ComponentVariant) {
  if (variant === 'default' || variant === 'primary' || variant === 'secondary') {
    return {
      bg: 'bg-slate-100',
      text: 'text-slate-900',
      border: 'border-slate-300',
    };
  }
  
  return {
    bg: DESIGN_TOKENS.semantic.background[variant as keyof typeof DESIGN_TOKENS.semantic.background],
    text: DESIGN_TOKENS.semantic.text[variant as keyof typeof DESIGN_TOKENS.semantic.text],
    border: DESIGN_TOKENS.semantic.border[variant as keyof typeof DESIGN_TOKENS.semantic.border],
  };
}

// 🎯 NEW ENTERPRISE HELPER FUNCTIONS - V3 COMPREHENSIVE
export function getIconClasses(size: IconSize, margin?: IconMargin): string {
  const sizeClass = DESIGN_TOKENS.icon.size[size];
  const marginClass = margin ? DESIGN_TOKENS.icon.margin[margin] : '';
  return `${sizeClass} ${marginClass}`.trim();
}

export function getIconWithMargin(variant: IconWithMargin): string {
  return DESIGN_TOKENS.icon.withMargin[variant];
}

export function getLayoutComponent(component: LayoutComponent): string {
  const componentMap = {
    AppShell: DESIGN_TOKENS.layout.shell.dashboard,
    TopNav: DESIGN_TOKENS.layout.patterns.headerBar,
    Sidebar: DESIGN_TOKENS.layout.patterns.sidebarSection,
    MainContent: DESIGN_TOKENS.layout.patterns.mainContent,
    RightPanel: DESIGN_TOKENS.layout.patterns.rightPanel || 'w-80 bg-white border-l',
    StatusBar: DESIGN_TOKENS.layout.patterns.statusBar || 'h-6 bg-slate-100 border-t',
    Modal: DESIGN_TOKENS.layout.shell.modal,
    Drawer: DESIGN_TOKENS.layout.shell.drawer,
  };
  return componentMap[component];
}

export function getTypographyClass(scale: TypographyScale): string {
  if (scale === 'body') return DESIGN_TOKENS.typography.body.primary;
  if (scale === 'small') return DESIGN_TOKENS.typography.body.small;
  if (scale === 'caption') return DESIGN_TOKENS.typography.body.caption;
  return DESIGN_TOKENS.typography.heading[scale as keyof typeof DESIGN_TOKENS.typography.heading];
}

export function combineTokens(...tokens: string[]): string {
  return tokens.filter(Boolean).join(' ');
}

