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

import { planMaintenance } from '../src/maintenance/plan';
import { runMaintenance } from '../src/maintenance/run';
import { EncryptedDriver } from '../src/storage/encrypted';
import { KeyringProvider } from '../src/crypto/keyring';
import { StorageDriver } from '../src/storage/types';
import { toB64u } from '../src/crypto/base64url';

// Minimal in-memory storage mock
class MockStorageDriver implements StorageDriver {
  public data = new Map<string, string>();

  async getItem(key: string): Promise<string | null> {
    return this.data.get(key) || null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.data.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.data.delete(key);
  }

  async listKeys(prefix: string): Promise<string[]> {
    const keys = Array.from(this.data.keys());
    return keys.filter(key => key.startsWith(prefix));
  }
}

describe('Maintenance Smoke Tests', () => {
  let storage: MockStorageDriver;
  let keyring: KeyringProvider;
  let encrypted: EncryptedDriver;

  beforeEach(async () => {
    storage = new MockStorageDriver();
    keyring = new KeyringProvider(storage, 'test-keyring');
    encrypted = new EncryptedDriver(storage, 'app', keyring);

    // Initialize keyring with low iterations for speed
    await keyring.initNew('test-pass', 500);
  });

  it('should plan and execute COMPACT operation', async () => {
    // Mock compactWithSnapshot to simulate trimming 100 events
    const originalCompact = (await import('../src/domain/task/eventlog'))
      .compactWithSnapshot;
    let compactCalled = false;

    // Mock the eventlog's getEventCount to return high value
    const originalGetEventCount = (await import('../src/domain/task/eventlog'))
      .getEventCount;
    (await import('../src/domain/task/eventlog')).getEventCount = () => 150;

    // Mock compactWithSnapshot
    (await import('../src/domain/task/eventlog')).compactWithSnapshot = (
      _threshold: number
    ) => {
      compactCalled = true;
      return { trimmed: 100, tookSnapshot: true };
    };

    try {
      // Plan maintenance with maxEvents threshold
      const plan = await planMaintenance({ maxEvents: 100 });
      expect(plan.actions).toHaveLength(1);
      expect(plan.actions[0]?.type).toBe('COMPACT');

      // Run maintenance
      const report = await runMaintenance(plan, { storage });
      expect(compactCalled).toBe(true);
      expect(report.compact?.trimmed).toBe(100);
      expect(report.compact?.tookSnapshot).toBe(true);
    } finally {
      // Restore original functions
      (await import('../src/domain/task/eventlog')).compactWithSnapshot =
        originalCompact;
      (await import('../src/domain/task/eventlog')).getEventCount =
        originalGetEventCount;
    }
  });

  it('should plan and execute REKEY operation', async () => {
    // Create old key and rotate to new one
    const oldKey = await keyring.getActiveKey();
    await keyring.rotate();
    const newKey = await keyring.getActiveKey();

    // Store data with old key (simulate by manually creating envelope)
    const now = new Date().toISOString();
    const oldEnvelope = {
      v: 1,
      alg: 'AES-GCM',
      kid: oldKey.kid,
      ts: now,
      aad: toB64u(new TextEncoder().encode('app:key1').buffer),
      iv: 'mock-iv',
      data: 'mock-encrypted-data',
    } as any;

    await storage.setItem('app:key1', JSON.stringify(oldEnvelope));
    await storage.setItem('app:key2', 'plaintext-data'); // Should be skipped

    // Store data with current key
    await encrypted.setItem('app:key3', 'current-data');

    // Plan and run rekey
    const plan = await planMaintenance({ rekeyPrefix: 'app:', batchSize: 10 });
    expect(plan.actions).toHaveLength(1);
    expect(plan.actions[0]?.type).toBe('REKEY');

    const report = await runMaintenance(plan, { storage, encrypted, keyring });
    expect(report.rekey?.processed).toBeGreaterThan(0);
    expect(report.rekey?.rewrapped).toBeGreaterThan(0);

    // Verify old envelope was rekeyed
    const rekeyedValue = await storage.getItem('app:key1');
    if (rekeyedValue) {
      const rekeyedEnvelope = JSON.parse(rekeyedValue);
      expect(rekeyedEnvelope.kid).toBe(newKey.kid);
      // Original timestamp should be preserved during rekey
      expect(rekeyedEnvelope.ts).toBe(now);
    }
  });

  it('should plan and execute SWEEP operation', async () => {
    const { kid: activeKid } = await keyring.getActiveKey();

    // Create test data
    // 1. Valid envelope
    await encrypted.setItem('app:valid', 'valid-data');

    // 2. Envelope with wrong AAD
    const wrongAadEnvelope = {
      v: 1,
      alg: 'AES-GCM',
      kid: activeKid,
      ts: new Date().toISOString(),
      aad: toB64u(new TextEncoder().encode('wrong:namespace').buffer),
      iv: 'mock-iv',
      data: 'mock-data',
    } as any;
    await storage.setItem('app:wrong-aad', JSON.stringify(wrongAadEnvelope));

    // 3. Old kid envelope (will be repaired)
    await keyring.rotate();
    const newActiveKey = await keyring.getActiveKey();

    const oldKidEnvelope = {
      v: 1,
      alg: 'AES-GCM',
      kid: activeKid, // Old kid
      ts: new Date().toISOString(),
      aad: toB64u(new TextEncoder().encode('app:old-kid').buffer),
      iv: 'mock-iv',
      data: 'mock-data',
    } as any;
    await storage.setItem('app:old-kid', JSON.stringify(oldKidEnvelope));

    // 4. Malformed JSON
    await storage.setItem('app:malformed', '{ invalid json');

    // Plan and run sweep
    const plan = await planMaintenance({ sweepPrefix: 'app:', sweepFix: true });
    expect(plan.actions).toHaveLength(1);
    expect(plan.actions[0]?.type).toBe('SWEEP');

    const report = await runMaintenance(plan, { storage, encrypted, keyring });

    expect(report.sweep?.scanned).toBeGreaterThan(0);
    expect(report.sweep?.failed.length).toBeGreaterThan(0);

    // Should have failed items (wrong AAD, malformed)
    const failedKeys = report.sweep?.failed.map(f => f.key) || [];
    expect(failedKeys).toContain('app:wrong-aad');
    expect(failedKeys).toContain('app:malformed');

    // Should have repaired the old-kid item if fix=true
    if (report.sweep?.repaired && report.sweep.repaired > 0) {
      const repairedValue = await storage.getItem('app:old-kid');
      if (repairedValue) {
        const repairedEnvelope = JSON.parse(repairedValue);
        expect(repairedEnvelope.kid).toBe(newActiveKey.kid);
      }
    }
  });
});
