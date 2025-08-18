/**
 * Invite code validation helpers with checksums
 */

// Base32 alphabet (Crockford's Base32) - avoids confusing chars
const B32_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

/**
 * Calculate 2-character checksum for invite code
 */
function calculateChecksum(code: string): string {
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = ((hash << 5) - hash + code.charCodeAt(i)) & 0xffffffff;
  }
  const c1 = B32_ALPHABET[Math.abs(hash) % 32];
  const c2 = B32_ALPHABET[Math.abs(hash >> 5) % 32];
  return c1 + c2;
}

/**
 * Add checksum to invite code
 */
export function addCodeChecksum(code: string): string {
  return code + '-' + calculateChecksum(code);
}

/**
 * Verify and extract original code from checksummed code
 */
export function verifyCodeChecksum(codeWithChecksum: string): string {
  const lastDashIndex = codeWithChecksum.lastIndexOf('-');
  if (lastDashIndex === -1 || lastDashIndex === codeWithChecksum.length - 1) {
    throw new Error('Invalid code format');
  }
  
  const code = codeWithChecksum.slice(0, lastDashIndex);
  const checksum = codeWithChecksum.slice(lastDashIndex + 1);
  const expectedChecksum = calculateChecksum(code);
  
  if (checksum !== expectedChecksum) {
    throw new Error('Invalid code checksum');
  }
  
  return code;
}
