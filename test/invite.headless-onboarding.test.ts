import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createInvite } from '../src/invite/create';
import { acceptInvite } from '../src/invite/accept';
import { setInviteStorage, isUsed, markUsed } from '../src/invite/registry';
import { KeyringProvider } from '../src/crypto/keyring';
import {
  generateKeyPair,
  sign,
  verify,
  exportPublicKeyB64u,
  importPublicKeyB64u,
} from '../src/crypto/ed25519';

// WebCrypto polyfill for Node.js testing
if (!globalThis.crypto) {
  Object.defineProperty(globalThis, 'crypto', {
    value: require('node:crypto').webcrypto,
    writable: false,
    configurable: true,
  });
}
if (!globalThis.crypto.subtle) {
  Object.defineProperty(globalThis.crypto, 'subtle', {
    value: require('node:crypto').webcrypto.subtle,
    writable: false,
    configurable: true,
  });
}
if (!globalThis.crypto.getRandomValues) {
  Object.defineProperty(globalThis.crypto, 'getRandomValues', {
    value: require('node:crypto').webcrypto.getRandomValues.bind(
      require('node:crypto').webcrypto
    ),
    writable: false,
    configurable: true,
  });
}

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
}

describe('Headless Device Onboarding', () => {
  let keyring: KeyringProvider;
  let signingKeys: { publicKey: CryptoKey; privateKey: CryptoKey };
  let mockStorage: MockStorage;
  let signerPubB64u: string;

  beforeEach(async () => {
    mockStorage = new MockStorage();
    keyring = new KeyringProvider(mockStorage, 'test-ns');
    await keyring.initNew('test-passphrase', 1000);
    await keyring.rotate(); // Add a second key

    signingKeys = await generateKeyPair();
    signerPubB64u = await exportPublicKeyB64u(signingKeys.publicKey);

    setInviteStorage(mockStorage);
  });

  it('should complete happy path: create → accept with correct code', async () => {
    const code = 'SECRET123';
    const ttlMs = 60000; // 1 minute

    // Create invite
    const { envelope, meta } = await createInvite({
      keyring,
      code,
      ttlMs,
      ns: 'test-app',
      sign: data => sign(signingKeys.privateKey, data),
      signerPubB64u,
    });

    expect(envelope.v).toBe(1);
    expect(envelope.aad).toBe(`test-app:${meta.inviteId}`);
    expect(meta.ns).toBe('test-app');

    // Simulate fresh keyring on receiving device
    const receiverStorage = new MockStorage();
    const receiverKeyring = new KeyringProvider(receiverStorage, 'test-ns');
    await receiverKeyring.initNew('receiver-passphrase', 1000);

    // Accept invite
    const result = await acceptInvite({
      envelope,
      code,
      keyring: receiverKeyring,
      verify: async (data, sig, pubB64u) => {
        const pubKey = await importPublicKeyB64u(pubB64u);
        return verify(pubKey, data, sig);
      },
      isUsed: id => isUsed(id),
      markUsed: id => markUsed(id),
    });

    expect(result.importedCount).toBeGreaterThan(0);
    expect(result.rewrapped).toBe(true);
    expect(await isUsed(meta.inviteId)).toBe(true);
  });

  it('should reject wrong code (decryption fails)', async () => {
    const { envelope } = await createInvite({
      keyring,
      code: 'CORRECT123',
      ttlMs: 60000,
      ns: 'test-app',
      sign: data => sign(signingKeys.privateKey, data),
      signerPubB64u,
    });

    const receiverStorage = new MockStorage();
    const receiverKeyring = new KeyringProvider(receiverStorage, 'test-ns');
    await receiverKeyring.initNew('receiver-passphrase', 1000);

    await expect(
      acceptInvite({
        envelope,
        code: 'WRONG123', // Wrong code
        keyring: receiverKeyring,
        verify: async (data, sig, pubB64u) => {
          const pubKey = await importPublicKeyB64u(pubB64u);
          return verify(pubKey, data, sig);
        },
        isUsed: () => Promise.resolve(false),
        markUsed: vi.fn(),
      })
    ).rejects.toThrow();
  });

  it('should reject tampered signature', async () => {
    const { envelope } = await createInvite({
      keyring,
      code: 'SECRET123',
      ttlMs: 60000,
      ns: 'test-app',
      sign: data => sign(signingKeys.privateKey, data),
      signerPubB64u,
    });

    // Tamper with signature
    const tamperedEnvelope = { ...envelope, sigB64u: 'tampered' };

    const receiverStorage = new MockStorage();
    const receiverKeyring = new KeyringProvider(receiverStorage, 'test-ns');
    await receiverKeyring.initNew('receiver-passphrase', 1000);

    await expect(
      acceptInvite({
        envelope: tamperedEnvelope,
        code: 'SECRET123',
        keyring: receiverKeyring,
        verify: async (data, sig, pubB64u) => {
          const pubKey = await importPublicKeyB64u(pubB64u);
          return verify(pubKey, data, sig);
        },
        isUsed: () => Promise.resolve(false),
        markUsed: vi.fn(),
      })
    ).rejects.toThrow('Invalid signature');
  });

  it('should reject expired invite', async () => {
    const { envelope } = await createInvite({
      keyring,
      code: 'SECRET123',
      ttlMs: 1000, // 1 second
      ns: 'test-app',
      sign: data => sign(signingKeys.privateKey, data),
      signerPubB64u,
      now: () => new Date('2025-01-01T00:00:00Z'),
    });

    const receiverStorage = new MockStorage();
    const receiverKeyring = new KeyringProvider(receiverStorage, 'test-ns');
    await receiverKeyring.initNew('receiver-passphrase', 1000);

    await expect(
      acceptInvite({
        envelope,
        code: 'SECRET123',
        keyring: receiverKeyring,
        verify: async (data, sig, pubB64u) => {
          const pubKey = await importPublicKeyB64u(pubB64u);
          return verify(pubKey, data, sig);
        },
        isUsed: () => Promise.resolve(false),
        markUsed: vi.fn(),
        now: () => new Date('2025-01-01T00:10:00Z'), // 10 minutes later (exceeds 5min skew)
        skewMs: 60000, // 1 minute tolerance for this test
      })
    ).rejects.toThrow('Invite expired');
  });

  it('should prevent replay (accept twice fails)', async () => {
    const { envelope, meta } = await createInvite({
      keyring,
      code: 'SECRET123',
      ttlMs: 60000,
      ns: 'test-app',
      sign: data => sign(signingKeys.privateKey, data),
      signerPubB64u,
    });

    const receiverStorage = new MockStorage();
    const receiverKeyring = new KeyringProvider(receiverStorage, 'test-ns');
    await receiverKeyring.initNew('receiver-passphrase', 1000);

    // First accept should succeed
    await acceptInvite({
      envelope,
      code: 'SECRET123',
      keyring: receiverKeyring,
      verify: async (data, sig, pubB64u) => {
        const pubKey = await importPublicKeyB64u(pubB64u);
        return verify(pubKey, data, sig);
      },
      isUsed: id => isUsed(id),
      markUsed: id => markUsed(id),
    });

    expect(await isUsed(meta.inviteId)).toBe(true);

    // Second accept should fail
    await expect(
      acceptInvite({
        envelope,
        code: 'SECRET123',
        keyring: receiverKeyring,
        verify: async (data, sig, pubB64u) => {
          const pubKey = await importPublicKeyB64u(pubB64u);
          return verify(pubKey, data, sig);
        },
        isUsed: id => isUsed(id),
        markUsed: id => markUsed(id),
      })
    ).rejects.toThrow('Invite already used');
  });
});
