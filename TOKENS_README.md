# DESIGN_TOKENS SDK - Single Source of Truth

> **🔒 LOCKED CONFIGURATION** - This tokens system is now frozen as the authoritative design system SDK for SparkTasks. All UI components MUST consume these tokens instead of hardcoded Tailwind classes.

## 📋 **Table of Contents**

- [Overview](#overview)
- [Architecture](#architecture)
- [Token Categories](#token-categories)
- [Usage Patterns](#usage-patterns)
- [Type System](#type-system)
- [Helper Functions](#helper-functions)
- [SSOT Integration](#ssot-integration)
- [Migration Guide](#migration-guide)
- [API Reference](#api-reference)

## 🎯 **Overview**

The DESIGN_TOKENS system serves as the **Single Source of Truth (SSOT)** for all design decisions in SparkTasks. This enterprise-grade token system provides:

- **🎨 Comprehensive Design Language** - 1400+ tokens covering every UI component
- **🔧 Type-Safe SDK** - Full TypeScript intelligence and auto-completion
- **⚡ SSOT Enforcement** - ESLint automation prevents hardcoded Tailwind usage
- **🌈 Theme Support** - Light/dark modes with semantic color mapping
- **📱 Responsive Design** - Density-aware components (comfortable/compact/spacious)
- **♿ Accessibility** - WCAG 2.1 AA compliant interaction patterns

## 🏗️ **Architecture**

### Core Principles

1. **Tokens ARE the SSOT** - Contains legitimate hardcoded Tailwind classes
2. **Components Consume Tokens** - No hardcoded Tailwind in components
3. **Semantic Over Presentational** - Focus on intent, not implementation
4. **Enterprise Scalability** - Support for complex UI patterns

### File Structure

```typescript
src/design/tokens.ts
├── theme.*          # Light/dark mode system
├── density.*        # Comfortable/compact/spacious layouts
├── typography.*     # Heading, body, semantic text
├── layout.*         # Shell, patterns, positioning
├── spacing.*        # Margins, padding, gaps
├── sizing.*         # Widths, heights, avatars
├── semantic.*       # Intent-based styling
├── recipe.*         # Complete component recipes
├── icon.*           # Icon system with margins
├── motion.*         # Animation and transitions
└── dataViz.*        # Charts, graphs & analytics visualization
```

## 🎛️ **Token Categories**

### 1. **Theme System** (`theme.*`)
```typescript
DESIGN_TOKENS.theme.light.surface.base    // 'bg-white'
DESIGN_TOKENS.theme.dark.surface.base     // 'bg-slate-950'
DESIGN_TOKENS.theme.light.ink.primary     // 'text-slate-900'
```

### 2. **Typography** (`typography.*`)
```typescript
DESIGN_TOKENS.typography.heading.h1       // 'text-3xl font-bold leading-tight'
DESIGN_TOKENS.typography.body.primary     // 'text-base leading-relaxed'
DESIGN_TOKENS.typography.weight.semibold  // 'font-semibold'
```

### 3. **Layout Patterns** (`layout.*`)
```typescript
DESIGN_TOKENS.layout.patterns.headerBar   // Complete header styling
DESIGN_TOKENS.layout.patterns.flexGap     // 'flex items-center gap-3'
DESIGN_TOKENS.layout.shell.modal          // Modal container classes
```

### 4. **Component Recipes** (`recipe.*`)
```typescript
DESIGN_TOKENS.recipe.button.primary       // Complete button styling
DESIGN_TOKENS.recipe.input.base          // Complete input styling
DESIGN_TOKENS.recipe.card.base           // Complete card styling
```

### 5. **Icon System** (`icon.*`)
```typescript
DESIGN_TOKENS.icon.size.md               // 'w-5 h-5'
DESIGN_TOKENS.icon.margin.right         // 'mr-2'
DESIGN_TOKENS.icon.withMargin.mdLeft    // 'w-5 h-5 mr-3'
```

### 6. **Semantic Intent** (`semantic.*`)
```typescript
DESIGN_TOKENS.semantic.text.success     // 'text-green-600'
DESIGN_TOKENS.semantic.background.error // 'bg-red-50'
DESIGN_TOKENS.semantic.border.warning   // 'border-amber-500'
```

## 🚀 **Usage Patterns**

### Basic Token Usage
```typescript
import { DESIGN_TOKENS } from '@/design/tokens';

// Button component
<button className={DESIGN_TOKENS.recipe.button.primary}>
  Submit
</button>

// Layout pattern
<div className={DESIGN_TOKENS.layout.patterns.flexGap}>
  <Icon className={DESIGN_TOKENS.icon.size.md} />
  <span>Label</span>
</div>
```

### Template Literal Integration
```typescript
// Complex combinations with template literals
<div className={`
  ${DESIGN_TOKENS.layout.patterns.headerBar}
  ${DESIGN_TOKENS.theme.light.surface.base}
`}>
  Header Content
</div>
```

### Helper Function Usage
```typescript
import { getSemanticColors, getIconClasses } from '@/design/tokens';

// Semantic color helper
const colors = getSemanticColors('success');
<div className={`${colors.bg} ${colors.text} ${colors.border}`}>
  Success message
</div>

// Icon with margin helper
<Icon className={getIconClasses('md', 'right')} />
```

### Data Visualization Usage
```typescript
import { 
  DESIGN_TOKENS, 
  getChartSeriesColor, 
  getMetricChangeColor,
  getChartContainer 
} from '@/design/tokens';

// Chart container
<div className={DESIGN_TOKENS.dataViz.chartContainer}>
  <div className={DESIGN_TOKENS.dataViz.chartHeader}>
    <h3 className={DESIGN_TOKENS.dataViz.chartTitle}>Revenue Trends</h3>
    <span className={DESIGN_TOKENS.dataViz.chartSubtitle}>Last 30 days</span>
  </div>
  
  {/* Chart content */}
  <svg className="w-full h-64">
    <rect fill={getChartSeriesColor(0)} />
    <rect fill={getChartSeriesColor(1)} />
  </svg>
</div>

// Metric cards
<div className={DESIGN_TOKENS.dataViz.metricCard}>
  <div className={DESIGN_TOKENS.dataViz.metricLabel}>Total Revenue</div>
  <div className={DESIGN_TOKENS.dataViz.metricValue}>$124,589</div>
  <div className={`${DESIGN_TOKENS.dataViz.metricChange} ${getMetricChangeColor('positive')}`}>
    +12.5% from last month
  </div>
</div>

// Progress indicators
<div className={DESIGN_TOKENS.dataViz.progressContainer}>
  <div className={DESIGN_TOKENS.dataViz.progressBar}>
    <div 
      className={DESIGN_TOKENS.dataViz.progressFill}
      style={{ width: '75%' }}
    />
  </div>
</div>

// Dashboard layout helpers
<div className={getChartContainer('dashboard')}>
  <div className={getDashboardLayout('metrics')}>
    {/* Metrics row */}
  </div>
  <div className={getDashboardLayout('charts')}>
    {/* Charts section */}
  </div>
</div>
```

## 🏷️ **Type System**

### Core Types
```typescript
type ThemeMode = 'light' | 'dark';
type DensityLevel = 'comfortable' | 'compact' | 'spacious';
type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ComponentVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
type SemanticIntent = 'success' | 'warning' | 'error' | 'info';

// Data Visualization Types
type ChartSeriesIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
type MetricChangeType = 'positive' | 'negative' | 'neutral';
type SparklineVariant = 'success' | 'warning' | 'error' | 'info';
type ProgressVariant = 'primary' | 'success' | 'warning' | 'error';
type ChartContainerType = 'metric' | 'chart' | 'dashboard';
type DashboardSection = 'metrics' | 'charts' | 'analytics';
```

### Component-Specific Types
```typescript
type ButtonVariant = keyof typeof DESIGN_TOKENS.recipe.button;
type IconSize = keyof typeof DESIGN_TOKENS.icon.size;
type TypographyScale = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'small' | 'caption';
```

## 🔧 **Helper Functions**

### Semantic Helpers
```typescript
getSemanticColors(variant: ComponentVariant)
// Returns: { bg: string, text: string, border: string }

getSizeClasses(component: 'button' | 'input' | 'badge', size: ComponentSize)
// Returns: string

getTypographyClass(scale: TypographyScale)
// Returns: string
```

### Icon Helpers
```typescript
getIconClasses(size: IconSize, margin?: IconMargin)
// Returns: string - Combined icon size and margin classes

getIconWithMargin(variant: IconWithMargin)
// Returns: string - Predefined icon + margin combinations
```

### Layout Helpers
```typescript
getLayoutComponent(component: LayoutComponent)
// Returns: string - Complete layout component classes

combineTokens(...tokens: string[])
// Returns: string - Safely combines multiple token classes
```

### Animation Helpers
```typescript
getSemanticAnimation(intent: 'success' | 'error' | 'loading', phase: 'enter' | 'exit')
// Returns: string - Semantic animation classes

getInteractionAnimation(type: 'hover' | 'press' | 'focus')
// Returns: string - Interaction animation classes
```

### Data Visualization Helpers
```typescript
getChartSeriesColor(index: ChartSeriesIndex)
// Returns: string - Chart series color by index (0-7)

getMetricChangeColor(type: MetricChangeType)
// Returns: string - Color class for metric change indicators

getSparklineColor(variant: SparklineVariant)  
// Returns: string - Color class for sparkline charts

getProgressColor(percentage: number)
// Returns: string - Dynamic progress bar color based on percentage

getChartContainer(type: ChartContainerType)
// Returns: string - Container classes for different chart layouts

getDashboardLayout(section: DashboardSection)
// Returns: string - Layout classes for dashboard sections
```

## 🎯 **SSOT Integration**

### ESLint Enforcement
The tokens system is protected by automated ESLint rules that prevent hardcoded Tailwind usage:

```bash
# Check SSOT violations
npx eslint src/components --config .eslintrc.ssot.cjs

# Auto-fix violations (where possible)
npx eslint src/components --config .eslintrc.ssot.cjs --fix
```

### Violation Examples
```typescript
// ❌ VIOLATION - Hardcoded Tailwind
<button className="bg-blue-600 text-white px-4 py-2">Submit</button>

// ✅ CORRECT - Using tokens
<button className={DESIGN_TOKENS.recipe.button.primary}>Submit</button>

// ❌ VIOLATION - Hardcoded spacing
<div className="flex items-center gap-3">

// ✅ CORRECT - Using layout pattern
<div className={DESIGN_TOKENS.layout.patterns.flexGap}>
```

### Mapping Strategy
The SSOT system includes workspace-specific mappings for auto-fixing common violations:

```typescript
// Auto-fix mappings (tools/ssot-map.js)
'ml-2' → 'DESIGN_TOKENS.icon.margin.right'
'mr-2' → 'DESIGN_TOKENS.icon.margin.left'
'flex items-center gap-4' → 'DESIGN_TOKENS.layout.patterns.flexGapMd'
'text-2xl font-semibold' → 'DESIGN_TOKENS.typography.heading.h2'
```

## 📚 **Migration Guide**

### Phase 1: Replace Common Patterns
```typescript
// OLD: Hardcoded button
className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md"

// NEW: Token-based button  
className={DESIGN_TOKENS.recipe.button.primary}

// OLD: Hardcoded layout
className="flex items-center justify-between"

// NEW: Token-based layout
className={DESIGN_TOKENS.layout.patterns.spaceBetween}
```

### Phase 2: Leverage Template Literals
```typescript
// Complex component with multiple tokens
<div className={`
  ${DESIGN_TOKENS.layout.patterns.cardHeader}
  ${DESIGN_TOKENS.theme.light.surface.raised}
  ${DESIGN_TOKENS.theme.light.border.subtle}
`}>
  <h2 className={DESIGN_TOKENS.typography.heading.h3}>Title</h2>
  <div className={DESIGN_TOKENS.layout.patterns.flexGap}>
    <Icon className={DESIGN_TOKENS.icon.size.md} />
    <span className={DESIGN_TOKENS.typography.body.secondary}>Action</span>
  </div>
</div>
```

### Phase 3: Use Helper Functions
```typescript
// Before: Manual color assignment
const variant = 'success';
const classes = variant === 'success' ? 'bg-green-50 text-green-800' : '...';

// After: Helper function
const colors = getSemanticColors('success');
const classes = `${colors.bg} ${colors.text}`;
```

## 📖 **API Reference**

### Core Token Structure
```typescript
DESIGN_TOKENS = {
  theme: { light: {...}, dark: {...} },
  density: { comfortable: {...}, compact: {...}, spacious: {...} },
  typography: { heading: {...}, body: {...}, weight: {...} },
  layout: { shell: {...}, patterns: {...}, widths: {...} },
  spacing: { margin: {...}, padding: {...}, gap: {...}, stack: {...} },
  sizing: { button: {...}, input: {...}, avatar: {...} },
  semantic: { text: {...}, background: {...}, border: {...} },
  recipe: { button: {...}, input: {...}, card: {...}, badge: {...}, modal: {...} },
  icon: { size: {...}, margin: {...}, withMargin: {...}, button: {...}, color: {...} },
  motion: { transition: {...}, timing: {...}, semantic: {...} },
  state: { hover: {...}, focus: {...}, active: {...}, disabled: {...} },
  zIndex: { base: '...', raised: '...', modal: '...', toast: '...' },
  interaction: { menu: '...', button: {...}, focus: {...}, hover: {...} }
}
```

### Complete Coverage Areas

#### Component Recipes (25+ components)
- Buttons (primary, secondary, ghost, destructive, outline, link)
- Inputs (base, error, success, warning, sizes)
- Cards (base, interactive, elevated, flat, outlined, variants)
- Badges (default, success, warning, danger, info, outline)
- Modals (overlay, content, dialog)
- Forms (labels, textareas, selects, button groups)

#### Layout System (15+ patterns)
- Shell architecture (dashboard, splitPane, modal, drawer)
- Header patterns (bar, logo, search, actions, withAction)
- Content areas (main, section, stickyHeader)
- Navigation (sidebar, panel sections, headers)
- Position utilities (fixed, absolute, borders)

#### Icon System (20+ patterns)
- Sizes (xs, sm, md, lg, xl, xxl)
- Margins (left, right, top, bottom, all sides, xs-xl)
- With margin combinations (sm/md/lg + left/right/center)
- Button icons (only, withText, trailing)
- Semantic colors (success, warning, error, info, primary, secondary)

#### Motion System (15+ animations)
- Transitions (fast, normal, slow, spring)
- Timing functions (easeIn, easeOut, easeInOut, bounce)
- Semantic animations (success, error, loading enter/exit)
- Interaction animations (hover, press, focus)

## 🔐 **Locked Configuration Notice**

**This design system is now LOCKED and serves as the authoritative SDK for SparkTasks UI development.**

- ✅ All token categories are complete and production-ready
- ✅ Type system provides full TypeScript intelligence  
- ✅ SSOT enforcement prevents hardcoded Tailwind violations
- ✅ Helper functions simplify complex token combinations
- ✅ Migration path supports gradual adoption

**No modifications should be made to the core token structure without architectural review.**

---

*For questions or suggestions regarding this design system, please refer to the SSOT governance documentation or consult the development team.*
