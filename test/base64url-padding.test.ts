import { describe, it, expect } from 'vitest';
import { toB64u, fromB64u } from '../src/crypto/base64url';

describe('base64url padding edge cases', () => {
  const testCases = [
    { bytes: [1], description: '1 byte' },
    { bytes: [1, 2], description: '2 bytes' },
    { bytes: [1, 2, 3], description: '3 bytes' },
    { bytes: [1, 2, 3, 4], description: '4 bytes' },
    { bytes: [1, 2, 3, 4, 5], description: '5 bytes' },
    { bytes: [1, 2, 3, 4, 5, 6], description: '6 bytes' },
    { bytes: [], description: 'empty array' },
  ];

  testCases.forEach(({ bytes, description }) => {
    it(`should handle ${description} correctly`, () => {
      const original = new Uint8Array(bytes);
      const encoded = toB64u(original.buffer);
      const decoded = new Uint8Array(fromB64u(encoded));

      expect(decoded.length).toBe(original.length);
      expect(Array.from(decoded)).toEqual(Array.from(original));
    });
  });
});
