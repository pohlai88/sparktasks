/**
 * Policy Enforcement Integration Examples
 * Exact wiring points for production deployment
 */

import { enforcePolicy } from '../src/policy/engine';
import type { StorageDriver } from '../src/storage/types';

/**
 * Example 1: Invite Creation with Policy Enforcement
 * Wire point: src/invite/create.ts around line 30
 */
export async function createInviteWithPolicy(args: {
  keyring: any;
  code: string;
  ttlMs: number;
  ns: string;
  sign: (bytes: ArrayBuffer) => Promise<string>;
  signerPubB64u: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
  storage: StorageDriver; // Add storage for policy
}) {
  const { ns, signerPubB64u, role, storage } = args;

  // Get actor role for policy context
  const membershipState = await membershipApi.getMembership();
  const actorRole = membershipState.users[signerPubB64u];

  // 🔌 POLICY ENFORCEMENT - Wire before existing authorization
  await enforcePolicy(
    {
      op: 'invite.create',
      ns,
      actorId: signerPubB64u,
      actorRole,
      targetRole: role,
      nowISO: new Date().toISOString(),
    },
    storage,
    {
      audit: true, // Log all policy decisions
      commitCap: true, // Increment daily cap on allow
    }
  );

  // Continue with existing logic...
  if (membershipApi) {
    await membershipApi.assertPermission(signerPubB64u, 'INVITE_CREATE', {
      targetRole: role,
    });
  }
  // ... rest of createInvite function
}

/**
 * Example 2: Membership Addition with Policy Enforcement
 * Wire point: src/membership/api.ts around line 125
 */
export async function addMemberWithPolicy(
  issuer: string,
  user: string,
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER',
  storage: StorageDriver
) {
  const state = await getMembership();

  // Handle initial owner case first (before policy)
  if (state.owners.length === 0 && role === 'OWNER') {
    // Initial owner setup - skip policy for bootstrap
    // ... existing initial owner logic
    return;
  }

  // 🔌 POLICY ENFORCEMENT - Wire before assertPermission
  await enforcePolicy(
    {
      op: 'membership.add',
      ns: namespace,
      actorId: issuer,
      actorRole: state.users[issuer],
      targetRole: role,
      nowISO: new Date().toISOString(),
    },
    storage,
    {
      audit: true,
      commitCap: false, // No daily cap for membership changes
    }
  );

  // Continue with existing authorization
  await assertPermission(issuer, 'ROLE_SET');
  // ... rest of addMember function
}

/**
 * Example 3: Recovery Override Creation with Policy Enforcement
 * Wire point: src/recovery/override.create.ts around line 35
 */
export async function createRecoveryOverrideWithPolicy(opts: {
  ns: string;
  actorId: string;
  beneficiaryId: string;
  code: string;
  storage: StorageDriver;
}) {
  const { ns, actorId, beneficiaryId, storage } = opts;

  // Get membership context for policy
  const membership = await MembershipApi.getMembership();
  const actorRole = membership.users[actorId];
  const beneficiaryRole = membership.users[beneficiaryId];

  // 🔌 POLICY ENFORCEMENT - Wire before assertPermission
  await enforcePolicy(
    {
      op: 'override.create',
      ns,
      actorId,
      actorRole,
      targetRole: beneficiaryRole,
      nowISO: new Date().toISOString(),
    },
    storage,
    {
      audit: true,
      commitCap: true, // Track daily override creation
    }
  );

  // Continue with existing authorization
  await MembershipApi.assertPermission(actorId, 'RECOVERY_OVERRIDE_CREATE');
  // ... rest of createRecoveryOverride function
}

/**
 * Example 4: Device Unlink with Policy Enforcement
 * Wire point: src/revoke/unlink.ts around line 15
 */
export async function unlinkDeviceWithPolicy(args: {
  signerPubB64u: string;
  keyring: any;
  rotate?: boolean;
  storage: StorageDriver;
  // Need to add context
  ns: string;
  actorId: string;
}) {
  const { signerPubB64u, storage, ns, actorId } = args;

  // Get actor role for policy context
  const membershipState = await getMembership(); // Need to import from membership
  const actorRole = membershipState.users[actorId];

  // 🔌 POLICY ENFORCEMENT - Wire before revokeSigner
  await enforcePolicy(
    {
      op: 'device.unlink',
      ns,
      actorId,
      actorRole,
      nowISO: new Date().toISOString(),
    },
    storage,
    {
      audit: true,
      commitCap: false,
    }
  );

  // Continue with existing revocation
  await revokeSigner(signerPubB64u);
  // ... rest of unlinkDevice function
}

/**
 * Example 5: Safe Rollout with Observe Mode
 * Production deployment pattern
 */
export async function safeRolloutExample(
  operation: string,
  context: any,
  storage: StorageDriver
) {
  // Phase 1: Observe mode - log but don't enforce
  await enforcePolicy(context, storage, {
    observeMode: true, // 🔍 Safe observation
    audit: true,
  });

  // Phase 2: Gradual enforcement (environment-based)
  const enforceMode = process.env.POLICY_ENFORCE === '1';
  await enforcePolicy(context, storage, {
    observeMode: !enforceMode, // Conditional enforcement
    audit: true,
    commitCap: enforceMode,
  });
}

/**
 * Example 6: Error Handling Pattern
 * Proper error context for policy denials
 */
export async function operationWithPolicyErrorHandling(
  operation: string,
  context: any,
  storage: StorageDriver
) {
  try {
    await enforcePolicy(context, storage, { audit: true });

    // Continue with business logic...
    console.log(`✅ ${operation} authorized`);
  } catch (error) {
    if (error.message.includes('POLICY_DENIED')) {
      console.error(`🚫 Policy denied ${operation}: ${error.message}`);
      // Could emit custom metrics, notify admins, etc.
      throw new Error(`Operation denied by organization policy: ${operation}`);
    }
    throw error; // Re-throw non-policy errors
  }
}

/**
 * Example 7: Integration with Starter Policies
 * Bootstrap new organizations with sensible defaults
 */
export async function bootstrapOrganizationPolicies(
  ns: string,
  storage: StorageDriver,
  ownerActor: { id: string; role: 'OWNER' }
) {
  // Import policy functions
  const { createStarterPolicy, savePolicies } = await import(
    '../src/policy/engine'
  );

  // Create and deploy starter policy
  const starterPolicy = createStarterPolicy();
  starterPolicy.minEngine = '1.0.0';
  starterPolicy.rev = 1;

  await savePolicies(ns, storage, starterPolicy, ownerActor);

  console.log('✅ Organization bootstrapped with starter policies');
  console.log(`   • Prevented non-OWNERs from issuing OWNER invites`);
  console.log(`   • Set business hours enforcement for sensitive operations`);
  console.log(`   • Applied conservative daily caps`);
}

export {
  // Re-export for integration
  createInviteWithPolicy,
  addMemberWithPolicy,
  createRecoveryOverrideWithPolicy,
  unlinkDeviceWithPolicy,
  safeRolloutExample,
  operationWithPolicyErrorHandling,
  bootstrapOrganizationPolicies,
};
