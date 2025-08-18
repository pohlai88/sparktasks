/**
 * Design Tokens - Single Source of Truth for SlackTasks
 * All components must use these tokens for consistent styling
 */

// Semantic Color System
export const DESIGN_TOKENS = {
  // Layout Architecture
  layout: {
    // Standard layout dimensions
    heights: {
      nav: '60px',
      footer: '48px',
      toolbar: '44px'
    },
    widths: {
      sidebar: '240px',
      sidebarCollapsed: '64px',
      rightPanel: '320px',
      maxContent: '1200px'
    },
    // Layout patterns
    shell: {
      dashboard: 'h-screen grid grid-rows-[60px_1fr]',
      splitPane: 'h-screen grid grid-rows-[60px_1fr] grid-cols-1 lg:grid-cols-2',
      threeColumn: 'grid grid-cols-[240px_1fr_320px] h-full'
    },
    // Responsive breakpoints for layout changes
    responsive: {
      collapseSidebar: 'lg:block hidden',
      showRightPanel: 'xl:block hidden',
      mobileNav: 'lg:hidden block',
      desktopOnly: 'hidden lg:block',
      mobileOnly: 'lg:hidden'
    },

    // Spacing system for layouts
    spacing: {
      section: 'space-y-8',
      component: 'space-y-6',
      element: 'space-y-4',
      tight: 'space-y-2',
      loose: 'space-y-12',
      page: 'p-6',
      card: 'p-4',
      button: 'px-4 py-2'
    },

    // Z-index layers
    zIndex: {
      base: 'z-0',
      dropdown: 'z-10',
      sticky: 'z-20',
      modal: 'z-40',
      toast: 'z-50'
    },

    // Common layout patterns
    patterns: {
      centeredContent: 'flex items-center justify-center',
      spaceBetween: 'flex items-center justify-between',
      verticalCenter: 'flex flex-col items-center justify-center',
      cardHover: 'transition-all duration-200 hover:shadow-md hover:scale-[1.02]',
      focusRing: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
      disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
      // Header layouts
      headerBar: 'flex items-center justify-between px-4 border-b bg-white/95 backdrop-blur-sm',
      headerLeft: 'flex items-center gap-4 flex-1',
      headerLogo: 'flex items-center gap-3',
      headerSearch: 'hidden md:flex flex-1 max-w-md',
      headerActions: 'flex items-center gap-2',
      // Content layouts
      stickyHeader: 'sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b px-6 py-4',
      mainSection: 'p-6',
      panelSection: 'p-4',
      sidebarSection: 'p-3',
      // Responsive patterns
      responsiveHide: 'hidden md:flex',
      responsiveShow: 'md:hidden',
      responsiveFlex: 'flex flex-1',
      // Modal patterns
      overlay: 'fixed inset-0 bg-black/25 backdrop-blur-sm',
      modal: 'bg-white rounded-xl shadow-xl border border-slate-200'
    }
  },

  colors: {
    // Priority Colors (Semantic)
    priority: {
      critical: {
        bg: 'bg-red-50',
        text: 'text-red-700', 
        ring: 'ring-red-600/20',
        border: 'border-red-200',
        hover: 'hover:bg-red-100'
      },
      important: {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        ring: 'ring-amber-600/20', 
        border: 'border-amber-200',
        hover: 'hover:bg-amber-100'
      },
      normal: {
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        ring: 'ring-slate-600/20',
        border: 'border-slate-200',
        hover: 'hover:bg-slate-100'
      }
    },
    
    // Status Colors
    status: {
      active: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        ring: 'ring-blue-600/20',
        hover: 'hover:bg-blue-100'
      },
      backlog: {
        bg: 'bg-slate-50', 
        text: 'text-slate-600',
        ring: 'ring-slate-600/20',
        hover: 'hover:bg-slate-100'
      },
      complete: {
        bg: 'bg-green-50',
        text: 'text-green-700',
        ring: 'ring-green-600/20',
        hover: 'hover:bg-green-100'
      }
    },

    // Urgency Colors (Due Dates)
    urgency: {
      overdue: {
        bg: 'bg-red-50',
        text: 'text-red-700', 
        ring: 'ring-red-600/20',
        icon: 'text-red-500'
      },
      today: {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        ring: 'ring-orange-600/20',
        icon: 'text-orange-500'
      },
      tomorrow: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        ring: 'ring-blue-600/20',
        icon: 'text-blue-500'
      },
      future: {
        bg: 'bg-slate-50',
        text: 'text-slate-600', 
        ring: 'ring-slate-600/20',
        icon: 'text-slate-500'
      }
    },

    // UI Colors
    ui: {
      background: 'bg-slate-50',
      surface: 'bg-white',
      border: 'border-slate-200/60',
      text: {
        primary: 'text-slate-900',
        secondary: 'text-slate-600', 
        muted: 'text-slate-400',
        inverse: 'text-white'
      },
      interactive: {
        primary: 'text-blue-600',
        secondary: 'text-slate-500',
        success: 'text-green-600',
        warning: 'text-orange-600',
        danger: 'text-red-600'
      }
    },

    // State variants (replaces all gray-* usage)
    states: {
      default: {
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        border: 'border-slate-200',
        hover: 'hover:bg-slate-100'
      },
      active: {
        bg: 'bg-blue-50', 
        text: 'text-blue-700',
        border: 'border-blue-200',
        hover: 'hover:bg-blue-100'
      },
      muted: {
        bg: 'bg-slate-100',
        text: 'text-slate-500',
        border: 'border-slate-300',
        hover: 'hover:bg-slate-200'
      },
      disabled: {
        bg: 'bg-slate-50',
        text: 'text-slate-400', 
        border: 'border-slate-200',
        hover: ''
      }
    }
  },

  // Interactive States
  interaction: {
    card: 'hover:shadow-md hover:border-slate-300/60 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 transition-all duration-200',
    button: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150',
    input: 'focus:border-blue-500 focus:ring-blue-500 focus:ring-1 transition-colors duration-150',
    menu: 'hover:bg-slate-50 focus:bg-slate-50 focus:outline-none',
    ghost: 'hover:bg-slate-100 hover:text-slate-600 transition-colors duration-150'
  },

  // Elevation System 
  elevation: {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  },

  // Spacing System
  spacing: {
    card: 'p-4 sm:p-5',
    cardCompact: 'p-3 sm:p-4',
    form: 'space-y-5',
    formCompact: 'space-y-3',
    stack: 'space-y-3',
    stackTight: 'space-y-2',
    inline: 'gap-1.5',
    inlineTight: 'gap-1'
  },

  // Typography System
  typography: {
    heading: {
      h1: 'text-2xl font-bold text-slate-900 leading-tight',
      h2: 'text-lg font-semibold text-slate-900 leading-6', 
      h3: 'text-base font-semibold text-slate-900 leading-6',
      h4: 'text-sm font-semibold text-slate-900'
    },
    body: {
      primary: 'text-sm text-slate-900 leading-relaxed',
      secondary: 'text-sm text-slate-600 leading-relaxed',
      caption: 'text-xs text-slate-500',
      small: 'text-xs text-slate-400'
    },
    label: 'text-sm font-semibold text-slate-900 mb-2',
    error: 'text-sm text-red-600 font-medium'
  },

  // Border Radius System
  radius: {
    sm: 'rounded-md',
    md: 'rounded-lg', 
    lg: 'rounded-xl',
    full: 'rounded-full'
  },

  // Icon System
  icons: {
    sizes: {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4', 
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-8 h-8'
    },
    spacing: {
      left: {
        xs: 'mr-1',
        sm: 'mr-1.5', 
        md: 'mr-2',
        lg: 'mr-3'
      },
      right: {
        xs: 'ml-1',
        sm: 'ml-1.5',
        md: 'ml-2', 
        lg: 'ml-3'
      }
    },
    // Common icon patterns for components
    badge: 'w-3 h-3 mr-1',
    button: 'w-4 h-4',
    nav: 'w-5 h-5'
  },

  // Component Recipes (Common Patterns)
  recipes: {
    badge: 'inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ring-1',
    chip: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1',
    
    button: {
      primary: 'inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed',
      secondary: 'inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed',
      ghost: 'inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed',
      danger: 'inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed',
      iconOnly: 'inline-flex items-center justify-center p-2 rounded-lg transition-colors duration-150'
    },
    
    input: 'block w-full rounded-lg border border-slate-300 shadow-sm text-sm placeholder:text-slate-400 px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed',
    textarea: 'block w-full rounded-lg border border-slate-300 shadow-sm text-sm placeholder:text-slate-400 px-3 py-2 resize-vertical disabled:opacity-50 disabled:cursor-not-allowed',
    select: 'block w-full rounded-lg border border-slate-300 shadow-sm text-sm bg-white px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed',
    
    card: 'bg-white border border-slate-200/60 rounded-xl shadow-sm',
    cardInteractive: 'bg-white border border-slate-200/60 rounded-xl shadow-sm hover:shadow-md hover:border-slate-300/60 transition-all duration-200',
    
    menu: 'bg-white border border-slate-200 rounded-lg shadow-lg py-1 min-w-[12rem]',
    menuItem: 'flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer',
    
    // Search-specific patterns
    searchContainer: 'relative',
    searchInput: 'block w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg text-sm placeholder:text-slate-400 shadow-sm',
    searchResults: 'absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-96 overflow-y-auto',
    searchResultItem: 'px-4 py-3 cursor-pointer border-b border-slate-100 last:border-b-0',
    searchResultHighlight: 'bg-yellow-200 text-slate-900',
    searchNoResults: 'px-4 py-3 text-sm text-slate-500',
    searchFooter: 'px-4 py-2 text-xs text-slate-500 bg-slate-50',
    
    // Keyboard shortcuts patterns
    keyboardModal: 'bg-white rounded-xl shadow-xl border border-slate-200 max-w-2xl w-full mx-4',
    keyboardShortcut: 'flex items-center justify-between py-2',
    keyboardKey: 'inline-flex items-center rounded border border-slate-200 px-2 py-1 text-xs font-mono text-slate-600 bg-slate-50',
    
    // Quick add patterns
    quickAddContainer: 'relative',
    quickAddInput: 'block w-full py-3 border border-slate-300 rounded-lg text-sm placeholder:text-slate-400 shadow-sm',
    quickAddIcon: 'absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none',
    quickAddButton: 'absolute inset-y-0 right-0 flex items-center pr-3',
    quickAddHelp: 'text-xs text-slate-500',
    quickAddExample: 'inline-flex items-center px-2.5 py-1 rounded-md bg-slate-50 text-slate-700 ring-1 ring-slate-200',
    
    // Icon button state patterns
    iconButtonDefault: 'text-slate-400 hover:bg-slate-100 hover:text-slate-600',
    iconButtonSuccess: 'text-green-600 hover:bg-green-50',
    iconButtonDanger: 'text-slate-400 hover:bg-red-50 hover:text-red-600',
    iconButtonPrimary: 'text-slate-400 hover:bg-blue-50 hover:text-blue-600',
    iconButtonComplete: 'text-slate-400 hover:bg-slate-100 hover:text-green-600',
    
    // Button variant patterns
    buttonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white border-transparent shadow-sm',
    buttonSecondary: 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-sm',
    buttonGhost: 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 border-transparent',
    buttonDanger: 'bg-red-600 hover:bg-red-700 text-white border-transparent shadow-sm',
    
    // Badge variant patterns  
    badgeDefault: 'bg-slate-50 text-slate-700 ring-slate-600/20',
    badgeSuccess: 'bg-green-50 text-green-700 ring-green-600/20',
    badgeWarning: 'bg-orange-50 text-orange-700 ring-orange-600/20',
    badgeDanger: 'bg-red-50 text-red-700 ring-red-600/20',
    badgeInfo: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    
    // Toast patterns
    toastContainer: 'fixed bottom-4 right-4',
    toastItem: 'flex items-center max-w-sm',
    
    emptyState: 'flex flex-col items-center justify-center py-12 text-center',
    
    overlay: 'fixed inset-0 bg-black/25 backdrop-blur-sm',
    modal: 'bg-white rounded-xl shadow-xl border border-slate-200'
  }
} as const;

// Type-safe helper functions
export function getPriorityStyles(priority: 'P0' | 'P1' | 'P2') {
  const map = {
    P0: DESIGN_TOKENS.colors.priority.critical,
    P1: DESIGN_TOKENS.colors.priority.important, 
    P2: DESIGN_TOKENS.colors.priority.normal
  };
  return map[priority];
}

export function getStatusStyles(status: 'TODAY' | 'LATER' | 'DONE') {
  const map = {
    TODAY: DESIGN_TOKENS.colors.status.active,
    LATER: DESIGN_TOKENS.colors.status.backlog,
    DONE: DESIGN_TOKENS.colors.status.complete
  };
  return map[status];
}

export function getUrgencyStyles(urgency: 'overdue' | 'today' | 'tomorrow' | 'future') {
  return DESIGN_TOKENS.colors.urgency[urgency];
}

export function getPriorityLabel(priority: 'P0' | 'P1' | 'P2') {
  const labels = {
    P0: 'Critical Priority',
    P1: 'Important Priority',
    P2: 'Normal Priority'
  };
  return labels[priority];
}

export function getStatusLabel(status: 'TODAY' | 'LATER' | 'DONE') {
  const labels = {
    TODAY: 'Active Task',
    LATER: 'Backlog Task',
    DONE: 'Completed Task'
  };
  return labels[status];
}
