/**
 * Create invite for headless device onboarding with role binding
 */
import * as AuditApi from '../audit/api';
import { toB64u } from '../crypto/base64url';
import type { KeyringProvider } from '../crypto/keyring';
import { enforcePolicy } from '../policy/engine';
import type { StorageDriver } from '../storage/types';

import type { InviteEnvelope, InviteMeta, Role } from './types';

// Configuration dependencies for role authorization
let membershipApi: {
  assertPermission: (
    actor: string,
    action: 'INVITE_CREATE',
    context?: { targetRole?: Role }
  ) => Promise<void>;
  getMembership: () => Promise<{ users: Record<string, Role> }>;
} | null = null;

export function configureMembershipDependency(api: typeof membershipApi): void {
  membershipApi = api;
}

export async function createInvite(args: {
  keyring: KeyringProvider;
  code: string;
  ttlMs: number;
  ns: string;
  sign: (bytes: ArrayBuffer) => Promise<string>;
  signerPubB64u: string;
  role: Role; // NEW: target role to grant on accept
  storage?: StorageDriver; // NEW: for policy enforcement
  now?: () => Date;
}): Promise<{ envelope: InviteEnvelope; meta: InviteMeta }> {
  const {
    keyring,
    code,
    ttlMs,
    ns,
    sign,
    signerPubB64u,
    role,
    storage,
    now = () => new Date(),
  } = args;

  // Policy enforcement before authorization
  if (storage && membershipApi) {
    const membership = await membershipApi.getMembership();
    const issuerRole = membership.users[signerPubB64u];
    if (issuerRole) {
      await enforcePolicy(
        {
          ns,
          op: 'invite.create',
          actorId: signerPubB64u,
          actorRole: issuerRole,
          targetRole: role,
          nowISO: now().toISOString(),
        },
        storage,
        { audit: true, commitCap: true }
      );
    }
  }

  // Issue-time authorization: validate issuer can create invites for this role
  if (membershipApi) {
    await membershipApi.assertPermission(signerPubB64u, 'INVITE_CREATE', {
      targetRole: role,
    });
  }

  // Export backup from keyring
  const backup = await keyring.exportBackup();

  // Remove metadata to create a 'meta-less' bundle that won't trigger portable backup path
  const inviteBundle = {
    v: backup.v,
    createdAt: backup.createdAt,
    deks: backup.deks,
  };

  // Generate session key material
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iter = 100_000;
  const inviteId = crypto.randomUUID();
  const aad = `${ns}:${inviteId}`;

  // Derive session key via PBKDF2
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(code),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  const sessionKey = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: iter, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  // Encrypt backup with AES-GCM
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plaintext = new TextEncoder().encode(JSON.stringify(inviteBundle));
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, additionalData: new TextEncoder().encode(aad) },
    sessionKey,
    plaintext
  );

  // Combine IV + ciphertext
  const combined = new Uint8Array(12 + ciphertext.byteLength);
  combined.set(new Uint8Array(iv));
  combined.set(new Uint8Array(ciphertext), 12);

  const nowDate = now();
  const expDate = new Date(nowDate.getTime() + ttlMs);

  // Build manifest for signing (includes role)
  const manifest = {
    v: 1 as const,
    createdAt: nowDate.toISOString(),
    exp: expDate.toISOString(),
    saltB64u: toB64u(salt.buffer),
    iter,
    aad,
    ctB64u: toB64u(combined.buffer),
    role, // NEW: bound role in signed manifest
  };

  // Sign canonical JSON
  const canonical = JSON.stringify(manifest, Object.keys(manifest).sort());
  const signature = await sign(new TextEncoder().encode(canonical).buffer);

  const envelope: InviteEnvelope = {
    ...manifest,
    signerPubB64u,
    sigB64u: signature,
  };

  const meta: InviteMeta = { ns, inviteId };

  // Emit audit event for invite creation
  if (membershipApi) {
    AuditApi.log('INVITE_CREATED', { role, inviteId, ns }, signerPubB64u).catch(
      error => console.error('Audit log failed:', error)
    );
  }

  return { envelope, meta };
}
