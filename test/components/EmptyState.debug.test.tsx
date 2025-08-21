import { describe, it, expect } from 'vitest';

describe('EmptyState Import Debug', () => {
  it('should handle dynamic import', async () => {
    try {
      const module = await import('../../src/components/ui/EmptyState');
      console.log('Module:', module);
      console.log('Default export:', module.default);
      console.log('Default type:', typeof module.default);

      expect(module).toBeDefined();
      expect(module.default).toBeDefined();
    } catch (error) {
      console.error('Import error:', error);
      throw error;
    }
  });
});
