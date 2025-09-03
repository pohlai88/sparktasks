# MAPS4 Design Tokens - Comprehensive Reference

## 🚀 Overview

The MAPS4 Design Token System provides **comprehensive coverage** of all critical Tailwind CSS utilities through a clean, semantic API. This system eliminates the need for raw Tailwind classes while maintaining full flexibility and power.

## 🎯 Key Principles

- **No Sandbox Complexity** - Direct access to all utilities
- **Semantic Organization** - Logical grouping by purpose
- **Type Safety** - Full TypeScript support
- **Production Ready** - Built for enterprise use
- **AI Agent Friendly** - Comprehensive coverage for AI development

## 📚 Token Categories

### 1. Foundation Layer

#### Motion Tokens
```typescript
import { ENHANCED_DESIGN_TOKENS } from '@/design/enhanced-tokens';

// Component-specific motion
const buttonMotion = ENHANCED_DESIGN_TOKENS.foundation.motionComponents.buttonHover;
const cardMotion = ENHANCED_DESIGN_TOKENS.foundation.motionComponents.cardHover;

// Pattern-based motion
const fadeIn = ENHANCED_DESIGN_TOKENS.foundation.motionPatterns.fadeInFast;
const slideIn = ENHANCED_DESIGN_TOKENS.foundation.motionPatterns.slideInStandard;

// Accessibility motion
const motionSafe = ENHANCED_DESIGN_TOKENS.foundation.motionAccessibility.motionSafeFadeIn;
const motionReduce = ENHANCED_DESIGN_TOKENS.foundation.motionAccessibility.motionReduceNone;
```

#### Color Tokens
```typescript
// Surface colors
const canvas = ENHANCED_DESIGN_TOKENS.foundation.color.surface.canvas;
const elevated = ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated;

// Content colors
const primary = ENHANCED_DESIGN_TOKENS.foundation.color.content.primary;
const secondary = ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary;

// Brand colors
const brandPrimary = ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.bg;
const brandHover = ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.hover;

// Feedback colors
const success = ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.bg;
const error = ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.bg;
```

#### Typography Tokens
```typescript
// Display text
const hero = ENHANCED_DESIGN_TOKENS.foundation.typography.display.hero;
const jumbo = ENHANCED_DESIGN_TOKENS.foundation.typography.display.jumbo;

// Headings
const h1 = ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h1;
const h2 = ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h2;

// Body text
const bodyLarge = ENHANCED_DESIGN_TOKENS.foundation.typography.body.large;
const bodySmall = ENHANCED_DESIGN_TOKENS.foundation.typography.body.small;

// Specialized text
const label = ENHANCED_DESIGN_TOKENS.foundation.typography.label;
const caption = ENHANCED_DESIGN_TOKENS.foundation.typography.caption;
```

#### Layout Tokens
```typescript
// Grid system
const gridCols2 = ENHANCED_DESIGN_TOKENS.foundation.layout.grid.columns[2];
const gridGap4 = ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md;
const responsiveGrid = ENHANCED_DESIGN_TOKENS.foundation.layout.grid.responsive['1-2-3'];

// Flexbox system
const flexCenter = ENHANCED_DESIGN_TOKENS.foundation.layout.flex.alignment.center;
const flexBetween = ENHANCED_DESIGN_TOKENS.foundation.layout.flex.alignment.between;

// Spacing system
const stack4 = ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md;
const cluster6 = ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.cluster.lg;

// Sizing
const fullWidth = ENHANCED_DESIGN_TOKENS.foundation.layout.width.full;
const max7xl = ENHANCED_DESIGN_TOKENS.foundation.layout.width['max-7xl'];
const fractionalWidth = ENHANCED_DESIGN_TOKENS.foundation.layout.fractional.width['1/2'];
```

#### Transform Tokens
```typescript
// Scale transformations
const scaleUp = ENHANCED_DESIGN_TOKENS.foundation.layout.transform.scale['105'];
const scaleDown = ENHANCED_DESIGN_TOKENS.foundation.layout.transform.scale['95'];
const scaleX = ENHANCED_DESIGN_TOKENS.foundation.layout.transform.scale['x-110'];

// Rotate transformations
const rotate45 = ENHANCED_DESIGN_TOKENS.foundation.layout.transform.rotate['45'];
const rotateNeg90 = ENHANCED_DESIGN_TOKENS.foundation.layout.transform.rotate['-90'];

// Translate transformations
const translateX4 = ENHANCED_DESIGN_TOKENS.foundation.layout.transform.translate['x-4'];
const translateYFull = ENHANCED_DESIGN_TOKENS.foundation.layout.transform.translate['y-full'];

// Skew transformations
const skewX2 = ENHANCED_DESIGN_TOKENS.foundation.layout.transform.skew['x-2'];
const skewYNeg3 = ENHANCED_DESIGN_TOKENS.foundation.layout.transform.skew['-y-3'];
```

#### Filter Tokens
```typescript
// Blur filters
const blurMd = ENHANCED_DESIGN_TOKENS.foundation.layout.filter.blur.md;
const blurLg = ENHANCED_DESIGN_TOKENS.foundation.layout.filter.blur.lg;

// Brightness filters
const brightness110 = ENHANCED_DESIGN_TOKENS.foundation.layout.filter.brightness['110'];
const brightness50 = ENHANCED_DESIGN_TOKENS.foundation.layout.filter.brightness['50'];

// Contrast filters
const contrast150 = ENHANCED_DESIGN_TOKENS.foundation.layout.filter.contrast['150'];

// Hue rotate filters
const hueRotate60 = ENHANCED_DESIGN_TOKENS.foundation.layout.filter.hueRotate['60'];
const hueRotateNeg30 = ENHANCED_DESIGN_TOKENS.foundation.layout.filter.hueRotate['-30'];
```

#### Animation Tokens
```typescript
// Animation names
const fadeIn = ENHANCED_DESIGN_TOKENS.foundation.layout.animation.name['fade-in'];
const slideUp = ENHANCED_DESIGN_TOKENS.foundation.layout.animation.name['slide-up'];
const bounce = ENHANCED_DESIGN_TOKENS.foundation.layout.animation.name.bounce;

// Animation duration
const duration200 = ENHANCED_DESIGN_TOKENS.foundation.layout.animation.duration['200'];
const duration500 = ENHANCED_DESIGN_TOKENS.foundation.layout.animation.duration['500'];

// Animation timing
const easeOut = ENHANCED_DESIGN_TOKENS.foundation.layout.animation.timing.out;
const easeSpring = ENHANCED_DESIGN_TOKENS.foundation.layout.animation.timing.spring;

// Animation delay
const delay100 = ENHANCED_DESIGN_TOKENS.foundation.layout.animation.delay['100'];
const delay300 = ENHANCED_DESIGN_TOKENS.foundation.layout.animation.delay['300'];
```

#### Positioning Tokens
```typescript
// Top positioning
const top4 = ENHANCED_DESIGN_TOKENS.foundation.layout.positioning.top['4'];
const topHalf = ENHANCED_DESIGN_TOKENS.foundation.layout.positioning.top['1/2'];
const topNeg12 = ENHANCED_DESIGN_TOKENS.foundation.layout.positioning.top['-12'];

// Right positioning
const right8 = ENHANCED_DESIGN_TOKENS.foundation.layout.positioning.right['8'];
const rightFull = ENHANCED_DESIGN_TOKENS.foundation.layout.positioning.right.full;

// Bottom positioning
const bottom16 = ENHANCED_DESIGN_TOKENS.foundation.layout.positioning.bottom['16'];
const bottomThird = ENHANCED_DESIGN_TOKENS.foundation.layout.positioning.bottom['1/3'];

// Left positioning
const left24 = ENHANCED_DESIGN_TOKENS.foundation.layout.positioning.left['24'];
const leftQuarter = ENHANCED_DESIGN_TOKENS.foundation.layout.positioning.left['1/4'];

// Inset positioning
const inset0 = ENHANCED_DESIGN_TOKENS.foundation.layout.positioning.inset['0'];
const insetHalf = ENHANCED_DESIGN_TOKENS.foundation.layout.positioning.inset['1/2'];
```

#### Interaction Tokens
```typescript
// Group variants
const groupHover = ENHANCED_DESIGN_TOKENS.foundation.layout.interaction.group.hover;
const groupFocus = ENHANCED_DESIGN_TOKENS.foundation.layout.interaction.group.focus;

// Peer variants
const peerChecked = ENHANCED_DESIGN_TOKENS.foundation.layout.interaction.group['peer-checked'];
const peerHover = ENHANCED_DESIGN_TOKENS.foundation.layout.interaction.group['peer-hover'];

// Data attribute variants
const stateChecked = ENHANCED_DESIGN_TOKENS.foundation.layout.interaction.data['state-checked'];
const stateOpen = ENHANCED_DESIGN_TOKENS.foundation.layout.interaction.data['state-open'];

// Print variants
const printHidden = ENHANCED_DESIGN_TOKENS.foundation.layout.interaction.print.hidden;
const printBlock = ENHANCED_DESIGN_TOKENS.foundation.layout.interaction.print.block;

// Motion variants
const motionSafe = ENHANCED_DESIGN_TOKENS.foundation.layout.interaction.motion.safe;
const motionReduce = ENHANCED_DESIGN_TOKENS.foundation.layout.interaction.motion.reduce;
```

#### Container Query Tokens
```typescript
// Container types
const containerInline = ENHANCED_DESIGN_TOKENS.foundation.layout.container.type.inline;
const containerSize = ENHANCED_DESIGN_TOKENS.foundation.layout.container.type.size;

// Container queries
const containerSm = ENHANCED_DESIGN_TOKENS.foundation.layout.container.query.sm;
const containerLg = ENHANCED_DESIGN_TOKENS.foundation.layout.container.query.lg;
```

### 2. Recipes Layer

#### Layout Recipes
```typescript
// Centered layout
const centerLayout = ENHANCED_DESIGN_TOKENS.recipes.layout.center;

// Stack layout
const stackBase = ENHANCED_DESIGN_TOKENS.recipes.layout.stack.base;
const stackSpacing4 = ENHANCED_DESIGN_TOKENS.recipes.layout.stack.spacing.md;

// Cluster layout
const clusterBase = ENHANCED_DESIGN_TOKENS.recipes.layout.cluster.base;
const clusterSpacing6 = ENHANCED_DESIGN_TOKENS.recipes.layout.cluster.spacing.lg;

// Grid layout
const gridBase = ENHANCED_DESIGN_TOKENS.recipes.layout.grid.base;
const responsiveGrid = ENHANCED_DESIGN_TOKENS.recipes.layout.grid.responsive['1-2-3'];

// Panel layout
const panelBase = ENHANCED_DESIGN_TOKENS.recipes.layout.panel.base;
const panelElevated = ENHANCED_DESIGN_TOKENS.recipes.layout.panel.elevated;
const panelGlass = ENHANCED_DESIGN_TOKENS.recipes.layout.panel.glass;

// Card layout
const cardBase = ENHANCED_DESIGN_TOKENS.recipes.layout.card.base;
const cardInteractive = ENHANCED_DESIGN_TOKENS.recipes.layout.card.interactive;
const cardGlass = ENHANCED_DESIGN_TOKENS.recipes.layout.card.glass;
```

#### Motion Recipes
```typescript
// Button motion
const buttonBase = ENHANCED_DESIGN_TOKENS.recipes.motion.button.base;
const buttonHover = ENHANCED_DESIGN_TOKENS.recipes.motion.button.hover;
const buttonActive = ENHANCED_DESIGN_TOKENS.recipes.motion.button.active;
const buttonFocus = ENHANCED_DESIGN_TOKENS.recipes.motion.button.focus;

// Card motion
const cardBase = ENHANCED_DESIGN_TOKENS.recipes.motion.card.base;
const cardHover = ENHANCED_DESIGN_TOKENS.recipes.motion.card.hover;
const cardActive = ENHANCED_DESIGN_TOKENS.recipes.motion.card.active;
const cardFocus = ENHANCED_DESIGN_TOKENS.recipes.motion.card.focus;

// Modal motion
const modalEnter = ENHANCED_DESIGN_TOKENS.recipes.motion.modal.enter;
const modalExit = ENHANCED_DESIGN_TOKENS.recipes.motion.modal.exit;
const modalOverlay = ENHANCED_DESIGN_TOKENS.recipes.motion.modal.overlay;
```

#### Color Recipes
```typescript
// Interactive colors
const primaryInteractive = ENHANCED_DESIGN_TOKENS.recipes.color.interactive.primary;
const secondaryInteractive = ENHANCED_DESIGN_TOKENS.recipes.color.interactive.secondary;
const ghostInteractive = ENHANCED_DESIGN_TOKENS.recipes.color.interactive.ghost;
const outlineInteractive = ENHANCED_DESIGN_TOKENS.recipes.color.interactive.outline;

// Status colors
const successStatus = ENHANCED_DESIGN_TOKENS.recipes.color.status.success;
const warningStatus = ENHANCED_DESIGN_TOKENS.recipes.color.status.warning;
const errorStatus = ENHANCED_DESIGN_TOKENS.recipes.color.status.error;
const infoStatus = ENHANCED_DESIGN_TOKENS.recipes.color.status.info;
```

## 🔧 Usage Examples

### Basic Component
```typescript
import { ENHANCED_DESIGN_TOKENS as tokens } from '@/design/enhanced-tokens';

const Button = ({ variant = 'primary', children }) => {
  const baseClasses = [
    tokens.foundation.layout.padding[4],
    tokens.foundation.layout.border.radius.md,
    tokens.foundation.layout.typography.button,
    tokens.foundation.motionComponents.buttonHover,
  ];

  const variantClasses = {
    primary: tokens.recipes.color.interactive.primary,
    secondary: tokens.recipes.color.interactive.secondary,
    ghost: tokens.recipes.color.interactive.ghost,
  };

  const className = [...baseClasses, variantClasses[variant]].join(' ');

  return <button className={className}>{children}</button>;
};
```

### Advanced Layout
```typescript
const CardGrid = () => {
  const gridClasses = [
    tokens.foundation.layout.grid.base,
    tokens.foundation.layout.grid.responsive['1-2-3'],
    tokens.foundation.layout.grid.gap.lg,
  ];

  const cardClasses = [
    tokens.recipes.layout.card.base,
    tokens.recipes.layout.card.interactive,
    tokens.recipes.motion.card.base,
  ];

  return (
    <div className={gridClasses.join(' ')}>
      {items.map(item => (
        <div key={item.id} className={cardClasses.join(' ')}>
          {item.content}
        </div>
      ))}
    </div>
  );
};
```

### Responsive Design
```typescript
const HeroSection = () => {
  const containerClasses = [
    tokens.foundation.layout.container.center,
    tokens.foundation.layout.padding[16],
    tokens.foundation.layout.padding.md,
  ];

  const titleClasses = [
    tokens.foundation.layout.typography.display.hero,
    tokens.foundation.layout.color.content.primary,
    tokens.foundation.layout.text.alignment.center,
  ];

  return (
    <section className={containerClasses.join(' ')}>
      <h1 className={titleClasses.join(' ')}>
        Welcome to MAPS4
      </h1>
    </section>
  );
};
```

## 🚀 Benefits

### For Developers
- **Type Safety** - Full TypeScript support with autocomplete
- **Semantic API** - Intuitive token organization
- **No Raw Classes** - Consistent design system usage
- **Easy Refactoring** - Centralized token management

### For Designers
- **Design Consistency** - Enforced design tokens
- **Easy Updates** - Change once, update everywhere
- **Visual Harmony** - Cohesive design language
- **Accessibility** - Built-in AAA compliance

### For Teams
- **Onboarding** - Clear token documentation
- **Collaboration** - Shared design vocabulary
- **Maintenance** - Centralized design system
- **Scalability** - Enterprise-ready architecture

## 📊 Token Coverage

- **Motion**: 100+ transition and animation tokens
- **Color**: 80+ semantic color tokens
- **Typography**: 30+ text and font tokens
- **Layout**: 200+ spacing, grid, and flexbox tokens
- **Transform**: 150+ scale, rotate, translate, and skew tokens
- **Filter**: 100+ blur, brightness, contrast, and effect tokens
- **Animation**: 50+ animation name, duration, and timing tokens
- **Positioning**: 200+ top, right, bottom, left, and inset tokens
- **Interaction**: 50+ group, peer, and state variant tokens
- **Container**: 10+ container query and type tokens
- **Fractional**: 50+ width and height fraction tokens

**Total: 1,000+ comprehensive design tokens**

## 🎯 Next Steps

1. **Import tokens** in your components
2. **Replace raw classes** with semantic tokens
3. **Use recipes** for common patterns
4. **Extend tokens** as needed for your use cases
5. **Share knowledge** with your team

This comprehensive token system gives you the power and flexibility of Tailwind CSS while maintaining the consistency and maintainability of a professional design system.
