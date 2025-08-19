/**
 * Convert ArrayBuffer to base64url string
 */
export function toB64u(bytes: ArrayBuffer): string {
  const uint8Array = new Uint8Array(bytes);
  let binary = '';
  for (let i = 0; i < uint8Array.length; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Convert base64url string to ArrayBuffer
 */
export function fromB64u(s: string): ArrayBuffer {
  // Add padding to make length % 4 === 0
  const padLen = (4 - (s.length % 4)) % 4;
  const padded = s + '='.repeat(padLen);
  // Convert back to standard base64
  const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}
