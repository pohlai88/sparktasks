# ⚡ LAYOUT-ENHANCED: Essential Primitives Specification

## Strategic Framework: Layout Excellence with MAPS Governance

### Core Philosophy

- **Essential Primitives Only**: Focus on core layout building blocks that enable 95% of layout patterns
- **MAPS v3.0 Governance**: All components styled through ENHANCED_DESIGN_TOKENS with runtime governance
- **Container Query Ready**: Modern responsive design with container queries for component-level responsiveness
- **Performance First**: Zero-layout-shift design with proper spacing primitives and content-aware containers
- **Accessibility Excellence**: Screen reader friendly layout patterns with proper semantic structure
- **Developer Experience**: Intuitive APIs that make complex layouts simple to implement

---

## 🏗️ **Component Architecture Overview**

### **Component Category 1: Container System (2 Components)**

Foundation layout containers with max-width constraints and semantic spacing

### **Component Category 2: Grid System (2 Components)**

CSS Grid and responsive grid systems with container queries and automatic placement

### **Component Category 3: Spacing Primitives (2 Components)**

Universal spacing components for vertical and horizontal layout composition

### **Component Category 4: Panel System (3 Components)**

Resizable panel layouts with persistence and sophisticated interaction patterns

### **Component Category 5: Motion Integration (1 Component)**

Layout-aware motion and transition system integrated with MAPS motion presets

---

## 📦 **1. Container - Foundation Layout Primitive**

### **Purpose**

Semantic layout containers with MAPS-governed max-width constraints, spacing, and responsive behavior.

### **Core Specifications**

```typescript
interface ContainerProps extends VariantProps<typeof containerVariants> {
  // Size Constraints
  size?:
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | 'full'
    | 'content'
    | 'prose';

  // Spacing Control
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  spacingX?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  spacingY?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

  // Semantic Layout
  as?: 'div' | 'main' | 'section' | 'article' | 'aside' | 'header' | 'footer';
  asChild?: boolean; // Polymorphic component support

  // Alignment
  center?: boolean; // Center content horizontally
  centerContent?: boolean; // Center all child content

  // Responsive Behavior
  breakout?: boolean; // Allow content to break out of container
  fluid?: boolean; // Fluid width below breakpoint

  // MAPS Integration
  surface?: 'canvas' | 'elevated' | 'glass' | 'panel';

  className?: string;
  children: React.ReactNode;
}

// Pre-defined container sizes based on MAPS design tokens
const ContainerSizes = {
  xs: '20rem', // 320px - Mobile small
  sm: '24rem', // 384px - Mobile large
  md: '28rem', // 448px - Tablet small
  lg: '32rem', // 512px - Tablet large
  xl: '36rem', // 576px - Desktop small
  '2xl': '42rem', // 672px - Desktop large
  full: '100%', // Full width
  content: '65ch', // Optimal content width
  prose: '75ch', // Reading width
} as const;
```

### **Usage Patterns**

```typescript
// Basic semantic containers
<Container as="main" size="lg" spacing="md">
  <h1>Page Title</h1>
  <p>Page content...</p>
</Container>

// Reading-optimized containers
<Container size="prose" center>
  <article>Long form content...</article>
</Container>

// Full-width with breakout sections
<Container size="full" spacing="none">
  <Container size="lg" spacing="md">
    <p>Constrained content</p>
  </Container>
  <div className="bg-accent-bg" breakout>
    <Container size="lg" spacing="md">
      <p>Full-width section with constrained content</p>
    </Container>
  </div>
</Container>

// Polymorphic usage
<Container asChild>
  <motion.section
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    Content with motion
  </motion.section>
</Container>
```

---

## 📐 **2. Stack - Vertical Spacing Primitive**

### **Purpose**

Universal vertical spacing component that provides consistent gaps between child elements using MAPS spacing tokens.

### **Core Specifications**

```typescript
interface StackProps extends VariantProps<typeof stackVariants> {
  // Spacing Control
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

  // Alignment Options
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

  // Direction Control
  direction?: 'column' | 'column-reverse';

  // Responsive Behavior
  responsive?: {
    sm?: Partial<StackProps>;
    md?: Partial<StackProps>;
    lg?: Partial<StackProps>;
  };

  // Semantic HTML
  as?: 'div' | 'section' | 'article' | 'nav' | 'ul' | 'ol';
  asChild?: boolean;

  // Dividers
  divider?: boolean | React.ReactNode;
  dividerColor?: 'subtle' | 'muted' | 'accent';

  className?: string;
  children: React.ReactNode;
}

// Stack gap mapping to MAPS spacing tokens
const StackGaps = {
  none: '0',
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  '2xl': '3rem', // 48px
  '3xl': '4rem', // 64px
} as const;
```

### **Usage Patterns**

```typescript
// Basic vertical spacing
<Stack gap="md">
  <h2>Section Title</h2>
  <p>First paragraph</p>
  <p>Second paragraph</p>
  <Button>Action</Button>
</Stack>

// Responsive spacing
<Stack
  gap="sm"
  responsive={{
    md: { gap: 'lg' },
    lg: { gap: 'xl' }
  }}
>
  <Card>Content</Card>
  <Card>Content</Card>
</Stack>

// With dividers
<Stack gap="lg" divider dividerColor="subtle">
  <Section>First section</Section>
  <Section>Second section</Section>
  <Section>Third section</Section>
</Stack>

// Semantic lists
<Stack as="ul" gap="sm" align="start">
  <li>List item 1</li>
  <li>List item 2</li>
  <li>List item 3</li>
</Stack>
```

---

## 🔄 **3. Cluster - Horizontal Spacing Primitive**

### **Purpose**

Horizontal layout component for inline content with consistent spacing, wrapping, and alignment using MAPS spacing tokens.

### **Core Specifications**

```typescript
interface ClusterProps extends VariantProps<typeof clusterVariants> {
  // Spacing Control
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  gapX?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  gapY?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

  // Flex Behavior
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

  // Direction Control
  direction?: 'row' | 'row-reverse';

  // Responsive Behavior
  responsive?: {
    sm?: Partial<ClusterProps>;
    md?: Partial<ClusterProps>;
    lg?: Partial<ClusterProps>;
  };

  // Semantic HTML
  as?: 'div' | 'nav' | 'ul' | 'ol' | 'span';
  asChild?: boolean;

  className?: string;
  children: React.ReactNode;
}
```

### **Usage Patterns**

```typescript
// Button groups
<Cluster gap="sm" wrap="wrap">
  <Button variant="primary">Save</Button>
  <Button variant="secondary">Cancel</Button>
  <Button variant="ghost">Reset</Button>
</Cluster>

// Navigation menus
<Cluster as="nav" gap="lg" align="center">
  <Link href="/">Home</Link>
  <Link href="/about">About</Link>
  <Link href="/contact">Contact</Link>
</Cluster>

// Tag lists with wrapping
<Cluster gap="xs" gapY="sm" wrap="wrap">
  <Badge>React</Badge>
  <Badge>TypeScript</Badge>
  <Badge>MAPS</Badge>
  <Badge>Design System</Badge>
</Cluster>

// Responsive behavior
<Cluster
  gap="sm"
  responsive={{
    sm: { direction: 'column', gap: 'md' },
    md: { direction: 'row', gap: 'lg' }
  }}
>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
</Cluster>
```

---

## 🎛️ **4. Grid - CSS Grid Layout System**

### **Purpose**

Modern CSS Grid layout component with container queries, automatic placement, and responsive grid patterns.

### **Core Specifications**

```typescript
interface GridProps extends VariantProps<typeof gridVariants> {
  // Grid Structure
  columns?: number | 'auto' | 'min-content' | 'max-content' | string;
  rows?: number | 'auto' | 'min-content' | 'max-content' | string;

  // Responsive Grid
  responsive?: {
    sm?: Partial<GridProps>;
    md?: Partial<GridProps>;
    lg?: Partial<GridProps>;
  };

  // Gap Control
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  gapX?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  gapY?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

  // Alignment
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  justifyItems?: 'start' | 'center' | 'end' | 'stretch';
  alignContent?:
    | 'start'
    | 'center'
    | 'end'
    | 'stretch'
    | 'between'
    | 'around'
    | 'evenly';
  justifyContent?:
    | 'start'
    | 'center'
    | 'end'
    | 'stretch'
    | 'between'
    | 'around'
    | 'evenly';

  // Auto-placement
  autoFlow?: 'row' | 'column' | 'dense' | 'row-dense' | 'column-dense';
  autoColumns?: 'min' | 'max' | 'fr' | string;
  autoRows?: 'min' | 'max' | 'fr' | string;

  // Container Queries
  containerQueries?: boolean;
  minItemWidth?: string; // For auto-responsive grids

  // Semantic HTML
  as?: 'div' | 'section' | 'article' | 'ul' | 'ol';
  asChild?: boolean;

  className?: string;
  children: React.ReactNode;
}

// Common grid patterns
const GridPatterns = {
  'auto-fit': 'repeat(auto-fit, minmax(var(--min-item-width, 250px), 1fr))',
  'auto-fill': 'repeat(auto-fill, minmax(var(--min-item-width, 250px), 1fr))',
  sidebar: 'minmax(250px, 1fr) 3fr',
  'holy-grail': '1fr 3fr 1fr',
  masonry: 'repeat(auto-fill, minmax(250px, 1fr))',
} as const;
```

### **Usage Patterns**

```typescript
// Auto-responsive grid
<Grid
  columns="auto-fit"
  minItemWidth="300px"
  gap="lg"
  containerQueries
>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</Grid>

// Explicit responsive grid
<Grid
  columns={1}
  gap="md"
  responsive={{
    sm: { columns: 2 },
    md: { columns: 3 },
    lg: { columns: 4 }
  }}
>
  <ProductCard />
  <ProductCard />
  <ProductCard />
</Grid>

// Sidebar layout
<Grid columns="sidebar" gap="xl" className="min-h-screen">
  <aside>Sidebar content</aside>
  <main>Main content</main>
</Grid>

// Complex grid with custom areas
<Grid
  columns="1fr 3fr 1fr"
  rows="auto 1fr auto"
  gap="md"
  className="min-h-screen"
>
  <header className="col-span-3">Header</header>
  <aside>Left sidebar</aside>
  <main>Main content</main>
  <aside>Right sidebar</aside>
  <footer className="col-span-3">Footer</footer>
</Grid>
```

---

## 📱 **5. ResponsiveGrid - Container Query Grid**

### **Purpose**

Advanced grid system that uses container queries for true component-level responsiveness, independent of viewport size.

### **Core Specifications**

```typescript
interface ResponsiveGridProps
  extends VariantProps<typeof responsiveGridVariants> {
  // Container-based Breakpoints
  breakpoints?: {
    xs?: string; // 320px
    sm?: string; // 480px
    md?: string; // 768px
    lg?: string; // 1024px
    xl?: string; // 1280px
  };

  // Grid Configuration per Breakpoint
  gridConfig?: {
    xs?: GridConfig;
    sm?: GridConfig;
    md?: GridConfig;
    lg?: GridConfig;
    xl?: GridConfig;
  };

  // Auto-sizing Options
  autoSizing?: {
    minItemWidth?: string;
    maxItemWidth?: string;
    aspectRatio?: string;
    maintainAspectRatio?: boolean;
  };

  // Performance
  virtualized?: boolean;
  virtualizedHeight?: number;
  overscan?: number;

  // Container Query Features
  containerName?: string;
  containerType?: 'size' | 'inline-size' | 'block-size';

  className?: string;
  children: React.ReactNode;
}

interface GridConfig {
  columns: number | string;
  rows?: number | string;
  gap?: string;
  alignItems?: string;
  justifyItems?: string;
}
```

### **Usage Patterns**

```typescript
// Container query responsive grid
<ResponsiveGrid
  containerName="product-grid"
  autoSizing={{
    minItemWidth: '280px',
    aspectRatio: '3/4'
  }}
  gridConfig={{
    xs: { columns: 1, gap: 'md' },
    sm: { columns: 2, gap: 'lg' },
    md: { columns: 3, gap: 'xl' },
    lg: { columns: 4, gap: 'xl' }
  }}
>
  <ProductCard />
  <ProductCard />
  <ProductCard />
</ResponsiveGrid>

// Virtualized grid for large datasets
<ResponsiveGrid
  virtualized
  virtualizedHeight={600}
  overscan={5}
  autoSizing={{
    minItemWidth: '200px',
    maxItemWidth: '300px'
  }}
>
  {largeDataset.map(item => (
    <DataCard key={item.id} data={item} />
  ))}
</ResponsiveGrid>
```

---

## 🔧 **6. PanelGroup - Resizable Panel System**

### **Purpose**

Sophisticated resizable panel layout system with persistence, keyboard navigation, and touch support.

### **Core Specifications**

```typescript
interface PanelGroupProps extends VariantProps<typeof panelGroupVariants> {
  // Layout Direction
  direction: 'horizontal' | 'vertical';

  // Behavior
  autoSaveId?: string; // Persistence key
  storage?: Storage; // Custom storage implementation

  // Constraints
  minSize?: number; // Global minimum panel size (%)
  maxSize?: number; // Global maximum panel size (%)

  // Interaction
  disabled?: boolean;
  keyboardResizeBy?: number; // Pixels to resize on keyboard input

  // Touch Support
  touchResizeBy?: number;

  // Callbacks
  onLayout?: (sizes: number[]) => void;
  onResize?: (sizes: number[]) => void;
  onResizeStart?: () => void;
  onResizeEnd?: () => void;

  // Styling
  surface?: 'elevated' | 'glass' | 'panel';
  handleVariant?: 'line' | 'bar' | 'invisible';

  className?: string;
  children: React.ReactNode;
}

// Panel component for use within PanelGroup
interface PanelProps extends VariantProps<typeof panelVariants> {
  // Size Control
  defaultSize?: number; // Default size as percentage
  minSize?: number; // Minimum size as percentage
  maxSize?: number; // Maximum size as percentage

  // Behavior
  collapsible?: boolean;
  collapsedSize?: number;

  // Callbacks
  onCollapse?: () => void;
  onExpand?: () => void;
  onResize?: (size: number) => void;

  // Content
  id?: string; // For persistence
  order?: number; // Panel order

  className?: string;
  children: React.ReactNode;
}

// Resize handle component
interface PanelHandleProps extends VariantProps<typeof panelHandleVariants> {
  // Interaction
  disabled?: boolean;

  // Styling
  variant?: 'line' | 'bar' | 'grip' | 'invisible';
  size?: 'sm' | 'md' | 'lg';

  // Accessibility
  ariaLabel?: string;

  className?: string;
  children?: React.ReactNode;
}
```

### **Usage Patterns**

```typescript
// Basic horizontal split layout
<PanelGroup direction="horizontal" autoSaveId="main-layout">
  <Panel defaultSize={30} minSize={20} maxSize={50}>
    <Sidebar />
  </Panel>
  <PanelHandle variant="bar" />
  <Panel>
    <MainContent />
  </Panel>
</PanelGroup>

// Complex three-panel layout
<PanelGroup direction="horizontal" autoSaveId="editor-layout">
  <Panel defaultSize={20} minSize={15} collapsible>
    <FileExplorer />
  </Panel>
  <PanelHandle variant="line" />
  <Panel defaultSize={60}>
    <PanelGroup direction="vertical">
      <Panel defaultSize={70}>
        <CodeEditor />
      </Panel>
      <PanelHandle variant="grip" />
      <Panel defaultSize={30} minSize={20}>
        <Terminal />
      </Panel>
    </PanelGroup>
  </Panel>
  <PanelHandle variant="line" />
  <Panel defaultSize={20} minSize={15} collapsible>
    <Inspector />
  </Panel>
</PanelGroup>

// Mobile-friendly vertical layout
<PanelGroup
  direction="vertical"
  autoSaveId="mobile-layout"
  touchResizeBy={10}
>
  <Panel defaultSize={40} minSize={30}>
    <Header />
    <Navigation />
  </Panel>
  <PanelHandle variant="bar" size="lg" />
  <Panel>
    <Content />
  </Panel>
</PanelGroup>
```

---

## ⚡ **7. MotionLayout - Layout-Aware Motion System**

### **Purpose**

Layout transition system that integrates with MAPS motion presets for smooth, layout-aware animations.

### **Core Specifications**

```typescript
interface MotionLayoutProps extends VariantProps<typeof motionLayoutVariants> {
  // Motion Configuration
  layoutId?: string; // For shared layout animations
  layout?: boolean | 'position' | 'size'; // Enable layout animations

  // Transition Presets
  preset?: 'spring' | 'ease' | 'linear' | 'bounce';
  duration?: number; // Override preset duration

  // Layout Shift Prevention
  measureBeforeMount?: boolean;
  preserveAspectRatio?: boolean;

  // Advanced Animations
  layoutRoot?: boolean; // Root for layout animation context
  layoutScroll?: boolean; // Animate on scroll

  // Interaction States
  whileHover?: MotionValue;
  whileTap?: MotionValue;
  whileFocus?: MotionValue;
  whileInView?: MotionValue;

  // Accessibility
  respectReducedMotion?: boolean;

  // Callbacks
  onLayoutAnimationStart?: () => void;
  onLayoutAnimationComplete?: () => void;

  className?: string;
  children: React.ReactNode;
}

// Layout transition variants
const LayoutTransitions = {
  spring: {
    type: 'spring',
    stiffness: 400,
    damping: 30,
  },
  ease: {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.3,
  },
  linear: {
    type: 'tween',
    ease: 'linear',
    duration: 0.2,
  },
  bounce: {
    type: 'spring',
    stiffness: 600,
    damping: 15,
  },
} as const;
```

### **Usage Patterns**

```typescript
// Layout-aware card grid
<MotionLayout layout="position" preset="spring">
  <Grid columns="auto-fit" gap="md">
    {items.map(item => (
      <MotionLayout
        key={item.id}
        layoutId={item.id}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Card>{item.content}</Card>
      </MotionLayout>
    ))}
  </Grid>
</MotionLayout>

// Shared layout transitions
<MotionLayout layoutRoot>
  {selectedItem ? (
    <MotionLayout layoutId="modal" preset="ease">
      <Modal>
        <MotionLayout layoutId={selectedItem.id}>
          <DetailView item={selectedItem} />
        </MotionLayout>
      </Modal>
    </MotionLayout>
  ) : (
    <MotionLayout layout="position">
      <Grid>
        {items.map(item => (
          <MotionLayout
            key={item.id}
            layoutId={item.id}
            onClick={() => setSelectedItem(item)}
          >
            <CardView item={item} />
          </MotionLayout>
        ))}
      </Grid>
    </MotionLayout>
  )}
</MotionLayout>

// Scroll-triggered animations
<MotionLayout
  layoutScroll
  whileInView={{ opacity: 1, y: 0 }}
  initial={{ opacity: 0, y: 50 }}
  transition={{ duration: 0.6 }}
>
  <Section>Content that animates in</Section>
</MotionLayout>
```

---

## 🎯 **Implementation Priority & Dependencies**

### **Phase 1: Foundation Primitives (Days 1-3)**

1. **Container** - Layout foundation with semantic HTML
2. **Stack** - Vertical spacing primitive
3. **Cluster** - Horizontal spacing primitive

### **Phase 2: Grid Systems (Days 4-6)**

4. **Grid** - CSS Grid layout system
5. **ResponsiveGrid** - Container query responsive grid

### **Phase 3: Advanced Layouts (Days 7-9)**

6. **PanelGroup, Panel, PanelHandle** - Resizable panel system
7. **MotionLayout** - Layout-aware animations

### **Dependencies Map**

```json
{
  "layout-primitives": [
    "framer-motion@^11.11.9",
    "@container-query-polyfill/react@^1.0.0"
  ],
  "panel-system": ["react-resizable-panels@^2.1.4"],
  "container-queries": ["@container-query-polyfill/postcss@^1.0.0"]
}
```

---

## ✅ **MAPS v3.0 Integration Strategy**

### **MAPS Token Governance**

- ✅ All spacing uses ENHANCED_DESIGN_TOKENS.spacing scale
- ✅ Container sizes derived from MAPS breakpoint system
- ✅ Surface variants integrate with MAPS surface doctrine
- ✅ Motion presets use MAPS transition tokens

### **Accessibility Compliance**

- ✅ Semantic HTML elements by default (main, section, article, etc.)
- ✅ Keyboard navigation for resizable panels
- ✅ Screen reader announcements for layout changes
- ✅ Respect for prefers-reduced-motion in all animations

### **Performance Optimization**

- ✅ Container queries for component-level responsiveness
- ✅ Layout animation optimization with will-change
- ✅ Virtualization support for large grids
- ✅ Zero layout shift with proper sizing

### **Enterprise Ready Features**

- ✅ Layout persistence with localStorage/sessionStorage
- ✅ Polymorphic components with asChild support
- ✅ TypeScript strict mode compliance
- ✅ Comprehensive responsive design patterns

This specification ensures seamless integration with the MAPS design system while providing essential layout primitives that enable sophisticated, accessible, and performant layout patterns across all enterprise applications.

---

## 🎯 **SPECIFICATION SUMMARY**

### **8 Essential Layout Components (7 Logical Systems) Created:**

1. **Container** - Foundation layout primitive with semantic HTML and MAPS governance
2. **Stack** - Vertical spacing primitive with consistent gaps
3. **Cluster** - Horizontal spacing primitive with flex behavior
4. **Grid** - Modern CSS Grid system with responsive patterns
5. **ResponsiveGrid** - Container query grid for component-level responsiveness
6. **PanelGroup** - Sophisticated resizable panel system with persistence
7. **Panel** - Individual panel component with collapsible behavior
8. **PanelHandle** - Drag handle component with MAPS styling
9. **MotionLayout** - Layout-aware motion system with MAPS integration

_Note: Panel system components (PanelGroup + Panel + PanelHandle) work together as one logical system_

### **Implementation Priority Summary:**

- **Phase 1 (Days 1-3)**: Container, Stack, Cluster primitives
- **Phase 2 (Days 4-6)**: Grid and ResponsiveGrid systems
- **Phase 3 (Days 7-9)**: PanelGroup system and MotionLayout

The specifications are perfectly synchronized with MAPS v3.0 design system architecture and ready for immediate development.

---

## 🤖 **AI-ASSISTED DEVELOPMENT STRATEGY**

### **🚀 AI Layout Workflow for Layout-Enhanced**

Following MAPS v3.0 philosophy of 10x development velocity through AI assistance:

```typescript
// AI Development Patterns for Layout-Enhanced Components
export const aiLayoutWorkflow = {
  // 1. Primitive Generation
  generateLayoutPrimitive: `
    Create a MAPS v3.0 layout primitive with:
    - CVA variants using ENHANCED_DESIGN_TOKENS spacing only
    - Polymorphic asChild support with proper TypeScript
    - Semantic HTML element options (div, section, main, etc.)
    - Container query integration where applicable
    - Motion preset integration for layout animations
    - Full accessibility compliance (ARIA, semantic structure)
    - Zero layout shift design patterns
  `,

  // 2. Responsive System Generation
  generateResponsiveGrid: `
    Create responsive grid system that:
    - Uses CSS Grid with container queries
    - Integrates MAPS spacing tokens for gaps
    - Supports auto-fit and auto-fill patterns
    - Includes virtualization for performance
    - Provides semantic HTML options
    - Follows MAPS surface doctrine for styling
  `,

  // 3. Panel System Generation
  generatePanelSystem: `
    Create resizable panel system that:
    - Integrates react-resizable-panels with MAPS styling
    - Supports persistence with localStorage
    - Includes keyboard navigation and accessibility
    - Uses MAPS motion presets for smooth resizing
    - Follows MAPS surface variants for theming
    - Provides touch-friendly interaction patterns
  `,
};
```

### **⚡ AI Prompts for 10x Layout Development**

```bash
# AI-Assisted Layout Component Generation
ai-generate component Container \
  --type=layout-enhanced \
  --primitive=true \
  --semantic-html=true \
  --polymorphic=true \
  --governance=maps-v3

# AI-Assisted Grid System
ai-generate component ResponsiveGrid \
  --type=layout-enhanced \
  --container-queries=true \
  --virtualization=true \
  --accessibility=wcag-aaa

# AI-Assisted Panel System
ai-generate component PanelGroup \
  --type=layout-enhanced \
  --library=react-resizable-panels \
  --persistence=true \
  --keyboard-nav=true \
  --governance=maps-v3

# AI Code Review and Layout Optimization
ai-review src/components/layout-enhanced/ \
  --optimize=layout-shift,accessibility,performance \
  --enforce=container-queries,semantic-html
```

### **🎯 AI-Generated Layout Patterns**

```typescript
// Auto-generate layout pattern library
export const aiLayoutPatterns = {
  generateLayoutComposition:
    'AI creates complete layout compositions with proper primitives',
  generateResponsiveBreakpoints:
    'AI generates optimal container query breakpoints',
  generateSemanticStructure: 'AI creates accessible HTML structure patterns',
  generateMotionCoordination:
    'AI coordinates layout transitions with MAPS motion presets',
};
```

---

## 🛡️ **MAPS v3.0 GOVERNANCE INTEGRATION**

### **🎯 Runtime Layout Governance**

All layout-enhanced components integrate with MAPS v3.0 governance primitives:

```typescript
// Primary governance through ENHANCED_DESIGN_TOKENS
import { ENHANCED_DESIGN_TOKENS } from '@/design/enhanced-tokens'

export function Container({ spacing = 'md', size = 'lg', ...props }) {
  // All spacing through enhanced tokens
  const containerClasses = cn(
    ENHANCED_DESIGN_TOKENS.spacing[spacing],
    ENHANCED_DESIGN_TOKENS.containers[size],
    className
  )

  // TokenGuard available for development-time validation
  // const { validateProps } = useTokenGuard({ enforceLayoutTokens: true })

  return (
    <div
      className={cn(
        // ✅ Token-based styling only
        'mx-auto w-full',
        containerClasses,
        className
      )}
      {...props}
    />
  )
}
```

### **🎯 Layout Motion Integration**

```typescript
// Motion governance for layout animations
import { useMotion } from '@/components/primitives/motion-presets'

export function MotionLayout({ preset = 'spring', ...props }) {
  const { motionClasses, isReducedMotion } = useMotion(preset)

  return (
    <motion.div
      className={cn(motionClasses)}
      layout={!isReducedMotion}
      transition={isReducedMotion ? { duration: 0 } : undefined}
      {...props}
    />
  )
}
```

### **🎯 Container Query Governance**

```typescript
// Container query integration with MAPS breakpoints
import { ENHANCED_DESIGN_TOKENS } from '@/design/enhanced-tokens'

export function ResponsiveGrid({ containerQueries = true, ...props }) {
  const containerClasses = cn(
    containerQueries && '@container',
    '@xs:grid-cols-1 @sm:grid-cols-2 @md:grid-cols-3 @lg:grid-cols-4',
    className
  )

  return (
    <div
      className={containerClasses}
      style={{
        '--xs': ENHANCED_DESIGN_TOKENS.containers.xs,
        '--sm': ENHANCED_DESIGN_TOKENS.containers.sm,
        '--md': ENHANCED_DESIGN_TOKENS.containers.md,
        '--lg': ENHANCED_DESIGN_TOKENS.containers.lg,
      }}
      {...props}
    />
  )
}
```
