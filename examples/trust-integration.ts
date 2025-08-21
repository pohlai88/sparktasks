/**
 * Trust Root Management Integration Example - Phase B Task 15B
 * Demonstrates how to integrate trust roots with existing Phase B infrastructure
 */

import type { StorageDriver } from '../src/storage/types';
import type { TrustConfig, TrustRoot } from '../src/trust/types';
import * as TrustEngine from '../src/trust/engine';
import * as MembershipApi from '../src/membership/api';

// Example: Initialize trust system for a new workspace
export async function initializeWorkspaceTrust(
  storage: StorageDriver,
  namespace: string,
  adminKeys: string[] // Legacy trusted admin keys
): Promise<void> {
  // Create trust roots from admin keys
  const initialRoots: TrustRoot[] = adminKeys.map((pubB64u, index) => ({
    id: `admin-${index}`,
    pubB64u,
    role: 'PRIMARY' as const,
    createdAt: Date.now(),
  }));

  // Configure trust system
  TrustEngine.configureTrust(storage, namespace);

  // Initialize with majority threshold
  const config: TrustConfig = {
    namespace,
    initialRoots,
    initialThreshold: Math.ceil(adminKeys.length / 2),
  };

  await TrustEngine.initializeTrust(config);
  console.log(
    `✅ Trust system initialized with ${adminKeys.length} roots, threshold: ${config.initialThreshold}`
  );
}

// Example: Migrate existing membership system to use trust roots
export async function migrateMembershipToTrustRoots(
  storage: StorageDriver,
  namespace: string,
  legacyAdmins: string[]
): Promise<void> {
  // Configure trust engine
  TrustEngine.configureTrust(storage, namespace);

  // Create migration signatures (in real scenario, these would be provided by admins)
  const migrationSignatures = legacyAdmins.map((pubB64u, index) => ({
    rootId: `legacy-${index}`,
    pubB64u,
    sigB64u: 'placeholder-signature', // Real signatures would be computed
    signedAt: Date.now(),
  }));

  // Perform migration
  const migration = await TrustEngine.migrateLegacyTrust(
    legacyAdmins,
    migrationSignatures
  );

  if (migration.completedAt) {
    console.log(
      `✅ Successfully migrated ${legacyAdmins.length} legacy admins to trust roots`
    );

    // Update membership API to use trust verification
    await updateMembershipTrustIntegration(storage, namespace);
  } else {
    console.log(`❌ Migration failed - insufficient signatures`);
  }
}

// Example: Integration with membership API
async function updateMembershipTrustIntegration(
  storage: StorageDriver,
  namespace: string
): Promise<void> {
  // Get current trust roots
  const activeTrustRoots = await TrustEngine.getActiveTrustRoots();
  const trustedKeys = activeTrustRoots.map(root => root.pubB64u);

  // Configure membership with trust-based validation
  MembershipApi.configureMembership(storage, namespace, trustedKeys);

  console.log(
    `🔗 Membership API updated to use ${trustedKeys.length} trusted root keys`
  );
}

// Example: Trust root rotation workflow
export async function rotateTrustRoot(
  oldRootId: string,
  newRootKey: string,
  reason: string = 'Scheduled key rotation'
): Promise<void> {
  const state = await TrustEngine.getTrustState();
  if (!state) {
    throw new Error('Trust system not initialized');
  }

  // Create new manifest with rotated root
  const updatedRoots = state.currentManifest.roots.map(root =>
    root.id === oldRootId
      ? {
          ...root,
          id: `${oldRootId}-rotated`,
          pubB64u: newRootKey,
          createdAt: Date.now(),
        }
      : root
  );

  const newManifest = {
    ...state.currentManifest,
    roots: updatedRoots,
    version: state.currentManifest.version + 1,
    createdAt: Date.now(),
    precedingHash: 'computed-hash', // Would be computed from previous manifest
  };

  // Create rotation operation
  const operation = await TrustEngine.createTrustOperation(
    'TRUST_ROOT_ROTATE',
    newManifest,
    reason
  );

  console.log(`🔄 Trust root rotation initiated: ${operation.id}`);
  console.log(`📝 Reason: ${reason}`);
  console.log(
    `⏳ Waiting for ${state.currentManifest.threshold} signatures...`
  );
}

// Example: Add new trust root (expansion)
export async function addTrustRoot(
  newRootKey: string,
  role: 'PRIMARY' | 'SECONDARY' | 'EMERGENCY' = 'SECONDARY',
  reason: string = 'Adding new trust root'
): Promise<void> {
  const state = await TrustEngine.getTrustState();
  if (!state) {
    throw new Error('Trust system not initialized');
  }

  // Create new root
  const newRoot: TrustRoot = {
    id: `root-${Date.now()}`,
    pubB64u: newRootKey,
    role,
    createdAt: Date.now(),
  };

  // Create updated manifest
  const newManifest = {
    ...state.currentManifest,
    roots: [...state.currentManifest.roots, newRoot],
    version: state.currentManifest.version + 1,
    createdAt: Date.now(),
    precedingHash: 'computed-hash', // Would be computed from previous manifest
  };

  // Create addition operation
  const operation = await TrustEngine.createTrustOperation(
    'TRUST_ROOT_ADD',
    newManifest,
    reason
  );

  console.log(`➕ New trust root addition initiated: ${operation.id}`);
  console.log(`🔑 Role: ${role}`);
  console.log(`📝 Reason: ${reason}`);
}

// Example: Emergency trust recovery
export async function emergencyTrustRecovery(
  emergencyKeys: string[],
  reason: string = 'Emergency trust recovery'
): Promise<void> {
  const state = await TrustEngine.getTrustState();
  if (!state) {
    throw new Error('Trust system not initialized');
  }

  // Create emergency roots
  const emergencyRoots: TrustRoot[] = emergencyKeys.map((pubB64u, index) => ({
    id: `emergency-${index}-${Date.now()}`,
    pubB64u,
    role: 'EMERGENCY' as const,
    createdAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hour expiry
  }));

  // Create emergency manifest with lower threshold
  const emergencyManifest = {
    ...state.currentManifest,
    roots: emergencyRoots,
    threshold: 1, // Emergency single-signature approval
    version: state.currentManifest.version + 1,
    createdAt: Date.now(),
    precedingHash: 'computed-hash',
  };

  // Create emergency operation
  const operation = await TrustEngine.createTrustOperation(
    'TRUST_EMERGENCY_OVERRIDE',
    emergencyManifest,
    reason
  );

  console.log(`🚨 Emergency trust recovery initiated: ${operation.id}`);
  console.log(`⚡ Emergency keys: ${emergencyKeys.length}`);
  console.log(`⏰ Emergency roots expire in 24 hours`);
  console.log(`📝 Reason: ${reason}`);
}

// Example: Trust verification in application logic
export async function verifyActionWithTrust(
  actorKey: string,
  action: string
): Promise<boolean> {
  const isTrusted = await TrustEngine.isTrustedKey(actorKey);

  if (isTrusted) {
    console.log(
      `✅ Action '${action}' authorized for trusted key: ${actorKey.slice(0, 16)}...`
    );
    return true;
  } else {
    console.log(
      `❌ Action '${action}' denied for untrusted key: ${actorKey.slice(0, 16)}...`
    );
    return false;
  }
}

// Example: Trust status monitoring
export async function getTrustStatus(): Promise<{
  initialized: boolean;
  activeRoots: number;
  threshold: number;
  pendingOperations: number;
}> {
  const state = await TrustEngine.getTrustState();

  if (!state) {
    return {
      initialized: false,
      activeRoots: 0,
      threshold: 0,
      pendingOperations: 0,
    };
  }

  const activeRoots = await TrustEngine.getActiveTrustRoots();

  return {
    initialized: true,
    activeRoots: activeRoots.length,
    threshold: state.currentManifest.threshold,
    pendingOperations: state.pendingOperations.length,
  };
}
