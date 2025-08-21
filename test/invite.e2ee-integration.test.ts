import { describe, it, expect } from 'vitest';
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

describe('Invite Integration E2EE Test', () => {
  it('should demonstrate full E2EE headless onboarding workflow', async () => {
    // Setup: Creator device with existing encrypted workspace
    const creatorStorage = new MockStorage();
    const creatorKeyring = new KeyringProvider(creatorStorage, 'workspace-ns');
    await creatorKeyring.initNew('creator-secret-passphrase', 1000);
    await creatorKeyring.rotate(); // Multiple keys to test transfer

    // Creator generates signing keys
    const signingKeys = await generateKeyPair();
    const signerPubB64u = await exportPublicKeyB64u(signingKeys.publicKey);

    // Setup invite registry storage
    const registryStorage = new MockStorage();
    setInviteStorage(registryStorage);

    // Create invite with one-time code
    const code = 'LUNAR-DAWN-73';
    const { envelope, meta } = await createInvite({
      keyring: creatorKeyring,
      code,
      ttlMs: 300000, // 5 minutes
      ns: 'team-workspace',
      sign: data => sign(signingKeys.privateKey, data),
      signerPubB64u,
    });

    // Verify envelope structure
    expect(envelope.v).toBe(1);
    expect(envelope.aad).toBe(`team-workspace:${meta.inviteId}`);
    expect(envelope.signerPubB64u).toBe(signerPubB64u);
    expect(envelope.ctB64u).toBeTruthy();
    expect(envelope.sigB64u).toBeTruthy();

    // Simulate: New device receives envelope + code (e.g., via QR, email, etc.)
    // New device has own storage & keyring with different passphrase
    const receiverStorage = new MockStorage();
    const receiverKeyring = new KeyringProvider(
      receiverStorage,
      'workspace-ns'
    );
    await receiverKeyring.initNew('receiver-different-passphrase', 2000); // Different params

    // Accept invite on new device
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

    // Verify successful import
    expect(result.importedCount).toBeGreaterThan(0);
    expect(result.rewrapped).toBe(true);
    expect(await isUsed(meta.inviteId)).toBe(true);

    // Verify that receiver now has access to imported keys
    // This demonstrates E2EE key transfer without passphrase sharing
    const receiverBackup = await receiverKeyring.exportBackup();

    // Verify we can access imported keys
    const firstDek = receiverBackup.deks[0];
    if (firstDek) {
      const importedKey = await receiverKeyring.getByKid(firstDek.kid);
      expect(importedKey).toBeTruthy();
    }

    // Verify namespace binding worked correctly
    expect(envelope.aad).toContain('team-workspace');

    console.log('✅ E2EE headless onboarding successful:');
    console.log(`   → Transferred ${result.importedCount} encryption keys`);
    console.log(`   → No passphrase shared between devices`);
    console.log(`   → Cryptographic authenticity verified`);
    console.log(`   → One-time invite consumed: ${meta.inviteId}`);
  });
});
