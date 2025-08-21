import { toB64u } from '../crypto/base64url.js';
import { encryptRecord, decryptRecord } from '../crypto/envelope.js';
import { type KeyProvider, type Envelope } from '../crypto/types.js';

import { type StorageDriver } from './types.js';

export class EncryptedDriver implements StorageDriver {
  constructor(
    private inner: StorageDriver,
    private ns: string,
    private keys: KeyProvider
  ) {}

  async getItem(key: string): Promise<string | null> {
    const rawValue = await this.inner.getItem(key);
    if (!rawValue) {
      return null;
    }

    // Try to parse as envelope
    let envelope: Envelope;
    try {
      envelope = JSON.parse(rawValue);
    } catch {
      // Not JSON, return as-is (legacy plaintext)
      return rawValue;
    }

    // Check if it's a valid envelope
    if (!envelope.v || !envelope.alg || !envelope.kid) {
      // Not an envelope, return as-is (legacy plaintext)
      return rawValue;
    }

    if (envelope.v !== 1) {
      throw new Error(`Unsupported envelope version: ${envelope.v}`);
    }

    // Get the key for decryption
    const cryptoKey = await this.keys.getByKid(envelope.kid);
    if (!cryptoKey) {
      throw new Error(`Key not found: ${envelope.kid}`);
    }

    // Prepare AAD
    const aadString = `${this.ns}:${key}`;
    const aad = new TextEncoder().encode(aadString);

    // Validate envelope AAD to prevent cross-namespace/key replay
    if (envelope.aad && envelope.aad !== toB64u(aad.buffer)) {
      throw new Error(`AAD mismatch for '${key}'`);
    }

    try {
      const plaintext = await decryptRecord(cryptoKey, aad, envelope);

      // Check if key rotation is needed
      const { kid: activeKid } = await this.keys.getActiveKey();
      if (envelope.kid !== activeKid) {
        // Re-encrypt with active key, preserving original ts
        const { key: newKey } = await this.keys.getActiveKey();
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const { ctB64u } = await encryptRecord(newKey, iv, aad, plaintext);
        const rotated: Envelope = {
          v: 1,
          alg: 'AES-GCM',
          kid: activeKid,
          iv: toB64u(iv.buffer),
          aad: toB64u(aad.buffer),
          ct: ctB64u,
          ts: envelope.ts, // preserve timestamp for LWW stability
        };
        await this.inner.setItem(key, JSON.stringify(rotated));
      }

      return plaintext;
    } catch (error) {
      throw new Error(`Failed to decrypt item '${key}': ${error}`);
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    const { kid, key: cryptoKey } = await this.keys.getActiveKey();

    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Prepare AAD
    const aadString = `${this.ns}:${key}`;
    const aad = new TextEncoder().encode(aadString);

    // Encrypt the value
    const { ctB64u } = await encryptRecord(cryptoKey, iv, aad, value);

    // Create envelope
    const envelope: Envelope = {
      v: 1,
      alg: 'AES-GCM',
      kid,
      iv: toB64u(iv.buffer),
      aad: toB64u(aad.buffer),
      ct: ctB64u,
      ts: new Date().toISOString(),
    };

    // Store the envelope as JSON
    await this.inner.setItem(key, JSON.stringify(envelope));
  }

  async removeItem(key: string): Promise<void> {
    // Pass-through delete
    await this.inner.removeItem(key);
  }

  async listKeys(prefix: string): Promise<string[]> {
    // Pass-through; keys are plaintext names, values encrypted
    return this.inner.listKeys(prefix);
  }
}
