/**
 * Device unlinking with optional DEK rotation
 */

import type { KeyringProvider } from '../crypto/keyring';
import type { Role } from '../membership/types';
import { enforcePolicy } from '../policy/engine';
import type { StorageDriver } from '../storage/types';

import { revokeSigner } from './registry';

export async function unlinkDevice(args: {
  ns: string;
  signerPubB64u: string;
  keyring: KeyringProvider;
  actorId: string;
  actorRole: Role;
  storage?: StorageDriver;
  rotate?: boolean;
}): Promise<{ rotated: boolean }> {
  const {
    ns,
    signerPubB64u,
    keyring,
    actorId,
    actorRole,
    storage,
    rotate = true,
  } = args;

  // Policy enforcement before revocation
  if (storage) {
    await enforcePolicy(
      {
        ns,
        op: 'device.unlink',
        actorId,
        actorRole,
        nowISO: new Date().toISOString(),
      },
      storage,
      { audit: true }
    );
  }

  // Revoke the signer
  await revokeSigner(signerPubB64u);

  // Optionally rotate DEK for future hardening
  let rotated = false;
  if (rotate) {
    await keyring.rotate();
    rotated = true;
  }

  return { rotated };
}
