/**
 * Motion Presets - Governed Animation Library for MAPS v3.0
 *
 * ANTI-DRIFT ENFORCEMENT:
 * - Token-only motion values: No arbitrary durations/easings
 * - SSOT compliance: Enhanced tokens for all motion properties
 * - Reduced motion respect: Mandatory accessibility compliance
 * - Performance monitoring: Animation performance tracking
 *
 * GOVERNANCE RULES:
 * - Reduced motion alternatives: All animations must have safe fallbacks
 * - Semantic naming: Descriptive motion purposes only
 * - Performance budgets: Frame rate monitoring and optimization
 * - Context awareness: Appropriate motion for use case
 *
 * NON-NEGOTIABLE GUARDRAILS:
 * - No arbitrary duration values
 * - No easing without reduced motion alternative
 * - No animations without performance consideration
 * - No motion without accessibility compliance
 */

import React from 'react';

import type {
  MotionPreset,
  MotionConfig,
  MotionViolation
} from './types';

// ===== MOTION TOKEN MAPPING - Fortune-500 Semantic Presets =====

const MOTION_TOKENS = {
  standard: {
    duration: '180ms',
    easing: 'cubic-bezier(0.2, 0, 0.2, 1)',
    reducedMotion: '100ms',
  },
  entrance: {
    duration: '220ms',
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
    reducedMotion: '120ms',
  },
  exit: {
    duration: '160ms',
    easing: 'cubic-bezier(0.4, 0, 1, 1)',
    reducedMotion: '100ms',
  },
  spring: {
    duration: '600ms',
    easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    reducedMotion: '200ms',
  },
  reduced: {
    duration: '0ms',
    easing: 'linear',
    reducedMotion: '0ms',
  },
} as const;

type MotionToken = keyof typeof MOTION_TOKENS;

// ===== DEFAULT CONFIGURATION =====

const DEFAULT_MOTION_CONFIG: MotionConfig = {
  respectReducedMotion: true,
  defaultPreset: 'standard',
  allowCustom: false,
  monitorPerformance: true,
};

// ===== MOTION PRESET DEFINITIONS =====

const PREDEFINED_PRESETS: Record<MotionToken, MotionPreset> = {
  standard: {
    name: 'standard',
    duration: MOTION_TOKENS.standard.duration,
    easing: MOTION_TOKENS.standard.easing,
    reducedMotion: MOTION_TOKENS.standard.reducedMotion,
    usage: 'Standard UI transitions, hover states, focus changes',
  },
  entrance: {
    name: 'entrance',
    duration: MOTION_TOKENS.entrance.duration,
    easing: MOTION_TOKENS.entrance.easing,
    reducedMotion: MOTION_TOKENS.entrance.reducedMotion,
    usage: 'Component appearances, modal entries, tooltip shows',
  },
  exit: {
    name: 'exit',
    duration: MOTION_TOKENS.exit.duration,
    easing: MOTION_TOKENS.exit.easing,
    reducedMotion: MOTION_TOKENS.exit.reducedMotion,
    usage: 'Component dismissals, modal exits, tooltip hides',
  },
  spring: {
    name: 'spring',
    duration: MOTION_TOKENS.spring.duration,
    easing: MOTION_TOKENS.spring.easing,
    reducedMotion: MOTION_TOKENS.spring.reducedMotion,
    usage: 'Natural movements, drag and drop, elastic interactions',
  },
  reduced: {
    name: 'reduced',
    duration: MOTION_TOKENS.reduced.duration,
    easing: MOTION_TOKENS.reduced.easing,
    reducedMotion: MOTION_TOKENS.reduced.reducedMotion,
    usage: 'Reduced motion alternative, accessibility compliance',
  },
};

// ===== MOTION PRESETS CLASS =====

export class MotionPresets {
  private config: MotionConfig;
  private performanceMetrics: Map<string, number[]> = new Map();
  private reducedMotionPreference: boolean = false;

  constructor(config: Partial<MotionConfig> = {}) {
    this.config = { ...DEFAULT_MOTION_CONFIG, ...config };
    this.detectReducedMotionPreference();
  }

  /**
   * Get motion preset with reduced motion consideration
   */
  getPreset(token: MotionToken): MotionPreset {
    const preset = PREDEFINED_PRESETS[token];

    if (!preset) {
      throw new Error(`Motion preset '${token}' not found. Available presets: ${Object.keys(PREDEFINED_PRESETS).join(', ')}`);
    }

    if (this.config.respectReducedMotion && this.reducedMotionPreference) {
      return {
        ...preset,
        duration: preset.reducedMotion,
        easing: 'linear',
      };
    }

    return preset;
  }

  /**
   * Get CSS transition string for preset
   */
  getTransition(
    token: MotionToken,
    properties: string[] = ['all']
  ): string {
    const preset = this.getPreset(token);
    const propertyList = properties.join(', ');

    return `${propertyList} ${preset.duration} ${preset.easing}`;
  }

  /**
   * Get CSS classes for motion preset
   */
  getMotionClasses(token: MotionToken): string {
    const preset = this.getPreset(token);

    // Map to Tailwind classes
    const durationClass = this.getDurationClass(preset.duration);
    const easingClass = this.getEasingClass(preset.easing);

    return `${durationClass} ${easingClass} motion-safe:transition motion-reduce:transition-none`;
  }

  /**
   * Validate motion usage
   */
  validateMotion(
    token: MotionToken,
    _context: string,
    element: HTMLElement
  ): MotionViolation[] {
    const violations: MotionViolation[] = [];
    const preset = PREDEFINED_PRESETS[token];

    // Check reduced motion compliance
    if (!preset.reducedMotion) {
      violations.push({
        rule: 'no-reduced-motion',
        element: element.tagName,
        current: { duration: preset.duration, easing: preset.easing },
        alternative: this.getReducedMotionAlternative(token),
      });
    }

    // Check performance impact
    if (this.config.monitorPerformance) {
      const performanceImpact = this.assessPerformanceImpact(element, preset);
      if (performanceImpact > 16) { // More than one frame at 60fps
        violations.push({
          rule: 'performance-threshold',
          element: element.tagName,
          current: { duration: preset.duration, easing: preset.easing },
          alternative: PREDEFINED_PRESETS.standard,
        });
      }
    }

    return violations;
  }

  /**
   * Get reduced motion alternative
   */
  private getReducedMotionAlternative(token: MotionToken): MotionPreset {
    const preset = PREDEFINED_PRESETS[token];
    return {
      ...preset,
      duration: preset.reducedMotion,
      easing: 'linear',
    };
  }

  /**
   * Assess performance impact of motion - dev-only heuristic
   */
  private assessPerformanceImpact(element: HTMLElement, preset: MotionPreset): number {
    // Only run expensive checks in development
    if (process.env.NODE_ENV === 'production') {
      return 0; // Skip in production
    }

    // Simple heuristic based on element complexity and duration
    const elementComplexity = this.calculateElementComplexity(element);
    const duration = Number.parseInt(preset.duration, 10);

    return elementComplexity * (duration / 100); // Simplified calculation
  }

  /**
   * Calculate element complexity for performance assessment - dev-only
   */
  private calculateElementComplexity(element: HTMLElement): number {
    // Only run in development
    if (process.env.NODE_ENV === 'production') {
      return 1;
    }

    let complexity = 1;

    // Factor in number of children
    complexity += element.children.length * 0.1;

    // Factor in computed styles (expensive - dev only)
    const computedStyle = getComputedStyle(element);
    if (computedStyle.transform !== 'none') complexity += 0.5;
    if (computedStyle.filter !== 'none') complexity += 0.5;
    if (computedStyle.backdropFilter !== 'none') complexity += 1;

    return Math.min(complexity, 5); // Cap at 5x
  }

  /**
   * Map duration to exact Tailwind class - NO lossy approximations
   */
  private getDurationClass(duration: string): string {
    const durationValue = Number.parseInt(duration, 10);
    return `duration-${durationValue}`;
  }

  /**
   * Map easing to exact Tailwind class - Fortune-500 tokenic classes
   */
  private getEasingClass(easing: string): string {
    const easingMap: Record<string, string> = {
      'linear': 'ease-linear',
      'cubic-bezier(0.2, 0, 0.2, 1)': 'ease-standard',
      'cubic-bezier(0, 0, 0.2, 1)': 'ease-entrance',
      'cubic-bezier(0.4, 0, 1, 1)': 'ease-exit',
      'cubic-bezier(0.175, 0.885, 0.32, 1.275)': 'ease-spring',
    };

    return easingMap[easing] ?? 'ease-standard';
  }

  /**
   * Detect user's reduced motion preference
   */
  private detectReducedMotionPreference(): void {
    if (typeof globalThis !== 'undefined' && globalThis.matchMedia) {
      const mediaQuery = globalThis.matchMedia('(prefers-reduced-motion: reduce)');
      this.reducedMotionPreference = mediaQuery.matches;

      // Listen for changes
      mediaQuery.addEventListener('change', (e) => {
        this.reducedMotionPreference = e.matches;
      });
    }
  }

  /**
   * Record performance metrics
   */
  recordPerformance(animationId: string, frameDuration: number): void {
    if (!this.config.monitorPerformance) return;

    const metrics = this.performanceMetrics.get(animationId) ?? [];
    metrics.push(frameDuration);

    // Keep only last 10 measurements
    if (metrics.length > 10) {
      metrics.shift();
    }

    this.performanceMetrics.set(animationId, metrics);
  }

  /**
   * Get performance report
   */
  getPerformanceReport(): Record<string, {
    averageFrameTime: number;
    worstFrameTime: number;
    recommendation: string;
  }> {
    const report: Record<string, {
      averageFrameTime: number;
      worstFrameTime: number;
      recommendation: string;
    }> = {};

    for (const [animationId, metrics] of this.performanceMetrics) {
      const averageFrameTime = metrics.reduce((a, b) => a + b, 0) / metrics.length;
      const worstFrameTime = Math.max(...metrics);

      let recommendation = 'Performance is optimal';
      if (averageFrameTime > 16) {
        recommendation = 'Consider reducing animation complexity or duration';
      }
      if (worstFrameTime > 32) {
        recommendation = 'Animation is causing significant frame drops - optimize immediately';
      }

      report[animationId] = {
        averageFrameTime,
        worstFrameTime,
        recommendation,
      };
    }

    return report;
  }

  /**
   * Reset performance metrics
   */
  resetMetrics(): void {
    this.performanceMetrics.clear();
  }
}

// ===== REACT PROVIDER PATTERN =====

interface MotionContextValue {
  prefersReduced: boolean;
  presets: MotionPresets;
}

const MotionContext = React.createContext<MotionContextValue | null>(null);

/**
 * Provider for Motion Presets - Replaces global singleton
 */
export function MotionProvider({
  children,
  config = {}
}: {
  children: React.ReactNode;
  config?: Partial<MotionConfig>;
}) {
  const [prefersReduced, setReduced] = React.useState(false);
  const presetsRef = React.useRef<MotionPresets>();

  if (!presetsRef.current) {
    presetsRef.current = new MotionPresets(config);
  }

  React.useEffect(() => {
    if (typeof globalThis !== 'undefined' && globalThis.matchMedia) {
      const mq = globalThis.matchMedia('(prefers-reduced-motion: reduce)');
      setReduced(mq.matches);
      const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }
    return;
  }, []);

  const contextValue = {
    prefersReduced,
    presets: presetsRef.current,
  };

  return (
    <MotionContext.Provider value={contextValue}>
      {children}
    </MotionContext.Provider>
  );
}

/**
 * Hook to access motion presets from context
 */
function useMotionContext(): MotionContextValue {
  const context = React.useContext(MotionContext);

  if (!context) {
    throw new Error('useMotionContext must be used within MotionProvider');
  }

  return context;
}

// ===== UPDATED REACT HOOKS =====

/**
 * Hook for using motion presets in components - Provider pattern
 */
export function useMotion(
  token: MotionToken = 'standard',
  options: {
    monitorPerformance?: boolean;
    customProperties?: string[];
  } = {}
): {
  preset: MotionPreset;
  transition: string;
  motionClasses: string;
  isReducedMotion: boolean;
} {
  const { monitorPerformance = false, customProperties = ['all'] } = options;
  const { prefersReduced, presets } = useMotionContext();

  const preset = presets.getPreset(token);
  const transition = presets.getTransition(token, customProperties);
  const motionClasses = presets.getMotionClasses(token);

  // Track performance if enabled
  React.useEffect(() => {
    if (monitorPerformance && typeof globalThis !== 'undefined' && globalThis.PerformanceObserver) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          presets.recordPerformance(
            `${token}-${Date.now()}`,
            entry.duration
          );
        }
      });

      observer.observe({ entryTypes: ['measure'] });

      return () => observer.disconnect();
    }
    return;
  }, [token, monitorPerformance, presets]);

  return {
    preset,
    transition,
    motionClasses,
    isReducedMotion: prefersReduced,
  };
}

/**
 * Hook for motion performance monitoring
 */
export function useMotionPerformance() {
  const { presets } = useMotionContext();
  const [report, setReport] = React.useState(presets.getPerformanceReport());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setReport(presets.getPerformanceReport());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [presets]);

  return {
    report,
    resetMetrics: () => presets.resetMetrics(),
  };
}

// ===== DEV-ONLY PERFORMANCE SAMPLER =====

/**
 * Sample animation frames for performance monitoring - dev-only
 */
export function sampleAnimationFrames(cb: (ms: number) => void): () => void {
  if (process.env.NODE_ENV === 'production') {
    return () => {}; // No-op in production
  }

  if (typeof globalThis === 'undefined' || !globalThis.requestAnimationFrame) {
    return () => {}; // No-op in non-browser environments
  }

  let prev = performance.now();
  let id: number;

  const tick = (t: number) => {
    cb(t - prev);
    prev = t;
    id = requestAnimationFrame(tick);
  };

  id = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(id);
}

// ===== UTILITIES =====

// Fallback instance for utility functions (when used outside Provider)
const fallbackInstance = new MotionPresets();

/**
 * Get motion preset without hook
 */
export function getMotionPreset(token: MotionToken): MotionPreset {
  return fallbackInstance.getPreset(token);
}

/**
 * Get all available motion tokens
 */
export function getAvailableMotions(): MotionToken[] {
  return Object.keys(MOTION_TOKENS) as MotionToken[];
}

/**
 * Check if motion token is valid
 */
export function isValidMotion(token: string): token is MotionToken {
  return token in MOTION_TOKENS;
}

/**
 * Create custom motion class with governance
 */
export function createMotionClass(token: MotionToken): string {
  return fallbackInstance.getMotionClasses(token);
}

export default MotionPresets;
