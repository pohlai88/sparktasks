# ESLint Plugin for MAPS Token Guard

[![npm version](https://badge.fury.io/js/eslint-plugin-maps-token-guard.svg)](https://badge.fury.io/js/eslint-plugin-maps-token-guard)

ESLint plugin for MAPS Design System token governance and anti-drift enforcement.

## Features

- 🛡️ **Token Governance**: Prevents hardcoded values, enforces design tokens
- 🎨 **Dark-First Compliance**: Enforces dark-first design patterns
- ♿ **Accessibility**: Requires proper accessibility components
- 🎯 **Z-Index Management**: Prevents hardcoded z-index values
- 🚫 **Anti-Drift**: Stops design system violations

## Installation

```bash
npm install --save-dev eslint-plugin-maps-token-guard
```

## Usage

Add to your `.eslintrc.js`:

```javascript
module.exports = {
  plugins: ['maps-token-guard'],
  extends: ['plugin:maps-token-guard/recommended'],
  // Or configure individual rules:
  rules: {
    'maps-token-guard/no-raw-tailwind-in-components': 'error',
    'maps-token-guard/enforce-visually-hidden': 'warn',
  }
};
```

## Rules

### `no-raw-tailwind-in-components`

Disallows raw Tailwind classes in components. Use design tokens or CVA variants instead.

```tsx
// ❌ Bad
<div className="bg-red-500 p-4" />
<div className="bg-[#ff0000] p-[16px]" />

// ✅ Good  
<div className={buttonVariants({ variant: 'destructive', size: 'lg' })} />
```

### `no-inline-style-hardcoded`

Disallows hardcoded values in style objects.

```tsx
// ❌ Bad
<div style={{ color: '#ff0000', padding: '16px' }} />

// ✅ Good
<div className="text-destructive p-4" />
```

### `enforce-visually-hidden`

Requires `<VisuallyHidden>` component instead of `sr-only` class.

```tsx
// ❌ Bad
<span className="sr-only">Hidden text</span>

// ✅ Good
<VisuallyHidden>Hidden text</VisuallyHidden>
```

### `no-hardcoded-z-index`

Prevents hardcoded z-index values.

```tsx
// ❌ Bad
<div className="z-[999]" />
<div style={{ zIndex: 1000 }} />

// ✅ Good
const { zIndexClass } = useZIndex('modal-id', 'modal');
<div className={zIndexClass} />
```

### `require-dark-first`

Enforces dark-first design tokens instead of light-only utilities.

```tsx
// ❌ Bad
<div className="bg-white text-black" />

// ✅ Good
<div className="bg-surface-canvas text-foreground-primary" />
```

### `enforce-token-imports`

Requires components to import design tokens.

```tsx
// ❌ Bad - component without token imports

// ✅ Good
import { ENHANCED_DESIGN_TOKENS } from '@/design/enhanced-tokens';
```

## Configurations

### `recommended`

Standard configuration for most projects:

```javascript
extends: ['plugin:maps-token-guard/recommended']
```

### `strict`

Stricter enforcement for design system compliance:

```javascript
extends: ['plugin:maps-token-guard/strict']
```

### `tokens-only`

Focus only on token-related rules:

```javascript
extends: ['plugin:maps-token-guard/tokens-only']
```

## Integration with MAPS Design System

This plugin works best with:

- **MAPS Components**: `@/components/ui-enhanced/*`
- **Design Tokens**: `ENHANCED_DESIGN_TOKENS`
- **Z-Index Orchestrator**: `useZIndex()` hook
- **Accessibility Primitives**: `<VisuallyHidden>`, `<AccessibleIcon>`

## License

MIT
