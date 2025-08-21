/**
 * Ed25519 signing utilities for WebCrypto
 */

/**
 * Generate Ed25519 key pair
 */
export async function generateKeyPair(): Promise<{
  publicKey: CryptoKey;
  privateKey: CryptoKey;
}> {
  return await crypto.subtle.generateKey(
    {
      name: 'Ed25519',
      namedCurve: 'Ed25519',
    },
    true, // extractable
    ['sign', 'verify']
  );
}

/**
 * Export public key as base64url
 */
export async function exportPublicKeyB64u(
  publicKey: CryptoKey
): Promise<string> {
  const spki = await crypto.subtle.exportKey('spki', publicKey);
  return btoa(String.fromCharCode(...new Uint8Array(spki)))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
}

/**
 * Sign data with Ed25519 private key
 */
export async function sign(
  privateKey: CryptoKey,
  data: ArrayBuffer
): Promise<string> {
  const signature = await crypto.subtle.sign('Ed25519', privateKey, data);
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
}

/**
 * Verify Ed25519 signature
 */
export async function verify(
  publicKey: CryptoKey,
  data: ArrayBuffer,
  sigB64u: string
): Promise<boolean> {
  try {
    // Convert base64url to bytes
    const sigBase64 = sigB64u.replaceAll('-', '+').replaceAll('_', '/');
    const padding = '='.repeat((4 - (sigBase64.length % 4)) % 4);
    const sigBytes = Uint8Array.from(atob(sigBase64 + padding), c =>
      c.charCodeAt(0)
    );

    return await crypto.subtle.verify('Ed25519', publicKey, sigBytes, data);
  } catch {
    return false;
  }
}

/**
 * Import public key from base64url SPKI
 */
export async function importPublicKeyB64u(keyB64u: string): Promise<CryptoKey> {
  const keyBase64 = keyB64u.replaceAll('-', '+').replaceAll('_', '/');
  const padding = '='.repeat((4 - (keyBase64.length % 4)) % 4);
  const keyBytes = Uint8Array.from(atob(keyBase64 + padding), c =>
    c.charCodeAt(0)
  );

  return await crypto.subtle.importKey(
    'spki',
    keyBytes,
    { name: 'Ed25519', namedCurve: 'Ed25519' },
    false,
    ['verify']
  );
}
