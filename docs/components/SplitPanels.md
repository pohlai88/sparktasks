# SplitPanels Component

## Overview

The `SplitPanels` component is an enterprise-grade resizable panel system designed for complex dashboard layouts and multi-panel applications. It provides horizontal and vertical splitting capabilities with advanced features like persistence, accessibility, and touch support.

## Features

✅ **Bidirectional Resizing** - Horizontal and vertical panel splits  
✅ **Size Constraints** - Minimum and maximum size limits  
✅ **Collapsible Panels** - Individual panel collapse/expand functionality  
✅ **Persistence** - Save/restore panel sizes via localStorage  
✅ **Accessibility** - WCAG 2.1 AAA compliant with keyboard navigation  
✅ **Touch Support** - Optimized for mobile and tablet interactions  
✅ **Performance** - Efficient ResizeObserver-based monitoring  
✅ **TypeScript** - Full type safety with strict mode compliance  
✅ **Design System** - DESIGN_TOKENS V3.2 integration

## Installation

```typescript
import { SplitPanels, SplitPanel } from '@/components/layout/SplitPanels';
import type {
  SplitPanelsProps,
  SplitDirection,
  ResizeMode,
} from '@/components/layout/SplitPanels';
```

## Basic Usage

### Horizontal Split

```tsx
<SplitPanels direction='horizontal' sizes={[30, 70]}>
  <SplitPanel id='sidebar' title='Sidebar'>
    <div>Sidebar content</div>
  </SplitPanel>
  <SplitPanel id='main' title='Main Content'>
    <div>Main content area</div>
  </SplitPanel>
</SplitPanels>
```

### Vertical Split with Three Panels

```tsx
<SplitPanels
  direction='vertical'
  sizes={[25, 50, 25]}
  minSizes={[100, 200, 80]}
  collapsible={[false, false, true]}
>
  <SplitPanel id='header' title='Header'>
    <div>Header content</div>
  </SplitPanel>
  <SplitPanel id='workspace' title='Workspace'>
    <div>Main workspace</div>
  </SplitPanel>
  <SplitPanel id='properties' title='Properties' collapsible>
    <div>Properties panel</div>
  </SplitPanel>
</SplitPanels>
```

## API Reference

### SplitPanelsProps

| Property         | Type                                               | Default        | Description                      |
| ---------------- | -------------------------------------------------- | -------------- | -------------------------------- |
| `direction`      | `'horizontal' \| 'vertical'`                       | `'horizontal'` | Split orientation                |
| `sizes`          | `number[]`                                         | `[]`           | Panel sizes as percentages       |
| `minSizes`       | `number[]`                                         | `[]`           | Minimum panel sizes in pixels    |
| `maxSizes`       | `number[]`                                         | `[]`           | Maximum panel sizes in pixels    |
| `collapsible`    | `boolean[]`                                        | `[]`           | Which panels can be collapsed    |
| `resizable`      | `boolean`                                          | `true`         | Enable/disable resizing          |
| `resizeMode`     | `ResizeMode`                                       | `'smooth'`     | Resize behavior mode             |
| `touchEnabled`   | `boolean`                                          | `true`         | Enable touch interactions        |
| `persistSizes`   | `boolean`                                          | `false`        | Save sizes to localStorage       |
| `storageKey`     | `string`                                           | `undefined`    | localStorage key for persistence |
| `onSizeChange`   | `(sizes: number[], panelIndex?: number) => void`   | `undefined`    | Size change callback             |
| `onCollapse`     | `(panelIndex: number, collapsed: boolean) => void` | `undefined`    | Collapse callback                |
| `onLayoutChange` | `(metrics: LayoutMetrics) => void`                 | `undefined`    | Layout metrics callback          |

### SplitPanelProps

| Property      | Type        | Default     | Description                           |
| ------------- | ----------- | ----------- | ------------------------------------- |
| `id`          | `string`    | `required`  | Unique panel identifier               |
| `title`       | `string`    | `undefined` | Panel title for accessibility         |
| `collapsible` | `boolean`   | `false`     | Individual panel collapsible override |
| `className`   | `string`    | `undefined` | Additional CSS classes                |
| `children`    | `ReactNode` | `required`  | Panel content                         |

### ResizeMode Options

- **`'smooth'`** - Animated resizing with CSS transitions
- **`'immediate'`** - Instant size updates for performance
- **`'debounced'`** - Debounced updates for expensive operations

### LayoutMetrics

```typescript
interface LayoutMetrics {
  containerSize: number; // Container width/height
  panelCount: number; // Number of panels
  collapsedPanels: boolean[]; // Collapsed state per panel
  resizeTime: number; // Last resize duration (ms)
}
```

## Advanced Configuration

### Code Editor Layout

```tsx
<SplitPanels
  direction='horizontal'
  sizes={[20, 60, 20]}
  minSizes={[150, 300, 150]}
  persistSizes={true}
  storageKey='editor-layout'
  onSizeChange={sizes => console.log('Layout changed:', sizes)}
>
  <SplitPanel id='explorer' title='File Explorer'>
    <FileExplorer />
  </SplitPanel>
  <SplitPanel id='editor' title='Code Editor'>
    <CodeEditor />
  </SplitPanel>
  <SplitPanel id='properties' title='Properties Panel'>
    <PropertiesPanel />
  </SplitPanel>
</SplitPanels>
```

### Dashboard Layout with Collapsible Sidebar

```tsx
<SplitPanels
  direction='horizontal'
  sizes={[25, 75]}
  minSizes={[200, 400]}
  collapsible={[true, false]}
  persistSizes={true}
  storageKey='dashboard-layout'
  onCollapse={(index, collapsed) => {
    console.log(`Panel ${index} ${collapsed ? 'collapsed' : 'expanded'}`);
  }}
>
  <SplitPanel id='sidebar' title='Navigation' collapsible>
    <Navigation />
  </SplitPanel>
  <SplitPanel id='dashboard' title='Dashboard'>
    <DashboardContent />
  </SplitPanel>
</SplitPanels>
```

## Accessibility Features

### Keyboard Navigation

- **Tab**: Focus resize handles
- **Arrow Keys**: Resize panels (5px increments)
- **Shift + Arrow Keys**: Resize panels (20px increments)
- **Enter/Space**: Toggle panel collapse (when applicable)
- **Escape**: Release focus from resize handle

### Screen Reader Support

- Comprehensive ARIA labels and descriptions
- Role-based element identification
- State announcements for panel changes
- Keyboard navigation instructions

### Focus Management

- Visible focus indicators on resize handles
- Logical tab order through interactive elements
- Focus restoration after panel operations

## Performance Optimization

### ResizeObserver Integration

The component uses `ResizeObserver` for efficient layout monitoring:

```typescript
// Automatic container size detection
const observer = new ResizeObserver(entries => {
  // Efficient size calculations
  updatePanelSizes(entries[0].contentRect);
});
```

### Resize Mode Selection

Choose the appropriate resize mode for your use case:

- **Smooth**: Best for user-facing interfaces with visual feedback
- **Immediate**: Best for performance-critical applications
- **Debounced**: Best for expensive layout calculations

### Memory Management

- Automatic cleanup of ResizeObserver instances
- Event listener removal on unmount
- Efficient re-rendering with React.memo optimizations

## Testing

The component includes comprehensive test coverage:

```bash
# Run SplitPanels tests
npx vitest run test/components/SplitPanels.test.tsx

# Run with coverage
npx vitest run test/components/SplitPanels.test.tsx --coverage
```

### Test Coverage Areas

- ✅ Basic rendering and props acceptance
- ✅ Resize handle interactions (mouse, keyboard, touch)
- ✅ Panel collapse/expand functionality
- ✅ Size constraint enforcement
- ✅ Persistence and localStorage integration
- ✅ Accessibility compliance (ARIA, keyboard navigation)
- ✅ Performance metrics and edge cases
- ✅ Error handling and recovery

## Browser Compatibility

| Feature        | Chrome | Firefox | Safari   | Edge   |
| -------------- | ------ | ------- | -------- | ------ |
| ResizeObserver | ✅ 64+ | ✅ 69+  | ✅ 13.1+ | ✅ 79+ |
| Touch Events   | ✅     | ✅      | ✅       | ✅     |
| CSS Grid       | ✅     | ✅      | ✅       | ✅     |
| localStorage   | ✅     | ✅      | ✅       | ✅     |

## Troubleshooting

### Common Issues

**Q: Panels don't resize on container size change**  
A: Ensure the container has defined dimensions and ResizeObserver support

**Q: Persistence not working**  
A: Check that `persistSizes` is true and `storageKey` is provided

**Q: Touch interactions not responding**  
A: Verify `touchEnabled` is true and touch events aren't prevented by parent elements

**Q: TypeScript errors with strict mode**  
A: Ensure all required props are provided and optional props use proper conditional spreading

### Debug Mode

Enable detailed logging:

```typescript
<SplitPanels
  {...props}
  onLayoutChange={(metrics) => {
    console.log('Layout Metrics:', metrics);
  }}
  onSizeChange={(sizes, panelIndex) => {
    console.log('Size Change:', { sizes, panelIndex });
  }}
/>
```

## Migration Guide

### From Legacy Splitter Components

```typescript
// Before: Legacy splitter
<Splitter split="vertical" defaultSize="50%">
  <div>Panel 1</div>
  <div>Panel 2</div>
</Splitter>

// After: SplitPanels
<SplitPanels direction="vertical" sizes={[50, 50]}>
  <SplitPanel id="panel1" title="Panel 1">
    <div>Panel 1</div>
  </SplitPanel>
  <SplitPanel id="panel2" title="Panel 2">
    <div>Panel 2</div>
  </SplitPanel>
</SplitPanels>
```

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for development guidelines.

## License

See [LICENSE](../../LICENSE) for license information.
