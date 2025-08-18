import { describe, it, expect } from 'vitest';
import { createNamespace, SyncLocalStorageDriver } from '../src/storage/local';

class MockStorageDriver extends SyncLocalStorageDriver {
  private storage = new Map<string, string>();

  getItem(key: string): string | null {
    return this.storage.get(key) || null;
  }

  setItem(key: string, value: string): void {
    this.storage.set(key, value);
  }

  removeItem(key: string): void {
    this.storage.delete(key);
  }

  listKeys(prefix: string): string[] {
    return Array.from(this.storage.keys()).filter(key => key.startsWith(prefix));
  }

  clear(): void {
    this.storage.clear();
  }
}

describe('Storage: Namespace Guard', () => {
  it('should normalize prefix by removing trailing colons', () => {
    const driver = new MockStorageDriver();
    
    // Test various prefix formats
    const ns1 = createNamespace('app', driver);
    const ns2 = createNamespace('app:', driver);
    const ns3 = createNamespace('app::', driver);
    const ns4 = createNamespace('app:::', driver);
    
    // All should normalize to the same prefix
    expect(ns1.prefix).toBe('app');
    expect(ns2.prefix).toBe('app');
    expect(ns3.prefix).toBe('app');
    expect(ns4.prefix).toBe('app');
    
    // All should create the same namespaced keys
    ns1.setItem('key1', 'value1');
    ns2.setItem('key2', 'value2');
    ns3.setItem('key3', 'value3');
    ns4.setItem('key4', 'value4');
    
    // Verify all keys are stored with single colon
    expect(driver.getItem('app:key1')).toBe('value1');
    expect(driver.getItem('app:key2')).toBe('value2');
    expect(driver.getItem('app:key3')).toBe('value3');
    expect(driver.getItem('app:key4')).toBe('value4');
    
    // Should not create double/triple colon keys
    expect(driver.getItem('app::key2')).toBeNull();
    expect(driver.getItem('app:::key4')).toBeNull();
  });

  it('should preserve internal colons in prefix', () => {
    const driver = new MockStorageDriver();
    
    // Test complex prefix with internal colons
    const ns = createNamespace('my:app:v1:', driver);
    
    expect(ns.prefix).toBe('my:app:v1');
    
    ns.setItem('config', 'value');
    expect(driver.getItem('my:app:v1:config')).toBe('value');
  });
});
