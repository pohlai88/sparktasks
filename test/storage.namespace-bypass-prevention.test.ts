import { describe, it, expect } from 'vitest';
import { createNamespace, SyncLocalStorageDriver } from '../src/storage/local';

class BypassDetectionDriver extends SyncLocalStorageDriver {
  private storage = new Map<string, string>();
  private directAccessLog: Array<{ key: string; operation: string }> = [];

  getItem(key: string): string | null {
    this.logDirectAccess(key, 'getItem');
    return this.storage.get(key) || null;
  }

  setItem(key: string, value: string): void {
    this.logDirectAccess(key, 'setItem');
    this.storage.set(key, value);
  }

  removeItem(key: string): void {
    this.logDirectAccess(key, 'removeItem');
    this.storage.delete(key);
  }

  listKeys(prefix: string): string[] {
    this.logDirectAccess(prefix, 'listKeys');
    return Array.from(this.storage.keys()).filter(key => key.startsWith(prefix));
  }

  private logDirectAccess(key: string, operation: string): void {
    this.directAccessLog.push({ key, operation });
  }

  // Test utilities
  getDirectAccessLog(): typeof this.directAccessLog {
    return [...this.directAccessLog];
  }

  clearDirectAccessLog(): void {
    this.directAccessLog = [];
  }

  // Helper to verify all accesses go through normalized prefixes
  validateNamespaceCompliance(expectedPrefix: string): {
    compliant: boolean;
    violations: Array<{ key: string; operation: string; reason: string }>;
  } {
    const violations: Array<{ key: string; operation: string; reason: string }> = [];
    
    for (const access of this.directAccessLog) {
      // Skip listKeys operations as they use prefixes for filtering
      if (access.operation === 'listKeys') continue;
      
      // Check if key uses the expected normalized prefix
      if (!access.key.startsWith(`${expectedPrefix}:`)) {
        violations.push({
          key: access.key,
          operation: access.operation,
          reason: `Key doesn't start with normalized prefix '${expectedPrefix}:'`
        });
      }
      
      // Check for double colons (malformed prefix)
      if (access.key.includes('::')) {
        violations.push({
          key: access.key,
          operation: access.operation,
          reason: 'Key contains double colons (malformed prefix)'
        });
      }
    }
    
    return {
      compliant: violations.length === 0,
      violations
    };
  }

  clear(): void {
    this.storage.clear();
    this.directAccessLog = [];
  }
}

describe('Storage: Namespace Bypass Prevention', () => {
  it('should ensure all operations go through normalized prefixes', () => {
    const driver = new BypassDetectionDriver();
    
    // Test various malformed prefixes
    const testCases = [
      { input: 'app', expected: 'app' },
      { input: 'app:', expected: 'app' },
      { input: 'app::', expected: 'app' },
      { input: 'app:::', expected: 'app' },
      { input: 'my:service:', expected: 'my:service' },
      { input: 'complex:ns:v1::', expected: 'complex:ns:v1' },
    ];

    testCases.forEach(({ input, expected }, index) => {
      driver.clearDirectAccessLog();
      
      const ns = createNamespace(input, driver);
      
      // Perform operations through namespace
      ns.setItem(`key${index}`, `value${index}`);
      ns.getItem(`key${index}`);
      ns.listKeys('');
      ns.removeItem(`key${index}`);
      
      // Validate all operations used normalized prefix
      const compliance = driver.validateNamespaceCompliance(expected);
      
      expect(compliance.compliant).toBe(true);
      if (!compliance.compliant) {
        console.error(`Namespace compliance violations for '${input}':`, compliance.violations);
      }
    });
  });

  it('should prevent direct driver access bypassing namespace', () => {
    const driver = new BypassDetectionDriver();
    const ns = createNamespace('secure:app', driver);
    
    // Correct usage through namespace
    ns.setItem('config', 'value1');
    ns.setItem('data', 'value2');
    
    // Simulate bypassing namespace (anti-pattern)
    driver.setItem('secure:app::malformed', 'bypassed');
    driver.setItem('different:prefix:config', 'bypassed');
    
    const compliance = driver.validateNamespaceCompliance('secure:app');
    
    expect(compliance.compliant).toBe(false);
    expect(compliance.violations).toHaveLength(2);
    
    // Verify specific violations
    const doubleColonViolation = compliance.violations.find(v => v.reason.includes('double colons'));
    const wrongPrefixViolation = compliance.violations.find(v => v.reason.includes('normalized prefix'));
    
    expect(doubleColonViolation).toBeDefined();
    expect(wrongPrefixViolation).toBeDefined();
  });

  it('should maintain namespace isolation with guard in place', () => {
    const driver = new BypassDetectionDriver();
    
    // Create namespaces with potentially conflicting prefixes
    const ns1 = createNamespace('app:', driver);  // Should normalize to 'app'
    const ns2 = createNamespace('app::', driver); // Should also normalize to 'app'
    const ns3 = createNamespace('app', driver);   // Already normalized
    
    // All should create identical prefixes
    expect(ns1.prefix).toBe('app');
    expect(ns2.prefix).toBe('app');
    expect(ns3.prefix).toBe('app');
    
    // Operations through any namespace should be equivalent
    driver.clearDirectAccessLog();
    
    ns1.setItem('test', 'value1');
    const retrieved1 = ns2.getItem('test'); // Should find value from ns1
    const retrieved2 = ns3.getItem('test'); // Should find value from ns1
    
    expect(retrieved1).toBe('value1');
    expect(retrieved2).toBe('value1');
    
    // Verify all operations used consistent normalized prefix
    const compliance = driver.validateNamespaceCompliance('app');
    expect(compliance.compliant).toBe(true);
  });

  it('should handle complex prefix patterns correctly', () => {
    const driver = new BypassDetectionDriver();
    
    // Test edge cases
    const edgeCases = [
      { prefix: 'a:b:c:', expected: 'a:b:c' },
      { prefix: ':prefix:', expected: ':prefix' }, // Leading colon preserved
      { prefix: 'single', expected: 'single' },
      { prefix: '123:numeric:', expected: '123:numeric' },
      { prefix: 'special-chars_ok:', expected: 'special-chars_ok' },
    ];

    edgeCases.forEach(({ prefix, expected }) => {
      driver.clearDirectAccessLog();
      
      const ns = createNamespace(prefix, driver);
      expect(ns.prefix).toBe(expected);
      
      ns.setItem('test', 'value');
      ns.getItem('test');
      
      const compliance = driver.validateNamespaceCompliance(expected);
      expect(compliance.compliant).toBe(true);
    });
  });
});
