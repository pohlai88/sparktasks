/**
 * Phase B - Task 22: Federated Anchor Discovery Registry
 * Manage discovery locators and pending anchor storage
 */

import type { StorageDriver } from '../storage/types';
import type {
  AnchorLocator,
  PendingAnchor,
  DiscoveryMetrics,
} from './discovery-types';

// Storage keys
const locatorsKey = (ns: string) => `fed:disc:locators:${ns}`;
const pendingKey = (ns: string, orgId: string) =>
  `fed:anchors:pending:${ns}:${orgId}`;
const discStateKey = (ns: string, orgId: string) =>
  `fed:disc:state:${ns}:${orgId}`;
const metricsKey = (ns: string) => `fed:disc:metrics:${ns}`;

/**
 * Add discovery locator for an organization
 */
export async function addAnchorLocator(
  ns: string,
  storage: StorageDriver,
  locator: AnchorLocator
): Promise<void> {
  const existing = await listAnchorLocators(ns, storage);
  const filtered = existing.filter(l => l.orgId !== locator.orgId);
  filtered.push(locator);

  await storage.setItem(locatorsKey(ns), JSON.stringify(filtered));
}

/**
 * List all discovery locators
 */
export async function listAnchorLocators(
  ns: string,
  storage: StorageDriver
): Promise<AnchorLocator[]> {
  try {
    const data = await storage.getItem(locatorsKey(ns));
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Remove discovery locator by orgId
 */
export async function removeAnchorLocator(
  ns: string,
  storage: StorageDriver,
  orgId: string
): Promise<void> {
  const existing = await listAnchorLocators(ns, storage);
  const filtered = existing.filter(l => l.orgId !== orgId);

  await storage.setItem(locatorsKey(ns), JSON.stringify(filtered));
}

/**
 * Get pending anchors for an organization
 */
export async function getPendingAnchors(
  ns: string,
  orgId: string,
  storage: StorageDriver
): Promise<PendingAnchor[]> {
  try {
    const data = await storage.getItem(pendingKey(ns, orgId));
    if (!data) return [];

    const map = JSON.parse(data) as Record<string, PendingAnchor>;
    return Object.values(map);
  } catch {
    return [];
  }
}

/**
 * Store pending anchors for an organization
 */
export async function setPendingAnchors(
  ns: string,
  orgId: string,
  anchors: PendingAnchor[],
  storage: StorageDriver
): Promise<void> {
  const map: Record<string, PendingAnchor> = {};
  for (const anchor of anchors) {
    map[anchor.kid] = anchor;
  }

  await storage.setItem(pendingKey(ns, orgId), JSON.stringify(map));
}

/**
 * Get discovery state (cursor) for an organization
 */
export async function getDiscoveryState(
  ns: string,
  orgId: string,
  storage: StorageDriver
): Promise<{ since?: string }> {
  try {
    const data = await storage.getItem(discStateKey(ns, orgId));
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

/**
 * Update discovery state (cursor) for an organization
 */
export async function setDiscoveryState(
  ns: string,
  orgId: string,
  state: { since?: string },
  storage: StorageDriver
): Promise<void> {
  await storage.setItem(discStateKey(ns, orgId), JSON.stringify(state));
}

/**
 * Get discovery metrics for observability
 */
export async function getDiscoveryMetrics(
  ns: string,
  storage: StorageDriver
): Promise<DiscoveryMetrics> {
  try {
    const data = await storage.getItem(metricsKey(ns));
    return data
      ? JSON.parse(data)
      : {
          totalPulls: 0,
          totalPending: 0,
          totalPromoted: 0,
          totalRejected: 0,
          totalConflicts: 0,
          totalRewinds: 0,
          totalExpired: 0,
        };
  } catch {
    return {
      totalPulls: 0,
      totalPending: 0,
      totalPromoted: 0,
      totalRejected: 0,
      totalConflicts: 0,
      totalRewinds: 0,
      totalExpired: 0,
    };
  }
}

/**
 * Update discovery metrics for observability
 */
export async function updateDiscoveryMetrics(
  ns: string,
  storage: StorageDriver,
  updates: Partial<DiscoveryMetrics>
): Promise<void> {
  const current = await getDiscoveryMetrics(ns, storage);
  const updated = { ...current, ...updates };
  await storage.setItem(metricsKey(ns), JSON.stringify(updated));
}

/**
 * Clean expired pending anchors based on TTL
 */
export async function cleanExpiredPendingAnchors(
  ns: string,
  orgId: string,
  storage: StorageDriver
): Promise<{ expired: number }> {
  const pending = await getPendingAnchors(ns, orgId, storage);
  const now = new Date();
  let expired = 0;

  const active = pending.filter(anchor => {
    if (anchor.expiresAt && new Date(anchor.expiresAt) < now) {
      expired++;
      return false;
    }
    return true;
  });

  if (expired > 0) {
    await setPendingAnchors(ns, orgId, active, storage);
  }

  return { expired };
}
