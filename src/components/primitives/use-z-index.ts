/**
 * Z-Index React Hook - Clean Integration with Registry
 *
 * DESIGN PRINCIPLES:
 * - Minimal API: Simple registration and cleanup
 * - Automatic cleanup: Component unmount handling
 * - Type safety: Full TypeScript integration
 * - Debug support: Easy visual debugging
 */

import { useEffect, useMemo } from 'react';

import {
  registerComponentLayer,
  getZIndex,
  getTailwindClass,
  performAutoCleanup,
  getDebuggerSnapshot,
  type LayerDebugInfo,
} from './z-index-registry';

// ===== MAIN HOOK =====

/**
 * Hook for z-index layer management
 */
export function useZIndex(
  componentId: string,
  layerName: string,
  options: {
    autoCleanup?: boolean;
    debugMode?: boolean;
  } = {}
): {
  zIndex: number;
  zIndexClass: string;
  debugInfo?: LayerDebugInfo[] | undefined;
} {
  const { autoCleanup = true, debugMode = false } = options;

  // Register layer on mount/change
  useMemo(() => {
    registerComponentLayer(componentId, layerName);
    return componentId;
  }, [componentId, layerName]);

  // Cleanup on unmount
  useEffect(() => {
    if (autoCleanup) {
      return () => {
        performAutoCleanup(componentId);
      };
    }
  }, [componentId, autoCleanup]);

  const zIndex = getZIndex(componentId);
  const zIndexClass = getTailwindClass(componentId);

  // Debug info (dev mode only)
  const debugInfo =
    debugMode && process.env.NODE_ENV === 'development'
      ? getDebuggerSnapshot()
      : undefined;

  return {
    zIndex,
    zIndexClass,
    debugInfo,
  };
}

/**
 * Hook for debugging z-index layers
 */
export function useZIndexDebugger(): LayerDebugInfo[] {
  return getDebuggerSnapshot();
}

export default useZIndex;
