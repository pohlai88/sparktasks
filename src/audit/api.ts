/**
 * Audit Log API - Phase B Task 12
 * Tamper-evident, encrypted, append-only audit trail
 */

import type { StorageDriver } from '../storage/types';
import type { AuditEntry, AuditType, Query, Page } from './types';
import { toB64u } from '../crypto/base64url';

let storage: StorageDriver;
let namespace: string;

export function configureAudit(storageDriver: StorageDriver, ns: string): void {
  storage = storageDriver;
  namespace = ns;
}

// Canonical JSON for stable hashing
function canon(obj: any): string {
  if (obj === null || typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) return '[' + obj.map(canon).join(',') + ']';
  const keys = Object.keys(obj).sort();
  return '{' + keys.map(k => `"${k}":${canon(obj[k])}`).join(',') + '}';
}

// Hash function using WebCrypto
async function hash(data: string): Promise<string> {
  const buffer = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(data)
  );
  return toB64u(buffer);
}

// Generate ULID-like ID (timestamp + random)
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// Redact sensitive fields from context
function redactSensitive(
  ctx?: Record<string, unknown>
): Record<string, unknown> | undefined {
  if (!ctx) return undefined;
  const redacted = { ...ctx };
  const sensitive = [
    'passcode',
    'ctB64u',
    'ivB64u',
    'wrapped',
    'privateKey',
    'secret',
  ];
  for (const key of sensitive) {
    if (key in redacted) redacted[key] = '***';
  }
  for (const [key, value] of Object.entries(redacted)) {
    if (typeof value === 'string' && value.length > 200) {
      redacted[key] = value.slice(0, 200) + '...';
    }
  }
  return redacted;
}

// Get/set head hash
async function getHead(): Promise<string | null> {
  try {
    return await storage.getItem(`audit:${namespace}:head`);
  } catch {
    return null;
  }
}

async function setHead(hash: string): Promise<void> {
  await storage.setItem(`audit:${namespace}:head`, hash);
}

// Generate entry key for lexical ordering
function entryKey(ts: string, id: string): string {
  return `audit:${namespace}:e:${ts}:${id}`;
}

export async function log(
  type: AuditType,
  ctx?: Record<string, unknown>,
  actor?: string
): Promise<AuditEntry> {
  if (!storage || !namespace) {
    throw new Error('Audit not configured. Call configureAudit() first.');
  }

  const id = generateId();
  const ts = new Date().toISOString();
  const prev = await getHead();
  const redactedCtx = redactSensitive(ctx);

  // Build entry without hash
  const entryWithoutHash = {
    v: 1 as const,
    id,
    ts,
    ...(actor && { actor }),
    type,
    ...(redactedCtx && { ctx: redactedCtx }),
    ...(prev && { prev }),
  };

  // Compute hash: SHA256(prev || canon(entry))
  const entryHash = await hash((prev || '') + canon(entryWithoutHash));
  const entry: AuditEntry = { ...entryWithoutHash, hash: entryHash };

  // Store and update head
  await storage.setItem(entryKey(ts, id), JSON.stringify(entry));
  await setHead(entryHash);

  return entry;
}

export async function list(q?: Query): Promise<Page> {
  if (!storage || !namespace) {
    throw new Error('Audit not configured. Call configureAudit() first.');
  }

  const prefix = `audit:${namespace}:e:`;
  const limit = q?.limit || 50;

  // Build range constraints
  let startKey = prefix;
  let endKey = prefix + '\uFFFF';
  if (q?.since) startKey = prefix + q.since;
  if (q?.until) endKey = prefix + q.until + '\uFFFF';
  if (q?.cursor) startKey = q.cursor;

  // Get keys in range
  const filteredKeys = (await storage.listKeys(prefix))
    .filter(key => key >= startKey && key < endKey)
    .sort()
    .slice(0, limit + 1);

  // Fetch entries
  const items: AuditEntry[] = [];
  for (let i = 0; i < Math.min(filteredKeys.length, limit); i++) {
    try {
      const data = await storage.getItem(filteredKeys[i]);
      if (data) items.push(JSON.parse(data));
    } catch {
      // Skip corrupted entries
    }
  }

  return {
    items,
    ...(filteredKeys.length > limit && { nextCursor: filteredKeys[limit] }),
  };
}

export async function exportAll(): Promise<{
  items: AuditEntry[];
  valid: boolean;
}> {
  if (!storage || !namespace) {
    throw new Error('Audit not configured. Call configureAudit() first.');
  }

  const prefix = `audit:${namespace}:e:`;
  const entryKeys = (await storage.listKeys(prefix))
    .filter(key => key.startsWith(prefix))
    .sort();

  // Fetch all entries
  const allEntries: AuditEntry[] = [];
  for (const key of entryKeys) {
    try {
      const data = await storage.getItem(key);
      if (data) allEntries.push(JSON.parse(data));
    } catch {
      // Skip corrupted entries
    }
  }

  // Sort entries in hash chain order (follow prev pointers)
  const items = sortByChainOrder(allEntries);

  return { items, valid: await verifyChain(items) };
}

// Helper function to sort entries by hash chain order
function sortByChainOrder(entries: AuditEntry[]): AuditEntry[] {
  if (entries.length === 0) return [];

  const entryMap = new Map<string, AuditEntry>();
  const childMap = new Map<string | undefined, AuditEntry>();

  for (const entry of entries) {
    entryMap.set(entry.hash, entry);
    childMap.set(entry.prev, entry);
  }

  const first = childMap.get(undefined);
  if (!first) {
    return [...entries].sort(
      (a, b) => a.ts.localeCompare(b.ts) || a.id.localeCompare(b.id)
    );
  }

  const result: AuditEntry[] = [];
  let current: AuditEntry | undefined = first;
  while (current) {
    result.push(current);
    current = childMap.get(current.hash);
  }
  return result;
}

export async function verifyChain(items: AuditEntry[]): Promise<boolean> {
  if (items.length === 0) return true;

  let expectedPrev: string | undefined = undefined;
  for (const entry of items) {
    if (entry.prev !== expectedPrev) return false;
    const { hash: _, ...entryWithoutHash } = entry;
    const computedHash = await hash(
      (entry.prev || '') + canon(entryWithoutHash)
    );
    if (computedHash !== entry.hash) return false;
    expectedPrev = entry.hash;
  }
  return true;
}
