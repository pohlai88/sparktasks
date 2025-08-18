/**
 * Practical E2EE Edge Case Tests
 * 
 * These tests focus on real-world edge cases that can be implemented
 * with the current API, providing high production value.
 */

import { beforeEach, describe, test, expect } from 'vitest';
import { webcrypto } from 'node:crypto';

// Setup WebCrypto for Node.js test environment
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

// Async eventlog API
import { 
  appendEventAsync, 
  loadEventsAsync
} from '../src/domain/task/eventlog.async';

// E2EE bootstrap and crypto
import { enableEncryptedStorage } from '../src/stores/crypto/enableEncryptedStorage';
import { KeyringProvider } from '../src/crypto/keyring';
import { bootstrapKeyring } from '../src/stores/bootstrap/crypto';
import { LocalStorageDriver } from '../src/storage/local';
import { EncryptedDriver } from '../src/storage/encrypted';

// Types
import type { TaskEvent } from '../src/domain/task/events';

// Mock storage
class MockStorage {
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
    return Array.from(this.data.keys()).filter(key => key.startsWith(prefix));
  }
  
  getAllData(): Record<string, string> {
    return Object.fromEntries(this.data);
  }
  
  clear(): void {
    this.data.clear();
  }
}

// Mock localStorage for keyring
const mockLocalStorage = new MockStorage();
Object.defineProperty(global, 'localStorage', {
  value: {
    getItem: (key: string) => {
      const result = mockLocalStorage.getAllData()[key];
      return result || null;
    },
    setItem: (key: string, value: string) => {
      mockLocalStorage.setItem(key, value);
    },
    removeItem: (key: string) => {
      mockLocalStorage.removeItem(key);
    },
  },
  writable: true,
});

// Helper to create task events
function createTaskCreatedEvent(payload: {
  id: string;
  title: string;
  status: 'TODAY' | 'LATER' | 'DONE' | 'ARCHIVED';
}): TaskEvent {
  return {
    type: 'TASK_CREATED',
    timestamp: new Date().toISOString(),
    payload: {
      id: payload.id,
      title: payload.title,
      status: payload.status,
      priority: 'P2',
      tags: [],
    },
  };
}

describe('E2EE Edge Cases - Production Ready', () => {
  let keyring: KeyringProvider;
  let mockStorage: MockStorage;
  
  beforeEach(async () => {
    // Clear storage
    mockLocalStorage.clear();
    mockStorage = new MockStorage();
    
    // Bootstrap fresh keyring
    const asyncStorage = new LocalStorageDriver();
    keyring = await bootstrapKeyring(asyncStorage, 'edge-test', 'test-passphrase-456');
  });

  test('Namespace/AAD isolation prevents cross-app data access', async () => {
    // 1. Setup with namespace 'app-v1'  
    enableEncryptedStorage(mockStorage, keyring, 'app-v1');
    
    const event = createTaskCreatedEvent({
      id: 'task-1',
      title: 'Sensitive App Data',
      status: 'TODAY',
    });
    
    await appendEventAsync(event);
    
    // 2. Verify data is accessible with correct namespace
    const originalEvents = await loadEventsAsync();
    expect(originalEvents).toHaveLength(1);
    if (originalEvents[0]?.type === 'TASK_CREATED') {
      expect(originalEvents[0].payload.title).toBe('Sensitive App Data');
    }
    
    // 3. Find the actual physical key where data was stored
    const allData = mockStorage.getAllData();
    const physicalKeys = Object.keys(allData);
    const eventlogKey = physicalKeys.find(k => k.includes('events.v1'));
    expect(eventlogKey).toBeDefined();
    
    // 4. Create EncryptedDriver with wrong namespace and try to read the same physical key
    const wrongNamespaceStorage = new EncryptedDriver(mockStorage, 'app-v2', keyring);
    
    // This should fail because AAD won't match ('app-v2:...' vs 'app-v1:...')
    await expect(wrongNamespaceStorage.getItem(eventlogKey!))
      .rejects.toThrow(/AAD mismatch/);
    
    // 5. Create fresh mock storage for app-v2 to test true isolation
    const app2Storage = new MockStorage();
    enableEncryptedStorage(app2Storage, keyring, 'app-v2');
    
    // app-v2 storage should be completely empty
    const isolatedEvents = await loadEventsAsync();
    expect(isolatedEvents).toHaveLength(0);
    
    // Success! We've validated:
    // - Cross-namespace AAD validation works
    // - Different app namespaces are properly isolated
  });

  test('Corrupt envelope handling provides clear error messages', async () => {
    // 1. Setup encrypted storage
    enableEncryptedStorage(mockStorage, keyring, 'test-ns');
    
    const event = createTaskCreatedEvent({
      id: 'test-task',
      title: 'Test Data',
      status: 'TODAY',
    });
    
    await appendEventAsync(event);
    
    // 2. Find where the data was actually stored
    const allData = mockStorage.getAllData();
    const physicalKeys = Object.keys(allData);
    const eventlogKey = physicalKeys.find(k => k.includes('events.v1'));
    expect(eventlogKey).toBeDefined();
    
    const rawData = allData[eventlogKey!];
    expect(rawData).toBeDefined();
    expect(rawData).not.toBe('null');
    
    const envelope = JSON.parse(rawData!);
    expect(envelope.v).toBe(1);
    
    // 3. Corrupt the ciphertext (keep structure valid but make decryption fail)
    const corruptedEnvelope = {
      ...envelope,
      ct: envelope.ct.slice(0, -10) + 'CORRUPTED!'
    };
    
    await mockStorage.setItem(eventlogKey!, JSON.stringify(corruptedEnvelope));
    
    // 4. Attempt to read should throw descriptive error
    try {
      await loadEventsAsync();
      expect.fail('Should have thrown on corrupted envelope');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      const errorMessage = (error as Error).message;
      
      // Should contain helpful context for debugging
      expect(errorMessage).toMatch(/decrypt|failed/i);
      
      // This helps with telemetry and debugging
      expect(errorMessage).toContain('.events.v1');
    }
  });

  test('Basic lock/unlock workflow preserves data access', async () => {
    // 1. Setup encrypted storage
    enableEncryptedStorage(mockStorage, keyring, 'test-app');
    
    const event = createTaskCreatedEvent({
      id: 'important-task',
      title: 'Critical Data',
      status: 'TODAY',
    });
    
    await appendEventAsync(event);
    
    // 2. Verify data is accessible when unlocked
    const originalEvents = await loadEventsAsync();
    expect(originalEvents).toHaveLength(1);
    if (originalEvents[0]?.type === 'TASK_CREATED') {
      expect(originalEvents[0].payload.title).toBe('Critical Data');
    }
    
    // 3. Lock the keyring
    keyring.lock();
    
    // 4. Verify access fails when locked
    // The error might be "Key not found" or "Keyring locked" depending on implementation
    await expect(loadEventsAsync()).rejects.toThrow(/locked|Key not found/i);
    
    // 5. Unlock and verify access restored
    await keyring.unlock('test-passphrase-456');
    
    // Need to reconfigure storage after unlock (keys are regenerated)
    enableEncryptedStorage(mockStorage, keyring, 'test-app');
    
    const eventsAfterUnlock = await loadEventsAsync();
    expect(eventsAfterUnlock).toHaveLength(1);
    if (eventsAfterUnlock[0]?.type === 'TASK_CREATED') {
      expect(eventsAfterUnlock[0].payload.title).toBe('Critical Data');
    }
  });
});
