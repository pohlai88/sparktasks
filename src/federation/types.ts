/**
 * Federation Trust Types - Phase B Task 20
 * Cross-org trust anchor definitions
 */

export type AnchorStatus = 'ACTIVE' | 'REVOKED';

export interface TrustAnchor {
  orgId: string;
  pubB64u: string;
  status: AnchorStatus;
  createdAt: string;
  note?: string;
}

export interface FederatedVerifyOptions {
  ns?: string;
  allowedOrgs?: string[];
  graceSecs?: number;
  operation?: string; // For policy gating (e.g., 'sync.import')
}

export interface CrossOrgResult {
  ok: boolean;
  orgId?: string;
  kid?: string;
  reason?: string;
}
