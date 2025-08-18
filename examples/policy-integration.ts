/**
 * Policy Integration Examples - Phase B Task 17
 * Sample integration patterns for existing modules
 */

import { enforcePolicy } from '../src/policy/engine';
import type { StorageDriver } from '../src/storage/types';

// Example 1: Invite Creation Hook
export async function createInviteWithPolicy(
  ns: string,
  actorId: string, 
  actorRole: string,
  targetRole: string,
  storage: StorageDriver
) {
  // Policy enforcement before invite creation
  await enforcePolicy({
    op: 'invite.create',
    ns,
    actorId,
    actorRole: actorRole as any,
    targetRole: targetRole as any,
    nowISO: new Date().toISOString()
  }, storage, { 
    audit: true,      // Log the decision
    commitCap: true   // Count against daily limits
  });
  
  // Proceed with existing invite creation logic...
  console.log('Invite creation allowed by policy');
}

// Example 2: Recovery Override Hook  
export async function createRecoveryOverrideWithPolicy(
  ns: string,
  actorId: string,
  actorRole: string, 
  beneficiaryRole: string,
  storage: StorageDriver
) {
  // Policy enforcement before override creation
  await enforcePolicy({
    op: 'override.create',
    ns,
    actorId, 
    actorRole: actorRole as any,
    targetRole: beneficiaryRole as any,
    nowISO: new Date().toISOString()
  }, storage, {
    audit: true,
    commitCap: true // Count against admin daily limits
  });
  
  // Proceed with existing override creation logic...
  console.log('Recovery override creation allowed by policy');
}

// Example 3: Membership Change Hook
export async function changeMemberRoleWithPolicy(
  ns: string,
  actorId: string,
  actorRole: string,
  targetRole: string, 
  storage: StorageDriver
) {
  // Policy enforcement before role change
  await enforcePolicy({
    op: 'membership.change',
    ns,
    actorId,
    actorRole: actorRole as any,
    targetRole: targetRole as any,
    nowISO: new Date().toISOString()
  }, storage, {
    audit: true,
    commitCap: true
  });
  
  // Proceed with existing membership change logic...
  console.log('Membership role change allowed by policy');
}

// Example 4: Revocation Hook
export async function revokeSignerWithPolicy(
  ns: string,
  actorId: string,
  actorRole: string,
  storage: StorageDriver
) {
  // Policy enforcement before revocation
  await enforcePolicy({
    op: 'signer.revoke',
    ns,
    actorId,
    actorRole: actorRole as any,
    nowISO: new Date().toISOString()
  }, storage, {
    audit: true,
    commitCap: true
  });
  
  // Proceed with existing signer revocation logic...
  console.log('Signer revocation allowed by policy');
}

// Example 5: Feature Flag Integration
export async function enforceIfEnabled(
  operation: string,
  context: any,
  storage: StorageDriver
) {
  // Check feature flag (environment variable)
  const policyEnabled = process.env.POLICY_ENFORCE === '1';
  
  if (policyEnabled) {
    await enforcePolicy(context, storage);
  } else {
    console.log(`Policy check skipped for ${operation} (feature flag disabled)`);
  }
}
