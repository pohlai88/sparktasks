/**
 * @fileoverview Vitest Crypto Setup - Enterprise Cryptographic Environment
 *
 * @description Comprehensive crypto API setup for enterprise-grade security testing
 * with support for Web Crypto API, Node.js crypto, and fallback implementations.
 */

import { vi } from 'vitest';

// ===== CRYPTO API SETUP =====

/**
 * Initialize Web Crypto API for test environment
 */
const initializeCrypto = async (): Promise<void> => {
  if (!globalThis.crypto) {
    try {
      // Try @peculiar/webcrypto first (recommended for Node.js)
      const { Crypto } = await import('@peculiar/webcrypto');
      const crypto = new Crypto();
      globalThis.crypto = crypto as any;
      console.info('🔐 @peculiar/webcrypto initialized for testing');
    } catch (error) {
      try {
        // Fallback to Node.js built-in webcrypto
        const { webcrypto } = await import('node:crypto');
        globalThis.crypto = webcrypto as Crypto;
        console.info('🔐 Node.js WebCrypto initialized for testing');
      } catch (fallbackError) {
        // Final fallback with mock implementation
        console.warn('⚠️ Initializing mock crypto implementation for testing');
        initializeMockCrypto();
      }
    }
  }

  // Enhance crypto with additional test utilities
  enhanceCryptoForTesting();
};

/**
 * Mock crypto implementation for environments where real crypto is unavailable
 */
const initializeMockCrypto = (): void => {
  const mockCrypto = {
    // Random values generation
    getRandomValues: vi.fn().mockImplementation((array: Uint8Array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    }),

    // UUID generation
    randomUUID: vi.fn().mockImplementation(() => {
      return `test-${Math.random().toString(36).substr(2, 8)}-${Math.random().toString(36).substr(2, 4)}-4${Math.random().toString(36).substr(2, 3)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 12)}`;
    }),

    // Subtle crypto mock
    subtle: {
      encrypt: vi.fn().mockResolvedValue(new ArrayBuffer(32)),
      decrypt: vi.fn().mockResolvedValue(new ArrayBuffer(32)),
      sign: vi.fn().mockResolvedValue(new ArrayBuffer(64)),
      verify: vi.fn().mockResolvedValue(true),
      digest: vi.fn().mockResolvedValue(new ArrayBuffer(32)),
      generateKey: vi.fn().mockResolvedValue({
        publicKey: { type: 'public' },
        privateKey: { type: 'private' },
      }),
      importKey: vi.fn().mockResolvedValue({ type: 'secret' }),
      exportKey: vi.fn().mockResolvedValue(new ArrayBuffer(32)),
      deriveBits: vi.fn().mockResolvedValue(new ArrayBuffer(32)),
      deriveKey: vi.fn().mockResolvedValue({ type: 'secret' }),
      wrapKey: vi.fn().mockResolvedValue(new ArrayBuffer(32)),
      unwrapKey: vi.fn().mockResolvedValue({ type: 'secret' }),
    },
  };

  globalThis.crypto = mockCrypto as any;
};

/**
 * Enhance crypto with testing utilities
 */
const enhanceCryptoForTesting = (): void => {
  // Add deterministic random for consistent testing
  const originalGetRandomValues = globalThis.crypto.getRandomValues.bind(
    globalThis.crypto
  );
  const originalRandomUUID = globalThis.crypto.randomUUID?.bind(
    globalThis.crypto
  );

  // Deterministic mode flag
  let deterministicMode = false;
  let seedValue = 12345;

  // Simple PRNG for deterministic testing
  const deterministicRandom = () => {
    seedValue = (seedValue * 9301 + 49297) % 233280;
    return seedValue / 233280;
  };

  // Enhanced getRandomValues with deterministic option
  globalThis.crypto.getRandomValues = vi
    .fn()
    .mockImplementation((array: Uint8Array) => {
      if (deterministicMode) {
        for (let i = 0; i < array.length; i++) {
          array[i] = Math.floor(deterministicRandom() * 256);
        }
        return array;
      }
      return originalGetRandomValues(array);
    });

  // Enhanced randomUUID with deterministic option
  if (globalThis.crypto.randomUUID) {
    globalThis.crypto.randomUUID = vi.fn().mockImplementation(() => {
      if (deterministicMode) {
        const rand = () => Math.floor(deterministicRandom() * 16).toString(16);
        return `${rand()}${rand()}${rand()}${rand()}${rand()}${rand()}${rand()}${rand()}-${rand()}${rand()}${rand()}${rand()}-4${rand()}${rand()}${rand()}-${rand()}${rand()}${rand()}${rand()}-${rand()}${rand()}${rand()}${rand()}${rand()}${rand()}${rand()}${rand()}${rand()}${rand()}${rand()}${rand()}`;
      }
      return (
        originalRandomUUID?.() ||
        `test-${Math.random().toString(36).substr(2, 15)}`
      );
    });
  }

  // Test utilities
  (globalThis as any).cryptoTestUtils = {
    enableDeterministicMode: (seed: number = 12345) => {
      deterministicMode = true;
      seedValue = seed;
      console.debug('🎯 Crypto deterministic mode enabled');
    },
    disableDeterministicMode: () => {
      deterministicMode = false;
      console.debug('🎯 Crypto deterministic mode disabled');
    },
    resetSeed: (seed: number = 12345) => {
      seedValue = seed;
    },
  };
};

// ===== ADDITIONAL CRYPTO UTILITIES =====

/**
 * Text encoder/decoder for crypto operations
 */
if (!globalThis.TextEncoder) {
  globalThis.TextEncoder = class TextEncoder {
    encode(input: string = ''): Uint8Array {
      const bytes = new Uint8Array(input.length);
      for (let i = 0; i < input.length; i++) {
        bytes[i] = input.charCodeAt(i);
      }
      return bytes;
    }

    get encoding(): string {
      return 'utf-8';
    }
  } as any;
}

if (!globalThis.TextDecoder) {
  globalThis.TextDecoder = class TextDecoder {
    decode(input?: BufferSource): string {
      if (!input) return '';
      const bytes = new Uint8Array(input as ArrayBuffer);
      return Array.from(bytes)
        .map(byte => String.fromCharCode(byte))
        .join('');
    }

    get encoding(): string {
      return 'utf-8';
    }

    get fatal(): boolean {
      return false;
    }

    get ignoreBOM(): boolean {
      return false;
    }
  } as any;
}

/**
 * Crypto test helpers
 */
export const cryptoTestHelpers = {
  /**
   * Generate test key for encryption/decryption tests
   */
  generateTestKey: async (): Promise<CryptoKey> => {
    return (await globalThis.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    )) as CryptoKey;
  },

  /**
   * Generate test data of specified size
   */
  generateTestData: (size: number): Uint8Array => {
    const data = new Uint8Array(size);
    globalThis.crypto.getRandomValues(data);
    return data;
  },

  /**
   * Create test hash
   */
  createTestHash: async (data: string): Promise<ArrayBuffer> => {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    return await globalThis.crypto.subtle.digest('SHA-256', dataBuffer);
  },

  /**
   * Compare two array buffers for equality
   */
  compareBuffers: (buffer1: ArrayBuffer, buffer2: ArrayBuffer): boolean => {
    if (buffer1.byteLength !== buffer2.byteLength) return false;
    const view1 = new Uint8Array(buffer1);
    const view2 = new Uint8Array(buffer2);
    for (let i = 0; i < view1.length; i++) {
      if (view1[i] !== view2[i]) return false;
    }
    return true;
  },

  /**
   * Convert buffer to hex string
   */
  bufferToHex: (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    return Array.from(bytes)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
  },

  /**
   * Convert hex string to buffer
   */
  hexToBuffer: (hex: string): ArrayBuffer => {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes.buffer;
  },
};

// Make helpers available globally
(globalThis as any).cryptoTestHelpers = cryptoTestHelpers;

// Initialize crypto environment
initializeCrypto().catch(error => {
  console.error('Failed to initialize crypto environment:', error);
  initializeMockCrypto();
});

/**
 * Validate crypto setup - equivalent to the legacy validateCryptoSetup function
 */
export const validateCryptoSetup = async (): Promise<boolean> => {
  try {
    // Test basic crypto availability
    if (!globalThis.crypto?.subtle) {
      console.error('❌ crypto.subtle not available after polyfill');
      return false;
    }

    // Test SHA-256 digest functionality
    const testData = new TextEncoder().encode('test-crypto-setup');
    const hash = await globalThis.crypto.subtle.digest('SHA-256', testData);

    // Check if we got a valid hash result (ArrayBuffer or Buffer-like object)
    if (!hash || typeof hash !== 'object' || !('byteLength' in (hash as any))) {
      console.error(
        '❌ crypto.subtle.digest returned invalid type:',
        typeof hash,
        hash
      );
      return false;
    }

    console.log('✅ WebCrypto polyfill validation successful');
    return true;
  } catch (error) {
    console.error('❌ WebCrypto polyfill validation failed:', error);
    return false;
  }
};

console.info(
  '🔐 Vitest crypto environment configured with enterprise security testing support'
);
