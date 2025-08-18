/**
 * Master Crypto Setup Validation Test
 * Ensures our crypto polyfill setup works correctly across all scenarios
 */

import { describe, it, expect } from 'vitest';
import { 
  validateCryptoEnvironment, 
  ensureCryptoEnvironment,
  createMockCryptoEnvironment,
  crypto
} from './master-crypto-setup';

describe('Master Crypto Setup Validation', () => {
  it('should have crypto environment available', async () => {
    expect(globalThis.crypto).toBeDefined();
    expect(globalThis.crypto.subtle).toBeDefined();
    expect(crypto).toBeDefined();
    expect(crypto.subtle).toBeDefined();
  });

  it('should pass comprehensive crypto validation', async () => {
    const validation = await validateCryptoEnvironment();
    
    expect(validation.valid).toBe(true);
    expect(validation.crypto).toBe(true);
    expect(validation.subtle).toBe(true);
    expect(validation.sha256).toBe(true);
    expect(validation.ed25519).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  it('should perform SHA-256 hashing correctly', async () => {
    const testData = new TextEncoder().encode('hello world');
    const hash = await crypto.subtle.digest('SHA-256', testData);
    
    expect(hash).toBeInstanceOf(ArrayBuffer);
    expect(hash.byteLength).toBe(32);
    
    // Convert to hex to verify known hash
    const hashArray = new Uint8Array(hash);
    const hashHex = Array.from(hashArray)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    // SHA-256 of "hello world" should be this known value
    expect(hashHex).toBe('b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9');
  });

  it('should perform Ed25519 operations correctly', async () => {
    // Generate key pair
    const keyPair = await crypto.subtle.generateKey(
      { name: 'Ed25519' },
      true,
      ['sign', 'verify']
    );
    
    expect(keyPair.publicKey).toBeDefined();
    expect(keyPair.privateKey).toBeDefined();
    
    // Test signing
    const message = new TextEncoder().encode('test message for Ed25519');
    const signature = await crypto.subtle.sign(
      'Ed25519',
      keyPair.privateKey,
      message
    );
    
    // Accept either ArrayBuffer or Uint8Array from polyfill
    expect(signature).toBeTruthy();
    const signatureBuffer = signature as ArrayBuffer;
    const byteLength = signatureBuffer.byteLength || (signature as any).length;
    expect(byteLength).toBe(64); // Ed25519 signatures are 64 bytes
    
    // Test verification
    const isValid = await crypto.subtle.verify(
      'Ed25519',
      keyPair.publicKey,
      signature,
      message
    );
    
    expect(isValid).toBe(true);
    
    // Test invalid signature detection
    const invalidMessage = new TextEncoder().encode('different message');
    const isInvalid = await crypto.subtle.verify(
      'Ed25519',
      keyPair.publicKey,
      signature,
      invalidMessage
    );
    
    expect(isInvalid).toBe(false);
  });

  it('should provide mock crypto environment when needed', () => {
    const mockCrypto = createMockCryptoEnvironment();
    
    expect(mockCrypto.subtle).toBeDefined();
    expect(mockCrypto.subtle.digest).toBeDefined();
    expect(mockCrypto.subtle.generateKey).toBeDefined();
    expect(mockCrypto.subtle.sign).toBeDefined();
    expect(mockCrypto.subtle.verify).toBeDefined();
    expect(mockCrypto.getRandomValues).toBeDefined();
  });

  it('should ensure crypto environment in setup functions', async () => {
    const environmentReady = await ensureCryptoEnvironment();
    expect(environmentReady).toBe(true);
  });

  it('should handle random values generation', () => {
    const array = new Uint8Array(32);
    const result = crypto.getRandomValues(array);
    
    expect(result).toBe(array);
    expect(array.length).toBe(32);
    
    // Check that values are actually random (not all zeros)
    const allZeros = array.every(byte => byte === 0);
    expect(allZeros).toBe(false);
  });
});
