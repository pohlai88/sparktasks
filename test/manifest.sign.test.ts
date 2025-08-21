import { describe, it, expect, beforeEach } from 'vitest';
import { webcrypto } from 'node:crypto';

// Setup WebCrypto for Node.js
if (!globalThis.crypto) {
  Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto,
    writable: false,
    configurable: false,
  });
}
if (!globalThis.crypto.subtle) {
  Object.defineProperty(globalThis.crypto, 'subtle', {
    value: webcrypto.subtle,
    writable: false,
    configurable: false,
  });
}
if (!globalThis.crypto.getRandomValues) {
  Object.defineProperty(globalThis.crypto, 'getRandomValues', {
    value: webcrypto.getRandomValues.bind(webcrypto),
    writable: false,
    configurable: false,
  });
}

import { generateKeyPair } from '../src/crypto/ed25519';
import { createManifest, verifyManifest } from '../src/domain/pack/manifest';
import { Sparkpack } from '../src/domain/pack/types';

describe('Manifest Signing', () => {
  let keyPair: { publicKey: CryptoKey; privateKey: CryptoKey };
  let mockPack: Sparkpack;

  beforeEach(async () => {
    keyPair = await generateKeyPair();
    mockPack = {
      meta: {
        version: 1,
        format: 'sparkpack/1+json' as const,
        createdAt: '2025-08-16T00:00:00.000Z',
        eventsCount: 2,
        eventsHash: 'abcd1234',
      },
      events: [
        {
          type: 'TASK_CREATED',
          timestamp: '2025-08-16T00:00:00.000Z',
          payload: {
            id: 'task-1',
            title: 'Test Task',
            status: 'TODAY' as const,
            priority: 'P1' as const,
            tags: [],
          },
        },
        {
          type: 'TASK_COMPLETED',
          timestamp: '2025-08-16T01:00:00.000Z',
          payload: {
            id: 'task-1',
          },
        },
      ],
    };
  });

  it('should create manifest and verify signature', async () => {
    // Create signed manifest
    const manifest = await createManifest(
      mockPack,
      keyPair.privateKey,
      keyPair.publicKey
    );

    expect(manifest.v).toBe(1);
    expect(manifest.author.pubkey).toBeTruthy();
    expect(manifest.content.meta).toEqual(mockPack.meta);
    expect(manifest.content.eventsHash).toBeTruthy();
    expect(manifest.content.bytes).toBeGreaterThan(0);
    expect(manifest.sig).toBeTruthy();

    // Verify signature
    const isValid = await verifyManifest(manifest, mockPack);
    expect(isValid).toBe(true);
  });

  it('should fail verification with tampered content', async () => {
    // Create valid manifest
    const manifest = await createManifest(
      mockPack,
      keyPair.privateKey,
      keyPair.publicKey
    );

    // Tamper with pack events
    const tamperedPack = {
      ...mockPack,
      events: [
        ...mockPack.events,
        {
          type: 'TASK_DELETED' as any,
          timestamp: '2025-08-16T02:00:00.000Z',
          payload: { id: 'task-1' },
        },
      ],
    };

    // Verification should fail
    const isValid = await verifyManifest(manifest, tamperedPack);
    expect(isValid).toBe(false);
  });

  it('should fail verification with wrong public key', async () => {
    // Create manifest with one key
    const manifest = await createManifest(mockPack, keyPair.privateKey);

    // Generate different key pair
    const otherKeyPair = await generateKeyPair();

    // Manually create manifest with wrong public key
    const { exportPublicKeyB64u } = await import('../src/crypto/ed25519');
    const wrongPubkey = await exportPublicKeyB64u(otherKeyPair.publicKey);

    const tamperedManifest = {
      ...manifest,
      author: { pubkey: wrongPubkey },
    };

    // Verification should fail
    const isValid = await verifyManifest(tamperedManifest, mockPack);
    expect(isValid).toBe(false);
  });
});
