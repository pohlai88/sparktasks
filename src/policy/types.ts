/**
 * Policy Engine Types - Phase B Task 17
 * Role-aware organization policies for headless enforcement
 */

import type { Role } from '../membership/types';

export interface PolicySetV1 {
  version: 1;
  minEngine?: string; // Minimum engine version required (e.g., "1.0.0")
  rev?: number; // Revision number for A/B testing
  rules: PolicyRule[];
}

export interface PolicyRule {
  effect: 'allow' | 'deny';
  ops?: string[]; // e.g., "invite.create", "override.accept", "recovery.create"
  actorMinRole?: Role; // Minimum role required for actor
  targetMaxRole?: Role; // Maximum role that can be targeted/issued
  nsAllow?: string[]; // Namespace allowlist
  time?: {
    start?: string; // HH:MM format in UTC (e.g., "09:00" = 9 AM UTC)
    end?: string; // HH:MM format in UTC (e.g., "17:00" = 5 PM UTC)
  };
  perActorDailyCap?: number; // Per-actor daily operation limit
}

export interface PolicyContext {
  op: string; // Operation identifier
  ns: string; // Namespace
  actorId: string; // Actor performing the operation
  actorRole: Role; // Actor's current role
  targetRole?: Role; // Target role (for upgrades/invites)
  nowISO: string; // Current timestamp
}

export interface Actor {
  id: string;
  role: Role;
}

export type PolicyResult = 'allow' | 'deny';

export interface EnforcePolicyOptions {
  audit?: boolean; // Whether to emit audit events (default: true)
  commitCap?: boolean; // Whether to increment daily cap on allow (default: false)
  observeMode?: boolean; // Log policy denials without enforcement (default: false)
}
