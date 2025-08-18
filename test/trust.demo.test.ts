/**
 * Trust Demo Test Runner
 * Run the demo through the test framework
 */

import { describe, it, expect } from 'vitest';
import { runTrustDemo } from '../src/trust/demo';

describe('Trust System Demo', () => {
  it('should run the complete trust system demonstration', async () => {
    // Capture console output
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args) => {
      logs.push(args.join(' '));
      originalLog(...args);
    };

    try {
      await runTrustDemo();
      
      // Verify key demo milestones were reached
      expect(logs.some(log => log.includes('Starting Trust System Demo'))).toBe(true);
      expect(logs.some(log => log.includes('Bootstrap operation created'))).toBe(true);
      expect(logs.some(log => log.includes('TRUSTED'))).toBe(true);
      expect(logs.some(log => log.includes('NOT TRUSTED'))).toBe(true);
      expect(logs.some(log => log.includes('Trust System Demo Complete'))).toBe(true);
      
      // Should have captured significant activity
      expect(logs.length).toBeGreaterThan(30);
      
      console.log(`\n🎯 Demo completed successfully with ${logs.length} log entries`);
      
    } finally {
      // Restore console
      console.log = originalLog;
    }
  }, 30000); // 30 second timeout for comprehensive demo
});
