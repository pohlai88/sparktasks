import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  LocalStorageDriver,
  SyncLocalStorageDriver,
  createNamespace,
} from '../src/storage/local';

describe('Storage: Local', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('LocalStorageDriver (async)', () => {
    let driver: LocalStorageDriver;

    beforeEach(() => {
      driver = new LocalStorageDriver();
    });

    it('should handle CRUD operations', async () => {
      // Create
      await driver.setItem('test-key', 'test-value');

      // Read
      const value = await driver.getItem('test-key');
      expect(value).toBe('test-value');

      // Update
      await driver.setItem('test-key', 'updated-value');
      const updatedValue = await driver.getItem('test-key');
      expect(updatedValue).toBe('updated-value');

      // Delete
      await driver.removeItem('test-key');
      const deletedValue = await driver.getItem('test-key');
      expect(deletedValue).toBeNull();
    });

    it('should list keys with prefix', async () => {
      // Set up test data
      await driver.setItem('app:user:1', 'user1');
      await driver.setItem('app:user:2', 'user2');
      await driver.setItem('app:task:1', 'task1');
      await driver.setItem('other:data', 'other');

      // List keys with prefix
      const userKeys = await driver.listKeys('app:user:');
      expect(userKeys).toHaveLength(2);
      expect(userKeys).toContain('app:user:1');
      expect(userKeys).toContain('app:user:2');

      const appKeys = await driver.listKeys('app:');
      expect(appKeys).toHaveLength(3);

      const otherKeys = await driver.listKeys('other:');
      expect(otherKeys).toHaveLength(1);
      expect(otherKeys).toContain('other:data');
    });

    it('should return null for non-existent keys', async () => {
      const value = await driver.getItem('non-existent');
      expect(value).toBeNull();
    });

    it('should return empty array for non-matching prefixes', async () => {
      await driver.setItem('app:test', 'value');
      const keys = await driver.listKeys('missing:');
      expect(keys).toHaveLength(0);
    });
  });

  describe('SyncLocalStorageDriver', () => {
    let driver: SyncLocalStorageDriver;

    beforeEach(() => {
      driver = new SyncLocalStorageDriver();
    });

    it('should handle CRUD operations synchronously', () => {
      // Create
      driver.setItem('test-key', 'test-value');

      // Read
      const value = driver.getItem('test-key');
      expect(value).toBe('test-value');

      // Update
      driver.setItem('test-key', 'updated-value');
      const updatedValue = driver.getItem('test-key');
      expect(updatedValue).toBe('updated-value');

      // Delete
      driver.removeItem('test-key');
      const deletedValue = driver.getItem('test-key');
      expect(deletedValue).toBeNull();
    });

    it('should provide namespace isolation', () => {
      const ns1 = createNamespace('app1', driver);
      const ns2 = createNamespace('app2', driver);

      // Set values in different namespaces
      ns1.setItem('user', 'user1');
      ns2.setItem('user', 'user2');

      // Values should be isolated
      expect(ns1.getItem('user')).toBe('user1');
      expect(ns2.getItem('user')).toBe('user2');

      // Check raw storage keys
      expect(driver.getItem('app1:user')).toBe('user1');
      expect(driver.getItem('app2:user')).toBe('user2');
    });

    it('should list namespaced keys correctly', () => {
      const ns = createNamespace('myapp', driver);

      // Set up namespaced data
      ns.setItem('config', 'value1');
      ns.setItem('data', 'value2');
      driver.setItem('global:config', 'global');

      // List keys within namespace
      const keys = ns.listKeys('');
      expect(keys).toHaveLength(2);
      expect(keys).toContain('myapp:config');
      expect(keys).toContain('myapp:data');

      // Should not include global keys
      expect(keys).not.toContain('global:config');
    });
  });
});
