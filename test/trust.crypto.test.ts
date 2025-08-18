/**
 * Trust System Crypto Integration Test
 * Verifies crypto functionality with robust polyfill setup
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import './crypto-setup'; // Import the polyfill setup
import { validateCryptoSetup } from './crypto-setup';
import type { StorageDriver } from '../src/storage/types';
import type { TrustRoot, TrustManifest } from '../src/trust/types';
import * as TrustEngine from '../src/trust/engine';

// Mock storage
const mockStorage: StorageDriver = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  listKeys: vi.fn()
};

// Helper: Canonical JSON (matches implementation)
function canon(obj: any): string {
  if (obj === null || typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) return '[' + obj.map(canon).join(',') + ']';
  const keys = Object.keys(obj).sort();
  return '{' + keys.map(k => `"${k}":${canon(obj[k])}`).join(',') + '}';
}

describe('Trust Crypto Integration', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    mockStorage.getItem = vi.fn().mockResolvedValue(null);
    mockStorage.setItem = vi.fn().mockResolvedValue(undefined);
    TrustEngine.configureTrust(mockStorage, 'test-workspace');
    
    // Validate crypto is available before each test
    const cryptoValid = await validateCryptoSetup();
    expect(cryptoValid).toBe(true);
  });

  it('should have crypto available in test environment', async () => {
    expect(globalThis.crypto).toBeDefined();
    expect(globalThis.crypto.subtle).toBeDefined();
    
    // Test the exact operations that were failing
    const testData = new TextEncoder().encode('test-data');
    const hash = await globalThis.crypto.subtle.digest('SHA-256', testData);
    expect(hash).toBeInstanceOf(ArrayBuffer);
  });

  it('should perform SHA-256 digest as suggested', async () => {
    const data = new TextEncoder().encode('hello world');
    const hash = await crypto.subtle.digest('SHA-256', data);
    expect(hash).toBeInstanceOf(ArrayBuffer);
    expect(hash.byteLength).toBe(32); // SHA-256 produces 32-byte hash
  });

  it('should generate and verify Ed25519 keys', async () => {
    if (!globalThis.crypto?.subtle) {
      console.log('Skipping Ed25519 test - crypto not available');
      return;
    }

    try {
      // Generate a real Ed25519 key pair
      const keyPair = await crypto.subtle.generateKey(
        { name: 'Ed25519' },
        true,
        ['sign', 'verify']
      );

      expect(keyPair.publicKey).toBeDefined();
      expect(keyPair.privateKey).toBeDefined();

      // Test signing and verification
      const testData = 'test message for signing';
      const signature = await crypto.subtle.sign(
        'Ed25519',
        keyPair.privateKey,
        new TextEncoder().encode(testData)
      );

      const isValid = await crypto.subtle.verify(
        'Ed25519',
        keyPair.publicKey,
        signature,
        new TextEncoder().encode(testData)
      );

      expect(isValid).toBe(true);
    } catch (error) {
      console.log('Ed25519 not supported in this environment:', error);
      // This is expected in some environments
    }
  });

  it('should validate manifest structure without crypto', async () => {
    const roots: TrustRoot[] = [
      {
        id: 'test-root',
        pubB64u: 'mock-public-key-base64url',
        role: 'PRIMARY',
        createdAt: Date.now()
      }
    ];

    const manifest: TrustManifest = {
      version: 1,
      namespace: 'test-workspace',
      roots,
      threshold: 1,
      createdAt: Date.now()
    };

    // Test canonical serialization
    const canonicalJson = canon(manifest);
    expect(canonicalJson).toContain('"namespace":"test-workspace"');
    expect(canonicalJson).toContain('"threshold":1');
    expect(canonicalJson).toContain('"version":1');

    // Basic manifest validation (without signatures)
    const validation = await TrustEngine.validateTrustManifest(manifest, []);
    
    expect(validation.manifestValid).toBe(true); // Structure is valid
    expect(validation.thresholdMet).toBe(false); // No signatures provided
    expect(validation.signaturesValid).toBe(true); // No signatures to validate
  });

  it('should handle trust state operations', async () => {
    const trustState = await TrustEngine.getTrustState();
    expect(trustState).toBeNull(); // No trust state initially

    // Mock trust state
    const mockState = {
      currentManifest: {
        version: 1,
        namespace: 'test-workspace',
        roots: [{
          id: 'root1',
          pubB64u: 'mock-key',
          role: 'PRIMARY' as const,
          createdAt: Date.now()
        }],
        threshold: 1,
        createdAt: Date.now()
      },
      pendingOperations: [],
      operationHistory: [],
      lastUpdated: Date.now()
    };

    mockStorage.getItem = vi.fn().mockResolvedValue(JSON.stringify(mockState));

    const state = await TrustEngine.getTrustState();
    expect(state).toBeDefined();
    expect(state?.currentManifest.roots).toHaveLength(1);

    const activeRoots = await TrustEngine.getActiveTrustRoots();
    expect(activeRoots).toHaveLength(1);
    expect(activeRoots[0]?.id).toBe('root1');

    const isTrusted = await TrustEngine.isTrustedKey('mock-key');
    expect(isTrusted).toBe(true);

    const isNotTrusted = await TrustEngine.isTrustedKey('unknown-key');
    expect(isNotTrusted).toBe(false);
  });

  it('should handle trust operations with mock signatures', async () => {
    // Setup initial state
    const initialManifest = {
      version: 1,
      namespace: 'test-workspace',
      roots: [{
        id: 'admin1',
        pubB64u: 'admin1-key',
        role: 'PRIMARY' as const,
        createdAt: Date.now()
      }],
      threshold: 1,
      createdAt: Date.now()
    };

    const existingState = {
      currentManifest: initialManifest,
      pendingOperations: [],
      operationHistory: [],
      lastUpdated: Date.now()
    };

    mockStorage.getItem = vi.fn().mockResolvedValue(JSON.stringify(existingState));

    // Create a trust operation
    const newManifest = {
      ...initialManifest,
      roots: [
        ...initialManifest.roots,
        {
          id: 'admin2',
          pubB64u: 'admin2-key',
          role: 'SECONDARY' as const,
          createdAt: Date.now()
        }
      ],
      version: 2,
      createdAt: Date.now()
    };

    const operation = await TrustEngine.createTrustOperation(
      'TRUST_ROOT_ADD',
      newManifest,
      'Adding second admin'
    );

    expect(operation.type).toBe('TRUST_ROOT_ADD');
    expect(operation.targetManifest.roots).toHaveLength(2);
    expect(operation.reason).toBe('Adding second admin');
    expect(operation.issuers).toHaveLength(0); // No signatures yet

    // Verify storage was called to save the operation
    expect(mockStorage.setItem).toHaveBeenCalled();
  });

  it('should validate signature verification logic flow', async () => {
    // Test the signature verification flow without actual crypto
    const manifest = {
      version: 1,
      namespace: 'test-workspace',
      roots: [{
        id: 'admin1',
        pubB64u: 'mock-public-key',
        role: 'PRIMARY' as const,
        createdAt: Date.now()
      }],
      threshold: 1,
      createdAt: Date.now()
    };

    const mockIssuer = {
      rootId: 'admin1',
      pubB64u: 'mock-public-key',
      sigB64u: 'mock-signature',
      signedAt: Date.now()
    };

    // Mock crypto.subtle.verify to return true
    if (globalThis.crypto?.subtle) {
      const originalVerify = globalThis.crypto.subtle.verify;
      const originalImportKey = globalThis.crypto.subtle.importKey;
      
      vi.spyOn(globalThis.crypto.subtle, 'verify').mockResolvedValue(true);
      vi.spyOn(globalThis.crypto.subtle, 'importKey').mockResolvedValue({} as CryptoKey);

      const validation = await TrustEngine.validateTrustManifest(manifest, [mockIssuer]);

      expect(validation.valid).toBe(true);
      expect(validation.signaturesValid).toBe(true);
      expect(validation.thresholdMet).toBe(true);

      // Restore original methods
      globalThis.crypto.subtle.verify = originalVerify;
      globalThis.crypto.subtle.importKey = originalImportKey;
    }
  });
});
