/**
 * Z-Index Orchestrator - Layer Management System for MAPS v3.0
 *
 * ANTI-DRIFT ENFORCEMENT:
 * - Token-only z-index values: No arbitrary layer constants
 * - SSOT compliance: Enhanced tokens for all layer definitions
 * - Conflict detection: Automatic layer overlap prevention
 * - Performance monitoring: Layer count optimization
 *
 * GOVERNANCE RULES:
 * - Maximum 10 active layers: Performance boundary
 * - Semantic naming: Descriptive layer purposes only
 * - Auto-cleanup: Unused layers automatically removed
 * - Conflict resolution: Automatic layer adjustment
 *
 * NON-NEGOTIABLE GUARDRAILS:
 * - No z-index: 999999 declarations
 * - No negative z-index without approval
 * - No layer conflicts across components
 * - No performance degradation from excessive layers
 */

import React, { createContext, useContext, useRef } from 'react';

import type {
  ZIndexLayer,
  ZIndexConfig,
  ZIndexViolation
} from './types';

// ===== Z-INDEX TOKEN MAPPING =====

// Fortune-500 corrected hierarchy: modal (1300) > popover (1100)
const Z_INDEX_TOKENS = {
  surface: 0,
  overlay: 100,
  popover: 1100,    // Popover below modal (contextual only)
  modal: 1300,      // Modal above popover (blocking interactions)
  toast: 1400,      // Toast above modal (system notifications)
  tooltip: 1500,    // Tooltip highest (informational overlay)
} as const;

type ZIndexToken = keyof typeof Z_INDEX_TOKENS;

// ===== DEFAULT CONFIGURATION =====

const DEFAULT_Z_INDEX_CONFIG: ZIndexConfig = {
  activeLayers: [],
  maxLayers: 10,
  detectConflicts: true,
  autoCleanup: true,
};

// ===== LAYER DEFINITIONS =====

const PREDEFINED_LAYERS: Record<ZIndexToken, ZIndexLayer> = {
  surface: {
    name: 'surface',
    value: Z_INDEX_TOKENS.surface,
    description: 'Default layer for normal document flow',
    restrictions: ['Default layer', 'No special behavior'],
  },
  overlay: {
    name: 'overlay',
    value: Z_INDEX_TOKENS.overlay,
    description: 'General overlays and elevated surfaces',
    restrictions: ['Non-critical overlays', 'Can be dismissed'],
  },
  modal: {
    name: 'modal',
    value: Z_INDEX_TOKENS.modal,
    description: 'Modal dialogs and blocking overlays',
    restrictions: ['Blocking interactions', 'User action required'],
  },
  popover: {
    name: 'popover',
    value: Z_INDEX_TOKENS.popover,
    description: 'Popover content and contextual information',
    restrictions: ['Non-blocking', 'Contextual only'],
  },
  toast: {
    name: 'toast',
    value: Z_INDEX_TOKENS.toast,
    description: 'Toast notifications and alerts',
    restrictions: ['System notifications', 'High priority'],
  },
  tooltip: {
    name: 'tooltip',
    value: Z_INDEX_TOKENS.tooltip,
    description: 'Tooltip overlays and help text',
    restrictions: ['Informational only', 'No interactions'],
  },
};

// ===== Z-INDEX ORCHESTRATOR CLASS =====

export class ZIndexOrchestrator {
  private config: ZIndexConfig;
  private layerStack: Map<string, ZIndexLayer> = new Map();
  private componentLayerMap: Map<string, ZIndexToken> = new Map();

  constructor(config: Partial<ZIndexConfig> = {}) {
    this.config = { ...DEFAULT_Z_INDEX_CONFIG, ...config };
  }

  /**
   * Request a z-index layer for a component
   */
  requestLayer(
    componentId: string,
    requestedLayer: ZIndexToken,
    justification?: string
  ): ZIndexLayer {
    // Validate layer request
    const violations = this.validateLayerRequest(requestedLayer, justification);

    if (violations.length > 0) {
      const firstViolation = violations[0];
      if (firstViolation) {
        throw new Error(`Layer request denied: ${firstViolation.resolution}`);
      }
    }

    // Get layer definition
    const layer = PREDEFINED_LAYERS[requestedLayer];

    // Check for conflicts
    const conflicts = this.detectLayerConflicts(layer);

    if (conflicts.length > 0 && this.config.detectConflicts) {
      const firstConflict = conflicts[0];
      if (firstConflict) {
        throw new Error(`Layer conflict detected: ${firstConflict.resolution}`);
      }
    }

    // Register layer
    this.layerStack.set(componentId, layer);
    this.componentLayerMap.set(componentId, requestedLayer);

    // Update active layers
    this.updateActiveLayers();

    return layer;
  }

  /**
   * Release a layer when component unmounts
   */
  releaseLayer(componentId: string): void {
    this.layerStack.delete(componentId);
    this.componentLayerMap.delete(componentId);
    this.updateActiveLayers();
  }

  /**
   * Get current z-index value for component
   */
  getZIndex(componentId: string): number {
    const layer = this.layerStack.get(componentId);
    return layer?.value ?? Z_INDEX_TOKENS.surface;
  }

  /**
   * Get CSS z-index string for component - Uses tokenic classes only
   */
  getZIndexClass(componentId: string): string {
    const layer = this.layerStack.get(componentId);

    if (!layer) {
      return 'z-0'; // Surface layer default
    }

    // Map to tokenic Tailwind classes - NO arbitrary values
    const tokenicClassMap: Record<string, string> = {
      surface: 'z-0',
      overlay: 'z-overlay',      // z-[100] → tokenic class
      popover: 'z-popover',      // z-[1100] → tokenic class
      modal: 'z-modal',          // z-[1300] → tokenic class
      toast: 'z-toast',          // z-[1400] → tokenic class
      tooltip: 'z-tooltip',      // z-[1500] → tokenic class
    };

    return tokenicClassMap[layer.name] ?? 'z-0';
  }

  /**
   * Validate layer request
   */
  private validateLayerRequest(
    layer: ZIndexToken,
    justification?: string
  ): ZIndexViolation[] {
    const violations: ZIndexViolation[] = [];

    // Check if tooltip layer needs justification (highest layer)
    if (layer === 'tooltip' && !justification && this.layerStack.size > 5) {
      violations.push({
        layer,
        type: 'exceed-max',
        resolution: 'Tooltip layer with many active layers should include justification',
      });
    }

    // Check active layer count
    if (this.layerStack.size >= this.config.maxLayers) {
      violations.push({
        layer,
        type: 'exceed-max',
        resolution: `Maximum ${this.config.maxLayers} layers allowed for performance`,
      });
    }

    return violations;
  }

  /**
   * Detect layer conflicts
   */
  private detectLayerConflicts(newLayer: ZIndexLayer): ZIndexViolation[] {
    const violations: ZIndexViolation[] = [];
    const conflicts: string[] = [];

    for (const [componentId, existingLayer] of this.layerStack) {
      // Check for exact z-index value conflicts
      if (existingLayer.value === newLayer.value && existingLayer.name !== newLayer.name) {
        conflicts.push(componentId);
      }

      // Check for logical conflicts (e.g., modal under dropdown)
      if (this.isLogicalConflict(newLayer, existingLayer)) {
        conflicts.push(componentId);
      }
    }

    if (conflicts.length > 0) {
      violations.push({
        layer: newLayer.name,
        type: 'overlap',
        conflicts,
        resolution: 'Use different layer or wait for conflicting components to unmount',
      });
    }

    return violations;
  }

  /**
   * Check for logical layer conflicts
   */
  private isLogicalConflict(layer1: ZIndexLayer, layer2: ZIndexLayer): boolean {
    // Modal should be above overlay
    if (layer1.name === 'overlay' && layer2.name === 'modal') return true;
    if (layer1.name === 'modal' && layer2.name === 'overlay') return true;

    // Toast should be above modal
    if (layer1.name === 'modal' && layer2.name === 'toast') return true;

    // Multiple modals conflict
    if (layer1.name === 'modal' && layer2.name === 'modal') return true;

    return false;
  }

  /**
   * Update active layers config
   */
  private updateActiveLayers(): void {
    this.config.activeLayers = [...this.layerStack.values()];

    // Auto-cleanup if enabled
    if (this.config.autoCleanup) {
      this.performAutoCleanup();
    }
  }

  /**
   * Perform automatic cleanup of unused layers
   */
  private performAutoCleanup(): void {
    // Remove layers for components that no longer exist
    const activeComponents = new Set(this.layerStack.keys());

    for (const componentId of this.componentLayerMap.keys()) {
      if (!activeComponents.has(componentId)) {
        this.componentLayerMap.delete(componentId);
      }
    }
  }

  /**
   * Get layer usage report
   */
  getUsageReport(): {
    totalLayers: number;
    layerDistribution: Record<ZIndexToken, number>;
    conflicts: ZIndexViolation[];
    performance: {
      withinLimits: boolean;
      recommendation: string;
    };
  } {
    const layerDistribution = {} as Record<ZIndexToken, number>;
    const conflicts: ZIndexViolation[] = [];

    // Initialize distribution
    for (const token of Object.keys(Z_INDEX_TOKENS) as ZIndexToken[]) {
      layerDistribution[token] = 0;
    }

    // Count layer usage
    for (const layer of this.componentLayerMap.values()) {
      layerDistribution[layer]++;
    }

    // Check for conflicts
    for (const [, layer] of this.layerStack) {
      conflicts.push(...this.detectLayerConflicts(layer));
    }

    // Performance assessment
    const totalLayers = this.layerStack.size;
    const withinLimits = totalLayers <= this.config.maxLayers;

    let recommendation = 'Layer usage is optimal';
    if (totalLayers > this.config.maxLayers * 0.8) {
      recommendation = 'Consider reducing layer count for better performance';
    }
    if (totalLayers >= this.config.maxLayers) {
      recommendation = 'Layer limit exceeded - remove unused layers immediately';
    }

    return {
      totalLayers,
      layerDistribution,
      conflicts,
      performance: {
        withinLimits,
        recommendation,
      },
    };
  }

  /**
   * Reset orchestrator state
   */
  reset(): void {
    this.layerStack.clear();
    this.componentLayerMap.clear();
    this.config.activeLayers = [];
  }
}

// ===== REACT PROVIDER PATTERN =====

interface ZIndexContextValue {
  orchestrator: ZIndexOrchestrator;
}

const ZIndexContext = createContext<ZIndexContextValue | null>(null);

/**
 * Provider for Z-Index Orchestrator - Replaces global singleton
 */
export function ZIndexProvider({
  children,
  config = {}
}: {
  children: React.ReactNode;
  config?: Partial<ZIndexConfig>;
}) {
  const orchestratorRef = useRef<ZIndexOrchestrator>();

  if (!orchestratorRef.current) {
    orchestratorRef.current = new ZIndexOrchestrator(config);
  }

  const contextValue = {
    orchestrator: orchestratorRef.current,
  };

  return (
    <ZIndexContext.Provider value={contextValue}>
      {children}
    </ZIndexContext.Provider>
  );
}

/**
 * Hook to access orchestrator from context
 */
function useZIndexOrchestrator(): ZIndexOrchestrator {
  const context = useContext(ZIndexContext);

  if (!context) {
    throw new Error('useZIndexOrchestrator must be used within ZIndexProvider');
  }

  return context.orchestrator;
}

// ===== UPDATED REACT HOOKS =====

/**
 * Hook for using z-index orchestrator in components
 */
export function useZIndex(
  componentId: string,
  requestedLayer: ZIndexToken = 'surface',
  options: {
    justification?: string;
    autoRelease?: boolean;
  } = {}
): {
  zIndex: number;
  zIndexClass: string;
  layer: ZIndexLayer;
} {
  const { justification, autoRelease = true } = options;
  const orchestrator = useZIndexOrchestrator();

  // Request layer on mount
  const layer = React.useMemo(() => {
    return orchestrator.requestLayer(componentId, requestedLayer, justification);
  }, [orchestrator, componentId, requestedLayer, justification]);

  // Release layer on unmount
  React.useEffect(() => {
    if (autoRelease) {
      return () => {
        orchestrator.releaseLayer(componentId);
      };
    }
    return;
  }, [orchestrator, componentId, autoRelease]);

  const zIndex = orchestrator.getZIndex(componentId);
  const zIndexClass = orchestrator.getZIndexClass(componentId);

  return {
    zIndex,
    zIndexClass,
    layer,
  };
}

/**
 * Hook for monitoring z-index usage
 */
export function useZIndexMonitor() {
  const orchestrator = useZIndexOrchestrator();
  const [report, setReport] = React.useState(orchestrator.getUsageReport());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setReport(orchestrator.getUsageReport());
    }, 1000);

    return () => clearInterval(interval);
  }, [orchestrator]);

  return report;
}

// ===== UTILITIES =====

/**
 * Get z-index value for a layer token
 */
export function getZIndexValue(token: ZIndexToken): number {
  return Z_INDEX_TOKENS[token];
}

/**
 * Get all available layer tokens
 */
export function getAvailableLayers(): ZIndexToken[] {
  return Object.keys(Z_INDEX_TOKENS) as ZIndexToken[];
}

/**
 * Check if layer token is valid
 */
export function isValidLayer(token: string): token is ZIndexToken {
  return token in Z_INDEX_TOKENS;
}

export default ZIndexOrchestrator;
