# ButtonGroup Component Usage Guide

## Overview

The `ButtonGroup` component is an enterprise-grade container for grouped button actions that provides seamless visual cohesion and inheritance of properties across multiple buttons.

## Features

- ✅ **Seamless Button Grouping** - Connected borders for professional appearance
- ✅ **Property Inheritance** - Size and variant cascade to child buttons with override support
- ✅ **Orientation Support** - Horizontal (default) and vertical layouts
- ✅ **Attachment Modes** - Attached (connected) or spaced grouping
- ✅ **Accessibility Compliant** - WCAG 2.1 AA with proper ARIA group semantics
- ✅ **DESIGN_TOKENS Integration** - Zero hardcoded Tailwind classes
- ✅ **Dark Mode Support** - Theme-aware styling
- ✅ **Performance Optimized** - Efficient rendering with React.Children.map

## Basic Usage

```tsx
import { ButtonGroup, Button } from '@/components/ui';

// Basic horizontal group
<ButtonGroup>
  <Button>Save</Button>
  <Button>Cancel</Button>
</ButtonGroup>

// With inherited properties
<ButtonGroup variant="secondary" size="lg">
  <Button>Action 1</Button>
  <Button>Action 2</Button>
  <Button variant="destructive">Delete</Button> {/* Override variant */}
</ButtonGroup>
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Button components to group |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size inherited by child buttons |
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'destructive' \| 'outline' \| 'link'` | - | Variant inherited by child buttons |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction |
| `attached` | `boolean` | `true` | Connect buttons with shared borders |
| `spacing` | `'none' \| 'sm' \| 'md'` | `'none'` | Spacing between buttons (when `attached={false}`) |
| `fullWidth` | `boolean` | `false` | Expand to full container width |
| `aria-label` | `string` | - | Accessible label for the group |
| `className` | `string` | `''` | Additional CSS classes |

## Usage Patterns

### Toolbar Actions

```tsx
<ButtonGroup size="sm" attached={true} aria-label="Toolbar actions">
  <Button icon={<Save size={14} />} aria-label="Save" />
  <Button icon={<Edit size={14} />} aria-label="Edit" />
  <Button icon={<Trash size={14} />} variant="destructive" aria-label="Delete" />
</ButtonGroup>
```

### Form Actions

```tsx
<ButtonGroup fullWidth attached={false} spacing="md" aria-label="Form actions">
  <Button variant="outline">Cancel</Button>
  <Button variant="primary">Submit</Button>
</ButtonGroup>
```

### Vertical Navigation

```tsx
<ButtonGroup orientation="vertical" variant="ghost" aria-label="Navigation">
  <Button>Dashboard</Button>
  <Button>Analytics</Button>
  <Button>Settings</Button>
</ButtonGroup>
```

### Property Override

```tsx
<ButtonGroup variant="secondary" size="md">
  <Button>Normal</Button>
  <Button size="lg">Large Override</Button>
  <Button variant="destructive">Delete Override</Button>
</ButtonGroup>
```

## Accessibility

- Uses `role="group"` for screen reader compatibility
- Supports `aria-label` for group identification
- Maintains individual button accessibility
- Proper keyboard navigation (Tab/Shift+Tab)
- Focus management with visual indicators

## Design System Integration

- Consumes `DESIGN_TOKENS.layout.patterns` for layout
- Inherits theme-aware styling from button tokens
- Supports all button variants and sizes
- Dark mode compatible
- Responsive design patterns

## Examples in Context

### Enterprise Dashboard Toolbar

```tsx
<div className="dashboard-header">
  <ButtonGroup size="sm" aria-label="Document actions">
    <Button icon={<Save size={14} />}>Save</Button>
    <Button icon={<Share size={14} />}>Share</Button>
    <Button icon={<Download size={14} />}>Export</Button>
  </ButtonGroup>
  
  <ButtonGroup size="sm" attached={false} spacing="sm" aria-label="View options">
    <Button variant="ghost" icon={<Grid size={14} />} aria-label="Grid view" />
    <Button variant="ghost" icon={<List size={14} />} aria-label="List view" />
  </ButtonGroup>
</div>
```

### Form with Multiple Actions

```tsx
<form>
  {/* Form fields */}
  
  <ButtonGroup fullWidth spacing="md" attached={false} aria-label="Form actions">
    <Button variant="outline" onClick={onReset}>Reset</Button>
    <Button variant="secondary" onClick={onSaveDraft}>Save Draft</Button>
    <Button variant="primary" type="submit">Submit</Button>
  </ButtonGroup>
</form>
```

## Performance Notes

- Uses `React.Children.map` for efficient child iteration
- Property inheritance prevents prop drilling
- Minimal re-renders with stable class generation
- Tree-shakeable when using named imports
- No external dependencies beyond React

## Testing

The component includes comprehensive test coverage:
- ✅ 27 unit tests (100% passing)
- ✅ 2 integration tests (100% passing)
- ✅ Accessibility compliance validation
- ✅ Property inheritance verification
- ✅ Event handling validation
- ✅ Token integration testing
