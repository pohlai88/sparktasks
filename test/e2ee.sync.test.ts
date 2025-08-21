/**
 * E2EE Sync Test - validates encrypted storage composition
 *
 * Tests that:
 * 1. enableEncryptedStorage() properly encrypts eventlog data
 * 2. Data can be read back correctly through encryption layer
 * 3. Storage migration from plaintext to encrypted works
 * 4. Multiple encrypted namespaces are isolated
 * 5. Full async workflow with hydrateAsync() works
 */

import { beforeEach, describe, test, expect } from 'vitest';
import { webcrypto } from 'node:crypto';

// Setup WebCrypto for Node.js test environment
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

// New async eventlog API
import {
  appendEventAsync,
  loadEventsAsync,
} from '../src/domain/task/eventlog.async';

// E2EE bootstrap helper
import { enableEncryptedStorage } from '../src/stores/crypto/enableEncryptedStorage';

// Crypto infrastructure
import { KeyringProvider } from '../src/crypto/keyring';
import { bootstrapKeyring } from '../src/stores/bootstrap/crypto';
import { LocalStorageDriver } from '../src/storage/local';

// Store for testing async hydration
import { useTaskStore } from '../src/stores/taskStore';

// Types
import type { TaskEvent } from '../src/domain/task/events';

// Mock storage to observe what's actually stored
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

  // Helper to inspect stored data
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

// Helper to create valid task events
function createTaskCreatedEvent(payload: {
  id: string;
  title: string;
  status: 'TODAY' | 'LATER' | 'DONE' | 'ARCHIVED';
  priority?: 'P0' | 'P1' | 'P2';
  tags?: string[];
}): TaskEvent {
  return {
    type: 'TASK_CREATED',
    timestamp: new Date().toISOString(),
    payload: {
      id: payload.id,
      title: payload.title,
      status: payload.status,
      priority: payload.priority || 'P2',
      tags: payload.tags || [],
    },
  };
}

describe('E2EE Sync Infrastructure', () => {
  let keyring: KeyringProvider;
  let mockStorage: MockStorage;

  beforeEach(async () => {
    // Clear storage
    mockLocalStorage.clear();

    // Create mock storage for encrypted driver
    mockStorage = new MockStorage();

    // Bootstrap fresh keyring for each test
    const asyncStorage = new LocalStorageDriver();
    keyring = await bootstrapKeyring(
      asyncStorage,
      'test-keyring',
      'test-passphrase-123'
    );

    // Reset task store state
    useTaskStore.setState({ byId: {}, undoStack: [], redoStack: [] });
  });

  test('enableEncryptedStorage function exists and configures async storage', async () => {
    // This test verifies the function exists and can be called without error
    expect(() => {
      enableEncryptedStorage(mockStorage, keyring, 'test-namespace');
    }).not.toThrow();

    // Should be able to append events via async API
    const event = createTaskCreatedEvent({
      id: 'test-task-1',
      title: 'Test Task',
      status: 'TODAY',
    });

    await expect(appendEventAsync(event)).resolves.not.toThrow();
  });

  test('encrypted events can be written and read via async API', async () => {
    // 1. Configure encrypted storage
    enableEncryptedStorage(mockStorage, keyring, 'test-namespace');

    // 2. Create and store test events via async API
    const event1 = createTaskCreatedEvent({
      id: 'task-1',
      title: 'First Encrypted Task',
      status: 'TODAY',
    });

    await appendEventAsync(event1);

    // 3. Verify data is encrypted in storage
    const storedData = mockStorage.getAllData();
    const eventlogKey = Object.keys(storedData).find(k =>
      k.includes('events.v1')
    );
    expect(eventlogKey).toBeDefined();

    const rawStoredData = storedData[eventlogKey!];
    expect(rawStoredData).toBeDefined();

    // Should be JSON envelope, not plaintext event
    const envelope = JSON.parse(rawStoredData!);
    expect(envelope.v).toBe(1);
    expect(envelope.alg).toBe('AES-GCM');
    expect(envelope.kid).toBeDefined();
    expect(envelope.ct).toBeDefined(); // encrypted ciphertext
    expect(envelope.iv).toBeDefined(); // initialization vector

    // Should NOT contain plaintext
    expect(rawStoredData).not.toContain('First Encrypted Task');
    expect(rawStoredData).not.toContain('task-1');

    // 4. Load events back through encryption layer
    const loadedEvents = await loadEventsAsync();
    expect(loadedEvents).toHaveLength(1);
    expect(loadedEvents[0]?.type).toBe('TASK_CREATED');
    if (loadedEvents[0]?.type === 'TASK_CREATED') {
      expect(loadedEvents[0].payload.title).toBe('First Encrypted Task');
    }
  });

  test('hydrateAsync works with encrypted storage', async () => {
    // 1. Configure encrypted storage
    enableEncryptedStorage(mockStorage, keyring, 'test-namespace');

    // 2. Create test events via async API
    const event1 = createTaskCreatedEvent({
      id: 'task-1',
      title: 'Encrypted Task One',
      status: 'TODAY',
    });

    const event2 = createTaskCreatedEvent({
      id: 'task-2',
      title: 'Encrypted Task Two',
      status: 'LATER',
    });

    await appendEventAsync(event1);
    await appendEventAsync(event2);

    // 3. Hydrate store via async path
    await useTaskStore.getState().hydrateAsync();

    // 4. Verify tasks are properly loaded into store
    const state = useTaskStore.getState();
    expect(Object.keys(state.byId)).toHaveLength(2);
    expect(state.byId['task-1']?.title).toBe('Encrypted Task One');
    expect(state.byId['task-2']?.title).toBe('Encrypted Task Two');
    expect(state.byId['task-1']?.status).toBe('TODAY');
    expect(state.byId['task-2']?.status).toBe('LATER');
  });

  test('multiple encrypted namespaces are isolated', async () => {
    // Create separate storage instances for different namespaces
    const storage1 = new MockStorage();
    const storage2 = new MockStorage();

    // Configure different encrypted namespaces
    enableEncryptedStorage(storage1, keyring, 'app1');

    const event1 = createTaskCreatedEvent({
      id: 'app1-task',
      title: 'App 1 Task',
      status: 'TODAY',
    });

    await appendEventAsync(event1);

    // Switch to different namespace
    enableEncryptedStorage(storage2, keyring, 'app2');

    const event2 = createTaskCreatedEvent({
      id: 'app2-task',
      title: 'App 2 Task',
      status: 'TODAY',
    });

    await appendEventAsync(event2);

    // Verify data is in separate storage instances
    const storage1Data = storage1.getAllData();
    const storage2Data = storage2.getAllData();

    expect(Object.keys(storage1Data)).toHaveLength(1);
    expect(Object.keys(storage2Data)).toHaveLength(1);

    // Verify different AAD in the envelopes
    const envelope1 = JSON.parse(Object.values(storage1Data)[0]!);
    const envelope2 = JSON.parse(Object.values(storage2Data)[0]!);

    // Different namespaces should have different AAD
    expect(envelope1.aad).not.toBe(envelope2.aad);

    // Switch back to app1 namespace and verify isolation
    enableEncryptedStorage(storage1, keyring, 'app1');
    const app1Events = await loadEventsAsync();
    expect(app1Events).toHaveLength(1);
    if (app1Events[0]?.type === 'TASK_CREATED') {
      expect(app1Events[0].payload.title).toBe('App 1 Task');
    }
  });

  test('EncryptedDriver supports legacy plaintext data', async () => {
    // 1. Manually store plaintext data (simulating legacy)
    const legacyEvent = {
      type: 'TASK_CREATED',
      timestamp: new Date().toISOString(),
      payload: {
        id: 'legacy-task',
        title: 'Legacy Plaintext Task',
        status: 'TODAY',
        priority: 'P2',
        tags: [],
      },
    };

    await mockStorage.setItem('spark.events.v1', JSON.stringify(legacyEvent));

    // 2. Configure encrypted storage
    enableEncryptedStorage(mockStorage, keyring, 'spark');

    // 3. Should be able to read legacy plaintext data
    const events = await loadEventsAsync();
    expect(events).toHaveLength(1);
    if (events[0]?.type === 'TASK_CREATED') {
      expect(events[0].payload.title).toBe('Legacy Plaintext Task');
    }

    // 4. New events should be encrypted
    const newEvent = createTaskCreatedEvent({
      id: 'new-encrypted-task',
      title: 'New Encrypted Task',
      status: 'TODAY',
    });

    await appendEventAsync(newEvent);

    // 5. Verify mixed data works (both events readable through encryption)
    const finalEvents = await loadEventsAsync();
    expect(finalEvents).toHaveLength(2);

    if (finalEvents[0]?.type === 'TASK_CREATED') {
      expect(finalEvents[0].payload.title).toBe('Legacy Plaintext Task');
    }
    if (finalEvents[1]?.type === 'TASK_CREATED') {
      expect(finalEvents[1].payload.title).toBe('New Encrypted Task');
    }

    // 6. Verify data is now fully encrypted for security
    const rawData = mockStorage.getAllData()['spark.events.v1'];
    expect(rawData).toBeDefined();

    // Should be single encrypted envelope (legacy data gets re-encrypted)
    const envelope = JSON.parse(rawData!);
    expect(envelope.v).toBe(1);
    expect(envelope.alg).toBe('AES-GCM');
    expect(envelope.ct).toBeDefined();

    // Should NOT contain plaintext
    expect(rawData).not.toContain('Legacy Plaintext Task');
    expect(rawData).not.toContain('New Encrypted Task');
  });
});
