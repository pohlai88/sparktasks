import { Envelope } from './types.js';
import { toB64u, fromB64u } from './base64url.js';

/**
 * Encrypt a plaintext record using AES-GCM
 */
export async function encryptRecord(
  key: CryptoKey,
  iv: Uint8Array,
  aad: Uint8Array,
  plaintext: string
): Promise<{ ctB64u: string }> {
  const encoder = new TextEncoder();
  const plaintextBytes = encoder.encode(plaintext);

  const ciphertext = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv as BufferSource,
      additionalData: aad as BufferSource,
    },
    key,
    plaintextBytes
  );

  return {
    ctB64u: toB64u(ciphertext),
  };
}

/**
 * Decrypt an encrypted record from an envelope
 */
export async function decryptRecord(
  key: CryptoKey,
  aad: Uint8Array,
  envelope: Envelope
): Promise<string> {
  if (envelope.v !== 1) {
    throw new Error(`Unsupported envelope version: ${envelope.v}`);
  }

  if (envelope.alg !== 'AES-GCM') {
    throw new Error(`Unsupported algorithm: ${envelope.alg}`);
  }

  const iv = fromB64u(envelope.iv);
  const ciphertext = fromB64u(envelope.ct);

  try {
    const decryptedBytes = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: new Uint8Array(iv) as BufferSource,
        additionalData: aad as BufferSource,
      },
      key,
      ciphertext
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBytes);
  } catch (error) {
    throw new Error(`Decryption failed: ${error}`);
  }
}
