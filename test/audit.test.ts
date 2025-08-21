/**
 * Audit Log Tests - Phase B Task 12
 * Testing tamper-evident, encrypted, append-only audit trail
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as AuditApi from '../src/audit/api';
import type { AuditEntry } from '../src/audit/types';
import type { StorageDriver } from '../src/storage/types';

// Set up WebCrypto for Node.js test environment
if (!globalThis.crypto.subtle) {
  Object.defineProperty(globalThis, 'crypto', {
    value: require('node:crypto').webcrypto,
    writable: false,
  });
}

// Simple mock storage for testing
class MockStorage implements StorageDriver {
  private data = new Map<string, string>();

  async getItem(key: string): Promise<string | null> {
    return this.data.get(key) || null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.data.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.data.delete(key);
  }

  async listKeys(prefix: string): Promise<string[]> {
    return Array.from(this.data.keys()).filter(key => key.startsWith(prefix));
  }
}

describe('Transparent Audit Log (Headless)', () => {
  let storage: MockStorage;

  beforeEach(() => {
    storage = new MockStorage();
    AuditApi.configureAudit(storage, 'test');
  });

  describe('Basic Logging', () => {
    it('should log audit entries with hash chaining', async () => {
      // First entry
      const entry1 = await AuditApi.log(
        'INVITE_CREATED',
        { inviteId: 'invite-123' },
        'user-1'
      );
      expect(entry1.v).toBe(1);
      expect(entry1.type).toBe('INVITE_CREATED');
      expect(entry1.actor).toBe('user-1');
      expect(entry1.ctx?.inviteId).toBe('invite-123');
      expect(entry1.prev).toBeUndefined(); // First entry has no previous
      expect(entry1.hash).toBeDefined();

      // Second entry should chain to first
      const entry2 = await AuditApi.log(
        'INVITE_ACCEPTED',
        { inviteId: 'invite-123' },
        'user-2'
      );
      expect(entry2.prev).toBe(entry1.hash);
      expect(entry2.hash).toBeDefined();
      expect(entry2.hash).not.toBe(entry1.hash);

      // Third entry should chain to second
      const entry3 = await AuditApi.log('DEK_ROTATED', { keyId: 'key-456' });
      expect(entry3.prev).toBe(entry2.hash);
      expect(entry3.actor).toBeUndefined(); // No actor provided
    });

    it('should redact sensitive information', async () => {
      const entry = await AuditApi.log('RECOVERY_BUNDLE_CREATED', {
        passcode: 'secret123',
        ctB64u: 'encrypted-data',
        ivB64u: 'iv-data',
        wrapped: 'wrapped-key',
        publicInfo: 'safe-data',
      });

      expect(entry.ctx?.passcode).toBe('***');
      expect(entry.ctx?.ctB64u).toBe('***');
      expect(entry.ctx?.ivB64u).toBe('***');
      expect(entry.ctx?.wrapped).toBe('***');
      expect(entry.ctx?.publicInfo).toBe('safe-data');
    });

    it('should truncate overly large values', async () => {
      const largeData = 'x'.repeat(300);
      const entry = await AuditApi.log('ERROR', { largeField: largeData });

      expect(entry.ctx?.largeField).toBe('x'.repeat(200) + '...');
    });
  });

  describe('Query and Pagination', () => {
    beforeEach(async () => {
      // Create test data
      await AuditApi.log('INVITE_CREATED', { id: '1' });
      await new Promise(resolve => setTimeout(resolve, 5)); // Small delay
      await AuditApi.log('INVITE_ACCEPTED', { id: '2' });
      await new Promise(resolve => setTimeout(resolve, 5));
      await AuditApi.log('DEVICE_UNLINKED', { id: '3' });
      await new Promise(resolve => setTimeout(resolve, 5));
      await AuditApi.log('RECOVERY_USED', { id: '4' });
    });

    it('should list entries in chronological order', async () => {
      const result = await AuditApi.list();

      expect(result.items).toHaveLength(4);
      expect(result.items[0]!.type).toBe('INVITE_CREATED');
      expect(result.items[1]!.type).toBe('INVITE_ACCEPTED');
      expect(result.items[2]!.type).toBe('DEVICE_UNLINKED');
      expect(result.items[3]!.type).toBe('RECOVERY_USED');
    });

    it('should support pagination with limit', async () => {
      const page1 = await AuditApi.list({ limit: 2 });

      expect(page1.items).toHaveLength(2);
      expect(page1.nextCursor).toBeDefined();
      expect(page1.items[0]!.type).toBe('INVITE_CREATED');
      expect(page1.items[1]!.type).toBe('INVITE_ACCEPTED');

      if (page1.nextCursor) {
        const page2 = await AuditApi.list({
          limit: 2,
          cursor: page1.nextCursor,
        });

        expect(page2.items).toHaveLength(2);
        expect(page2.items[0]!.type).toBe('DEVICE_UNLINKED');
        expect(page2.items[1]!.type).toBe('RECOVERY_USED');
        expect(page2.nextCursor).toBeUndefined(); // No more pages
      }
    });

    it('should support time-based filtering', async () => {
      const allEntries = await AuditApi.list();
      const midTime = allEntries.items[1]!.ts;

      // Get entries since mid time
      const sinceResult = await AuditApi.list({ since: midTime });
      expect(sinceResult.items.length).toBeGreaterThanOrEqual(2);

      // Get entries until mid time
      const untilResult = await AuditApi.list({ until: midTime });
      expect(untilResult.items.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Export and Chain Verification', () => {
    let testEntries: AuditEntry[];

    beforeEach(async () => {
      // Create a chain of entries
      await AuditApi.log('INVITE_CREATED', { step: 1 });
      await AuditApi.log('INVITE_ACCEPTED', { step: 2 });
      await AuditApi.log('SYNC_RUN', { step: 3 });

      const exported = await AuditApi.exportAll();
      testEntries = exported.items;
    });

    it('should export all entries with valid chain', async () => {
      const result = await AuditApi.exportAll();

      expect(result.items).toHaveLength(3);
      expect(result.valid).toBe(true);
      expect(result.items[0]!.ctx?.step).toBe(1);
      expect(result.items[1]!.ctx?.step).toBe(2);
      expect(result.items[2]!.ctx?.step).toBe(3);
    });

    it('should detect tampered entries', async () => {
      // Tamper with an entry by modifying its context
      const tamperedEntries = [...testEntries];
      const entry = tamperedEntries[1]!;
      tamperedEntries[1] = {
        ...entry,
        ctx: { ...(entry.ctx || {}), step: 999 },
      };

      const isValid = await AuditApi.verifyChain(tamperedEntries);
      expect(isValid).toBe(false);
    });

    it('should detect broken chain links', async () => {
      // Break the chain by modifying a hash
      const brokenEntries = [...testEntries];
      const entry = brokenEntries[1]!;
      brokenEntries[1] = {
        ...entry,
        prev: 'fake-hash',
      };

      const isValid = await AuditApi.verifyChain(brokenEntries);
      expect(isValid).toBe(false);
    });

    it('should detect missing entries', async () => {
      // Remove middle entry
      const incompleteEntries = [testEntries[0]!, testEntries[2]!];

      const isValid = await AuditApi.verifyChain(incompleteEntries);
      expect(isValid).toBe(false);
    });

    it('should verify empty chain as valid', async () => {
      const isValid = await AuditApi.verifyChain([]);
      expect(isValid).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should throw error when not configured', async () => {
      AuditApi.configureAudit(storage, ''); // Reset configuration

      await expect(AuditApi.log('ERROR', {})).rejects.toThrow(
        'Audit not configured'
      );

      await expect(AuditApi.list()).rejects.toThrow('Audit not configured');

      await expect(AuditApi.exportAll()).rejects.toThrow(
        'Audit not configured'
      );
    });

    it('should handle storage errors gracefully', async () => {
      // Mock storage that throws errors
      const faultyStorage: StorageDriver = {
        getItem: async () => {
          throw new Error('Storage error');
        },
        setItem: async () => {
          throw new Error('Storage error');
        },
        removeItem: async () => {
          throw new Error('Storage error');
        },
        listKeys: async () => [], // Return empty array instead of throwing
      };

      AuditApi.configureAudit(faultyStorage, 'test');

      // Should not throw, but handle gracefully
      const result = await AuditApi.list();
      expect(result.items).toHaveLength(0);
    });
  });

  describe('Event Types Coverage', () => {
    it('should support all required event types', async () => {
      const events = [
        'INVITE_CREATED',
        'INVITE_ACCEPTED',
        'INVITE_REVOKED',
        'DEVICE_UNLINKED',
        'DEK_ROTATED',
        'RECOVERY_BUNDLE_CREATED',
        'RECOVERY_USED',
        'SYNC_RUN',
        'MAINTENANCE_RUN',
        'ERROR',
      ] as const;

      for (const eventType of events) {
        const entry = await AuditApi.log(eventType, { test: true });
        expect(entry.type).toBe(eventType);
      }

      const exported = await AuditApi.exportAll();
      expect(exported.items).toHaveLength(events.length);
      expect(exported.valid).toBe(true);
    });
  });

  describe('Namespace Isolation', () => {
    it('should isolate audit logs by namespace', async () => {
      // Configure different namespace
      const storage2 = new MockStorage();
      AuditApi.configureAudit(storage2, 'other-ns');

      await AuditApi.log('INVITE_CREATED', { ns: 'other' });

      // Switch back to original namespace
      AuditApi.configureAudit(storage, 'test');
      await AuditApi.log('INVITE_CREATED', { ns: 'test' });

      const result = await AuditApi.list();
      expect(result.items).toHaveLength(1);
      expect(result.items[0]!.ctx?.ns).toBe('test');
    });
  });
});
