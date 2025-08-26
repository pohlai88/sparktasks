/**
 * Z-Index Registry - Dynamic Token-Based Layer Management
 *
 * ARCHITECTURE PRINCIPLES:
 * - Single Source of Truth: Uses ENHANCED_DESIGN_TOKENS only
 * - Dynamic Registration: No hardcoded token maps
 * - Conflict Resolution: Semantic conflict detection
 * - Visual Debugging: Debug-ready structure
 * - Performance: Lightweight, no React dependencies
 *
 * GOVERNANCE RULES:
 * - Token-only values: All z-index from enhanced tokens
 * - Semantic validation: Enforce meaningful layer names
 * - Conflict prevention: Automatic overlap detection
 * - Auto-cleanup: Memory-safe component tracking
 */

import { ENHANCED_DESIGN_TOKENS } from '../../design/enhanced-tokens';

// ===== TYPES =====

export type ZIndexToken = {
  name: string;
  value: number;
  conflictsWith?: string[];
  description?: string;
};

export type ComponentLayerEntry = {
  componentId: string;
  layerName: string;
  timestamp: number;
};

export type ConflictResolution = {
  canResolve: boolean;
  suggestion: string;
  priority: 'low' | 'medium' | 'high';
};

export type LayerDebugInfo = ComponentLayerEntry & {
  zIndex: number;
  tailwindClass: string;
  conflicts: string[];
};

// ===== ENHANCED TOKEN INTEGRATION =====

/**
 * Dynamic Z-Index Registry using ENHANCED_DESIGN_TOKENS as SSOT
 */
class ZIndexRegistry {
  private readonly tokenRegistry: Record<string, ZIndexToken>;
  private readonly componentLayerMap: Record<string, string> = {};
  private layerStack: ComponentLayerEntry[] = [];

  constructor() {
    // Initialize registry from ENHANCED_DESIGN_TOKENS
    this.tokenRegistry = this.initializeFromTokens();
  }

  /**
   * Initialize registry from enhanced tokens (SSOT)
   */
  private initializeFromTokens(): Record<string, ZIndexToken> {
    const zIndexTokens = ENHANCED_DESIGN_TOKENS.foundation.zIndex;
    const registry: Record<string, ZIndexToken> = {};

    // Convert enhanced tokens to registry format
    for (const [name, value] of Object.entries(zIndexTokens)) {
      registry[name] = {
        name,
        value: typeof value === 'number' ? value : 0,
        conflictsWith: this.getConflictRules(name),
        description: this.getLayerDescription(name),
      };
    }

    return registry;
  }

  /**
   * Get semantic conflict rules for layer
   */
  private getConflictRules(layerName: string): string[] {
    const conflictMap: Record<string, string[]> = {
      modal: ['dropdown', 'popover'], // Modal blocks everything below
      popover: ['dropdown'], // Popover conflicts with dropdown
      toast: [], // Toast can coexist with most layers
      tooltip: [], // Tooltip is informational only
      overlay: ['modal'], // Overlay shouldn't be under modal
      surface: [], // Surface is base layer
    };

    return conflictMap[layerName] || [];
  }

  /**
   * Get semantic description for layer
   */
  private getLayerDescription(layerName: string): string {
    const descriptions: Record<string, string> = {
      surface: 'Default document flow - base layer',
      overlay: 'General overlays and elevated surfaces',
      popover: 'Contextual information - non-blocking',
      modal: 'Blocking interactions - user action required',
      toast: 'System notifications - high priority',
      tooltip: 'Informational overlays - no interactions',
    };

    return descriptions[layerName] || `Layer: ${layerName}`;
  }

  /**
   * Register component with layer (MAIN API)
   */
  registerComponentLayer(componentId: string, layerName: string): void {
    // Validate layer exists in tokens
    if (!this.tokenRegistry[layerName]) {
      throw new Error(
        `Layer "${layerName}" not found in ENHANCED_DESIGN_TOKENS.foundation.zIndex`
      );
    }

    // Validate semantic naming
    if (!this.validateTokenName(layerName)) {
      throw new Error(
        `Invalid layer name: ${layerName}. Use lowercase semantic names only.`
      );
    }

    // Check for conflicts
    const conflicts = this.detectConflicts(layerName);
    if (conflicts.length > 0) {
      const conflictIds = conflicts.map(c => c.componentId).join(', ');
      console.warn(
        `⚠️ Layer conflict detected: ${layerName} conflicts with components: ${conflictIds}`
      );
    }

    // Clean up existing registration
    if (this.componentLayerMap[componentId]) {
      this.performAutoCleanup(componentId);
    }

    // Register new layer
    this.componentLayerMap[componentId] = layerName;
    this.layerStack.push({
      componentId,
      layerName,
      timestamp: Date.now(),
    });
  }

  /**
   * Get z-index value for component
   */
  getZIndex(componentId: string): number {
    const layerName = this.componentLayerMap[componentId];
    if (!layerName) return 0;
    return this.tokenRegistry[layerName]?.value ?? 0;
  }

  /**
   * Get Tailwind class for component (dynamic mapping)
   */
  getTailwindClass(componentId: string): string {
    const layerName = this.componentLayerMap[componentId];
    if (!layerName) return 'z-0';
    const value = this.tokenRegistry[layerName]?.value;

    if (!value) return 'z-0';

    // Dynamic mapping based on token values
    if (value >= 1500) return 'z-50';
    if (value >= 1400) return 'z-40';
    if (value >= 1300) return 'z-30';
    if (value >= 1100) return 'z-20';
    if (value >= 100) return 'z-10';
    return 'z-0';
  }

  /**
   * Detect conflicts with existing layers
   */
  private detectConflicts(newLayerName: string): ComponentLayerEntry[] {
    const conflicts: ComponentLayerEntry[] = [];
    const newToken = this.tokenRegistry[newLayerName];

    if (!newToken) return conflicts;

    for (const entry of this.layerStack) {
      // Check if new layer conflicts with existing layer
      if (newToken.conflictsWith?.includes(entry.layerName)) {
        conflicts.push(entry);
      }

      // Check if existing layer conflicts with new layer
      const existingToken = this.tokenRegistry[entry.layerName];
      if (existingToken?.conflictsWith?.includes(newLayerName)) {
        conflicts.push(entry);
      }
    }

    return conflicts;
  }

  /**
   * Check if two layers have conflicts
   */
  hasConflict(layerA: string, layerB: string): boolean {
    const tokenA = this.tokenRegistry[layerA];
    const tokenB = this.tokenRegistry[layerB];

    if (!tokenA || !tokenB) return false;

    return (
      (tokenA.conflictsWith?.includes(layerB) ||
        tokenB.conflictsWith?.includes(layerA)) ??
      false
    );
  }

  /**
   * Clean up component registration
   */
  performAutoCleanup(componentId: string): void {
    delete this.componentLayerMap[componentId];
    this.layerStack = this.layerStack.filter(
      entry => entry.componentId !== componentId
    );
  }

  /**
   * Validate token name (semantic naming)
   */
  validateTokenName(name: string): boolean {
    return /^[a-z]+$/.test(name); // lowercase only, no spaces/numbers
  }

  /**
   * Get debugger snapshot (visual debugging support)
   */
  getDebuggerSnapshot(): LayerDebugInfo[] {
    return this.layerStack.map(entry => ({
      ...entry,
      zIndex: this.tokenRegistry[entry.layerName]?.value ?? 0,
      tailwindClass: this.getTailwindClass(entry.componentId),
      conflicts: this.detectConflicts(entry.layerName).map(c => c.componentId),
    }));
  }

  /**
   * Get conflict resolution suggestions
   */
  getConflictResolution(layerName: string): ConflictResolution {
    const conflicts = this.detectConflicts(layerName);

    if (conflicts.length === 0) {
      return {
        canResolve: true,
        suggestion: 'No conflicts detected',
        priority: 'low',
      };
    }

    const conflictLayerNames = conflicts.map(c => c.layerName).join(', ');

    return {
      canResolve: true,
      suggestion: `Consider using a different layer or waiting for conflicting layers (${conflictLayerNames}) to unmount`,
      priority: conflicts.length > 2 ? 'high' : 'medium',
    };
  }

  /**
   * Get available layers from tokens
   */
  getAvailableLayers(): string[] {
    return Object.keys(this.tokenRegistry);
  }

  /**
   * Get layer statistics
   */
  getLayerStats(): {
    totalLayers: number;
    activeComponents: number;
    conflictCount: number;
    mostUsedLayer: string;
  } {
    const layerCounts: Record<string, number> = {};

    // Count layer usage
    for (const entry of this.layerStack) {
      layerCounts[entry.layerName] = (layerCounts[entry.layerName] || 0) + 1;
    }

    // Find most used layer
    const mostUsedLayer =
      Object.entries(layerCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      'none';

    // Count total conflicts
    let conflictCount = 0;
    for (const layerName of Object.keys(layerCounts)) {
      conflictCount += this.detectConflicts(layerName).length;
    }

    return {
      totalLayers: Object.keys(this.tokenRegistry).length,
      activeComponents: this.layerStack.length,
      conflictCount,
      mostUsedLayer,
    };
  }

  /**
   * Reset all registrations
   */
  reset(): void {
    for (const id of Object.keys(this.componentLayerMap)) {
      delete this.componentLayerMap[id];
    }
    this.layerStack = [];
  }
}

// ===== SINGLETON INSTANCE =====

const zIndexRegistry = new ZIndexRegistry();

// ===== PUBLIC API =====

/**
 * Register component with z-index layer
 */
export function registerComponentLayer(
  componentId: string,
  layerName: string
): void {
  zIndexRegistry.registerComponentLayer(componentId, layerName);
}

/**
 * Get z-index value for component
 */
export function getZIndex(componentId: string): number {
  return zIndexRegistry.getZIndex(componentId);
}

/**
 * Get Tailwind class for component
 */
export function getTailwindClass(componentId: string): string {
  return zIndexRegistry.getTailwindClass(componentId);
}

/**
 * Check if two layers conflict
 */
export function hasConflict(layerA: string, layerB: string): boolean {
  return zIndexRegistry.hasConflict(layerA, layerB);
}

/**
 * Clean up component registration
 */
export function performAutoCleanup(componentId: string): void {
  zIndexRegistry.performAutoCleanup(componentId);
}

/**
 * Validate layer name
 */
export function validateTokenName(name: string): boolean {
  return zIndexRegistry.validateTokenName(name);
}

/**
 * Get debug snapshot for visual debugging
 */
export function getDebuggerSnapshot(): LayerDebugInfo[] {
  return zIndexRegistry.getDebuggerSnapshot();
}

/**
 * Get available layers from enhanced tokens
 */
export function getAvailableLayers(): string[] {
  return zIndexRegistry.getAvailableLayers();
}

/**
 * Get layer statistics
 */
export function getLayerStats(): ReturnType<
  typeof zIndexRegistry.getLayerStats
> {
  return zIndexRegistry.getLayerStats();
}

/**
 * Get conflict resolution suggestions
 */
export function getConflictResolution(layerName: string): ConflictResolution {
  return zIndexRegistry.getConflictResolution(layerName);
}

/**
 * Reset all registrations
 */
export function resetRegistry(): void {
  zIndexRegistry.reset();
}

export default zIndexRegistry;
