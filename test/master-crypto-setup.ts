/**
 * Master Test Setup - WebCrypto & Environment
 * Reusable test setup file that handles crypto polyfill injection cleanly across all test suites
 */

import { Crypto } from '@peculiar/webcrypto';
import { vi } from 'vitest';

// ================================
// WebCrypto Polyfill Setup
// ================================

/**
 * Injects WebCrypto polyfill for Node.js test environment
 * Handles various edge cases and provides comprehensive crypto support
 */
function injectWebCryptoPolyfill(): boolean {
  try {
    // Check if crypto.subtle is already available
    if (globalThis.crypto?.subtle) {
      console.log('✅ crypto.subtle already available');
      return true;
    }

    const webCrypto = new Crypto();

    // Strategy 1: Direct assignment
    try {
      globalThis.crypto = webCrypto;
      if (globalThis.crypto?.subtle) {
        console.log('🔧 WebCrypto polyfill injected via direct assignment');
        return true;
      }
    } catch (error) {
      // Continue to next strategy
    }

    // Strategy 2: Object.defineProperty (handles read-only globalThis.crypto)
    try {
      Object.defineProperty(globalThis, 'crypto', {
        value: webCrypto,
        configurable: true,
        writable: true,
        enumerable: true
      });
      if (globalThis.crypto?.subtle) {
        console.log('🔧 WebCrypto polyfill injected via defineProperty');
        return true;
      }
    } catch (error) {
      // Continue to next strategy
    }

    // Strategy 3: Property patching (fallback)
    try {
      if (!globalThis.crypto) {
        (globalThis as any).crypto = {};
      }
      (globalThis.crypto as any).subtle = webCrypto.subtle;
      (globalThis.crypto as any).getRandomValues = webCrypto.getRandomValues.bind(webCrypto);
      
      if (globalThis.crypto?.subtle) {
        console.log('🔧 WebCrypto polyfill injected via property patching');
        return true;
      }
    } catch (error) {
      console.error('❌ All WebCrypto polyfill strategies failed:', error);
      return false;
    }

    return false;
  } catch (error) {
    console.error('❌ WebCrypto polyfill injection failed:', error);
    return false;
  }
}

// ================================
// Crypto Validation & Testing
// ================================

/**
 * Comprehensive crypto environment validation
 * Tests all crypto operations that the trust system requires
 */
export async function validateCryptoEnvironment(): Promise<{
  valid: boolean;
  crypto: boolean;
  subtle: boolean;
  sha256: boolean;
  ed25519: boolean;
  errors: string[];
}> {
  const result = {
    valid: false,
    crypto: false,
    subtle: false,
    sha256: false,
    ed25519: false,
    errors: [] as string[]
  };

  try {
    // Test 1: Basic crypto availability
    if (!globalThis.crypto) {
      result.errors.push('globalThis.crypto not available');
      return result;
    }
    result.crypto = true;

    // Test 2: crypto.subtle availability
    if (!globalThis.crypto.subtle) {
      result.errors.push('crypto.subtle not available');
      return result;
    }
    result.subtle = true;

    // Test 3: SHA-256 digest functionality
    try {
      const testData = new TextEncoder().encode('test-sha256');
      const hash = await globalThis.crypto.subtle.digest('SHA-256', testData);
      if (hash instanceof ArrayBuffer && hash.byteLength === 32) {
        result.sha256 = true;
      } else {
        result.errors.push('SHA-256 digest returned invalid result');
      }
    } catch (error) {
      result.errors.push(`SHA-256 digest failed: ${error}`);
    }

    // Test 4: Ed25519 key operations
    try {
      const keyPair = await globalThis.crypto.subtle.generateKey(
        { name: 'Ed25519' },
        true,
        ['sign', 'verify']
      );
      
      if (keyPair.publicKey && keyPair.privateKey) {
        // Test signing
        const testMessage = new TextEncoder().encode('test-ed25519');
        const signature = await globalThis.crypto.subtle.sign(
          'Ed25519',
          keyPair.privateKey,
          testMessage
        );
        
        // Test verification
        const isValid = await globalThis.crypto.subtle.verify(
          'Ed25519',
          keyPair.publicKey,
          signature,
          testMessage
        );
        
        if (isValid) {
          result.ed25519 = true;
        } else {
          result.errors.push('Ed25519 signature verification failed');
        }
      } else {
        result.errors.push('Ed25519 key generation returned invalid keys');
      }
    } catch (error) {
      result.errors.push(`Ed25519 operations failed: ${error}`);
    }

    // Overall validation
    result.valid = result.crypto && result.subtle && result.sha256 && result.ed25519;
    
    if (result.valid) {
      console.log('✅ Complete crypto environment validation successful');
    } else {
      console.error('❌ Crypto environment validation failed:', result.errors);
    }

    return result;
  } catch (error) {
    result.errors.push(`Validation failed: ${error}`);
    return result;
  }
}

// ================================
// Test Utilities
// ================================

/**
 * Creates a mock crypto environment for tests that don't need real crypto
 * Useful for testing business logic without crypto dependencies
 */
export function createMockCryptoEnvironment() {
  const mockCrypto = {
    subtle: {
      digest: vi.fn().mockResolvedValue(new ArrayBuffer(32)),
      generateKey: vi.fn().mockResolvedValue({
        publicKey: { type: 'public' },
        privateKey: { type: 'private' }
      }),
      sign: vi.fn().mockResolvedValue(new ArrayBuffer(64)),
      verify: vi.fn().mockResolvedValue(true)
    },
    getRandomValues: vi.fn().mockImplementation((array: any) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    })
  };

  return mockCrypto;
}

/**
 * Ensures crypto environment is ready for testing
 * Call this in beforeEach or beforeAll hooks
 */
export async function ensureCryptoEnvironment(): Promise<boolean> {
  const injected = injectWebCryptoPolyfill();
  if (!injected) {
    console.error('❌ Failed to inject WebCrypto polyfill');
    return false;
  }

  const validation = await validateCryptoEnvironment();
  if (!validation.valid) {
    console.error('❌ Crypto environment validation failed:', validation.errors);
    return false;
  }

  return true;
}

// ================================
// Auto-setup (runs when imported)
// ================================

// Automatically inject polyfill when this module is imported
const setupSuccess = injectWebCryptoPolyfill();
if (!setupSuccess) {
  console.warn('⚠️ WebCrypto polyfill injection failed during module import');
}

// Export the crypto object for convenience
export const crypto = globalThis.crypto;

// Export validation functions
export { injectWebCryptoPolyfill };
