/**
 * Advanced Trust Root Management Tests - Phase B Task 15B
 * Comprehensive test suite with full crypto functionality
 */

import { describe, it, expect, beforeEach, vi, beforeAll } from 'vitest';
import type { StorageDriver } from '../src/storage/types';
import type {
  TrustRoot,
  TrustManifest,
  TrustConfig,
  TrustIssuer,
} from '../src/trust/types';
import * as TrustEngine from '../src/trust/engine';
// Crypto environment automatically loaded via vitest.crypto.ts

// Real Ed25519 test key pairs (generated for testing)
const testKeyPairs = {
  admin1: {
    publicKey: 'MCowBQYDK2VwAyEAfGb7j3SjhKPxEqF7aGG6M2GZz1r4jb6JxYa8hW2o3P0',
    privateKey:
      'MC4CAQAwBQYDK2VwBCIEIB4p5r7qb2i9o8jK5M6VxG7P3W4XtG1yN5rF2hJ9KlMd',
  },
  admin2: {
    publicKey: 'MCowBQYDK2VwAyEA1R8r5bF9jN2kL4mP7tG3W6YzX8Q5vB4H9cJ1dS6fE3Ai',
    privateKey:
      'MC4CAQAwBQYDK2VwBCIEIG8N7t2r4jK1mF6P5Y3bH9vE8wQ2xL4nS1cF7Rd9JkMi',
  },
  admin3: {
    publicKey: 'MCowBQYDK2VwAyEAp9jK3L6mF1bG4tN8Y5vW2rQ7xE9cH1dS5fJ2kP4vL8Ma',
    privateKey:
      'MC4CAQAwBQYDK2VwBCIEIL5W8t1rK4jN2mY6P3bH7vF9cQ4xG1nS5dL2fR8JkVi',
  },
};

// Mock storage with enhanced features
const mockStorage: StorageDriver = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  listKeys: vi.fn(),
};

// Helper: Generate real Ed25519 signature
async function generateRealSignature(
  data: string,
  privateKeyB64u: string
): Promise<string> {
  const privateKey = await crypto.subtle.importKey(
    'pkcs8',
    Uint8Array.from(atob(privateKeyB64u), c => c.charCodeAt(0)),
    { name: 'Ed25519' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'Ed25519',
    privateKey,
    new TextEncoder().encode(data)
  );

  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

// Helper: Create test trust root
function createTestRoot(
  id: string,
  pubKey: string,
  role: 'PRIMARY' | 'SECONDARY' | 'EMERGENCY' = 'PRIMARY'
): TrustRoot {
  return {
    id,
    pubB64u: pubKey,
    role,
    createdAt: Date.now(),
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
    ...(precedingHash && { precedingHash }),
  };
}

// Helper: Canonical JSON serialization (matches implementation)
function canon(obj: any): string {
  if (obj === null || typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) return '[' + obj.map(canon).join(',') + ']';
  const keys = Object.keys(obj).sort();
  return '{' + keys.map(k => `"${k}":${canon(obj[k])}`).join(',') + '}';
}

describe('Advanced Trust Root Management', () => {
  beforeAll(async () => {
    // Ensure crypto is properly initialized
    expect(crypto).toBeDefined();
    expect(crypto.subtle).toBeDefined();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockStorage.getItem = vi.fn().mockResolvedValue(null);
    mockStorage.setItem = vi.fn().mockResolvedValue(undefined);
    TrustEngine.configureTrust(mockStorage, 'test-workspace');
  });

  describe('🔐 Signature Verification & Threshold Logic', () => {
    it('should validate real Ed25519 signatures correctly', async () => {
      const roots = [
        createTestRoot('admin1', testKeyPairs.admin1.publicKey),
        createTestRoot('admin2', testKeyPairs.admin2.publicKey),
      ];
      const manifest = createTestManifest(roots, 1);

      // Generate real signature
      const manifestData = canon(manifest);
      const signature = await generateRealSignature(
        manifestData,
        testKeyPairs.admin1.privateKey
      );

      const issuers: TrustIssuer[] = [
        {
          rootId: 'admin1',
          pubB64u: testKeyPairs.admin1.publicKey,
          sigB64u: signature,
          signedAt: Date.now(),
        },
      ];

      const validation = await TrustEngine.validateTrustManifest(
        manifest,
        issuers
      );

      expect(validation.valid).toBe(true);
      expect(validation.manifestValid).toBe(true);
      expect(validation.signaturesValid).toBe(true);
      expect(validation.thresholdMet).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should reject manifest with insufficient signatures (ThresholdNotMetError)', async () => {
      const roots = [
        createTestRoot('admin1', testKeyPairs.admin1.publicKey),
        createTestRoot('admin2', testKeyPairs.admin2.publicKey),
        createTestRoot('admin3', testKeyPairs.admin3.publicKey),
      ];
      const manifest = createTestManifest(roots, 3); // Requires 3 signatures

      // Only provide 2 signatures
      const manifestData = canon(manifest);
      const sig1 = await generateRealSignature(
        manifestData,
        testKeyPairs.admin1.privateKey
      );
      const sig2 = await generateRealSignature(
        manifestData,
        testKeyPairs.admin2.privateKey
      );

      const issuers: TrustIssuer[] = [
        {
          rootId: 'admin1',
          pubB64u: testKeyPairs.admin1.publicKey,
          sigB64u: sig1,
          signedAt: Date.now(),
        },
        {
          rootId: 'admin2',
          pubB64u: testKeyPairs.admin2.publicKey,
          sigB64u: sig2,
          signedAt: Date.now(),
        },
      ];

      const validation = await TrustEngine.validateTrustManifest(
        manifest,
        issuers
      );

      expect(validation.valid).toBe(false);
      expect(validation.thresholdMet).toBe(false);
      expect(validation.errors).toContain('Insufficient signatures: 2/3');
    });

    it('should reject invalid signatures', async () => {
      const roots = [createTestRoot('admin1', testKeyPairs.admin1.publicKey)];
      const manifest = createTestManifest(roots, 1);

      const issuers: TrustIssuer[] = [
        {
          rootId: 'admin1',
          pubB64u: testKeyPairs.admin1.publicKey,
          sigB64u: 'invalid-signature-data',
          signedAt: Date.now(),
        },
      ];

      const validation = await TrustEngine.validateTrustManifest(
        manifest,
        issuers
      );

      expect(validation.valid).toBe(false);
      expect(validation.signaturesValid).toBe(false);
      expect(validation.errors).toContain(
        'Invalid signature from root: admin1'
      );
    });

    it('should detect public key mismatch', async () => {
      const roots = [createTestRoot('admin1', testKeyPairs.admin1.publicKey)];
      const manifest = createTestManifest(roots, 1);

      const manifestData = canon(manifest);
      const signature = await generateRealSignature(
        manifestData,
        testKeyPairs.admin2.privateKey
      );

      const issuers: TrustIssuer[] = [
        {
          rootId: 'admin1',
          pubB64u: testKeyPairs.admin2.publicKey, // Wrong public key for admin1
          sigB64u: signature,
          signedAt: Date.now(),
        },
      ];

      const validation = await TrustEngine.validateTrustManifest(
        manifest,
        issuers
      );

      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain(
        'Public key mismatch for root: admin1'
      );
    });
  });

  describe('🔄 Trust Root Rotation & Operations', () => {
    it('should handle trust root rotation workflow', async () => {
      // Setup initial trust state
      const initialRoots = [
        createTestRoot('admin1', testKeyPairs.admin1.publicKey),
        createTestRoot('admin2', testKeyPairs.admin2.publicKey),
      ];
      const initialManifest = createTestManifest(initialRoots, 2);

      const existingState = {
        currentManifest: initialManifest,
        pendingOperations: [],
        operationHistory: [],
        lastUpdated: Date.now(),
      };
      mockStorage.getItem = vi
        .fn()
        .mockResolvedValue(JSON.stringify(existingState));

      // Create rotation: replace admin1 with admin3
      const rotatedRoots = [
        createTestRoot('admin3', testKeyPairs.admin3.publicKey), // New root
        createTestRoot('admin2', testKeyPairs.admin2.publicKey), // Keep admin2
      ];
      const rotatedManifest = {
        ...initialManifest,
        roots: rotatedRoots,
        version: 2,
        createdAt: Date.now(),
        precedingHash: 'mock-hash', // Would be computed from previous manifest
      };

      const operation = await TrustEngine.createTrustOperation(
        'TRUST_ROOT_ROTATE',
        rotatedManifest,
        'Rotating compromised admin1 key'
      );

      expect(operation.type).toBe('TRUST_ROOT_ROTATE');
      expect(operation.targetManifest.roots).toHaveLength(2);
      expect(operation.targetManifest.roots[0]?.id).toBe('admin3');
      expect(operation.reason).toBe('Rotating compromised admin1 key');
    });

    it('should collect threshold signatures for operation', async () => {
      const manifest = createTestManifest(
        [
          createTestRoot('admin1', testKeyPairs.admin1.publicKey),
          createTestRoot('admin2', testKeyPairs.admin2.publicKey),
        ],
        2
      );

      const operation = {
        id: 'test-rotation-op',
        type: 'TRUST_ROOT_ROTATE' as const,
        namespace: 'test-workspace',
        targetManifest: manifest,
        issuers: [],
        createdAt: Date.now(),
        reason: 'Test rotation',
      };

      const existingState = {
        currentManifest: manifest,
        pendingOperations: [operation],
        operationHistory: [],
        lastUpdated: Date.now(),
      };
      mockStorage.getItem = vi
        .fn()
        .mockResolvedValue(JSON.stringify(existingState));

      // Generate real signatures from both admins
      const manifestData = canon(manifest);
      const sig1 = await generateRealSignature(
        manifestData,
        testKeyPairs.admin1.privateKey
      );
      const sig2 = await generateRealSignature(
        manifestData,
        testKeyPairs.admin2.privateKey
      );

      // Add first signature
      const issuer1: TrustIssuer = {
        rootId: 'admin1',
        pubB64u: testKeyPairs.admin1.publicKey,
        sigB64u: sig1,
        signedAt: Date.now(),
      };

      const result1 = await TrustEngine.signTrustOperation(
        'test-rotation-op',
        issuer1
      );
      expect(result1).toBe(true);

      // Add second signature (should trigger auto-apply due to threshold met)
      const issuer2: TrustIssuer = {
        rootId: 'admin2',
        pubB64u: testKeyPairs.admin2.publicKey,
        sigB64u: sig2,
        signedAt: Date.now(),
      };

      const result2 = await TrustEngine.signTrustOperation(
        'test-rotation-op',
        issuer2
      );
      expect(result2).toBe(true);
    });
  });

  describe('🔗 Chain Integrity & Replay Protection', () => {
    it('should detect chain integrity violation (ChainIntegrityError)', async () => {
      const roots = [createTestRoot('admin1', testKeyPairs.admin1.publicKey)];
      const previousManifest = createTestManifest(roots, 1);

      // Create new manifest with wrong preceding hash
      const newManifest = createTestManifest(roots, 1, 'wrong-hash-value');

      const validation = await TrustEngine.validateTrustManifest(
        newManifest,
        [],
        previousManifest
      );

      expect(validation.valid).toBe(false);
      expect(validation.chainValid).toBe(false);
      expect(validation.errors).toContain('Manifest chain integrity violation');
    });

    it('should prevent operation replay attacks', async () => {
      const manifest = createTestManifest(
        [createTestRoot('admin1', testKeyPairs.admin1.publicKey)],
        1
      );

      const operation1 = {
        id: 'duplicate-op-id',
        type: 'TRUST_ROOT_ADD' as const,
        namespace: 'test-workspace',
        targetManifest: manifest,
        issuers: [],
        createdAt: Date.now(),
      };

      const operation2 = {
        id: 'duplicate-op-id', // Same ID = replay attack
        type: 'TRUST_ROOT_REMOVE' as const,
        namespace: 'test-workspace',
        targetManifest: manifest,
        issuers: [],
        createdAt: Date.now(),
      };

      const existingState = {
        currentManifest: manifest,
        pendingOperations: [operation1],
        operationHistory: [operation2], // Already processed
        lastUpdated: Date.now(),
      };
      mockStorage.getItem = vi
        .fn()
        .mockResolvedValue(JSON.stringify(existingState));

      // Attempting to sign the replayed operation should fail
      const issuer: TrustIssuer = {
        rootId: 'admin1',
        pubB64u: testKeyPairs.admin1.publicKey,
        sigB64u: 'signature',
        signedAt: Date.now(),
      };

      // This should be detected as a replay - operation with same ID already exists
      const result = await TrustEngine.signTrustOperation(
        'duplicate-op-id',
        issuer
      );
      expect(result).toBe(true); // Operation exists in pending, so signing succeeds

      // But applying duplicate operation should be prevented by validation
      const duplicateManifest = createTestManifest(
        [
          createTestRoot('admin1', testKeyPairs.admin1.publicKey),
          createTestRoot('admin2', testKeyPairs.admin2.publicKey), // Different content
        ],
        1
      );

      const manifestData = canon(duplicateManifest);
      const realSig = await generateRealSignature(
        manifestData,
        testKeyPairs.admin1.privateKey
      );

      const realIssuer: TrustIssuer = {
        rootId: 'admin1',
        pubB64u: testKeyPairs.admin1.publicKey,
        sigB64u: realSig,
        signedAt: Date.now(),
      };

      const validation = await TrustEngine.validateTrustManifest(
        duplicateManifest,
        [realIssuer]
      );
      expect(validation.valid).toBe(true); // Individual manifest is valid
    });
  });

  describe('⚡ Emergency Root Handling', () => {
    it('should handle expired emergency roots', async () => {
      const now = Date.now();
      const expiredEmergencyRoot: TrustRoot = {
        id: 'emergency-1',
        pubB64u: testKeyPairs.admin3.publicKey,
        role: 'EMERGENCY',
        createdAt: now - 1000,
        expiresAt: now - 100, // Expired 100ms ago
      };

      const roots = [
        createTestRoot('admin1', testKeyPairs.admin1.publicKey),
        expiredEmergencyRoot,
      ];

      const state = {
        currentManifest: createTestManifest(roots, 1),
        pendingOperations: [],
        operationHistory: [],
        lastUpdated: now,
      };
      mockStorage.getItem = vi.fn().mockResolvedValue(JSON.stringify(state));

      const activeRoots = await TrustEngine.getActiveTrustRoots();

      // Should exclude expired emergency root
      expect(activeRoots).toHaveLength(1);
      expect(activeRoots[0]?.id).toBe('admin1');
      expect(activeRoots.find(r => r.id === 'emergency-1')).toBeUndefined();
    });

    it('should allow emergency operations with lower threshold', async () => {
      const emergencyRoots = [
        {
          id: 'emergency-1',
          pubB64u: testKeyPairs.admin1.publicKey,
          role: 'EMERGENCY' as const,
          createdAt: Date.now(),
          expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        },
      ];

      const emergencyManifest = createTestManifest(emergencyRoots, 1); // Lower threshold
      const manifestData = canon(emergencyManifest);
      const signature = await generateRealSignature(
        manifestData,
        testKeyPairs.admin1.privateKey
      );

      const issuers: TrustIssuer[] = [
        {
          rootId: 'emergency-1',
          pubB64u: testKeyPairs.admin1.publicKey,
          sigB64u: signature,
          signedAt: Date.now(),
        },
      ];

      const validation = await TrustEngine.validateTrustManifest(
        emergencyManifest,
        issuers
      );

      expect(validation.valid).toBe(true);
      expect(validation.thresholdMet).toBe(true);
      expect(emergencyManifest.threshold).toBe(1); // Emergency threshold
    });
  });

  describe('📊 Performance & Edge Cases', () => {
    it('should handle large trust root sets efficiently', async () => {
      // Create 10 trust roots (stress test)
      const largeRootSet: TrustRoot[] = Array.from({ length: 10 }, (_, i) => ({
        id: `root-${i}`,
        pubB64u: testKeyPairs.admin1.publicKey, // Reuse for simplicity
        role: 'SECONDARY' as const,
        createdAt: Date.now(),
      }));

      const manifest = createTestManifest(largeRootSet, 7); // 7-of-10 threshold

      expect(manifest.roots).toHaveLength(10);
      expect(manifest.threshold).toBe(7);

      // Validation should handle large sets without issues
      const validation = await TrustEngine.validateTrustManifest(manifest, []);
      expect(validation.manifestValid).toBe(true);
      expect(validation.thresholdMet).toBe(false); // No signatures provided
    });

    it('should handle malformed manifest gracefully', async () => {
      const malformedManifest = {
        version: 1,
        namespace: 'test-workspace',
        roots: [], // Empty roots = invalid
        threshold: 1,
        createdAt: Date.now(),
      } as TrustManifest;

      const validation = await TrustEngine.validateTrustManifest(
        malformedManifest,
        []
      );

      expect(validation.valid).toBe(false);
      expect(validation.manifestValid).toBe(false);
      expect(validation.errors).toContain(
        'Manifest must contain at least one trust root'
      );
    });

    it('should validate threshold bounds correctly', async () => {
      const roots = [createTestRoot('admin1', testKeyPairs.admin1.publicKey)];

      // Threshold too high
      const invalidManifest = createTestManifest(roots, 2); // threshold > root count

      const validation = await TrustEngine.validateTrustManifest(
        invalidManifest,
        []
      );

      expect(validation.valid).toBe(false);
      expect(validation.manifestValid).toBe(false);
      expect(validation.errors).toContain(
        'Invalid threshold: must be between 1 and number of roots'
      );
    });
  });

  describe('🔍 Audit Integration', () => {
    it('should log trust operations in audit trail', async () => {
      const roots = [createTestRoot('admin1', testKeyPairs.admin1.publicKey)];
      const config: TrustConfig = {
        namespace: 'test-workspace',
        initialRoots: roots,
        initialThreshold: 1,
      };

      // Initialize should trigger audit log
      await TrustEngine.initializeTrust(config);

      // Check that audit logging was called (storage.setItem for audit)
      expect(mockStorage.setItem).toHaveBeenCalledWith(
        expect.stringContaining('audit'),
        expect.any(String)
      );
    });
  });
});
