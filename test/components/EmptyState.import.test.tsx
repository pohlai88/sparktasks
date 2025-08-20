import { describe, it, expect } from 'vitest';
import EmptyState from '../../src/components/ui/EmptyState';

describe('EmptyState Import Test', () => {
  it('should import EmptyState component', () => {
    console.log('EmptyState type:', typeof EmptyState);
    console.log('EmptyState value:', EmptyState);
    console.log('EmptyState keys:', Object.keys(EmptyState || {}));
    
    expect(EmptyState).toBeDefined();
    expect(typeof EmptyState).toBe('function');
  });
});
