# 🎨 DESIGN TOKENS — Architecture & Reference (SSOT, tokens-only)

**Date:** January 27, 2025  
**Applies to:** SparkTasks v7.x Single-Repo  
**Owner:** Architecture Lead (Wee)  
**Status:** ✅ Approved (Governs design tokens only)  
**Governance Compliance:** Anti-Drift v7.1 + MAPS4 Cosmic Innovation + SSOT Standards  

---

## 0) Purpose & Non‑Negotiables

Note: End‑to‑end foundation governance (Tailwind names → index.css values → enhanced‑tokens helpers → 4 primitives) now lives in `configs/governance/FOUNDATION_GOVERNANCE_SSOT.md`. This document is scoped to the token structure and usage only.

This document defines the **canonical architecture** and **rules** for design tokens — the **cornerstone** that provides consistent, scalable, and maintainable design values across the application.

**Non‑Negotiables**

* **No hardcoded values**: All design values must originate from tokens.
* **Flat architecture**: Maximum 2-level nesting for TypeScript compatibility.
* **Semantic grouping**: Tokens organized by purpose, not technical implementation.
* **SSOT enforcement**: Single source of truth with zero drift tolerance.
* **TypeScript first**: All token structures must be TypeScript-friendly.
* **Scalability**: Architecture must support unlimited token expansion.
* **Governance ready**: Must support linting, CI validation, and team onboarding.

---

## 1) Token Architecture — Constitutional Foundation

### 1.1 Token Structure Hierarchy (authoritative)

```ts
// CONSTITUTIONAL TOKEN STRUCTURE - Maximum 2 levels
export const ENHANCED_DESIGN_TOKENS = {
  foundation: {
    // ✅ 2-level access: foundation.motionComponents
    motionComponents: {
      buttonHover: 'transition-all duration-200 ease-out',
      cardHover: 'transition-all duration-300 ease-out',
      navHover: 'transition-colors duration-200 ease-out',
      // Component-specific motion patterns
    },

    // ✅ 2-level access: foundation.motionLegacy
    motionLegacy: {
      'duration-75': 'duration-75',
      'duration-100': 'duration-100',
      'ease-in-out': 'ease-in-out',
      // Legacy Tailwind-compatible patterns
    },

    // ✅ 2-level access: foundation.motionPatterns
    motionPatterns: {
      fadeInFast: 'transition-opacity duration-150 ease-out',
      fadeOutSlow: 'transition-opacity duration-300 ease-in',
      slideInStandard: 'transition-transform duration-200 ease-out',
      // Semantic animation patterns
    },

    // ✅ 2-level access: foundation.motionAccessibility
    motionAccessibility: {
      motionSafeFadeIn: 'motion-safe:transition-opacity motion-safe:duration-200',
      motionReduceNone: 'motion-reduce:transition-none motion-reduce:animate-none',
      highContrastFadeIn: 'contrast-more:transition-opacity contrast-more:duration-200',
      // Accessibility-first motion variants
    },

    // ✅ 2-level access: foundation.motionTransition
    motionTransition: {
      all: 'transition-all',
      none: 'transition-none',
      colors: 'transition-colors',
      opacity: 'transition-opacity',
      transform: 'transition-transform',
      // Core transition primitives
    },

    // ✅ 2-level access: foundation.color
    color: {
      surface: {
        canvas: 'bg-deep-space',
        elevated: 'bg-cosmic-void',
        panel: 'bg-stellar-surface',
        // Surface color tokens
      },
      content: {
        primary: 'text-cosmic-light',
        secondary: 'text-stellar-muted',
        tertiary: 'text-cosmic-subtle',
        // Content color tokens
      },
      // Additional color categories...
    },

    // ✅ 2-level access: foundation.typography
    typography: {
      display: {
        large: 'text-4xl font-bold',
        medium: 'text-3xl font-bold',
        small: 'text-2xl font-semibold',
        // Display typography tokens
      },
      heading: {
        h1: 'text-3xl font-semibold',
        h2: 'text-2xl font-semibold',
        h3: 'text-xl font-semibold',
        // Heading typography tokens
      },
      // Additional typography categories...
    },

    // ✅ 2-level access: foundation.layout
    layout: {
      alignment: {
        center: 'text-center',
        left: 'text-left',
        right: 'text-right',
        justify: 'text-justify',
        // Text alignment tokens
      },
      grid: {
        columns: {
          1: 'grid-cols-1',
          2: 'grid-cols-2',
          3: 'grid-cols-3',
          // Grid column tokens
        },
        gap: {
          none: 'gap-0',
          xs: 'gap-1',
          sm: 'gap-2',
          md: 'gap-4',
          lg: 'gap-6',
          xl: 'gap-8',
          '2xl': 'gap-12',
          // Grid gap tokens
        },
        responsive: {
          '1-2': 'grid-cols-1 md:grid-cols-2',
          '1-3': 'grid-cols-1 md:grid-cols-3',
          '1-2-3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
          // Responsive grid patterns
        },
      },
      flex: {
        direction: {
          row: 'flex-row',
          col: 'flex-col',
          'row-reverse': 'flex-row-reverse',
          'col-reverse': 'flex-col-reverse',
          // Flex direction tokens
        },
        alignment: {
          center: 'items-center justify-center',
          start: 'items-start justify-start',
          end: 'items-end justify-end',
          between: 'items-center justify-between',
          around: 'items-center justify-around',
          evenly: 'items-center justify-evenly',
          // Flex alignment tokens
        },
        items: {
          center: 'items-center',
          start: 'items-start',
          end: 'items-end',
          // Individual flex item alignment
        },
        justify: {
          center: 'justify-center',
          between: 'justify-between',
          around: 'justify-around',
          // Individual flex justify alignment
        },
        wrap: {
          wrap: 'flex-wrap',
          'wrap-reverse': 'flex-wrap-reverse',
          nowrap: 'flex-nowrap',
          // Flex wrap tokens
        },
      },
      spacing: {
        stack: {
          none: 'space-y-0',
          xs: 'space-y-1',
          sm: 'space-y-2',
          md: 'space-y-4',
          lg: 'space-y-6',
          xl: 'space-y-8',
          '2xl': 'space-y-12',
          // Vertical spacing tokens
        },
        cluster: {
          none: 'space-x-0',
          xs: 'space-x-1',
          sm: 'space-x-2',
          md: 'space-x-4',
          lg: 'space-x-6',
          xl: 'space-x-8',
          '2xl': 'space-x-12',
          // Horizontal spacing tokens
        },
        responsive: {
          'xs-md': 'space-y-1 md:space-y-4',
          'sm-lg': 'space-y-2 md:space-y-6',
          'md-xl': 'space-y-4 md:space-y-8',
          // Responsive spacing patterns
        },
      },
      display: {
        block: 'block',
        inline: 'inline',
        flex: 'flex',
        grid: 'grid',
        hidden: 'hidden',
        // Display pattern tokens
      },
      position: {
        relative: 'relative',
        absolute: 'absolute',
        fixed: 'fixed',
        sticky: 'sticky',
        // Position pattern tokens
      },
      overflow: {
        hidden: 'overflow-hidden',
        auto: 'overflow-auto',
        scroll: 'overflow-scroll',
        // Overflow pattern tokens
      },
      width: {
        full: 'w-full',
        auto: 'w-auto',
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
        // Width tokens
      },
      height: {
        full: 'h-full',
        auto: 'h-auto',
        screen: 'h-screen',
        'min-h-screen': 'min-h-screen',
        // Height tokens
      },
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
        // Padding tokens
      },
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
        'x-auto': 'mx-auto',
        'y-auto': 'my-auto',
        't-auto': 'mt-auto',
        'b-auto': 'mb-auto',
        'l-auto': 'ml-auto',
        'r-auto': 'mr-auto',
        // Margin tokens
      },
      border: {
        width: {
          none: 'border-0',
          default: 'border',
          thin: 'border-2',
          thick: 'border-4',
          // Border width tokens
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
          // Border radius tokens
        },
        style: {
          solid: 'border-solid',
          dashed: 'border-dashed',
          dotted: 'border-dotted',
          double: 'border-double',
          // Border style tokens
        },
        collapse: 'border-collapse',
        // Border collapse token
      },
      background: {
        transparent: 'bg-transparent',
        current: 'bg-current',
        // Background tokens
      },
      flexbox: {
        grow: {
          0: 'flex-grow-0',
          1: 'flex-grow',
          // Flex grow tokens
        },
        basis: {
          0: 'flex-basis-0',
          auto: 'flex-basis-auto',
          full: 'flex-basis-full',
          // Flex basis tokens
        },
      },
    },

    // ✅ 2-level access: foundation.elevation
    elevation: {
      none: 'shadow-none',
      sm: 'shadow-sm',
      default: 'shadow',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl',
      '2xl': 'shadow-2xl',
      inner: 'shadow-inner',
      // Elevation tokens
    },

    // ✅ 2-level access: foundation.zIndex
    zIndex: {
      auto: 'z-auto',
      0: 'z-0',
      10: 'z-10',
      20: 'z-20',
      30: 'z-30',
      40: 'z-40',
      50: 'z-50',
      max: 'z-max',
      // Z-index tokens
    },

    // ✅ 2-level access: foundation.backdrop
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
        // Backdrop blur tokens
      },
      saturate: {
        0: 'backdrop-saturate-0',
        50: 'backdrop-saturate-50',
        100: 'backdrop-saturate-100',
        150: 'backdrop-saturate-150',
        200: 'backdrop-saturate-200',
        // Backdrop saturate tokens
      },
    },
  },

  // ✅ 2-level access: recipes.layout
  recipes: {
    layout: {
      center: 'flex items-center justify-center text-center',
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
          // Stack spacing recipes
        },
      },
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
          // Cluster spacing recipes
        },
      },
      grid: {
        base: 'grid',
        responsive: {
          '1-2': 'grid-cols-1 md:grid-cols-2',
          '1-3': 'grid-cols-1 md:grid-cols-3',
          '1-2-3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
          '1-2-4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
          // Responsive grid recipes
        },
        gap: {
          none: 'gap-0',
          xs: 'gap-1',
          sm: 'gap-2',
          md: 'gap-4',
          lg: 'gap-6',
          xl: 'gap-8',
          '2xl': 'gap-12',
          // Grid gap recipes
        },
      },
      panel: {
        base: 'rounded-lg border border-cosmic-border bg-cosmic-void p-6',
        elevated: 'shadow-md',
        interactive: 'hover:shadow-lg transition-shadow duration-normal',
        // Panel layout recipes
      },
    },
  },

  // ✅ 2-level access: meta
  meta: {
    version: '4.0.0',
    name: 'MAPS4 Deep Space Canvas Cosmic Innovation - Enhanced Design Tokens',
    description: 'MAPS4 cosmic CSS variable-based token system with dynamic registry support',
    lastUpdated: '2025-01-27',
  },
};
```

### 1.2 Token Access Patterns (constitutional)

```ts
// ✅ CONSTITUTIONAL ACCESS PATTERNS - 2 levels maximum
const buttonClasses = ENHANCED_DESIGN_TOKENS.foundation.motionComponents.buttonHover;
const colorClasses = ENHANCED_DESIGN_TOKENS.foundation.color.surface.canvas;
const layoutClasses = ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.center;

// ❌ FORBIDDEN ACCESS PATTERNS - 3+ levels
// ENHANCED_DESIGN_TOKENS.foundation.motion.tailwind.components.buttonHover; // ❌ 4 levels
// ENHANCED_DESIGN_TOKENS.foundation.layout.grid.columns.auto; // ❌ 4 levels

// ✅ RECOMMENDED ACCESS PATTERNS - Use destructuring for clarity
const { motionComponents, color, layout } = ENHANCED_DESIGN_TOKENS.foundation;
const buttonMotion = motionComponents.buttonHover;
const surfaceColor = color.surface.canvas;
const centerAlign = layout.alignment.center;
```

### 1.3 Token Naming Conventions (constitutional)

```ts
// ✅ CONSTITUTIONAL NAMING PATTERNS
motionComponents: {
  buttonHover: 'transition-all duration-200 ease-out',        // ✅ camelCase + descriptive
  cardHover: 'transition-all duration-300 ease-out',         // ✅ camelCase + descriptive
  navHover: 'transition-colors duration-200 ease-out',       // ✅ camelCase + descriptive
},

motionLegacy: {
  'duration-200': 'duration-200',                            // ✅ kebab-case for Tailwind compatibility
  'ease-in-out': 'ease-in-out',                              // ✅ kebab-case for Tailwind compatibility
  'motion-reduce-none': 'motion-reduce:transition-none',     // ✅ kebab-case for Tailwind compatibility
},

// ❌ FORBIDDEN NAMING PATTERNS
motionComponents: {
  'btn-hover': 'transition-all duration-200 ease-out',       // ❌ Inconsistent casing
  'card_hover': 'transition-all duration-300 ease-out',      // ❌ Underscore usage
  'navhover': 'transition-colors duration-200 ease-out',     // ❌ No separation
},
```

---

## 2) Token Governance Rules — Constitutional Law

### 2.1 SSOT Enforcement (mandatory)

**All design values must originate from tokens. No exceptions.**

```ts
// ✅ COMPLIANT - Token-based values
className={ENHANCED_DESIGN_TOKENS.foundation.motionComponents.buttonHover}

// ❌ FORBIDDEN - Hardcoded values
className="transition-all duration-200 ease-out"

// ❌ FORBIDDEN - CSS variables without tokens
className="transition-all duration-[var(--motion-duration-2)]"

// ✅ COMPLIANT - CSS variables through tokens
className={ENHANCED_DESIGN_TOKENS.foundation.motionTransition.all}
```

### 2.2 Nesting Depth Enforcement (mandatory)

**Maximum 2-level nesting for all token access.**

```ts
// ✅ COMPLIANT - 2 levels maximum
ENHANCED_DESIGN_TOKENS.foundation.motionComponents.buttonHover
ENHANCED_DESIGN_TOKENS.foundation.color.surface.canvas
ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.center

// ❌ FORBIDDEN - 3+ levels
ENHANCED_DESIGN_TOKENS.foundation.motion.tailwind.components.buttonHover
ENHANCED_DESIGN_TOKENS.foundation.layout.grid.columns.auto
```

### 2.3 Token Extension Rules (constitutional)

**When extending tokens, follow these constitutional rules:**

```ts
// ✅ CONSTITUTIONAL EXTENSION PATTERN
export const ENHANCED_DESIGN_TOKENS = {
  foundation: {
    // Existing tokens...
    motionComponents: {
      // Existing component tokens...
      // ✅ NEW: Follow existing naming convention
      newComponentHover: 'transition-all duration-250 ease-out',
      newComponentActive: 'transition-all duration-150 ease-in',
    },
    
    // ✅ NEW: Create new category if needed
    newCategory: {
      pattern1: 'value1',
      pattern2: 'value2',
    },
  },
};

// ❌ FORBIDDEN EXTENSION PATTERNS
export const ENHANCED_DESIGN_TOKENS = {
  foundation: {
    // ❌ Don't create deep nesting
    motion: {
      tailwind: {
        components: {
          newComponent: 'value', // ❌ 4 levels deep
        },
      },
    },
    
    // ❌ Don't mix naming conventions
    motionComponents: {
      'new-component': 'value', // ❌ Inconsistent with existing
    },
  },
};
```

### 2.4 Token Validation Rules (constitutional)

**All tokens must be validated through Zod schema:**

```ts
// ✅ CONSTITUTIONAL VALIDATION PATTERN
export const DesignTokensSchema = z.object({
  foundation: z.object({
    motionComponents: z.record(z.string()),
    motionLegacy: z.record(z.string()),
    motionPatterns: z.record(z.string()),
    motionAccessibility: z.record(z.string()),
    motionTransition: z.record(z.string()),
    color: z.object({
      surface: z.record(z.string()),
      content: z.record(z.string()),
      // Additional color validation...
    }),
    // Additional foundation validation...
  }),
  recipes: z.object({
    layout: z.object({
      center: z.string(),
      stack: z.object({
        base: z.string(),
        spacing: z.record(z.string()),
      }),
      // Additional layout recipe validation...
    }),
  }),
  meta: z.object({
    version: z.string(),
    name: z.string(),
    description: z.string(),
    lastUpdated: z.string(),
  }),
});
```

---

## 3) Token Consumption — Constitutional Implementation

### 3.1 Component Token Consumption (mandatory)

**All components must consume tokens through the constitutional pattern:**

```tsx
// ✅ CONSTITUTIONAL COMPONENT PATTERN
import { ENHANCED_DESIGN_TOKENS } from '@/design/enhanced-tokens';

export function Button({ variant = 'default', ...props }) {
  const buttonClasses = {
    // ✅ Motion tokens
    motion: ENHANCED_DESIGN_TOKENS.foundation.motionComponents.buttonHover,
    
    // ✅ Color tokens
    background: ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated,
    text: ENHANCED_DESIGN_TOKENS.foundation.color.content.primary,
    
    // ✅ Layout tokens
    padding: ENHANCED_DESIGN_TOKENS.foundation.layout.padding[4],
    borderRadius: ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius.lg,
    alignment: ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.center,
    
    // ✅ Typography tokens
    textSize: ENHANCED_DESIGN_TOKENS.foundation.typography.label,
  };

  return (
    <button
      className={cn(
        buttonClasses.motion,
        buttonClasses.background,
        buttonClasses.text,
        buttonClasses.padding,
        buttonClasses.borderRadius,
        buttonClasses.alignment,
        buttonClasses.textSize
      )}
      {...props}
    />
  );
}

// ❌ FORBIDDEN COMPONENT PATTERNS
export function Button({ variant = 'default', ...props }) {
  // ❌ Hardcoded values
  const buttonClasses = "transition-all duration-200 ease-out bg-cosmic-void text-cosmic-light p-4 rounded-lg text-center text-sm font-medium";
  
  // ❌ Deep nesting access
  const motionClass = ENHANCED_DESIGN_TOKENS.foundation.motion.tailwind.components.buttonHover;
  
  // ❌ Mixed token and hardcoded
  const mixedClasses = `${ENHANCED_DESIGN_TOKENS.foundation.motionComponents.buttonHover} bg-cosmic-void`;
}
```

### 3.2 Token Utility Functions (recommended)

**Create utility functions for common token access patterns:**

```ts
// ✅ CONSTITUTIONAL UTILITY PATTERNS
export const getMotionToken = (key: keyof typeof ENHANCED_DESIGN_TOKENS.foundation.motionComponents) => {
  return ENHANCED_DESIGN_TOKENS.foundation.motionComponents[key];
};

export const getColorToken = (category: keyof typeof ENHANCED_DESIGN_TOKENS.foundation.color, key: string) => {
  return ENHANCED_DESIGN_TOKENS.foundation.color[category][key];
};

export const getLayoutToken = (category: keyof typeof ENHANCED_DESIGN_TOKENS.foundation.layout, key: string) => {
  return ENHANCED_DESIGN_TOKENS.foundation.layout[category][key];
};

// ✅ USAGE PATTERNS
const buttonMotion = getMotionToken('buttonHover');
const surfaceColor = getColorToken('surface', 'canvas');
const centerAlign = getLayoutToken('alignment', 'center');
```

### 3.3 Token Recipe Usage (recommended)

**Use pre-built layout recipes for common patterns:**

```tsx
// ✅ CONSTITUTIONAL RECIPE PATTERNS
const layoutRecipes = {
  centeredContent: ENHANCED_DESIGN_TOKENS.recipes.layout.center,
  verticalStack: cn(
    ENHANCED_DESIGN_TOKENS.recipes.layout.stack.base,
    ENHANCED_DESIGN_TOKENS.recipes.layout.stack.spacing.md
  ),
  responsiveGrid: cn(
    ENHANCED_DESIGN_TOKENS.recipes.layout.grid.base,
    ENHANCED_DESIGN_TOKENS.recipes.layout.grid.responsive['1-2-3'],
    ENHANCED_DESIGN_TOKENS.recipes.layout.grid.gap.md
  ),
  elevatedPanel: cn(
    ENHANCED_DESIGN_TOKENS.recipes.layout.panel.base,
    ENHANCED_DESIGN_TOKENS.recipes.layout.panel.elevated
  ),
};

// ✅ USAGE PATTERNS
<div className={layoutRecipes.centeredContent}>
  <div className={layoutRecipes.verticalStack}>
    <div className={layoutRecipes.responsiveGrid}>
      <div className={layoutRecipes.elevatedPanel}>
        Content
      </div>
    </div>
  </div>
</div>
```

---

## 4) Token Governance Enforcement — Constitutional Law

### 4.1 ESLint Rules (mandatory)

**Enforce token governance through ESLint rules:**

```js
// .eslintrc.js - Token Governance Rules
module.exports = {
  rules: {
    // ❌ Block hardcoded motion classes
    'no-hardcoded-motion': {
      create(context) {
        return {
          Literal(node) {
            if (typeof node.value === 'string' && 
                /transition-|duration-|ease-|animate-/.test(node.value)) {
              context.report({
                node,
                message: 'Hardcoded motion classes are forbidden. Use ENHANCED_DESIGN_TOKENS.foundation.motion* instead.',
              });
            }
          },
        };
      },
    },

    // ❌ Block hardcoded layout classes
    'no-hardcoded-layout': {
      create(context) {
        return {
          Literal(node) {
            if (typeof node.value === 'string' && 
                /text-center|text-left|text-right|grid-cols-|flex-|space-|gap-|w-|h-|p-|m-|border|rounded|bg-/.test(node.value)) {
              context.report({
                node,
                message: 'Hardcoded layout classes are forbidden. Use ENHANCED_DESIGN_TOKENS.foundation.layout.* instead.',
              });
            }
          },
        };
      },
    },

    // ❌ Block hardcoded color classes
    'no-hardcoded-colors': {
      create(context) {
        return {
          Literal(node) {
            if (typeof node.value === 'string' && 
                /text-|bg-|border-/.test(node.value)) {
              context.report({
                node,
                message: 'Hardcoded color classes are forbidden. Use ENHANCED_DESIGN_TOKENS.foundation.color.* instead.',
              });
            }
          },
        };
      },
    },
  },
};
```

### 4.2 CI Validation (mandatory)

**Enforce token governance through CI checks:**

```yaml
# .github/workflows/token-governance.yml
name: Token Governance Compliance

on:
  pull_request:
    paths:
      - 'src/**/*.{ts,tsx}'
      - 'src/design/**/*.ts'

jobs:
  token-compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run token governance linting
        run: npm run lint:governance
        
      - name: Validate token structure
        run: npm run validate:tokens
        
      - name: Type check tokens
        run: npm run typecheck
```

### 4.3 Token Validation Scripts (mandatory)

**Create validation scripts for token governance:**

```ts
// scripts/validate-tokens.ts
import { ENHANCED_DESIGN_TOKENS } from '../src/design/enhanced-tokens';
import { DesignTokensSchema } from '../src/design/enhanced-tokens';

export function validateTokenGovernance() {
  try {
    // ✅ Validate token structure
    const validationResult = DesignTokensSchema.safeParse(ENHANCED_DESIGN_TOKENS);
    
    if (!validationResult.success) {
      console.error('❌ Token structure validation failed:');
      console.error(validationResult.error);
      process.exit(1);
    }
    
    // ✅ Validate nesting depth (maximum 2 levels)
    const deepNesting = findDeepNesting(ENHANCED_DESIGN_TOKENS);
    if (deepNesting.length > 0) {
      console.error('❌ Deep nesting violation found:');
      deepNesting.forEach(path => console.error(`  ${path}`));
      process.exit(1);
    }
    
    // ✅ Validate no hardcoded values
    const hardcodedValues = findHardcodedValues(ENHANCED_DESIGN_TOKENS);
    if (hardcodedValues.length > 0) {
      console.error('❌ Hardcoded values found:');
      hardcodedValues.forEach(path => console.error(`  ${path}`));
      process.exit(1);
    }
    
    console.log('✅ Token governance validation passed');
    
  } catch (error) {
    console.error('❌ Token validation error:', error);
    process.exit(1);
  }
}

function findDeepNesting(obj: any, path: string = '', maxDepth: number = 2): string[] {
  const violations: string[] = [];
  
  function traverse(current: any, currentPath: string, depth: number) {
    if (depth > maxDepth) {
      violations.push(currentPath);
      return;
    }
    
    if (typeof current === 'object' && current !== null) {
      Object.keys(current).forEach(key => {
        const newPath = currentPath ? `${currentPath}.${key}` : key;
        traverse(current[key], newPath, depth + 1);
      });
    }
  }
  
  traverse(obj, path, 0);
  return violations;
}

function findHardcodedValues(obj: any, path: string = ''): string[] {
  const violations: string[] = [];
  
  function traverse(current: any, currentPath: string) {
    if (typeof current === 'string') {
      // Check for hardcoded Tailwind classes
      if (/transition-|duration-|ease-|animate-|text-center|grid-cols-|flex-|space-|gap-|w-|h-|p-|m-|border|rounded|bg-/.test(current)) {
        violations.push(currentPath);
      }
    } else if (typeof current === 'object' && current !== null) {
      Object.keys(current).forEach(key => {
        const newPath = currentPath ? `${currentPath}.${key}` : key;
        traverse(current[key], newPath);
      });
    }
  }
  
  traverse(obj, path);
  return violations;
}

// Run validation if called directly
if (require.main === module) {
  validateTokenGovernance();
}
```

---

## 5) Token Development Workflow — Constitutional Process

### 5.1 Adding New Tokens (constitutional process)

**Follow this constitutional process when adding new tokens:**

```ts
// ✅ CONSTITUTIONAL TOKEN ADDITION PROCESS

// 1. Identify the need for new tokens
// 2. Determine the appropriate category (existing or new)
// 3. Follow naming conventions
// 4. Add to the appropriate section
// 5. Update Zod schema
// 6. Update type definitions
// 7. Test token access
// 8. Document usage

// ✅ EXAMPLE: Adding new motion component tokens
export const ENHANCED_DESIGN_TOKENS = {
  foundation: {
    motionComponents: {
      // Existing tokens...
      buttonHover: 'transition-all duration-200 ease-out',
      cardHover: 'transition-all duration-300 ease-out',
      
      // ✅ NEW: Follow existing pattern
      tooltipHover: 'transition-opacity duration-150 ease-out',
      dropdownHover: 'transition-transform duration-200 ease-out',
      accordionHover: 'transition-colors duration-200 ease-out',
    },
    
    // ✅ NEW: Create new category if needed
    motionMicro: {
      iconHover: 'transition-transform duration-75 ease-out',
      badgeHover: 'transition-opacity duration-100 ease-out',
      chipHover: 'transition-colors duration-150 ease-out',
    },
  },
};

// ✅ UPDATE: Zod schema
export const DesignTokensSchema = z.object({
  foundation: z.object({
    motionComponents: z.record(z.string()),
    motionMicro: z.record(z.string()), // ✅ New category
    // ... other validation
  }),
});

// ✅ UPDATE: Type definitions
export type MotionMicroTokens = DesignTokens['foundation']['motionMicro'];
```

### 5.2 Token Migration Process (constitutional process)

**When migrating existing hardcoded values to tokens:**

```ts
// ✅ CONSTITUTIONAL MIGRATION PROCESS

// 1. Identify hardcoded values in components
// 2. Create appropriate token categories
// 3. Add tokens to ENHANCED_DESIGN_TOKENS
// 4. Update components to use tokens
// 5. Remove hardcoded values
// 6. Validate compliance
// 7. Update documentation

// ✅ EXAMPLE: Migrating hardcoded motion values
// BEFORE: Hardcoded in component
className="transition-all duration-200 ease-out"

// AFTER: Token-based in component
className={ENHANCED_DESIGN_TOKENS.foundation.motionComponents.buttonHover}

// ✅ TOKEN ADDITION: Add to appropriate category
motionComponents: {
  buttonHover: 'transition-all duration-200 ease-out', // ✅ New token
  // ... existing tokens
},
```

### 5.3 Token Deprecation Process (constitutional process)

**When deprecating tokens, follow this constitutional process:**

```ts
// ✅ CONSTITUTIONAL DEPRECATION PROCESS

// 1. Mark token as deprecated
// 2. Provide migration path
// 3. Update documentation
// 4. Schedule removal
// 5. Notify team
// 6. Remove after grace period

// ✅ EXAMPLE: Deprecating a token
export const ENHANCED_DESIGN_TOKENS = {
  foundation: {
    motionComponents: {
      // ✅ DEPRECATED: Mark for removal
      // @deprecated Use motionComponents.buttonHover instead
      // @removal-date 2025-02-27
      oldButtonHover: 'transition-all duration-200 ease-out',
      
      // ✅ REPLACEMENT: New token
      buttonHover: 'transition-all duration-200 ease-out',
    },
  },
};

// ✅ MIGRATION: Update components
// FROM: ENHANCED_DESIGN_TOKENS.foundation.motionComponents.oldButtonHover
// TO: ENHANCED_DESIGN_TOKENS.foundation.motionComponents.buttonHover
```

---

## 6) Token Testing — Constitutional Validation

### 6.1 Token Structure Testing (mandatory)

**Test token structure and governance compliance:**

```ts
// tests/tokens/token-governance.test.ts
import { describe, it, expect } from 'vitest';
import { ENHANCED_DESIGN_TOKENS } from '@/design/enhanced-tokens';
import { DesignTokensSchema } from '@/design/enhanced-tokens';

describe('Token Governance Compliance', () => {
  describe('Token Structure', () => {
    it('should validate against Zod schema', () => {
      const result = DesignTokensSchema.safeParse(ENHANCED_DESIGN_TOKENS);
      expect(result.success).toBe(true);
    });
    
    it('should have maximum 2-level nesting', () => {
      const deepNesting = findDeepNesting(ENHANCED_DESIGN_TOKENS);
      expect(deepNesting).toHaveLength(0);
    });
    
    it('should not contain hardcoded values', () => {
      const hardcodedValues = findHardcodedValues(ENHANCED_DESIGN_TOKENS);
      expect(hardcodedValues).toHaveLength(0);
    });
  });
  
  describe('Token Access Patterns', () => {
    it('should provide 2-level access to motion components', () => {
      expect(ENHANCED_DESIGN_TOKENS.foundation.motionComponents.buttonHover).toBeDefined();
      expect(ENHANCED_DESIGN_TOKENS.foundation.motionComponents.cardHover).toBeDefined();
    });
    
    it('should provide 2-level access to color tokens', () => {
      expect(ENHANCED_DESIGN_TOKENS.foundation.color.surface.canvas).toBeDefined();
      expect(ENHANCED_DESIGN_TOKENS.foundation.color.content.primary).toBeDefined();
    });
    
    it('should provide 2-level access to layout tokens', () => {
      expect(ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.center).toBeDefined();
      expect(ENHANCED_DESIGN_TOKENS.foundation.layout.grid.columns[1]).toBeDefined();
    });
  });
  
  describe('Token Naming Conventions', () => {
    it('should follow camelCase for component tokens', () => {
      const componentKeys = Object.keys(ENHANCED_DESIGN_TOKENS.foundation.motionComponents);
      componentKeys.forEach(key => {
        expect(key).toMatch(/^[a-z][a-zA-Z0-9]*$/);
      });
    });
    
    it('should follow kebab-case for legacy tokens', () => {
      const legacyKeys = Object.keys(ENHANCED_DESIGN_TOKENS.foundation.motionLegacy);
      legacyKeys.forEach(key => {
        expect(key).toMatch(/^[a-z0-9-]+$/);
      });
    });
  });
});

// Helper functions for testing
function findDeepNesting(obj: any, path: string = '', maxDepth: number = 2): string[] {
  const violations: string[] = [];
  
  function traverse(current: any, currentPath: string, depth: number) {
    if (depth > maxDepth) {
      violations.push(currentPath);
      return;
    }
    
    if (typeof current === 'object' && current !== null) {
      Object.keys(current).forEach(key => {
        const newPath = currentPath ? `${currentPath}.${key}` : key;
        traverse(current[key], newPath, depth + 1);
      });
    }
  }
  
  traverse(obj, path, 0);
  return violations;
}

function findHardcodedValues(obj: any, path: string = ''): string[] {
  const violations: string[] = [];
  
  function traverse(current: any, currentPath: string) {
    if (typeof current === 'string') {
      if (/transition-|duration-|ease-|animate-|text-center|grid-cols-|flex-|space-|gap-|w-|h-|p-|m-|border|rounded|bg-/.test(current)) {
        violations.push(currentPath);
      }
    } else if (typeof current === 'object' && current !== null) {
      Object.keys(current).forEach(key => {
        const newPath = currentPath ? `${currentPath}.${key}` : key;
        traverse(current[key], newPath);
      });
    }
  }
  
  traverse(obj, path);
  return violations;
}
```

### 6.2 Component Token Usage Testing (mandatory)

**Test that components use tokens correctly:**

```tsx
// tests/components/Button.token-usage.test.tsx
import { render } from '@testing-library/react';
import { Button } from '@/components/ui-enhanced/Button';
import { ENHANCED_DESIGN_TOKENS } from '@/design/enhanced-tokens';

describe('Button Token Usage Compliance', () => {
  it('should use motion tokens for hover states', () => {
    const { container } = render(<Button />);
    const button = container.querySelector('button');
    
    // ✅ Verify motion tokens are used
    const expectedMotionClass = ENHANCED_DESIGN_TOKENS.foundation.motionComponents.buttonHover;
    expect(button?.className).toContain(expectedMotionClass);
  });
  
  it('should use color tokens for styling', () => {
    const { container } = render(<Button />);
    const button = container.querySelector('button');
    
    // ✅ Verify color tokens are used
    const expectedColorClass = ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated;
    expect(button?.className).toContain(expectedColorClass);
  });
  
  it('should use layout tokens for spacing', () => {
    const { container } = render(<Button />);
    const button = container.querySelector('button');
    
    // ✅ Verify layout tokens are used
    const expectedPaddingClass = ENHANCED_DESIGN_TOKENS.foundation.layout.padding[4];
    expect(button?.className).toContain(expectedPaddingClass);
  });
  
  it('should not contain hardcoded values', () => {
    const { container } = render(<Button />);
    const button = container.querySelector('button');
    
    // ❌ Verify no hardcoded values
    const hardcodedPatterns = [
      'transition-all',
      'duration-200',
      'ease-out',
      'bg-cosmic-void',
      'text-cosmic-light',
      'p-4',
      'rounded-lg',
    ];
    
    hardcodedPatterns.forEach(pattern => {
      expect(button?.className).not.toContain(pattern);
    });
  });
});
```

---

## 7) Token Documentation — Constitutional Knowledge

### 7.1 Token Usage Guidelines (mandatory)

**Document token usage patterns for the team:**

```markdown
# Token Usage Guidelines

## Motion Tokens

### Component Motion
Use `ENHANCED_DESIGN_TOKENS.foundation.motionComponents.*` for component-specific motion patterns:

```tsx
// ✅ Correct usage
className={ENHANCED_DESIGN_TOKENS.foundation.motionComponents.buttonHover}

// ❌ Incorrect usage - hardcoded values
className="transition-all duration-200 ease-out"
```

### Legacy Motion
Use `ENHANCED_DESIGN_TOKENS.foundation.motionLegacy.*` for Tailwind-compatible patterns:

```tsx
// ✅ Correct usage
className={ENHANCED_DESIGN_TOKENS.foundation.motionLegacy['duration-200']}

// ❌ Incorrect usage - hardcoded values
className="duration-200"
```

### Motion Patterns
Use `ENHANCED_DESIGN_TOKENS.foundation.motionPatterns.*` for semantic animation patterns:

```tsx
// ✅ Correct usage
className={ENHANCED_DESIGN_TOKENS.foundation.motionPatterns.fadeInStandard}

// ❌ Incorrect usage - hardcoded values
className="transition-opacity duration-200 ease-out"
```

## Color Tokens

### Surface Colors
Use `ENHANCED_DESIGN_TOKENS.foundation.color.surface.*` for backgrounds:

```tsx
// ✅ Correct usage
className={ENHANCED_DESIGN_TOKENS.foundation.color.surface.canvas}

// ❌ Incorrect usage - hardcoded values
className="bg-deep-space"
```

### Content Colors
Use `ENHANCED_DESIGN_TOKENS.foundation.color.content.*` for text:

```tsx
// ✅ Correct usage
className={ENHANCED_DESIGN_TOKENS.foundation.color.content.primary}

// ❌ Incorrect usage - hardcoded values
className="text-cosmic-light"
```

## Layout Tokens

### Spacing
Use `ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.*` for consistent spacing:

```tsx
// ✅ Correct usage
className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md}

// ❌ Incorrect usage - hardcoded values
className="space-y-4"
```

### Grid System
Use `ENHANCED_DESIGN_TOKENS.foundation.layout.grid.*` for layout structure:

```tsx
// ✅ Correct usage
className={ENHANCED_DESIGN_TOKENS.foundation.layout.grid.responsive['1-2-3']}

// ❌ Incorrect usage - hardcoded values
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

---

## 8) Token Governance Enforcement — Constitutional Law

### 8.1 ESLint Rules (mandatory)

**Enforce token usage through linting:**

```json
// .eslintrc.js
module.exports = {
  rules: {
    // Block hardcoded motion classes
    'no-restricted-syntax': [
      'error',
      {
        selector: 'Literal[value=/^(transition-|duration-|ease-|animate-)/]',
        message: 'Use ENHANCED_DESIGN_TOKENS.foundation.motion.* instead of hardcoded motion classes'
      }
    ],
    
    // Block hardcoded layout classes
    'no-restricted-syntax': [
      'error',
      {
        selector: 'Literal[value=/^(text-center|grid-cols-|flex-|space-|gap-|w-|h-|p-|m-|border|rounded|bg-)/]',
        message: 'Use ENHANCED_DESIGN_TOKENS.foundation.layout.* instead of hardcoded layout classes'
      }
    ],
    
    // Block hardcoded color classes
    'no-restricted-syntax': [
      'error',
      {
        selector: 'Literal[value=/^(text-|bg-|border-)/]',
        message: 'Use ENHANCED_DESIGN_TOKENS.foundation.color.* instead of hardcoded color classes'
      }
    ]
  }
};
```

### 8.2 CI Validation (mandatory)

**Automated compliance checking:**

```yaml
# .github/workflows/token-compliance.yml
name: Token Compliance Check
on: [push, pull_request]

jobs:
  token-compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Check token compliance
        run: npm run audit:drift
      
      - name: Validate token usage
        run: npm run validate:imports
      
      - name: Type check
        run: npm run typecheck
      
      - name: Run tests
        run: npm run test:unit
```

### 8.3 Pre-commit Hooks (mandatory)

**Local enforcement:**

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix --cache",
      "npm run validate:imports",
      "npm run typecheck"
    ]
  }
}
```

---

## 9) Token Extension Protocol — Constitutional Amendment

### 9.1 Adding New Tokens (mandatory process)

**When you need a new token:**

1. **Identify the need**: What visual pattern is missing?
2. **Check existing tokens**: Is there already a similar pattern?
3. **Propose the token**: Define the semantic meaning and value
4. **Add to enhanced-tokens.ts**: Follow the established structure
5. **Update documentation**: Add usage examples and guidelines
6. **Test compliance**: Ensure no hardcoded values remain
7. **Commit with governance**: Use conventional commit format

**Example token addition:**

```tsx
// 1. Identify need: Missing button active state motion
// 2. Check existing: No buttonActive pattern exists
// 3. Propose: buttonActive for button press interactions
// 4. Add to tokens:

export const ENHANCED_DESIGN_TOKENS = {
  foundation: {
    motionComponents: {
      // ... existing tokens
      buttonActive: 'transition-all duration-150 ease-in', // NEW TOKEN
    }
  }
};

// 5. Update documentation: Add to usage guidelines
// 6. Test compliance: Verify button components use the token
// 7. Commit: feat(tokens): add buttonActive motion pattern
```

### 9.2 Token Deprecation Protocol (mandatory process)

**When removing or changing tokens:**

1. **Mark as deprecated**: Add deprecation notice
2. **Provide migration path**: Show how to use new tokens
3. **Gradual removal**: Remove from new components first
4. **Update documentation**: Remove deprecated token references
5. **Final removal**: Remove from enhanced-tokens.ts
6. **Update components**: Migrate all usages to new tokens

---

## 10) Token Compliance Matrix — Constitutional Standards

### 10.1 Component Compliance Checklist

**Every component must pass:**

- [ ] **Motion Compliance**: All motion values use tokens
- [ ] **Color Compliance**: All colors use tokens
- [ ] **Layout Compliance**: All layout patterns use tokens
- [ ] **Typography Compliance**: All text styles use tokens
- [ ] **Spacing Compliance**: All spacing uses tokens
- [ ] **Border Compliance**: All borders use tokens
- [ ] **Elevation Compliance**: All shadows use tokens
- [ ] **Accessibility Compliance**: All accessibility features use tokens

### 10.2 Token Quality Standards

**Every token must meet:**

- [ ] **Semantic Meaning**: Clear, descriptive name
- [ ] **Consistent Value**: Follows established patterns
- [ ] **Documentation**: Clear usage guidelines
- [ ] **Testing**: Verified in component tests
- [ ] **Governance**: Follows extension protocol

---

## 11) Token Governance References — Constitutional Authority

**This document governs:**

- `src/design/enhanced-tokens.ts` - Token definitions
- `src/components/ui-enhanced/*.tsx` - UI components
- `src/components/railway/*.tsx` - Railway stations
- `src/components/data-enhanced/*.tsx` - Data components
- All future component development

**Related governance documents:**

- `configs/governance/RAILWAY_APP_SHELL_SSOT.md` - Railway component governance
- `configs/governance/ANTI_DRIFT_GOVERNANCE_FINAL_v7.md` - Anti-drift rules
- `configs/governance/SUPERIOR_STATE_OF_THE_ART_DEVELOPMENT_MASTERPLAN.md` - Development strategy

---

## 12) Token Governance Compliance — Constitutional Enforcement

### 12.1 Compliance Verification Commands

**Verify token compliance:**

```bash
# Check for hardcoded values
npm run audit:drift

# Validate token imports
npm run validate:imports

# Type check
npm run typecheck

# Run compliance tests
npm run test:unit

# Full compliance check
npm run verify:all
```

### 12.2 Compliance Reporting

**Generate compliance reports:**

```bash
# Generate SSOT scorecard
npm run ssot:scorecard

# Generate drift report
npm run verify:drift

# Generate comprehensive report
npm run verify:all
```

---

## 13) Token Governance Success Metrics — Constitutional KPIs

### 13.1 Compliance Metrics

- **Token Usage Rate**: 100% of components use tokens
- **Hardcoded Value Rate**: 0% hardcoded values
- **TypeScript Error Rate**: 0% token-related errors
- **Test Coverage**: 100% token usage tested
- **Documentation Coverage**: 100% tokens documented

### 13.2 Quality Metrics

- **Token Consistency**: 100% consistent naming patterns
- **Token Semantics**: 100% meaningful token names
- **Token Documentation**: 100% documented usage
- **Token Testing**: 100% tested in components
- **Token Governance**: 100% follow extension protocol

---

## 14) Token Governance Future — Constitutional Evolution

### 14.1 Planned Enhancements

- **Automated Token Generation**: AI-powered token suggestions
- **Token Performance Monitoring**: Track token usage impact
- **Token Analytics Dashboard**: Visual compliance reporting
- **Token Migration Tools**: Automated refactoring assistance
- **Token Governance AI**: Intelligent compliance enforcement

### 14.2 Governance Evolution

- **Token Versioning**: Semantic versioning for tokens
- **Token Compatibility**: Backward compatibility guarantees
- **Token Ecosystem**: Community token contributions
- **Token Standards**: Industry-standard token formats
- **Token Governance**: Automated governance workflows

---

## 15) Conclusion — Constitutional Foundation

**This Token Governance SSOT establishes the constitutional foundation for:**

1. **SSOT Compliance**: All design values originate from tokens
2. **Anti-Drift Enforcement**: No hardcoded values allowed
3. **Scalable Architecture**: Clean, extensible token structure
4. **Governance Enforcement**: Automated compliance checking
5. **Quality Assurance**: Consistent, semantic token system
6. **Future Development**: Clear patterns for token extension
7. **Team Onboarding**: Comprehensive usage guidelines
8. **Compliance Monitoring**: Automated verification and reporting

**The token system is the foundation of your design system's integrity. This governance document ensures that foundation remains strong, scalable, and compliant.**

**Use this document to govern all future token development and maintain the highest standards of design system excellence.**

---

**This Token Governance SSOT supersedes any prior implicit contracts for token development and is the authoritative source for all token governance decisions.**

**The token system embodies the principles of SSOT compliance, anti-drift governance, and scalable architecture that will drive your design system's success.**

**Follow this governance document to achieve and maintain 100% token compliance across your entire component ecosystem.**