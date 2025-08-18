/**
 * Test Setup - WebCrypto Polyfill
 * Ensures crypto.subtle is available in Node.js test environment
 */

import { Crypto } from '@peculiar/webcrypto';

// Polyfill crypto.subtle for Node.js test environment - handle read-only globalThis.crypto
if (!globalThis.crypto || !globalThis.crypto.subtle) {
  try {
    // Try direct assignment first
    globalThis.crypto = new Crypto();
    console.log('🔧 WebCrypto polyfill injected for test environment');
  } catch (error) {
    // If globalThis.crypto is read-only, use Object.defineProperty
    try {
      Object.defineProperty(globalThis, 'crypto', {
        value: new Crypto(),
        configurable: true,
        writable: true
      });
      console.log('🔧 WebCrypto polyfill injected via defineProperty');
    } catch (defineError) {
      // If both approaches fail, patch individual methods
      const crypto = new Crypto();
      if (!globalThis.crypto) {
        (globalThis as any).crypto = {};
      }
      if (!globalThis.crypto.subtle) {
        (globalThis.crypto as any).subtle = crypto.subtle;
      }
      console.log('🔧 WebCrypto polyfill injected via property patching');
    }
  }
}

// Validation function to ensure polyfill works
export async function validateCryptoSetup(): Promise<boolean> {
  try {
    // Test basic crypto availability
    if (!globalThis.crypto?.subtle) {
      console.error('❌ crypto.subtle not available after polyfill');
      return false;
    }

    // Test SHA-256 digest functionality - the exact operation that was failing
    const testData = new TextEncoder().encode('test-crypto-setup');
    const hash = await globalThis.crypto.subtle.digest('SHA-256', testData);
    
    if (!(hash instanceof ArrayBuffer)) {
      console.error('❌ crypto.subtle.digest returned invalid type');
      return false;
    }

    console.log('✅ WebCrypto polyfill validation successful');
    return true;
  } catch (error) {
    console.error('❌ WebCrypto polyfill validation failed:', error);
    return false;
  }
}

// Export for explicit imports if needed
export const crypto = globalThis.crypto;
