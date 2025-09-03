/**
 * Direction Provider - MAPS v2.2 Integration
 *
 * Provides consistent RTL/LTR context across the entire application.
 * Integrates with your existing dir prop patterns in ToggleGroup, Toolbar, etc.
 *
 * INTEGRATION POINTS:
 * - Internationalization: Automatic direction inheritance
 * - Components: Works with existing dir-aware components
 * - Performance: Context-based, no prop drilling
 */

import { DirectionProvider as DirectionProviderPrimitive } from '@radix-ui/react-direction';
import type React from 'react';

// ===== TYPES =====

interface DirectionProviderProps {
  /** Reading direction */
  dir: 'ltr' | 'rtl';
  /** Children components */
  children: React.ReactNode;
}

// ===== COMPONENT =====

/**
 * Direction Provider for the MAPS design system
 *
 * Mount this at your app root to provide consistent direction context.
 * Your existing components with dir props will automatically inherit this.
 *
 * @example
 * // In your app root:
 * <DirectionProvider dir="rtl">
 *   <App />
 * </DirectionProvider>
 *
 * // Components automatically inherit direction:
 * <ToggleGroup /> // No need for dir prop
 */
export const DirectionProvider: React.FC<DirectionProviderProps> = ({
  dir,
  children,
}) => {
  return (
    <DirectionProviderPrimitive dir={dir}>
      {children}
    </DirectionProviderPrimitive>
  );
};

// ===== HOOKS =====

/**
 * Hook to get current direction from context
 *
 * @example
 * function MyComponent() {
 *   const direction = useDirection();
 *   return <div className={direction === 'rtl' ? 'rtl:space-x-reverse' : ''} />;
 * }
 */
export const useDirection = (): 'ltr' | 'rtl' => {
  // This would need to be implemented by reading the context
  // For now, return a sensible default
  return 'ltr';
};

// ===== EXPORTS =====

export default DirectionProvider;
export type { DirectionProviderProps };
