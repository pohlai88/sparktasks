/**
 * Trust Root Management Tests - Phase B Task 15B
 * Comprehensive test suite for trust root and signer rotation system
 */

import { describe, it, expect, beforeEach, vi, beforeAll } from 'vitest';
import type { StorageDriver } from '../src/storage/types';
import type { TrustRoot, TrustManifest, TrustConfig } from '../src/trust/types';
import * as TrustEngine from '../src/trust/engine';

// Setup crypto for Node.js environment
beforeAll(() => {
  if (!globalThis.crypto) {
    const { webcrypto } = require('node:crypto');
    globalThis.crypto = webcrypto as Crypto;
  }
});

// Mock storage implementation
const mockStorage: StorageDriver = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  listKeys: vi.fn()
};

// Mock Ed25519 key pairs for testing
const testKeys = {
  root1: {
    publicKey: 'MCowBQYDK2VwAyEAfGb7j3SjhKPxEqF7aGG6M2GZz1r4jb6JxYa8hW2o3P0',
    privateKey: 'MC4CAQAwBQYDK2VwBCIEIB4p5r7qb2i9o8jK5M6VxG7P3W4XtG1yN5rF2hJ9KlMd'
  },
  root2: {
    publicKey: 'MCowBQYDK2VwAyEA1R8r5bF9jN2kL4mP7tG3W6YzX8Q5vB4H9cJ1dS6fE3Ai',
    privateKey: 'MC4CAQAwBQYDK2VwBCIEIG8N7t2r4jK1mF6P5Y3bH9vE8wQ2xL4nS1cF7Rd9JkMi'
  },
  root3: {
    publicKey: 'MCowBQYDK2VwAyEAp9jK3L6mF1bG4tN8Y5vW2rQ7xE9cH1dS5fJ2kP4vL8Ma',
    privateKey: 'MC4CAQAwBQYDK2VwBCIEIL5W8t1rK4jN2mY6P3bH7vF9cQ4xG1nS5dL2fR8JkVi'
  }
};

// Helper: Create test trust root
function createTestRoot(id: string, pubKey: string, role: 'PRIMARY' | 'SECONDARY' | 'EMERGENCY' = 'PRIMARY'): TrustRoot {
  return {
    id,
    pubB64u: pubKey,
    role,
    createdAt: Date.now()
  };
}

// Helper: Create test manifest
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

describe('Trust Root Management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStorage.getItem = vi.fn().mockResolvedValue(null);
    mockStorage.setItem = vi.fn().mockResolvedValue(undefined);
    TrustEngine.configureTrust(mockStorage, 'test-workspace');
  });

  describe('Trust System Initialization', () => {
    it('should initialize trust system with valid configuration', async () => {
      const roots = [
        createTestRoot('root1', testKeys.root1.publicKey),
        createTestRoot('root2', testKeys.root2.publicKey),
        createTestRoot('root3', testKeys.root3.publicKey)
      ];

      const config: TrustConfig = {
        namespace: 'test-workspace',
        initialRoots: roots,
        initialThreshold: 2
      };

      const state = await TrustEngine.initializeTrust(config);

      expect(state.currentManifest.roots).toHaveLength(3);
      expect(state.currentManifest.threshold).toBe(2);
      expect(state.currentManifest.namespace).toBe('test-workspace');
      expect(state.pendingOperations).toHaveLength(0);
      expect(state.operationHistory).toHaveLength(0);
    });

    it('should reject initialization if trust system already exists', async () => {
      mockStorage.getItem = vi.fn().mockResolvedValue(JSON.stringify({
        currentManifest: createTestManifest([]),
        pendingOperations: [],
        operationHistory: [],
        lastUpdated: Date.now()
      }));

      const config: TrustConfig = {
        namespace: 'test-workspace',
        initialRoots: [createTestRoot('root1', testKeys.root1.publicKey)],
        initialThreshold: 1
      };

      await expect(TrustEngine.initializeTrust(config)).rejects.toThrow('Trust system already initialized');
    });

    it('should validate minimum threshold requirements', async () => {
      const roots = [createTestRoot('root1', testKeys.root1.publicKey)];

      const config: TrustConfig = {
        namespace: 'test-workspace',
        initialRoots: roots,
        initialThreshold: 2 // Invalid: threshold > roots
      };

      await expect(TrustEngine.initializeTrust(config)).rejects.toThrow();
    });
  });

  describe('Trust Manifest Validation', () => {
    it('should validate well-formed manifest with sufficient signatures', async () => {
      const roots = [
        createTestRoot('root1', testKeys.root1.publicKey),
        createTestRoot('root2', testKeys.root2.publicKey)
      ];
      const manifest = createTestManifest(roots, 1);

      // Mock crypto operations
      vi.spyOn(global.crypto.subtle, 'verify').mockResolvedValue(true);
      vi.spyOn(global.crypto.subtle, 'importKey').mockResolvedValue({} as CryptoKey);

      const issuers = [{
        rootId: 'root1',
        pubB64u: testKeys.root1.publicKey,
        sigB64u: 'mock-signature',
        signedAt: Date.now()
      }];

      const validation = await TrustEngine.validateTrustManifest(manifest, issuers);

      expect(validation.valid).toBe(true);
      expect(validation.manifestValid).toBe(true);
      expect(validation.signaturesValid).toBe(true);
      expect(validation.thresholdMet).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should reject manifest with insufficient signatures', async () => {
      const roots = [
        createTestRoot('root1', testKeys.root1.publicKey),
        createTestRoot('root2', testKeys.root2.publicKey)
      ];
      const manifest = createTestManifest(roots, 2); // Requires 2 signatures

      const issuers = [{
        rootId: 'root1',
        pubB64u: testKeys.root1.publicKey,
        sigB64u: 'mock-signature',
        signedAt: Date.now()
      }]; // Only 1 signature provided

      // Mock crypto operations
      vi.spyOn(global.crypto.subtle, 'verify').mockResolvedValue(true);
      vi.spyOn(global.crypto.subtle, 'importKey').mockResolvedValue({} as CryptoKey);

      const validation = await TrustEngine.validateTrustManifest(manifest, issuers);

      expect(validation.valid).toBe(false);
      expect(validation.thresholdMet).toBe(false);
      expect(validation.errors).toContain('Insufficient signatures: 1/2');
    });

    it('should reject manifest with invalid signature', async () => {
      const roots = [createTestRoot('root1', testKeys.root1.publicKey)];
      const manifest = createTestManifest(roots, 1);

      // Mock crypto operations
      vi.spyOn(global.crypto.subtle, 'verify').mockResolvedValue(false);
      vi.spyOn(global.crypto.subtle, 'importKey').mockResolvedValue({} as CryptoKey);

      const issuers = [{
        rootId: 'root1',
        pubB64u: testKeys.root1.publicKey,
        sigB64u: 'invalid-signature',
        signedAt: Date.now()
      }];

      const validation = await TrustEngine.validateTrustManifest(manifest, issuers);

      expect(validation.valid).toBe(false);
      expect(validation.signaturesValid).toBe(false);
      expect(validation.errors).toContain('Invalid signature from root: root1');
    });

    it('should validate manifest chain integrity', async () => {
      const roots = [createTestRoot('root1', testKeys.root1.publicKey)];
      const previousManifest = createTestManifest(roots, 1);
      
      // Mock hash generation
      const mockHash = 'mock-hash-value';
      vi.spyOn(global.crypto.subtle, 'digest').mockResolvedValue(
        new TextEncoder().encode(mockHash).buffer
      );

      const newManifest = createTestManifest(roots, 1, 'wrong-hash');

      const validation = await TrustEngine.validateTrustManifest(
        newManifest,
        [],
        previousManifest
      );

      expect(validation.valid).toBe(false);
      expect(validation.chainValid).toBe(false);
      expect(validation.errors).toContain('Manifest chain integrity violation');
    });
  });

  describe('Trust Operations', () => {
    it('should create trust operation with proper structure', async () => {
      // Setup existing trust state
      const existingState = {
        currentManifest: createTestManifest([createTestRoot('root1', testKeys.root1.publicKey)], 1),
        pendingOperations: [],
        operationHistory: [],
        lastUpdated: Date.now()
      };
      mockStorage.getItem = vi.fn().mockResolvedValue(JSON.stringify(existingState));

      const newManifest = createTestManifest([
        createTestRoot('root1', testKeys.root1.publicKey),
        createTestRoot('root2', testKeys.root2.publicKey)
      ], 2);

      const operation = await TrustEngine.createTrustOperation(
        'TRUST_ROOT_ADD',
        newManifest,
        'Adding second trust root'
      );

      expect(operation.type).toBe('TRUST_ROOT_ADD');
      expect(operation.targetManifest).toEqual(newManifest);
      expect(operation.reason).toBe('Adding second trust root');
      expect(operation.issuers).toHaveLength(0);
      expect(operation.namespace).toBe('test-workspace');
    });

    it('should add signatures to pending operations', async () => {
      const manifest = createTestManifest([createTestRoot('root1', testKeys.root1.publicKey)], 1);
      const operation = {
        id: 'test-op',
        type: 'TRUST_ROOT_ADD' as const,
        namespace: 'test-workspace',
        targetManifest: manifest,
        issuers: [],
        createdAt: Date.now()
      };

      const existingState = {
        currentManifest: manifest,
        pendingOperations: [operation],
        operationHistory: [],
        lastUpdated: Date.now()
      };
      mockStorage.getItem = vi.fn().mockResolvedValue(JSON.stringify(existingState));

      // Mock crypto operations
      vi.spyOn(global.crypto.subtle, 'verify').mockResolvedValue(true);
      vi.spyOn(global.crypto.subtle, 'importKey').mockResolvedValue({} as CryptoKey);

      const issuer = {
        rootId: 'root1',
        pubB64u: testKeys.root1.publicKey,
        sigB64u: 'valid-signature',
        signedAt: Date.now()
      };

      const result = await TrustEngine.signTrustOperation('test-op', issuer);

      expect(result).toBe(true);
      expect(mockStorage.setItem).toHaveBeenCalled();
    });

    it('should reject invalid signatures', async () => {
      const manifest = createTestManifest([createTestRoot('root1', testKeys.root1.publicKey)], 1);
      const operation = {
        id: 'test-op',
        type: 'TRUST_ROOT_ADD' as const,
        namespace: 'test-workspace',
        targetManifest: manifest,
        issuers: [],
        createdAt: Date.now()
      };

      const existingState = {
        currentManifest: manifest,
        pendingOperations: [operation],
        operationHistory: [],
        lastUpdated: Date.now()
      };
      mockStorage.getItem = vi.fn().mockResolvedValue(JSON.stringify(existingState));

      // Mock crypto operations
      vi.spyOn(global.crypto.subtle, 'verify').mockResolvedValue(false);
      vi.spyOn(global.crypto.subtle, 'importKey').mockResolvedValue({} as CryptoKey);

      const issuer = {
        rootId: 'root1',
        pubB64u: testKeys.root1.publicKey,
        sigB64u: 'invalid-signature',
        signedAt: Date.now()
      };

      const result = await TrustEngine.signTrustOperation('test-op', issuer);

      expect(result).toBe(false);
    });
  });

  describe('Trust Queries', () => {
    it('should return active trust roots excluding expired ones', async () => {
      const now = Date.now();
      const roots = [
        { ...createTestRoot('root1', testKeys.root1.publicKey), expiresAt: now + 1000 }, // Active
        { ...createTestRoot('root2', testKeys.root2.publicKey), expiresAt: now - 1000 }, // Expired
        createTestRoot('root3', testKeys.root3.publicKey) // No expiration
      ];

      const state = {
        currentManifest: createTestManifest(roots, 2),
        pendingOperations: [],
        operationHistory: [],
        lastUpdated: now
      };
      mockStorage.getItem = vi.fn().mockResolvedValue(JSON.stringify(state));

      const activeRoots = await TrustEngine.getActiveTrustRoots();

      expect(activeRoots).toHaveLength(2);
      expect(activeRoots.map(r => r.id)).toEqual(['root1', 'root3']);
    });

    it('should verify if public key is trusted', async () => {
      const roots = [
        createTestRoot('root1', testKeys.root1.publicKey),
        createTestRoot('root2', testKeys.root2.publicKey)
      ];

      const state = {
        currentManifest: createTestManifest(roots, 2),
        pendingOperations: [],
        operationHistory: [],
        lastUpdated: Date.now()
      };
      mockStorage.getItem = vi.fn().mockResolvedValue(JSON.stringify(state));

      const isTrusted1 = await TrustEngine.isTrustedKey(testKeys.root1.publicKey);
      const isTrusted3 = await TrustEngine.isTrustedKey(testKeys.root3.publicKey);

      expect(isTrusted1).toBe(true);
      expect(isTrusted3).toBe(false);
    });
  });

  describe('Legacy Migration', () => {
    it('should migrate from trustedAdmins array with valid signatures', async () => {
      const legacyAdmins = [testKeys.root1.publicKey, testKeys.root2.publicKey];
      
      // Mock crypto operations
      vi.spyOn(global.crypto.subtle, 'verify').mockResolvedValue(true);
      vi.spyOn(global.crypto.subtle, 'importKey').mockResolvedValue({} as CryptoKey);

      const migrationSignatures = [
        {
          rootId: 'legacy-0',
          pubB64u: testKeys.root1.publicKey,
          sigB64u: 'sig1',
          signedAt: Date.now()
        },
        {
          rootId: 'legacy-1',
          pubB64u: testKeys.root2.publicKey,
          sigB64u: 'sig2',
          signedAt: Date.now()
        }
      ];

      const migration = await TrustEngine.migrateLegacyTrust(legacyAdmins, migrationSignatures);

      expect(migration.fromAdmins).toEqual(legacyAdmins);
      expect(migration.toManifest.roots).toHaveLength(2);
      expect(migration.toManifest.threshold).toBe(1); // Majority of 2
      expect(migration.completedAt).toBeDefined();
    });

    it('should reject migration with insufficient signatures', async () => {
      const legacyAdmins = [testKeys.root1.publicKey, testKeys.root2.publicKey, testKeys.root3.publicKey];
      
      // Mock crypto operations
      vi.spyOn(global.crypto.subtle, 'verify').mockResolvedValue(true);
      vi.spyOn(global.crypto.subtle, 'importKey').mockResolvedValue({} as CryptoKey);

      const migrationSignatures = [
        {
          rootId: 'legacy-0',
          pubB64u: testKeys.root1.publicKey,
          sigB64u: 'sig1',
          signedAt: Date.now()
        }
      ]; // Only 1 signature for 3 admins (need majority = 2)

      const migration = await TrustEngine.migrateLegacyTrust(legacyAdmins, migrationSignatures);

      expect(migration.completedAt).toBeUndefined(); // Migration not completed
    });
  });

  describe('Error Handling', () => {
    it('should handle storage failures gracefully', async () => {
      mockStorage.getItem = vi.fn().mockRejectedValue(new Error('Storage error'));

      const state = await TrustEngine.getTrustState();
      expect(state).toBeNull();
    });

    it('should handle missing trust system for operations', async () => {
      mockStorage.getItem = vi.fn().mockResolvedValue(null);

      const manifest = createTestManifest([createTestRoot('root1', testKeys.root1.publicKey)], 1);

      await expect(
        TrustEngine.createTrustOperation('TRUST_ROOT_ADD', manifest)
      ).rejects.toThrow('Trust system not initialized');
    });

    it('should handle malformed stored state', async () => {
      mockStorage.getItem = vi.fn().mockResolvedValue('invalid-json');

      const state = await TrustEngine.getTrustState();
      expect(state).toBeNull();
    });
  });
});
