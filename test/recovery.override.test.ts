/**
 * Recovery Override Tests - Phase B Task 16
 * Testing admin-only recovery overrides for lost passphrase scenarios
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { createRecoveryOverride } from '../src/recovery/override.create';
import { acceptRecoveryOverride } from '../src/recovery/override.accept';
import type { MembershipApi } from '../src/recovery/override.types';
import type { MState } from '../src/membership/types';
import type { StorageDriver } from '../src/storage/types';
import { KeyringProvider } from '../src/crypto/keyring';
import * as MembershipApiModule from '../src/membership/api';
import * as AuditApiModule from '../src/audit/api';

// Set up WebCrypto for Node.js testing
if (!globalThis.crypto.subtle) {
  Object.defineProperty(globalThis, 'crypto', {
    value: require('node:crypto').webcrypto,
    writable: false,
  });
}

// Mock storage for testing
class MockStorage implements StorageDriver {
  private store = new Map<string, string>();

  async getItem(key: string): Promise<string | null> {
    return this.store.get(key) || null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.store.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.store.delete(key);
  }

  async listKeys(prefix?: string): Promise<string[]> {
    const keys = Array.from(this.store.keys());
    return prefix ? keys.filter(k => k.startsWith(prefix)) : keys;
  }

  clear(): void {
    this.store.clear();
  }
}

// Mock membership API
function createMockMembershipApi(membershipState: MState): MembershipApi {
  return {
    getMembership: vi.fn().mockResolvedValue(membershipState),
  };
}

// Mock Ed25519 signing function
async function createMockSigner(): Promise<
  (bytes: Uint8Array) => Promise<string>
> {
  return async (bytes: Uint8Array): Promise<string> => {
    // Create a mock signature based on input
    const normalizedBytes = new Uint8Array(bytes);
    const hash = await crypto.subtle.digest('SHA-256', normalizedBytes);
    const hashArray = new Uint8Array(hash);
    return btoa(String.fromCharCode(...hashArray))
      .replace(/[+/]/g, '')
      .slice(0, 64);
  };
}

describe('Recovery Override System', () => {
  let storage: MockStorage;
  let keyring: KeyringProvider;
  let mockMembershipState: MState;
  let membership: MembershipApi;
  let sign: (bytes: Uint8Array) => Promise<string>;

  beforeEach(async () => {
    // Setup storage and keyring
    storage = new MockStorage();
    keyring = new KeyringProvider(storage, 'test');
    await keyring.initNew('test-passphrase');
    await keyring.rotate(); // Create some DEKs
    await keyring.rotate(); // Create more DEKs for testing

    // Setup mock membership state
    mockMembershipState = {
      users: {
        'owner-user': 'OWNER',
        'admin-user': 'ADMIN',
        'member-user': 'MEMBER',
        'viewer-user': 'VIEWER',
        'beneficiary-user': 'MEMBER',
      },
      owners: ['owner-user'],
    };
    membership = createMockMembershipApi(mockMembershipState);

    // Setup mock signer
    sign = await createMockSigner();

    // Mock the membership module functions
    vi.spyOn(MembershipApiModule, 'assertPermission').mockResolvedValue(
      undefined
    );
    vi.spyOn(MembershipApiModule, 'getMembership').mockResolvedValue(
      mockMembershipState
    );

    // Mock audit module
    vi.spyOn(AuditApiModule, 'log').mockResolvedValue({
      v: 1,
      id: 'mock-audit-id',
      ts: new Date().toISOString(),
      type: 'RECOVERY_OVERRIDE_CREATED',
      hash: 'mock-hash',
    } as any);
  });

  describe('Permission Matrix', () => {
    test('OWNER can create override for OWNER', async () => {
      const result = await createRecoveryOverride({
        ns: 'test',
        actorId: 'owner-user',
        beneficiaryId: 'owner-user',
        code: 'OVERRIDE123',
        sign,
      });

      expect(result.envelope).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.envelope.content.beneficiaryId).toBe('owner-user');
    });

    test('ADMIN can create override for MEMBER', async () => {
      const result = await createRecoveryOverride({
        ns: 'test',
        actorId: 'admin-user',
        beneficiaryId: 'member-user',
        code: 'OVERRIDE456',
        sign,
      });

      expect(result.envelope).toBeDefined();
      expect(result.envelope.content.beneficiaryId).toBe('member-user');
    });

    test('ADMIN cannot create override for OWNER', async () => {
      // Mock permission check to throw error
      vi.spyOn(MembershipApiModule, 'getMembership').mockResolvedValue(
        mockMembershipState
      );

      await expect(
        createRecoveryOverride({
          ns: 'test',
          actorId: 'admin-user',
          beneficiaryId: 'owner-user',
          code: 'OVERRIDE789',
          sign,
        })
      ).rejects.toThrow('cannot create override for OWNER');
    });

    test('MEMBER cannot create override for anyone', async () => {
      await expect(
        createRecoveryOverride({
          ns: 'test',
          actorId: 'member-user',
          beneficiaryId: 'viewer-user',
          code: 'OVERRIDE999',
          sign,
        })
      ).rejects.toThrow('cannot create override for VIEWER');
    });
  });

  describe('Override Creation', () => {
    test('creates valid override with ALL scope by default', async () => {
      const result = await createRecoveryOverride({
        ns: 'test',
        actorId: 'owner-user',
        beneficiaryId: 'beneficiary-user',
        code: 'RECOVERY123',
        sign,
      });

      expect(result.envelope.v).toBe(1);
      expect(result.envelope.content.ns).toBe('test');
      expect(result.envelope.content.beneficiaryId).toBe('beneficiary-user');
      expect(result.envelope.content.scope).toBe('ALL');
      expect(result.envelope.content.saltB64u).toBeDefined();
      expect(result.envelope.ctB64u).toBeDefined();
      expect(result.envelope.ivB64u).toBeDefined();
      expect(result.envelope.sigB64u).toBeDefined();
    });

    test('creates override with ACTIVE scope', async () => {
      const result = await createRecoveryOverride({
        ns: 'test',
        actorId: 'owner-user',
        beneficiaryId: 'beneficiary-user',
        code: 'RECOVERY456',
        scope: 'ACTIVE',
        sign,
      });

      expect(result.envelope.content.scope).toBe('ACTIVE');
    });

    test('creates override with expiry', async () => {
      const expiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toISOString();

      const result = await createRecoveryOverride({
        ns: 'test',
        actorId: 'owner-user',
        beneficiaryId: 'beneficiary-user',
        code: 'RECOVERY789',
        expiresAt,
        sign,
      });

      expect(result.envelope.content.exp).toBe(expiresAt);
    });

    test('throws for unknown beneficiary', async () => {
      await expect(
        createRecoveryOverride({
          ns: 'test',
          actorId: 'owner-user',
          beneficiaryId: 'unknown-user',
          code: 'RECOVERY999',
          sign,
        })
      ).rejects.toThrow('Beneficiary unknown-user not found in workspace');
    });
  });

  describe('Override Acceptance', () => {
    test('accepts valid override with correct code', async () => {
      const { envelope } = await createRecoveryOverride({
        ns: 'test',
        actorId: 'owner-user',
        beneficiaryId: 'beneficiary-user',
        code: 'ACCEPT123',
        sign,
      });

      const result = await acceptRecoveryOverride({
        ns: 'test',
        envelope,
        code: 'ACCEPT123',
        keyring,
        beneficiaryId: 'beneficiary-user',
        membership,
      });

      expect(result.imported).toBeGreaterThanOrEqual(0);
      expect(result.scope).toBe('ALL');
    });

    test('rejects override with wrong code', async () => {
      const { envelope } = await createRecoveryOverride({
        ns: 'test',
        actorId: 'owner-user',
        beneficiaryId: 'beneficiary-user',
        code: 'CORRECT123',
        sign,
      });

      await expect(
        acceptRecoveryOverride({
          ns: 'test',
          envelope,
          code: 'WRONG123',
          keyring,
          beneficiaryId: 'beneficiary-user',
          membership,
        })
      ).rejects.toThrow('Invalid recovery code or corrupted override');
    });

    test('rejects expired override', async () => {
      const expiresAt = new Date(Date.now() - 60000).toISOString(); // 1 minute ago

      const { envelope } = await createRecoveryOverride({
        ns: 'test',
        actorId: 'owner-user',
        beneficiaryId: 'beneficiary-user',
        code: 'EXPIRED123',
        expiresAt,
        sign,
      });

      await expect(
        acceptRecoveryOverride({
          ns: 'test',
          envelope,
          code: 'EXPIRED123',
          keyring,
          beneficiaryId: 'beneficiary-user',
          membership,
        })
      ).rejects.toThrow('Recovery override expired');
    });

    test('rejects beneficiary mismatch', async () => {
      const { envelope } = await createRecoveryOverride({
        ns: 'test',
        actorId: 'owner-user',
        beneficiaryId: 'beneficiary-user',
        code: 'MISMATCH123',
        sign,
      });

      await expect(
        acceptRecoveryOverride({
          ns: 'test',
          envelope,
          code: 'MISMATCH123',
          keyring,
          beneficiaryId: 'wrong-user',
          membership,
        })
      ).rejects.toThrow('Beneficiary mismatch');
    });

    test('rejects namespace mismatch', async () => {
      const { envelope } = await createRecoveryOverride({
        ns: 'original',
        actorId: 'owner-user',
        beneficiaryId: 'beneficiary-user',
        code: 'NAMESPACE123',
        sign,
      });

      await expect(
        acceptRecoveryOverride({
          ns: 'different',
          envelope,
          code: 'NAMESPACE123',
          keyring,
          beneficiaryId: 'beneficiary-user',
          membership,
        })
      ).rejects.toThrow('Namespace mismatch');
    });

    test('enforces single-use constraint', async () => {
      const { envelope } = await createRecoveryOverride({
        ns: 'test',
        actorId: 'owner-user',
        beneficiaryId: 'beneficiary-user',
        code: 'SINGLE123',
        sign,
      });

      // First use should succeed
      await acceptRecoveryOverride({
        ns: 'test',
        envelope,
        code: 'SINGLE123',
        keyring,
        beneficiaryId: 'beneficiary-user',
        membership,
      });

      // Second use should fail
      await expect(
        acceptRecoveryOverride({
          ns: 'test',
          envelope,
          code: 'SINGLE123',
          keyring,
          beneficiaryId: 'beneficiary-user',
          membership,
        })
      ).rejects.toThrow('Recovery override already used');
    });

    test('handles ACTIVE scope correctly', async () => {
      const { envelope } = await createRecoveryOverride({
        ns: 'test',
        actorId: 'owner-user',
        beneficiaryId: 'beneficiary-user',
        code: 'ACTIVE123',
        scope: 'ACTIVE',
        sign,
      });

      const result = await acceptRecoveryOverride({
        ns: 'test',
        envelope,
        code: 'ACTIVE123',
        keyring,
        beneficiaryId: 'beneficiary-user',
        membership,
      });

      expect(result.scope).toBe('ACTIVE');
    });
  });

  describe('Security Features', () => {
    test('rejects tampered envelope', async () => {
      const { envelope } = await createRecoveryOverride({
        ns: 'test',
        actorId: 'owner-user',
        beneficiaryId: 'beneficiary-user',
        code: 'TAMPER123',
        sign,
      });

      // Tamper with ciphertext
      const tamperedEnvelope = {
        ...envelope,
        ctB64u: envelope.ctB64u.slice(0, -4) + 'XXXX',
      };

      await expect(
        acceptRecoveryOverride({
          ns: 'test',
          envelope: tamperedEnvelope,
          code: 'TAMPER123',
          keyring,
          beneficiaryId: 'beneficiary-user',
          membership,
        })
      ).rejects.toThrow('Invalid recovery code or corrupted override');
    });

    test('rejects override without signature', async () => {
      const { envelope } = await createRecoveryOverride({
        ns: 'test',
        actorId: 'owner-user',
        beneficiaryId: 'beneficiary-user',
        code: 'NOSIG123',
        sign,
      });

      const nosigEnvelope = { ...envelope, sigB64u: '' };

      await expect(
        acceptRecoveryOverride({
          ns: 'test',
          envelope: nosigEnvelope,
          code: 'NOSIG123',
          keyring,
          beneficiaryId: 'beneficiary-user',
          membership,
        })
      ).rejects.toThrow('Invalid or missing signature');
    });

    test('validates beneficiary exists in workspace', async () => {
      const { envelope } = await createRecoveryOverride({
        ns: 'test',
        actorId: 'owner-user',
        beneficiaryId: 'beneficiary-user',
        code: 'EXIST123',
        sign,
      });

      // Mock membership without beneficiary
      const emptyMembership = createMockMembershipApi({
        users: {},
        owners: [],
      });

      await expect(
        acceptRecoveryOverride({
          ns: 'test',
          envelope,
          code: 'EXIST123',
          keyring,
          beneficiaryId: 'beneficiary-user',
          membership: emptyMembership,
        })
      ).rejects.toThrow('Beneficiary beneficiary-user not found in workspace');
    });
  });

  describe('Audit Integration', () => {
    test('logs override creation events', async () => {
      await createRecoveryOverride({
        ns: 'test',
        actorId: 'owner-user',
        beneficiaryId: 'beneficiary-user',
        code: 'AUDIT123',
        sign,
      });

      expect(AuditApiModule.log).toHaveBeenCalledWith(
        'RECOVERY_OVERRIDE_CREATED',
        expect.objectContaining({
          beneficiaryId: 'beneficiary-user',
          scope: 'ALL',
        }),
        'owner-user'
      );
    });

    test('logs override acceptance events', async () => {
      const { envelope } = await createRecoveryOverride({
        ns: 'test',
        actorId: 'owner-user',
        beneficiaryId: 'beneficiary-user',
        code: 'AUDITUSE123',
        sign,
      });

      await acceptRecoveryOverride({
        ns: 'test',
        envelope,
        code: 'AUDITUSE123',
        keyring,
        beneficiaryId: 'beneficiary-user',
        membership,
      });

      expect(AuditApiModule.log).toHaveBeenCalledWith(
        'RECOVERY_OVERRIDE_USED',
        expect.objectContaining({
          beneficiaryId: 'beneficiary-user',
          scope: 'ALL',
        }),
        'beneficiary-user'
      );
    });
  });
});
