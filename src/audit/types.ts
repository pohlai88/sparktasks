/**
 * Audit Log Types - Phase B Task 12
 * Tamper-evident, encrypted, append-only audit trail for sensitive actions
 */

export type AuditType =
  | 'INVITE_CREATED'
  | 'INVITE_ACCEPTED'
  | 'INVITE_REVOKED'
  | 'DEVICE_UNLINKED'
  | 'DEK_ROTATED'
  | 'RECOVERY_BUNDLE_CREATED'
  | 'RECOVERY_USED'
  | 'RECOVERY_OVERRIDE_CREATED'
  | 'RECOVERY_OVERRIDE_USED'
  | 'SYNC_RUN'
  | 'MAINTENANCE_RUN'
  | 'ERROR'
  | 'ROLE_DOWNGRADE'
  | 'OWNER_TRANSITION'
  | 'MEMBER_ADDED'
  | 'MEMBER_REMOVED'
  | 'POLICY_UPDATED'
  | 'POLICY_ALLOW'
  | 'POLICY_DENY'
  | 'TRUST_INITIALIZED'
  | 'TRUST_OPERATION_CREATED'
  | 'TRUST_OPERATION_SIGNED'
  | 'TRUST_OPERATION_APPLIED'
  | 'TRUST_OPERATION_REJECTED'
  | 'TRUST_LEGACY_MIGRATED'
  | 'TRUST_SIGNER_ADDED'
  | 'TRUST_SIGNER_REMOVED'
  | 'PACK_ATTESTED'
  | 'PACK_VERIFY_OK'
  | 'PACK_VERIFY_FAIL'
  | 'SIGNER_ADDED'
  | 'SIGNER_ACTIVATED'
  | 'SIGNER_RETIRED'
  | 'SIGNER_REVOKED'
  | 'PACK_DUAL_SIGNED'
  | 'ATTEST_VERIFY_ALLOW'
  | 'ATTEST_VERIFY_DENY'
  | 'FED_TRUST_ADDED'
  | 'FED_TRUST_UPDATED'
  | 'FED_TRUST_REMOVED'
  | 'ATTEST_VERIFY_CROSS_ORG_ALLOW'
  | 'ATTEST_VERIFY_CROSS_ORG_DENY'
  | 'FED_ANCHOR_SYNC_PULL'
  | 'FED_ANCHOR_SYNC_APPLY'
  | 'FED_ANCHOR_SYNC_REJECT'
  | 'FED_ANCHOR_PUBLISH'
  | 'FED_DISC_LOCATOR_ADD'
  | 'FED_DISC_PULL'
  | 'FED_DISC_PENDING'
  | 'FED_DISC_PROMOTE'
  | 'FED_DISC_REJECT'
  | 'FED_DISC_CONFLICT'
  | 'FED_DISC_REWIND_ALERT'
  | 'ATTEST_MULTI_EMIT'
  | 'ATTEST_MULTI_VERIFY';

export interface AuditEntry {
  v: 1;
  id: string;
  ts: string;
  actor?: string;
  type: AuditType;
  ctx?: Record<string, unknown>;
  prev?: string;
  hash: string;
}

export interface Query {
  since?: string;
  until?: string;
  limit?: number;
  cursor?: string;
}

export interface Page {
  items: AuditEntry[];
  nextCursor?: string;
}
