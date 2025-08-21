/**
 * Phase B - Task 25: Witness Co-Signed Checkpoints Tests (Compact)
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  addWitness,
  listWitnesses,
  setWitnessStatus,
  buildWitnessPayload,
  ingestWitnessSig,
  verifyWitnessedCheckpoint,
  setAuditHook,
  setPolicyHook,
  setMetricsHook,
} from '../src/witness';
import type { Witness, WitnessSig, WitnessPolicy } from '../src/witness';

// Mock storage driver
class MockStorage {
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

const mockCheckpoint = {
  v: 1,
  ns: 'test',
  n: 10,
  rootB64u: 'abc123',
  at: Date.now().toString(),
};
const createWitness = (
  org: string,
  id: string,
  status: Witness['status'] = 'ACTIVE'
): Witness => ({
  org,
  id,
  pubB64u: `pk-${org}-${id}`,
  status,
  addedAt: new Date().toISOString(),
});
const createSig = (org: string, id: string): WitnessSig => ({
  org,
  id,
  at: new Date().toISOString(),
  sigB64u: `mock-sig-${org}`,
});

describe('Witness Registry', () => {
  let storage: MockStorage,
    auditEvents: any[],
    policyDecisions: Record<string, boolean>;

  beforeEach(() => {
    storage = new MockStorage();
    auditEvents = [];
    policyDecisions = {};
    setAuditHook({
      log: (event: string, data: any) => auditEvents.push({ event, data }),
    });
    setPolicyHook({
      check: async (action: string, _ctx: any) => ({
        allowed: policyDecisions[action] ?? true,
      }),
    });
  });

  it('adds and lists witnesses', async () => {
    const w1 = createWitness('acme', 'w1'),
      w2 = createWitness('beta', 'w2');
    await addWitness('ns1', w1, storage);
    await addWitness('ns1', w2, storage);

    const witnesses = await listWitnesses('ns1', storage);
    expect(witnesses).toEqual([w1, w2]);
    expect(auditEvents.filter(e => e.event === 'WITNESS_ADD')).toHaveLength(2);
  });

  it('updates witness status', async () => {
    const w = createWitness('acme', 'w1');
    await addWitness('ns1', w, storage);
    await setWitnessStatus('ns1', 'acme', 'w1', 'RETIRED', storage);

    const witnesses = await listWitnesses('ns1', storage);
    expect(witnesses[0]?.status).toBe('RETIRED');
    expect(auditEvents.find(e => e.event === 'WITNESS_STATUS')).toBeTruthy();
  });

  it('filters witnesses by status', async () => {
    await addWitness('ns1', createWitness('acme', 'w1', 'ACTIVE'), storage);
    await addWitness('ns1', createWitness('beta', 'w2', 'RETIRED'), storage);

    const active = await listWitnesses('ns1', storage, { status: ['ACTIVE'] });
    const retired = await listWitnesses('ns1', storage, {
      status: ['RETIRED'],
    });

    expect(active).toHaveLength(1);
    expect(retired).toHaveLength(1);
    expect(active[0]?.org).toBe('acme');
    expect(retired[0]?.org).toBe('beta');
  });

  it('enforces policy on witness operations', async () => {
    policyDecisions['witness.add'] = false;

    await expect(
      addWitness('ns1', createWitness('acme', 'w1'), storage)
    ).rejects.toThrow('policy_denied');
    expect(
      auditEvents.find(e => e.event === 'WITNESS_ADD_DENIED')
    ).toBeTruthy();
  });
});

describe('Witness Signature Ingestion', () => {
  let storage: MockStorage, auditEvents: any[];

  beforeEach(async () => {
    storage = new MockStorage();
    auditEvents = [];
    setAuditHook({
      log: (event: string, data: any) => auditEvents.push({ event, data }),
    });
    setPolicyHook({ check: async () => ({ allowed: true }) });
    await addWitness('ns1', createWitness('acme', 'w1'), storage);
  });

  it('ingests valid signature', async () => {
    const wc = await ingestWitnessSig(
      'ns1',
      mockCheckpoint,
      createSig('acme', 'w1'),
      storage
    );

    expect(wc.base).toEqual(mockCheckpoint);
    expect(wc.sigs).toHaveLength(1);
    expect(wc.sigs[0]?.org).toBe('acme');
    expect(
      auditEvents.find(e => e.event === 'WITNESS_SIG_INGEST_OK')
    ).toBeTruthy();
  });

  it('rejects unknown witness signature', async () => {
    await expect(
      ingestWitnessSig(
        'ns1',
        mockCheckpoint,
        createSig('unknown', 'w1'),
        storage
      )
    ).rejects.toThrow('unknown_witness');
    expect(
      auditEvents.find(e => e.event === 'WITNESS_SIG_INGEST_FAIL')
    ).toBeTruthy();
  });

  it('accumulates multiple signatures', async () => {
    await addWitness('ns1', createWitness('beta', 'w2'), storage);

    let wc = await ingestWitnessSig(
      'ns1',
      mockCheckpoint,
      createSig('acme', 'w1'),
      storage
    );
    wc = await ingestWitnessSig(
      'ns1',
      mockCheckpoint,
      createSig('beta', 'w2'),
      storage
    );

    expect(wc.sigs).toHaveLength(2);
    expect(wc.sigs.map((s: WitnessSig) => s.org).sort()).toEqual([
      'acme',
      'beta',
    ]);
  });
});

describe('Witness Verification', () => {
  let storage: MockStorage;
  const policy: WitnessPolicy = { min: 2, requireOrgs: [], bannedOrgs: [] };

  beforeEach(async () => {
    storage = new MockStorage();
    setAuditHook({ log: () => {} });
    setPolicyHook({ check: async () => ({ allowed: true }) });
    await addWitness('ns1', createWitness('acme', 'w1'), storage);
    await addWitness('ns1', createWitness('beta', 'w2'), storage);
  });

  it('verifies checkpoint with sufficient signatures', async () => {
    let wc = await ingestWitnessSig(
      'ns1',
      mockCheckpoint,
      createSig('acme', 'w1'),
      storage
    );
    wc = await ingestWitnessSig(
      'ns1',
      mockCheckpoint,
      createSig('beta', 'w2'),
      storage
    );

    const result = await verifyWitnessedCheckpoint('ns1', wc, storage, policy);
    expect(result.ok).toBe(true);
    expect(result.count).toBe(2);
  });

  it('rejects checkpoint with insufficient signatures', async () => {
    const wc = await ingestWitnessSig(
      'ns1',
      mockCheckpoint,
      createSig('acme', 'w1'),
      storage
    );

    const result = await verifyWitnessedCheckpoint('ns1', wc, storage, policy);
    expect(result.ok).toBe(false);
    expect(result.count).toBe(1);
  });

  it('enforces required organizations', async () => {
    await addWitness('ns1', createWitness('gamma', 'w3'), storage);
    const policyWithRequired = {
      min: 1,
      requireOrgs: ['gamma'],
      bannedOrgs: [],
    };

    const wc = await ingestWitnessSig(
      'ns1',
      mockCheckpoint,
      createSig('acme', 'w1'),
      storage
    );
    const result = await verifyWitnessedCheckpoint(
      'ns1',
      wc,
      storage,
      policyWithRequired
    );

    expect(result.ok).toBe(false);
    expect(result.reason).toBe('missing_required_org');
  });

  it('rejects banned organizations', async () => {
    const policyWithBanned = { min: 1, requireOrgs: [], bannedOrgs: ['acme'] };

    const wc = await ingestWitnessSig(
      'ns1',
      mockCheckpoint,
      createSig('acme', 'w1'),
      storage
    );
    const result = await verifyWitnessedCheckpoint(
      'ns1',
      wc,
      storage,
      policyWithBanned
    );

    expect(result.ok).toBe(false);
    expect(result.reason).toBe('banned_org_present');
  });
});

describe('Witness Payload Builder', () => {
  it('builds canonical witness payload', () => {
    const payload = buildWitnessPayload(mockCheckpoint);
    const expected = `witness-sig:${JSON.stringify(mockCheckpoint, Object.keys(mockCheckpoint).sort())}`;
    expect(payload).toBe(expected);
  });
});

describe('Surgical Patches - Micro-Enhancements', () => {
  let storage: MockStorage, auditEvents: any[], metricsEvents: any[];

  beforeEach(async () => {
    storage = new MockStorage();
    auditEvents = [];
    metricsEvents = [];
    setAuditHook({
      log: (event: string, data: any) => auditEvents.push({ event, data }),
    });
    setPolicyHook({ check: async () => ({ allowed: true }) });
    setMetricsHook({
      increment: (metric: string, tags?: any) =>
        metricsEvents.push({ metric, tags }),
    });
    await addWitness('ns1', createWitness('acme', 'w1'), storage);
  });

  it('🛡️ Dedup Guard: ignores duplicate (org,id) signatures', async () => {
    const sig = createSig('acme', 'w1');

    // Ingest same signature twice
    let wc = await ingestWitnessSig('ns1', mockCheckpoint, sig, storage);
    wc = await ingestWitnessSig('ns1', mockCheckpoint, sig, storage);

    // Should only have one signature despite two ingestions
    expect(wc.sigs).toHaveLength(1);
    expect(wc.sigs[0]?.org).toBe('acme');
    expect(
      metricsEvents.filter(e => e.metric === 'witness.ingest.success')
    ).toHaveLength(2);
  });

  it('🔒 Monotonicity Check: rejects mixed base/root signatures', async () => {
    const differentBase = { ...mockCheckpoint, rootB64u: 'different-root' };

    // Ingest first signature
    await ingestWitnessSig(
      'ns1',
      mockCheckpoint,
      createSig('acme', 'w1'),
      storage
    );

    // Try to ingest signature with different base
    await expect(
      ingestWitnessSig('ns1', differentBase, createSig('acme', 'w1'), storage)
    ).rejects.toThrow('mismatched_base');

    expect(
      metricsEvents.find(
        e => e.metric === 'witness.ingest.monotonicity_violation'
      )
    ).toBeTruthy();
  });

  it('📊 Lightweight Metrics: tracks verification outcomes by reason', async () => {
    await addWitness('ns1', createWitness('beta', 'w2'), storage);
    const policy: WitnessPolicy = { min: 2, requireOrgs: [], bannedOrgs: [] };

    // Test successful verification
    let wc = await ingestWitnessSig(
      'ns1',
      mockCheckpoint,
      createSig('acme', 'w1'),
      storage
    );
    wc = await ingestWitnessSig(
      'ns1',
      mockCheckpoint,
      createSig('beta', 'w2'),
      storage
    );

    let result = await verifyWitnessedCheckpoint('ns1', wc, storage, policy);
    expect(result.ok).toBe(true);
    expect(
      metricsEvents.find(e => e.metric === 'witness.verify.success')
    ).toBeTruthy();

    // Test failed verification (insufficient signatures)
    const wcPartial = await ingestWitnessSig(
      'ns1',
      { ...mockCheckpoint, n: 11 },
      createSig('acme', 'w1'),
      storage
    );
    result = await verifyWitnessedCheckpoint('ns1', wcPartial, storage, policy);
    expect(result.ok).toBe(false);

    const failureMetric = metricsEvents.find(
      e => e.metric === 'witness.verify.failure'
    );
    expect(failureMetric).toBeTruthy();
    expect(failureMetric?.tags?.reason).toContain('threshold_not_met');
  });

  it('📈 Comprehensive Metrics: tracks all operation types', async () => {
    // Reset metrics and perform operations to generate metrics
    metricsEvents.length = 0;

    // Perform operations that generate different metrics
    await addWitness('ns1', createWitness('beta', 'w2'), storage);
    const wc = await ingestWitnessSig(
      'ns1',
      mockCheckpoint,
      createSig('acme', 'w1'),
      storage
    );
    const policy: WitnessPolicy = { min: 1, requireOrgs: [], bannedOrgs: [] };
    await verifyWitnessedCheckpoint('ns1', wc, storage, policy);

    const expectedMetrics = [
      'witness.ingest.success',
      'witness.verify.success',
    ];

    const actualMetrics = metricsEvents.map(e => e.metric);
    expectedMetrics.forEach(metric => {
      expect(actualMetrics).toContain(metric);
    });
  });
});
