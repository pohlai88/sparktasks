import { describe, it, expect, vi, beforeEach } from 'vitest';
import { planSync } from '../src/sync/plan';
import { runSync } from '../src/sync/run';
import type { RemoteTransport } from '../src/storage/remoteTypes';
import type { TaskEvent } from '../src/domain/task/events';

describe('Sync Surgical Improvements', () => {
  let mockTransport: RemoteTransport;
  const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

  beforeEach(() => {
    consoleSpy.mockClear();
    mockTransport = {
      list: vi.fn().mockResolvedValue({ items: [], nextSince: undefined }),
      get: vi.fn().mockResolvedValue(null),
      put: vi.fn().mockResolvedValue(undefined),
      del: vi.fn().mockResolvedValue(undefined),
    };
  });

  it('should detect token regression (monotonicity guard)', async () => {
    // Mock persisted token being newer than provided token
    mockTransport.get = vi.fn().mockResolvedValue({
      value: JSON.stringify({ since: '2025-08-16T12:00:00Z' }),
      updatedAt: '2025-08-16T12:00:00Z'
    });

    await planSync(mockTransport, 'test', [], '2025-08-16T11:00:00Z');
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Token regression detected')
    );
  });

  it('should detect clock skew', async () => {
    const futureTime = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min future
    
    mockTransport.list = vi.fn().mockResolvedValue({
      items: [{ key: 'test-key', value: '', updatedAt: futureTime }],
      nextSince: undefined
    });
    
    mockTransport.get = vi.fn().mockResolvedValue({
      value: '{"events":[],"eventsHash":"hash"}',
      updatedAt: futureTime
    });

    await planSync(mockTransport, 'test', []);
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Clock skew')
    );
  });

  it('should chunk large push operations', async () => {
    const events: TaskEvent[] = Array(250).fill(null).map((_, i) => ({
      type: 'TASK_CREATED',
      timestamp: new Date().toISOString(),
      payload: { 
        id: `task-${i}`, 
        title: `Task ${i}`,
        status: 'TODAY',
        priority: 'P1',
        tags: []
      }
    }));

    const plan = {
      phase: 'push' as const,
      pullKeys: [],
      mergePlan: null,
      pushEvents: events,
      hasChanges: true
    };

    await runSync(plan, mockTransport, 'test');
    
    // Should have made 3 put calls (250 events / 100 chunk size = 3 chunks)
    expect(mockTransport.put).toHaveBeenCalledTimes(3);
  });
});
