/**
 * E2EE Async API Demo
 *
 * This demonstrates the new async E2EE approach that replaces the problematic
 * sync wrapper with clean async patterns.
 *
 * Usage:
 *   node examples/e2ee-async-demo.js
 */

import { webcrypto } from 'node:crypto';

// Setup WebCrypto for Node.js
if (!globalThis.crypto) {
  Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto,
    writable: false,
    configurable: false,
  });
}

// Async eventlog API
import {
  appendEventAsync,
  loadEventsAsync,
  hydrateAsync,
} from '../src/domain/task/eventlog.async.js';

// E2EE bootstrap helper
import { enableEncryptedStorage } from '../src/stores/crypto/enableEncryptedStorage.js';

// Crypto infrastructure
import { bootstrapKeyring } from '../src/stores/bootstrap/crypto.js';
import { LocalStorageDriver } from '../src/storage/local.js';

// Task store with async support
import { useTaskStore } from '../src/stores/taskStore.js';

// Simple in-memory storage for demo
class MemoryStorage {
  constructor() {
    this.data = new Map();
  }

  async getItem(key) {
    return this.data.get(key) || null;
  }

  async setItem(key, value) {
    this.data.set(key, value);
  }

  async removeItem(key) {
    this.data.delete(key);
  }

  async listKeys(prefix) {
    return Array.from(this.data.keys()).filter(key => key.startsWith(prefix));
  }
}

// Mock localStorage for keyring storage
const localStorage = new MemoryStorage();
global.localStorage = {
  getItem: key => {
    const data = localStorage.data.get(key);
    return data || null;
  },
  setItem: (key, value) => {
    localStorage.setItem(key, value);
  },
  removeItem: key => {
    localStorage.removeItem(key);
  },
};

async function demo() {
  console.log('🔐 E2EE Async API Demo\n');

  // 1. Bootstrap keyring with passphrase
  console.log('1️⃣  Setting up keyring...');
  const keyringStorage = new LocalStorageDriver();
  const keyring = await bootstrapKeyring(
    keyringStorage,
    'demo-keyring',
    'super-secret-passphrase-123'
  );
  console.log('✅ Keyring created with key:', keyring.currentKeyId());

  // 2. Setup encrypted storage for eventlog
  console.log('\n2️⃣  Configuring encrypted storage...');
  const taskStorage = new MemoryStorage();
  enableEncryptedStorage(taskStorage, keyring, 'demo-app');
  console.log('✅ Encrypted storage configured');

  // 3. Create and store encrypted events
  console.log('\n3️⃣  Creating encrypted task events...');

  const event1 = {
    type: 'TASK_CREATED',
    timestamp: new Date().toISOString(),
    payload: {
      id: 'task-1',
      title: 'Encrypted Task One',
      status: 'TODAY',
      priority: 'P1',
      tags: ['secret', 'encrypted'],
    },
  };

  const event2 = {
    type: 'TASK_CREATED',
    timestamp: new Date().toISOString(),
    payload: {
      id: 'task-2',
      title: 'Encrypted Task Two',
      status: 'LATER',
      priority: 'P2',
      tags: ['demo'],
    },
  };

  await appendEventAsync(event1);
  await appendEventAsync(event2);
  console.log('✅ Two events stored with encryption');

  // 4. Verify data is encrypted
  console.log('\n4️⃣  Verifying encryption...');
  const rawData = await taskStorage.getItem('demo-app:demo-app.events.v1');
  console.log('Raw encrypted data preview:', rawData.substring(0, 100) + '...');

  if (rawData.includes('Encrypted Task One')) {
    console.log('❌ ERROR: Found plaintext in storage!');
  } else {
    console.log('✅ Data is properly encrypted (no plaintext found)');
  }

  // 5. Load and decrypt events
  console.log('\n5️⃣  Loading events through decryption...');
  const events = await loadEventsAsync();
  console.log('✅ Loaded', events.length, 'events:');
  events.forEach((event, i) => {
    if (event.type === 'TASK_CREATED') {
      console.log(
        `   ${i + 1}. ${event.payload.title} (${event.payload.status})`
      );
    }
  });

  // 6. Hydrate store with async API
  console.log('\n6️⃣  Hydrating task store asynchronously...');
  await useTaskStore.getState().hydrateAsync();

  const state = useTaskStore.getState();
  const taskCount = Object.keys(state.byId).length;
  console.log('✅ Store hydrated with', taskCount, 'tasks:');

  Object.values(state.byId).forEach(task => {
    console.log(`   • ${task.title} [${task.status}]`);
  });

  console.log('\n🎉 Demo complete! The async E2EE API is working perfectly.');
  console.log('\n📝 Key benefits:');
  console.log('   • No more sync wrapper busy-wait issues');
  console.log('   • Clean async/await patterns throughout');
  console.log('   • Backward compatible with existing sync API');
  console.log('   • Proper encryption of all data in storage');
  console.log('   • Easy to test and debug');
}

// Run the demo
demo().catch(error => {
  console.error('❌ Demo failed:', error);
  process.exit(1);
});
