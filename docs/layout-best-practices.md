# Tailwind Layout Architecture Best Practices for AI-BOS

## Overview

This guide provides comprehensive layout patterns and best practices for building consistent, responsive interfaces in the AI-BOS SlackTasks application using our design token system.

## Table of Contents

1. [Design Token System](#design-token-system)
2. [Layout Components](#layout-components)
3. [Best Practices](#best-practices)
4. [Common Patterns](#common-patterns)
5. [Responsive Design](#responsive-design)
6. [Examples](#examples)

## Design Token System

Our layout system is built on a foundation of design tokens that ensure consistency across all components:

### Layout Tokens Structure

```typescript
DESIGN_TOKENS.layout = {
  heights: {
    nav: '60px', // Standard navigation height
    footer: '48px', // Footer height
    toolbar: '44px', // Toolbar/action bar height
  },
  widths: {
    sidebar: '240px', // Standard sidebar width
    sidebarCollapsed: '64px', // Collapsed sidebar
    rightPanel: '320px', // Right panel/aside
    maxContent: '1200px', // Maximum content width
  },
  shell: {
    dashboard: 'h-screen grid grid-rows-[60px_1fr]',
    splitPane: 'h-screen grid grid-rows-[60px_1fr] grid-cols-1 lg:grid-cols-2',
    threeColumn: 'grid grid-cols-[240px_1fr_320px] h-full',
  },
  spacing: {
    section: 'space-y-8', // Between major sections
    component: 'space-y-6', // Between components
    element: 'space-y-4', // Between related elements
    tight: 'space-y-2', // Tight spacing
    loose: 'space-y-12', // Loose spacing
    page: 'p-6', // Page padding
    card: 'p-4', // Card padding
    button: 'px-4 py-2', // Button padding
  },
  patterns: {
    centeredContent: 'flex items-center justify-center',
    spaceBetween: 'flex items-center justify-between',
    verticalCenter: 'flex flex-col items-center justify-center',
    cardHover: 'transition-all duration-200 hover:shadow-md hover:scale-[1.02]',
    focusRing:
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  },
};
```

## Layout Components

### Core Layout Components

#### 1. AppShell

The foundation container for all pages:

```tsx
<AppShell>
  <TopNav />
  <div className='flex flex-1'>
    <Sidebar />
    <MainContent />
    <RightPanel />
  </div>
</AppShell>
```

#### 2. TopNav

Navigation header with logo, search, and actions:

```tsx
<TopNav logo={<Logo />} search={<SearchInput />} actions={<ActionButtons />} />
```

#### 3. Sidebar

Collapsible navigation sidebar:

```tsx
<Sidebar collapsed={isCollapsed}>
  <NavigationItems />
</Sidebar>
```

#### 4. MainContent

Primary content area with optional header:

```tsx
<MainContent header={<PageHeader title='Dashboard' />}>
  <PageContent />
</MainContent>
```

### Layout Patterns

#### Dashboard Layout (Three-Column)

```tsx
// Full-width dashboard with sidebar and right panel
<AppShell>
  <TopNav />
  <div className='flex flex-1'>
    <Sidebar>Navigation</Sidebar>
    <MainContent>Primary content</MainContent>
    <RightPanel>Contextual info</RightPanel>
  </div>
</AppShell>
```

#### Split Pane Layout

```tsx
// List/detail view pattern
<SplitPane
  leftTitle='Tasks'
  rightTitle='Task Details'
  left={<TaskList />}
  right={<TaskDetails />}
/>
```

#### Centered Form Layout

```tsx
// Centered content for forms and simple pages
<MainContent>
  <Container size='md'>
    <div className={DESIGN_TOKENS.layout.patterns.verticalCenter}>
      <FormCard />
    </div>
  </Container>
</MainContent>
```

## Best Practices

### 1. Use Design Tokens

Always use design tokens instead of hardcoded values:

```tsx
// ❌ Avoid hardcoded values
<div className="p-6 space-y-4">

// ✅ Use design tokens
<div className={`${DESIGN_TOKENS.layout.spacing.page} ${DESIGN_TOKENS.layout.spacing.element}`}>
```

### 2. Consistent Spacing

Use the spacing system for consistent vertical rhythm:

```tsx
// ❌ Inconsistent spacing
<div className="space-y-3">
  <div className="mb-5">
    <div className="mt-2">

// ✅ Consistent spacing system
<Stack spacing="md">
  <Section />
  <Section />
</Stack>
```

### 3. Responsive Design

Use responsive tokens for mobile-first design:

```tsx
// Mobile-first responsive patterns
<div className={DESIGN_TOKENS.layout.responsive.collapseSidebar}>
  <Sidebar />
</div>

<div className={DESIGN_TOKENS.layout.responsive.mobileNav}>
  <MobileMenuButton />
</div>
```

### 4. Z-Index Management

Use z-index tokens for layering:

```tsx
// Consistent z-index layering
<Modal className={DESIGN_TOKENS.layout.zIndex.modal}>
<Dropdown className={DESIGN_TOKENS.layout.zIndex.dropdown}>
<StickyHeader className={DESIGN_TOKENS.layout.zIndex.sticky}>
```

### 5. Grid and Flexbox Patterns

Use grid for layout, flexbox for alignment:

```tsx
// Grid for layout structure
<Grid cols={3} gap="lg">
  <Card />
  <Card />
  <Card />
</Grid>

// Flexbox for alignment
<div className={DESIGN_TOKENS.layout.patterns.spaceBetween}>
  <Title />
  <Actions />
</div>
```

## Common Patterns

### Page Header Pattern

```tsx
<PageHeader
  title='Dashboard'
  description='Overview of your tasks'
  breadcrumbs={<Breadcrumbs />}
  actions={
    <div className='flex gap-3'>
      <Button variant='secondary'>Export</Button>
      <Button>Create Task</Button>
    </div>
  }
/>
```

### Card List Pattern

```tsx
<Stack spacing='md'>
  {items.map(item => (
    <Card key={item.id} className={DESIGN_TOKENS.layout.patterns.cardHover}>
      <div className={DESIGN_TOKENS.layout.patterns.spaceBetween}>
        <Content />
        <Actions />
      </div>
    </Card>
  ))}
</Stack>
```

### Empty State Pattern

```tsx
<div className={DESIGN_TOKENS.layout.patterns.centeredContent}>
  <div className='text-center'>
    <Icon />
    <h3>No tasks yet</h3>
    <p>Create your first task to get started</p>
    <Button>Create Task</Button>
  </div>
</div>
```

### Form Layout Pattern

```tsx
<Container size='md'>
  <Card>
    <form>
      <Stack spacing='lg'>
        <FormField />
        <FormField />
        <Grid cols={2} gap='md'>
          <FormField />
          <FormField />
        </Grid>
        <div className='flex gap-3 pt-4'>
          <Button className='flex-1'>Save</Button>
          <Button variant='secondary' className='flex-1'>
            Cancel
          </Button>
        </div>
      </Stack>
    </form>
  </Card>
</Container>
```

## Responsive Design

### Breakpoint Strategy

```tsx
// Mobile-first responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// Hide/show elements by screen size
<div className={DESIGN_TOKENS.layout.responsive.mobileOnly}>
<div className={DESIGN_TOKENS.layout.responsive.desktopOnly}>
```

### Mobile Navigation Pattern

```tsx
// Desktop navigation
<Sidebar className={DESIGN_TOKENS.layout.responsive.collapseSidebar}>

// Mobile drawer
<Button
  className={DESIGN_TOKENS.layout.responsive.mobileNav}
  onClick={() => setDrawerOpen(true)}
>
  Menu
</Button>

<Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)}>
  <MobileNavigation />
</Drawer>
```

## Examples

### Complete Dashboard Layout

```tsx
function DashboardPage() {
  return (
    <AppShell>
      <TopNav
        logo={<AppLogo />}
        search={<GlobalSearch />}
        actions={<UserMenu />}
      />

      <div className='flex flex-1 overflow-hidden'>
        <Sidebar>
          <Navigation />
        </Sidebar>

        <MainContent
          header={
            <PageHeader
              title='Dashboard'
              description='Task overview and metrics'
              actions={<Button>Create Task</Button>}
            />
          }
        >
          <Grid cols={3} gap='lg'>
            <MetricCard title='Active' value={12} />
            <MetricCard title='Due Today' value={3} />
            <MetricCard title='Completed' value={28} />
          </Grid>

          <Card>
            <TaskList />
          </Card>
        </MainContent>

        <RightPanel title='Recent Activity'>
          <ActivityFeed />
        </RightPanel>
      </div>
    </AppShell>
  );
}
```

### Task Detail Layout

```tsx
function TaskDetailPage() {
  return (
    <SplitPane
      leftTitle='Tasks'
      rightTitle='Task Details'
      left={
        <Stack spacing='sm'>
          <TaskListItem />
          <TaskListItem />
          <TaskListItem />
        </Stack>
      }
      right={
        <Stack spacing='lg'>
          <TaskHeader />
          <TaskDetails />
          <TaskComments />
          <TaskActions />
        </Stack>
      }
    />
  );
}
```

## Performance Considerations

### Efficient CSS Classes

- Use design tokens to reduce CSS bundle size
- Leverage Tailwind's purging for unused styles
- Group related classes in token patterns

### Layout Shift Prevention

```tsx
// Reserve space for dynamic content
<div style={{ minHeight: DESIGN_TOKENS.layout.heights.nav }}>

// Use consistent dimensions
<Sidebar style={{ width: DESIGN_TOKENS.layout.widths.sidebar }}>
```

### Responsive Images

```tsx
// Responsive image containers
<div className='aspect-video overflow-hidden rounded-lg'>
  <img className='h-full w-full object-cover' />
</div>
```

## Summary

This layout system provides:

- **Consistency**: Design tokens ensure uniform spacing and dimensions
- **Responsiveness**: Mobile-first patterns with consistent breakpoints
- **Flexibility**: Composable components for various layout needs
- **Performance**: Optimized CSS with minimal layout shifts
- **Maintainability**: Centralized design decisions in tokens

Use these patterns as building blocks for creating cohesive, professional interfaces throughout the AI-BOS application.
