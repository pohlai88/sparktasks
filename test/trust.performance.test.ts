/**
 * Trust System Performance & Edge Case Tests
 * Validates core functionality without crypto dependencies
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { StorageDriver } from '../src/storage/types';
import type { TrustRoot, TrustManifest } from '../src/trust/types';
import * as TrustEngine from '../src/trust/engine';

// Mock storage with performance tracking
const mockStorage: StorageDriver = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  listKeys: vi.fn()
};

// Helper functions
function createTestRoot(
  id: string,
  pubKey: string,
  role: 'PRIMARY' | 'SECONDARY' | 'EMERGENCY' = 'PRIMARY',
  expiresAt?: number
): TrustRoot {
  return {
    id,
    pubB64u: pubKey,
    role,
    createdAt: Date.now(),
    ...(expiresAt && { expiresAt })
  };
}

function createTestManifest(
  roots: TrustRoot[],
  threshold: number = 2,
  precedingHash?: string
): TrustManifest {
  return {
    version: 1,
    namespace: 'test-workspace',
    roots,
    threshold,
    createdAt: Date.now(),
    ...(precedingHash && { precedingHash })
  };
}

describe('Trust System Performance & Edge Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStorage.getItem = vi.fn().mockResolvedValue(null);
    mockStorage.setItem = vi.fn().mockResolvedValue(undefined);
    TrustEngine.configureTrust(mockStorage, 'test-workspace');
  });

  describe('📊 Performance Tests', () => {
    it('should handle large trust root sets efficiently', async () => {
      const startTime = performance.now();
      
      // Create 20 trust roots (stress test)
      const largeRootSet: TrustRoot[] = Array.from({ length: 20 }, (_, i) => 
        createTestRoot(`root-${i}`, `pubkey-${i}`, 'SECONDARY')
      );

      const manifest = createTestManifest(largeRootSet, 15); // 15-of-20 threshold

      expect(manifest.roots).toHaveLength(20);
      expect(manifest.threshold).toBe(15);

      // Validation should handle large sets without issues
      const validation = await TrustEngine.validateTrustManifest(manifest, []);
      
      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(validation.manifestValid).toBe(true);
      expect(validation.thresholdMet).toBe(false); // No signatures provided
      expect(duration).toBeLessThan(100); // Should complete under 100ms

      console.log(`✅ Large manifest validation: ${duration.toFixed(2)}ms`);
    });

    it('should efficiently filter expired trust roots', async () => {
      const now = Date.now();
      const roots = [
        createTestRoot('active-1', 'key1', 'PRIMARY'),
        createTestRoot('active-2', 'key2', 'PRIMARY'),
        createTestRoot('expired-1', 'key3', 'EMERGENCY', now - 1000), // Expired
        createTestRoot('expired-2', 'key4', 'EMERGENCY', now - 500),  // Expired
        createTestRoot('future-1', 'key5', 'EMERGENCY', now + 10000)  // Active
      ];

      const state = {
        currentManifest: createTestManifest(roots, 3),
        pendingOperations: [],
        operationHistory: [],
        lastUpdated: now
      };
      mockStorage.getItem = vi.fn().mockResolvedValue(JSON.stringify(state));

      const startTime = performance.now();
      const activeRoots = await TrustEngine.getActiveTrustRoots();
      const endTime = performance.now();

      expect(activeRoots).toHaveLength(3); // 2 primary + 1 future emergency
      expect(activeRoots.find(r => r.id === 'expired-1')).toBeUndefined();
      expect(activeRoots.find(r => r.id === 'expired-2')).toBeUndefined();
      expect(activeRoots.find(r => r.id === 'future-1')).toBeDefined();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(50); // Should be very fast

      console.log(`✅ Root expiry filtering: ${duration.toFixed(2)}ms`);
    });

    it('should handle rapid trust verification queries', async () => {
      const roots = [
        createTestRoot('admin1', 'trusted-key-1'),
        createTestRoot('admin2', 'trusted-key-2'),
        createTestRoot('admin3', 'trusted-key-3')
      ];

      const state = {
        currentManifest: createTestManifest(roots, 2),
        pendingOperations: [],
        operationHistory: [],
        lastUpdated: Date.now()
      };
      mockStorage.getItem = vi.fn().mockResolvedValue(JSON.stringify(state));

      // Benchmark 100 trust verification queries
      const startTime = performance.now();
      
      const results = await Promise.all([
        ...Array.from({ length: 50 }, () => TrustEngine.isTrustedKey('trusted-key-1')),
        ...Array.from({ length: 50 }, () => TrustEngine.isTrustedKey('untrusted-key'))
      ]);

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(results.filter(Boolean)).toHaveLength(50); // 50 trusted
      expect(results.filter(r => !r)).toHaveLength(50); // 50 untrusted
      expect(duration).toBeLessThan(200); // Should complete under 200ms

      console.log(`✅ 100 trust queries: ${duration.toFixed(2)}ms (${(duration/100).toFixed(2)}ms avg)`);
    });
  });

  describe('🛡️ Edge Case Handling', () => {
    it('should handle malformed manifest gracefully', async () => {
      const malformedManifests = [
        // Empty roots
        {
          version: 1,
          namespace: 'test-workspace',
          roots: [],
          threshold: 1,
          createdAt: Date.now()
        },
        // Threshold too high
        {
          version: 1,
          namespace: 'test-workspace',
          roots: [createTestRoot('root1', 'key1')],
          threshold: 5, // > root count
          createdAt: Date.now()
        },
        // Threshold zero
        {
          version: 1,
          namespace: 'test-workspace',
          roots: [createTestRoot('root1', 'key1')],
          threshold: 0,
          createdAt: Date.now()
        }
      ] as TrustManifest[];

      for (const manifest of malformedManifests) {
        const validation = await TrustEngine.validateTrustManifest(manifest, []);
        expect(validation.valid).toBe(false);
        expect(validation.manifestValid).toBe(false);
        expect(validation.errors.length).toBeGreaterThan(0);
      }
    });

    it('should handle storage failures gracefully', async () => {
      // Test various storage failure scenarios
      const failureCases = [
        new Error('Network timeout'),
        new Error('Storage quota exceeded'),
        new Error('Permission denied'),
        null, // Unexpected null
        undefined // Unexpected undefined
      ];

      for (const error of failureCases) {
        mockStorage.getItem = vi.fn().mockRejectedValue(error);
        
        const state = await TrustEngine.getTrustState();
        expect(state).toBeNull(); // Should handle gracefully

        const activeRoots = await TrustEngine.getActiveTrustRoots();
        expect(activeRoots).toEqual([]); // Should return empty array

        const isTrusted = await TrustEngine.isTrustedKey('any-key');
        expect(isTrusted).toBe(false); // Should default to untrusted
      }
    });

    it('should handle corrupted state data', async () => {
      const corruptedStates = [
        'invalid-json{',
        '{"malformed": "object"}',
        '[]', // Array instead of object
        'null',
        '{"currentManifest": null}' // Missing required fields
      ];

      for (const corruptedState of corruptedStates) {
        mockStorage.getItem = vi.fn().mockResolvedValue(corruptedState);
        
        const state = await TrustEngine.getTrustState();
        expect(state).toBeNull(); // Should handle corruption gracefully
      }
    });

    it('should handle concurrent operation scenarios', async () => {
      const initialManifest = createTestManifest([
        createTestRoot('admin1', 'key1')
      ], 1);

      const existingState = {
        currentManifest: initialManifest,
        pendingOperations: [],
        operationHistory: [],
        lastUpdated: Date.now()
      };
      mockStorage.getItem = vi.fn().mockResolvedValue(JSON.stringify(existingState));

      // Simulate concurrent operations
      const operations = await Promise.allSettled([
        TrustEngine.createTrustOperation('TRUST_ROOT_ADD', {
          ...initialManifest,
          roots: [...initialManifest.roots, createTestRoot('admin2', 'key2')],
          version: 2,
          createdAt: Date.now()
        }, 'Add admin2'),
        TrustEngine.createTrustOperation('TRUST_ROOT_ADD', {
          ...initialManifest,
          roots: [...initialManifest.roots, createTestRoot('admin3', 'key3')],
          version: 2,
          createdAt: Date.now()
        }, 'Add admin3'),
        TrustEngine.createTrustOperation('TRUST_THRESHOLD_UPDATE', {
          ...initialManifest,
          threshold: 2,
          version: 2,
          createdAt: Date.now()
        }, 'Update threshold')
      ]);

      // All operations should succeed (they'll be queued)
      const successfulOps = operations.filter(op => op.status === 'fulfilled');
      expect(successfulOps).toHaveLength(3);
    });
  });

  describe('🔍 Boundary Condition Tests', () => {
    it('should handle maximum threshold scenarios', async () => {
      const maxRoots = 10;
      const roots = Array.from({ length: maxRoots }, (_, i) => 
        createTestRoot(`root-${i}`, `key-${i}`)
      );

      // Test various threshold boundaries
      const thresholds = [1, maxRoots/2, maxRoots-1, maxRoots];
      
      for (const threshold of thresholds) {
        const manifest = createTestManifest(roots, threshold);
        const validation = await TrustEngine.validateTrustManifest(manifest, []);
        
        expect(validation.manifestValid).toBe(true);
        expect(manifest.threshold).toBe(threshold);
      }
    });

    it('should handle emergency root expiration edge cases', async () => {
      const now = Date.now();
      const almostExpired = now + 1000; // Expires in 1 second
      const justExpired = now - 100; // Expired 100ms ago
      
      const roots = [
        createTestRoot('emergency-1', 'key1', 'EMERGENCY', almostExpired),
        createTestRoot('emergency-2', 'key2', 'EMERGENCY', justExpired),
        createTestRoot('primary', 'key3', 'PRIMARY')
      ];

      const state = {
        currentManifest: createTestManifest(roots, 1),
        pendingOperations: [],
        operationHistory: [],
        lastUpdated: now
      };
      mockStorage.getItem = vi.fn().mockResolvedValue(JSON.stringify(state));

      const activeRoots = await TrustEngine.getActiveTrustRoots();
      
      expect(activeRoots).toHaveLength(2); // almostExpired + primary
      expect(activeRoots.find(r => r.id === 'emergency-1')).toBeDefined();
      expect(activeRoots.find(r => r.id === 'emergency-2')).toBeUndefined();
      expect(activeRoots.find(r => r.id === 'primary')).toBeDefined();
    });

    it('should handle namespace isolation', async () => {
      const roots = [createTestRoot('admin1', 'shared-key')];
      
      // Configure for different namespaces
      TrustEngine.configureTrust(mockStorage, 'workspace-a');
      
      const stateA = {
        currentManifest: createTestManifest(roots, 1),
        pendingOperations: [],
        operationHistory: [],
        lastUpdated: Date.now()
      };

      // Mock storage to return state only for workspace-a
      mockStorage.getItem = vi.fn().mockImplementation((key) => {
        if (key.includes('workspace-a')) {
          return Promise.resolve(JSON.stringify(stateA));
        }
        return Promise.resolve(null);
      });

      const isTrustedInA = await TrustEngine.isTrustedKey('shared-key');
      expect(isTrustedInA).toBe(true);

      // Switch to workspace-b
      TrustEngine.configureTrust(mockStorage, 'workspace-b');
      
      const isTrustedInB = await TrustEngine.isTrustedKey('shared-key');
      expect(isTrustedInB).toBe(false); // Not trusted in workspace-b
    });
  });

  describe('📈 Resource Usage Tests', () => {
    it('should have reasonable memory footprint', async () => {
      const roots = Array.from({ length: 5 }, (_, i) => 
        createTestRoot(`root-${i}`, `${'x'.repeat(100)}-${i}`) // Longer keys
      );

      const largeManifest = createTestManifest(roots, 3);
      const serialized = JSON.stringify(largeManifest);
      
      // Should be under 5KB for reasonable manifest
      expect(serialized.length).toBeLessThan(5000);
      
      const parsed = JSON.parse(serialized);
      expect(parsed.roots).toHaveLength(5);
      
      console.log(`✅ Manifest size: ${serialized.length} bytes`);
    });

    it('should handle repeated state access efficiently', async () => {
      const state = {
        currentManifest: createTestManifest([
          createTestRoot('admin1', 'key1'),
          createTestRoot('admin2', 'key2')
        ], 2),
        pendingOperations: [],
        operationHistory: [],
        lastUpdated: Date.now()
      };
      mockStorage.getItem = vi.fn().mockResolvedValue(JSON.stringify(state));

      const startTime = performance.now();
      
      // Simulate rapid state access
      const results = await Promise.all(
        Array.from({ length: 50 }, () => TrustEngine.getTrustState())
      );

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(results).toHaveLength(50);
      expect(results.every(s => s !== null)).toBe(true);
      expect(duration).toBeLessThan(500); // Should be fast with caching potential

      console.log(`✅ 50 state access calls: ${duration.toFixed(2)}ms`);
    });
  });
});
