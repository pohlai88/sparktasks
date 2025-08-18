import { describe, it, expect, beforeEach } from 'vitest';
import { webcrypto } from 'node:crypto';

// Setup WebCrypto for Node.js
if (!globalThis.crypto) {
  Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto,
    writable: false,
    configurable: false
  });
}
if (!globalThis.crypto.subtle) {
  Object.defineProperty(globalThis.crypto, 'subtle', {
    value: webcrypto.subtle,
    writable: false,
    configurable: false
  });
}
if (!globalThis.crypto.getRandomValues) {
  Object.defineProperty(globalThis.crypto, 'getRandomValues', {
    value: webcrypto.getRandomValues.bind(webcrypto),
    writable: false,
    configurable: false
  });
}

import { generateKeyPair } from '../src/crypto/ed25519';
import { MemoryBYOC, uploadPack, downloadPack } from '../src/remote/byoc';
import { Sparkpack } from '../src/domain/pack/types';

describe('BYOC Upload/Download', () => {
  let byoc: MemoryBYOC;
  let keyPair: { publicKey: CryptoKey; privateKey: CryptoKey };
  let mockPack: Sparkpack;

  beforeEach(async () => {
    byoc = new MemoryBYOC();
    keyPair = await generateKeyPair();
    mockPack = {
      meta: {
        version: 1,
        format: 'sparkpack/1+json' as const,
        createdAt: '2025-08-16T00:00:00.000Z',
        eventsCount: 1,
        eventsHash: 'test-hash-123'
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
            tags: ['test']
          }
        }
      ]
    };
  });

  it('should upload and download pack successfully', async () => {
    // Upload pack
    const { manifest, eventsRef } = await uploadPack(byoc, mockPack, keyPair.privateKey, keyPair.publicKey);
    
    expect(manifest.v).toBe(1);
    expect(manifest.content.meta).toEqual(mockPack.meta);
    expect(eventsRef.url).toContain('memory://');
    
    // Download pack using the manifest's computed hash
    const manifestPath = `packs/${manifest.content.eventsHash}/manifest.json`;
    const downloadedPack = await downloadPack(byoc, manifestPath);
    
    expect(downloadedPack).toBeTruthy();
    expect(downloadedPack!.meta).toEqual(mockPack.meta);
    expect(downloadedPack!.events).toEqual(mockPack.events);
  });

  it('should fail download with tampered data', async () => {
    // Upload pack
    await uploadPack(byoc, mockPack, keyPair.privateKey, keyPair.publicKey);
    
    // Tamper with stored events
    const eventsPath = `packs/${mockPack.meta.eventsHash}/events.jsonl`;
    const tamperedEvents = JSON.stringify({
      type: 'MALICIOUS_EVENT',
      timestamp: '2025-08-16T00:00:00.000Z',
      payload: { evil: true }
    });
    await byoc.putBlob(eventsPath, new TextEncoder().encode(tamperedEvents).buffer);
    
    // Download should fail verification
    const manifestPath = `packs/${mockPack.meta.eventsHash}/manifest.json`;
    const downloadedPack = await downloadPack(byoc, manifestPath);
    
    expect(downloadedPack).toBeNull();
  });

  it('should handle missing manifest gracefully', async () => {
    const downloadedPack = await downloadPack(byoc, 'nonexistent/manifest.json');
    expect(downloadedPack).toBeNull();
  });

  it('should handle missing events gracefully', async () => {
    // Upload just manifest, but delete events
    await uploadPack(byoc, mockPack, keyPair.privateKey, keyPair.publicKey);
    
    // Delete events file
    const eventsPath = `packs/${mockPack.meta.eventsHash}/events.jsonl`;
    await byoc.putBlob(eventsPath, new ArrayBuffer(0)); // Empty file
    
    const manifestPath = `packs/${mockPack.meta.eventsHash}/manifest.json`;
    const downloadedPack = await downloadPack(byoc, manifestPath);
    
    // Should fail due to hash mismatch
    expect(downloadedPack).toBeNull();
  });
});
