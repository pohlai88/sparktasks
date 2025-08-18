/**
 * Accept invite for headless device onboarding with role enforcement
 */
import type { KeyringProvider } from '../crypto/keyring';
import type { InviteEnvelope, Role, InviteRoleConfig } from './types';
import type { BackupBundle } from '../crypto/keyringTypes';
import { fromB64u } from '../crypto/base64url';
import { isInviteRevoked, isSignerRevoked } from '../revoke/guard';
import * as AuditApi from '../audit/api';
import { enforcePolicy } from '../policy/engine';
import type { StorageDriver } from '../storage/types';

// Configuration dependencies for role enforcement
let membershipApi: {
  addMember: (issuer: string, user: string, role: Role) => Promise<void>;
  assertPermission: (actor: string, action: 'INVITE_CREATE', context?: { targetRole?: Role }) => Promise<void>;
} | null = null;

let roleConfig: InviteRoleConfig = {
  strictLegacy: false,
  verifyIssuerStillAuthorized: false
};

export function configureMembershipDependency(api: typeof membershipApi): void {
  membershipApi = api;
}

export function configureRolePolicy(config: InviteRoleConfig): void {
  roleConfig = { ...roleConfig, ...config };
}

export async function acceptInvite(args: {
  envelope: InviteEnvelope;
  code: string;
  keyring: KeyringProvider;
  verify: (bytes: ArrayBuffer, sig: string, pubB64u: string) => Promise<boolean>;
  isUsed: (inviteId: string) => Promise<boolean>;
  markUsed: (inviteId: string) => Promise<void>;
  actorId?: string;              // NEW: for membership application and audit
  storage?: StorageDriver;       // NEW: for policy enforcement
  now?: () => Date;
  skewMs?: number;
}): Promise<{ importedCount: number; rewrapped: boolean; appliedRole: Role }> {
  const { envelope, code, keyring, verify, isUsed, markUsed, actorId, storage, now = () => new Date(), skewMs = 300000 } = args;

  // Extract invite ID from AAD
  const inviteId = envelope.aad.split(':')[1];
  if (!inviteId) throw new Error('Invalid AAD format');

  // Policy enforcement for invite acceptance
  if (storage && actorId) {
    const envelopeRole = (envelope as any).role as Role | undefined;
    const targetRole = envelopeRole || 'MEMBER'; // Default for legacy invites
    const currentRole = 'VIEWER'; // Default role for invite recipients
    
    await enforcePolicy(
      { ns: envelope.aad.split(':')[0], op: 'invite.accept', actorId, actorRole: currentRole, targetRole, nowISO: now().toISOString() },
      storage, { audit: true, commitCap: true }
    );
  }

  // Check revocation status first (fail fast)
  if (await isInviteRevoked(inviteId)) throw new Error('Invite revoked');
  if (await isSignerRevoked(envelope.signerPubB64u)) throw new Error('Signer revoked');

  // Build canonical manifest for verification (with role if present)
  const { signerPubB64u, sigB64u, ...manifest } = envelope;
  const canonical = JSON.stringify(manifest, Object.keys(manifest).sort());

  // Verify Ed25519 signature
  const isValid = await verify(
    new TextEncoder().encode(canonical).buffer,
    sigB64u,
    signerPubB64u
  );
  if (!isValid) throw new Error('Invalid signature');

  // Check expiry with clock-skew tolerance
  const expTime = new Date(envelope.exp).getTime();
  const nowTime = now().getTime();
  if (expTime + skewMs <= nowTime) throw new Error('Invite expired');

  // Check one-time use
  if (await isUsed(inviteId)) throw new Error('Invite already used');

  // Extract bound role from envelope
  let boundRole: Role;
  const envelopeRole = (envelope as any).role as Role | undefined;
  
  if (envelopeRole) {
    boundRole = envelopeRole;
    
    // Optional: verify issuer still authorized for this role
    if (roleConfig.verifyIssuerStillAuthorized && membershipApi) {
      try {
        await membershipApi.assertPermission(envelope.signerPubB64u, 'INVITE_CREATE', { targetRole: boundRole });
      } catch {
        throw new Error(`Issuer no longer authorized to issue ${boundRole} invites`);
      }
    }
  } else {
    // Legacy invite handling
    if (roleConfig.strictLegacy) {
      throw new Error('Legacy invites not allowed in strict mode');
    }
    boundRole = 'MEMBER'; // Default for legacy invites
  }

  // Derive session key
  const salt = fromB64u(envelope.saltB64u);
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(code),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  const sessionKey = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: envelope.iter, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  // Decrypt backup (constant-time via GCM tag verification)
  const combined = fromB64u(envelope.ctB64u);
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);

  let plaintext: ArrayBuffer;
  try {
    plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv, additionalData: new TextEncoder().encode(envelope.aad) },
      sessionKey,
      ciphertext
    );
  } catch {
    throw new Error('Invalid code or corrupted invite');
  }

  // Parse and import backup
  const backupJson = new TextDecoder().decode(plaintext);
  const backup: BackupBundle = JSON.parse(backupJson);

  await keyring.importBackup(backup);
  await markUsed(inviteId);

  // Apply membership role
  if (membershipApi && actorId) {
    await membershipApi.addMember(envelope.signerPubB64u, actorId, boundRole);
    
    // Emit audit event for invite acceptance
    AuditApi.log('INVITE_ACCEPTED', { role: boundRole, inviteId, userId: actorId }, actorId).catch(err => console.error('Audit log failed:', err));
  }

  return {
    importedCount: backup.deks.length,
    rewrapped: true,
    appliedRole: boundRole
  };
}
