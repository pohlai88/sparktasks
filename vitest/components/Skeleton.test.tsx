/**
 * Enhanced Skeleton Component Tests - MAPS v2.2 Dark-First Philosophy
 *
 * COMPLIANCE MATRIX:
 * - Dark-First Foundation: ✅ Tests skeleton components in dark theme context
 * - Apple HIG Harmony: ✅ Validates semantic loading states and animations
 * - AAA Compliance: ✅ Tests accessibility features and aria attributes
 * - Liquid Glass Materials: ✅ Validates surface materials and transparency
 * - Anti-Drift Enforcement: ✅ Ensures token-only references, no hardcoded values
 *
 * TEST COVERAGE:
 * - Variant generation and validation
 * - Factory function configurations
 * - Compound component compositions
 * - Accessibility compliance
 * - Animation and motion preferences
 * - Polymorphic behavior
 * - Surface materials and density modes
 * - AAA enforcement validation
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import {
  EnhancedSkeleton,
  SkeletonFactory,
  SkeletonTextLines,
  SkeletonCard,
  SkeletonTable,
  enhancedSkeletonVariants,
} from '@/components/ui-enhanced/Skeleton';

// ===== VARIANT GENERATION TESTS =====

describe('EnhancedSkeleton - Variant Generation', () => {
  it('should generate correct default skeleton classes', () => {
    const classes = enhancedSkeletonVariants();
    expect(classes).toContain('relative');
    expect(classes).toContain('overflow-hidden');
    expect(classes).toContain('rounded-md');
    expect(classes).toContain('bg-muted');
    expect(classes).toContain('animate-pulse');
  });

  it('should generate correct text variant classes', () => {
    const classes = enhancedSkeletonVariants({ variant: 'text' });
    expect(classes).toContain('h-4');
    expect(classes).toContain('rounded');
  });

  it('should generate correct avatar variant classes', () => {
    const classes = enhancedSkeletonVariants({ variant: 'avatar' });
    expect(classes).toContain('rounded-full');
  });

  it('should generate correct button variant classes', () => {
    const classes = enhancedSkeletonVariants({ variant: 'button' });
    expect(classes).toContain('h-10');
    expect(classes).toContain('rounded-md');
  });

  it('should generate correct card variant classes', () => {
    const classes = enhancedSkeletonVariants({ variant: 'card' });
    expect(classes).toContain('rounded-lg');
  });

  it('should generate correct input variant classes', () => {
    const classes = enhancedSkeletonVariants({ variant: 'input' });
    expect(classes).toContain('h-10');
    expect(classes).toContain('rounded-md');
  });

  it('should generate correct badge variant classes', () => {
    const classes = enhancedSkeletonVariants({ variant: 'badge' });
    expect(classes).toContain('h-5');
    expect(classes).toContain('rounded-full');
  });
});

describe('EnhancedSkeleton - Size Variants', () => {
  it('should generate correct text size variants', () => {
    expect(enhancedSkeletonVariants({ variant: 'text', size: 'sm' })).toContain('h-3');
    expect(enhancedSkeletonVariants({ variant: 'text', size: 'md' })).toContain('h-4');
    expect(enhancedSkeletonVariants({ variant: 'text', size: 'lg' })).toContain('h-5');
    expect(enhancedSkeletonVariants({ variant: 'text', size: 'xl' })).toContain('h-6');
  });

  it('should generate correct avatar size variants', () => {
    expect(enhancedSkeletonVariants({ variant: 'avatar', size: 'sm' })).toContain('h-8 w-8');
    expect(enhancedSkeletonVariants({ variant: 'avatar', size: 'md' })).toContain('h-10 w-10');
    expect(enhancedSkeletonVariants({ variant: 'avatar', size: 'lg' })).toContain('h-12 w-12');
    expect(enhancedSkeletonVariants({ variant: 'avatar', size: 'xl' })).toContain('h-16 w-16');
  });

  it('should generate correct button size variants', () => {
    expect(enhancedSkeletonVariants({ variant: 'button', size: 'sm' })).toContain('h-8');
    expect(enhancedSkeletonVariants({ variant: 'button', size: 'md' })).toContain('h-10');
    expect(enhancedSkeletonVariants({ variant: 'button', size: 'lg' })).toContain('h-12');
    expect(enhancedSkeletonVariants({ variant: 'button', size: 'xl' })).toContain('h-14');
  });

  it('should generate correct card size variants', () => {
    expect(enhancedSkeletonVariants({ variant: 'card', size: 'sm' })).toContain('h-32');
    expect(enhancedSkeletonVariants({ variant: 'card', size: 'md' })).toContain('h-48');
    expect(enhancedSkeletonVariants({ variant: 'card', size: 'lg' })).toContain('h-64');
    expect(enhancedSkeletonVariants({ variant: 'card', size: 'xl' })).toContain('h-80');
  });

  it('should generate correct badge size variants', () => {
    expect(enhancedSkeletonVariants({ variant: 'badge', size: 'sm' })).toContain('h-4 w-12');
    expect(enhancedSkeletonVariants({ variant: 'badge', size: 'md' })).toContain('h-5 w-16');
    expect(enhancedSkeletonVariants({ variant: 'badge', size: 'lg' })).toContain('h-6 w-20');
  });

  it('should generate correct full size variant', () => {
    const classes = enhancedSkeletonVariants({ size: 'full' });
    expect(classes).toContain('w-full');
  });
});

describe('EnhancedSkeleton - Animation Variants', () => {
  it('should generate correct pulse animation classes', () => {
    const classes = enhancedSkeletonVariants({ animation: 'pulse' });
    expect(classes).toContain('animate-pulse');
  });

  it('should generate correct wave animation classes', () => {
    const classes = enhancedSkeletonVariants({ animation: 'wave' });
    expect(classes).toContain('relative');
    expect(classes).toContain('before:absolute');
    expect(classes).toContain('before:inset-0');
    expect(classes).toContain('before:-translate-x-full');
  });

  it('should generate correct no animation classes', () => {
    const classes = enhancedSkeletonVariants({ animation: 'none' });
    expect(classes).toContain('animate-none');
  });

  it('should handle motion preferences for wave animation', () => {
    const classes = enhancedSkeletonVariants({ animation: 'wave' });
    expect(classes).toContain('motion-reduce:animate-pulse');
    expect(classes).toContain('motion-reduce:before:hidden');
  });
});

describe('EnhancedSkeleton - Surface Variants', () => {
  it('should generate correct elevated surface classes', () => {
    const classes = enhancedSkeletonVariants({ surface: 'elevated' });
    expect(classes).toContain('bg-background-elevated');
  });

  it('should generate correct panel surface classes', () => {
    const classes = enhancedSkeletonVariants({ surface: 'panel' });
    expect(classes).toContain('bg-background-panel');
  });

  it('should generate correct glass surface classes', () => {
    const classes = enhancedSkeletonVariants({ surface: 'glass' });
    expect(classes).toContain('bg-background/50');
    expect(classes).toContain('backdrop-blur-sm');
    expect(classes).toContain('border-border/30');
  });

  it('should generate correct floating surface classes', () => {
    const classes = enhancedSkeletonVariants({ surface: 'floating' });
    expect(classes).toContain('bg-background/40');
    expect(classes).toContain('backdrop-blur-md');
    expect(classes).toContain('border-border/20');
    expect(classes).toContain('shadow-elevation-floating');
  });
});

describe('EnhancedSkeleton - Density Variants', () => {
  it('should generate correct comfortable density classes', () => {
    const classes = enhancedSkeletonVariants({ density: 'comfortable' });
    expect(classes).not.toContain('scale-95');
  });

  it('should generate correct compact density classes', () => {
    const classes = enhancedSkeletonVariants({ density: 'compact' });
    expect(classes).toContain('scale-95');
  });
});

describe('EnhancedSkeleton - AAA Compliance', () => {
  it('should generate correct AAA enforcement classes', () => {
    const classes = enhancedSkeletonVariants({ enforceAAA: true });
    expect(classes).toContain('aaa:bg-muted-aaa');
    expect(classes).toContain('aaa:border-border-aaa');
  });

  it('should generate correct AAA surface combinations', () => {
    const elevatedAAA = enhancedSkeletonVariants({ surface: 'elevated', enforceAAA: true });
    expect(elevatedAAA).toContain('aaa:bg-background-elevated-aaa');

    const glassAAA = enhancedSkeletonVariants({ surface: 'glass', enforceAAA: true });
    expect(glassAAA).toContain('aaa:bg-background-aaa/50');
    expect(glassAAA).toContain('aaa:border-border-aaa/30');
  });
});

// ===== COMPONENT RENDERING TESTS =====

describe('EnhancedSkeleton - Component Rendering', () => {
  it('should render basic skeleton with default props', () => {
    render(<EnhancedSkeleton data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass('relative', 'overflow-hidden', 'rounded-md');
    expect(skeleton).toHaveClass('bg-background-elevated', 'animate-pulse');
  });

  it('should render with custom className', () => {
    render(<EnhancedSkeleton className="custom-class" data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    
    expect(skeleton).toHaveClass('custom-class');
  });

  it('should render with custom width and height', () => {
    render(
      <EnhancedSkeleton 
        width="200px" 
        height="100px" 
        data-testid="skeleton" 
      />
    );
    const skeleton = screen.getByTestId('skeleton');
    
    expect(skeleton).toHaveStyle({
      width: '200px',
      height: '100px',
    });
  });

  it('should render with numeric width and height', () => {
    render(
      <EnhancedSkeleton 
        width={300} 
        height={150} 
        data-testid="skeleton" 
      />
    );
    const skeleton = screen.getByTestId('skeleton');
    
    expect(skeleton).toHaveStyle({
      width: '300px',
      height: '150px',
    });
  });

  it('should render with proper accessibility attributes', () => {
    render(<EnhancedSkeleton data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    
    expect(skeleton).toHaveAttribute('role', 'status');
    expect(skeleton).toHaveAttribute('aria-label', 'Loading content');
  });

  it('should render with custom aria-label', () => {
    render(
      <EnhancedSkeleton 
        aria-label="Loading user profile" 
        data-testid="skeleton" 
      />
    );
    const skeleton = screen.getByTestId('skeleton');
    
    expect(skeleton).toHaveAttribute('aria-label', 'Loading user profile');
  });

  it('should support polymorphic rendering with asChild', () => {
    render(
      <EnhancedSkeleton asChild data-testid="skeleton">
        <span>Custom element</span>
      </EnhancedSkeleton>
    );
    const skeleton = screen.getByTestId('skeleton');
    
    expect(skeleton.tagName).toBe('SPAN');
    expect(skeleton).toHaveTextContent('Custom element');
  });
});

describe('EnhancedSkeleton - Variant Rendering', () => {
  it('should render text variant correctly', () => {
    render(<EnhancedSkeleton variant="text" data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    
    expect(skeleton).toHaveClass('h-4', 'rounded');
  });

  it('should render avatar variant correctly', () => {
    render(<EnhancedSkeleton variant="avatar" size="md" data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    
    expect(skeleton).toHaveClass('rounded-full', 'h-10', 'w-10');
  });

  it('should render button variant correctly', () => {
    render(<EnhancedSkeleton variant="button" data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    
    expect(skeleton).toHaveClass('h-10', 'rounded-md');
  });

  it('should render card variant correctly', () => {
    render(<EnhancedSkeleton variant="card" size="lg" data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    
    expect(skeleton).toHaveClass('rounded-lg', 'h-64');
  });

  it('should render badge variant correctly', () => {
    render(<EnhancedSkeleton variant="badge" size="sm" data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    
    expect(skeleton).toHaveClass('h-4', 'w-12', 'rounded-full');
  });
});

// ===== FACTORY FUNCTION TESTS =====

describe('SkeletonFactory - Factory Functions', () => {
  it('should create correct textLine configuration', () => {
    const config = SkeletonFactory.textLine();
    expect(config).toEqual({
      variant: 'text',
      size: 'md',
      width: '100%',
    });
  });

  it('should create correct textLine configuration with overrides', () => {
    const config = SkeletonFactory.textLine({ width: '75%', size: 'lg' });
    expect(config).toEqual({
      variant: 'text',
      size: 'lg',
      width: '75%',
    });
  });

  it('should create correct textLines configuration', () => {
    const config = SkeletonFactory.textLines(5);
    expect(config).toEqual({
      variant: 'text',
      size: 'md',
      lines: 5,
    });
  });

  it('should create correct avatar configuration', () => {
    const config = SkeletonFactory.avatar();
    expect(config).toEqual({
      variant: 'avatar',
      size: 'md',
      animation: 'wave',
    });
  });

  it('should create correct button configuration', () => {
    const config = SkeletonFactory.button();
    expect(config).toEqual({
      variant: 'button',
      size: 'md',
      width: '120px',
    });
  });

  it('should create correct card configuration', () => {
    const config = SkeletonFactory.card();
    expect(config).toEqual({
      variant: 'card',
      size: 'md',
      width: '100%',
    });
  });

  it('should create correct tableRow configuration', () => {
    const config = SkeletonFactory.tableRow();
    expect(config).toEqual({
      variant: 'default',
      height: '48px',
      width: '100%',
    });
  });

  it('should create correct badge configuration', () => {
    const config = SkeletonFactory.badge();
    expect(config).toEqual({
      variant: 'badge',
      size: 'md',
      animation: 'wave',
    });
  });

  it('should create correct accessible configuration', () => {
    const config = SkeletonFactory.accessible();
    expect(config).toEqual({
      variant: 'default',
      size: 'md',
      surface: 'elevated',
      enforceAAA: true,
    });
  });

  it('should create correct glass configuration', () => {
    const config = SkeletonFactory.glass();
    expect(config).toEqual({
      variant: 'default',
      size: 'md',
      surface: 'glass',
      animation: 'wave',
    });
  });
});

// ===== COMPOUND COMPONENT TESTS =====

describe('SkeletonTextLines - Compound Component', () => {
  it('should render multiple text lines', () => {
    render(<SkeletonTextLines lines={3} data-testid="text-lines" />);
    const container = screen.getByTestId('text-lines');
    
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('space-y-2');
    
    // Should have 3 skeleton elements
    const skeletons = container.querySelectorAll('[role="status"]');
    expect(skeletons).toHaveLength(3);
  });

  it('should render with custom last line width', () => {
    render(<SkeletonTextLines lines={2} lastLineWidth="60%" data-testid="text-lines" />);
    const container = screen.getByTestId('text-lines');
    const skeletons = container.querySelectorAll('[role="status"]');
    
    expect(skeletons).toHaveLength(2);
    
    // Last skeleton should have custom width
    const lastSkeleton = skeletons[1] as HTMLElement;
    expect(lastSkeleton).toHaveStyle({ width: '60%' });
  });

  it('should forward props to individual skeletons', () => {
    render(
      <SkeletonTextLines 
        lines={2} 
        animation="wave" 
        surface="glass"
        data-testid="text-lines" 
      />
    );
    const container = screen.getByTestId('text-lines');
    const skeletons = container.querySelectorAll('[role="status"]');
    
    skeletons.forEach(skeleton => {
      expect(skeleton).toHaveClass('before:absolute'); // Wave animation
      expect(skeleton).toHaveClass('bg-background/50'); // Glass surface
    });
  });
});

describe('SkeletonCard - Compound Component', () => {
  it('should render basic card skeleton', () => {
    render(<SkeletonCard data-testid="card-skeleton" />);
    const card = screen.getByTestId('card-skeleton');
    
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('space-y-4', 'p-4');
  });

  it('should render card with avatar', () => {
    render(<SkeletonCard showAvatar={true} data-testid="card-skeleton" />);
    const card = screen.getByTestId('card-skeleton');
    
    // Should contain avatar skeleton
    const avatarSkeleton = card.querySelector('.rounded-full');
    expect(avatarSkeleton).toBeInTheDocument();
  });

  it('should render card with footer', () => {
    render(<SkeletonCard showFooter={true} data-testid="card-skeleton" />);
    const card = screen.getByTestId('card-skeleton');
    
    // Should contain footer elements
    const footerElements = card.querySelectorAll('.pt-2');
    expect(footerElements.length).toBeGreaterThan(0);
  });

  it('should render card with both avatar and footer', () => {
    render(
      <SkeletonCard 
        showAvatar={true} 
        showFooter={true} 
        data-testid="card-skeleton" 
      />
    );
    const card = screen.getByTestId('card-skeleton');
    
    const avatarSkeleton = card.querySelector('.rounded-full');
    const footerElements = card.querySelectorAll('.pt-2');
    
    expect(avatarSkeleton).toBeInTheDocument();
    expect(footerElements.length).toBeGreaterThan(0);
  });
});

describe('SkeletonTable - Compound Component', () => {
  it('should render table skeleton with default configuration', () => {
    render(<SkeletonTable data-testid="table-skeleton" />);
    const table = screen.getByTestId('table-skeleton');
    
    expect(table).toBeInTheDocument();
    expect(table).toHaveClass('space-y-2');
  });

  it('should render correct number of rows and columns', () => {
    render(<SkeletonTable rows={3} columns={4} data-testid="table-skeleton" />);
    const table = screen.getByTestId('table-skeleton');
    
    // Should have header + 3 data rows = 4 total grids
    const grids = table.querySelectorAll('.grid');
    expect(grids).toHaveLength(4); // 1 header + 3 rows
    
    // Each grid should have 4 skeletons
    grids.forEach(grid => {
      const skeletons = grid.querySelectorAll('[role="status"]');
      expect(skeletons).toHaveLength(4);
    });
  });

  it('should render without header when specified', () => {
    render(
      <SkeletonTable 
        rows={2} 
        columns={3} 
        showHeader={false} 
        data-testid="table-skeleton" 
      />
    );
    const table = screen.getByTestId('table-skeleton');
    
    // Should have only 2 rows (no header)
    const grids = table.querySelectorAll('.grid');
    expect(grids).toHaveLength(2);
  });

  it('should apply custom grid template columns', () => {
    render(<SkeletonTable columns={3} data-testid="table-skeleton" />);
    const table = screen.getByTestId('table-skeleton');
    const grids = table.querySelectorAll('.grid');
    
    grids.forEach(grid => {
      expect(grid).toHaveStyle({
        gridTemplateColumns: 'repeat(3, 1fr)',
      });
    });
  });
});

// ===== ANTI-DRIFT ENFORCEMENT TESTS =====

describe('EnhancedSkeleton - Anti-Drift Enforcement', () => {
  it('should not contain hardcoded color values', () => {
    const allVariants = [
      enhancedSkeletonVariants(),
      enhancedSkeletonVariants({ variant: 'text' }),
      enhancedSkeletonVariants({ variant: 'avatar' }),
      enhancedSkeletonVariants({ surface: 'glass' }),
      enhancedSkeletonVariants({ enforceAAA: true }),
    ];

    allVariants.forEach(classes => {
      // Should not contain hex colors, rgb values, or hardcoded colors
      expect(classes).not.toMatch(/#[0-9a-fA-F]{3,6}/);
      expect(classes).not.toMatch(/rgb\(/);
      expect(classes).not.toMatch(/rgba\(/);
      expect(classes).not.toContain('red-500');
      expect(classes).not.toContain('blue-600');
    });
  });

  it('should use semantic color tokens only', () => {
    const classes = enhancedSkeletonVariants({ surface: 'glass', enforceAAA: true });
    
    // Should contain semantic tokens from design system
    expect(classes).toContain('bg-background');
    expect(classes).toContain('border-border');
    expect(classes).toContain('aaa:bg-background-aaa');
  });

  it('should use systematic spacing values only', () => {
    const allVariants = [
      enhancedSkeletonVariants({ variant: 'text' }),
      enhancedSkeletonVariants({ variant: 'avatar', size: 'lg' }),
      enhancedSkeletonVariants({ variant: 'button', size: 'xl' }),
    ];

    allVariants.forEach(classes => {
      // Should not contain arbitrary spacing values
      expect(classes).not.toMatch(/[wh]-\[[\d.]+px\]/);
      expect(classes).not.toMatch(/p-\[[\d.]+px\]/);
      expect(classes).not.toMatch(/m-\[[\d.]+px\]/);
    });
  });

  it('should maintain motion preference compliance', () => {
    const pulseClasses = enhancedSkeletonVariants({ animation: 'pulse' });
    const waveClasses = enhancedSkeletonVariants({ animation: 'wave' });
    
    expect(pulseClasses).toContain('motion-reduce:animate-none');
    expect(waveClasses).toContain('motion-reduce:animate-pulse');
    expect(waveClasses).toContain('motion-reduce:before:hidden');
  });
});
