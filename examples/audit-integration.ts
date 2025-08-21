/**
 * Audit Log Integration Example - Phase B Task 12
 * Demonstrates how to integrate audit logging into existing operations
 */

import * as AuditApi from '../src/audit/api';
import { MockStorage } from '../src/storage/types';

// Example: Integrating audit logging into recovery operations
export async function createRecoveryBundleWithAudit(
  storage: any,
  namespace: string,
  args: { issuerKID: string; recipientId: string; memo?: string }
): Promise<any> {
  // Configure audit logging
  AuditApi.configureAudit(storage, namespace);

  try {
    // Create the recovery bundle (placeholder)
    const bundle = {
      id: 'bundle_' + Date.now(),
      issuerKID: args.issuerKID,
      recipientId: args.recipientId,
      createdAt: new Date().toISOString(),
    };

    // Log the creation with redacted context
    await AuditApi.log(
      'RECOVERY_BUNDLE_CREATED',
      {
        bundleId: bundle.id,
        issuerKID: args.issuerKID,
        recipientId: args.recipientId,
        memo: args.memo,
      },
      args.issuerKID
    );

    return bundle;
  } catch (error) {
    // Log security-relevant errors
    await AuditApi.log(
      'ERROR',
      {
        operation: 'create_recovery_bundle',
        error: error instanceof Error ? error.message : 'Unknown error',
        issuerKID: args.issuerKID,
      },
      args.issuerKID
    );
    throw error;
  }
}

// Example: Recovery operation with audit logging
export async function recoverFromBundleWithAudit(
  storage: any,
  namespace: string,
  args: { bundleId: string; passcode: string; userId: string }
): Promise<any> {
  AuditApi.configureAudit(storage, namespace);

  try {
    // Simulate recovery validation
    if (args.passcode === 'wrong') {
      throw new Error('Invalid recovery passcode');
    }

    // Successful recovery
    const result = { recovered: true, keyCount: 5 };

    await AuditApi.log(
      'RECOVERY_USED',
      {
        bundleId: args.bundleId,
        userId: args.userId,
        keyCount: result.keyCount,
        success: true,
      },
      args.userId
    );

    return result;
  } catch (error) {
    // Log failed recovery attempts (security-relevant)
    await AuditApi.log(
      'ERROR',
      {
        operation: 'recover_from_bundle',
        bundleId: args.bundleId,
        error: error instanceof Error ? error.message : 'Unknown error',
        // Don't log the actual passcode!
        passcodeProvided: true,
      },
      args.userId
    );
    throw error;
  }
}

// Example: Device management with audit logging
export async function unlinkDeviceWithAudit(
  storage: any,
  namespace: string,
  args: { deviceId: string; reason: string; adminId: string }
): Promise<void> {
  AuditApi.configureAudit(storage, namespace);

  // Simulate device unlinking
  await new Promise(resolve => setTimeout(resolve, 100));

  await AuditApi.log(
    'DEVICE_UNLINKED',
    {
      deviceId: args.deviceId,
      reason: args.reason,
      timestamp: new Date().toISOString(),
    },
    args.adminId
  );
}

// Example: Sync operation with audit logging
export async function performSyncWithAudit(
  storage: any,
  namespace: string,
  args: { syncId: string; userId: string }
): Promise<void> {
  AuditApi.configureAudit(storage, namespace);

  // Simulate sync operation
  const startTime = Date.now();
  await new Promise(resolve => setTimeout(resolve, 50));
  const duration = Date.now() - startTime;

  await AuditApi.log(
    'SYNC_RUN',
    {
      syncId: args.syncId,
      duration,
      status: 'completed',
      timestamp: new Date().toISOString(),
    },
    args.userId
  );
}

// Example: Query audit log for security analysis
export async function getSecurityAuditReport(
  storage: any,
  namespace: string,
  since?: string
): Promise<{
  totalEvents: number;
  errorEvents: number;
  recoveryEvents: number;
  recentErrors: Array<{ type: string; timestamp: string; context: any }>;
}> {
  AuditApi.configureAudit(storage, namespace);

  // Export all audit entries
  const { items } = await AuditApi.exportAll();

  // Filter by time if provided
  const filteredItems = since ? items.filter(item => item.ts >= since) : items;

  // Analyze events
  const errorEvents = filteredItems.filter(item => item.type === 'ERROR');
  const recoveryEvents = filteredItems.filter(
    item =>
      item.type === 'RECOVERY_BUNDLE_CREATED' || item.type === 'RECOVERY_USED'
  );

  return {
    totalEvents: filteredItems.length,
    errorEvents: errorEvents.length,
    recoveryEvents: recoveryEvents.length,
    recentErrors: errorEvents.slice(-10).map(item => ({
      type: item.type,
      timestamp: item.ts,
      context: item.ctx,
    })),
  };
}
