import { describe, it, expect } from 'vitest';
import { addCodeChecksum, verifyCodeChecksum } from '../src/invite/codeUtils';

describe('Invite Code Checksums', () => {
  it('should add and verify checksums correctly', () => {
    const codes = ['SECRET123', 'LUNAR-DAWN-73', 'ALPHA42', 'TEST'];

    for (const code of codes) {
      const withChecksum = addCodeChecksum(code);
      expect(withChecksum).toMatch(/^.+-[0-9A-Z]{2}$/);
      expect(withChecksum).toContain('-');

      const verified = verifyCodeChecksum(withChecksum);
      expect(verified).toBe(code);
    }
  });

  it('should reject invalid checksums', () => {
    expect(() => verifyCodeChecksum('SECRET123-XX')).toThrow(
      'Invalid code checksum'
    );
    expect(() => verifyCodeChecksum('INVALID')).toThrow('Invalid code format');
    expect(() => verifyCodeChecksum('CODE-ZZ')).toThrow(
      'Invalid code checksum'
    ); // Different invalid checksum
  });

  it('should produce different checksums for different codes', () => {
    const checksum1 = addCodeChecksum('CODE1');
    const checksum2 = addCodeChecksum('CODE2');
    expect(checksum1).not.toBe(checksum2);
  });
});
