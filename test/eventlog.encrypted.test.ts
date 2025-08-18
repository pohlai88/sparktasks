import { describe, it, expect, beforeEach } from 'vitest';
import { webcrypto } from 'node:crypto';

// Setup WebCrypto for Node.js immediately
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

import { EncryptedDriver } from '../src/storage/encrypted.js';
import { KeyProvider } from '../src/crypto/types.js';

// Mock storage driver for testing
class MockStorageDriver {
  private data = new Map<string, string>();

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

  clear(): void {
    this.data.clear();
  }

  getData(): Map<string, string> {
    return new Map(this.data);
  }
}

// Mock key provider for testing
class MockKeyProvider implements KeyProvider {
  private keys = new Map<string, CryptoKey>();
  private activeKid = 'key1';

  async generateKey(kid: string): Promise<CryptoKey> {
    const key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
    this.keys.set(kid, key);
    return key;
  }

  async getActiveKey(): Promise<{ kid: string; key: CryptoKey }> {
    const key = this.keys.get(this.activeKid);
    if (!key) {
      throw new Error(`Active key not found: ${this.activeKid}`);
    }
    return { kid: this.activeKid, key };
  }

  async getByKid(kid: string): Promise<CryptoKey | null> {
    return this.keys.get(kid) || null;
  }

  setActiveKid(kid: string): void {
    this.activeKid = kid;
  }
}

// Simulate eventlog-like operations
class MockEventLog {
  constructor(private driver: EncryptedDriver) {}

  async appendEvent(event: unknown): Promise<void> {
    const events = await this.loadEvents();
    events.push(event);
    await this.driver.setItem('events', JSON.stringify(events));
  }

  async loadEvents(): Promise<unknown[]> {
    const data = await this.driver.getItem('events');
    return data ? JSON.parse(data) : [];
  }
}

describe('EventLog with Encryption', () => {
  let mockStorage: MockStorageDriver;
  let keyProvider: MockKeyProvider;
  let encryptedDriver: EncryptedDriver;
  let eventLog: MockEventLog;

  beforeEach(async () => {
    mockStorage = new MockStorageDriver();
    keyProvider = new MockKeyProvider();
    await keyProvider.generateKey('key1');
    encryptedDriver = new EncryptedDriver(mockStorage, 'eventlog', keyProvider);
    eventLog = new MockEventLog(encryptedDriver);
  });

  it('should encrypt event data while maintaining eventlog functionality', async () => {
    // Create a test event
    const testEvent = {
      type: 'test',
      payload: { message: 'sensitive event data', userId: 123 },
      timestamp: new Date().toISOString(),
    };

    // Append event
    await eventLog.appendEvent(testEvent);

    // Verify no plaintext appears in storage
    const storageData = mockStorage.getData();
    let foundPlaintextEvent = false;
    for (const [, value] of storageData) {
      if (value.includes('sensitive event data') || value.includes('test')) {
        foundPlaintextEvent = true;
        break;
      }
    }
    expect(foundPlaintextEvent).toBe(false);

    // Verify events can still be loaded and reduced
    const events = await eventLog.loadEvents();
    expect(events).toHaveLength(1);
    expect((events[0] as any).type).toBe('test');
    expect((events[0] as any).payload.message).toBe('sensitive event data');
    expect((events[0] as any).payload.userId).toBe(123);
  });

  it('should maintain event ordering and metadata through encryption', async () => {
    // Create multiple test events
    const events = [
      { type: 'event1', payload: { data: 'first' }, timestamp: new Date().toISOString() },
      { type: 'event2', payload: { data: 'second' }, timestamp: new Date().toISOString() },
      { type: 'event3', payload: { data: 'third' }, timestamp: new Date().toISOString() },
    ];

    // Append events
    for (const event of events) {
      await eventLog.appendEvent(event);
    }

    // Load and verify order is preserved
    const loadedEvents = await eventLog.loadEvents();
    expect(loadedEvents).toHaveLength(3);
    expect((loadedEvents[0] as any).payload.data).toBe('first');
    expect((loadedEvents[1] as any).payload.data).toBe('second');
    expect((loadedEvents[2] as any).payload.data).toBe('third');
  });

  it('should ensure all stored values are encrypted envelopes', async () => {
    // Append an event
    await eventLog.appendEvent({
      type: 'test-encryption',
      payload: { secret: 'confidential information' },
      timestamp: new Date().toISOString(),
    });

    // Check that all stored values are valid encrypted envelopes
    const storageData = mockStorage.getData();
    for (const [key, value] of storageData) {
      if (key.includes('events')) {
        const envelope = JSON.parse(value);
        expect(envelope.v).toBe(1);
        expect(envelope.alg).toBe('AES-GCM');
        expect(envelope.kid).toBeTruthy();
        expect(envelope.iv).toBeTruthy();
        expect(envelope.ct).toBeTruthy();
        expect(envelope.aad).toBeTruthy();
        expect(envelope.ts).toBeTruthy();
        
        // Ensure no plaintext leakage
        expect(value).not.toContain('test-encryption');
        expect(value).not.toContain('confidential information');
      }
    }
  });
});
