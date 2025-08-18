/**
 * Policy Engine - Phase B Task 17 & 20
 * Headless organization policy enforcement with E2EE compatibility
 * Extended with federation policy gating for cross-org trust
 */

import type { StorageDriver } from '../storage/types';
import type { Role } from '../membership/types';
import type { 
  PolicySetV1, 
  PolicyContext, 
  Actor, 
  PolicyResult, 
  EnforcePolicyOptions 
} from './types';
import * as MembershipApi from '../membership/api';
import * as AuditApi from '../audit/api';

// Role hierarchy for comparison
const ROLE_LEVELS: Record<Role, number> = { 
  VIEWER: 1, MEMBER: 2, ADMIN: 3, OWNER: 4 
};

// In-memory cache for policies (60s TTL)
const policyCache = new Map<string, { ts: number; policies: PolicySetV1 }>();
const CACHE_TTL = 60000;

// Storage key generators
const policyKey = (ns: string) => `policy:${ns}:set`;
const capKey = (ns: string, op: string, actorId: string, date: string) => `policy:${ns}:cap:${op}:${actorId}:${date}`;
const getDayKey = (nowISO: string) => nowISO.split('T')[0];

function parseTimeWindow(timeStr: string) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return { hours, minutes };
}

function isInTimeWindow(nowISO: string, start?: string, end?: string): boolean {
  if (!start && !end) return true;
  
  // Note: Time windows are evaluated in UTC
  const now = new Date(nowISO); // Already in UTC from ISO string
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  
  if (start) {
    const startTime = parseTimeWindow(start);
    if (nowMinutes < startTime.hours * 60 + startTime.minutes) return false;
  }
  if (end) {
    const endTime = parseTimeWindow(end);
    if (nowMinutes > endTime.hours * 60 + endTime.minutes) return false;
  }
  return true;
}

// Simple version compatibility check
function isVersionCompatible(_required: string): boolean {
  // For now, assume all versions are compatible
  // In production, implement semantic version comparison
  return true;
}

export async function loadPolicies(ns: string, storage: StorageDriver): Promise<PolicySetV1 | null> {
  // Check cache first
  const cached = policyCache.get(ns);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.policies;
  
  try {
    const data = await storage.getItem(policyKey(ns));
    if (!data) return null;
    
    const policies: PolicySetV1 = JSON.parse(data);
    
    // Version compatibility check
    if (policies.minEngine && !isVersionCompatible(policies.minEngine)) {
      console.warn(`Policy requires engine ${policies.minEngine}, current version may be incompatible`);
    }
    
    policyCache.set(ns, { ts: Date.now(), policies });
    return policies;
  } catch {
    return null;
  }
}

export async function savePolicies(ns: string, storage: StorageDriver, policies: PolicySetV1, actor: Actor): Promise<void> {
  await MembershipApi.assertPermission(actor.id, 'TASK_WRITE');
  if (actor.role !== 'OWNER') throw new Error('Policy updates require OWNER role');
  
  await storage.setItem(policyKey(ns), JSON.stringify(policies));
  policyCache.delete(ns); // Invalidate cache
  
  await AuditApi.log('POLICY_UPDATED', {
    namespace: ns, actorId: actor.id, actorRole: actor.role,
    ruleCount: policies.rules.length, updatedAt: new Date().toISOString()
  }, actor.id);
}

export async function checkPolicy(ctx: PolicyContext, storage: StorageDriver): Promise<PolicyResult> {
  const policies = await loadPolicies(ctx.ns, storage);
  if (!policies || policies.rules.length === 0) return "allow"; // Default allow
  
  const dayKey = getDayKey(ctx.nowISO);
  
  // Evaluate rules in order (first match wins)
  for (const rule of policies.rules) {
    if (rule.ops && !rule.ops.includes(ctx.op)) continue;
    if (rule.actorMinRole && ROLE_LEVELS[ctx.actorRole] < ROLE_LEVELS[rule.actorMinRole]) continue;
    if (rule.targetMaxRole && ctx.targetRole && ROLE_LEVELS[ctx.targetRole] > ROLE_LEVELS[rule.targetMaxRole]) return "deny";
    if (rule.nsAllow && !rule.nsAllow.includes(ctx.ns)) continue;
    if (rule.time && !isInTimeWindow(ctx.nowISO, rule.time.start, rule.time.end)) continue;
    
    // Check daily cap
    if (rule.perActorDailyCap !== undefined) {
      const currentCount = parseInt(await storage.getItem(capKey(ctx.ns, ctx.op, ctx.actorId, dayKey)) || '0', 10);
      if (currentCount >= rule.perActorDailyCap) return "deny";
    }
    
    return rule.effect; // First match wins
  }
  
  return "allow"; // No rules matched
}

export async function enforcePolicy(ctx: PolicyContext, storage: StorageDriver, options: EnforcePolicyOptions = {}): Promise<void> {
  const { audit = true, commitCap = false, observeMode = false } = options;
  const result = await checkPolicy(ctx, storage);
  
  // Audit the decision
  if (audit) {
    const eventType = result === "allow" ? "POLICY_ALLOW" : "POLICY_DENY";
    await AuditApi.log(eventType, {
      op: ctx.op, namespace: ctx.ns, actorId: ctx.actorId, 
      actorRole: ctx.actorRole, targetRole: ctx.targetRole,
      result, timestamp: ctx.nowISO
    }, ctx.actorId);
  }
  
  if (result === "deny") {
    if (observeMode) {
      console.warn(`POLICY_OBSERVE: Would deny '${ctx.op}' for '${ctx.actorId}' in '${ctx.ns}'`);
      return; // Don't throw, just log
    }
    throw new Error(`POLICY_DENIED: Operation '${ctx.op}' denied for actor '${ctx.actorId}' in namespace '${ctx.ns}'`);
  }
  
  // Increment cap if requested and allowed
  if (commitCap && result === "allow") {
    const policies = await loadPolicies(ctx.ns, storage);
    if (policies) {
      for (const rule of policies.rules) {
        if (rule.perActorDailyCap !== undefined && (!rule.ops || rule.ops.includes(ctx.op))) {
          const dayKey = getDayKey(ctx.nowISO);
          const currentCount = parseInt(await storage.getItem(capKey(ctx.ns, ctx.op, ctx.actorId, dayKey)) || '0', 10);
          await storage.setItem(capKey(ctx.ns, ctx.op, ctx.actorId, dayKey), (currentCount + 1).toString());
          break; // Only increment for first matching rule with cap
        }
      }
    }
  }
}

/**
 * Create a starter policy template for new organizations
 * Provides sensible defaults for common policy patterns
 */
export function createStarterPolicy(): PolicySetV1 {
  return {
    version: 1,
    rules: [
      // Prevent non-OWNERs from issuing OWNER invites
      { effect: "deny", ops: ["invite.create"], targetMaxRole: "ADMIN" },
      
      // Business hours enforcement for sensitive operations
      { effect: "deny", ops: ["override.create"], time: { end: "09:00" } },
      { effect: "deny", ops: ["override.create"], time: { start: "17:00" } },
      
      // Conservative daily limits
      { effect: "allow", ops: ["invite.create"], perActorDailyCap: 5 },
      { effect: "allow", ops: ["override.create"], perActorDailyCap: 2 },
    ]
  };
}

// Federation Policy Extension - Task 20
interface FederationPolicyConfig {
  allowedOrgs?: string[];
  allowedOperations?: string[];
}

let federationPolicies = new Map<string, FederationPolicyConfig>();

export function configureFederationPolicy(ns: string, config: FederationPolicyConfig): void {
  federationPolicies.set(ns, config);
}

export async function checkCrossOrgPolicy(
  ns: string,
  orgId: string,
  operation?: string
): Promise<{ allowed: boolean; reason?: string }> {
  const config = federationPolicies.get(ns);
  
  // No policy configured = allow (backward compatible)
  if (!config) {
    return { allowed: true };
  }
  
  // Check allowed organizations
  if (config.allowedOrgs && !config.allowedOrgs.includes(orgId)) {
    await AuditApi.log('ATTEST_VERIFY_CROSS_ORG_DENY', { 
      ns, orgId, reason: 'org_not_in_allowlist' 
    });
    return { allowed: false, reason: 'org_not_in_allowlist' };
  }
  
  // Check allowed operations
  if (operation && config.allowedOperations && !config.allowedOperations.includes(operation)) {
    await AuditApi.log('ATTEST_VERIFY_CROSS_ORG_DENY', { 
      ns, orgId, operation, reason: 'operation_not_allowed' 
    });
    return { allowed: false, reason: 'operation_not_allowed' };
  }
  
  return { allowed: true };
}
