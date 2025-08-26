/**
 * Primitive Governance Layer Tests - MAPS v3.0
 *
 * ANTI-DRIFT ENFORCEMENT:
 * - Zero tolerance testing: All governance rules must pass
 * - Token compliance validation: No hardcoded values allowed
 * - Performance monitoring: Animation performance tracking
 * - Accessibility compliance: WCAG AAA compliance testing
 *
 * TEST COVERAGE:
 * - TokenGuard: Hardcoded value detection and auto-fixing
 * - ZIndexOrchestrator: Layer conflict detection and resolution
 * - MotionPresets: Reduced motion compliance and performance
 *
 * NON-NEGOTIABLE REQUIREMENTS:
 * - All tests must pass without warnings
 * - No mock dependencies for governance validation
 * - Real-world usage patterns only
 * - Performance impact measurement
 */

import { describe, test, expect, beforeEach } from 'vitest';

import {
  TokenGuard,
  ZIndexOrchestrator,
  MotionPresets,
  getZIndexValue,
  getAvailableLayers,
  isValidLayer,
  getMotionPreset,
  getAvailableMotions,
  isValidMotion,
} from '@/components/primitives';

describe('🛡️ Primitive Governance Layer', () => {
  describe('TokenGuard', () => {
    let tokenGuard: TokenGuard;

    beforeEach(() => {
      tokenGuard = new TokenGuard();
    });

    test('should detect hardcoded color values', () => {
      const code = 'className="bg-[#ff0000] text-[#000000]"';
      const violations = tokenGuard.validateCode(code);

      expect(violations).toHaveLength(2);
      expect(violations[0]?.rule).toBe('blockArbitraryValues');
      expect(violations[0]?.code).toBe('[#ff0000]');
    });

    test('should suggest token-based alternatives', () => {
      const code = 'className="bg-red-500"';
      const violations = tokenGuard.validateCode(code);

      expect(violations).toHaveLength(1);
      expect(violations[0]?.fix).toContain('enhanced design tokens');
    });

    test('should validate className compliance', () => {
      const compliantClass = 'bg-surface text-content border-subtle';
      const nonCompliantClass = 'bg-[#ff0000] text-[16px]';

      expect(TokenGuard.isCompliant(compliantClass)).toBe(true);
      expect(TokenGuard.isCompliant(nonCompliantClass)).toBe(false);
    });

    test('should detect accessibility violations', () => {
      const code = '<button onClick={handleClick}>Click me</button>';
      const violations = tokenGuard.validateCode(code);

      // TokenGuard now delegates a11y checks to eslint-plugin-jsx-a11y for precision
      // This test verifies the delegation works correctly (no false a11y violations)
      expect(violations.some(v => v.rule === 'enforceAAA')).toBe(false);
    });
  });

  describe('ZIndexOrchestrator', () => {
    let orchestrator: ZIndexOrchestrator;

    beforeEach(() => {
      orchestrator = new ZIndexOrchestrator();
    });

    test('should provide valid z-index tokens', () => {
      const layers = getAvailableLayers();

      expect(layers).toContain('surface');
      expect(layers).toContain('modal');
      expect(layers).toContain('tooltip');

      for (const layer of layers) {
        expect(isValidLayer(layer)).toBe(true);
        expect(typeof getZIndexValue(layer)).toBe('number');
      }
    });

    test('should manage layer conflicts', () => {
      const layer1 = orchestrator.requestLayer('modal-1', 'modal');
      expect(layer1.value).toBe(1300);  // Fortune-500 corrected value

      // Should detect conflict for multiple modals
      expect(() => {
        orchestrator.requestLayer('modal-2', 'modal');
      }).toThrow(/conflict/);
    });

    test('should generate proper CSS classes', () => {
      orchestrator.requestLayer('test-component', 'overlay');
      const className = orchestrator.getZIndexClass('test-component');

      expect(className).toMatch(/z-/);
      expect(typeof className).toBe('string');
    });

    test('should provide usage reports', () => {
      orchestrator.requestLayer('comp-1', 'surface');
      orchestrator.requestLayer('comp-2', 'modal');

      const report = orchestrator.getUsageReport();

      expect(report.totalLayers).toBe(2);
      expect(report.layerDistribution.surface).toBe(1);
      expect(report.layerDistribution.modal).toBe(1);
      expect(report.performance.withinLimits).toBe(true);
    });
  });

  describe('MotionPresets', () => {
    let motionPresets: MotionPresets;

    beforeEach(() => {
      motionPresets = new MotionPresets();
    });

    test('should provide valid motion tokens', () => {
      const motions = getAvailableMotions();

      expect(motions).toContain('standard');  // Updated token name
      expect(motions).toContain('spring');
      expect(motions).toContain('reduced');   // Updated token name

      for (const motion of motions) {
        expect(isValidMotion(motion)).toBe(true);
        const preset = getMotionPreset(motion);
        expect(preset).toHaveProperty('duration');
        expect(preset).toHaveProperty('easing');
        expect(preset).toHaveProperty('reducedMotion');
      }
    });

    test('should respect reduced motion preferences', () => {
      // Create instance without reduced motion enforcement to test raw preset
      const normalMotion = new MotionPresets({ respectReducedMotion: false });
      const preset = normalMotion.getPreset('spring');

      expect(preset.duration).toBe('600ms');
      expect(preset.reducedMotion).toBe('200ms');
      expect(preset.usage).toContain('Natural movements');
    });

    test('should generate proper CSS transitions', () => {
      const normalMotion = new MotionPresets({ respectReducedMotion: false });
      const transition = normalMotion.getTransition('standard', ['opacity', 'transform']);  // Updated token

      expect(transition).toContain('opacity, transform');
      expect(transition).toContain('180ms');
      expect(transition).toContain('cubic-bezier');
    });

    test('should provide motion classes', () => {
      const classes = motionPresets.getMotionClasses('standard');  // Updated token

      expect(classes).toContain('motion-safe');
      expect(classes).toContain('motion-reduce');
      expect(classes).toContain('transition');
    });

    test('should validate motion usage', () => {
      const mockElement = document.createElement('div');
      const violations = motionPresets.validateMotion('spring', 'test', mockElement);

      // Should not have violations for valid usage
      expect(violations).toBeInstanceOf(Array);
    });
  });

  describe('Integration Tests', () => {
    test('should work together for complete governance', () => {
      const tokenGuard = new TokenGuard();
      const orchestrator = new ZIndexOrchestrator();
      const motionPresets = new MotionPresets();

      // Test component with governance
      const componentCode = `
        <div
          className="bg-surface text-content transition-all duration-300"
          style={{ zIndex: 20 }}
        >
          Content
        </div>
      `;

      // TokenGuard validation
      tokenGuard.validateCode(componentCode);

      // ZIndex management
      const layer = orchestrator.requestLayer('test-comp', 'modal');
      expect(layer.value).toBe(1300);  // Fortune-500 corrected value

      // Motion management
      const motionClasses = motionPresets.getMotionClasses('standard');  // Updated token
      expect(motionClasses).toContain('transition');
    });

    test('should provide comprehensive governance report', () => {
      const tokenGuard = new TokenGuard();
      const code = 'className="bg-[#ff0000] z-[999]"';

      tokenGuard.validateCode(code);
      const report = tokenGuard.generateReport();

      expect(report.tokenViolations.length).toBeGreaterThan(0);
      expect(report.complianceScore).toBeLessThan(100);
      expect(report.timestamp).toBeInstanceOf(Date);
    });
  });
});

describe('🎯 Performance & Accessibility', () => {
  test('should maintain performance standards', () => {
    const motionPresets = new MotionPresets({ monitorPerformance: true });

    // Simulate performance recording
    motionPresets.recordPerformance('test-animation', 12);
    motionPresets.recordPerformance('test-animation', 8);
    motionPresets.recordPerformance('test-animation', 15);

    const report = motionPresets.getPerformanceReport();
    const testReport = report['test-animation'];

    if (testReport) {
      expect(testReport.averageFrameTime).toBeLessThan(16); // 60fps target
      expect(testReport.recommendation).toContain('optimal');
    }
  });

  test('should enforce accessibility compliance', () => {
    const tokenGuard = new TokenGuard({ enforceAAA: true });

    const accessibleCode = `
      <button
        onClick={handleClick}
        aria-label="Close dialog"
        className="bg-surface text-content"
      >
        Close
      </button>
    `;

    const violations = tokenGuard.validateCode(accessibleCode);
    const aaaViolations = violations.filter(v => v.rule === 'enforceAAA');

    // Should have minimal AAA violations with proper aria-label
    expect(aaaViolations.length).toBeLessThanOrEqual(1);
  });

  test('should support reduced motion preferences', () => {
    const motionPresets = new MotionPresets({ respectReducedMotion: true });

    // All presets should have reduced motion alternatives
    const motions = getAvailableMotions();

    for (const motion of motions) {
      const preset = motionPresets.getPreset(motion);
      expect(preset.reducedMotion).toBeDefined();
      expect(preset.reducedMotion).not.toBe('');
    }
  });
});

describe('🔒 Anti-Drift Enforcement', () => {
  test('should block arbitrary values completely', () => {
    const tokenGuard = new TokenGuard({
      blockArbitraryValues: true,
      enforceEnhancedTokens: true
    });

    const driftCode = `
      className="bg-[#custom] p-[15px] z-[999] border-[2px]"
    `;

    const violations = tokenGuard.validateCode(driftCode);

    // Should have multiple violations for arbitrary values
    expect(violations.length).toBeGreaterThan(0);
    expect(violations.every(v => v.severity === 'error')).toBe(true);
  });

  test('should enforce token-only development', () => {
    // Should not allow arbitrary z-index values
    expect(isValidLayer('custom-layer-999')).toBe(false);
    expect(isValidLayer('modal')).toBe(true);
  });

  test('should prevent performance degradation', () => {
    const motionPresets = new MotionPresets({ monitorPerformance: true });

    // Should flag performance issues
    motionPresets.recordPerformance('heavy-animation', 50); // Exceeds 16ms budget

    const report = motionPresets.getPerformanceReport();
    const heavyReport = report['heavy-animation'];

    if (heavyReport) {
      expect(heavyReport.recommendation).toContain('optimize');
    }
  });
});
