/**
 * Convert ArrayBuffer to base64url string
 */
export function toB64u(bytes: ArrayBuffer): string {
  const uint8Array = new Uint8Array(bytes);
  let binary = '';
  for (const element of uint8Array) {
    binary += String.fromCharCode(element);
  }
  return btoa(binary)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
}

/**
 * Convert base64url string to ArrayBuffer
 */
export function fromB64u(s: string): ArrayBuffer {
  // Add padding to make length % 4 === 0
  const padLen = (4 - (s.length % 4)) % 4;
  const padded = s + '='.repeat(padLen);
  // Convert back to standard base64
  const base64 = padded.replaceAll('-', '+').replaceAll('_', '/');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}
