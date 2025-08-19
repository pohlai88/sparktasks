/**
 * PBKDF2 utilities for keyring passphrase derivation
 */

/**
 * Derive a Key Encryption Key (KEK) from passphrase using PBKDF2
 * @param passphrase User passphrase
 * @param salt Random salt for key derivation
 * @param iterations PBKDF2 iteration count
 * @returns AES-KW 256-bit key for wrapping/unwrapping DEKs
 */
export async function deriveKEK(
  passphrase: string,
  salt: ArrayBuffer,
  iterations: number
): Promise<CryptoKey> {
  // Import passphrase as key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  // Derive KEK using PBKDF2
  const kek = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    {
      name: 'AES-KW',
      length: 256,
    },
    false,
    ['wrapKey', 'unwrapKey']
  );

  return kek;
}

/**
 * Generate a random 16-byte salt for PBKDF2
 * @returns 16 random bytes
 */
export function genSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(16));
}
