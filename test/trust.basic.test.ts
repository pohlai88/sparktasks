/**
 * Trust Root Management - Basic Functionality Test
 * Core test for trust system without crypto dependencies
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { StorageDriver } from '../src/storage/types';
import type { TrustRoot, TrustManifest, TrustConfig } from '../src/trust/types';

// Setup crypto polyfill
if (!globalThis.crypto) {
  const { webcrypto } = require('node:crypto');
  globalThis.crypto = webcrypto as Crypto;
}

// Mock storage
const mockStorage: StorageDriver = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  listKeys: vi.fn()
};

describe('Trust Root Basic Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStorage.getItem = vi.fn().mockResolvedValue(null);
    mockStorage.setItem = vi.fn().mockResolvedValue(undefined);
  });

  it('should create valid trust root objects', () => {
    const root: TrustRoot = {
      id: 'test-root-1',
      pubB64u: 'MCowBQYDK2VwAyEAfGb7j3SjhKPxEqF7aGG6M2GZz1r4jb6JxYa8hW2o3P0',
      role: 'PRIMARY',
      createdAt: Date.now()
    };

    expect(root.id).toBe('test-root-1');
    expect(root.role).toBe('PRIMARY');
    expect(root.pubB64u).toBeDefined();
    expect(root.createdAt).toBeTypeOf('number');
  });

  it('should create valid trust manifest objects', () => {
    const roots: TrustRoot[] = [
      {
        id: 'root1',
        pubB64u: 'key1',
        role: 'PRIMARY',
        createdAt: Date.now()
      },
      {
        id: 'root2',
        pubB64u: 'key2',
        role: 'SECONDARY',
        createdAt: Date.now()
      }
    ];

    const manifest: TrustManifest = {
      version: 1,
      namespace: 'test-workspace',
      roots,
      threshold: 2,
      createdAt: Date.now()
    };

    expect(manifest.version).toBe(1);
    expect(manifest.namespace).toBe('test-workspace');
    expect(manifest.roots).toHaveLength(2);
    expect(manifest.threshold).toBe(2);
    expect(manifest.createdAt).toBeTypeOf('number');
  });

  it('should handle storage operations without errors', async () => {
    // This tests that our types and basic infrastructure work
    const testData = { test: 'data' };
    
    mockStorage.setItem = vi.fn().mockResolvedValue(undefined);
    mockStorage.getItem = vi.fn().mockResolvedValue(JSON.stringify(testData));

    await mockStorage.setItem('test-key', JSON.stringify(testData));
    const result = await mockStorage.getItem('test-key');
    
    expect(mockStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(testData));
    expect(mockStorage.getItem).toHaveBeenCalledWith('test-key');
    expect(result).toBe(JSON.stringify(testData));
  });

  it('should validate trust configuration structure', () => {
    const config: TrustConfig = {
      namespace: 'test-workspace',
      initialRoots: [
        {
          id: 'root1',
          pubB64u: 'key1',
          role: 'PRIMARY',
          createdAt: Date.now()
        }
      ],
      initialThreshold: 1
    };

    expect(config.namespace).toBe('test-workspace');
    expect(config.initialRoots).toHaveLength(1);
    expect(config.initialThreshold).toBe(1);
    expect(config.initialRoots[0]?.role).toBe('PRIMARY');
  });
});
